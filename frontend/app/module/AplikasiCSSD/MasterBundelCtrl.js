define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('MasterBundelCtrl', ['$rootScope', '$scope', 'ModelItem', 'MedifirstService', '$state',
        function($rootScope, $scope, ModelItem, medifirstService, $state) {
            ModelItem.get("Laundry/MasterJenisLinen").then(function(data) {
                $scope.item = data;
                $scope.dataVOloaded = true;
            }, function errorCallBack(err) {});
            $scope.item = {};

            $scope.Init = function() {
                medifirstService.get("CSSD/get-bundel").then(function(dat) {
                    $scope.sourceMasterJenisLinen = dat.data.data;
                    $scope.no = 1;
                    for (var i = 0; i < $scope.sourceMasterJenisLinen.length; i++) {
                        $scope.sourceMasterJenisLinen[i].no = $scope.no++;
                    }
                });
            }
            $scope.Init();
            $scope.mainGridOptions = {
                pageable: true,
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startsWith: "Pencarian"
                        }
                    }
                },
                sortable: true,
            }
            $scope.columndataJenisLinen = [{
                    "field": "no",
                    "title": "<h3 align=center>No</h3>",
                    "width": "20px"
                }, {
                    "field": "namabundel",
                    "title": "<h3 align=center>Nama Bundel</h3>",
                    "width": "170px"
                },
                {
                    "title": "<h3 align=center>Action</h3>",
                    "width": "50px",
                    "template": "<button class='btnHapus' ng-click='disableData()'>Disable</button>"
                }
            ];

            $scope.disableData = function() {
                var allData = this.dataItem;
                var data = {
                    "norec": allData.norec,
                    "namaExternal": allData.namaExternal,
                    "statusEnabled": "false"
                };
                medifirstService.post("CSSD/disabled-bundel", data).then(function(e) {
                    $scope.item.namaEksternal = "",
                        $scope.Init();
                    $scope.selectedid = undefined;
                });
            }

            $scope.tutup = function() {
                $state.go('home');
            }

            $scope.SelectJenisLinen = function(data) {
                debugger
                if ($scope.selectedid == undefined) {
                    toastr.info("Mode Edit : Aktif");
                }
                $scope.item.namaEksternal = data.namaExternal,
                    $scope.selectedid = data.id;
            };

            $scope.baru = function() {
                $scope.item.namaEksternal = "",
                    $scope.selectedid = undefined,
                    toastr.info("Mode Edit : Mati");
            }


            $scope.enableKodeJenisLinen = "true";
            $scope.Save = function() {
                debugger;
                var data = {
                    "norec": $scope.selectedid,
                    "namaExternal": $scope.item.namaEksternal,
                    "statusEnabled": true
                };
                medifirstService.post("CSSD/simpan-bundel", data).then(function(e) {
                    $scope.Init();
                });
                $scope.Batal();
            };

            $scope.Batal = function() {
                $scope.item.namaEksternal = "";
            };
        }
    ]);
});