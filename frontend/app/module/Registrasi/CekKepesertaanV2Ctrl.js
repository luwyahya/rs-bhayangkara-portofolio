define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CekKepesertaanV2Ctrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $state, DateHelper, medifirstService) {
            $scope.isRouteLoading = true;
            $scope.clear = function () {
                $scope.item = {};
                $scope.item.identitas = $scope.dataCheckbox[0];
                $scope.isRouteLoading = false;
            };
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }

            $scope.dataCheckbox = [{
                "id": 1, "name": "No Kartu"
            }, {
                "id": 2, "name": "NIK"
            }];
            $scope.clear();
            $scope.findData = function (data) {
                if (!data) return;
                if (!$scope.item.identitas) {
                    messageContainer.error('Pilih Pencarian Terlebih Dahulu');
                    return;
                } else {
                    // console.log(JSON.stringify($scope.item.identitas))
                    if ($scope.item.identitas.id === 1) {
                        $scope.cekNoKartu(data);
                    } else {
                        $scope.cekNik(data);
                    }
                }
                // findPasien.getDetailSep(data).then(function(e) {
                //     document.getElementById("json").innerHTML = JSON.stringify(e.data.data, undefined, 2);
                // });
            }
            $scope.cekNoKartu = function (noKartu) {
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + noKartu + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.cekNik = function (nik) {
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/get-nik?nik=" + nik + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
        }
    ]);
});