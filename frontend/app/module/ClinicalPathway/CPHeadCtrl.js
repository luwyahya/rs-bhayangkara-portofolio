define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CPHeadCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.pop ={}
            $scope.pop2 ={}
            var nomorEMR = '-'
            var norecEMR
            $scope.cc.emrfk = 1
            var dataLoad = []
            $scope.item.objcbo= []
            $rootScope.isEditCP = false
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.get('cp/get-form-target').then(function (data) {
                $scope.listUrl = data.data.form
                $scope.listKegiatan = data.data.kegiatan
            })
            var user= JSON.parse(localStorage.getItem('datauserlogin'))
            if(user.kdUser.indexOf('his.') > -1){
                $scope.isEdit =true
            }
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
                if (chacePeriode[0] == "") {
                    $scope.loginadmin =  false
                    $scope.loginperawat =  true
                    $scope.cc.noregistrasi =""
                }else{
                    $scope.loginadmin =  true
                    $scope.loginperawat =  false
                    $scope.cc.noregistrasi = chacePeriode[0]
                    $scope.cc.norec_pd = chacePeriode[1]
                    if (nomorEMR == '-') {
                        $scope.cc.norec_emr = '-'
                    } else {
                        $scope.cc.norec_emr = nomorEMR
                    }
                }
            }else{
                $scope.loginadmin =  false
                $scope.loginperawat =  true
                $scope.isEditCP= true
                $rootScope.isEditCP = true
            }
            var chekedd = false
           if(nomorEMR!='-'){
               cacheHelper.set('cacheEMR_TRIASE_PRIMER_UMUM', nomorEMR)
           }
           LoadData($scope.cc.noregistrasi);
            function LoadData(noregistrasi) {

                $scope.isRouteLoading = true;
                    
                medifirstService.getPart('cp/get-produk-part', true, true, 20).then(function (data) {
                    $scope.listProduk = data
                })
                
                if (noregistrasi == undefined) {
                     medifirstService.get('cp/get-list-diagnosa-cp', true, true, 20).then(function (data) {
                        $scope.listDiagnosaPasien = data.data.cp
                    })

                    $scope.showCP = true;
                    $scope.isRouteLoading = false;
                 }
                if (noregistrasi != undefined) {
                    medifirstService.get("tatarekening/get-detail_apd?noregistrasi=" + noregistrasi , true).then(function (dat2) {  
                        $scope.itm = dat2.data[0];           
                    })
                    medifirstService.getPart('bridging/bpjs/get-diagnosa-saeutik', true, true, 20).then(function (data) {
                        $scope.listDiagnosaPasien = data
                    })
                    medifirstService.get("cp/get-detail-diagnosa-pasien?noregistrasi=" + noregistrasi , true).then(function (dat3) {           
                        
                        if (dat3.data[0] == 0) {
                            $scope.showCP = true;
                            
                        }else{
                            $scope.showCP = true;
                            $scope.listcp = dat3.data.cp;
                            // $scope.listDiagnosaPasien = dat3.data.data;
                            $scope.item.diagnosa = dat3.data.data[0];
                            if(dat3.data.cp.length > 0){
                              $scope.item.cp = dat3.data.cp[0];
                              $state.go('CPHead.ClinicalPathwayDetail',{
                                    kodeCP:  $scope.item.cp.namaexternal,
                                    jmlhari: $scope.item.cp.jmlhari
                                })  
                            }else{
                                // toastr.info('Clinical Pathway untuk diagnosa ini belum ada ','Info')
                                // $state.go('CPHead')
                            }
                            
                        }
                        $scope.isRouteLoading = false;
                        
                    })
                }
                
            }
            $scope.getListCP =function(){
                medifirstService.get('cp/get-list-cp?kddiagnosa=' + $scope.item.diagnosa.kddiagnosa, true, true, 20).then(function (data) {

                    $scope.listcp = data.data.cp;
                    if($scope.listcp.length > 0){
                        $scope.item.cp = data.data.cp[0];
                        //$state.go($scope.item.cp.url)
                        $state.go('CPHead.ClinicalPathwayDetail',{
                            kodeCP:  $scope.item.cp.namaexternal,
                                jmlhari: $scope.item.cp.jmlhari
                        })
                    }else{
                         // toastr.info('Clinical Pathway untuk diagnosa ini belum ada ','Info')
                         // $state.go('CPHead')
                    }
                    
                })
            }
            $scope.getCP =function(){
                $state.go('CPHead.ClinicalPathwayDetail',{
                    kodeCP:  $scope.item.cp.namaexternal,
                                jmlhari: $scope.item.cp.jmlhari
                })
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
           
            $scope.checkEdit = function (isEditCP) {
                $rootScope.checkEdit(isEditCP);
            }
            $rootScope.showPopUp = function (id,kodecp) {
                console.log(id)
                $scope.pop.idobjectcp =id
                $scope.pop.kodecp =kodecp
                $scope.popUpMap.center().open();
                loadMap()
            }
            $rootScope.showPopUp2 = function (kodecp,id,caption,jenis,openlinkid,objectcpkegiatanfk,sort,kegiatan,aktif) {
                console.log(id)
                $scope.pop2.id =id
                $scope.pop2.caption =caption
                $scope.pop2.jenis =jenis
                $scope.pop2.openlinkid =openlinkid
                $scope.pop2.kegiatan = {id:objectcpkegiatanfk,kegiatan:kegiatan}
                $scope.pop2.urutan = sort
                $scope.pop2.kodecp = kodecp
                if (aktif == true) {
                    $scope.pop2.enabled = true
                }else{
                    $scope.pop2.enabled = false
                }
                $scope.popUpCaption.center().open();
                // loadMap()
            }
            $rootScope.SaveMapping = function(){
                let red=0
                if ($scope.pop.red == true) {
                    red=1
                }
                var json ={
                    'id' : $scope.pop.id != undefined?  $scope.pop.id :'',
                    'idobjectcp' : $scope.pop.idobjectcp ,
                    'kodecp' : $scope.pop.kodecp ,
                    'urltarget' : null,//$scope.pop.urltarget.urltarget ,
                    'urltargetfk' : $scope.pop.urltarget != undefined ?  $scope.pop.urltarget.id :null,
                    'produkfk' : $scope.pop.produk != undefined ?  $scope.pop.produk.id :null,
                    'jumlah' :$scope.pop.jumlah != undefined ? parseFloat( $scope.pop.jumlah) :null,
                    'checkisred' : red,
                }
                medifirstService.post('cp/save-mapping',json).then(function(e){
                    // loadMap()
                     $scope.pop ={}
                })
                 $scope.popUpMap.center().close();
            }
            $rootScope.SaveCaption = function(){
                let aktif=0
                if ($scope.pop2.enabled == true) {
                    aktif=1
                }
                var json ={
                    'id' : $scope.pop2.id,
                    'caption' : $scope.pop2.caption ,
                    'jenis' : $scope.pop2.jenis,
                    'openlinkid':$scope.pop2.openlinkid,
                    'objectcpkegiatanfk':$scope.pop2.kegiatan.id,
                    'sort':$scope.pop2.urutan,
                    'kodecp': $scope.pop2.kodecp,
                    'aktif':aktif
                }
                medifirstService.post('cp/save-caption',json).then(function(e){
                    // loadMap()
                     $scope.pop2 ={}
                })
                 $scope.popUpCaption.center().close();
            }

            $rootScope.addNew = function(){
                $scope.pop2.id = "-"
                $scope.pop2.caption =""
                $scope.pop2.openlinkid =""
                 // $scope.popUpCaption.center().close();
            }
            function loadMap(){
                $scope.isRouteLoading = true;
                var kdcp =''
                if($scope.pop.kodecp!= undefined){
                    kdcp =$scope.pop.kodecp
                }
                var idobjectcp =''
                if($scope.pop.idobjectcp!= undefined){
                    idobjectcp =$scope.pop.idobjectcp
                }
               medifirstService.get("cp/get-mapping?kodecp="+kdcp+"&idobjectcp="+idobjectcp
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    // $scope.dataDaftarPasienPulang = data[0].data;
                    $scope.pop.id =data.data.data[0].id
                    $scope.pop.idobjectcp = data.data.data[0].idobjectcp
                    $scope.pop.kodecp = data.data.data[0].kodecp
                    $scope.pop.jumlah = parseFloat( data.data.data[0].jumlah)
                    $scope.pop.urltarget = {id :data.data.data[0].urltargetfk,namaform:data.data.data[0].namaform}
                    $scope.listProduk.add( {id :data.data.data[0].produkfk,namaproduk:data.data.data[0].namaproduk})
                    $scope.pop.produk = {id :data.data.data[0].produkfk,namaproduk:data.data.data[0].namaproduk}
                    // $scope.dataMapping = new kendo.data.DataSource({
                    //     data: data.data.data,
                    //     pageSize: 10,
                    //     total: data.data.data,
                    //     serverPaging: false,
                    //     schema: {
                    //         model: {
                    //             fields: {
                    //             }
                    //         }
                    //     }
                    // });
                })
            }

            $scope.klikMap = function(e){
              
                $scope.pop.id =e.id
                $scope.pop.idobjectcp = e.idobjectcp
                $scope.pop.kodecp = e.kodecp
                $scope.pop.jumlah = parseFloat( e.jumlah)
                $scope.pop.urltarget = {id :e.urltargetfk,namaform:e.namaform}
                $scope.listProduk.add( {id :e.produkfk,namaproduk:e.namaproduk})
                $scope.pop.produk = {id :e.produkfk,namaproduk:e.namaproduk}
            }
            $scope.columnMapping =
            {
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: true,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns:
                    [
                        {
                            "field": "idobjectcp",
                            "title": "Object CP",
                            "width": "50%",
                            "template": "<span class='style-left'>#: idobjectcp #</span>",
                        },
                        {
                            "field": "kodecp",
                            "title": "Kode CP",
                            "width": "50%",
                            "template": "<span class='style-left'>#: kodecp #</span>",
                        },
                        {
                            "field": "namaform",
                            "title": "Form Target",
                            "width": "50%",
                            "template": "<span class='style-left'>#: namaform #</span>",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "50%",
                        },
                        {
                            "field": "jumlah",
                            "title": "Jumlah",
                            "width": "50%",
                        },
                        {
                            "command": [
                            {
                                text: "Hapus",
                                click: hapusData,
                                imageClass: "k-icon k-delete"
                            }],
                            title: "",
                            width: "25%",
                        },

                        {
                            hidden: true,
                            field: "kodecp",
                            title: "Nama CP",
                            aggregates: ["count"],
                            groupHeaderTemplate: "#= value #"
                        }
                    ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
               
            };
            
            function hapusData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.post( 'cp/hapus-mapping',itemDelete).then(function (e) {
                    $scope.pop ={}
                    loadMap();
                   
                })

            }

            //*** BATAS */

        }
    ]);
});