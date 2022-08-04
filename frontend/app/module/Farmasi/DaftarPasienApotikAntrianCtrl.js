define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienApotikAntrianCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {

            // initialize.controller('DaftarPasienApotikCtrl', ['$q', '$rootScope', '$scope', '$window' ,'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,window,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienApotikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        $scope.listDepartemen = [chacePeriode[2]]
                        $scope.item.instalasi = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.listRuangan = [chacePeriode[3]]
                        $scope.item.ruangan = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        $scope.item.listKelompokPasien = [chacePeriode[4]]
                        $scope.item.kelompokPasien = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.item.noReg = chacePeriode[5]
                    }

                    if (chacePeriode[6] != undefined) {
                        $scope.item.noMr = chacePeriode[6]
                    }

                    if (chacePeriode[7] != undefined) {
                        $scope.item.namaPasien = chacePeriode[7]
                    }

                    init();
                }
                else {
                    $scope.item.tglAwal = $scope.now;
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
            var combojenis = [
            {id:1 , jenis:"Non Racikan"},
            {id:2 , jenis:"Racikan"},            
            ];
            var combostatus = [
            {id:1 , statusdipanggil:"Belum Di Panggil"},
            {id:6 , statusdipanggil:"Sudah Di Panggil"},   
            {id:5 , statusdipanggil:"Selesai"},            
            ];
            function loadCombo() {
                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listRuangandepo = dat.data.ruanganfarmasi;
                    $scope.listjenis = combojenis;
                    $scope.listStatusdipanggil= combostatus;
                });
            }
            $scope.cariEnter = function () {
                init()
            }
            var onDataBound = function () {
                            $('td').each(function () {
                              if ($(this).text() == 'Proses') {$(this).addClass('red')}
                              if ($(this).text() == 'Sedang Di panggil') {$(this).addClass('green')}
                              if ($(this).text() == 'Selesai') {$(this).addClass('blue')}
                        if ($(this).text() == 'Sudah Di Panggil') {$(this).addClass('koneng')}
                        if ($(this).text() == 'ATENSI') {$(this).addClass('koneng')}
                      
                            })
                         }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                var tempInstalasi = [];
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                    tempInstalasi = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }

                var rg = ""
                var tempRuangan = [];
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                    tempRuangan = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
                }

                var kp = ""
                var tempKelompokPasien = [];
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kpid=" + $scope.item.kelompokPasien.id
                    tempKelompokPasien = { id: $scope.item.kelompokPasien.id, kelompokpasien: $scope.item.kelompokPasien.kelompokpasien }
                }
                var statusdipanggil = ""
                var tempstatusdipanggil = [];
                if ($scope.item.statusdipanggil != undefined) {
                    var statusdipanggil = "&statusdipanggil=" + $scope.item.statusdipanggil.id
                    // tempKelompokPasien = { id: $scope.item.kelompokPasien.id, kelompokpasien: $scope.item.kelompokPasien.kelompokpasien }
                }

                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                    tempNoReg = $scope.item.noReg;
                }

                var tempnoMr = "";
                if ($scope.item.noMr != undefined) {
                    tempnoMr = $scope.item.noMr;
                }

                var tempNamaPasien = "";
                if ($scope.item.namaPasien != undefined) {
                    tempNamaPasien = $scope.item.namaPasien;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');
                medifirstService.get("farmasi/get-daftar-pasien-farmasi-antrian?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&nocm=" + $scope.item.noMr +
                    "&jenis=Racikan"+
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + statusdipanggil + kp
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = dat.data[i].noantrian
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            if(dat.data[i].statuspanggil ==  1){
                                dat.data[i].status = 'Proses';
                                dat.data[i].status2 = 'PANGGIL';
                                dat.data[i].status3 = 'Belum Selesai';
                            }else if(dat.data[i].statuspanggil == 3){
                                dat.data[i].status = 'Sedang Di panggil';
                                dat.data[i].status2 = 'SUDAH';
                                dat.data[i].status3 = 'Belum Selesai';
                            }else if(dat.data[i].statuspanggil == 5){
                                dat.data[i].status = 'Selesai';
                                dat.data[i].status2 = 'SUDAH';
                                dat.data[i].status3 = 'Selesai';
                            
                            }else if(dat.data[i].statuspanggil == 6){
                                dat.data[i].status = 'Selesai';
                                dat.data[i].status2 = 'SUDAH';
                                dat.data[i].status3 = 'Selesai';
                            
                            }
                            else{
                                dat.data[i].status = 'Sudah Di Panggil';
                                dat.data[i].status2 = 'SUDAH';
                                dat.data[i].status3 = 'Belum Selesai';
                            }

                            //itungUsia(dat.data[i].tgllahir)
                        }
                        $scope.dataGrid = dat.data;
                    });
                medifirstService.get("farmasi/get-daftar-pasien-farmasi-antrian?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&nocm=" + $scope.item.noMr +
                    "&jenis=Non Racikan"+
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + statusdipanggil +  kp
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = dat.data[i].noantrian
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            if(dat.data[i].statuspanggil ==  1){
                                dat.data[i].status = 'Proses';
                                dat.data[i].status2 = 'PANGGIL';
                                dat.data[i].status3 = 'Belum Selesai';
                            }else if(dat.data[i].statuspanggil == 3){
                                dat.data[i].status = 'Sedang Di panggil';
                                dat.data[i].status2 = 'SUDAH';
                                dat.data[i].status3 = 'Belum Selesai';
                            }else{
                                dat.data[i].status = 'Selesai';
                                dat.data[i].status2 = 'SUDAH';
                                dat.data[i].status3 = 'Selesai';
                            }

                            //itungUsia(dat.data[i].tgllahir)
                        }
                        $scope.dataGrid2 = dat.data;
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: tempInstalasi,
                    3: tempRuangan,
                    4: tempKelompokPasien,
                    5: tempNoReg,
                    6: tempnoMr,
                    7: tempNamaPasien
                }
                cacheHelper.set('DaftarPasienApotikCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.TransaksiPelayanan = function () {
                // if ($scope.dataSelected.nostruklastfk != null && $scope.dataSelected.rpp != null) {
                //     window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!")
                //     return
                // }
                debugger;
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.klid,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: '',
                    10: $scope.dataSelected.kpid,
                }
                cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                $state.go('TransaksiPelayananApotik')
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            // $scope.columnGrid = [
            //     {
            //         "field": "no",
            //         "title": "No Urut",
            //         "width": "30px",
            //     },
            //     {
            //         "field": "namaruangan",
            //         "title": "Nama Ruangan",
            //         "width": "130px",
            //     },
            //     {
            //         "field": "nocm",
            //         "title": "No MR",
            //         "width": "70px",
            //     },
            //     {
            //         "field": "namapasien",
            //         "title": "Nama Pasien",
            //         "width": "150px",
            //     },
            //     {
            //         "field": "namapasien",
            //         "title": "Status",
            //         "width": "150px",
            //     },
            //     {
            //         "field": "status",
            //         "title": "Status",
            //         "width": "150px",
            //     },

            //      {
            //             "field": "status2",
            //             "title": "Verifikasi",
            //             "width": "90px",

            //             "template": "<button ng-show=\"tampil\" class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  status2 #</button> ",
            //         },

            // ];

            $scope.columnDaftarPasienPulang = {

                toolbar: [
                    
                    ],
                    excel: {
                        fileName: "DaftarRegistrasiPasien.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:M1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value:"Daftar Registrasi Pasien",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                columns:
                [{
                    "field": "no",
                    "title": "No Urut",
                    "width": "30px",
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "130px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "150px",
                },
                {
                    "field": "status2",
                    "title": "Panggil",
                    "width": "90px",

                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  status2 #</button> ",
                },
                 {
                    "field": "status2",
                    "title": "Pelayanan",
                    "width": "90px",

                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigridselesai(dataItem)\"  style=\"margin:0 0 5px\" >#:  status3 #</button> ",
                }
            ]
        };
        $scope.columnDaftarPasienPulang2 = {

                toolbar: [
                    
                    ],
                    excel: {
                        fileName: "DaftarRegistrasiPasien.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:M1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value:"Daftar Registrasi Pasien",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                columns:
                [{
                    "field": "no",
                    "title": "No Urut",
                    "width": "30px",
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "130px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "150px",
                },
                {
                    "field": "status2",
                    "title": "Panggil",
                    "width": "90px",

                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid2(dataItem)\"  style=\"margin:0 0 5px\" >#:  status2 #</button> ",
                },
                {
                    "field": "status2",
                    "title": "Pelayanan",
                    "width": "90px",

                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigridselesai2(dataItem)\"  style=\"margin:0 0 5px\" >#:  status3 #</button> ",
                }
            ]
        };




            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
            function itungUsia(tgl) {
                debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
            }
            $scope.antrian = function(){
                $scope.popupantrian.center().open();
            }
            $scope.saveantrian = function(){
                debugger;
                var objSave =
                {
                    norecapd: $scope.dataSelected.norec,
                    ruanganfk: $scope.item.ruangandepo.id,
                    jenis : $scope.item.jenis.jenis
                }

                $scope.tombolSimpanVis = false;
                medifirstService.post('farmasi/save-antrian', objSave).then(function (e) {
                    $scope.popupantrian.center().close();
                })
            }
            $scope.InsidenInternal = function () {
                if ($scope.dataSelected.norec_pd == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec_pd,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataSelected.norec_pd,
                    noOrder: 'InputInsidenInternal'
                });
            }

            $scope.verifikasigrid = function (dataItem) {
                debugger;
                if ($scope.item.instalasi == undefined || $scope.item.instalasi == "" ) {
                    alert("Pilih Instalasi !!")
                    return;tempInstalasi = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }

                if ($scope.item.ruangan == undefined || $scope.item.ruangan == ""  ) {
                    alert("Pilih Ruangan !!")
                    return;
                }
                if (dataItem.status !="Selesai")
                {
                    var objverif = {
                        "norec" : dataItem.norec,
                        "status": 3,
                        "objectruanganfk":$scope.item.ruangan.id,
                        "jenis":dataItem.jenis,
                        "statuspanggil":dataItem.status 
                    };

                    medifirstService.post('farmasi/updateantrian',objverif).then(function(e){
                        init();              
                    }) 
                       
                }
                    

            }
             $scope.verifikasigridselesai = function (dataItem) {
                debugger;
                if ($scope.item.instalasi == undefined || $scope.item.instalasi == "" ) {
                    alert("Pilih Instalasi !!")
                    return;tempInstalasi = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }

                if ($scope.item.ruangan == undefined || $scope.item.ruangan == ""  ) {
                    alert("Pilih Ruangan !!")
                    return;
                }
                    var objverif = {
                            "norec" : dataItem.norec,
                            "status": 5,
                            "objectruanganfk":$scope.item.ruangan.id,
                            "jenis":dataItem.jenis,
                            "statuspanggil":dataItem.status 
                        };

                        medifirstService.post('farmasi/updateantrian',objverif).then(function(e){
                            init();              
                        })  
                         
                    

            }
            $scope.verifikasigrid2 = function (dataItem) {
                debugger;
                if ($scope.item.instalasi == undefined || $scope.item.instalasi == "" ) {
                    alert("Pilih Instalasi !!")
                    return;tempInstalasi = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }

                if ($scope.item.ruangan == undefined || $scope.item.ruangan == ""  ) {
                    alert("Pilih Ruangan !!")
                    return;
                }
                if (dataItem.status !="Selesai")
                {
                    var objverif = {
                        "norec" : dataItem.norec,
                        "status": 3,
                        "objectruanganfk":$scope.item.ruangan.id,
                        "jenis":dataItem.jenis,
                        "statuspanggil":dataItem.status  
                    };

                    medifirstService.post('farmasi/updateantrian',objverif).then(function(e){
                        init();              
                    }) 
                       
                }
            }
             $scope.verifikasigridselesai2 = function (dataItem) {
                debugger;
                if ($scope.item.instalasi == undefined || $scope.item.instalasi == "" ) {
                    alert("Pilih Instalasi !!")
                    return;tempInstalasi = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }

                if ($scope.item.ruangan == undefined || $scope.item.ruangan == ""  ) {
                    alert("Pilih Ruangan !!")
                    return;
                }
                    var objverif = {
                            "norec" : dataItem.norec,
                            "status": 5,
                            "objectruanganfk":$scope.item.ruangan.id,
                            "jenis":dataItem.jenis,
                            "statuspanggil":dataItem.status 
                        };

                        medifirstService.post('farmasi/updateantrian',objverif).then(function(e){
                            init();              
                        })   
                    

            }
            //***********************************

        }

    ]);
});
