define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MappingJenisBencanaCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window', 
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.now = new Date();
        $scope.item.tglbencana = moment($scope.now).format('YYYY-MM-DD HH:mm');
        $scope.Verifikasi = false
        $scope.dataSelectedMapping = {}
        loadData();

        $scope.simpan = function () {
            debugger;
            if ($scope.item.jenisbencana == undefined || $scope.item.jenisbencana == '' || $scope.item.jenisbencana == null) {
                toastr.error('Jenis Bencana Belum Diinput !', 'Peringatan !')
                return;
            }
            if ($scope.item.tglbencana == undefined || $scope.item.tglbencana == '' || $scope.item.tglbencana == null) {
                toastr.error('Tanggal Bencana Belum Diinput !', 'Peringatan !')
                return; 
            }
            debugger
            var save = {
                jenisbencana: $scope.item.jenisbencana,
                tglbencana: moment($scope.item.tglbencana).format('YYYY-MM-DD HH:mm:ss')
            }
            medifirstService.post('jenazah/dvi/save-mapping-jenis-bencana', save).then(function(e) {
                $scope.item.jenisbencana = undefined
                $scope.item.tglbencana = moment($scope.now).format('YYYY-MM-DD HH:mm');
                loadData();
            })
        }
        function loadData() {
            medifirstService.get("jenazah/dvi/get-mapping-jenis-bencana?").then(function (data) {
                debugger;
                $scope.isRouteLoading = false;
                var mapping = data.data
                $scope.sourceMapping = new kendo.data.DataSource({
                    data: mapping,
                    pageSize: 50,
                    total: data.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
                $scope.columnMapping = {
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [
                        {
                            "field": "jenisbencana",
                            "title": "Jenis Bencana",
                            "width": "50px",
                        },
                        {
                            "field": "tglbencana",
                            "title": "Tanggal Bencana",
                            "width": "50px",
                        },
                        {
                            "field": "tglditutup",
                            "title": "Tanggal Ditutup",
                            "width": "50px",
                        },
                    ]
                }
            })
        }
        $scope.klik = function (dataSelectedMapping) {
            if (dataSelectedMapping.isverifikasi == null) {
                $scope.Verifikasi = false
            } else {
                $scope.Verifikasi = true
            }
        }
        $scope.verifikasi = function () {
            var save = {
                id: $scope.dataSelectedMapping.id
            }
            medifirstService.post('jenazah/dvi/save-verifikasi-jenis-bencana', save).then(function(e) {
                loadData();
            })
        }
        $scope.batalVerifikasi = function () {
            $scope.popUpPassword.center().open()
        }
        $scope.simpanBatal = function () {

            if ($scope.item.password != "baksotelor") {
                toastr.error('Password Salah !')
                return
            }
            var save = {
                id: $scope.dataSelectedMapping.id
            }
            medifirstService.post('jenazah/dvi/save-batal-verifikasi-jenis-bencana', save).then(function(e) {
                $scope.popUpPassword.close();
                $scope.item.password = undefined
                loadData();
            })
        }
    }
])
})