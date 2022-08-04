define(['initialize'], function (initialize) {
    'use strict';
        initialize.controller('DaftarPasienBelumTutupFakturCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService', 
            function (cacheHelper, $scope, dateHelper, medifirstService) {
                FormLoad();   
                function FormLoad(){
                    $scope.isRouteLoading = false;
                    $scope.now = new Date();
                    $scope.date = new Date();
                    $scope.dataSelected = {};
                    $scope.item = {}; 
                    $scope.isRuanganRJ = true
                    LoadCombo();
                }
    
                $scope.showAndHide = function () {
                    $('#contentPencarian').fadeToggle("fast", "linear");
                }
    
                function LoadCombo(){
                    $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {                                    
                        $scope.listDepartemen = dat.data.departemen; 
                        $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;    
                        $scope.listJenisKelompok = dat.data.jeniskelompokpasien  ;
                        $scope.listPenjamin = dat.data.kelompokpasien  ;
                        $scope.listRekanan = dat.data.rekanan  
                                                    
                    });
    
                    medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function(data) {
                         $scope.listDiagnosa = data;
                    }); 
                    LoadDataGrid();
                }
    
                $scope.getIsiComboRuangan = function () {
                    $scope.listRuangan = $scope.item.departement.ruangan                
                }
                                  
                $scope.SearchData = function () {            
                    LoadDataGrid()             
                }
    
                $scope.ClearData = function (){
                    $scope.item.ruangan = undefined;
                    $scope.item.departement = undefined
                    $scope.item.KelompokPasien = undefined
                    $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
    
                function LoadDataGrid() {                 
                    $scope.isRouteLoading = true;
                    var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                    var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');;            
    
                    var tempDepartemenId = "";              
                    if ($scope.item.departement != undefined) {
                        tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                    }
                    var tempRuanganId = "";
                    if ($scope.item.ruangan != undefined) {
                        tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                    }
                    var tempJenisDiagnosa = ""
                    if ($scope.item.JenisDiagnosa != undefined) {
                        tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                    } 
                    var tempDiagnosa = ""
                    if ($scope.item.Diagnosa != undefined) {
                        tempDiagnosa = "&idDiagnosa=" + $scope.item.Diagnosa.id;
                    }                                                        
                    var tempKelompokPasien = ""
                    if ($scope.item.JenisKelompok != undefined) {
                        tempKelompokPasien = "&kelompokPasien=" + $scope.item.JenisKelompok.id;
                    }
                    var tempKelompokPasien1 = ""
                    if ($scope.item.Penjamin != undefined) {
                        tempKelompokPasien1 = "&kelompokPasien1=" + $scope.item.Penjamin.id;
                    }
                    var tempRekananPasien  = ""
                    if ($scope.item.Rekanan != undefined) {
                        tempRekananPasien  = "&RekananPasien=" + $scope.item.Rekanan.id;
                    }
                    var isRJ = "";
                    if($scope.isRuanganRJ==false){
                        isRJ="&isRJ=" + true
                    }
                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: '',
                        3: '',
                        4: '',
                        5: '',                        
                    }
                    cacheHelper.set('LaporanPasienBatalRegistrasiCtrl', chacePeriode);
                    medifirstService.get("tatarekening/get-data-passien-unclose-faktur?"
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempKelompokPasien  + tempKelompokPasien1 + tempRekananPasien + isRJ ).then(function (data) {
                        $scope.isRouteLoading = false;                                    
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                                                  
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({                            
                            data: datas,
                            group: $scope.group,
                            pageSize: 10,                       
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {                                
                                }
                            }
                        });
                    })
                }
                $scope.ceklispilihManual = function (bool) {
                    if (bool) {
                        $scope.isRuanganRJ = false
                        $scope.item.ruangan=undefined
                        $scope.item.departement=undefined
                    }else{
                        $scope.isRuanganRJ = true
                    }
                }
                $scope.formatRupiah = function(value, currency) {
                    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
    
                $scope.formatTanggal = function (tanggal) {
                    return moment(tanggal).format('DD-MM-YYYY');
                }
    
                $scope.columnLaporan = {
                    toolbar: [
                        "excel",                    
                    ],
                    excel: { fileName: "DaftarPasienBelumTutupFaktur.xlsx", allPages: true, },
                    // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 3;
                        sheet.mergedCells = ["A1:I1"];
                        sheet.name = "Orders";
    
                        var myHeaders = [{
                            value: "Daftar Pasien Belum Tutup Faktur, Namun Sudah Pulang",
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
    
                         { field: "no", title: "No", width: "40px" },
                        {
                            field: "nocm",
                            title: "No Rekam Medis",
                            width: "100px"
                        },
                        {
                            field: "noregistrasi",
                            title: "No. Registrasi",
                            width: "100px",
                        },                   
                        {
                            field: "namapasien",
                            title: "Nama Pasien",
                            width: "140px"
                        },
                        {
                            field: "namaruangan",
                            title: "Ruang Rawat",
                            width: "140px"                        
                        },
                        // {
                        //     field: "kelompokpasien",
                        //     title: "Kelompok Pasien",
                        //     width: "100px"
                        // },
                        {
                            field: "namarekanan",
                            title: "Nama Rekanan",
                            width: "100px"
                        },
                        {
                            field: "tglregistrasi",
                            title: "Tgl Registrasi",
                            width: "100px",
                            template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                        },
                        {
                            field: "tglpulang",
                            title: "Tgl Pulang",
                            width: "100px",
                            template: "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                        },
                        {
                            field: "tutupfaktur",
                            title: "Keterangan",
                            width: "100px",
                        }

                    ] 
                }
                // batalregistrasi_t.alasanpembatalan, batalregistrasi_t.tanggalpembatalan
    ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        ]);
    });