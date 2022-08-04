// define(['initialize', 'Configuration'], function(initialize, configuration) {
//     'use strict';
//     initialize.controller('KendaliDokumenRekamMedisRevCtrl', ['$q', '$scope', 'MedifirstService', 'ModelItem', '$state', '$rootScope', '$timeout', '$window', 'ManagePasien', 'FindPasien', 'DateHelper', 'CetakHelper', 'ModelItem',
//         function($q, $scope,medifirstService, modelItem, $state, $rootScope, $timeout, $window, managePasien, findPasien, dateHelper, cetakHelper, ModelItem) {
define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('KendaliDokumenRekamMedisRevCtrl', ['$q', '$scope', 'ModelItem', 'MedifirstService',
        function ($q, $scope, ModelItem,medifirstService) {            
            $scope.title = "Kendali Dokumen Rekam Medis";
            $scope.subTitleKiri = "Registrasi";
            $scope.now = new Date();
            $scope.items = {
                start: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                end: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
            }

            $scope.dataItem={};
            $scope.isRouteLoading=false;
            $scope.item={};
            $scope.editable = true;
            // postRensarPRM();
            // function postRensarPRM() {
            //     $q.all([
            //          medifirstService.post('rensar/post-pengembalian-dok-rm'),
            //     ]).then(function (res) {
            //     })
            // }
            // ModelItem.getDataDummyGeneric("StatusKendaliDokumen").then(function(data){
            // // $scope.listStatus = data
            // // $scope.dataItem.statusKendaliDokumen={id:$scope.listStatus[2].id,name:$scope.listStatus[2].name}
            // })
                $scope.tglKembaliSkrg = new Date();
          

            $scope.reloadGridKendali = function(noRm){
                findPasien.getDaftarKendali(noRm, '', '', '', '').then(function(e){
                    $scope.gridDaftarKendali =  new kendo.data.DataSource({
                        data: e.data.data.data,
                        pageable: true,
                        pagesize: 20,
                        schema: {
                            model: {
                                id: "noRec",
                                fields: {
                                    noRec: {editable: false},
                                    statusEnabled: {editable: false, defaultValue: true},
                                    keUnit: {type: "string", validation: { required: true }},
                                    dariUnit: {type: "string", validation: { required: true }},
                                    tglUpdate: {validation: { required: true }},
                                    kdProfile: {type: "number", editable: false, defaultValue: 0},
                                    statusKendaliDokumen: {validation: { required: true }},
                                    pasienId: {editable: false, type: "number", validation: { required: true }},
                                    tglKembali: {nullable: true }
                                }
                            }
                        }
                    })
                })
            }
         
            $scope.findBynoCM = function(){

                loadData()
               //   $scope.cboDiagnosa=false;
               //   $scope.cboDiagnosa1=false;
               // $scope.cboInputDiagnosa = true;
            }

            $scope.terimaLangsung = function() {
                var tglAwal = moment($scope.items.start).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.items.end).format('YYYY-MM-DD 23:59');
                debugger;
                medifirstService.get("registrasi/dokumenrm/get-data-kendali?+nocm=" + $scope.noCm +
                "&tglAwal=" + tglAwal +
                "&tglAkhir=" + tglAkhir, false).then(function(data) {
                var datakendali = data.data.datakendali
                 
                    if(datakendali.length == 0){
                        $scope.dataItem = {
                            tglUpdate:$scope.now,
                            ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                            statusKendaliDokumen:{id:$scope.listStatus[0].id,name:$scope.listStatus[0].name},
                            noregistrasifk:{noregistrasifk:datakendali[0].noregistrasifk}
                        }
                    }else{
                        if ($scope.item.dikirim ==true){
                            $scope.dataItem= {
                                tglUpdate:$scope.now,
                                ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                                ruangan1:{id:datakendali[0].kdruangan,namaruangan:datakendali[0].ruangdaftar},
                                statusKendaliDokumen:{id:$scope.listStatus[0].id,name:$scope.listStatus[0].name},
                                noregistrasifk:{noregistrasifk:datakendali[0].noregistrasifk}
                            }
                        }else{
                            $scope.dataItem= {
                            tglUpdate:$scope.now,
                            ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                            ruangan1:{id:datakendali[0].kdruangan,namaruangan:datakendali[0].ruangdaftar},
                            statusKendaliDokumen:{id:$scope.listStatus[2].id,name:$scope.listStatus[2].name},
                            noregistrasifk:{noregistrasifk:datakendali[0].noregistrasifk}
                        }
                        }

                    }

                     
                    $scope.tambahDataLangsung($scope.dataItem);
            })
                
        }

            function loadData(){

                $scope.isRouteLoading=true;
                var noCm =""
                if ( $scope.noCm != undefined){
                    var noCm ="noCm=" + $scope.noCm
                }
                
                 medifirstService.get("registrasi/dokumenrm/get-data-combo-kdrm?"
                        + noCm).then(function(data) {
                    $scope.listRuangan = data.data.ruangan;
                    $scope.listRuangan2 = data.data.ruangan;
                    $scope.listRuangan3 = data.data.ruangan;                    
                    $scope.listRuangan1 = data.data.ruangan;
                    $scope.listStatus = data.data.dataStatusKendali
                })
                // var noReg =""
                // if ($scope.item.noRegistrasi != undefined){
                //     var noReg ="noReg=" +$item.noRegistrasi
                // }   

                $q.all([
                    medifirstService.get("registrasi/dokumenrm/get-pasien-by-nocm?"
                       +noCm),
                    ]).then(function(e) {
                      
                        // var datas = e[0].data.datas;
                        var datas = e[0].data;
                        $scope.item.namaPasien = datas.namapasien;
                        $scope.item.tempatLahir = datas.tempatlahir;
                        $scope.item.tglLahir = datas.tgllahir;
                        $scope.item.alamatLengkap = datas.alamatlengkap;
                        $scope.item.noTelepon = datas.notelepon;
                        $scope.item.namaKeluarga = datas.namakeluarga;
                        $scope.item.namaIbu = datas.namaibu;
                        $scope.item.tlp=datas.nohp
                        $scope.noCMFK = datas.nocmfk;
                        getPasienDaftar();
                        getDaftarKendaliDok();
                                            
                    });
                    function getPasienDaftar(){
                         var nocmfk="nocmfk="+ $scope.noCMFK;
                             medifirstService.get("registrasi/dokumenrm/get-daftar-registrasi?"
                               +nocmfk).then(function(dat) {                           
                                $scope.listRegis = new kendo.data.DataSource({
                                    data: dat.data.data2,
                                    pagesize: 5,
                                });

                        });
                    }
                      function getDaftarKendaliDok(){
                        var nocmfk="nocmfk="+ $scope.noCMFK;
                        medifirstService.get("registrasi/dokumenrm/get-daftar-kendali-dokumen?"
                                + nocmfk).then(function(datz) {    
                                 $scope.isRouteLoading=false;                       
                                $scope.gridDaftarKendali = new kendo.data.DataSource({
                                    data: datz.data.data,
                                    pagesize:5,
                                });

                        });
                               $scope.getdataKdrm= $scope.gridDaftarKendali;
                    }
                };
                $scope.gridDaftarRegistrasis = [
                {
                    field: "noregistrasi",
                    title: "No. Registrasi",
                    width: "100px"
                }, 
                {
                    field: "tglregistrasi", 
                    title: "Tgl Registrasi",
                     width: "100px",
                     template: "#if (tglregistrasi) {# #= new moment(tglregistrasi).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                }, 
                {
                    field: "namaruangan",
                    title: "Ruangan Pelayanan",
                    // aggregates: ["count"],
                    // groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)",
               
                }
               
            ];
          
            $scope.findRekap = function(){

                $scope.isRouteLoading=true;
                var tglAwal = moment($scope.items.start).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.items.end).format('YYYY-MM-DD 23:59:59');

                var cm =""
                if ($scope.items.noCm != undefined){
                    var cm ="&noCm=" +$scope.items.noCm
                }   
                var ruangan =""
                if ($scope.items.ruangan != undefined){
                    var ruangan ="&unit=" +$scope.items.ruangan
                }
                var statusId =""
                if ($scope.items.status != undefined){
                    var statusId ="&statusId=" +$scope.items.status.id
                }

               medifirstService.get("registrasi/dokumenrm/get-daftar-kendali-dokumen?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    cm + ruangan + statusId).then(function(datazz) {
                        $scope.isRouteLoading=false;
                        $scope.gridDaftarKendali = new kendo.data.DataSource({
                                    //data: datzz.data.data, //salah variable na lain datazz malah datzz
                                    data: datazz.data.data,
                                    pagesize:5,
                                });

                        // $scope.gridDaftarKendali = datazz.data.data;
                   
                    });

            
                // var noCm = $scope.items.noCm,
                //     start = $scope.items.start,
                //     end = $scope.items.end,
                //     ruangan = $scope.items.ruangan,
                //     status = $scope.items.status;

                // if (!noCm) {
                //    noCm = ''
                // }
                // if (!start) {
                //    start = ''
                // } else {
                //     start = dateHelper.formatDate(start, 'YYYY-MM-DD HH:mm')
                // }
                // if (!end) {
                //    end = ''
                // } else {
                //     end = dateHelper.formatDate(end, 'YYYY-MM-DD HH:mm')
                // }
                // if (!ruangan) {
                //     ruangan = ''
                // }
                // if (!status) {
                //     status = ''
                // } else {
                //     status = status.id 
                // }
                // findPasien.getDaftarKendali(noCm, start, end, ruangan, status).then(function(e){
                //     $scope.gridDaftarKendali =  new kendo.data.DataSource({
                //         data: e.data.data.data,
                //         pageable: true,
                //         pagesize: 20,
                //         schema: {
                //             model: {
                //                 id: "noRec",
                //                 fields: {
                //                     noRec: {editable: false},
                //                     statusEnabled: {editable: false, defaultValue: true},
                //                     keUnit: {type: "string", validation: { required: true }},
                //                     dariUnit: {type: "string", validation: { required: true }},
                //                     tglUpdate: {validation: { required: true }},
                //                     kdProfile: {type: "number", editable: false, defaultValue: 0},
                //                     statusKendaliDokumen: {validation: { required: true }},
                //                     pasienId: {editable: false, type: "number", validation: { required: true }},
                //                     tglKembali: {nullable: true }
                //                 }
                //             }
                //         }
                //     })
                // })
                // $scope.editable = false;
            }

            $scope.gridKendaliDokRM = {
                dataSource:$scope.gridDaftarKendali,
                pageable: true,
                selectable: "row",
                save: function(e){
                    var tglUpdate = e.model.tglupdate,
                        tglKembali = $scope.tglKembaliSkrg;
                    var data = {
                        "norec_kdr": e.model.norec_kdr,
                        "keunit": $scope.item.keUnit,
                        "dariunit": $scope.item.dariUnit,
                        "tglupdate":  moment(tglUpdate).format('YYYY-MM-DD HH:mm:ss'),
                        // "statusEnabled":e.model.statusEnabled,
                        // "kdProfile": e.model.kdProfile,
                        "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                        "nocmfk": e.model.nocmfk,
                        "tglkembali": moment(tglKembali).format('YYYY-MM-DD HH:mm:ss'),
                    };
                 
                    // manageSarprasPhp.saveKendaliDokumenRm(data).then(function(e){
                    //         $scope.findBynoCM(); 
                    //     // if (e.data.data.norec){
                    //     //      
                    //     //     $scope.reloadGridKendali($scope.currentRm);   
                    //     // }
                    //     // delete $scope.dataItem;
                    //     // $scope.winDialog.close();
                    // })
                },
                columns: [{
                    "field": "tglkeluar",
                    "title": "Tgl/Jam Keluar",
                    // "template": "#= kendo.toString(new Date(tglkeluar), 'dd-MM-yyyy HH:mm') #",
                    "width": 120
                }, 
                {
                    "field": "nocm",
                    "title": "No. MR",
                  
                }, 
                // {
                //     "field": "dariunit",
                //     "title": "Unit Asal"
                // }, 
                // {
                //     "field": "keunit",
                //     "title": "Unit Tujuan"
                // }, 
                {
                    "field": "ruanganasal",
                    "title": "Unit Asal",
                    "width": 100
                }, 
                {
                    "field": "ruangantujuan",
                    "title": "Unit Tujuan",
                    "width": 100
                },
                {
                    "field": "catatan",
                    "title": "Catatan",
                    "width": 150
                },
                {
                    "field": "name",
                    "title": "Status",
                    // "template": '# if( name==null) {# - # } else {# #= statusKendaliDokumen.name # #} #'
                }, {
                    "field": "kembali",
                    "title": "Kembali",
                    // "template": '# if( tglKembali==null) {#<span class="center">Belum<span># } else {#<span class="center">Sudah<span>#} #'
                }, {
                    "field": "tglkembali",
                    "title": "Tgl/Jam Kembali",
                    // "template": '# if( tglkembali==null) {#<span class="center">-<span># } else {#<span>#= kendo.toString(new Date(tglkembali), "dd-MM-yyyy HH:mm") #<span>#} #',
                    "width": 120
                },

                // }, { 
                //     command: { text: "Edit", click: editGrid },

                //     // "command": ["edit"],
                //     title: " ",
                //     width: "80px" 
                // }],
                ],
                toolbar: [
                {
                    "name": "add",
                    "text": "Tambah Kendali",
                    "template": '<a ng-click="onClick()" class="k-button k-button-icontext k-grid-upload">Tambah Kendali</a>'	
                },
                 {
                    "name": "edit",
                    "text": "Edit",
                    "template": '<a ng-click="editGrid()" class="k-button k-button-icontext k-grid-upload">Edit Kendali</a>'   
                }
                ],
                editable: {
                    mode: "popup",
                    window: {
                        title: "Update Data Kendali Dokumen",
                        // resizable: true,
                        // modal: false,
                        // draggable: true,
                        // visible: true
                    },
                    // template: kendo.template($("#popup_editor").html())
                }
            }

            $scope.gridKirimTerimaDokumen = {
                dataSource:$scope.gridKirimTerimaDokumen,
                pageable: true,
                selectable: "row",
                
                columns: [
                // {
                //     "field": "tglkeluar",
                //     "title": "Dari Unit",
                //     // "template": "#= kendo.toString(new Date(tglkeluar), 'dd-MM-yyyy HH:mm') #",
                //     "width": 1
                // }, 
                {
                    "field": "nocm",
                    "title": "Ke Unit",
                    "width":100
                  
                },  
                // {
                //     "field": "ruanganasal",
                //     "title": "Status",
                //     "width": 70
                // }, 
                // {
                //     "field": "ruangantujuan",
                //     "title": "Tanggal Kirim",
                //     "width": 100
                // },
                // {
                //     "field": "catatan",
                //     "title": "Tanggal Kembali",
                //     "width": 150
                // },
                

                {
                    "command": [{
                        text: "Ubah",
                        // click: editGrid,
                        imageClass: "k-icon k-update"
                    }],
                    title: "",
                    width: "5%",
                }
                ],
                
            }
 
            $scope.editGrid=function(){
                    if ($scope.current==undefined){
                        window.messageContainer.error("Pilih data dulu")
                        return
                    }
                    else
                    {
                        medifirstService.get("registrasi/dokumenrm/get-data?+norec=" + $scope.current.norec_kdr, false).then(function (data) {
                        var datakendali = data.data.datakendali[0]

                            $scope.item.dariUnit=$scope.current.dariunit;
                            $scope.item.keUnit=$scope.current.keunit;
                            // $scope.item.statusKendaliDokumen= {id:datakendali.objectstatuskendalidokumenfk, name:datakendali.name}
                            $scope.item.statusKendaliDokumen={id:$scope.listStatus[6].id,name:$scope.listStatus[6].name};
                            $scope.item.ruangan2={id:datakendali.objectruanganasalfk, namaruangan:datakendali.ruanganasal}
                            $scope.item.ruangan3={id:datakendali.objectruangantujuanfk, namaruangan:datakendali.ruangantujuan}
                            $scope.item.Catatan = datakendali.catatan
                            $scope.tglJamSkrg = new Date();                                
                        })
                      
                      $scope.popup_editor.center().open(); 
                    }

           }
           $scope.editGrid2=function(){      
                        medifirstService.get("registrasi/dokumenrm/get-data?+nocm="+$scope.noCm, false).then(function(data) {
                            var datakendali = data.data.datakendali[0]

                            $scope.item.dariUnit=datakendali.ruanganasal;
                            $scope.item.keUnit=data.ruangantujuan;
                            // $scope.item.statusKendaliDokumen= {id:datakendali.objectstatuskendalidokumenfk, name:datakendali.name}
                            $scope.item.statusKendaliDokumen={id:3,name:"DITERIMA"};
                            $scope.item.ruangan2={id:datakendali.objectruanganasalfk, namaruangan:datakendali.ruanganasal}
                            $scope.item.ruangan3={id:datakendali.objectruangantujuanfk, namaruangan:datakendali.ruangantujuan}
                            $scope.item.Catatan = datakendali.catatan;
                            $scope.nocmfk= datakendali.nocmfk;
                            $scope.tglJamSkrg = new Date();                                
                        })
                      
                      // $scope.popup_editor.center().open(); 
                    $scope.update2();

           }
            $scope.update2 = function() {
                 
                    // var tglUpdate = $scope.current.tglupdate;

                    var catatan="-";
                    if ($scope.item.Catatan != undefined) {
                        catatan=$scope.item.Catatan;
                    } 

                    var nocmfk=''
                    if ($scope.noCMFK!=undefined)
                        nocmfk=$scope.noCMFK;
                    else
                        nocmfk='';

                    var tglkembali=null;
                    if ($scope.item.statusKendaliDokumen.name == "DITERIMA") {
                         tglkembali=moment($scope.item.tglKembaliSkrg).format('YYYY-MM-DD HH:mm');
                    }
                    

                    var tglkeluar=null;
                    if ($scope.item.statusKendaliDokumen.name != "DITERIMA") {
                        tglkeluar=moment($scope.item.tglKembaliSkrg).format('YYYY-MM-DD HH:mm');
                    }    
                    if ($scope.current==undefined ){
                            var data = {
                            "norec_kdr": "1",
                            "keunit": $scope.item.keUnit,
                            "dariunit": $scope.item.dariUnit,
                            "tglupdate":  moment($scope.tglJamSkrg).format('YYYY-MM-DD HH:mm:ss'),
                            "objectruanganasalfk": $scope.item.ruangan2.id,
                            "objectruangantujuanfk": $scope.item.ruangan3.id,
                            // "statusEnabled":e.model.statusEnabled,
                            // "kdProfile": e.model.kdProfile,
                            "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                            "nocmfk": $scope.nocmfk,
                            "tglkembali": tglkembali,
                            "catatan": catatan
                            // "tglkeluar": tglkeluar
                        };
                    }else{
                        if($scope.item.statusKendaliDokumen.name == "DITERIMA"){
                                var data = {
                                "norec_kdr": $scope.current.norec_kdr,
                                "keunit": $scope.item.keUnit,
                                "dariunit": $scope.item.dariUnit,
                                "tglupdate":  moment($scope.tglJamSkrg).format('YYYY-MM-DD HH:mm:ss'),
                                "objectruanganasalfk": $scope.item.ruangan2.id,
                                "objectruangantujuanfk": $scope.item.ruangan3.id,
                                // "statusEnabled":e.model.statusEnabled,
                                // "kdProfile": e.model.kdProfile,
                                "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                                "nocmfk": $scope.current.nocmfk,
                                "tglkembali": tglkembali,
                                "catatan": catatan
                                // "tglkeluar": tglkeluar
                            };
                        }else if($scope.item.statusKendaliDokumen.name != "DITERIMA"){
                            var data = {
                                "norec_kdr": $scope.current.norec_kdr,
                                "keunit": $scope.item.keUnit,
                                "dariunit": $scope.item.dariUnit,
                                "tglupdate":  moment($scope.tglJamSkrg).format('YYYY-MM-DD HH:mm:ss'),
                                "objectruanganasalfk": $scope.item.ruangan2.id,
                                "objectruangantujuanfk": $scope.item.ruangan3.id,
                                // "statusEnabled":e.model.statusEnabled,
                                // "kdProfile": e.model.kdProfile,
                                "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                                "nocmfk": $scope.current.nocmfk,
                                "tglkembali": tglkembali,
                                "tglkeluar": tglkeluar,
                                "catatan": catatan
                            };
                        }

                    }
                    
                 
                    // manageSarprasPhp.saveKendaliDokumenRm(data).then(function(e){
                    //        $scope.noCm="";
                   medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen',data).then(function (e) {
                            $scope.findBynoCM(); 
                        // if (e.data.data.norec){
                        //      
                        //     $scope.reloadGridKendali($scope.currentRm);   
                        // }
                        // delete $scope.dataItem;
                        // $scope.winDialog.close();
                    })
              
                    $scope.popup_editor.close();
            }
            $scope.update = function() {
                 
                    // var tglUpdate = $scope.current.tglupdate;

                    var catatan="-";
                    if ($scope.item.Catatan != undefined) {
                        catatan=$scope.item.Catatan;
                    } 

                    var nocmfk=''
                    if ($scope.noCMFK!=undefined)
                        nocmfk=$scope.noCMFK;
                    else
                        nocmfk='';

                    var tglkembali=null;
                    // if ($scope.item.statusKendaliDokumen.name == "DITERIMA") {
                    //      tglkembali=moment($scope.item.tglKembaliSkrg).format('YYYY-MM-DD HH:mm');
                    // }

                    if ($scope.tglKembaliSkrg != undefined){
                         tglkembali=moment($scope.tglKembaliSkrg).format('YYYY-MM-DD HH:mm');   
                    }

                    var tglkeluar=null;
                    if ($scope.item.statusKendaliDokumen.name != "DITERIMA") {
                        tglkeluar=moment($scope.item.tglKembaliSkrg).format('YYYY-MM-DD HH:mm');
                    }    
                    if ($scope.current==undefined ){
                            var data = {
                            "norec_kdr": "1",
                            "keunit": $scope.item.keUnit,
                            "dariunit": $scope.item.dariUnit,
                            "tglupdate":  moment($scope.tglJamSkrg).format('YYYY-MM-DD HH:mm:ss'),
                            "objectruanganasalfk": $scope.item.ruangan2.id,
                            "objectruangantujuanfk": $scope.item.ruangan3.id,
                            // "statusEnabled":e.model.statusEnabled,
                            // "kdProfile": e.model.kdProfile,
                            "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                            "nocmfk": $scope.nocmfk,
                            "tglkembali": tglkembali,
                            "catatan": catatan
                            // "tglkeluar": tglkeluar
                        };
                    }else{
                        if($scope.item.statusKendaliDokumen.name == "DITERIMA"){
                                var data = {
                                "norec_kdr": $scope.current.norec_kdr,
                                "keunit": $scope.item.keUnit,
                                "dariunit": $scope.item.dariUnit,
                                "tglupdate":  moment($scope.tglJamSkrg).format('YYYY-MM-DD HH:mm:ss'),
                                "objectruanganasalfk": $scope.item.ruangan2.id,
                                "objectruangantujuanfk": $scope.item.ruangan3.id,
                                // "statusEnabled":e.model.statusEnabled,
                                // "kdProfile": e.model.kdProfile,
                                "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                                "nocmfk": $scope.current.nocmfk,
                                "tglkembali": tglkembali,
                                "catatan": catatan
                                // "tglkeluar": tglkeluar
                            };
                        }else if($scope.item.statusKendaliDokumen.name != "DITERIMA"){
                            var data = {
                                "norec_kdr": $scope.current.norec_kdr,
                                "keunit": $scope.item.keUnit,
                                "dariunit": $scope.item.dariUnit,
                                "tglupdate":  moment($scope.tglJamSkrg).format('YYYY-MM-DD HH:mm:ss'),
                                "objectruanganasalfk": $scope.item.ruangan2.id,
                                "objectruangantujuanfk": $scope.item.ruangan3.id,
                                // "statusEnabled":e.model.statusEnabled,
                                // "kdProfile": e.model.kdProfile,
                                "objectstatuskendalidokumenfk":$scope.item.statusKendaliDokumen.id,
                                "nocmfk": $scope.current.nocmfk,
                                "tglkembali": tglkembali,
                                "tglkeluar": tglkeluar,
                                "catatan": catatan
                            };
                        }

                    }
                    
                 
                    // manageSarprasPhp.saveKendaliDokumenRm(data).then(function(e){
                    medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen',data).then(function (e) {
                           $scope.noCm="";
                            $scope.findBynoCM(); 
                        // if (e.data.data.norec){
                        //      
                        //     $scope.reloadGridKendali($scope.currentRm);   
                        // }
                        // delete $scope.dataItem;
                        // $scope.winDialog.close();
                    })
              
                    $scope.popup_editor.close();
            }
           $scope.batalupdate=function(){
              $scope.popup_editor.close(); 
           }
            $scope.formatJam24 = {
                value: new Date(),			//set default value
                format: "dd-MM-yyyy HH:mm",	//set date format
                timeFormat: "HH:mm",		//set drop down time format to 24 hours
                dateInput: true
            }
            // $scope.listStatus = new kendo.data.DataSource({
            //     data: [{"id":1, "name": "dipinjam"},{"id":1, "name": "selesai"},{"id":1, "name": "diteruskan"}]
            // })
            $scope.kl=function (current) {
             if (current != undefined) {
                  // $scope.item.dariUnit=current.dariunit;
                  // $scope.item.keUnit=current.keunit;
                  $scope.item.statusKendaliDokumen={id:current.objectstatuskendalidokumenfk, name:current.name};
                  $scope.item.ruangan2={id:current.objectruanganasalfk, namaruangan:current.ruanganasal};
                  $scope.item.ruangan3={id:current.objectruangantujuanfk, namaruangan:current.ruangantujuan};
                  $scope.tglJamSkrg = new Date();
                  // console.log($scope.tglJamSkrg);

                
              
               }
            }
            $scope.onClick = function(){
                var tglAwal = moment($scope.items.start).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.items.end).format('YYYY-MM-DD 23:59');
                if (!$scope.item && !$scope.editable){
                    messageContainer.error('No CM belum dipilih');
                    return;
                }
                  medifirstService.get("registrasi/dokumenrm/get-data-kendali?+nocm=" + $scope.noCm +
                    "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir, false).then(function(data) {
                    var datakendali = data.data.datakendali
                        if(datakendali.length == 0){
                            $scope.dataItem = {
                                tglUpdate:$scope.now,
                                ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                                statusKendaliDokumen:{id:$scope.listStatus[0].id,name:$scope.listStatus[0].name}
                            }
                            // $scope.tglUpdate=$scope.now;
                            // $scope.item.ruangan={id:data.data.rak[0].id, namaruangan:data.data.rak[0].namaruangan};
                            // $scope.item.statusKendaliDokumen={id:$scope.listStatus[2].id,name:$scope.listStatus[2].name};
                        }else{
                            $scope.dataItem= {
                                tglUpdate:$scope.now,
                                ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                                ruangan1:{id:datakendali[0].kdruangan,namaruangan:datakendali[0].ruangdaftar},
                                statusKendaliDokumen:{id:$scope.listStatus[0].id,name:$scope.listStatus[0].name}
                            }
                        }
                })
                // $scope.dataItem = {
                //     tglUpdate:$scope.now,
                //     // dariUnit:'RAK',
                //     // ruangan:{id:$scope.listRuangan[0].id,namaruangan:$scope.listRuangan[0].namaruangan},
                //     statusKendaliDokumen:{id:$scope.listStatus[2].id,name:$scope.listStatus[2].name}

                // }
                // $scope.listStatus = new kendo.data.DataSource({
                //     data: [{"name": "dipinjam"},{"name": "selesai"},{"name": "diteruskan"}]
                // })
                // $scope.selectOptions1 = {
                //     dataSource: $scope.listStatus,
                //     template: "<div>#:name#</div>",
                //     autoBind: false
                // };
                $scope.winDialog.center().open();
            }

            $scope.onClick2 = function(){
                var tglAwal = moment($scope.items.start).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.items.end).format('YYYY-MM-DD 23:59');
                if (!$scope.item && !$scope.editable){
                    messageContainer.error('No CM belum dipilih');
                    return;
                }
                
                  medifirstService.get("registrasi/dokumenrm/get-data-kendali?+nocm=" + $scope.noCm +
                    "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir, false).then(function(data) {
                    var datakendali = data.data.datakendali
                     
                        if(datakendali.length == 0){
                            $scope.dataItem = {
                                tglUpdate:$scope.now,
                                ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                                statusKendaliDokumen:{id:$scope.listStatus[0].id,name:$scope.listStatus[0].name},
                                noregistrasifk:{noregistrasifk:datakendali[0].noregistrasifk}
                            }
                        }else{
                            if ($scope.item.dikirim ==true){
                                $scope.dataItem= {
                                    tglUpdate:$scope.now,
                                    ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                                    ruangan1:{id:datakendali[0].kdruangan,namaruangan:datakendali[0].ruangdaftar},
                                    statusKendaliDokumen:{id:$scope.listStatus[0].id,name:$scope.listStatus[0].name},
                                    noregistrasifk:{noregistrasifk:datakendali[0].noregistrasifk}
                                }
                            }else{
                                $scope.dataItem= {
                                tglUpdate:$scope.now,
                                ruangan:{id:data.data.rak[0].id,namaruangan:data.data.rak[0].namaruangan},
                                ruangan1:{id:datakendali[0].kdruangan,namaruangan:datakendali[0].ruangdaftar},
                                statusKendaliDokumen:{id:$scope.listStatus[1].id,name:$scope.listStatus[1].name},
                                noregistrasifk:{noregistrasifk:datakendali[0].noregistrasifk}
                            }
                            }

                        }

                         
                        $scope.tambahDataLangsung($scope.dataItem);
                })
            }

            $scope.tambahData = function(items){
                var listRawRequired = [ 
                    "dataItem.tglUpdate|k-ng-model|Tanggal update",
                    "dataItem.ruangan|ng-model|Unit asal",
                    "dataItem.ruangan1|ng-model|Unit tujuan",
                    "dataItem.statusKendaliDokumen|k-ng-model|Status dokumen",
                    // "dataItem.Catatan|k-ng-model|Catatan",
                ];
                // manageSarprasPhp.getDataTableTransaksi("dokumenrm/get-data-kendali?+nocm="+$scope.noCm, false).then(function(data) {
                //     var datakendali = data.data.datakendali
                //         if(datakendali.lenght == null){
                //             items.tglUpdate=$scope.now;
                //             items.ruangan={id:data.data.rak[0].id, namaruangan:data.data.rak[0].namaruangan};
                //             items.statusKendaliDokumen={id:$scope.listStatus[2].id,name:$scope.listStatus[2].name};
                //         }
                // })


                var nocmfk=''
                if ($scope.noCMFK!=undefined)
                    nocmfk=$scope.noCMFK;
                else
                    nocmfk='';

                var tglkeluar =null;
                if (items.statusKendaliDokumen.name != "DITERIMA") {

                    tglkeluar=moment(items.tglKembali).format('YYYY-MM-DD HH:mm');;
                }

                var tglkembali=null;
                if (items.statusKendaliDokumen.name == "DITERIMA") {
                     tglkembali=moment(items.tglKembali).format('YYYY-MM-DD HH:mm');
                }  

                var Cat="-"
                if ($scope.dataItem.Catatan != undefined) {
                    Cat = $scope.dataItem.Catatan
                } 
                
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                    if(isValid.status){
                        if(items.statusKendaliDokumen.name == "DITERIMA"){
                             var data = {
                                        "norec_kdr": '',
                                        "objectruangantujuanfk": items.ruangan1.id,
                                        "objectruanganasalfk": items.ruangan.id,
                                        "tglupdate": moment(items.tglUpdate).format('YYYY-MM-DD HH:mm'), //items.tglUpdate,//.getTime(), 
                                        "objectstatuskendalidokumenfk":  items.statusKendaliDokumen.id,
                                        "nocmfk": nocmfk,
                                        // "tglkeluar": tglkeluar,
                                        "catatan": Cat,
                                        "tglkembali": tglkembali,
                                    };
                        }else if(items.statusKendaliDokumen.name != "DITERIMA"){
                             var data = {
                                        "norec_kdr": '',
                                        "objectruangantujuanfk": items.ruangan1.id,
                                        "objectruanganasalfk": items.ruangan.id,
                                        "tglupdate": moment(items.tglUpdate).format('YYYY-MM-DD HH:mm'), //items.tglUpdate,//.getTime(), 
                                        "objectstatuskendalidokumenfk":  items.statusKendaliDokumen.id,
                                        "nocmfk": nocmfk,
                                        "tglkeluar": tglkeluar,
                                        "catatan": Cat,
                                        //"tglkembali": tglkembali
                                    };
                        }
                   
                    // manageSarprasPhp.saveKendaliDokumenRm(data).then(function(e){
                    //     // update status antrian
                    //     $scope.noCm="";
                    //     $scope.findBynoCM(); 
                    //       // $scope.items.pilihDokter='';
                    // });
                    medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen',data).then(function (e) {
                        // update status antrian
                        $scope.noCm="";
                        $scope.findBynoCM();
                        // $scope.items.pilihDokter='';
                    });

                    $scope.winDialog.close();
                    } else {
                        ModelItem.showMessages(isValid.messages);
                    }
            }
            $scope.tambahDataLangsung = function(items){
                var listRawRequired = [ 
                    "dataItem.tglUpdate|k-ng-model|Tanggal update",
                    "dataItem.ruangan|ng-model|Unit asal",
                    "dataItem.ruangan1|ng-model|Unit tujuan",
                    "dataItem.statusKendaliDokumen|k-ng-model|Status dokumen",
                    "dataItem.noregistrasifk|k-ng-model|Noregistrasi",
                    // "dataItem.Catatan|k-ng-model|Catatan",
                ];
                // manageSarprasPhp.getDataTableTransaksi("dokumenrm/get-data-kendali?+nocm="+$scope.noCm, false).then(function(data) {
                //     var datakendali = data.data.datakendali
                //         if(datakendali.lenght == null){
                //             items.tglUpdate=$scope.now;
                //             items.ruangan={id:data.data.rak[0].id, namaruangan:data.data.rak[0].namaruangan};
                //             items.statusKendaliDokumen={id:$scope.listStatus[2].id,name:$scope.listStatus[2].name};
                //         }
                // })


                var nocmfk=''
                if ($scope.noCMFK!=undefined)
                    nocmfk=$scope.noCMFK;
                else
                    nocmfk='';

                var tglkeluar =null;
                if (items.statusKendaliDokumen.name != "DITERIMA") {

                    tglkeluar=moment(items.tglKembali).format('YYYY-MM-DD HH:mm');;
                }

                var tglkembali=null;
                if (items.statusKendaliDokumen.name == "DITERIMA") {
                     tglkembali=moment(items.tglKembali).format('YYYY-MM-DD HH:mm');
                }  




                var Cat="-"
                if ($scope.dataItem.Catatan != undefined) {
                    Cat = $scope.dataItem.Catatan
                } 
                
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                    if(isValid.status){
                        // if(items.statusKendaliDokumen.name == "DITERIMA"){
                        if ($scope.item.diterima  == true){     
                             var data = {
                                        "norec_kdr": '1',
                                        "objectruangantujuanfk": items.ruangan1.id,
                                        "objectruanganasalfk": items.ruangan.id,
                                        "tglupdate": moment(items.tglUpdate).format('YYYY-MM-DD HH:mm'), //items.tglUpdate,//.getTime(), 
                                        "objectstatuskendalidokumenfk":  items.statusKendaliDokumen.id,
                                        "nocmfk": nocmfk,
                                        // "tglkeluar": tglkeluar,
                                        "catatan": Cat,
                                        "tglkembali": tglkembali,
                                        "noregistrasifk":items.noregistrasifk.noregistrasifk
                                    };
                        }else if($scope.item.dikirim == true){
                             var data = {
                                        "norec_kdr": '',
                                        "objectruangantujuanfk": items.ruangan1.id,
                                        "objectruanganasalfk": items.ruangan.id,
                                        "tglupdate": moment(items.tglUpdate).format('YYYY-MM-DD HH:mm'), //items.tglUpdate,//.getTime(), 
                                        "objectstatuskendalidokumenfk":  items.statusKendaliDokumen.id,
                                        "nocmfk": nocmfk,
                                        "tglkeluar": tglkeluar,
                                        "catatan": Cat,
                                        "noregistrasifk":items.noregistrasifk.noregistrasifk
                                        //"tglkembali": tglkembali
                                    };                        
                        }else if($scope.item.dipinjam == true){
                            var data = {
                                        "norec_kdr": '',
                                        "objectruangantujuanfk": items.ruangan1.id,
                                        "objectruanganasalfk": items.ruangan.id,
                                        "tglupdate": moment(items.tglUpdate).format('YYYY-MM-DD HH:mm'), //items.tglUpdate,//.getTime(), 
                                        "objectstatuskendalidokumenfk":  items.statusKendaliDokumen.id,
                                        "nocmfk": nocmfk,
                                        "tglkeluar": tglkeluar,
                                        "catatan": Cat,
                                        "noregistrasifk":items.noregistrasifk.noregistrasifk
                                        //"tglkembali": tglkembali
                                    };
                        }
                   
                    // manageSarprasPhp.saveKendaliDokumenRm(data).then(function(e){
                    //     // update status antrian
                    //     $scope.noCm="";
                    //     $scope.findBynoCM(); 
                    //       // $scope.items.pilihDokter='';
                    // });
                    medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen',data).then(function (e) {
                        // update status antrian
                        $scope.noCm="";
                        $scope.findBynoCM();
                        // $scope.items.pilihDokter='';
                    });
                    $scope.winDialog.close();
                    } else {
                        ModelItem.showMessages(isValid.messages);
                    }
            }
            $scope.batal = function(){
                $scope.winDialog.close();
            }
            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() { 
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open( "GET", aUrl, true );            
                    anHttpRequest.send( null );
                }
            }
            $scope.cetakLabel =function(){
                // if ($scope.noCm.length  !== 7){
                //   alert("Masukan No CM dengan Lengkap ");
                //   return;  
                // } 
                var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-labeltracer=1&nocm='+$scope.noCm , function(response) {
                //       // aadc=response;
                // });
                client.get(' http://127.0.0.1:1237/printvb/rekammedis?cetak-labelpasien-satubynocm=1&norec='+$scope.noCm+'&view=false&qty=1' , function(response) {
                      // aadc=response;
                });



            }
            $scope.$watch('noCm', function (e) {
                //  

                var tglAwal = moment($scope.items.start).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.items.end).format('YYYY-MM-DD 23:59');
                if (e.length >=9 ){
                    $scope.noCm =0;
                }
                debugger;
                if (e.length !== 8) return;
                    $scope.findBynoCM();                        
                    if ($scope.item.dikirim == true){
                        if ( $scope.item.namaPasien !== ""){
                                 
                                 medifirstService.get("registrasi/dokumenrm/get-cekdata?nocm="+$scope.noCm+
                                        "&tglAwal="+tglAwal+
                                        "&tglAkhir="+tglAkhir,false).then(function(data) {
                                             
                                    var datacek = data.data
                                    if(datacek.data.length >= 1){
                                        alert("Sudah Dikirim untuk hari ini");
                                        return; 
                                    }

                                        $scope.onClick2();
                                });
                                
                                // $scope.tambahDataLangsung();                    
                        }
                    }
                    if ($scope.item.diterima == true){
                                $scope.terimaLangsung();
                    }
                    if ($scope.item.dipinjam == true){
                       if ( $scope.item.namaPasien !== ""){
                                 
                                 medifirstService.get("registrasi/dokumenrm/get-cekdata?nocm="+$scope.noCm+
                                        "&tglAwal="+tglAwal+
                                        "&tglAkhir="+tglAkhir,false).then(function(data) {
                                             
                                    var datacek = data.data
                                    if(datacek.data.length >= 1){
                                        alert("Sudah Dikirim untuk hari ini");
                                        return; 
                                    }

                                        $scope.onClick2();
                                });
                                
                                // $scope.tambahDataLangsung();                    
                        } 
                    }
            });
            $scope.$watch('item.dikirim', function (e) {
                $scope.item.diterima=false;
                $scope.item.dipinjam=false;

            });
            $scope.$watch('item.diterima', function (e) {
                $scope.item.dikirim =false;
                $scope.item.dipinjam=false;
            });
            $scope.$watch('item.dipinjam', function (e) {
                $scope.item.dikirim =false;
                $scope.item.diterima=false;
            });
        }]
    )
})