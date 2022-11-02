define(['initialize'], function (initialize) {
    'use strict';
    // initialize.controller('DaftarAntrianSusterRanapCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'FindPasien', 'DateHelper', 'socket', 'ManagePasien', '$mdDialog', '$window', 'CetakHelper', 'medifirstService', 'CacheHelper', '$q',
    // function (saveToWindow, $rootScope, $scope, ModelItem, $state, findPasien, DateHelper, socket, managePasien, $mdDialog, window, cetakHelper, medifirstService, cacheHelper, $q) {
    initialize.controller('SebaranInventarisAlatMedisDanPenunjangMedisCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.itema = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item = {};
            $scope.isRouteLoading = false;
            $rootScope.isOpen = true;
            $scope.cboUbahDokter = true;
            $scope.tombolSimpanBatalPindah = true
            $scope.item.isFindMPP = false
            // $scope.isRouteLoading = true;
            // $scope.title = "ini page pencarian pasien";
            // $scope.kodeRuangan = $state.params.kodeRuangan;
            // $scope.isCalling = false;
            $scope.pegawai = ModelItem.getPegawai();
            $scope.cekMPP = function (bool) {
                if (bool) {
                    $scope.item.isFindMPP = true
                    loadData()
                } else {
                    $scope.item.isFindMPP = false
                    loadData()
                }
            }
            loadCombo()
            loadData()

            var ppkRumahSakit = ''
            medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                ppkRumahSakit = dat.data
                updateKetersediaanTT()
            })

            function updateKetersediaanTT(){ 
               
                medifirstService.get("bridging/bpjs/aplicaresws/get-tt?namaruangan=&kelas=" ).then(function (e) {
                    var res =  e.data
                    for (var i = 0; i <res.length; i++) {
                        const element = res[i]
                        var tersedia = (element.tersedia.valueOf() < 0? 0 :element.tersedia );
                        var tersediapria = (element.tersediapria.valueOf() < 0? 0 :element.tersediapria );
                        var tersediawanita = (element.tersediawanita.valueOf() < 0? 0 :element.tersediawanita );
                        var tersediapriawanita = (element.tersediapriawanita.valueOf() < 0? 0 :element.tersediapriawanita );                    
                        let data = {                        
                            "json": {
                                "kodekelas": element.kodekelas,
                                "koderuang": element.koderuang,
                                "namaruang": element.namaruang,
                                "kapasitas": element.kapasitas,
                                "tersedia": tersedia,
                                "tersediapria": tersediapria,
                                "tersediawanita": tersediawanita,
                                "tersediapriawanita": tersediapriawanita,
                            }                    
                        }
                        medifirstService.postNonMessage('bridging/bpjs/aplicaresws/rest/bed/update/' + ppkRumahSakit, data).then(function (e) {
                            if (e.data.metadata.code == 1) {
                                // toastr.success(e.data.metadata.message, 'Info')
                            } else {
                                // toastr.error(e.data.metadata.message, 'Info')
                            }
                            // $scope.isRouteLoading = false
                        }, function (error) {
                            // $scope.isRouteLoading = false
                        })
                    }
                })
            
            }
            $scope.SearchEnter = function () {
                loadData()
            }

            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarAntrianSusterRanapCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.itema.ruangan = { id: arrPeriode[2], namaruangan: arrPeriode[3] }
                    // $scope.item.tglpulang = new Date(arrPeriode[2]);                
                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                    // $scope.item.tglpulang = $scope.now;                 
                }
                medifirstService.get("rawatinap/get-data-combo-dokter", false).then(function (data) {
                    $scope.listRuangan = data.data.ruanganRanap;
                });

                $scope.listKondisi = [
                                        {id: 0, kondisi: 'OK'},
                                        {id: 1, kondisi: 'BAD'}
                                     ]

                $scope.listSOP = [
                                    {id: 0, sop: 'ADA'},
                                    {id: 1, sop: 'TIDAK'}
                                 ]
                $scope.itema.kondisi = {id: 0, kondisi: 'OK'}
                $scope.itema.sop = {id: 0, sop: 'ADA'}
            }

            function loadData() {
                $scope.isRouteLoading = true;
                // var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                // var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var nocm = ""
                if ($scope.itema.noCm != undefined) {
                    var nocm = "&norm=" + $scope.itema.noCm
                }
                var nama = ""
                if ($scope.itema.namaPasien != undefined) {
                    var nama = "&nama=" + $scope.itema.namaPasien
                }
                var noRegistrasi = ""
                if ($scope.itema.noRegistrasi != undefined) {
                    var noRegistrasi = "&noreg=" + $scope.itema.noRegistrasi
                }
                // var dokId=""
                // if ($scope.pegawai.id != undefined){
                //    var dokId = "&dokId=" +$scope.pegawai.id
                // }
                var ruangId = ""
                if ($scope.itema.ruangan != undefined) {
                    var ruangId = "&ruangId=" + $scope.itema.ruangan.id
                }

                var isMPP = ""
                if ($scope.item.isFindMPP == true) {
                    var isMPP = "&isMPP=" + 1
                }

                $q.all([
                    medifirstService.get("rawatinap/get-daftar-antrian-ranap?" +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama
                        + ruangId + isMPP),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data[0].data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datas[i].tgllahir);
                        var umurzz = DateHelper.CountAge(tanggalLahir, tanggal);
                        datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                    }
                    $scope.GridPasien = new kendo.data.DataSource({
                        data: datas,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    var chacePeriode = '' + "~" + '' + "~" + $scope.itema.ruangan.id + "~" + $scope.itema.ruangan.namaruangan;
                    cacheHelper.set('DaftarAntrianSusterRanapCtrl', chacePeriode);
                });
            }

            $scope.klikGrid = function (item) {
                loadCombo();
                // if (item != undefined) {
                //     $scope.item.namadokter = {id:item.objectpegawaifk,namalengkap:item.namadokter}
                // }
            }

            
            
            $scope.ColumnPasien = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienRawatInap.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Rawat Inap",
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
                {
                    "field": "no",
                    "title": "NO",
                    "width": "30px",
                },
                {
                    //"field": "no",
                    "title": "UNIT KERJA",
                    "width": "80px",
                },
                {
                    //"field": "no",
                    "title": "NAMA ALAT",
                    "width": "120px",
                },
                {
                    //"field": "no",
                    "title": "MERK",
                    "width": "80px",
                },
                {
                    //"field": "no",
                    "title": "TIPE",
                    "width": "80px",
                },
                {
                    //"field": "no",
                    "title": "NO SERI",
                    "width": "80px",
                },
                {
                    //"field": "no",
                    "title": "KONDISI",
                    "width": "50px",
                },
                {
                    //"field": "no",
                    "title": "SOP",
                    "width": "50px",
                },
                {
                    //"field": "no",
                    "title": "KETERANGAN",
                    "width": "100px",
                },
                // {
                //     //"field": "no",
                //     "title": "SUDAH",
                //     "width": "80px",
                // },
                // {
                //     //"field": "no",
                //     "title": "BELUM",
                //     "width": "80px",
                // },
                // {
                //     //"field": "no",
                //     "title": "TIDAK PERNAH",
                //     "width": "80px",
                // },
                // {
                //     //"field": "no",
                //     "title": "TERKALIBRASI",
                //     "width": "80px",
                // },
                // {
                //     //"field": "no",
                //     "title": "JUMLAH ALAT",
                //     "width": "80px",
                // },                
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            };

            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            $scope.diagnosaICD10 = function () {
                debugger;
                // $state.go('RiwayatRegistrasi3', {
                //     nocm: $scope.item.nocm,
                //     noregistrasi: $scope.item.noregistrasi
                // });
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('DiagnosaDokterCtrl', arrStr);
                $state.go('DiagnosaDokter')
            }
            $scope.diagnosaICD9 = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('DiagnosaDokterICD9Ctrl', arrStr);
                $state.go('DiagnosaDokterICD9')
            }
            $scope.showInputDiagnosaDokter = function () {
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')

            }
            $scope.rekamMedisElektronik = function () {
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan + '`'
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis.VitalSign', {
                    noRec: $scope.item.norec_apd
                })

            }

            $scope.resep = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }

            $scope.laboratorium = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }

            $scope.radiologi = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }

            $scope.inputTindakanDokter = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                // cacheHelper.set('inputTindakanDokterRevCtrl', arrStr);
                // $state.go('inputTindakanDokterRev')
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: $scope.item.norec_pd,
                    norecAPD: $scope.item.norec_apd,

                });
            }
            // $scope.detailOrder = function() {
            //     debugger;
            //     if ($scope.item.nocm ==null && $scope.item.norec_apd == null){
            //         window.messageContainer.error("Pilih Dahulu Pasien!")
            //         return
            //     }else{
            //         $state.go('dashboardpasien.BillingDetail', {
            //             noRecRegistrasi: $scope.item.norec_pd,
            //             noRec: $scope.item.norec_apd
            //         });
            //     }

            // }
            $scope.Monitoring = function () {
                $state.go('MonitoringPasien', {
                    noCm: $scope.item.nocm
                });
            }
            $scope.skriningGizi = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }
                $state.go('SkriningGizi&TandaVitalRev', {
                    norecPD: $scope.item.norec_apd,
                });
            }
            $scope.PengkajianAwal = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.DashboardPAP', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd,
                    ruangana: $scope.item.objectruanganfk
                });
                // } else {
                //     $state.go('dashboardpasien.DashboardPAP', {
                //         noCM: $scope.item.nocm,
                //         tanggal: moment(new Date($scope.item.nocm .tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //         noRec: $scope.item.noRec,
                //         ruangana:$scope.item.ruangan.id
                //     });
                // }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.PengkajianMedis = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.PengkajianMedis', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd,
                    ruangana: $scope.item.objectruanganfk
                });
                // } else {
                //         $state.go('dashboardpasien.PengkajianMedis', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec,
                //             ruangana:$scope.item.ruangan.id
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            // $scope.detailOrder = function() {

            //     $state.go('dashboardpasien.BillingDetail', {
            //         noRecRegistrasi: $scope.item.norec_pd,
            //         noRec: $scope.item.norec_apd
            //     });
            // }

            $scope.detailPasien = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.pasien', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd
                });
                //     } else {
                //         $state.go('dashboardpasien.pasien', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.PengkajianLanjutan = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.pengkajianLanjutan', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd,
                    ruangana: $scope.item.objectruanganfk
                });
                //     } else {
                //         $state.go('dashboardpasien.pengkajianLanjutan', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec,
                //             ruangana:$scope.item.ruangan.id
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            // var arrFieldSelectVoPekerjaan = ['id', 'namaRuangan'];
            // ModelItem.getDataDummyGeneric("Ruangan", true, undefined, 10).then(function(data) {
            //     $scope.ruangans = data;
            // });

            $scope.findData = function () {
                loadData()
            }

            $scope.pemeriksaanPasien = function () {
                var cookie = document.cookie.split(';');

                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.pengkajianUtama', {
                            noCM: $scope.item.pasien.noCm,
                            tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.noRec
                        });
                    } else {
                        $state.go('dashboardpasien.pengkajianUtama', {
                            noCM: $scope.item.pasien.noCm,
                            tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.noRec
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }

            $scope.cekStatusBeforePemeriksaan = function (statusCode, statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": true
                }
                switch (statusCode) {
                    case "suster":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.status = true;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                    case "dokter":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.status = true;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.msg = "Pasien harus di panggil dokter terlebih dahulu";
                                obj.status = false;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                }

                return obj;
            }

            $scope.cekStatusBeforePanggil = function (statusCode, statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": false,
                    "statusAntrian": 0
                }

                switch (statusCode) {
                    case "suster":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.msg = "Pasien sudah di panggil suster";
                                obj.status = false;
                                break;
                            case "MENUNGGU":
                                obj.status = true;
                                obj.statusAntrian = 1;
                                break;
                        };
                        break;
                    case "dokter":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.status = true;
                                obj.statusAntrian = 2;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                }

                return obj;
            }

            $scope.TambaData = function (item, data) {
                if (data === undefined)
                    data = $scope.item;

                $scope.item = data;
                medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                    $scope.listDokter = data.data.dokter;
                })
                // show popup untuk pilih dokter
                $scope.TambahAlat.center().open();
            }

            $scope.EditAlat = function (item, data) {
                if (data === undefined)
                    data = $scope.item;

                $scope.item = data;
                medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                    $scope.listDokter = data.data.dokter;
                })
                // show popup untuk pilih dokter
                $scope.editAlat.center().open();
            }

            $scope.InputJadwalKalibrasi = function(item, data) {
                $scope.inputJadwalKalibrasi.center().open()
            }

            $scope.InputJadwalPemeliharaan = function(item, data) {
                $scope.inputJadwalPemeliharaan.center().open()
            }

            $scope.LihatJadwalKalibrasi = function(item, data) {
                $scope.lihatJadwalKalibrasi.center().open()
            }

            $scope.LihatJadwalPemeliharaan = function(item, data) {
                $scope.lihatJadwalPemeliharaan.center().open()
            }
            $scope.simpanDokter = function (item, data) {
                var listRawRequired = [
                    "items.pilihDokter|k-ng-model|Dokter"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    // munculkan nama dokter di grid
                    // items.pilihDokter = data.data.dokter.namalengkap;

                    // save dokter yang dipilih
                    var tmpData = {
                        norec_apd: $scope.item.norec_apd,
                        iddokter: $scope.items.pilihDokter.id
                    }
                    medifirstService.post('rawatinap/save-update-dokter-antrian', tmpData).then(function (e) {
                        // update status antrian
                        $scope.winDialogss.close();
                        loadData();
                        // $scope.findData(); 
                        $scope.items.pilihDokter = '';

                    });

                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.cetakGelang = function () {
                if ($scope.item != undefined) {
                    var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/gelangPasien?id=" + $scope.item.nocmfk);
                    window.open(fixUrlLaporan, '_blank')
                }
            }
            $scope.pasienPulang = function () {

                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu', 'Informasi');
                } else {
                    medifirstService.get("rawatinap/get-ruangan-last?norec_pd=" + $scope.item.norec_pd).then(function (a) {
                        $scope.item.ruanganLast = a.data.data[0].objectruanganlastfk
                        if ($scope.item.ruanganLast != undefined) {
                            $state.go('PindahPulangPasien', {
                                norecPD: $scope.item.norec_pd,
                                norecAPD: $scope.item.norec_apd
                            });
                            var CachePindah = $scope.item.ruanganLast
                            cacheHelper.set('CachePindah', CachePindah);
                        }
                    })
                }

            }
            $scope.pemeriksaanUscom = function () {
                if ($scope.item.namadokter == undefined) {
                    alert("Dokter Belum Dipilih!!");
                    return;
                    // $scope.cekDokter();
                } else {
                    $state.go('HasilPemeriksaanUscom', {
                        noRecRegistrasi: $scope.item.norec_pd,
                        noRec: $scope.item.norec_apd
                    });
                }
            }

            // $scope.skriningGizi = function() {
            //     if ($scope.item.namadokter == undefined) {
            //         alert("Dokter Belum Dipilih!!");
            //         return;
            //     } else {
            //         var cookie = document.cookie.split(';');
            //         var statusCode = ModelItem.getStatusUser();
            //         // var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
            //         // if (objValid.status) {
            //             saveToWindow.setItemToWindowChace("isRawatInap", false);
            //             cookie = cookie[0].split('=');
            //             // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
            //                 $state.go('DashboarSkriningGizi', {
            //                     noCM: $scope.item.nocm,
            //                     tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
            //                     noRec: $scope.item.norec_apd,
            //                     ruangana: $scope.item.objectruanganfk
            //                 });
            //         //     } else {
            //         //         $state.go('DashboarSkriningGizi', {
            //         //             noCM: $scope.item.pasien.noCm,
            //         //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
            //         //             noRec: $scope.item.noRec,
            //         //             ruangana:$scope.item.ruangan.id
            //         //         });
            //         //     }
            //         // } else {
            //         //     window.messageContainer.error(objValid.msg);
            //         // }
            //     }
            // }

            $scope.observasi = function () {
                if ($scope.item.namadokter == undefined) {
                    alert("Dokter Belum Dipilih!!");
                    return;
                } else {
                    var cookie = document.cookie.split(';');
                    var statusCode = ModelItem.getStatusUser();
                    var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                    // if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                    $state.go('FormulirObservasiHarianTerintegrasiIntensiveCareUnit', {
                        noCM: $scope.item.nocm,
                        tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                        noRec: $scope.item.norec_apd,
                        noRecDaftar: $scope.item.norec_pd,
                        ruangana: $scope.item.objectruanganfk
                    });
                    //     } else {
                    //         $state.go('FormulirObservasiHarianTerintegrasiIntensiveCareUnit', {
                    //             noCM: $scope.item.pasien.noCm,
                    //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    //             noRec: $scope.item.noRec,
                    //             noRecDaftar: $scope.item.pasienDaftar.noRec,
                    //             ruangana:$scope.item.ruangan.id
                    //         });
                    //     }
                    // } else {
                    //     window.messageContainer.error(objValid.msg);
                    // }
                }
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

            // edit data registrasi pasien
            $scope.cekStatusBeforeEdit = function (statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": true
                }

                switch (statusAntrian) {
                    case "DIPANGGIL_DOKTER":
                        obj.msg = "Pasien sudah di panggil dokter";
                        obj.status = false;
                        break;
                    case "DIPANGGIL_SUSTER":
                        obj.msg = "Pasien sudah di panggil dokter";
                        obj.status = false;
                        break;
                    case "MENUNGGU":
                        obj.status = true;
                        break;
                }
                return obj;
            }
            $scope.editRegistrasi = function () {
                // var objValid = $scope.cekStatusBeforeEdit($scope.item.statusAntrian);
                // if (objValid.status) {
                $state.go('editRegistrasiPelayanan', {
                    noCm: $scope.item.pasien.noCm,
                    noRec: $scope.item.pasienDaftar.noRec
                });
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }
            $scope.formatJam24 = {
                value: new Date(),          //set default value
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm",        //set drop down time format to 24 hours
            }
            $scope.Detail = function () {
                if ($scope.item.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.item.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }
            }
            $scope.TransaksiLayanan = function () {
                // debugger;
                if ($scope.item.norec_apd == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                } else {
                    $state.go('DashboardPasien', {
                        noregistrasi: $scope.item.noregistrasi,
                        norec_pd: $scope.item.norec_pd,
                        norec_apd: $scope.item.norec_apd,
                        umur: $scope.item.umurzz,
                        idpegawai: $scope.pegawai.id
                    });
                }
            }

            $scope.pengkajianMedis = function () {
                // debugger
                if ($scope.item.noregistrasi == undefined) {
                    toastr.error('Pilih Data dulu')
                    return
                }
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.PengkajianMedis', {
                            noCM: $scope.item.nocm,
                            tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.norec_pd,
                            ruangana: $scope.item.objectruanganfk
                        });
                    } else {
                        $state.go('dashboardpasien.PengkajianMedis', {
                            noCM: $scope.item.nocm,
                            tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.norec_pd,
                            ruangana: $scope.item.objectruanganfk
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }


            // **** Kejadian pasien jatuh
            $scope.dialog = {
                tglJatuh: $scope.now
            }
            $scope.pasienJatuh = function () {
                if (!$scope.item.norec_pd) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.dialog.nocm = $scope.item.nocm
                $scope.dialog.namapasien = $scope.item.namapasien
                $scope.dialog.norec_pd = $scope.item.norec_pd
                $scope.dialog.nocmfk = $scope.item.nocmfk

                $scope.dialogPasienJatuh.center().open()
            }
            $scope.simpanJatuh = function (data) {
                var objsave = {
                    "norec": "",
                    "statusenabled": true,
                    "nocmfk": $scope.dialog.nocmfk,
                    "noregistrasifk": $scope.dialog.norec_pd,
                    "jumlah": $scope.dialog.jumlah != undefined ? $scope.dialog.jumlah : 0,
                    "tgljatuh": moment(data.tglJatuh).format('YYYY-MM-DD HH:mm'),
                    "keterangan": data.keterangan != undefined ? data.keterangan : '-',
                }
                medifirstService.post('rawatinap/save-pasien-jatuh', objsave).then(function (e) {
                    $scope.dialog = {}
                })
            }
            $scope.klikdua = function (item) {
                // if (item.foto != null) {
                //     $scope.item.image = item.foto
                //     $scope.popUpPhoto.center().open()

                // }

            }
            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }
            $scope.showKompleks = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.iskompleks == true)
                    $scope.item.isKompleks = true
                $scope.popUpKompleks.center().open()
            }
            $scope.saveKompleks = function (komplek) {

                var data = {
                    'nocm': $scope.item.nocm,
                    'iskompleks': komplek
                }
                medifirstService.post('rawatjalan/save-pasien-kompleks', data).then(function (e) {
                    loadData()
                    $scope.item.isKompleks = false
                })
            }
            $scope.showMPP = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.isMPP == true)
                    $scope.item.isMPP = true
                $scope.popUpMPP.center().open()
            }
            $scope.saveMPP = function (MPP) {

                var data = {
                    'nocm': $scope.item.nocm,
                    'isMPP': MPP
                }
                medifirstService.post('rawatjalan/save-pasien-mpp', data).then(function (e) {
                    loadData()
                    $scope.item.isMPP = false
                })
            }
            $scope.batalPindah = function () {
                medifirstService.get("rawatinap/get-ruangan-last?norec_pd=" + $scope.item.norec_pd).then(function (e) {
                    $scope.item.ruanganLast = e.data.data[0].objectruanganlastfk

                    var tes = {
                        "norec_pd": $scope.item.norec_pd,
                        "objectruanganlastfk": $scope.item.ruanganLast
                    }

                    if (tes == undefined) {
                        window.messageContainer.error("Pilih Pasien Dahulu!");
                        return;
                    }

                    $scope.tombolSimpanBatalPindah = false
                    medifirstService.post('rawatinap/save-batal-pindah-ruangan', tes).then(function (e) {
                        loadData();
                        $scope.tombolSimpanBatalPindah = true
                    }, function (error) {
                        $scope.tombolSimpanBatalPindah = true
                    });
                })
            }

            $scope.InsidenInternal = function () {
                if ($scope.item.norec_pd == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.item.norec_pd,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.item.norec_pd,
                    noOrder: 'InputInsidenInternal'
                });
            }
        }
    ]);
});