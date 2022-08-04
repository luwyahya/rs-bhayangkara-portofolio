define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MenuObservasifisikJatuhCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, $state, cacheHelper) {
            // $scope.title = "Psikologi";
            // debugger;
            

            $scope.activeMenuObservasifisikJatuh = 'RekamMedis.AsesmenMedis.MenuObservasifisikJatuh.ObservasifisikJatuh';
            $scope.dataVOloaded = true;
            $rootScope.showMenu = true;
            $rootScope.showMenuDetail = false;
            $scope.nav = function (state) {
                $scope.activeMenuObservasifisikJatuh = state;
                localStorage.setItem('activeMenuObservasifisikJatuh', state);
                $state.go(state, $state.params);
            }
        }
    ]);
});