define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MonitoringTranfusiDarahCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            $scope.item = {};
            $scope.item.obj = []
            $scope.golongandarahfk = null
            $scope.idpasien = null
            var nomorEMRSS = '';
            var nomorEMR = '-'
            var paramSearch = ''
            $scope.showLainLain = false;
            $scope.reaksiLainnya = false;
            $scope.now = new Date(); 
            $scope.cc.emrfk = 2020
            var dataLoad = []
            var user = medifirstService.getPegawaiLogin();
            $scope.item.obj[1466] = { id: user.id, namalengkap: user.namaLengkap }
            // $scope.item.obj[4172] = $scope.now
            loadCombo()
            LoadCacheHelper()
            

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
                    $scope.cc.jenisemr = "monitoringtranfusidarah"
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    init()
                }
            }

            function loadCombo() {
                medifirstService.get('emr/get-combo').then(function (dat) {
                    $scope.listPerawat = dat.data.pegawai
                    $scope.listGolonganDarah = dat.data.golongandarah
                })
    
               
            }

            $scope.listjjd = [
                {'id' : 1, 'text': 'PRC'},
                {'id' : 2, 'text': 'WB'},
                {'id' : 3, 'text': 'Lain-lain'},
            ];

            function init() {
                $scope.cc.norec_emr = '-'
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-riwayat-monitoring-tranfusi-darah?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                    $scope.isRouteLoading = false;                        
                    let data = dat.data.data
                    debugger
                    if(dat.data.pasien && dat.data.pasien.golongandarahfk != null && dat.data.pasien.golongandarahfk != '') {
                        $scope.item.obj[1501] = { id: dat.data.pasien.golongandarahfk, golongandarah: dat.data.pasien.golongandarah }
                    }

                    $scope.idpasien = dat.data.pasien.idpasien
                    
                    for(let i = 0; i < data.length; i++) {
                        data[i].no = i + 1;
                        data[i].tglTD = moment(data[i].tglTD).format('DD-MM-YYYY HH:mm:ss');
                    }
                    
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
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

            $scope.showReaksiLain = (data) => {
                if(data == true) {
                    $scope.reaksiLainnya = true;
                } else {
                    $scope.reaksiLainnya = false;
                }
            };

            $scope.verifikasi = function() {
                // console.log($scope.modelGrid);

                if($scope.dataSelected == undefined || $scope.dataSelected.norec == undefined || $scope.dataSelected.norec == null || $scope.dataSelected.norec == '') {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return
                }

                if ($scope.dataSelected.statusverif == "Sudah diverifikasi") {
                    toastr.error('Data Sudah Diverifikasi', 'Peringatan !');
                    return;
                }
                
                 
                var stt = 'false'
                if (confirm('Verifikasi Monitoring Tranfusi Darah ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                }
                 
                if (stt == 'true') {
                    var update = {
                        // norecemr: $scope.modelGrid.noemr
                        norecemr: $scope.dataSelected.norec
                    }
                    medifirstService.post('emr/save-verifikasi-monitoring-tranfusi-darah', update).then(function(dat) {
                        init()
                    })
                }
            }

            $scope.$watch('item.obj[1418]', function (e) {
                // debugger;
                if (e === undefined) return;
                
                if (e.id == 3) {
                    $scope.showLainLain = true
                } else {
                    $scope.showLainLain = false
                }
            })

            $scope.unverifikasi = function() {
                // console.log($scope.modelGrid);

                if($scope.dataSelected == undefined || $scope.dataSelected.norec == undefined || $scope.dataSelected.norec == null || $scope.dataSelected.norec == '') {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return
                }

                if ($scope.dataSelected.statusverif == "Belum diverifikasi") {
                    toastr.error('Data Belum Diverifikasi', 'Peringatan !');
                    return;
                }
                
                 
                var stt = 'false'
                if (confirm('Unerifikasi Monitoring Tranfusi Darah ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                }
                 
                if (stt == 'true') {
                    var update = {
                        // norecemr: $scope.modelGrid.noemr
                        norecemr: $scope.dataSelected.norec
                    }
                    medifirstService.post('emr/save-unverifikasi-monitoring-tranfusi-darah', update).then(function(dat) {
                        init()
                    })
                }
            }

            $scope.hapus = function() {
                // console.log($scope.modelGrid);

                if($scope.dataSelected == undefined || $scope.dataSelected.norec == undefined || $scope.dataSelected.norec == null || $scope.dataSelected.norec == '') {
                    toastr.error('Data Belum Dipilih', 'Peringatan !');
                    return
                }
                 
                var stt = 'false'
                if (confirm('Hapus Riwayat Monitoring Tranfusi Darah ?')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                }
                 
                if (stt == 'true') {
                    var update = {
                        // norecemr: $scope.modelGrid.noemr
                        norecemr: $scope.dataSelected.norec
                    }
                    medifirstService.post('emr/hapus-monitoring-tranfusi-darah', update).then(function(dat) {
                        init()
                    })
                }
            }

            $scope.edit = function () {
                getDataEdit()
            }
            function getDataEdit() {
                if($scope.dataSelected == undefined || $scope.dataSelected.norec == undefined || $scope.dataSelected.norec == null || $scope.dataSelected.norec == '') {
                    toastr.error('Pilih data di grid untuk diedit !')
                    return
                }
                $scope.cc.norec_emr = $scope.dataSelected.noemr
                var nomorEMRSS = $scope.dataSelected.noemr
                var emrfk = $scope.dataSelected.emrfk
                $scope.isRouteLoading = true
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    
                    debugger
                    // $scope.item.obj[68] = $scope.now
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "checkbox") {
                                if(dataLoad[i].emrdfk == "54" && dataLoad[i].value == 1){
                                    $scope.reaksiLainnya = true;
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = true;
                            }
                            
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }

                            if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }

                            if (dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }

                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1466") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }
                            }

                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1418") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], text: res[1] }
                            }

                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1501") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], golongandarah: res[1] }
                            }
                        }
    
                    }

                })
            }

            
            

            $scope.Batal = function () {
                $scope.item.obj = []
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                $scope.isRouteLoading = true
                // $scope.isLoading = true
                var user = medifirstService.getPegawaiLogin();
                if($scope.item.obj[1501] != undefined) {
                    if($scope.item.obj[1501].id != undefined && $scope.item.obj[1501].id != null && $scope.item.obj[1501].id != '') {
                        $scope.golongandarahfk = $scope.item.obj[1501].id
                    } else {
                        $scope.golongandarahfk = null
                    }
                } else {
                    $scope.golongandarahfk = null
                }

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {

                    if (arrobj[i] == 1418) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1466) {
                       arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 1501) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].golongandarah })
                    } else{
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }

                    // arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'monitoringtranfusidarah'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                $scope.tombolSimpanVis = false
                debugger
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.cc.norec_emr = '-'
                    // $scope.isLoading = false
                    nomorEMR = e.data.data.noemr
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    // init()
                    var jsonLog = {
                        'jenislog': 'Simpan Monitoring Tranfusi darah',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Simpan Monitoring Tranfusi darah' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {
                        
                    })

                    

                    if($scope.golongandarahfk != undefined && $scope.golongandarahfk != null && $scope.golongandarahfk != '') {
                        var jsonSave2 = {
                            'pasienid' : $scope.idpasien,
                            'golongandarahfk' : $scope.golongandarahfk
                        }
                        medifirstService.post('emr/save-update-golongandarah-pasien', jsonSave2).then(function (e) {
                            $scope.item.obj = []
                        $scope.cc.norec_emr = "-"
                        $scope.tombolSimpanVis = true
                        init()
                        })
                    } else {
                        $scope.item.obj = []
                        $scope.cc.norec_emr = "-"
                        $scope.tombolSimpanVis = true
                        init()
                    }

                    // $scope.item.obj = []
                    // $scope.cc.norec_emr = "-"
                    // $scope.tombolSimpanVis = true
                    // init()

                });
            }

            $scope.columnGridRiwayat = [
                {
                    "field": "no",  
                    "title": "No",
                    "width": "5px",
                    "template": "<span class='style-center'>#: no #</span>",
                },  
                {
                    "field": "tglTD",
                    "title": "Tanggal Monitoring",
                    "width": "20px",
                },               
                {
                    "field": "noregistrasifk",
                    "title": "No. Registrasi",
                    "width": "30px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "30px",
                }, 
                {
                    "field": "jenisdarah",
                    "title": "Jenis Darah",
                    "width": "30px",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                    "width": "30px",
                },
                {
                    "field": "statusverif",
                    "title": "Status Verif",
                    "width": "20px",
                    attributes: {
                        class: "#=statusverif != 'Sudah diverifikasi' ? 'red' : 'hejo' #"
                    },
                },              
            ];

            $scope.default = true
            $scope.default2 = false
            $scope.default3 = false
            $scope.default4 = false
            $scope.default5 = false
            $scope.default6 = false
            $scope.default7 = false
            $scope.default8 = false
            $scope.default9 = false
            $scope.btnAddTtv = true

            $scope.listTtv = [
                { "id": 1, "nama": "Baris 1", "detail":
                    [
                        { "id": 1, "nama": "Tanda Vital / Menit", "type": "label", "show" : "default" },
                        { "id": 2, "nama": "15", "type": "label", "show" : "default" },
                        { "id": 3, "nama": "30", "type": "label", "show" : "default" },
                        { "id": 4, "nama": "45", "type": "label", "show" : "default" },
                        { "id": 5, "nama": "60", "type": "label", "show" : "default" },
                        { "id": 6, "nama": "75", "type": "label", "show" : "default" },
                        { "id": 7, "nama": "90", "type": "label", "show" : "default" },
                        { "id": 8, "nama": "105", "type": "label", "show" : "default" },
                        { "id": 9, "nama": "120", "type": "label", "show" : "default" },
                        { "id": 10, "nama": "135", "type": "label", "show" : "default2" },
                        { "id": 11, "nama": "150", "type": "label", "show" : "default3" },
                        { "id": 12, "nama": "165", "type": "label", "show" : "default4" },
                        { "id": 13, "nama": "180", "type": "label", "show" : "default5" },
                        { "id": 14, "nama": "195", "type": "label", "show" : "default6" },
                        { "id": 15, "nama": "210", "type": "label", "show" : "default7" },
                        { "id": 16, "nama": "225", "type": "label", "show" : "default8" },
                        { "id": 17, "nama": "240", "type": "label", "show" : "default9" },
                    ]
                },
                { "id": 2, "nama": "Baris 2", "detail":
                    [
                        { "id": 1, "nama": "Tekanan Darah", "type": "label", "show" : "default" },
                        { "id": 22, "nama": "15", "type": "textbox", "show" : "default" },
                        { "id": 32, "nama": "30", "type": "textbox", "show" : "default" },
                        { "id": 33, "nama": "45", "type": "textbox", "show" : "default" },
                        { "id": 34, "nama": "60", "type": "textbox", "show" : "default" },
                        { "id": 35, "nama": "75", "type": "textbox", "show" : "default" },
                        { "id": 36, "nama": "90", "type": "textbox", "show" : "default" },
                        { "id": 37, "nama": "105", "type": "textbox", "show" : "default" },
                        { "id": 38, "nama": "120", "type": "textbox", "show" : "default" },
                        { "id": 39, "nama": "135", "type": "textbox", "show" : "default2" },
                        { "id": 69, "nama": "150", "type": "textbox", "show" : "default3" },
                        { "id": 84, "nama": "165", "type": "textbox", "show" : "default4" },
                        { "id": 85, "nama": "180", "type": "textbox", "show" : "default5" },
                        { "id": 95, "nama": "195", "type": "textbox", "show" : "default6" },
                        { "id": 104, "nama": "210", "type": "textbox", "show" : "default7" },
                        { "id": 108, "nama": "225", "type": "textbox", "show" : "default8" },
                        { "id": 113, "nama": "240", "type": "textbox", "show" : "default9" },
                    ]
                },
                { "id": 3, "nama": "Baris 3", "detail":
                    [
                        { "id": 1, "nama": "Nadi", "type": "label", "show" : "default" },
                        { "id": 120, "nama": "15", "type": "textbox", "show" : "default" },
                        { "id": 122, "nama": "30", "type": "textbox", "show" : "default" },
                        { "id": 124, "nama": "45", "type": "textbox", "show" : "default" },
                        { "id": 133, "nama": "60", "type": "textbox", "show" : "default" },
                        { "id": 136, "nama": "75", "type": "textbox", "show" : "default" },
                        { "id": 141, "nama": "90", "type": "textbox", "show" : "default" },
                        { "id": 142, "nama": "105", "type": "textbox", "show" : "default" },
                        { "id": 143, "nama": "120", "type": "textbox", "show" : "default" },
                        { "id": 144, "nama": "135", "type": "textbox", "show" : "default2" },
                        { "id": 145, "nama": "150", "type": "textbox", "show" : "default3" },
                        { "id": 146, "nama": "165", "type": "textbox", "show" : "default4" },
                        { "id": 153, "nama": "180", "type": "textbox", "show" : "default5" },
                        { "id": 155, "nama": "195", "type": "textbox", "show" : "default6" },
                        { "id": 156, "nama": "210", "type": "textbox", "show" : "default7" },
                        { "id": 161, "nama": "225", "type": "textbox", "show" : "default8" },
                        { "id": 163, "nama": "240", "type": "textbox", "show" : "default9" },
                    ]
                },
                { "id": 4, "nama": "Baris 4", "detail":
                    [
                        { "id": 1, "nama": "Respirasi", "type": "label", "show" : "default" },
                        { "id": 164, "nama": "15", "type": "textbox", "show" : "default" },
                        { "id": 175, "nama": "30", "type": "textbox", "show" : "default" },
                        { "id": 176, "nama": "45", "type": "textbox", "show" : "default" },
                        { "id": 177, "nama": "60", "type": "textbox", "show" : "default" },
                        { "id": 186, "nama": "75", "type": "textbox", "show" : "default" },
                        { "id": 187, "nama": "90", "type": "textbox", "show" : "default" },
                        { "id": 195, "nama": "105", "type": "textbox", "show" : "default" },
                        { "id": 217, "nama": "120", "type": "textbox", "show" : "default" },
                        { "id": 219, "nama": "135", "type": "textbox", "show" : "default2" },
                        { "id": 221, "nama": "150", "type": "textbox", "show" : "default3" },
                        { "id": 223, "nama": "165", "type": "textbox", "show" : "default4" },
                        { "id": 225, "nama": "180", "type": "textbox", "show" : "default5" },
                        { "id": 226, "nama": "195", "type": "textbox", "show" : "default6" },
                        { "id": 227, "nama": "210", "type": "textbox", "show" : "default7" },
                        { "id": 228, "nama": "225", "type": "textbox", "show" : "default8" },
                        { "id": 229, "nama": "240", "type": "textbox", "show" : "default9" },
                    ]
                },
                { "id": 5, "nama": "Baris 5", "detail":
                    [
                        { "id": 1, "nama": "Suhu", "type": "label", "show" : "default" },
                        { "id": 230, "nama": "15", "type": "textbox", "show" : "default" },
                        { "id": 231, "nama": "30", "type": "textbox", "show" : "default" },
                        { "id": 232, "nama": "45", "type": "textbox", "show" : "default" },
                        { "id": 233, "nama": "60", "type": "textbox", "show" : "default" },
                        { "id": 234, "nama": "75", "type": "textbox", "show" : "default" },
                        { "id": 235, "nama": "90", "type": "textbox", "show" : "default" },
                        { "id": 236, "nama": "105", "type": "textbox", "show" : "default" },
                        { "id": 237, "nama": "120", "type": "textbox", "show" : "default" },
                        { "id": 238, "nama": "135", "type": "textbox", "show" : "default2" },
                        { "id": 239, "nama": "150", "type": "textbox", "show" : "default3" },
                        { "id": 240, "nama": "165", "type": "textbox", "show" : "default4" },
                        { "id": 241, "nama": "180", "type": "textbox", "show" : "default5" },
                        { "id": 242, "nama": "195", "type": "textbox", "show" : "default6" },
                        { "id": 243, "nama": "210", "type": "textbox", "show" : "default7" },
                        { "id": 244, "nama": "225", "type": "textbox", "show" : "default8" },
                        { "id": 245, "nama": "240", "type": "textbox", "show" : "default9" },
                    ]
                },
            ]


            $scope.tambahInputanTtv = function() {
                if($scope.default === true && $scope.default2 != true && $scope.default3 != true 
                    && $scope.default4 != true && $scope.default5 != true && $scope.default6 != true 
                    && $scope.default7 != true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 != true 
                    && $scope.default4 != true && $scope.default5 != true && $scope.default6 != true 
                    && $scope.default7 != true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 === true 
                    && $scope.default4 != true && $scope.default5 != true && $scope.default6 != true 
                    && $scope.default7 != true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.default4 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 === true 
                    && $scope.default4 === true && $scope.default5 != true && $scope.default6 != true 
                    && $scope.default7 != true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.default4 = true
                        $scope.default5 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 === true 
                    && $scope.default4 === true && $scope.default5 === true && $scope.default6 != true 
                    && $scope.default7 != true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.default4 = true
                        $scope.default5 = true
                        $scope.default6 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 === true 
                    && $scope.default4 === true && $scope.default5 === true && $scope.default6 === true 
                    && $scope.default7 != true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.default4 = true
                        $scope.default5 = true
                        $scope.default6 = true
                        $scope.default7 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 === true 
                    && $scope.default4 === true && $scope.default5 === true && $scope.default6 === true 
                    && $scope.default7 === true && $scope.default8 != true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.default4 = true
                        $scope.default5 = true
                        $scope.default6 = true
                        $scope.default7 = true
                        $scope.default8 = true
                        $scope.btnAddTtv = true
                } else if($scope.default === true && $scope.default2 === true && $scope.default3 === true 
                    && $scope.default4 === true && $scope.default5 === true && $scope.default6 === true 
                    && $scope.default7 === true && $scope.default8 === true && $scope.default9 != true ) {
                        $scope.default2 = true
                        $scope.default3 = true
                        $scope.default4 = true
                        $scope.default5 = true
                        $scope.default6 = true
                        $scope.default7 = true
                        $scope.default8 = true
                        $scope.default9 = true
                        $scope.btnAddTtv = false
                }
            }

        }
    ]);
});