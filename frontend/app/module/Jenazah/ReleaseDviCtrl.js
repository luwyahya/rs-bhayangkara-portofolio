define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ReleaseDviCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.now = new Date();
        $scope.item.tglteridentifikasi = moment($scope.now).format('YYYY-MM-DD HH:mm')
        $scope.item.release = moment($scope.now).format('YYYY-MM-DD HH:mm')
        $scope.tgllahir = '';
        $scope.idjenisbencana = '';
        $scope.alamat = true;
        $scope.hubungan = true;

        LoadCache()
        LoadCombo()

        function LoadCache() {
            var chacePeriode = cacheHelper.get('ReleaseDvi');
            if (chacePeriode != undefined) {
                $scope.item.noam = chacePeriode[0]
                $scope.item.nama = chacePeriode[1]
                $scope.tgllahir = chacePeriode[2]
                getAge()
                $scope.item.keluarga = chacePeriode[3]
                $scope.item.telepon = chacePeriode[4]
                $scope.item.tujuan = chacePeriode[5]
                $scope.item.hubungankeluarga = { id: chacePeriode[7], hubungankeluarga: chacePeriode[6]}
                $scope.idjenisbencana = chacePeriode[8]
            }
            else {

            }
        }
        function LoadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listHubunganKeluarga = dat.data.hubunganKeluarga
            })
        }
        $scope.ceklispilihManual = function (bool) {
            if (bool) {
                $scope.showBin = true
            }else{
                $scope.showBin = false
                $scope.item.binbinti = undefined
            }
        }
        $scope.ceklispilihManual2 = function (bool) {
            if (bool) {
                $scope.alamat = false
                $scope.item.tujuan = undefined
            }else{
                $scope.alamat = true
                var chacePeriode = cacheHelper.get('ReleaseDvi');
                $scope.item.tujuan = chacePeriode[5]
            }
        }
        $scope.ceklispilihManual3 = function (bool) {
            if (bool) {
                $scope.hubungan = false
                $scope.item.keluarga = undefined
                $scope.item.hubungankeluarga = undefined
            }else{
                $scope.hubungan = true
                var chacePeriode = cacheHelper.get('ReleaseDvi');
                $scope.item.keluarga = chacePeriode[3]
                $scope.item.hubungankeluarga = { id: chacePeriode[7], hubungankeluarga: chacePeriode[6]}
            }
        }
        function getAge() {
            var tanggal = $scope.now;
            var tanggalLahir = new Date($scope.tgllahir);
            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
            umurs = umurs.year + ' Tahun '
            $scope.item.umur = umurs
        }
        $scope.save = function () {
            debugger
            if ($scope.item.release == null) {
                $scope.item.release = ''
            }
            var save = {
                tglteridentifikasi: $scope.item.tglteridentifikasi,
                tglrelease: $scope.item.release,
                noantemortem: $scope.item.noam,
                nama: $scope.item.nama,
                binbinti: $scope.item.binbinti,
                tgllahir: $scope.tgllahir,
                keluarga: $scope.item.keluarga,
                hubungan: $scope.item.hubungankeluarga.id,
                telepon: $scope.item.telepon,
                tujuan: $scope.item.tujuan,
                keterangan: $scope.item.keterangan,
                jenisbencana: $scope.idjenisbencana
            }
            medifirstService.post('jenazah/dvi/save-release-dvi', save).then(function(e) {
                window.history.back()
            });
        }
        $scope.kembali = function () {
            window.history.back()
        }
    }
])
})