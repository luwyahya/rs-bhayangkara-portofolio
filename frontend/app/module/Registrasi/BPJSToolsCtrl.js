define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('BPJSToolsCtrl', ['$scope', '$state',
        function ( $scope, $state) {
            $scope.now = new Date();
            $scope.nav = function (state) {

                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }

        }
    ]);
});