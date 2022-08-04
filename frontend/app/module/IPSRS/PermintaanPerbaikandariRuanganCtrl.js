define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PermintaanPerbaikandariRuanganCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var jenisForm = 0
            var tabNumber = 1
            var pegawaiUser = {}
            // if ($state.params.jenis == "1") {
            //     $scope.item.title = 'Manajemen Kebersihan Tempat Tidur'
            //     jenisForm = 16
            // }
            // if ($state.params.jenis == "2") {
            //     $scope.item.title = 'Manajemen Kebersihan Area RS'
            //     jenisForm = 35
            // }
            // if ($state.params.jenis == "3") {
            //     $scope.item.title = 'Manajemen Pest Control'
            //     jenisForm = 14
            // }
            // if ($state.params.jenis == "4") {
            //     $scope.item.title = 'Manajemen Saluran Air Limbah'
            //     jenisForm = 18
            // }
            //$scope.item.tittle = "Daftar Tempat Tidur"
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('PermintaanPerbaikandariRuanganCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
           
            function loadCombo() {
                $scope.dataLogin = medifirstService.getPegawaiLogin();
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPelapor = data;
                }); 
                medifirstService.getPart("sysadmin/general/get-ruangan-part", true, true, 20).then(function (data) {
                    $scope.listRuangan = data;
                });  
                medifirstService.getPart("ipsrs/get-jenis-alat").then(function (data) {
                    $scope.listJenisAlat = data;
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
                    init()
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                var desc = ""
                if ($scope.item.desc != undefined) {
                    var desc = "&desc=" + $scope.item.cariDesc
                }
                var manage = 'aingmacan'
                if (tabNumber == 1) {
                    manage = 'aingmacan'
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("ipsrs/get-daftar-permohonan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + desc + '&arrru=' + jenisForm +
                    "&manage=" + manage
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
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
                cacheHelper.set('PermintaanPerbaikandariRuanganCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                tabNumber = 2
                init();
            }   
            $scope.cariFilter2 = function () {
                tabNumber = 1
                init();
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

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "80px",
                },
                {
                    "field": "pelapor",
                    "title": "Pelapor",
                    "width": "80px",
                },
                {
                    "field": "rincian",
                    "title": "Keterangan Maintenance",
                    "width": "150px",
                },
                {
                    "field": "tglplanning",
                    "title": "Jadwal",
                    "width": "60px"
                },
                {
                    "field": "namalengkap",
                    "title": "Alokasi staff",
                    "width": "80px",
                },
                {
                    "field": "startdate",
                    "title": "Tgl Mulai",
                    "width": "60px",
                },
                {
                    "field": "duedate",
                    "title": "Tgl Selesai",
                    "width": "60px",
                },
                {
                    "field": "deskripsiplanning",
                    "title": "WorkList",
                    "width": "100px",
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "50px",
                }
            ];

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "35px",
                        },
                        {
                            "field": "kdproduk",
                            "title": "Kd Produk",
                            "width": "70px",
                        },
                        {
                            "field": "kdsirs",
                            "title": "Kd Sirs",
                            "width": "70px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "30px",
                        }
                    ]
                }
            };
           
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
                   
            $scope.signDate = function () {               
                $scope.popupSignDate.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalSD = function () {            
                $scope.popupSignDate.close();   
            }
            $scope.simpan = function () {        
                var objSave = 
                    {
                        norec : '',
                        tglplanning : $scope.item.tglAwal,
                        ruangandesc : $scope.item.ruangan.id,
                        namaruangan : $scope.item.ruangan.namaruangan,
                        rincian : $scope.item.desckerusakan,
                        pelapor : $scope.item.pelapor.id,
                        namapelapor : $scope.item.pelapor.namalengkap,
                        jenisKerusakan : $scope.item.jenisKerusakan.id,
                        jenisAlat : $scope.item.jenisKerusakan.reportdisplay,
                        nohppelapor : $scope.item.nohppelapor,
                    }
                $scope.isRouteLoading = true
                medifirstService.post('ipsrs/save-permohonan',objSave).then(function(e) {
                    $scope.isRouteLoading = false
                    // $scope.popupSignDate.close();
                    // init2()
                })


                // medifirstService.get('ipsrs/send-notif-whatsapp').then(function(ed) {
                //     // $scope.popupSignDate.close();
                //     // init2()
                // })    
                   
            }

            $scope.alokasiStaff = function () {               
                $scope.popupAlokasiStaff.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalAS = function () {            
                $scope.popupAlokasiStaff.close();   
            }
            $scope.saveAS = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        objectpegawaipjawabfk : $scope.item.staff.id
                    }
                medifirstService.post('sanitasi/save-alokasistaff',objSave).then(function(e) {
                    $scope.popupAlokasiStaff.close();
                    // init2()
                })    
                   
            }

            $scope.worklist = function () {               
                $scope.popupWorkList.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalWL = function () {            
                $scope.popupWorkList.close();   
            }
            $scope.saveWL = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        deskripsiplanning : $scope.item.worklist
                    }
                medifirstService.post('sanitasi/save-worklist',objSave).then(function(e) {
                    $scope.popupWorkList.close();
                    // init2()
                })    
                   
            }

            $scope.Inspeksi = function () {               
                $scope.popupInspeksi.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
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
                    // init2()
                })    
                   
            }
            $scope.startBtn = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec
                    }
                medifirstService.post('sanitasi/save-startdate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    // init2()
                })    
                   
            }
            $scope.finishBtn = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec
                    }
                medifirstService.post('sanitasi/save-duedate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    // init2()
                })    
                   
            }
            $scope.DetailBtn = function () {               
                $scope.popupDetail.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan

                $scope.item.signdate =  $scope.dataSelected.tglplanning
                $scope.item.startdate =  $scope.dataSelected.startdate
                $scope.item.duedate =  $scope.dataSelected.duedate
                $scope.item.staff =  $scope.dataSelected.namalengkap
                $scope.item.worklist =  $scope.dataSelected.deskripsiplanning
                $scope.item.inspeksi =  $scope.dataSelected.keteranganverifikasi
                $scope.item.inspeksistaff =  $scope.dataSelected.pegawaipj
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
            //***********************************
        }
    ]);
});
