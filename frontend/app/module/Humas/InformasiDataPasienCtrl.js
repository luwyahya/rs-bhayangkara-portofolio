define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InformasiDataPasienCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'ModelItem', 'DateHelper', '$http', '$state', 'MedifirstService',
        function (cacheHelper, $q, $rootScope, $scope, ModelItem, dateHelper, $http, $state, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            loadFirst()
            function loadFirst() {
                $scope.item.jmlRows = 50;
                var chacePeriode = cacheHelper.get('InformasiDataPasienCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                }
            }
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }
            function loadData() {

                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&norm=" + $scope.item.noRM
                }
                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.item.namaPasien
                }
                var ayah = ""
                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                }
                var almat = ""
                if ($scope.item.alamat != undefined) {
                    almat = "&alamat=" + $scope.item.alamat
                }
                var ayah = ""
                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                } 
                var tglLahirs = ""
                if ($scope.item.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
                }
                var jmlRows = ""
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = "&jmlRows=" + $scope.item.jmlRows;
                }

                medifirstService.get("humas/get-data-informasi-pasien?" +
                    tglLahirs + rm + pasien + ayah + almat + jmlRows)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var data = data.data.daftar;
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data,
                            pageSize: 10,
                            total:data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });                        
                });
            };

            $scope.columnGrid = [
                {
                    "field": "nocm",
                    "title": "No Rekam Medis",
                    "width": "80px",                    
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",                    
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "80px",
                },

                {
                    "field": "namaayah",
                    "title": "Penanggung Jawab",
                    "width": "100px",
                    "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },               
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "200px",

                },
                {
                    "field": "notelepon",
                    "title": "No Telepon",
                    "width": "80px",
                    "template": '# if( notelepon==null) {# - # } else {# #= notelepon # #} #'
                },
                {
                    "field": "nohp",
                    "title": "No HP",
                    "width": "80px",
                    "template": '# if( nohp==null) {# - # } else {# #= nohp # #} #'
                }
            ];

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm
                    $scope.idPasien = dataPasienSelected.nocmfk
                    $scope.dataPasienSelected = dataPasienSelected
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            
            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("RegistrasiPelayananRev", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })

            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",
                    
                    ],
                    excel: {
                        fileName: "DaftarRiwayatRegistrasi.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:K1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value:"Daftar Registrasi Pasien",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                },
                selectable: 'row',
                pageable: true,
                columns:[
                    {
                        "field": "no",
                        "title": "No",
                        "width":"30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width":"80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width":"90px"
                    },                    
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width":"150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width":"150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },                    
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width":"80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },                    
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width":"80px"
                    }                             
                ]
            };

            $scope.RiwayatRegistrasi = function(){     
               if ($scope.dataPasienSelected == undefined) {
                   messageContainer.error("Pilih data dulu!")
               }
               $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
               $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
               $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD');
               loadDataRiwayat();
               $scope.popUpRiwayatRegistrasi.center().open();
               var actions = $scope.popUpRiwayatRegistrasi.options.actions; 
               actions.splice(actions.indexOf("Close"), 1); 
               $scope.popUpRiwayatRegistrasi.setOptions({ actions : actions });
            }

            $scope.TutupPopUp = function(){
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []                   
                });           
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadDataRiwayat(){
                $scope.isRouteLoading=true;               
                var rm =""
                if ($scope.itemD.noRM != undefined){
                     rm ="&norm=" + $scope.itemD.noRM
                }   

                var pasien =""
                if ($scope.itemD.namaPasien != undefined){
                     pasien ="&namaPasien=" + $scope.itemD.namaPasien
                }   
               
                var tglLahirs =""
                if ($scope.itemD.tglLahir != undefined){
                     tglLahirs ="tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg =""
                if ($scope.itemD.noRegistrasi != undefined){
                     noReg ="&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("humas/get-data-informasi-riwayat-registrasi?"+tglLahirs+rm+noReg+pasien).then(function(data) {
                    $scope.isRouteLoading=false;
                    var jumlahRawat = 0;
                    var dRiwayatReg = data.data.daftar;
                    for (var i = 0; i < dRiwayatReg.length; i++) {
                       dRiwayatReg[i].no = i+1
                       if (dRiwayatReg[i].statusinap  == 1) {
                           jumlahRawat = jumlahRawat + 1;
                           if (dRiwayatReg[i].tglpulang != undefined) {                                    
                                var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                var bln = umur.month,
                                    thn = umur.year,
                                    day = umur.day
                                dRiwayatReg[i].lamarawat = day + " Hari";
                           }else{
                                var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date( $scope.now));
                                var bln = umur.month,
                                    thn = umur.year,
                                    day = umur.day
                                dRiwayatReg[i].lamarawat = day + " Hari";
                           }
                       }
                    }
                    $scope.itemD.JumlahRawat = jumlahRawat;
                    $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                        data: dRiwayatReg,
                        pageSize: 10,
                        total:dRiwayatReg.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });                                  
                });
            }

            $scope.SearchEnterDetail = function(){
                loadDataRiwayat();
            }

////////////////////////////////////////////////////////////////////        END         ///////////////////////////////////////////        
        }
    ]);
});