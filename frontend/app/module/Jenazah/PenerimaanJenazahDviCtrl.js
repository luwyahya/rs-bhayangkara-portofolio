define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PenerimaanJenazahDviCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.now = new Date();
        $scope.item.tglterima = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
        loadCombo();

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana
            })
        }

        $scope.save = function() {
            debugger
            var save = {
                jenisbencanafk: $scope.item.jenisbencana.id,
                bodybag: $scope.item.bodybag,
                keterangan: $scope.item.keterangan,
                nobodybag: $scope.item.nobodybag,
                tglterima: moment($scope.item.tglterima).format('YYYY-MM-DD HH:mm:ss')
            }
            medifirstService.post('jenazah/dvi/save-penerimaan-jenazah-dvi', save).then(function(e) {
                $scope.item.bodybag = undefined
                $scope.item.keterangan = undefined
                $scope.item.nobodybag = undefined
                $scope.item.jenisbencana = undefined
                $scope.item.tglterima = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            })
        }
    }
])
})