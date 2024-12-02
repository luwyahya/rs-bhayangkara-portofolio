define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    
    initialize.controller('AsesmenRehabilitasiMedisCtrl', ['$mdDialog', '$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 2021

            $scope.now = new Date()
            var dataLoad = []
            var data2 = []
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

            $scope.listNyeriAnak = [
                {
                    "id": 3392, "nama": "Hurts", "detail": [
                    { "id": 3393, "nama": "No Hurt", "descNilai": 4 },
                    { "id": 3394, "nama": "Hurts Little Bit", "descNilai": 6 }, 
                    { "id": 3395, "nama": "Hurts Little More", "descNilai": 0 },
                    { "id": 3396, "nama": "Hurts Even More", "descNilai": 8 }, 
                    { "id": 3397, "nama": "Hurts Whole Lot", "descNilai": 2 },
                    { "id": 3398, "nama": "Hurts whorts", "descNilai": 10 }]
                }
            ]
            $scope.listSkorWong = [{
                "id": 3399, "nama": "Score ",
                "detail": [
                    { "id": 3275, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                    { "id": 3276, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                    { "id": 3277, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                    { "id": 3278, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                    { "id": 3279, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                    { "id": 3280, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
                ]
            }]

            $scope.$watch('item.obj[3403]', function(e) {            
                if (e.text == 'Reuse') {
                    $scope.reuse = true;                
                } else {
                    $scope.lainnya = false;
                }
            })
    
            $scope.$watch('item.obj[3275]', function(e) {
                if (e == true) {
                    $scope.item.obj[3283] = '0 - 1'              
                } else {
                    $scope.item.obj[3283] = undefined
                }
            })
            $scope.$watch('item.obj[3276]', function(e) {
                if (e == true) {
                    $scope.item.obj[3283] = '2 - 3'              
                } else {
                    $scope.item.obj[3283] = undefined
                }
            })
            $scope.$watch('item.obj[3277]', function(e) {
                if (e == true) {
                    $scope.item.obj[3283] = '4 - 5'              
                } else {
                    $scope.item.obj[3283] = undefined
                }
            })
            $scope.$watch('item.obj[3278]', function(e) {
                if (e == true) {
                    $scope.item.obj[3283] = '6 - 7'              
                } else {
                    $scope.item.obj[3283] = undefined
                }
            })
            $scope.$watch('item.obj[3279]', function(e) {
                if (e == true) {
                    $scope.item.obj[3283] = '8 - 9'              
                } else {
                    $scope.item.obj[3283] = undefined
                }
            })
            $scope.$watch('item.obj[3280]', function(e) {
                if (e == true) {
                    $scope.item.obj[3283] = '10'              
                } else {
                    $scope.item.obj[3283] = undefined
                }
            })

            $scope.getSkalaNyeri = function (data, stat) {
            
                $scope.item.obj[3283] = undefined
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[3275] = true
                    $scope.item.obj[3283] = '0 - 1' 
                    $scope.item.obj[3276] = false
                    $scope.item.obj[3277] = false
                    $scope.item.obj[3278] = false
                    $scope.item.obj[3279] = false
                    $scope.item.obj[3280] = false
                }
                
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[3275] = false
                    $scope.item.obj[3276] = true
                    $scope.item.obj[3283] = '2 - 3' 
                    $scope.item.obj[3277] = false
                    $scope.item.obj[3278] = false
                    $scope.item.obj[3279] = false
                    $scope.item.obj[3280] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[3275] = false
                    $scope.item.obj[3276] = false
                    $scope.item.obj[3277] = true
                    $scope.item.obj[3283] = '4 - 5' 
                    $scope.item.obj[3278] = false
                    $scope.item.obj[3279] = false
                    $scope.item.obj[3280] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[3275] = false
                    $scope.item.obj[3276] = false
                    $scope.item.obj[3277] = false
                    $scope.item.obj[3278] = true
                    $scope.item.obj[3283] = '6 - 7' 
                    $scope.item.obj[3279] = false
                    $scope.item.obj[3280] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[3275] = false
                    $scope.item.obj[3276] = false
                    $scope.item.obj[3277] = false
                    $scope.item.obj[3278] = false
                    $scope.item.obj[3279] = true
                    $scope.item.obj[3283] = '8 - 9' 
                    $scope.item.obj[3280] = false
                }
    
                if (nilai == 10) {
                    $scope.item.obj[3275] = false
                    $scope.item.obj[3276] = false
                    $scope.item.obj[3277] = false
                    $scope.item.obj[3278] = false
                    $scope.item.obj[3279] = false
                    $scope.item.obj[3280] = true
                    $scope.item.obj[3283] = '10' 
                }
    
            }

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
                            { text: "5", value: 5},
                            { text: "T", value: 6},
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
                    $scope.cc.jenisemr = "pengkajianawalrehab" //init emr
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
                $scope.isRouteLoading = true
                // paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                paramSearch = 'nocm=' + $scope.cc.nocm
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=asesmenrehab", true).then(function(dat) {
                    $scope.isRouteLoading = false
                    // 
                    if (dat.data.data.length > 0) {
                            if (dat.data.data[0].jenisemr == 'asesmenrehab') {
                                lanjut = true;
                            }
                        if (lanjut == true) {
                                $scope.noemr = dat.data.data[0].noemr
                                $scope.cc.norec_emr = dat.data.data[0].noemr
                                nomorEMRSS = ''
                                nomorEMRSS = dat.data.data[0].noemr
                                nomorEMR = nomorEMRSS
                                $scope.cc.emrfk = 2021;
                                setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                                debugger
                        } else {
                                $scope.item.obj[8195] = moment($scope.now).format("YYYY-MM-DD HH:mm")
                                $scope.item.obj[8267] = moment($scope.now).format("YYYY-MM-DD")
                        }
                        // if (dat.data.data[0].jenisemr == 'pengkajianawal') {
                        //     $scope.noemr = dat.data.data[0].noemr
                        //     $scope.cc.norec_emr = dat.data.data[0].noemr
                        //         nomorEMRSS = ''
                        //         nomorEMRSS = dat.data.data[0].noemr
                        //         nomorEMR = nomorEMRSS
                        //         $scope.cc.emrfk = 674;
                        //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                        // } else {
                        //     cekDiagnosa()
                        // }
                    } else {
                        $scope.item.obj[8195] = moment($scope.now).format("YYYY-MM-DD HH:mm")
                        $scope.item.obj[8267] = moment($scope.now).format("YYYY-MM-DD")
                    }
                })
                medifirstService.get('emr/get-combo?').then(function(dat) {
                    $scope.listPegawai = dat.data.dokter;
                    $scope.listTerapis = dat.data.terapis;
                    // var defaultDokter = $scope.listDokter.find(function(dokter) {
                    //     return dokter.id === 50043;
                    // });
                    // if (defaultDokter) {
                    //     $scope.item.obj[1257] = defaultDokter;
                    // }
                    });
                
                $scope.item.obj[1257] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                // loadData()
                getDataKonsul()
                getDataTanggalKonsul()
            }

            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isLoading = false;
                    var chekedd = false;
                    $scope.item.obj = [];
                    $scope.item.obj2 = [];
                    let found8195 = false;
                    let found8267 = false;
            
                    dataLoad = dat.data.data;
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value;
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] };
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "8260") {
                                var str = dataLoad[i].value;
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] };
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "8275") {
                                var str = dataLoad[i].value;
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] };
                            }
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = dataLoad[i].value == '1';
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
                                if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                    $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay });
                                }
                                if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                    var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay };
                                    $scope.getSkor2(datass);
                                }
                                if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                    var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay };
                                    $scope.getSkorNutrisi(datass);
                                }
                            }
                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD');
                                if (dataLoad[i].emrdfk == "8195") {
                                    found8195 = true;
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm');
                                }
                                if (dataLoad[i].emrdfk == "8267") {
                                    found8267 = true;
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('DD-MM-YYYY');
                                }
                            }
                            if (dataLoad[i].type == "timestamp") {
                                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD');
                            }
                            if (dataLoad[i].type == "time") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                            }
                            if (dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value);
                            }
                            if (dataLoad[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                                $scope.item.obj2[dataLoad[i].emrdfk] = true;
                            }
                            if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                            }
                            if (dataLoad[i].type == "photo") {
                                $scope.user.poto = dataLoad[i].value;
                            }
                        }
                    }
                    if (!found8195) {
                        $scope.item.obj[8195] = $scope.now;
                    }
                    if (!found8267) {
                        $scope.item.obj[8267] = $scope.now;
                    }
                });
            }
            

            function getDataKonsul() {
                medifirstService.get('emr/get-data-konsul-rehab?nocm=' + $scope.cc.nocm).then(function (e) {
                    var getData = e.data.data
                    if (getData != null) {
                        $scope.item.norm = getData.nocm
                        $scope.item.namapasien = getData.namapasien
                        $scope.item.pasienttd = getData.pasien
                        $scope.item.tempat = getData.tempat
                        $scope.item.diagnosa = getData.diagnosa
                        $scope.item.perterapi = getData.terapi
                        $scope.item.spkfr = {id: getData.idspkfr, namalengkap: getData.spkfr}
                        $scope.item.tanggal = moment(getData.tanggal).format('YYYY-MM-DD')
                    } else {
                        $scope.item.norm = $scope.cc.nocm
                        $scope.item.namapasien = $scope.cc.namapasien
                        $scope.item.pasienttd = $scope.cc.namapasien
                        $scope.item.tempat = 'Bandung'
                        $scope.item.spkfr = {id: 50043, namalengkap: 'dr. MEINAR FERRYANI,Sp.KFR'}
                        $scope.item.tanggal = moment($scope.now).format('YYYY-MM-DD')

                    }
                })
            }

            $scope.SaveKonsul = function () {
                $scope.now = new Date();
                var jsonKons = {
                    nocm: $scope.item.norm,
                    namapasien: $scope.item.namapasien,
                    diagnosa: $scope.item.diagnosa,
                    terapi: $scope.item.perterapi,
                    tempat: $scope.item.tempat,
                    tanggal: $scope.item.tanggal,
                    pasien: $scope.item.pasienttd,
                    spkfr: $scope.item.spkfr.namalengkap,
                    idspkfr: $scope.item.spkfr.id,
                    created: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    tempKonsul: data2,
                    noregistrasi: $scope.cc.noregistrasi
                }
                medifirstService.post('emr/save-konsul-rehab', jsonKons).then(function (e) {
                    getDataKonsul()
                })
            }

            function setData (dataLoad) {
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
            
                var user = medifirstService.getPegawaiLogin();
                $scope.item.obj[8195] = moment($scope.item.obj[8195]).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[8267] = moment($scope.item.obj[8267]).format('YYYY-MM-DD')
                
                var arrobj = Object.keys($scope.item.obj) 
                var arrSave = [] 
                for (let i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                        if (arrobj[i] == 8260) {
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id + '~' + $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                        } else if (arrobj[i] == 8275) {
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id + '~' + $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                        } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                        }
                    }
                }
                
                $scope.cc.jenisemr = 'asesmenrehab'
                    var jsonSave = {
                        head: $scope.cc,
                        data: arrSave
                    }
                    medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                        nomorEMR = e.data.data.noemr
                        medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                            'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                            + $scope.cc.noregistrasi).then(function (res) {
                            })
    
                        medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                            'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                            + $scope.cc.noregistrasi).then(function (res) {
                            })
                            init()
                           
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    });
            }
    
            // $scope.Saveok = function() {
            //     $scope.isUpdateCetak=true;
            //     var photo = ""
            //     kendo.drawing.drawDOM($(".surface"))
            //         .then(function (group) {
            //             debugger;
            //             // Render the result as a SVG document
            //             return kendo.drawing.exportImage(group);
            //         }).done(function (data) {
            //             photo = data
            //             debugger;
            //         })

            //     var arrobj = Object.keys($scope.item.obj)
            //     var arrSave = []
            //     debugger
            //     for (var i = arrobj.length - 1; i >= 0; i--) {
            //         if(arrobj[i] == 3124 || arrobj[i] == 1257  || arrobj[i] == 1582 ) {
            //             arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].value  + '~' + $scope.item.obj[parseInt(arrobj[i])].text })
            //         } else if (arrobj[i] == 1168 ||   arrobj[i] == 2241 || arrobj[i] == 2242 || arrobj[i] == 2243) {
            //             arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
            //         } else {
            //             arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
            //         }
            //     }
            //     arrSave.push({ id: "2320", values: photo })
            //     $scope.cc.jenisemr = 'pengkajianawalrehab'
            //     var jsonSave = {
            //         head: $scope.cc,
            //         data: arrSave,
            //         image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null
            //     }
            //     medifirstService.post('emr/save-emr-dinamis-new', jsonSave).then(function (e) {
            //         $scope.isSave=false;
            //         $scope.isUpdate=true;
            //         $scope.isUpdateCetak=true;
            //         var jsonLog = {
            //             'jenislog': 'EMR',
            //             'referensi': 'noregistrasi',
            //             'noreff': $scope.cc.noregistrasi,
            //             'keterangan': 'Lembar Pengkajian Awal Medis Pasien ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
            //             + $scope.cc.noregistrasi,
            //             'data': arrSave,
            //             'jenisemr': $scope.cc.jenisemr,
            //             'emrfk': $scope.cc.emrfk
            //         }
            //         medifirstService.postLoggingEMR(jsonLog).then(function(e) {

            //         })
            //         // });

            //         var arrStr = {
            //             0: e.data.data.noemr
            //         }
            //         cacheHelper.set('cacheNomorEMR', arrStr);
            //         LoadCacheHelper()

            //     });
            // }


            
            
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

            function getDataTanggalKonsul() {
                medifirstService.get('emr/get-data-tanggal-konsul-rehab?nocm=' + $scope.cc.nocm).then(function (e) {
                    data2 = e.data.data
                    $scope.dataGridKons = new kendo.data.DataSource({
                        data: data2,
                        length: e.data.data.length,
                        pageSize: 10
                    });
                    console.log($scope.dataGridKons)
                })
            }
            
            $scope.gridOptions = {
                columns: [
                    {
                        "field": "program",
                        "title": "PROGRAM",
                        "width": "90px",
                        "template": "<span class='style-center'>#: program #</span>",
                    },
                    {
                        "field": "tanggal",
                        "title": "TANGGAL",
                        "width": "30px",
                        "template": "#= moment(tanggal).format('YYYY-MM-DD') #"
                    },
                    {
                        "title": "TTD",
                        "width": "50px",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": "namapasien",
                                "title": "PASIEN",
                                "width": "50px",
                            },
                            {
                                "field": "dokter",
                                "title": "DOKTER",
                                "width": "50px",
                            },
                            {
                                "field": "terapis",
                                "title": "TERAPIS",
                                "width": "50px",
                            }
                        ]
                    }
                ],
                pageable: true,
                sortable: true,
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="popUpTanggalKonss()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-plus"></span>Tambah Tanggal Konsul dan Kontrol</button>'
                }]
            };

            $scope.popUpTanggalKonss = function () {
                $scope.popUpTanggalKons.center().open()
            }

            $scope.SaveTglKonsul = function () {
                $scope.now = new Date();
                let dokter = ''
                let iddokter = null
                if ($scope.item.dokterkons != undefined) {
                    dokter = $scope.item.dokterkons.namalengkap
                    iddokter = $scope.item.dokterkons.id
                }
                let terapis = ''
                let idterapis = null
                if ($scope.item.terapis != undefined) {
                    terapis = $scope.item.terapis.namalengkap
                    idterapis = $scope.item.terapis.id
                }
                var jsonKons = {
                    nocm: $scope.cc.nocm,
                    program: $scope.item.program,
                    namapasien: $scope.item.pasienkons,
                    dokter: dokter,
                    iddokter: iddokter,
                    terapis: terapis,
                    idterapis: idterapis,
                    tanggal: moment($scope.item.tanggalkons).format('YYYY-MM-DD HH:mm:ss'),
                    created: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }
                medifirstService.post('emr/save-tanggal-konsul-rehab', jsonKons).then(function (e) {
                    getDataTanggalKonsul()
                    $scope.popUpTanggalKons.close()
                    KosongkanInputanKonsul()
                })
            }

            $scope.TtdPasien = function () {
                if ($scope.dataSelected == null || $scope.dataSelected == undefined || $scope.dataSelected == '') {
                    toastr.error('Data belum dipilih!')
                    return
                }
                medifirstService.post('emr/ttd-pasien-konsul-rehab?norec=' + $scope.dataSelected.norec + '&namapasien=' + $scope.cc.namapasien + '&jenis=' + 'InputTTDPasien').then(function (e) {
                    getDataTanggalKonsul()
                })
            }

            $scope.TtdDokterTerapis = function () {
                if ($scope.dataSelected == null || $scope.dataSelected == undefined || $scope.dataSelected == '') {
                    toastr.error('Data belum dipilih!')
                    return
                }
                $scope.item.dokterkons = {id: $scope.dataSelected.iddokter, namalengkap: $scope.dataSelected.dokter}
                $scope.item.terapis = {id: $scope.dataSelected.idterapis, namalengkap: $scope.dataSelected.terapis}
                $scope.popUpInputDokterTerapis.center().open()
            }

            $scope.SaveDokterTerapis = function () {
                let dokter = ''
                let iddokter = null
                if ($scope.item.dokterkons != undefined) {
                    dokter = $scope.item.dokterkons.namalengkap
                    iddokter = $scope.item.dokterkons.id
                }
                let terapis = ''
                let idterapis = null
                if ($scope.item.terapis != undefined) {
                    terapis = $scope.item.terapis.namalengkap
                    idterapis = $scope.item.terapis.id
                }
                let data = {
                    norec: $scope.dataSelected.norec,
                    jenis: 'InputDokTer',
                    dokter: dokter,
                    iddokter: iddokter,
                    terapis: terapis,
                    idterapis: idterapis
                }
                medifirstService.post('emr/ttd-pasien-konsul-rehab', data).then(function (e) {
                    getDataTanggalKonsul()
                    $scope.popUpInputDokterTerapis.close()
                    KosongkanInputanKonsul()
                })
            }

            $scope.EditKonsul = function () {
                if ($scope.dataSelected == null || $scope.dataSelected == undefined || $scope.dataSelected == '') {
                    toastr.error('Data belum dipilih!')
                    return
                }
                $scope.item.program = $scope.dataSelected.program
                $scope.item.tanggalkons = moment($scope.dataSelected.tanggal).format('YYYY-MM-DD')
                $scope.popUpEditDataKonsul.center().open()
            }

            $scope.EditDataKonsul = function () {
                let data = {
                    norec: $scope.dataSelected.norec,
                    jenis: 'EditData',
                    program: $scope.item.program,
                    tanggal: moment($scope.item.tanggalkons).format('YYYY-MM-DD')
                }
                medifirstService.post('emr/ttd-pasien-konsul-rehab', data).then(function (e) {
                    getDataTanggalKonsul()
                    $scope.popUpEditDataKonsul.close()
                    KosongkanInputanKonsul()
                })
            }

            $scope.HapusKonsul = function () {
                let data = {
                    norec: $scope.dataSelected.norec,
                    jenis: 'HapusData',
                }
                medifirstService.post('emr/ttd-pasien-konsul-rehab', data).then(function (e) {
                    getDataTanggalKonsul()
                    $scope.popUpEditDataKonsul.close()
                    KosongkanInputanKonsul()
                })
            }

            function KosongkanInputanKonsul() {
                $scope.item.program = ''
                $scope.item.tanggalkons = ''
                $scope.item.dokterkons = undefined
                $scope.item.terapis = undefined
            }

            $scope.cetakKonsul = function () {
                window.open(config.baseApiBackend + "report/cetak-konsul-rehab?nocm=" + $scope.cc.nocm, '_blank')
            }
        }
    ]);
});