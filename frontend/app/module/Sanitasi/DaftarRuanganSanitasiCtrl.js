define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRuanganSanitasiCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.iteung = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var jenisForm = 0
            var tabNumber = 1
            var norec = '';
            var pegawaiUser = {}
            //$scope.item.tittle = "Daftar Tempat Tidur"
            LoadHeader();
            LoadCache();
            loadCombo();
            init2();


            function LoadHeader(){
                if ($state.params.jenis == "1") {
                    $scope.iteung.title = 'Manajemen Kebersihan Tempat Tidur'
                    jenisForm = 1
                }
                if ($state.params.jenis == "2") {
                    $scope.iteung.title = 'Manajemen Kebersihan Area RS'
                    jenisForm = 2
                }
                if ($state.params.jenis == "3") {
                    $scope.iteung.title = 'Manajemen Pest Control'
                    jenisForm = 3
                }
                if ($state.params.jenis == "4") {
                    $scope.iteung.title = 'Manajemen Saluran Air Limbah'
                    jenisForm = 4
                }
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarRuanganSanitasiCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init2();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = $scope.now;
                    init2();
                }
            }
           
            function loadCombo() {
                medifirstService.get("rawatinap/get-combo-pasien-masih-dirawat", false).then(function (data) {
                    // $scope.listDepartemen = data.data.departemen;
                    // $scope.listKelompokPasien = data.data.kelompokpasien;
                    var data = data.data
                    $scope.listRuangan = data.ruanganRi
                    var dt = medifirstService.getMapLoginUserToRuangan();
                    $scope.idruangan = dt
                    $scope.item.idruanganD = {id:dt[0].id , namaruangan:dt[0].namaruangan}
                    var datasu = data;
                    $scope.item.kdPelayananRanap = datasu.kddeptlayananranap.nilaifield;
                    $scope.item.kdPelayananOk = datasu.kddeptlayananok.nilaifield;
                })
                medifirstService.getPart("sanitasi/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDataPegawai = data;

                });
                medifirstService.get("sanitasi/get-combo-jenispek", true, true, 20).then(function (data) {
                    $scope.listDataJenisPek = data.data;

                    if ($state.params.jenis == "1") {
                        $scope.item.jenispek = $scope.listDataJenisPek[0]
                        jenisForm = 1
                    }
                    if ($state.params.jenis == "2") {
                        $scope.item.jenispek = $scope.listDataJenisPek[1]
                        jenisForm = 2
                    }
                    if ($state.params.jenis == "3") {
                        $scope.item.jenispek = $scope.listDataJenisPek[2]
                        jenisForm = 3
                    }
                    if ($state.params.jenis == "4") {
                        $scope.item.jenispek = $scope.listDataJenisPek[3]
                        jenisForm = 4
                    }

                });
            }

            $scope.newOrder = function () {
                $state.go('OrderBarangLogistik')
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();            
            }

            $scope.deleteOrder = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.statusorder != '') {
                    alert("Sudah di kirim tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave =
                {
                    norecorder: $scope.dataSelected.norec
                }

                medifirstService.post('logistik/delete-order-barang-ruangan',objSave).then(function (e) {
                    init2()
                })
            }

            function init2() {
               
                $scope.isRouteLoading = false;
                // var desc = ""
                // if ($scope.item.desc != undefined) {
                //     var desc = "&desc=" + $scope.item.cariDesc
                // }
                // var manage = ''
                // if (tabNumber == 1) {
                //     manage = 'aingmacan'
                // }
                var tempjenisPek = ''
                if ($state.params.jenis == "1") {
                        tempjenisPek = "&tempjenisPek=4";
                }
                if ($state.params.jenis == "2") {
                        tempjenisPek = "&tempjenisPek=5";
                }
                if ($state.params.jenis == "3") {
                        tempjenisPek = "&tempjenisPek=6";
                }
                if ($state.params.jenis == "4") {
                        tempjenisPek = "&tempjenisPek=7";
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("sanitasi/get-data-sanitasi?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempjenisPek
                    , true).then(function (dat) {
                        var data2 = dat.data;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                        }
                        $scope.optionGridMaster = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });
                        $scope.optionGridMasterHis = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarRuanganSanitasiCtrl', chacePeriode);
            }

            // function init() {
            //     $scope.isRouteLoading = false;
            //     var desc = ""
            //     if ($scope.item.desc != undefined) {
            //         var desc = "&desc=" + $scope.item.cariDesc
            //     }
            //     var manage = ''
            //     if (tabNumber == 1) {
            //         manage = 'aingmacan'
            //     }
            //     var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
            //     var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
            //     medifirstService.get("sanitasi/get-tempat-tidur?" +
            //         "tglAwal=" + tglAwal +
            //         "&tglAkhir=" + tglAkhir + desc + '&arrru=' + jenisForm +
            //         "&manage=" + manage
            //         , true).then(function (dat) {
            //             $scope.isRouteLoading = false;
            //             var data2 = dat.data;                       
            //             for (var i = 0; i < data2.length; i++) {
            //                 data2[i].no = i + 1
            //             }
            //             $scope.optionGridMaster = new kendo.data.DataSource({
            //                 data: data2,
            //                 group: $scope.group,
            //                 pageSize: 100,
            //                 total: data2.length,
            //                 serverPaging: false,
            //                 schema: {
            //                     model: {
            //                     }
            //                 }
            //             });
            //         });

            //     var chacePeriode = {
            //         0: tglAwal,
            //         1: tglAkhir,
            //         2: '',
            //         3: '',
            //         4: '',
            //         5: '',
            //         6: ''
            //     }
            //     cacheHelper.set('DaftarRuanganSanitasiCtrl', chacePeriode);
            // }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                tabNumber = 2
                init2();
            }   

            $scope.cariFilter2 = function () {
                tabNumber = 1
                init2();
            } 


            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.EditOrder = function () {
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    alert('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditOrder',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangLogistikCtrl', chacePeriode);
                $state.go('OrderBarangLogistik')
            }

            $scope.KirimBarang = function () {
                if ($scope.dataSelected.status != 'Terima Order Barang') {
                    alert('Tidak bisa mengirim ke ruangan Sendiri!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: '',
                    1: $scope.dataSelected.norec,
                    2: 'KirimBarang',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }           
           
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.optionGridMaster = {
                 toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Kegiatan</button>'
                },],
                pageable: true,
                columns: 
                [
                    { 
                       "field": "no",
                       "title": "No",
                       "width": "50px",
                       attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        } 
                      
                    },
                    { 
                       "field": "namaruangan", 
                       "title": "Ruangan",
                       "width": "200px"
                       

                    },
                    { 
                       "field": "tglplanning", 
                       "title": "Jadwal",
                       "width": "200px"
                       

                    },
                    { 
                       "field": "napek", 
                       "title": "Jenis Kegiatan",
                       "width": "250px"
                       

                    },                
                    { 
                      "field": "nama",
                       "title": "Alokasi staff",
                       "width": "200px"
                    },
                    { 
                        "field": "startdate",
                        "title": "Tgl Mulai",
                        "width": "200px"
                         
                        
                    },
                    { 
                        "field": "duedate",
                        "title": "Tgl Selesai",
                        "width": "200px"
                         
                        
                    },
                    { 
                        "field": "worklist",
                        "title": "WorkList",
                        "width": "200px"
                         
                        
                    },
                    { 
                        "field": "keteranganverifikasi",
                        "title": "Status",
                        "width": "200px"
                         
                        
                    },
                    
                ]
            }

            $scope.optionGridMasterHis = {
                pageable: true,
                columns: 
                [
                    { 
                       "field": "no",
                       "title": "No",
                       "width": "50px",
                       attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        } 
                      
                    },
                    { 
                       "field": "namaruangan", 
                       "title": "Ruangan",
                       "width": "200px"
                       

                    },
                    { 
                       "field": "tglplanning", 
                       "title": "Jadwal",
                       "width": "200px"
                       

                    },
                    { 
                       "field": "napek", 
                       "title": "Jenis Kegiatan",
                       "width": "250px"
                       

                    },                
                    { 
                      "field": "nama",
                       "title": "Alokasi staff",
                       "width": "200px"
                    },
                    { 
                        "field": "startdate",
                        "title": "Tgl Mulai",
                        "width": "200px"
                         
                        
                    },
                    { 
                        "field": "duedate",
                        "title": "Tgl Selesai",
                        "width": "200px"
                         
                        
                    },
                    { 
                        "field": "worklist",
                        "title": "WorkList",
                        "width": "200px"
                         
                        
                    },
                    { 
                        "field": "keteranganverifikasi",
                        "title": "Status",
                        "width": "200px"
                         
                        
                    },
                    
                ]
            }


            // $scope.data2 = function (dataItem) {
            //     return {
            //         dataSource: new kendo.data.DataSource({
            //             data: dataItem.details
            //         }),
            //         columns: [
            //             {
            //                 "field": "no",
            //                 "title": "No",
            //                 "width": "35px",
            //             },
            //             {
            //                 "field": "kdproduk",
            //                 "title": "Kd Produk",
            //                 "width": "70px",
            //             },
            //             {
            //                 "field": "kdsirs",
            //                 "title": "Kd Sirs",
            //                 "width": "70px",
            //             },
            //             {
            //                 "field": "namaproduk",
            //                 "title": "Nama Produk",
            //                 "width": "100px",
            //             },
            //             {
            //                 "field": "satuanstandar",
            //                 "title": "Satuan",
            //                 "width": "30px",
            //             },
            //             {
            //                 "field": "qtyproduk",
            //                 "title": "Qty",
            //                 "width": "30px",
            //             }
            //     ]}
            // };
           
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            $scope.inputBaru = function () {               
                $scope.popupTambah.center().open();
            }
            $scope.batal = function () {            
                $scope.popupTambah.close();   
            }

            $scope.save = function () {
                var listRawRequired = [
                    "item.tanggal|k-ng-model|Tanggal",
                    "item.ruangan|k-ng-model|Ruangan",
                    "item.pegawai|k-ng-model|Pegawai",
                    "item.keterangan|k-ng-model|Keterangan"
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                     
                    var data = {
                        "norec" : norec,
                        "objectruanganasalfk" :$scope.item.idruanganD != undefined ? $scope.item.idruanganD.id : null,
                        "tglplanning" :moment($scope.item.tanggal).format('YYYY-MM-DD HH:mm'),                        
                        "objectjenispekerjaanfk" :$scope.item.jenispek != undefined ? $scope.item.jenispek.value : null,
                        "objectruanganfk" :$scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                        "objectpegawaipjawabfk" :$scope.item.pegawai != undefined ? $scope.item.pegawai.id : null,
                        "deskripsiplanning" :$scope.item.keterangan != undefined ? $scope.item.keterangan : 0,

                        
                    }
                    medifirstService.post("sanitasi/save-tambah-kegiatan", data).then(function (e) {
                        LoadHeader();
                        init2();
                        loadCombo();
                        $scope.item = {}
                        $scope.popupTambah.close(); 
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }
                   
            $scope.signDate = function () {
            if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Data dulu');
                } else {
                $scope.popupSignDate.center().open();

                norec = $scope.dataSelected.norec;
                $scope.item.idruangan =  $scope.dataSelected.namaruangan;
                $scope.item.desc =  $scope.dataSelected.deskripsiplanning;

                }               
                
            }
            $scope.batalSD = function () {            
                $scope.popupSignDate.close();   
            }
            $scope.saveSD = function () {        
                var objSave = 
                    {
                        "norec" : norec,
                        "signdate" : moment($scope.item.signdate).format('YYYY-MM-DD HH:mm'),
                        //"deskripsiplanning" :$scope.item.desc != undefined ? $scope.item.desc : 0,
                        //"objectruanganfk" :$scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                    }
                medifirstService.post('sanitasi/save-data-signdate',objSave).then(function(e) {
                    $scope.popupSignDate.close();
                    init2()
                    loadCombo();
                    $scope.item = {}
                    $scope.popupTambah.close(); 
                })    
                   
            }

            $scope.alokasiStaff = function () {
             if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Data dulu');
                } else {
                $scope.popupAlokasiStaff.center().open();
                norec = $scope.dataSelected.norec;
                $scope.item.pegawai = { id: $scope.dataSelected.objectpegawaipjawabfk, namalengkap: $scope.dataSelected.nama };
                $scope.item.desc =  $scope.dataSelected.deskripsiplanning;

                }                     
            }
            $scope.batalAS = function () {            
                $scope.popupAlokasiStaff.close();   
            }
            $scope.saveAS = function () {        
                var objSave = 
                    {
                        "norec" : norec,
                        "objectpegawaipjawabfk" : $scope.item.pegawai.id
                    }
                medifirstService.post('sanitasi/save-data-alokasistaff',objSave).then(function(e) {
                    $scope.popupAlokasiStaff.close();
                    init2()
                })    
                   
            }

            $scope.worklist = function () {
            if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Data dulu');
                } else {
                $scope.popupWorkList.center().open();
                norec = $scope.dataSelected.norec;
                //$scope.item.pegawai = { id: dataPasienSelected.pgid, namalengkap: dataSelected.nama }
                $scope.item.desc =  $scope.dataSelected.deskripsiplanning
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.worklist =  $scope.dataSelected.worklist
                }                  
                
                
            }
            $scope.batalWL = function () {            
                $scope.popupWorkList.close();   
            }
            $scope.saveWL = function () {        
                var objSave = 
                    {
                        "norec" : norec,
                        "worklist" : $scope.item.worklist
                    }
                medifirstService.post('sanitasi/save-data-worklist',objSave).then(function(e) {
                    $scope.popupWorkList.close();
                    init2()
                })    
                   
            }

            $scope.Inspeksi = function () {
            if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Data dulu');
                } else {
                norec = $scope.dataSelected.norec;
                $scope.popupInspeksi.center().open();
                $scope.item.desc =  $scope.dataSelected.deskripsiplanning
                $scope.item.inspeksi = $scope.dataSelected.keteranganverifikasi
                $scope.item.pegawai = { id: $scope.dataSelected.objectpegawaipjawabevaluasifk, namalengkap: $scope.dataSelected.namaevaluasi };
                }                   
            }
            $scope.bataIS = function () {            
                $scope.popupInspeksi.close();   
            }
            $scope.saveIS = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        keteranganverifikasi : $scope.item.inspeksi,
                        objectpegawaipjawabevaluasifk : $scope.item.staff.id
                    }
                medifirstService.post('sanitasi/save-inspeksi',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }


            $scope.startBtn = function () {
            if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Data dulu');
                    return;
                } else {
                norec = $scope.dataSelected.norec;
                }           
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec
                    }
                medifirstService.post('sanitasi/save-startdate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.finishBtn = function () {
            if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Data dulu');
                    return;
                } else {
                norec = $scope.dataSelected.norec;
                }        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec
                    }
                medifirstService.post('sanitasi/save-duedate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.DetailBtn = function () {               
                $scope.popupDetail.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan

                $scope.item.signdate =  $scope.dataSelected.tglplanning
                $scope.item.startdate =  $scope.dataSelected.startdate
                $scope.item.duedate =  $scope.dataSelected.duedate
                $scope.item.staff =  $scope.dataSelected.nama
                $scope.item.worklist =  $scope.dataSelected.deskripsiplanning
                $scope.item.inspeksi =  $scope.dataSelected.keteranganverifikasi
                $scope.item.inspeksistaff =  $scope.dataSelected.namaevaluasi
            }
            $scope.batalDetail = function () {            
                $scope.popupDetail.close();   
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan1 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai1 = $scope.item.DataPegawai2.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan2 = $scope.item.DataJabatan.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai2 = $scope.item.DataPegawai.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-order=1&nores=' + $scope.dataSelected.norec + '&pegawaiMegetahui=' + pegawai1 + '&pegawaiMeminta=' + pegawai2
                    + '&jabatanMengetahui=' + jabatan1 + '&jabatanMeminta=' + jabatan2 + '&view=' + stt + '&user=' + pegawaiUser[0].namalengkap, function (response) {
                        //aadc=response; 

                    });                
                $scope.popUp.close();
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
            //*************
        }
    ]);
});