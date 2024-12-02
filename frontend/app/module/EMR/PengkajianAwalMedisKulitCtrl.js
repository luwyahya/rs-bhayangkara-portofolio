define(['initialize'], function (initialize) {
    'use strict';
    
    initialize.controller('PengkajianAwalMedisKulitCtrl', ['$mdDialog', '$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            var isNotClick = true;
            $scope.item = {}
            $scope.user = {}; 
            loadData()
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = true
            $scope.isKembali = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMRSS = '';
            var nomorEMR = '-'
            var paramSearch = ''

            $scope.isSave=true;
            $scope.isUpdate=false;
            $scope.isUpdateCetak=false;
            
            
            //inisialisasi untuk id emr pada pengkajian awal pasien ctrl
            $scope.cc.emrfk = 1939

            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.item.objcbo = [] 
            $scope.dataSource = []   
            $scope.item.obj = []
            $scope.item.obj2 = []         
            $scope.item.image = '../app/images/svg/no-image.svg';
            //ash 2023-09-19
            $scope.InputLab= true
            $scope.InputRadiologi = true
            $scope.InputObat = true
            var produkDef = []
            var jenisPelayananId = ''
            var temphasil = [];


            //ash 2023-09-20
            //UNTUK KOMUNIKASI PARENT DENGAN CHILD
            $scope.tipemodul="pengkajianawalmedispasien";
            


            var temp = []           
            var lanjut = false;
            LoadCacheHelper()


            

            function loadData() {
                $scope.listKesadaran = [
                    { text: "Compos Mentis", value: 1 },
                    { text: "Apatis", value: 2 },
                    { text: "Delirium", value: 3 },
                    { text: "Somnolent", value: 4 },
                    { text: "Sopor", value: 5 },
                    { text: "Semi Coma", value: 6 },
                    { text: "Coma", value: 7 }
                ];

                $scope.listKeadaanUmum = [
                    { text: "Baik", value: 1},
                    { text: "Sedang", value: 2},
                    { text: "Buruk", value: 3}
                ]
                $scope.listGcs = [
                    { text: "E", value: 1},
                    { text: "M", value: 2},
                    { text: "V", value: 3}
                ];
                $scope.listGcsE = [
                    { text: "1", value: 1},
                    { text: "2", value: 2},
                    { text: "3", value: 3},
                    { text: "4", value: 4}
                ];
                $scope.listGcsM = [
                    { text: "1", value: 1},
                    { text: "2", value: 2},
                    { text: "3", value: 3},
                    { text: "4", value: 4},
                    { text: "5", value: 5},
                    { text: "6", value: 6}
                ];
                $scope.listGcsV = [
                    { text: "1", value: 1},
                    { text: "2", value: 2},
                    { text: "3", value: 3},
                    { text: "4", value: 4},
                    { text: "5", value: 5}
                ];
                
                $scope.listPrognosis = [
                    { text: "Adbonam", value: '1'},
                    { text: "Dubia Adbonam", value: '2'},
                    { text: "Dubia Admalam", value: '3'},
                    { text: "Admalam", value: '4'}
                ];
            }
            
            


            $scope.showPopUp = function () {
                $scope.popUpUpload.center().open()
            }
            // $(document).ready(function(){
            //     $('.profile_img').hover(function() {
            //         $(this).addClass('transisi');
            //     }, function() {
            //         $(this).removeClass('transisi');
            //     });
            // });

            $scope.$watch('item.obj[1152]', function(e) {
                if (e == true) {
                    $scope.lainnya = true;
                    $scope.item.obj[1151] = false
                    $scope.item.obj[1150] = false
                    //$scope.item.obj[1153] = ""
                } else {
                    $scope.lainnya = false;
                    $scope.item.obj[1153] = ""
                }
            })
            $scope.$watch('item.obj[1151]', function(e) {
                if (e == true) {
                    $scope.item.obj[1152] = false
                    $scope.item.obj[1150] = false
                    $scope.item.obj[1153] = ""
                } 
            })
    
            $scope.$watch('item.obj[1150]', function(e) {
                if (e == true) {
                    $scope.item.obj[1152] = false
                    $scope.item.obj[1151] = false
                    $scope.item.obj[1153] = ""
                } 
            })

            
            //TINGGI BADAN BERAT BADAN
            /*
            KURUS BERAT <17
            KURUS RINGAN 17 - 18,4
            NORMAL 18,5 - 25
            GEMUK RINGAN 25,1 - 27
            GEMUK BERAT > 27
            */
            $scope.$watch('item.obj[1174]', function(e) {
                let beratbadan=0;
                let tinggibadan=0;
                let imt=0;
                let imtstr=""
                $scope.item.obj[1176]=""

                    if(e>0) {  
                        if($scope.item.obj[1175]>0) {
                                let tinggibadan=e/100;
                                let beratbadan=$scope.item.obj[1175];

                                imt=beratbadan/(tinggibadan*tinggibadan);
                                                                
                                if(imt<17) imtstr="KURUS - BERAT"
                                else if((imt>=17) & (imt<18.4)) imtstr="KURUS - RINGAN"
                                else if((imt>=18.4) & (imt<25)) imtstr="NORMAL"
                                else if((imt>=25) & (imt<27)) imtstr="GEMUK -RINGAN"
                                else if(imt>27) imtstr="GEMUK -BERAT"

                                $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr
                        }

                    }
            })
            
            $scope.$watch('item.obj[1175]', function(e) {
                let beratbadan=0;
                let tinggibadan=0;
                let imt=0;
                let imtstr=""
                $scope.item.obj[1176]=""

                    if(e>0) {
                        if($scope.item.obj[1174]>0) {
                                let beratbadan=e;
                                let tinggibadan=$scope.item.obj[1174]/100;

                                imt=beratbadan/(tinggibadan*tinggibadan);
                                
                                if(imt<17) imtstr="KURUS - BERAT"
                                else if((imt>=17) & (imt<18.4)) imtstr="KURUS - RINGAN"
                                else if((imt>=18.4) & (imt<25)) imtstr="NORMAL"
                                else if((imt>=25) & (imt<27)) imtstr="GEMUK -RINGAN"
                                else if(imt>27) imtstr="GEMUK -BERAT"

                                $scope.item.obj[1176] = imtstr
                                $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr
                        }

                    }
            })
            //-------------------
            
            $scope.UploadPhoto = function () {
                if ($scope.urlImage != undefined) {
                    // saveImageToDirsaveImageToDir($scope.urlImage,'0182781')
                    $scope.item.image = $scope.urlImage
                    $scope.popUpUpload.close()
                } else {
                    toastr.info('Gambar belum di pilih')
                    return
                }
            }

            $scope.TutupPopUp = function () {

                if ($scope.urlImage != undefined)
                    $scope.item.image = "../app/images/svg/no-image.svg"
                $scope.urlImage = undefined
                $scope.popUpUpload.close()
            }

            $("#photo").kendoUpload({
                localization: {
                    "select": "Pilih Photo..."
                },
                async: {
                    saveUrl: "save",
                    removeUrl: "remove",
                    autoUpload: false
                },
                multiple: false,
                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Gambar (.jpg, .jpeg, .png)')
                        e.preventDefault();
                        // return
                    }
                    var fileInfo = e.files[0];
                    var wrapper = this.wrapper;
                    // debugger
                    $scope.ImageUrlData = wrapper.context.value;
                    setTimeout(function () {
                        addPreview(fileInfo, wrapper);
                        compress(e);

                    });                   
                }
            });

            function addPreview(file, wrapper) {
                var raw = file.rawFile;
                var reader = new FileReader();
                if (raw) {
                    reader.onloadend = function () {
                        var preview = $("<img class='img-responsive'>").attr("src", this.result);
                        wrapper.find(".k-file[data-uid='" + file.uid + "'] .k-file-extension-wrapper")
                            .replaceWith(preview);                        
                    };
                    reader.readAsDataURL(raw);
                }
            }


            function compress(e) {                                                      
                var fileName = e.files[0].name;
                // var width = 1280;
                // var height = 960;
                var reader = new FileReader();
                var raw = e.files[0].rawFile;
                reader.readAsDataURL(raw);
                reader.onload = event => {
                    var img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        var elem = document.createElement('canvas');
                        elem.width = img.width;//width;
                        elem.height = img.height;//height;
                        var ctx = elem.getContext('2d');                        
                        // ctx.drawImage(img, 0, 0, width, height);                        
                        ctx.drawImage(img, 0, 0, img.width, img.height); 
                        $scope.urlImage = ctx.canvas.toDataURL('image/jpeg', 1);                        
                    },
                        reader.onerror = error => console.log(error);
                };
            }

            $scope.add = function () {
				$scope.item = {}
				$scope.item.image = "../app/images/svg/no-image.svg"
				// $scope.myVar = 1
            }
            
            // loadValue();
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
                    $scope.cc.jenisemr = "pengkajianawalkulit" //init emr
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    debugger
                    init()
                    // cekVitalSign()
                    // loadValue();
                }
            }
            var chekedd = false

            
            //ash 2023-09-22
            //UNTUK INISIALISASI DATA
            function init() {
                
                $scope.isLoading = true
                let isPengkajianKosong=0;
                $scope.item.obj = []
                $scope.item.obj2 = []

                //jika awal melakukan pengkajian
                $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[1148] = moment($scope.now).format('HH:mm')
                $scope.item.obj[1239] = moment($scope.now).format('YYYY-MM-DD')
                //$scope.isRouteLoading = true
                
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi

                
                /*medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                    $scope.listDiagnosa = data
                })  

                medifirstService.getPart('emr/get-datacombo-part-dokter', true, true, 20).then(function (data) {
                    $scope.listPegawai = data
                })*/

                
                medifirstService.get('emr/get-datacombo-dokter', true).then((res) => {
                    $scope.listPegawai = res.data;
                });
                
                $scope.item.obj[1257] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                
                //CEK EMR APAKAH ADA
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianawalkulit", true).then(function(dat) {
                    //$scope.isRouteLoading = false
                    debugger
                    nomorEMRSS = ''
                    if (dat.data.data.length > 0) {
                        //JIKA ADA
                        for (let i = 0; i < dat.data.data.length; i++) {
                            if (dat.data.data[i].jenisemr == 'pengkajianawalkulit') {
                                lanjut = true;
                            }
                        }
                        if (lanjut == true) {
                                $scope.isSave=false;
                                $scope.isUpdate=true;
                                $scope.isUpdateCetak=true;
                                isPengkajianKosong=1;
                                $scope.noemr = dat.data.data[0].noemr
                                $scope.cc.norec_emr = dat.data.data[0].noemr
                                
                                nomorEMRSS = dat.data.data[0].noemr
                                nomorEMR = nomorEMRSS

                                //ambil pengkajian awal medis pasien jika memang sudah ada
                                $scope.cc.emrfk = 1939;
                                setobjectToModel(nomorEMRSS, $scope.cc.emrfk)

                                //ambil pengkajian awal medis pasien jika memang sudah ada
                                medifirstService.get('emr/get-image-from-jenis-surat-bedah?').then(function(dat) {
                                    if($scope.user.poto==null || $scope.user.poto=="undefined" || $scope.user.poto=="") $scope.user.poto = dat.data[0].template
                    
                                })
                                
                        } 
                    }
                })
                
                if(!isPengkajianKosong) {
                    var str=''
                    var res=''
                    //ash 2023-09-22
                    //-----------------------------------------------------------
                    //ambil data dari pengkajian awal untuk keluhan utama dan pemeriksaan fisik
                    medifirstService.get('emr/get-value-from-pengkajian-awal-2?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                        for(let i = 0; i < dat.data.length; i++) {
                            if (dat.data[i].emrdfk == 1154) { //keluhan utama
                                $scope.item.obj[1154] = dat.data[i].value 
                            } else if (dat.data[i].emrdfk == 1168) { //kesadaran                                
                                str = dat.data[i].value
                                res = str.split("~");

                                $scope.item.obj[1168] = {text:res[1],value:res[0]}
                            } else if (dat.data[i].emrdfk == 1169) { //tekanan darah
                                $scope.item.obj[1169] = dat.data[i].value
                            } else if (dat.data[i].emrdfk == 1170) { //nadi
                                $scope.item.obj[1170] = dat.data[i].value
                            } else if (dat.data[i].emrdfk == 1172) { //suhu tubuh
                                $scope.item.obj[1172] = dat.data[i].value
                            } else if (dat.data[i].emrdfk == 1173) { //pernafasan
                                $scope.item.obj[1173] = dat.data[i].value
                            } else if (dat.data[i].emrdfk == 1175) { //berat badan
                                $scope.item.obj[1174] = dat.data[i].value
                            } else if (dat.data[i].emrdfk == 1174) { //tinggi badan
                                $scope.item.obj[1175] = dat.data[i].value
                            } else if (dat.data[i].emrdfk == 1178) { //alergi
                                $scope.item.obj[1244] = dat.data[i].value       
                            } else if (dat.data[i].emrdfk == 1259) { //E 
                                str = dat.data[i].value
                                res = str.split("~");
                                
                                $scope.item.obj[2241] = {text:res[1],value:res[0]}
                            } else if (dat.data[i].emrdfk == 1502) { //M
                                str = dat.data[i].value
                                res = str.split("~");
                                
                                $scope.item.obj[2242] = {text:res[1],value:res[0]}
                            } else if (dat.data[i].emrdfk == 1503) { //V
                                str = dat.data[i].value
                                res = str.split("~");
                                
                                $scope.item.obj[2243] = {text:res[1],value:res[0]}
                            }

                            
                            let beratbadan=$scope.item.obj[1175]
                            let tinggibadan=$scope.item.obj[1174]/100;
                            let imt=0;
                            let imtstr=''

                            if(beratbadan>0 && tinggibadan>0) {
                                imt=beratbadan/(tinggibadan*tinggibadan);
                                
                                if(imt<17) imtstr="KURUS - BERAT"
                                else if((imt>=17) & (imt<18.4)) imtstr="KURUS - RINGAN"
                                else if((imt>=18.4) & (imt<25)) imtstr="NORMAL"
                                else if((imt>=25) & (imt<27)) imtstr="GEMUK -RINGAN"
                                else if(imt>27) imtstr="GEMUK -BERAT"

                                $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr
                            }
                        }
                        
                    })
                    medifirstService.get('emr/get-image-from-jenis-surat-bedah?').then(function(dat) {
                        $scope.user.poto = dat.data[0].template
                    })
                    //-----------------------------------------------------------
                }   
                
                $scope.isLoading = false
                
            }

            function setobjectToModel(nomorEMRSS, emrfk) {
                let tm='';
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    debugger
                    $scope.isLoading = false
                    var chekedd = false
                    // $scope.item.obj[68] = $scope.now
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
    
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "checkbox") {
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
    
    
                            } else if (dataLoad[i].type == "datetime") {
                                //$scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "time") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            } else if (dataLoad[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                $scope.item.obj2[dataLoad[i].emrdfk] = true
                            } else if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "combobox") {
                                if(dataLoad[i].emrdfk == "1149") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }
                                } else if (dataLoad[i].emrdfk == "1168"){
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                } else if (dataLoad[i].emrdfk == "890") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }
                                } else if (dataLoad[i].emrdfk == "891") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }
                                } else if (dataLoad[i].emrdfk == "1259") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                } else if (dataLoad[i].emrdfk == "2241") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                } else if (dataLoad[i].emrdfk == "2242") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                } else if (dataLoad[i].emrdfk == "2243") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                } else if (dataLoad[i].emrdfk == "3124") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                                } else if (dataLoad[i].emrdfk == "1257") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                                } else if (dataLoad[i].emrdfk == "1582") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }
                                }
                            } else if (dataLoad[i].type == "photo") {
                                $scope.user.poto = dataLoad[i].value
                            } else if (dataLoad[i].type == "image") {
                                $scope.user.poto = dataLoad[i].value
                            }


                            if (dataLoad[i].emrdfk == "1188") {
                                // totalNilai = dataLoad[i].value
                                // $scope.item.obj[1188] = parseInt(dataLoad[i].value)
                                totalcost[0].value = dataLoad[i].value
                            } else if (dataLoad[i].emrdfk == "1148") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }

                            
                            let beratbadan=$scope.item.obj[1175]
                            let tinggibadan=$scope.item.obj[1174]/100;
                            let imt=0;
                            let imtstr=''

                            if(beratbadan>0 && tinggibadan>0) {
                                imt=beratbadan/(tinggibadan*tinggibadan);
                                
                                if(imt<17) imtstr="KURUS - BERAT"
                                else if((imt>=17) & (imt<18.4)) imtstr="KURUS - RINGAN"
                                else if((imt>=18.4) & (imt<25)) imtstr="NORMAL"
                                else if((imt>=25) & (imt<27)) imtstr="GEMUK -RINGAN"
                                else if(imt>27) imtstr="GEMUK -BERAT"

                                $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr
                            }
                            
                        }
    
                    }
                })
                // cekVitalSign()
            }


            /*function setData (dataLoad) {
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
                            // if (dataLoad[i].emrdfk >= 3122 && dataLoad[i].emrdfk <= 3148) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            if (dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].reportdisplay }
                                $scope.getSkor(datass)
                            }
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 1168 || dataLoad[i].emrdfk == 1257 || dataLoad[i].emrdfk == 3124 || dataLoad[i].emrdfk == 2241 || dataLoad[i].emrdfk == 2242 || dataLoad[i].emrdfk == 2243) {
                        // if (dataLoad[i].type == "combobox")
                            // var str = dataLoad[i].value
                            // var res = str.split("~");
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                            
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: dataLoad[i].emrdfk, text: dataLoad[i].value }

                        }
                        // if (dataLoad[i].emrdfk == 1168) {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { value: dataLoad[i].emrdfk, text: dataLoad[i].text }
                        // }
                        // if (dataLoad[i].image != undefined) {
                        //     $scope.item.image = dataLoad[i].image;      
                        // }
                        // if(dataLoad[i].type == "checkboxtextbox") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                        // }
                        // if(dataLoad[i].type == "textarea") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        // }
                    }

                }
            }
            */

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function() {
                var confirm = $mdDialog.confirm()
                    .title('Konfirmasi')
                    .textContent('Apakah Anda yakin akan menyimpan data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.Saveok();
                })
            }
    
            $scope.Saveok = function() {
                
                $scope.isUpdateCetak=false;
                $scope.isLoading = true
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

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                debugger
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if(arrobj[i] == 3124 || arrobj[i] == 1257  || arrobj[i] == 1582 ) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].value  + '~' + $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1168 ||   arrobj[i] == 2241 || arrobj[i] == 2242 || arrobj[i] == 2243) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                arrSave.push({ id: "2320", values: photo })
                $scope.cc.jenisemr = 'pengkajianawalkulit'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave,
                    image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null
                }
                medifirstService.post('emr/save-emr-dinamis-new', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // medifirstService.postLogging('TMS', 'norec emrpasien_t', e.data.data.norec,
                    //     'Lembar Hasil Tindakan Uji Fungsi Prosedur KFR ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })

                    
                    $scope.isSave=false;
                    $scope.isUpdate=true;
                    $scope.isUpdateCetak=true;

                    var jsonLog = {
                        'jenislog': 'EMR',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Lembar Pengkajian Awal Medis Pasien ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }

                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {

                    })
                    // });

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);


                    LoadCacheHelper() 

                });
                
                $scope.isLoading = false
            }


            
            
            //ash 2023-10-10
 
            $scope.cetakPdf = function(){
                $scope.popUpCetak.center().open();
            }
            $scope.tutupSurat = function(){
                $scope.popUpCetak.close();
            }
            //--------------


            
            /*
            $scope.cetakPdf = function() {

                debugger
                // var signature = $scope.modelGrid.signature.substring(22);
                // tglresume = moment($scope.modelGrid.tglresume).format('DD-MM-YYYY')
                // var namadokter = $scope.modelGrid.namadokter;
                // var noresep = $scope.modelGrid.noresep;
                // var qrcodedokter = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-dokter?reg=" + $scope.modelGrid.noregistrasi;
                // var qrcodepasien = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-pasien?reg=" + $scope.modelGrid.noregistrasi;
                let jumlah = $scope.item.obj.length

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    // "gambarTtd": "logodokkes.jpg",
                    "paramKey": ["gambarTtd", "namaRS", "tgllahirRS", "alamatRS", "noregistrasi", "nocm", "namapasien", "namaruangan", "jeniskelamin", "tgllahir", "1238", "1239", "1240", "1241", "1242", "1243", "1244", "1245", "1246", "1247", "1248", "1249", "1250", "1251", "1252", "1253", "1254", "1255", "1256", "1257", "3124", "1168", "1169", "1170", "1172", "1173", "1174", "1175"],
                    "paramValue": ["logodokkes.jpg", "RS Bhayangkara Tk. I R.Said Sukanto", "1980-12-25 00:00:00", "Jl. Raya Bogor No.1, RT.1/RW.5, Kramat Jati, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13510", $scope.cc.noregistrasi,
                        $scope.cc.nocm, $scope.cc.namapasien, $scope.cc.namaruangan, $scope.cc.jeniskelamin, $scope.cc.tgllahir, $scope.item.obj[1238], $scope.item.obj[1239], $scope.item.obj[1240] , $scope.item.obj[1241], $scope.item.obj[1242], $scope.item.obj[1243], $scope.item.obj[1244], $scope.item.obj[1245], $scope.item.obj[1246], $scope.item.obj[1247], $scope.item.obj[1248], $scope.item.obj[1249], $scope.item.obj[1250], $scope.item.obj[1251], $scope.item.obj[1252], $scope.item.obj[1253], $scope.item.obj[1254], $scope.item.obj[1255], $scope.item.obj[1256], $scope.item.obj[1257].text, $scope.item.obj[3124].text, $scope.item.obj[1168].text, $scope.item.obj[1169], $scope.item.obj[1170], $scope.item.obj[1172], $scope.item.obj[1173], $scope.item.obj[1174], $scope.item.obj[1175]
                    ],
                    "paramType": ["", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else if (window.location.hostname.indexOf('192.168.1.116') > -1) {
                    xhr.open('POST', 'http://192.168.1.116:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:1006/generic/report/pengkajianAwalMedisPasien.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
            }*/
            // function loadValue() {
            //     debugger
            //     medifirstService.get('emr/get-value-from-pengkajian-awal-2?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
            //         for(let i = 0; i < dat.data.length; i++) {
            //             if (dat.data[i].emrdfk == 1168) {
            //                 $scope.item.obj[1168] = {text: dat.data[i].value}
            //             }
            //             if (dat.data[i].emrdfk == 1169) {
            //                 $scope.item.obj[1169] = dat.data[i].value
            //             }
            //             if (dat.data[i].emrdfk == 1170) {
            //                 $scope.item.obj[1170] = dat.data[i].value
            //             }
            //             if (dat.data[i].emrdfk == 1172) {
            //                 $scope.item.obj[1172] = dat.data[i].value
            //             }
            //             if (dat.data[i].emrdfk == 1173) {
            //                 $scope.item.obj[1173] = dat.data[i].value
            //             }
            //             if (dat.data[i].emrdfk == 1174) {
            //                 $scope.item.obj[1174] = dat.data[i].value
            //             }
            //             if (dat.data[i].emrdfk == 1175) {
            //                 $scope.item.obj[1175] = dat.data[i].value
            //             }
            //             if (dat.data[i].emrdfk == 1172) {
            //                 $scope.item.obj[1172] = dat.data[i].value
            //             }
            //         }
            //     })
            //         //
            // }



        }
    ]);
});