define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MappingEmrToRuanganCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
        function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.model = {};
            $scope.selectedData = [];
            $scope.cekDep = true;
            $scope.cekRu = true;
            $scope.cekDep2 = true;
            $scope.cekRu2 = true;
            var passwordEntered = false;
            loadCombo()
            loadData()

            function loadCombo() {
                medifirstService.get('emr/get-combo-anyar-hehe?').then(function (dat) {
                    $scope.listEmr = dat.data.navigasi
                    $scope.listRuangan = dat.data.ruangan
                    $scope.listDepartemen = dat.data.departemen
                    $scope.listJenisPegawai = dat.data.jenispegawai
                })
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var emr = ''
                if ($scope.item.namaEmr != undefined) {
                    emr = 'idEmr=' + $scope.item.namaEmr.id
                }
                var ruangan = ''
                if ($scope.item.namaEmr != undefined) {
                    if ($scope.item.ruangan != undefined) {
                        ruangan = '&idRuangan=' + $scope.item.ruangan.id
                    }
                } else {
                    if ($scope.item.ruangan != undefined) {
                        ruangan = 'idRuangan=' + $scope.item.ruangan.id
                    }
                }
                var departemen = ''
                if ($scope.item.namaEmr != undefined) {
                    if ($scope.item.departemen9 != undefined) {
                        departemen = '&idDept=' + $scope.item.departemen9.id
                    }
                } else {
                    if ($scope.item.departemen9 != undefined) {
                        departemen = 'idDept=' + $scope.item.departemen9.id
                    }
                }
                medifirstService.get('emr/get-navigasi-emr?' + emr + ruangan + departemen).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var map = dat.data

                    $scope.sourceMapping = new kendo.data.DataSource({
                        data: map,
                        pageSize: 20,
                        total: map.length,
                        serverPaging: false,
                        group: {
                            field: "navigasiemr",
                            aggregates: [{
                                field: "navigasiemr",
                                aggregate: "count"
                            }]
                        },
                        schema: {
                            model: {
                                fields: {
                                    navigasiemr: { type: "string" }
                                }
                            }
                        },
                        aggregate: [
                            {
                                field: "navigasiemr", aggregate: "count"
                            }
                        ],
                    });
                })
            }
            $scope.columnMapping = {
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                        "width": 40,
                        "title": "✔"
                    },
                    {
                        "field": "namadepartemen",
                        "title": "Departemen",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                    },
                    {
                        "field": "jenispegawai",
                        "title": "Jenis Akun",
                    },
                ]
            }
            $scope.cari = function () {
                loadData()
            }
            $scope.tambah = function () {
                $scope.departemen = false;
                $scope.ruangan = false;
                var actions = $scope.popUpTambahMapping.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpTambahMapping.setOptions({ actions: actions });
                $scope.popUpTambahMapping.center().open()
            }
            $scope.$watch('model.cekpilihManual', function (e) {
                if (e == true) {
                    $scope.departemen = true;
                    $scope.ruangan = false;
                    $scope.cekDep = true;
                    $scope.cekRu = false;
                    $scope.pegawai = true;
                } else {
                    $scope.departemen = false;
                    $scope.ruangan = false;
                    $scope.cekDep = true;
                    $scope.cekRu = true;
                    $scope.false = true;
                }
            })
            $scope.$watch('model.cekpilihManual2', function (e) {
                if (e == true) {
                    $scope.departemen = false;
                    $scope.ruangan = true;
                    $scope.cekDep = false;
                    $scope.cekRu = true;
                    $scope.pegawai = true;
                } else {
                    $scope.departemen = false;
                    $scope.ruangan = false;
                    $scope.cekDep = true;
                    $scope.cekRu = true;
                    $scope.pegawai = false;
                }
            })
            $scope.$watch('model.cekpilihManual3', function (e) {
                if (e == true) {
                    $scope.departemen2 = true;
                    $scope.ruangan2 = false;
                    $scope.cekDep2 = true;
                    $scope.cekRu2 = false;
                } else {
                    $scope.departemen2 = false;
                    $scope.ruangan2 = false;
                    $scope.cekDep2 = true;
                    $scope.cekRu2 = true;
                }
            })
            $scope.$watch('model.cekpilihManual4', function (e) {
                if (e == true) {
                    $scope.departemen2 = false;
                    $scope.ruangan2 = true;
                    $scope.cekDep2 = false;
                    $scope.cekRu2 = true;
                    $scope.pegawai2 = true;
                } else {
                    $scope.departemen2 = false;
                    $scope.ruangan2 = false;
                    $scope.cekDep2 = true;
                    $scope.cekRu2 = true;
                    $scope.pegawai2 = false;
                }
            })

            $scope.cekPw = function () {
                // if (passwordEntered == false) {
                //     passwordEntered = true; // Set passwordEntered ke true agar tidak muncul prompt lagi
                //     // if (passwordEntered == false) { //ini diset false supaya hanya di awal saja, jadi ketika pindah grid baik itu grid konsul ataupun pasien diterima tidak minta password lagi
                 
                //     //     var enteredPassword = prompt("Masukkan password untuk mengedit data !");
                //     //     if (enteredPassword === "hapus") {
                //     //         passwordEntered = false;
                //     $scope.saveMapping();
                // } else {
                    $scope.saveMapping();
                // }
            };
            $scope.cekPwForHapus = function () {
                if (passwordEntered == false) { //ini diset false supaya hanya di awal saja, jadi ketika pindah grid baik itu grid konsul ataupun pasien diterima tidak minta password lagi
                 
                    var enteredPassword = prompt("Masukkan password untuk mengedit data !");
                    if (enteredPassword === "hapus") {
                        passwordEntered = true;
                        $scope.hapus();
                    } else {
                        alert("Incorrect password. Access denied.");
                        return;
                    }
                
            }else{$scope.hapus();}
            }
            $scope.saveMapping = function () {
                if ($scope.model.cekpilihManual == undefined && $scope.model.cekpilihManual2 == undefined) {
                    alert('Pilih dahulu jenis mappingnya !')
                    return
                }
                if ($scope.model.cekpilihManual == undefined && $scope.model.cekpilihManual2 == false) {
                    alert('Pilih dahulu jenis mappingnya !')
                    return
                }
                if ($scope.model.cekpilihManual == false && $scope.model.cekpilihManual2 == undefined) {
                    alert('Pilih dahulu jenis mappingnya !')
                    return
                }
                if ($scope.model.cekpilihManual == false && $scope.model.cekpilihManual2 == false) {
                    alert('Pilih dahulu jenis mappingnya !')
                    return
                }
                if ($scope.item.namaEmr2 == undefined) {
                    alert('Pilih dahulu EMRnya !')
                    return
                }
                if ($scope.model.cekpilihManual == true && $scope.item.departemen == undefined) {
                    alert('Pilih Dahulu Instalasinya !')
                    return
                }
                if ($scope.model.cekpilihManual2 == true && $scope.item.ruangan2 == undefined) {
                    alert('Pilih Dahulu Ruangannya !')
                    return
                }

                var flag = ''
                var idFlag = ''
                var jenispegawai = ''
                
                if ($scope.model.cekpilihManual == true) {
                    flag = 'Instalasi'
                    idFlag = $scope.item.departemen.id
                    jenispegawai = $scope.item.namaDokter.id
                }
                if ($scope.model.cekpilihManual2 == true) {
                    flag = 'Ruangan'
                    idFlag = $scope.item.ruangan2.id
                    jenispegawai = $scope.item.namaDokter.id
                }
                debugger
                var objSave = {
                    "emr": $scope.item.namaEmr2.id,
                    "flag": flag,
                    "idFlag": idFlag,
                    "objectjenispegawaifk" : jenispegawai
                }
                medifirstService.post('emr/save-mapping-navigasi', objSave).then(function (e) {
                    if (e.data.status == 201) {
                        $scope.batalMapping()
                        loadData()
                    }
                })
            }
            $scope.saveMapping2 = function() {
                var objSave = {
                    "emr": $scope.item.namaEmr3.id,
                    "instalasiEmr": $scope.item.instalasiEmr.id,
                    "ruangan": $scope.item.ruangan3.id,
                    "jenispegawai": $scope.item.namaDokter2.id
                }
                medifirstService.post('emr/save-mapping-navigasi-penunjang', objSave).then(function(e) {
                    $scope.batalMapping2()
                    loadData()
                })
            }
            $scope.batalMapping2 = function () {
                $scope.item.namaEmr3 = undefined
                $scope.item.instalasiEmr = undefined
                $scope.item.ruangan3 = undefined
                $scope.item.namaDokter2 = undefined
                $scope.popUpTambahMappingPenunjang.close()
            }
            $scope.batalMapping = function () {
                $scope.model = {}
                $scope.item.departemen = undefined
                $scope.item.ruangan2 = undefined
                $scope.item.namaEmr2 = undefined
                $scope.popUpTambahMapping.close()
            }
            $scope.onClick = function (e) {
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    // if (result.length == 0) {
                    //     $scope.selectedData.push(dataItem);
                    // } else {
                    // for (var i = 0; i < $scope.selectedData.length; i++)
                    // if ($scope.selectedData[i].norec === dataItem.norec) {
                    //     $scope.selectedData.splice(i, 1);
                    //     break;
                    // }
                    $scope.selectedData.push(dataItem);
                    // }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData.length; i++)
                        if ($scope.selectedData[i].norec === dataItem.norec) {
                            $scope.selectedData.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.hapus = function () {
                debugger
                if ($scope.selectedData.length == 0) {
                    alert('Ceklis dahulu data yang ingin dihapus !')
                    return
                }
                var details = [];
                for (let i = 0; i < $scope.selectedData.length; i++) {
                    details.push({ objectdepartemenfk: $scope.selectedData[i].objectdepartemenfk, objectemrfk: $scope.selectedData[i].objectemrfk, objectruanganfk: $scope.selectedData[i].objectruanganfk })
                }
                var objSave = {
                    data: details
                }
                medifirstService.post('emr/delete-mapping-navigasi', objSave).then(function (e) {
                    debugger
                    if (e.data.status == 201) {
                        loadData()
                    }
                })
            }
            $scope.edit = function () {
                debugger
                // $scope.dataSelectedMapping
                if ($scope.dataSelectedMapping == undefined) {
                    toastr.error('حدد بيانات واحدة', 'Info');

                    return
                }
                $scope.PopUpJenisAkun.center().open();
            }
            $scope.SaveEditJenis = function () {
                debugger
                var objSave = {
                    "objectjenispegawaifk": $scope.item.namaDokter.id,
                    "objectemrfk": $scope.dataSelectedMapping.objectemrfk,
                    "objectruanganfk": $scope.dataSelectedMapping.objectruanganfk,
                    // "status": 0
                }
                medifirstService.post('emr/update-jenis-pegawai', objSave).then(function (e) {
                    if (e.data.status === 201) {
                        loadData();
                        $scope.PopUpJenisAkun.center().close();
                    }
                })
            }
            $scope.gaslah = function() {
                $scope.popUpTambahMappingPenunjang.center().open()
            }
        }
    ])
})