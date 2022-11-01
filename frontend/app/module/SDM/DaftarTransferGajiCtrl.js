define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarTransferGajiCtrl',  ['$state', '$mdDialog', '$q', '$scope', 'CacheHelper', 'MedifirstService',
    function ($state, $mdDialog, $q, $scope, cacheHelper, medifirstService) {
            $scope.dataVOloaded1 = true;
            $scope.dataPasienSelected = {};
            $scope.now = new Date();
            $scope.item = {};
            var updateAnyar = [];
            var updateLuwihAnyar = [];
            $scope.item.katagori = [];
            var dataPegawai = [];
            var listKatagori1 = "";
            $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-01 00:00'));
            $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
            $scope.item.tglupdate = new Date(moment($scope.now).format('YYYY-MM-01 00:00'));
            loadCombo();
            loadCombo2();
            // loadData();
            function loadCombo() {
                medifirstService.get("sdm/get-katagori-pegawai").then(function (dat) {
                    $scope.listKatagori = dat.data;
                    dataPegawai = dat.data
                    // if (dataPegawai != undefined) {
					// 	$scope.item.katagori = [{ id: dataPegawai[0].id, kategorypegawai: dataPegawai[0].kategorypegawai }];
					// }
                    $scope.selectOptionsRuangan = {
						placeholder: "Pilih ...",
						dataTextField: "kategorypegawai",
						dataValueField: "id",
						// dataSource:{
						//     data: $scope.listRuangan
						// },
						autoBind: false
	
                    };
                    loadData();
                });
               

            }
            function loadCombo2() {
                medifirstService.get("sdm/get-combo-honor").then(function (o) {
                    debugger;
                    $scope.listKedudukan = o.data
                })
            }
           
            function loadData() {
                listKatagori1 ="";
                $scope.isRouteLoading = true;
                if ($scope.item.katagori.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.katagori.length - 1; i >= 0; i--) {

                        var c = $scope.item.katagori[i].id
                        b = "," + c
                        a = a + b
                    }


                    
                    listKatagori1 = a.slice(1, a.length)
                }
                debugger
                // var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
                // var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');
                var bulan = moment($scope.item.tanggalRegistrasiAwal).format('MM')
                var tahun = moment($scope.item.tanggalRegistrasiAwal).format('YYYY')

                var nama = ""
                if ($scope.item.namaPegawai != undefined) {
                    nama = "&nama=" + $scope.item.namaPegawai
                }

                
                medifirstService.get('sdm/get-rekening-pegawai2?katagori=' + listKatagori1 + "&bulan=" + bulan + "&tahun=" + tahun + nama).then(function (dat) {
                    $scope.isRouteLoading = false;
                    debugger;
                    if(dat.data.length > 0)
                    {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                    }
                   
                    $scope.dataSourceRek = {
                        data: dat.data,
                        pageSize: 20,
                        total: dat.data.length,
                        serverPaging: false,
                    }
                    $scope.columnGridRek = {
                        toolbar: ["excel"],

                        excel: {
                            fileName: "DaftarTransferGaji.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                                sheet.frozenRows = 2;
                                sheet.mergedCells = ["A1:D1"];
                                sheet.name = "DAFTAR TRANSFER GAJI";

                                var myHeaders = [

                                    {
                                        value: "DAFTAR TRANSFER GAJI ",
                                        fontSize: 15,
                                        textAlign: "center",
                                        background: "#c1d2d2",
                                        // color:"#ffffff"
                                    }];
        
                                sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });

                        },

                        selectable: 'row',
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        scrollable: false,
                        columns: [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "15px"
                            },
                            {
                                "field": "namapegawai",
                                "title": "Nama",
                                "width": "200px",
                                "template": "<span class='style-left'>#:namapegawai #</span>"
                            },
                            {
                                "field": "nomorrekening2",
                                "title": "Bank BNI",
                                "width": "100px",
                                "template": "<span class='style-left'>#:nomorrekening2 #</span>"
                            },
                            {
                                "field": "norekeningdua",
                                "title": "Bank Nagari",
                                "width": "100px",
                                "template": "<span class='style-left'>#:norekeningdua #</span>"
                            },
                            {
                                "field": "salary2",
                                "title": "Jumlah Nominal BNI",
                                "width": "100px",
                                "template": "<span class='style-left'>{{formatRupiah2('#:salary2 #', '')}}</span>"
                            },
                            {
                                "field": "salarydua",
                                "title": "Jumlah Nominal Nagari",
                                "width": "100px",
                                "template": "<span class='style-left'>{{formatRupiah2('#:salarydua #', '')}}</span>"
                            }
                        ]
                    }
                    $scope.formatRupiah2 = function (value, currency) {
                        return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                      }
                })
            }
            $scope.SearchData = function () {
			
				loadData();
			}
            $scope.Update = function () {
                $scope.popUpUpdateData.center().open();
            }
            $scope.GaskeunUpdate = function () {
                var bulan = new moment($scope.item.tglupdate).format('MM')
                    
                var tahun = new moment($scope.item.tglupdate).format('YYYY')

                    medifirstService.get('sdm/cek-sudah-update?' + 'bulan=' + bulan + '&tahun=' + tahun).then(function(d) {
                        debugger
                        var wesupdate = d.data[0]
                        if (wesupdate == undefined) {
                            wesupdate = ''
                        }
                        var tglsingdipilih = new moment($scope.item.tglupdate).format('YYYY-MM-01 00:00:00')
                        if (wesupdate.tglupdate == tglsingdipilih) {
                            $scope.pesan = "Yakin Update ? Periode " + new moment($scope.item.tglupdate).format('MMM YYYY') + " Sudah Pernah Di Update Sebanyak " + wesupdate.cekupdate + " Kali"
                            $scope.popUpPassword.center().open();
                            return;
                        } else {
                            save()
                        }
                    })
                    }
            $scope.GaskeunUpdate2 = function () {
                if ($scope.item.password != "baksokotak") {
                    toastr.error('Password Salah !')
                    return;
                } else {
                    save2()
                }
            }
            // $scope.GaskeunUpdate = function () {
            //     var bulan = new moment($scope.item.tglupdate).format('MM')
                    
            //     var tahun = new moment($scope.item.tglupdate).format('YYYY')

            //         medifirstService.get('sdm/cek-sudah-update?' + 'bulan=' + bulan + '&tahun=' + tahun).then(function(d) {
            //             debugger
            //             var wesupdate = d.data[0]
            //             if (wesupdate == undefined) {
            //                 wesupdate = ''
            //             }
            //             var tglsingdipilih = new moment($scope.item.tglupdate).format('YYYY-MM-01 00:00:00.000')
            //             if (wesupdate.tglupdate == tglsingdipilih) {
            //                 alert('Periode : ' + new moment($scope.item.tglupdate).format('MMM YYYY') + ' Sudah diupdate, tidak dapat diupdate lagi !')
            //                 return;
            //             }
            //             var stt = 'false'
            //     if (confirm('Update Data Daftar Transfer Gaji ?' + ' Periode : ' + new moment($scope.item.tglupdate).format('MMM YYYY'))) {
            //         // Save it!
            //         stt = 'true';
            //     } else {
            //         // Do nothing!
            //         stt = 'false'
            //     } 
            //     if (stt == 'true') {
            //         $scope.popUpUpdateData.close();
            //         $scope.isRouteLoading = true;
            //         medifirstService.get('sdm/get-update-pegawai?').then(function(au) {
            //             debugger;
            //             var mumet = au.data

            //             for(let i = 0; i < mumet.length; i ++) {
            //                 var dataAnyar = {
            //                     "idPegawai": mumet[i].id,
            //                     "namapegawai": mumet[i].namalengkap,
            //                     "salary": mumet[i].salary,
            //                     "norekening": mumet[i].bankrekeningnomor,
            //                     "kategorypegawai": mumet[i].kategorypegawai,
            //                     "tglUpdate": new moment($scope.item.tglupdate).format('YYYY-MM-01 00:00:00')
            //                 }
            //                 updateAnyar.push(dataAnyar);
            //             }
            //             var objAnyar = {
            //                 "updateAnyar": updateAnyar,
            //             }
            //             medifirstService.post('sdm/save-transfer-gaji', objAnyar).then(function (e) {

            //             })
            //             $scope.isRouteLoading = false;
            //             loadData()

            //         })
            //     }else {
            //         $scope.isRouteLoading = false;
            //     }
            //         })
                
                // var stt = 'false'
                // if (confirm('Update Data Daftar Transfer Gaji ?' + ' Periode : ' + new moment($scope.item.tglupdate).format('MMM YYYY'))) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // } 
                // if (stt == 'true') {
                //     $scope.popUpUpdateData.close();
                //     $scope.isRouteLoading = true;
                //     medifirstService.get('sdm/get-update-pegawai?').then(function(au) {
                //         debugger;
                //         var mumet = au.data

                //         for(let i = 0; i < mumet.length; i ++) {
                //             var dataAnyar = {
                //                 "idPegawai": mumet[i].id,
                //                 "namapegawai": mumet[i].namalengkap,
                //                 "salary": mumet[i].salary,
                //                 "norekening": mumet[i].bankrekeningnomor,
                //                 "kategorypegawai": mumet[i].kategorypegawai,
                //                 "tglUpdate": new moment($scope.item.tglupdate).format('YYYY-MM-01 00:00:00')
                //             }
                //             updateAnyar.push(dataAnyar);
                //         }
                //         var objAnyar = {
                //             "updateAnyar": updateAnyar,
                //         }
                //         medifirstService.post('sdm/save-transfer-gaji', objAnyar).then(function (e) {

                //         })
                //         $scope.isRouteLoading = false;
                //         loadData()

                //     })
                // }else {
                //     $scope.isRouteLoading = false;
                // }
                 
            // }
            function save() {
            var stt = 'false'
                if (confirm('Update Data Daftar Transfer Gaji ?' + ' Periode : ' + new moment($scope.item.tglupdate).format('MMM YYYY'))) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                } 
                if (stt == 'true') {
                    $scope.popUpUpdateData.close();
                    $scope.isRouteLoading = true;
                    medifirstService.get('sdm/get-update-pegawai?').then(function(au) {
                        debugger;
                        var mumet = au.data

                        for(let i = 0; i < mumet.length; i ++) {
                            var dataAnyar = {
                                "idPegawai": mumet[i].id,
                                "namapegawai": mumet[i].namalengkap,
                                "salary": mumet[i].salary,
                                "salarydua": mumet[i].salarydua,
                                "norekening": mumet[i].bankrekeningnomor,
                                "norekeningdua": mumet[i].bankrekeningnomordua,
                                "kategorypegawai": mumet[i].kategorypegawai,
                                "tglUpdate": new moment($scope.item.tglupdate).format('YYYY-MM-01 00:00:00')
                            }
                            updateAnyar.push(dataAnyar);
                        }
                        var objAnyar = {
                            "updateAnyar": updateAnyar,
                        }
                        medifirstService.post('sdm/save-transfer-gaji', objAnyar).then(function (e) {
                            $scope.isRouteLoading = false;
                            loadData()
                        })

                    })
                }else {
                    $scope.isRouteLoading = false;
                }
            }
            function save2() {
                var bulan = moment($scope.item.tglupdate).format('MM')
                var tahun = moment($scope.item.tglupdate).format('YYYY')
                var stt = 'false'
                    if (confirm('Update Data Daftar Transfer Gaji ?' + ' Periode : ' + new moment($scope.item.tglupdate).format('MMM YYYY'))) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    } 
                    if (stt == 'true') {
                        $scope.popUpPassword.close();
                        $scope.popUpUpdateData.close();
                        $scope.isRouteLoading = true;
                        medifirstService.get('sdm/get-edit-update-pegawai?' + "&bulan=" + bulan + "&tahun=" + tahun).then(function(au) {
                            debugger;
                            var mumet = au.data
    
                            for(let i = 0; i < mumet.length; i ++) {
                                var dataLuwihAnyar = {
                                    "idPegawai": mumet[i].idpegawai,
                                    "namapegawai": mumet[i].namalengkap,
                                    "salary": mumet[i].salary,
                                    "norekening": mumet[i].bankrekeningnomor,
                                    "norekeningdua": mumet[i].bankrekeningnomordua,
                                    "kategorypegawai": mumet[i].kategorypegawai,
                                    "cekupdate": mumet[i].cekupdate,
                                    "tglUpdate": new moment($scope.item.tglupdate).format('YYYY-MM-01 00:00:00')
                                }
                                updateLuwihAnyar.push(dataLuwihAnyar);
                            }
                            var objLuwihAnyar = {
                                "updateLuwihAnyar": updateLuwihAnyar,
                            }
                            medifirstService.post('sdm/save-edit-data', objLuwihAnyar).then(function (e) {
                                $scope.isRouteLoading = false;
                                loadData()
                            })
    
                        })
                    }else {
                        $scope.isRouteLoading = false;
                    }
                }

            $scope.BulanTahunAja = {
                start: "year",
                depth: "year"
            }
            $scope.Batal = function() {
                $scope.popUpUpdateData.close();
            }
            $scope.ShowPopUpEditGaji = function () {
                debugger
                if ($scope.dataPasienSelected.idpegawai == undefined) {
                    toastr.error('Pegawai Belum Dipilih !')
                    return
                }
                $scope.item.pegawai = $scope.dataPasienSelected.namapegawai
                $scope.item.tgl = moment($scope.dataPasienSelected.tglupdate).format('MMM YYYY')
                $scope.item.editsalary = $scope.dataPasienSelected.salary2
                $scope.popUpEditGaji.center().open();
            }
            $scope.Password = function () {
                $scope.popUpPasswordEdit.center().open();
            }
            $scope.saveEditGaji = function() {
                debugger
                if ($scope.item.password2 != "baksokotak") {
                    toastr.error('Password Salah !')
                    return;
                }
                $scope.popUpPasswordEdit.close();
                $scope.item.password2 = undefined
                var stt = 'false';
                if (confirm('Yakin Edit Gaji ' + $scope.item.pegawai + ' Dari ' + 'Rp. ' + parseFloat($scope.dataPasienSelected.salary2).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                 + ' Menjadi ' + 'Rp. ' + parseFloat($scope.item.editsalary).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                 + ' Periode : ' + new moment($scope.item.tgl).format('MMM YYYY'))) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                if (stt == 'true') {
                    var editgaji = {
                        idPegawai: $scope.dataPasienSelected.idpegawai,
                        tgl: $scope.dataPasienSelected.tglupdate,
                        salary: $scope.item.editsalary
                    }
                    medifirstService.post('sdm/save-edit-gaji', editgaji).then(function(e) {

                    })
                }
                $scope.popUpEditGaji.close(); 
            }
            //$scope.formatRupiah2 = function (value, currency) {
              //  return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //}


           
        }
])
})