define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('EmrPemeriksaanFisikCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state','CacheHelper', '$window','$location', 'ModelItem',
        function($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $window, $location, ModelItem) {

         
            $scope.item = {};
            $scope.dataVOloaded = false;
            $scope.now = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty =1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan= true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false        
            var dokter = '';
            var idUser = '';
            var data2 = [];
            $scope.PegawaiLogin2 ={};
            var namaRuangan = ''
            var namaRuanganFk = ''            
            var detail = ''
            var norec_emr='';
            var data2 = []
            var isianColor = "white"
            var kdColorKaries = "#B8B7B7" 
            var kdColorTambalanLogam = "#F544ED" 
            var kdColorTambalanNonLogam = "#82D9D9" 
            var kdColorMahkotaLogam = "#014C0A" 
            var kdColorMahkotaNonLogam = "#40F5F9"
            var typeIsian = ""
            var nomorEMR = ''
            $scope.cc ={}
            $scope.tombolSimpanVis = true
            $scope.item.obj=[]
            var dataLoad = []
            LoadForm();
            LoadCache()
            FormLoad()
            function LoadCache(){
                nomorEMR = '-'
                var chacePeriode = cacheHelper.get('cacheNomorEMR');
                if(chacePeriode != undefined){
                    nomorEMR = chacePeriode[0]
                } 
            }

            function FormLoad(){
                var chacePeriode = cacheHelper.get('cacheHeader');
                if(chacePeriode != undefined){
                      $scope.cc.nocm = chacePeriode.nocm
                      $scope.cc.namapasien = chacePeriode.namapasien;
                      $scope.cc.jeniskelamin = chacePeriode.jeniskelamin;
                      $scope.cc.tgllahir = moment(chacePeriode.tgllahir).format('YYYY-MM-DD');
                      $scope.cc.umur = chacePeriode.umur;
                      $scope.cc.alamatlengkap = chacePeriode.alamatlengkap;
                      $scope.cc.notelepon = chacePeriode.notelepon;
                      if (nomorEMR == '') {
                         $scope.cc.norec_emr = ''
                      }else{
                         $scope.cc.norec_emr = nomorEMR       
                      }
                }
            }
            

            function LoadForm(){
                medifirstService.get('emr/get-data-combo-emr',true).then(function(data){
                    var data_KodeGambar = data.data.kodegambar;
                    for (var i = 0; i < data_KodeGambar.length; i++) {
                        data_KodeGambar[i].no = i + 1
                    }
                    $scope.dataKodeGambar = new kendo.data.DataSource({
                        data: data_KodeGambar,
                        group: $scope.groups,
                        pageSize: 15,
                        total: data_KodeGambar.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });                              
            }

            if (nomorEMR == '-') {
                medifirstService.get("emr/get-rekam-medis-dynamic?emrid=30").then(function (e) {
                    $scope.listData = e.data
                    $scope.item.title = e.data.title
                    $scope.item.classgrid = e.data.classgrid
                    
                    $scope.cc.emrfk = 30
                    $scope.item.objcbo = []
                    for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                        if (e.data.kolom1[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom1[i].id,e.data.kolom1[i].cbotable, true, true, 20).then(function(data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom1[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom1[i].child[ii].id,e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    
                    for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                        if (e.data.kolom2[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom2[i].id,e.data.kolom2[i].cbotable, true, true, 20).then(function(data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom2[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom2[i].child[ii].id,e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                        if (e.data.kolom3[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom3[i].id,e.data.kolom3[i].cbotable, true, true, 20).then(function(data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom3[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom3[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom3[i].child[ii].id,e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    for (var i = e.data.kolom4.length - 1; i >= 0; i--) {
                        if (e.data.kolom4[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom4[i].id,e.data.kolom4[i].cbotable, true, true, 20).then(function(data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom4[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom4[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom4[i].child[ii].id,e.data.kolom4[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    
                })
            }else{
                var chekedd = false
                // ManagePhp.getData("rekam-medis/get-emr-transaksi-detail?noemr="+$state.params.nomorEMR, true).then(function(dat){
                    medifirstService.get("emr/get-rekam-medis-dynamic?emrid=30").then(function (e) {
                        $scope.listData = e.data
                        $scope.item.title = e.data.title
                        $scope.item.classgrid = e.data.classgrid
                        
                        $scope.cc.emrfk = 30

                        $scope.item.objcbo = []
                        for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                            if (e.data.kolom1[i].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom1[i].id,e.data.kolom1[i].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                            for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                                if (e.data.kolom1[i].child[ii].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom1[i].child[ii].id,e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                            }
                        }
                        for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                            if (e.data.kolom2[i].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom2[i].id,e.data.kolom2[i].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                            for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                                if (e.data.kolom2[i].child[ii].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom2[i].child[ii].id,e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                            }
                        }
                        for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                            if (e.data.kolom3[i].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom3[i].id,e.data.kolom3[i].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                            for (var ii = e.data.kolom3[i].child.length - 1; ii >= 0; ii--) {
                                if (e.data.kolom3[i].child[ii].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom3[i].child[ii].id,e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                            }
                        }
                        for (var i = e.data.kolom4.length - 1; i >= 0; i--) {
                            if (e.data.kolom4[i].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom4[i].id,e.data.kolom4[i].cbotable, true, true, 20).then(function(data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                            for (var ii = e.data.kolom4[i].child.length - 1; ii >= 0; ii--) {
                                if (e.data.kolom4[i].child[ii].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom4[i].child[ii].id,e.data.kolom4[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                            }
                        }
                        medifirstService.get("emr/get-emr-transaksi-detail?noemr="+nomorEMR+"&emrfk="+$scope.cc.emrfk, true).then(function(dat){
                            $scope.item.obj = []
                            $scope.item.obj2 = []
                            dataLoad = dat.data.data
                            for (var i = 0; i <= dataLoad.length - 1; i++) {
                                if (parseFloat($scope.cc.emrfk)  == dataLoad[i].emrfk) {
                                    if(dataLoad[i].type == "textbox") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    }
                                    if(dataLoad[i].type == "checkbox") {
                                        chekedd = false
                                        if (dataLoad[i].value == '1') {
                                            chekedd = true
                                        }
                                        $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                    }

                                    if(dataLoad[i].type == "datetime") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    }
                                    if(dataLoad[i].type == "time") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    }
                                    if(dataLoad[i].type == "date") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    }

                                    if(dataLoad[i].type == "checkboxtextbox") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                        $scope.item.obj2[dataLoad[i].emrdfk] = true
                                    }
                                    if(dataLoad[i].type == "textarea") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    }
                                    if(dataLoad[i].type == "combobox") {
                                        var str = dataLoad[i].value
                                        var res = str.split("~");
                                        // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                        $scope.item.obj[dataLoad[i].emrdfk] = {value:res[0],text:res[1]}

                                    }
                                }
                                
                            }
                        })

                    
                });
            }
            
            $scope.groups = {
                field: "group",
                aggregates: [
                    {
                        field: "group",
                        aggregate: "count"
                    }]
            };

            $scope.aggregate = [
                {
                    field: "group",
                    aggregate: "count"
                }
            ]

            $scope.ColumnGridKodeGambar  = {
                sortable: true,
                selectable: "row",
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "45px",
                    // },
                    {
                        "field": "kodegambar",
                        "title": "Kode Gambar",
                        "width": "180px"
                    }
                ]
            }
          
            
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({id:arrobj[i],values:$scope.item.obj[parseInt(arrobj[i])]})
                }
                $scope.cc.jenisemr = 'igd'
                
                var jsonSave = {
                    head : $scope.cc,
                    data : arrSave//$scope.item.obj
                }
                medifirstService.post('emr/save-emr-dinamis',jsonSave).then(function (e) {
                  
                    $rootScope.loadRiwayat()
                    var arrStr = {
                            0: e.data.data.noemr 
                        }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

             

//***********************************

}
]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1