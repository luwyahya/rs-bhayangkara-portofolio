define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MappingNodtdtogspCtrl', ['CacheHelper', '$q','$state', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $state, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;

            LoadCache();
            loadCombo()
            LoadData() 

            function LoadCache() {
                var chacePeriode = cacheHelper.get('cacheEditDiagnosa')
                if (chacePeriode != undefined) {
                    $scope.item.diagnosa = chacePeriode[0]

                    LoadData()
                }
                else { LoadData()
                }
            }
            function loadCombo(){
            //      medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
            //         .then(function (data) {
            //             $scope.listRuangans=data.data.ruanganrajal
            //         })

            //         medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
            //     $scope.listKelompokPasien = data.data.kelompokpasien;
            // })
            medifirstService.get("registrasi/laporan/get-combo-edit-diagnosa", false).then(function (data) {
                var data = data.data
                $scope.listDiagnosa = data.kdDiagnosa;
                //$scope.listjaminanKhusus = data.data.jaminankhusus;

            });
                    
            }

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {
                var tempkddArr = {}

                if ($scope.item.diagnosa == undefined) {
                    var dg = ""
                } else {
                    var dg = "&kdDiagnosa=" + $scope.item.diagnosa.id
                    tempkddArr = { id: $scope.item.diagnosa.id, kddiagnosa: $scope.item.diagnosa.kddiagnosa}
                }
                // if ($scope.item.nodtd == undefined) {
                //     var dtd = ""
                // } else {
                //     var dtd = "&noDtd=" + $scope.item.nodtd.id
                //     tempkddArr = { id: $scope.item.nodtd.id, kdnodtd: $scope.item.nodtd.nodtd}
                // }
                var chacePeriode = {
                    0: tempkddArr
                }
                cacheHelper.set('cacheEditDiagnosa', chacePeriode);

                $scope.isRouteLoading = true;

                medifirstService.get("registrasi/laporan/get-edit-diagnosa?"
                 + dg 
                ).then(function (data) {
                    debugger;
                    var data = data.data
                    for (var i =0; i < data.data.length; i++) {
                        data.data[i].no = i +1
                    }
                    $scope.isRouteLoading = false;

                    $scope.sourceDiagnosa = new kendo.data.DataSource({

                        data: data.data,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    // if (data.statResponse) {
					// 	var data = data.data
					// 	for (var i = 0; i < data.data.length; i++) {
					// 	}
					// 	$scope.isRouteLoading = false;
					// } else {
                    //     $scope.isRouteLoading = false;
                    // }
                    // $scope.item.nodtd = data.data[0].nodtd
                    // $scope.item.gsp = data.data[0].golongansebabpenyakit

                });
				// medifirstService.get("registrasi/laporan/get-edit-diagnosa?"
                //     + dtd + kdd + gsp

                // ).then(function (data) {
                //     var data = data.data
                //     for (var i = 0; i < data.data.length; i++) {
                //         data.data[i].no = i + 1
                //     }


				// 	//var chacePeriode = tglAwal + "~" + tglAkhir
				// 	// + "~" +cacheNoreg + "~" +cacheNoRm
				// 	// + "~" +cacheNama
				// 	// + "~" +$scope.item.instalasi 
				// 	// + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
				// 	// + "~" +$scope.item.dokter;
				// 	cacheHelper.set('EditDiagnosaCtrl', chacePeriode);
				// });
                
			};

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnDiagnosa = {
				// dataBound: onDataBound,
				pageable: true,
                columns: [
                    {
                        field: "nodtd",
                        title: "No. DTD",
                        width: "80px",
                        template: "<span class='style-center'>#: nodtd  #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "kddiagnosa",
                        title: "Kode Diagnosa",
                        width: "100px",
                        template: "<span class='style-center'>#: kddiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "golongansebabpenyakit",
                        title: "Golongan Sebab Penyakit",
                        width: "150px",
                        template: "<span class='style-center'>#: golongansebabpenyakit #</span>",
                    },
                ]

            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.kddiagnosa = dataPasienSelected.kddiagnosa;
                    $scope.nodtd = dataPasienSelected.nodtd;
                    $scope.golongansebabpenyakit = dataPasienSelected.golongansebabpenyakit;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.EditData = function () {
                debugger;
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu")
                    return
                }
                else {
                    var arrStr = {
                        0: $scope.dataPasienSelected.kddiagnosa,
                        1: $scope.dataPasienSelected.nodtd,
                        2: $scope.dataPasienSelected.golongansebabpenyakit
                    }
                    cacheHelper.set('EditMapping', arrStr);
                    $state.go('EditMapping')
                    // medifirstService.get("registrasi/laporan/get-edit-diagnosa?"
                    // + $scope.dataPasienSelected.kddiagnosa
                    // ).then(function (data) {
                    //     var edit = data.data.data[0];

                    //     $state.go('EditMapping');

                    //     var cacheSet = $scope.dataPasienSelected.nodtd
                    //     + "~" + $scope.dataPasienSelected.golongansebabpenyakit
                    //     + "~" + edit.kddiagnosa;
                    //     cacheHelper.set('EditMapping', cacheSet);
                    // })
                }
                // if ($scope.kddiagnosa != undefined) {
                //     medifirstService.get("registrasi/laporan/get-edit-diagnosa?"
                //     + $scope.dataPasienSelected.kddiagnosa).then(function (data){
                //     var edit = data.data[0];
                    
                //     $state.go('EditMapping');

                //     var cacheset = edit;
                //     cacheHelper.set('cacheEditDiagnosa', cacheset);
                //     })
                    
                    
                    
                // } else {
                //     messageContainer.error("Pilih Data Dulu!")
                // }
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }



        }
    ]);
});