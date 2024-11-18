// define(['initialize'], function (initialize) {
//     'use strict';
//     initialize.controller('LaporanRemunerasipolriCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'medifirstService', 'DateHelper', '$http', '$state', 'ReportPelayanan', 'ManageSdm',
//     function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper, $http, $state, ReportPelayanan, ManageSdm) {
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRemunerasipolriCtrl', ['DateHelper', '$rootScope', '$scope', 'ModelItem', 'MedifirstService', '$state', '$window', 'CetakHelper', 'CacheHelper',
        function (dateHelper, $rootScope, $scope, ModelItem, medifirstService, $state, $window, cetakHelper, cacheHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemR = {};
            $scope.itemDR = {};
            $scope.itemEmpat = {};
            var combolaporan = {};
            var combolaporanrekap = {};


            $scope.isRouteLoading = false;
            var judul = "Detail Remunerasi.xlsx";
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarianSatu').fadeToggle("fast", "linear");
            }

            $scope.showAndHideDua = function () {
                $('#contentPencarianDua').fadeToggle("fast", "linear");
            }

            $scope.showAndHideTiga = function () {
                $('#contentPencarianTiga').fadeToggle("fast", "linear");
            }

            $scope.showAndHideEmpat = function () {
                $('#contentPencarianEmpat').fadeToggle("fast", "linear");
            }
            combolaporan = [
                { id: 1, laporan: "Pendaftaran" },
                { id: 2, laporan: "Jasa Pelayanan Dokter" },
                { id: 2, laporan: "Jasa Pelayanan Dokter Non Layanan" },
                { id: 2, laporan: "Jasa Pelayanan Dokter Luar" },
                { id: 3, laporan: "Jasa Tindakan Keperawatan" },
                { id: 3, laporan: "Jasa Tindakan Keperawatan Covid" },
                { id: 4, laporan: "Jasa Pelayanan Bank Darah" },
                { id: 5, laporan: "Jasa Pelayanan Covid" },
                { id: 6, laporan: "Jasa Pelayanan Dokter Anastesi" },
                // {id:7 , laporan:"Jasa Pelayanan Dokter Operator"},
                { id: 8, laporan: "Jasa Pelayanan Perawat Anastesi" },
                { id: 9, laporan: "Jasa Pelayanan Perawat Operator" },
                { id: 10, laporan: "Jasa Pelayanan Administrasi" },
                { id: 11, laporan: "Jasa Paramedis & Dokter Ruangan" },
                { id: 12, laporan: "Jasa Paramedis Dokpol" },
                { id: 12, laporan: "Jasa Pelayanan Medis/Paramedis" },
                { id: 12, laporan: "Jasa Pelayanan Medis/Paramedis Penunjang" },
                { id: 12, laporan: "Jasa Pelayanan Billing" },
                { id: 12, laporan: "Jasa Pelayanan RM" },
                { id: 12, laporan: "Jasa Pelayanan Admision" },
                { id: 12, laporan: "Jasa Pelayanan Perawat Registrasi" },


                { id: 1, laporan: "Pendaftaran(BerkasRS)" },
                { id: 1, laporan: "Pendaftaran(Atensi)" },
                { id: 1, laporan: "Jasa Pelayanan Masuk RS" },
                { id: 1, laporan: "Jasa Pelayanan Atensi" },
                { id: 1, laporan: "Jasa Pelayanan Medis ODC" },
                // {id:1 , laporan:"Rekap Pendaftaran"},
                // {id:1 , laporan:"Rekap Pendaftaran Dokter Luar"},
                // {id:1 , laporan:"Rekap Pendaftaran Medis"},

                // {id:1 , laporan:"Rekap Pelayanan Dokter"},
                // {id:1 , laporan:"Rekap Pelayanan Dokter Luar"},

                // {id:1 , laporan:"Rekap Pelayanan Medis/Paramedis"},
                // // {id:1 , laporan:"Rekap Pelayanan Medis/Paramedis Penunjang"},
                // {id:1 , laporan:"Rekap Paramedis & Dokter Ruangan"},
                // {id:1 , laporan:"Rekap Tindakan Keperawatan"},

                // {id:1 , laporan:"Rekap Pelayanan Bank Darah"},
                // {id:5 , laporan:"Rekap Pelayanan Covid"},
                // {id:5 , laporan:"Rekap Jasa Tindakan Keperawatan Covid"},
                // {id:1 , laporan:"Rekap Pelayanan Penunjang"},
                // {id:8 , laporan:"Rekap Pelayanan Perawat Operator & Anastesi"},
                { id: 5, laporan: "Penerimaan Rawat Mondok" },
                { id: 1, laporan: "Pelayanan Dokter Luar ALL" },
                { id: 1, laporan: "Jasa Pelayanan Biddokpol" },

            ];
            combolaporanrekap = [
                // {id:1 , laporan:"Pendaftaran"},
                // {id:2 , laporan:"Jasa Pelayanan Dokter"},
                // {id:3 , laporan:"Jasa Tindakan Keperawatan"},
                // {id:3 , laporan:"Jasa Tindakan Keperawatan Covid"},    
                // {id:4 , laporan:"Jasa Pelayanan Bank Darah"},
                // {id:5 , laporan:"Jasa Pelayanan Covid"},
                // {id:6 , laporan:"Jasa Pelayanan Dokter Anastesi"},
                // // {id:7 , laporan:"Jasa Pelayanan Dokter Operator"},
                // {id:8 , laporan:"Jasa Pelayanan Perawat Anastesi"},
                // {id:9 , laporan:"Jasa Pelayanan Perawat Operator"},
                // {id:10 , laporan:"Jasa Pelayanan Administrasi"},
                // {id:11 , laporan:"Jasa Paramedis & Dokter Ruangan"},
                // {id:12 , laporan:"Jasa Paramedis Dokpol"},
                // {id:12 , laporan:"Jasa Pelayanan Medis/Paramedis"},
                // {id:12 , laporan:"Jasa Pelayanan Medis/Paramedis Penunjang"},
                // {id:12 , laporan:"Jasa Pelayanan Billing"},
                // {id:12 , laporan:"Jasa Pelayanan RM"},
                // {id:12 , laporan:"Jasa Pelayanan Admision"},                        
                // {id:12 , laporan:"Jasa Pelayanan Perawat Registrasi"},                        

                { id: 1, laporan: "Rekap Pendaftaran" },
                { id: 1, laporan: "Rekap Pendaftaran Dokter Luar" },
                { id: 1, laporan: "Rekap Pendaftaran Medis" },

                { id: 1, laporan: "Rekap Pelayanan Dokter" },
                { id: 1, laporan: "Rekap Pelayanan Dokter Luar" },
                { id: 1, laporan: "Rekap Pelayanan Dokter Non Layanan" },

                { id: 1, laporan: "Rekap Pelayanan Medis/Paramedis" },
                // {id:1 , laporan:"Rekap Pelayanan Medis/Paramedis Penunjang"},
                { id: 1, laporan: "Rekap Paramedis & Dokter Ruangan" },
                { id: 1, laporan: "Rekap Tindakan Keperawatan" },

                { id: 1, laporan: "Rekap Pelayanan Bank Darah" },
                { id: 5, laporan: "Rekap Pelayanan Covid" },
                { id: 5, laporan: "Rekap Jasa Tindakan Keperawatan Covid" },
                { id: 1, laporan: "Rekap Pelayanan Penunjang" },
                { id: 8, laporan: "Rekap Pelayanan Perawat Operator & Anastesi" },

                { id: 1, laporan: "Rekap Pendaftaran(BerkasRS)" },
                { id: 1, laporan: "Rekap Jasa Pelayanan Masuk RS" },

                { id: 1, laporan: "Rekap Pendaftaran(Atensi)" },
                { id: 1, laporan: "Rekap Jasa Pelayanan Atensi" },
                { id: 2, laporan: "Rekap Pelayanan Dokter Luar ALL" },
                { id: 1, laporan: "Rekap Jasa Pelayanan Medis ODC" },
                { id: 1, laporan: "Rekap Jasa Pelayanan Biddokpol" },
                // {id:5 , laporan:"Penerimaan Rawat Mondok"},
                // {id:1 , laporan:"Pelayanan Dokter Luar ALL"},
            ];

            function LoadCombo() {
                medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (dat) {
                    //debugger;                              
                    $scope.listDokter = dat.data.dokter;
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listLaporan = combolaporan;
                    $scope.listLaporanRekap = combolaporanrekap;
                    $scope.listPasien = dat.data.kelompokpasien;
                    $scope.listPenjamin = dat.data.kelompokpasien;
                    $scope.listRekanan = dat.data.rekanan;

                    $scope.listdokterruangan = dat.data.datadokterruangan;
                    $scope.listtanggalstor = dat.data.tglsetor;
                    $scope.namaLengkap = dat.data.user.namalengkap;
                });
                medifirstService.get("registrasi/laporan/get-data-combo-tindakan", true).then(function (dat) {
                    //debugger;                              
                    $scope.listTindakan = dat.data.produk;

                });
                medifirstService.get("registrasi/laporan/get-data-combo-tindakan-all", true).then(function (dat) {
                    //debugger;                              
                    $scope.listTindakanAll = dat.data.produk;
                    $scope.listKomponenHarga = dat.data.komponenharga;

                });
                $scope.$watch('item.namakomponen', function (value) {
                    debugger
                    medifirstService.get("registrasi/laporan/get-harga-komponen?objectprodukfk=" + $scope.item.namatindakan.id +
                        "&jeniskomponenfk=" + $scope.item.namakomponen.id +
                        "&tglAwal=" + moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss') +
                        "&tglAkhir=" + moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss')).then(function (dat) {
                            debugger
                            $scope.listHarga = dat.data
                        })
                })
            }


            function FormLoad() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemDR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemDR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemEmpat.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemEmpat.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.getIsiComboRuangan = function () {
                if ($scope.item.departement != undefined) {
                    $scope.listRuangan = $scope.item.departement.ruangan
                } else if ($scope.itemDR.departement != undefined) {
                    $scope.listRuangan = $scope.itemDR.departement.ruangan
                } else if ($scope.itemEmpat.departement != undefined) {
                    $scope.listRuangan = $scope.itemEmpat.departement.ruangan
                }
            }

            $scope.getIsiComboJenis = function () {
                if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Luar") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Non Layanan") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Covid") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Rekap") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Tindakan Keperawatan") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Tindakan Keperawatan Covid") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Tindakan Keperawatan Rekap") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Pendaftaran") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Pendaftaran(BerkasRS)") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Pendaftaran(Atensi)") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Masuk RS") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Atensi") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Bank Darah") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Perawat Anastesi") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Perawat Operator") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Administrasi") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Paramedis & Dokter Ruangan") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Paramedis Dokpol") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Anastesi") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Operator") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                    // }
                    // else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Dokter Luar"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Medis"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;                
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;
                } else if ($scope.item.laporan.laporan == "Pelayanan Dokter Luar ALL") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis Penunjang"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Paramedis & Dokter Ruangan"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Tindakan Keperawatan"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=true;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Bank Darah"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=true;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Covid"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Medis/Paramedis") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Medis/Paramedis Penunjang") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Billing") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan RM") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Admision") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Perawat Registrasi") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Tindakan Keperawatan Covid"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=true;
                } else if ($scope.item.laporan.laporan == "Penerimaan Rawat Mondok") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Penunjang"){
                    //     $scope.jasadokter=true;
                    //     $scope.jasaperawat=false;
                    // }else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Perawat Operator & Anastesi"){
                    //     $scope.jasadokter=false;
                    //     $scope.jasaperawat=false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Medis ODC") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Biddokpol") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                }


            }

            $scope.getIsiComboJenisRekap = function () {
                if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Dokter Luar") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar ALL") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Non Layanan") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Medis") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis Penunjang") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Paramedis & Dokter Ruangan") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Tindakan Keperawatan") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Bank Darah") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Covid") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Tindakan Keperawatan Covid") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Penunjang") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Perawat Operator & Anastesi") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = true;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran(BerkasRS)") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Masuk RS") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran(Atensi)") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Atensi") {
                    $scope.jasadokter = true;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == "Jasa Pelayanan Medis ODC") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                } else if ($scope.item.laporanrekap.laporan == " Rekap Jasa Pelayanan Biddokpol") {
                    $scope.jasadokter = false;
                    $scope.jasaperawat = false;
                }

            }

            $scope.SearchData = function () {
                // LoadDataDetail() 
                // var client = new HttpClient(); 
                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporanjasadokter=1&strNoregistrasi=' + $scope.item.noRegistrasi '&view=' + stt, function(response) {
                //     // do something with response
                // });

            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.listRuangan = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.SearchData2 = function () {
                // LoadDataRekap();   
                var tglsetor = "";
                var idpetugas = "";
                if ($scope.item.tglsetor != undefined) {
                    tglsetor = $scope.item.tglsetor.tglsetor;

                } else {

                }

                if ($scope.item.dokterruangan != undefined) {
                    idpetugas = $scope.item.dokterruangan.id;

                } else {

                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "tglsetor", "idpetugas"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",
                        tglsetor, idpetugas
                    ],
                    "paramType": ["", "date", "", "", ""]
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }

                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapjasa.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapjasa.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapjasa.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/rekapjasa.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/rekapjasa.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapjasa.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }

            $scope.ClearDataDua = function () {
                $scope.itemR.NamaDokter = undefined
                $scope.itemR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.ClearDataEmpat = function () {
                $scope.itemEmpat.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemEmpat.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemEmpat.departement = undefined;
                $scope.itemEmpat.ruangan = undefined;
                $scope.listRuangan = undefined
            }

            $scope.ClearDataTiga = function () {
                $scope.itemDR.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.itemDR.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.itemDR.departement = undefined;
                $scope.itemDR.ruangan = undefined;
                $scope.listRuangan = undefined
            }

            $scope.SearchData3 = function () {
                LoadDataDetailDokter();
            }
            $scope.SearchDatax = function () {
                var objverif = {
                    // "pegawaiverif":  $scope.dataLogin.id,
                    // "tglclosing" : tglclosing,
                    "pegawaifk": $scope.item.dokter.id,
                    "produkfkawal": $scope.item.namaprodukawal.id,
                    "produkfkupdate": $scope.item.namaprodukupdate.id,
                    "tglawal": moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss'),
                    "tglakhir": moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss')
                };
                medifirstService.post('remunerasi/update-jasapelayanandokter', objverif).then(function (e) {

                });
            }

            function LoadDataDetail() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempDepartemenNm = "";
                judul = "Detail Remunerasi.xlsx";

                var smf = "";
                if ($scope.item.smf != undefined) {
                    smf = "&smf=" + $scope.item.smf.id;
                }

                //debugger;
                medifirstService.get("remunerasi/get-detail-laporan-remuntindakan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    smf).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        JasaDr: { type: "number" },
                                        Paramedis: { type: "number" },
                                        Direksi: { type: "number" },
                                        StaffDireksi: { type: "number" },
                                        PostRemun: { type: "number" },
                                        Manajemen: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'JasaDr', aggregate: 'sum' },
                                { field: 'Paramedis', aggregate: 'sum' },
                                { field: 'Direksi', aggregate: 'sum' },
                                { field: 'StaffDireksi', aggregate: 'sum' },
                                { field: 'PostRemun', aggregate: 'sum' },
                                { field: 'Manajemen', aggregate: 'sum' },
                            ]
                        });
                    })
            }
            // LoadDataDetailDokter
            // function LoadDataDetail() {                 
            //     $scope.isRouteLoading = true;
            //     var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
            //     var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;            

            //     var tempDepartemenId = "";  
            //     var tempDepartemenNm = "";   
            //     judul =  "Detail Remunerasi.xlsx";           
            //     if ($scope.item.departement != undefined) {
            //         tempDepartemenId = "&idDept=" + $scope.item.departement.id;
            //     }
            //     var tempRuanganId = "";
            //     if ($scope.item.ruangan != undefined) {
            //         tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
            //     }


            //     var isEksekutif = ''
            //     if ($scope.item.Eksekutif == true) {
            //         isEksekutif = "&isExsekutif=" + true;
            //     }else{
            //         isEksekutif = "&isExsekutif=" + false;
            //     }
            //     // var tempDokter = "";
            //     // if ($scope.item.NamaDokter != undefined) {
            //     //     tempDokter = "&IdDokter=" + $scope.item.NamaDokter.id;
            //     //     judul = "Detail Remunerasi "+ $scope.item.NamaDokter.namalengkap ;
            //     // }
            //     // var tempNoClosing = "";
            //     // if ($scope.item.noclosing != undefined) {
            //     //     tempNoClosing = "&noclosing=" + $scope.item.noclosing;
            //     // }


            //     var chacePeriode = {
            //         0: tglAwal,
            //         1: tglAkhir,
            //         2: '',
            //         3: '',
            //         4: '',
            //         5: '',
            //         // 6: $scope.item.ruangan.id,
            //         // 7: $scope.item.ruangan.ruangan               
            //     }
            //     cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

            //     medifirstService.get("remunerasi/get-detail-laporan-remun?"
            //         + "tglAwal=" + tglAwal
            //         + "&tglAkhir=" + tglAkhir
            //         + tempDepartemenId + tempRuanganId + isEksekutif).then(function (data) {
            //         $scope.isRouteLoading = false;                                    
            //         var datas = data.data;
            //         for (var i = 0; i < datas.length; i++) {
            //             datas[i].no = i + 1;
            //             // if(datas[i].isparamedis == "1"){
            //             //     datas[i].statusparamedis = "✔"
            //             // }else{
            //             //     datas[i].statusparamedis = ""
            //             // }
            //             // if(datas[i].iscito == "1"){
            //             //     datas[i].statuscito = "✔"
            //             // }else{
            //             //     datas[i].statuscito = ""
            //             // }
            //             // datas[i].Ruangan = datas[i].namaruangan
            //         }
            //         $scope.sourceLaporan = new kendo.data.DataSource({                            
            //             data: datas,
            //             group: $scope.group,
            //             // pageSize: 50,
            //             total: datas.length,
            //             serverPaging: false,
            //             schema: {
            //                 model: {
            //                     fields: {
            //                         JasaDr: { type: "number" },
            //                         Paramedis: { type: "number" },
            //                         Direksi: { type: "number" },
            //                         StaffDireksi: { type: "number" },
            //                         PostRemun: { type: "number" },
            //                         Manajemen: { type: "number" }                                          
            //                     }
            //                 }
            //             },
            //             aggregate: [
            //                 { field: 'JasaDr', aggregate: 'sum' },
            //                 { field: 'Paramedis', aggregate: 'sum' },
            //                 { field: 'Direksi', aggregate: 'sum' },
            //                 { field: 'StaffDireksi', aggregate: 'sum' }, 
            //                 { field: 'PostRemun', aggregate: 'sum' }, 
            //                 { field: 'Manajemen', aggregate: 'sum' },           
            //             ]
            //         });
            //     })
            // }



            // $scope.group = {
            //     field: "Ruangan"
            // };
            $scope.aggregate = [

                {
                    field: "JasaDr",
                    aggregate: "sum"
                },
                {
                    field: "Paramedis",
                    aggregate: "sum"
                },
                {
                    field: "Direksi",
                    aggregate: "sum"
                },
                {
                    field: "StaffDireksi",
                    aggregate: "sum"
                },
                {
                    field: "PostRemun",
                    aggregate: "sum"
                },
                {
                    field: "Manajemen",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporan = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "tindakanremunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "tindakanremunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [

                    { field: "no", title: "No", width: "30px" },
                    {
                        field: "namaproduk",
                        title: "Nama Pelayanan",
                        width: "120px",
                        footerTemplate: "Total"
                    },
                    {
                        field: "TindakanRJ",
                        title: "Tindakan RJ",
                        width: "110px",
                        // template: "<span class='style-right'>{{formatRupiah('#: JasaDr #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.TindakanRJ.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.JasaDr.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }

                    },
                    {
                        field: "TindakanRI",
                        title: "Tindakan RI",
                        width: "110px",
                        // template: "<span class='style-right'>{{formatRupiah('#: JasaDr #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.TindakanRI.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.JasaDr.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }

                    },
                    {
                        field: "TindakanIGD",
                        title: "Tindakan IGD",
                        width: "110px",
                        // template: "<span class='style-right'>{{formatRupiah('#: JasaDr #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.TindakanIGD.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.JasaDr.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }

                    },
                    {
                        field: "TindakanBedah",
                        title: "Tindakan Bedah",
                        width: "110px",
                        // template: "<span class='style-right'>{{formatRupiah('#: JasaDr #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.TindakanBedah.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.JasaDr.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }

                    },
                    {
                        field: "jenissmf",
                        title: "SMF",
                        width: "110px",
                        // template: "<span class='style-right'>{{formatRupiah('#: JasaDr #','')}}</span>",
                        // aggregates: ["sum"],
                        // footerTemplate: "#: data.TindakanBedah.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.JasaDr.sum #', '')}}</span>",
                        // footerAttributes: {style: "text-align: right;"}

                    },


                ]
            }
            // $scope.columnLaporan = {
            //     toolbar: [
            //         "excel",                    
            //     ],
            //     excel: { fileName: "tindakanremunerasi.xlsx", allPages: true, },
            //     // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
            //     excelExport: function (e) {
            //         var sheet = e.workbook.sheets[0];
            //         sheet.frozenRows = 3;
            //         sheet.mergedCells = ["A1:J1"];
            //         sheet.name = "tindakanremunerasi";
            //          judul = "Tindakan Remunerasi "
            //         var myHeaders = [{
            //             value: judul,
            //             fontSize: 20,
            //             textAlign: "center",
            //             background: "#ffffff",
            //             // color:"#ffffff"
            //         }];

            //         sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
            //     },
            //     sortable: true,
            //     pageable: true,
            //     selectable: "row",
            //     columns: [  

            //         { field: "no", title: "No", width: "30px" },
            //         // {
            //         //     field: "tglpelayanan",
            //         //     title: "Tanggal ",
            //         //     width: "80px",
            //         //     template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
            //         // },
            //         {
            //             field: "namaruangan",
            //             title: "Nama Unit",
            //             width: "120px",             
            //             footerTemplate: "Total"
            //             // template: "<span class='style-center'>#: nocm #</span>"
            //         },
            //         // {
            //         //     field: "",
            //         //     title: "Jasa RS",
            //         //     width: "70px",
            //         //     // template: "<span class='style-center'>#: noregistrasi #</span>"
            //         // },
            //         {
            //             field: "JasaDr",
            //             title: "Jasa DR",
            //             width: "110px",
            //             template: "<span class='style-right'>{{formatRupiah('#: JasaDr #','')}}</span>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#: data.JasaDr.sum #",
            //             footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.JasaDr.sum #', '')}}</span>",
            //             footerAttributes: {style: "text-align: right;"}

            //         },
            //         {
            //             field: "Paramedis",
            //             title: "Paramedis",
            //             width: "110px",
            //             template: "<span class='style-right'>{{formatRupiah('#: Paramedis #','')}}</span>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#: data.Paramedis.sum #",
            //             footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.Paramedis.sum #', '')}}</span>",
            //             footerAttributes: {style: "text-align: right;"}
            //         },
            //         {
            //             field: "Direksi",
            //             title: "Direksi",
            //             width: "110px",
            //             template: "<span class='style-right'>{{formatRupiah('#: Direksi #','')}}</span>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#: data.Direksi.sum #",
            //             footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.Direksi.sum #', '')}}</span>",
            //             footerAttributes: {style: "text-align: right;"}
            //         },
            //         {
            //             field: "StaffDireksi",
            //             title: "Staff Direksi",
            //             width: "110px",
            //             template: "<span class='style-right'>{{formatRupiah('#: StaffDireksi #','')}}</span>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#: data.StaffDireksi.sum #",
            //             footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.StaffDireksi.sum #', '')}}</span>",
            //             footerAttributes: {style: "text-align: right;"}
            //         },
            //         {
            //             field: "PostRemun",
            //             title: "Post Remun",
            //             width: "110px",
            //             template: "<span class='style-right'>{{formatRupiah('#: PostRemun #','')}}</span>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#: data.PostRemun.sum #",
            //             footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.PostRemun.sum #', '')}}</span>",
            //             footerAttributes: {style: "text-align: right;"}
            //         },
            //         {
            //             field: "Manajemen",
            //             title: "Manajemen",
            //             width: "120px",
            //             template: "<span class='style-right'>{{formatRupiah('#: Manajemen #','')}}</span>",
            //             aggregates: ["sum"],
            //             footerTemplate: "#: data.Manajemen.sum #",
            //             footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.Manajemen.sum #', '')}}</span>",
            //             footerAttributes: {style: "text-align: right;"}
            //         }
            //         // {
            //         //     field: "hargasatuan",
            //         //     title: "Tarif Layanan",
            //         //     width: "80px",
            //         //     template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
            //         //     attributes:{style:"text-align:right;"},
            //         //     // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
            //         //     // aggregates: ["sum"],
            //         //     // footerTemplate: "#: data.hargasatuan.sum #",
            //         //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
            //         //     // footerAttributes: {style: "text-align: right;"}

            //         // },
            //         // {
            //         //     field: "jenispagunilai",
            //         //     title: "Jasa Remun",
            //         //     width: "100px",
            //         //     template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
            //         //     attributes:{style:"text-align:right;"},
            //         //     // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
            //         //     aggregates: ["sum"],
            //         //     footerTemplate: "#: data.jenispagunilai.sum #",
            //         //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
            //         //     footerAttributes: {style: "text-align: right;"}
            //         // },
            //         // {
            //         //     hidden: true,
            //         //     field: "dokter",
            //         //     title: "Nama Dokter",
            //         //     aggregates: ["count"],
            //         //     groupHeaderTemplate: "Nama Dokter #= value #"
            //         // },
            //         // {
            //         //     "command": [
            //         //         {
            //         //             text: "Detail",
            //         //             click: detailfromgrid,
            //         //             imageClass: "k-icon k-i-pencil"
            //         //         }
            //         //     ],
            //         //     title: "",
            //         //     width: "60px",
            //         // }

            //     ] 
            // }
            function LoadDataRekap() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');




                var smf = "";
                if ($scope.item.smf != undefined) {
                    smf = "&smf=" + $scope.item.smf.id;
                }

                medifirstService.get("remunerasi/get-detail-laporan-remunoperasi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    smf).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.sourceLaporan2 = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        JasaDr: { type: "number" },
                                        Paramedis: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'JasaDr', aggregate: 'sum' },
                                { field: 'Paramedis', aggregate: 'sum' },
                            ]
                        });
                    })
            }

            // function LoadDataRekap() {                 
            //     $scope.isRouteLoading = true;
            //     var tglAwal = moment($scope.itemR.tglawal).format('YYYY-MM-DD HH:mm');
            //     var tglAkhir = moment($scope.itemR.tglakhir).format('YYYY-MM-DD HH:mm');;
            //     //

            //     // var tempDepartemenId = "";  
            //     // var tempDepartemenNm = "";   
            //     // judul =  "Detail Remunerasi.xlsx";           
            //     // if ($scope.item.departement != undefined) {
            //     //     tempDepartemenId = "&idDept=" + $scope.item.departement.id;
            //     // }
            //     // var tempRuanganId = "";
            //     // if ($scope.item.ruangan != undefined) {
            //     //     tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
            //     // }

            //     var tempDokter = "";
            //     if ($scope.itemR.NamaDokter != undefined) {
            //         tempDokter = "&IdDokter=" + $scope.itemR.NamaDokter.id;
            //         judul = "Detail Remunerasi "+ $scope.itemR.NamaDokter.namalengkap ;
            //     }


            //     var isEksekutif = ''
            //     if ($scope.itemR.isEksekutifR == true) {
            //         isEksekutif = "&isExsekutif=" + true;
            //     }else{
            //         isEksekutif = "&isExsekutif=" + false;
            //     }
            //     // var tempNoClosing = "";
            //     // if ($scope.item.noclosing != undefined) {
            //     //     tempNoClosing = "&noclosing=" + $scope.item.noclosing;
            //     // }


            //     var chacePeriode = {
            //         0: tglAwal,
            //         1: tglAkhir,
            //         2: '',
            //         3: '',
            //         4: '',
            //         5: '',
            //         // 6: $scope.item.ruangan.id,
            //         // 7: $scope.item.ruangan.ruangan               
            //     }
            //     cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

            //     medifirstService.get("remunerasi/get-rekap-laporan-remun?"
            //         + "tglAwal=" + tglAwal
            //         + "&tglAkhir=" + tglAkhir
            //         + tempDokter + isEksekutif).then(function (data) {
            //         $scope.isRouteLoading = false;                  
            //         var datas = data.data;
            //         for (var i = 0; i < datas.length; i++) {
            //             datas[i].no = i + 1;
            //         }
            //         $scope.sourceLaporanDua = new kendo.data.DataSource({                            
            //             data: datas,
            //             group: $scope.group,
            //             // pageSize: 50,
            //             total: datas.length,
            //             serverPaging: false,
            //             schema: {
            //                 model: {
            //                     fields: {
            //                         JasaDr: { type: "number" },
            //                         Paramedis: { type: "number" },
            //                         // Direksi: { type: "number" },
            //                         // StaffDireksi: { type: "number" },
            //                         // PostRemun: { type: "number" },
            //                         // Manajemen: { type: "number" }                                          
            //                     }
            //                 }
            //             },
            //             aggregate: [
            //                 { field: 'JasaDr', aggregate: 'sum' },
            //                 { field: 'Paramedis', aggregate: 'sum' },
            //                 // { field: 'Direksi', aggregate: 'sum' },
            //                 // { field: 'StaffDireksi', aggregate: 'sum' }, 
            //                 // { field: 'PostRemun', aggregate: 'sum' }, 
            //                 // { field: 'Manajemen', aggregate: 'sum' },           
            //             ]
            //         });
            //     })
            // }


            $scope.aggregate = [

                {
                    field: "JasaDr",
                    aggregate: "sum"
                },
                {
                    field: "Paramedis",
                    aggregate: "sum"
                },
            ]
            $scope.columnLaporan2 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "tindakanremunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "tindakanremunerasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "30px" },
                    {
                        field: "namalengkap",
                        title: "Nama Dokter",
                        width: "120px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },

                    {
                        field: "namaproduk",
                        title: "Nama Produk",
                    },
                    {
                        field: "tgl_Operasi",
                        title: "Tanggal Operasi",
                    },


                    {
                        field: "tgl_Biling",
                        title: "Tanggal Biling",
                    },
                    {
                        field: "TindakanBedah",
                        title: "Tindakan Bedah",
                        width: "110px",
                        // template: "<span class='style-right'>{{formatRupiah('#: TindakanBedah #','')}}</span>",
                        // aggregates: ["sum"],
                        // footerTemplate: "#: data.TindakanBedah.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.TindakanBedah.sum #', '')}}</span>",
                        // footerAttributes: {style: "text-align: right;"}
                    }
                ]
            }

            $scope.columnLaporan3 = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "rekapremunerasi.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "rekapremunerasi";

                    var myHeaders = [{
                        value: judul,
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "30px" },
                    {
                        field: "namalengkap",
                        title: "Nama Dokter",
                        width: "120px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "Poli",
                        title: "Poli",
                    },
                    {
                        field: "TindakanIGD",
                        title: "Tindakan IGD",
                    },
                    {
                        field: "DPJP_Inap",
                        title: "DPJP Inap",
                    },
                    {
                        field: "Visite_NonDPJP",
                        title: "Visite NonDPJP",
                    },
                    {
                        field: "Visite_Intensive",
                        title: "Visite Intensive",
                    },
                    {
                        field: "Visite_IntensiveDPJP",
                        title: "Visite IntensiveDPJP",
                    },
                    {
                        field: "KonsulRuangan",
                        title: "Konsul Ruangan",
                    },
                    {
                        field: "TindakanRI",
                        title: "Tindakan RI",
                    },
                    {
                        field: "KamarOperasi",
                        title: "Kamar Operasi",
                    },
                    {
                        field: "jenissmf",
                        title: "SMF",
                    }
                    //  {
                    //     field: "TindakanBedah",
                    //     title: "Tindakan Bedah",
                    //     width: "110px",
                    //     // template: "<span class='style-right'>{{formatRupiah('#: TindakanBedah #','')}}</span>",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.TindakanBedah.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.TindakanBedah.sum #', '')}}</span>",
                    //     footerAttributes: {style: "text-align: right;"}
                    // }
                ]
            }


            // function LoadDataDetailDokter() {                 
            //     $scope.isRouteLoading = true;
            //     var tglAwal = moment($scope.itemDR.tglawal).format('YYYY-MM-DD HH:mm');
            //     var tglAkhir = moment($scope.itemDR.tglakhir).format('YYYY-MM-DD HH:mm');;            

            //     var tempDepartemenId = "";  
            //     var tempDepartemenNm = "";   
            //     judul =  "Detail Remunerasi.xlsx";           
            //     if ($scope.itemDR.departement != undefined) {
            //         tempDepartemenId = "&idDept=" + $scope.itemDR.departement.id;
            //     }
            //     var tempRuanganId = "";
            //     if ($scope.itemDR.ruangan != undefined) {
            //         tempRuanganId = "&idRuangan=" + $scope.itemDR.ruangan.id;
            //     }

            //     var tempDokter = "";
            //     if ($scope.itemDR.NamaDokter != undefined) {
            //         tempDokter = "&dokterid=" + $scope.itemDR.NamaDokter.id;
            //         judul = "Detail Remunerasi "+ $scope.itemDR.NamaDokter.namalengkap ;
            //     }

            //     var isEksekutif = ''
            //     if ($scope.itemDR.EksekutifDR == true) {
            //         isEksekutif = "&isExsekutif=" + true;
            //     }else{
            //         isEksekutif = "&isExsekutif=" + false;
            //     }                

            //     var chacePeriode = {
            //         0: tglAwal,
            //         1: tglAkhir,
            //         2: '',
            //         3: '',
            //         4: '',
            //         5: '',
            //         // 6: $scope.item.ruangan.id,
            //         // 7: $scope.item.ruangan.ruangan               
            //     }
            //     cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

            //     medifirstService.get("remunerasi/get-detail-laporan-remun-dokter?"
            //         + "tglAwal=" + tglAwal
            //         + "&tglAkhir=" + tglAkhir
            //         + tempDepartemenId + tempRuanganId + tempDokter + isEksekutif).then(function (data) {
            //         $scope.isRouteLoading = false;                                    
            //         var datas = data.data;
            //         for (var i = 0; i < datas.length; i++) {
            //             datas[i].no = i + 1;  
            //             if(datas[i].isparamedis == "1"){
            //                 datas[i].statusparamedis = "✔"
            //             }else{
            //                 datas[i].statusparamedis = ""
            //             }
            //             if(datas[i].iscito == "1"){
            //                 datas[i].statuscito = "✔"
            //             }else{
            //                datas[i].statuscito = ""
            //             }                      
            //         }
            //         $scope.sourceLaporanTiga = new kendo.data.DataSource({                            
            //             data: datas,
            //             group: $scope.group,
            //             // pageSize: 50,
            //             total: datas.length,
            //             serverPaging: false,
            //             schema: {
            //                 model: {
            //                     fields: {
            //                         hargasatuan: { type: "number" },
            //                         total: { type: "number" },
            //                     }
            //                 }
            //             },
            //             aggregate: [
            //                 { field: 'hargasatuan', aggregate: 'sum' },
            //                 { field: 'total', aggregate: 'sum' },                                
            //             ]
            //         });
            //     })
            // }
            function LoadDataDetailDokter() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');




                var smf = "";
                if ($scope.item.smf != undefined) {
                    smf = "&smf=" + $scope.item.smf.id;
                }

                medifirstService.get("remunerasi/get-detail-laporan-remunrekap?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    smf).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        $scope.sourceLaporan3 = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        JasaDr: { type: "number" },
                                        Paramedis: { type: "number" },
                                    }
                                }
                            },
                            // aggregate: [
                            //     { field: 'JasaDr', aggregate: 'sum' },
                            //     { field: 'Paramedis', aggregate: 'sum' },      
                            // ]
                        });
                    })
            }



            // $scope.group = {
            //     field: "Ruangan"
            // };
            $scope.aggregate = [{
                field: "hargasatuan",
                aggregate: "sum"
            },
            {
                field: "total",
                aggregate: "sum"
            }
            ]
            $scope.columnLaporanTiga = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "detaillaporanremunerasidokter.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: judul,
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "50px" },
                    {
                        field: "tglpelayanan",
                        title: "Tanggal ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noreigtrasi",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruang Layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaproduk",
                        title: "Nama layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "qty",
                        title: "Jumlah",
                        width: "80px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statusparamedis",
                        title: "P",
                        width: "20px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statuscito",
                        title: "Cito",
                        width: "50px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "hargasatuan",
                        title: "Harga Satuan",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.hargasatuan.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "total",
                        title: "Total",
                        width: "120px",
                        template: "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                    // {
                    //     field: "hargasatuan",
                    //     title: "Tarif Layanan",
                    //     width: "80px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
                    //     // aggregates: ["sum"],
                    //     // footerTemplate: "#: data.hargasatuan.sum #",
                    //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                    //     // footerAttributes: {style: "text-align: right;"}

                    // },
                    // {
                    //     field: "jenispagunilai",
                    //     title: "Jasa Remun",
                    //     width: "100px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.jenispagunilai.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
                    //     footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     hidden: true,
                    //     field: "dokter",
                    //     title: "Nama Dokter",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Nama Dokter #= value #"
                    // },
                    // {
                    //     "command": [
                    //         {
                    //             text: "Detail",
                    //             click: detailfromgrid,
                    //             imageClass: "k-icon k-i-pencil"
                    //         }
                    //     ],
                    //     title: "",
                    //     width: "60px",
                    // }

                ]
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
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

            $scope.Cetak = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempnamadepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                    tempnamadepartemen = $scope.item.departement.departemen;
                }
                //debugger;
                var tempRuanganId = "";
                var tempRuanganNama = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                    tempRuanganNama = $scope.item.ruangan.ruangan;
                }

                var tempDokter = "";
                var tempDokternama = "";
                if ($scope.item.dokter != undefined) {
                    tempDokter = $scope.item.dokter.id;
                    tempDokternama = $scope.item.dokter.nama;
                }

                var tempNoClosing = "";
                if ($scope.item.noclosing != undefined) {
                    tempNoClosing = $scope.item.noclosing;
                }
                var tempRekanan = "";
                var tempNamaRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    tempRekanan = $scope.item.rekanan.id;
                    tempNamaRekanan = $scope.item.rekanan.namarekanan;
                }
                var tempPenjamin = "";
                var tempNamapenjamin = "";
                if ($scope.item.penjamin != undefined) {
                    tempPenjamin = $scope.item.penjamin.id;
                    tempNamapenjamin = $scope.item.penjamin.kelompokpasien;
                }

                var stt = 'false'
                if (confirm('View Laporan Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();

                if ($scope.item.laporan.laporan == "Pendaftaran") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftaran=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Pendaftaran(BerkasRS)") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftarancsr=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporan.laporan == "Pendaftaran(Atensi)") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftaranatensi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Masuk RS") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftarankonsul=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Atensi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftarankonsulatensi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokter=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Non Layanan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokternonlayanan=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadoktercovid=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Jasa Tindakan Keperawatan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawat=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Tindakan Keperawatan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatcovid=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Medis/Paramedis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasamedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Medis/Paramedis Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasamedispenunjang=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Dokter") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapdokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Pelayanan Dokter Luar ALL") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapdokterluarall=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Medis/Paramedis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasamedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Medis/Paramedis Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasamedispenunjang=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Rekap Paramedis & Dokter Ruangan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasaparamedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Bank Darah") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatdarah=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Perawat Anastesi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatanastesi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Perawat Operator") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatoperator=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Administrasi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatadministrasi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Paramedis & Dokter Ruangan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatakomodasi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Paramedis Dokpol") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatakomodasidokpol=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Anastesi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokteranastesi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Dokter Operator") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatanastesi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Billing") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftaranbillling=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan RM") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftaranrm=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Admision") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftaranadmision=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Perawat Registrasi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterpendaftaranperawatregistrasi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Medis ODC") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasamedisodc=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pendaftaran") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaran=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pendaftaran Medis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaranmedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pendaftaran Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftarandokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Tindakan Keperawatan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Bank Darah") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapdarah=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapcovid=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Penerimaan Rawat Mondok") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanpenerimaanrawatmondok=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Jasa Tindakan Keperawatan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasatindakanperawatacovid=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappenunjang=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Rekap Pelayanan Perawat Operator & Anastesi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaoperatordananastesi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporan.laporan == "Jasa Pelayanan Biddokpol") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasabiddokpol=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                }

            }

            $scope.Cetak2 = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempnamadepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                    tempnamadepartemen = $scope.item.departement.departemen;
                }
                //debugger;
                var tempRuanganId = "";
                var tempRuanganNama = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                    tempRuanganNama = $scope.item.ruangan.ruangan;
                }

                var tempDokter = "";
                var tempDokternama = "";
                if ($scope.item.dokter != undefined) {
                    tempDokter = $scope.item.dokter.id;
                    tempDokternama = $scope.item.dokter.nama;
                }

                var tempNoClosing = "";
                if ($scope.item.noclosing != undefined) {
                    tempNoClosing = $scope.item.noclosing;
                }
                var tempRekanan = "";
                var tempNamaRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    tempRekanan = $scope.item.rekanan.id;
                    tempNamaRekanan = $scope.item.rekanan.namarekanan;
                }
                var tempPenjamin = "";
                var tempNamapenjamin = "";
                if ($scope.item.penjamin != undefined) {
                    tempPenjamin = $scope.item.penjamin.id;
                    tempNamapenjamin = $scope.item.penjamin.kelompokpasien;
                }

                var stt = 'false'
                if (confirm('View Laporan Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();

                if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapdokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Non Layanan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapdokternonlayanan=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasamedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasamedispenunjang=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporanrekap.laporan == "Rekap Paramedis & Dokter Ruangan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasaparamedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaran=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Medis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaranmedis=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftarandokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Tindakan Keperawatan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Bank Darah") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapdarah=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapcovid=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Penerimaan Rawat Mondok") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanpenerimaanrawatmondok=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Tindakan Keperawatan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasatindakanperawatacovid=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappenunjang=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Perawat Operator & Anastesi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaoperatordananastesi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran(BerkasRS)") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftarancsr=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Masuk RS") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekaptindakancsr=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran(Atensi)") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaranatensi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar ALL") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterluarrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Atensi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekaptindakanatensi=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Medis ODC") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanrekapjasamedisodc=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Biddokpol") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokpolrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function (response) {
                        // do something with response
                    })
                }

            }
            $scope.setorpopup = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');

                $scope.item.periode = tglAwal;
                $scope.item.periodeahir = tglAkhir;
                $scope.item.namarekap = $scope.item.laporanrekap.laporan;
                $scope.popUp.center().open();

            }
            $scope.setor = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tglsetor = moment($scope.item.tglsetor).format('YYYY-MM-DD');


                var tempDepartemenId = "";
                var tempnamadepartemen = "";

                var departemenx = "";
                departemenx = $scope.item.departementx.departemen;

                var periode = "";
                var namarekap = "";
                var uraian = "";
                var periodeahir = "";

                uraian = $scope.item.uraian;
                periode = $scope.item.periode;
                periodeahir = $scope.item.periodeahir;
                namarekap = $scope.item.laporanrekap.laporan;
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                    tempnamadepartemen = $scope.item.departement.departemen;
                }
                //debugger;
                var tempRuanganId = "";
                var tempRuanganNama = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                    tempRuanganNama = $scope.item.ruangan.ruangan;
                }

                var tempDokter = "";
                var tempDokternama = "";
                if ($scope.item.dokter != undefined) {
                    tempDokter = $scope.item.dokter.id;
                    tempDokternama = $scope.item.dokter.nama;
                }

                var tempNoClosing = "";
                if ($scope.item.noclosing != undefined) {
                    tempNoClosing = $scope.item.noclosing;
                }
                var tempRekanan = "";
                var tempNamaRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    tempRekanan = $scope.item.rekanan.id;
                    tempNamaRekanan = $scope.item.rekanan.namarekanan;
                }
                var tempPenjamin = "";
                var tempNamapenjamin = "";
                if ($scope.item.penjamin != undefined) {
                    tempPenjamin = $scope.item.penjamin.id;
                    tempNamapenjamin = $scope.item.penjamin.kelompokpasien;
                }

                var stt = 'true'
                // if (confirm('View Laporan Remunerasi? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                var client = new HttpClient();

                if (namarekap == 'Rekap Paramedis & Dokter Ruangan') {
                    namarekap = 'Rekap Paramedis dan Dokter Ruangan'
                }
                if (namarekap == 'Rekap Pelayanan Perawat Operator & Anastesi') {
                    namarekap = 'Rekap Pelayanan Perawat Operator dan Anastesi'
                }

                if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapdokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Non Layanan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapdokternonlayanan=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasamedissetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Medis/Paramedis Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasamedispenunjang=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });

                } else if ($scope.item.laporanrekap.laporan == "Rekap Paramedis & Dokter Ruangan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekapjasaparamedissetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaransetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                        debugger;
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Medis") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaranmedissetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran Dokter Luar") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftarandokterluar=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Tindakan Keperawatan") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Bank Darah") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapdarahsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaperawatrekapcovidsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Penerimaan Rawat Mondok") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanpenerimaanrawatmondok=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Tindakan Keperawatan Covid") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasatindakanperawatacovidsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Penunjang") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappenunjangsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Perawat Operator & Anastesi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasaoperatordananastesisetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran(BerkasRS)") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftarancsrsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Masuk RS") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekaptindakancsrsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pendaftaran(Atensi)") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekappendaftaranatensisetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporanrekap.laporan == "Rekap Pelayanan Dokter Luar ALL") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterluarrekap=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    });
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Atensi") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanjasadokterrekaptindakanatensisetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    })
                } else if ($scope.item.laporanrekap.laporan == "Rekap Jasa Pelayanan Medis ODC") {
                    client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanrekapjasamedisodcsetor=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&IdDokter=' + tempDokter + '&namadokter=' + tempDokternama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&departement=' + tempnamadepartemen + '&namarekanan=' + tempNamaRekanan + '&view=' + stt + '&periode=' + periode + '&namarekap=' + namarekap + '&departementsetor=' + departemenx + '&uraian=' + uraian + '&periodeahir=' + periodeahir + '&tglsetor=' + tglsetor, function (response) {
                        // do something with response
                    })
                }

            }

            $scope.SearchDataEmpat = function () {
                LoadDataDetailParamedis();
            }

            function LoadDataDetailParamedis() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemEmpat.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemEmpat.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempDepartemenNm = "";
                if ($scope.itemEmpat.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.itemEmpat.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemEmpat.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.itemEmpat.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.itemEmpat.NamaDokter != undefined) {
                    tempDokter = "&dokterid=" + $scope.itemEmpat.NamaDokter.id;
                }

                var isEksekutif = ''
                if ($scope.itemEmpat.EksekutifEmpat == true) {
                    isEksekutif = "&isExsekutif=" + true;
                } else {
                    isEksekutif = "&isExsekutif=" + false;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    // 6: $scope.item.ruangan.id,
                    // 7: $scope.item.ruangan.ruangan               
                }
                cacheHelper.set('LaporanRemunerasiCtrl', chacePeriode);

                medifirstService.get("remunerasi/get-detail-laporan-remun-paramedis?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempDepartemenId + tempRuanganId + tempDokter + isEksekutif).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].isparamedis == "1") {
                                datas[i].statusparamedis = "✔"
                            } else {
                                datas[i].statusparamedis = ""
                            }
                            if (datas[i].iscito == "1") {
                                datas[i].statuscito = "✔"
                            } else {
                                datas[i].statuscito = ""
                            }
                        }
                        $scope.sourceLaporanEmpat = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            // pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        hargasatuan: { type: "number" },
                                        total: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'hargasatuan', aggregate: 'sum' },
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });
                    })
            }


            // $scope.group = {
            //     field: "Ruangan"
            // };
            $scope.aggregate = [{
                field: "hargasatuan",
                aggregate: "sum"
            },
            {
                field: "total",
                aggregate: "sum"
            }
            ]
            $scope.columnLaporanEmpat = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "detaillaporanremunerasiparamedis.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "detaillaporanremunerasiparamedis",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "50px" },
                    {
                        field: "tglpelayanan",
                        title: "Tanggal ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noreigtrasi",
                        width: "90px",
                        // footerTemplate: "Total"
                        // template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruang Layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namaproduk",
                        title: "Nama layanan",
                        width: "120px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "qty",
                        title: "Jumlah",
                        width: "80px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statusparamedis",
                        title: "P",
                        width: "20px",
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "statuscito",
                        title: "Cito",
                        width: "50px",
                        footerTemplate: "Total"
                        // template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "hargasatuan",
                        title: "Harga Satuan",
                        width: "110px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.hargasatuan.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "total",
                        title: "Total",
                        width: "120px",
                        template: "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.total.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }
                    // {
                    //     field: "hargasatuan",
                    //     title: "Tarif Layanan",
                    //     width: "80px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
                    //     // aggregates: ["sum"],
                    //     // footerTemplate: "#: data.hargasatuan.sum #",
                    //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                    //     // footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     field: "jenispagunilai",
                    //     title: "Jasa Remun",
                    //     width: "100px",
                    //     template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
                    //     attributes:{style:"text-align:right;"},
                    //     // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.jenispagunilai.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
                    //     footerAttributes: {style: "text-align: right;"}
                    // },
                    // {
                    //     hidden: true,
                    //     field: "dokter",
                    //     title: "Nama Dokter",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Nama Dokter #= value #"
                    // },
                    // {
                    //     "command": [
                    //         {
                    //             text: "Detail",
                    //             click: detailfromgrid,
                    //             imageClass: "k-icon k-i-pencil"
                    //         }
                    //     ],
                    //     title: "",
                    //     width: "60px",
                    // }

                ]
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

            $scope.cetakSatu = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }
                var stt = 'false'
                if (confirm('View Laporan Detail Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-detail-remunerasi=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdDept=' + tempDepartemenId + '&strIdRuangan=' + tempRuanganId +
                    '&strEksekutif=' + isEksekutif + '&view=' + stt,
                    function (response) {
                        // do something with response                
                    });
            }

            $scope.cetakDua = function () {
                var tglAwal = moment($scope.itemR.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemR.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDokter = "";
                if ($scope.itemR.NamaDokter != undefined) {
                    tempDokter = $scope.itemR.NamaDokter.id;
                }

                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }

                var stt = 'false'
                if (confirm('View Laporan Rekap Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-rekap-remunerasi=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdDokter=' + tempDokter + '&strEksekutif=' + isEksekutif + '&view=' + stt,
                    function (response) {
                        // do something with response                
                    });
            }

            $scope.cetakTiga = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemDR.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemDR.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.itemDR.departement != undefined) {
                    tempDepartemenId = $scope.itemDR.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemDR.ruangan != undefined) {
                    tempRuanganId = $scope.itemDR.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.itemDR.NamaDokter != undefined) {
                    tempDokter = $scope.itemDR.NamaDokter.id;
                }

                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Remunerasi Dokter? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-detail-remunerasi-dokter=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdDept=' + tempDepartemenId + '&strIdRuangan=' + tempRuanganId +
                    '&strIdDokter=' + tempDokter + '&strEksekutif=' + isEksekutif + '&view=' + stt,
                    function (response) {
                        // do something with response                
                    });
            }

            $scope.cetakEmpat = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.itemEmpat.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.itemEmpat.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.itemEmpat.departement != undefined) {
                    tempDepartemenId = $scope.itemEmpat.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.itemEmpat.ruangan != undefined) {
                    tempRuanganId = $scope.itemEmpat.ruangan.id;
                }

                var isEksekutif = ''
                if ($scope.itemEmpat.Eksekutif == true) {
                    isEksekutif = "true";
                } else {
                    isEksekutif = "false";
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Remunerasi Paramedis? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-detail-remunerasi-paramedis=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdDept=' + tempDepartemenId + '&strIdRuangan=' + tempRuanganId +
                    '&strEksekutif=' + isEksekutif + '&view=' + stt,
                    function (response) {
                        // do something with response                
                    });
            }
            $scope.updateHarga = function () {
                var objSave = {
                    "tglAwal": $scope.item.tglawal,
                    "tglAkhir": $scope.item.tglakhir,
                    "idProduk": $scope.item.namatindakan.id,
                    "idKomponen": $scope.item.namakomponen.id,
                    "hargaLama": $scope.item.harga.bruto,
                    "hargaBaru": $scope.item.hargaBaru
                };
                medifirstService.post('remunerasi/update-harga-komponen-jaspel', objSave).then(function (e) {

                })
            }
            /////////////////////////////////////////
        }
    ]);
});