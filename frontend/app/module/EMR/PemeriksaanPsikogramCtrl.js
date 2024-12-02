define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('PemeriksaanPsikogramCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.user = {};
        $scope.cc = {};
        $scope.cc.emrfk = 893;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        var dataLoad = []
        $scope.istempatLaporan = true;
        $scope.ada = false;
        $scope.ruanglainnya = false;
       
        LoadCombo()
        LoadCacheHelper()

        function LoadCombo() {
            medifirstService.get('emr/get-combo?').then(function(dat) {
                $scope.listDokter = dat.data.dokter
            })
        }

        //1
        $scope.$watch('item.obj[1620]', function(e) {
            if (e == true) {
                // $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1620]', function(e) {
            if (e == true) {
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1621]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1622]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1623]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1624]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1625]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1626]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1627]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1628] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1628]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1629] = undefined
            } 
        })
        $scope.$watch('item.obj[1629]', function(e) {
            if (e == true) {
                $scope.item.obj[1620] = undefined
                $scope.item.obj[1621] = undefined
                $scope.item.obj[1622] = undefined
                $scope.item.obj[1623] = undefined
                $scope.item.obj[1624] = undefined
                $scope.item.obj[1625] = undefined
                $scope.item.obj[1626] = undefined
                $scope.item.obj[1627] = undefined
                $scope.item.obj[1628] = undefined
                //$scope.item.obj[1619] = undefined
            } 
        })

        //2
        $scope.$watch('item.obj[1631]', function(e) {
            if (e == true) {
                // $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1631]', function(e) {
            if (e == true) {
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1632]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1633]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1634]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1635]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1636]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1637]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1638]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1639] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1639]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                //$scope.item.obj[1619] = undefined
                $scope.item.obj[1640] = undefined
            } 
        })
        $scope.$watch('item.obj[1640]', function(e) {
            if (e == true) {
                $scope.item.obj[1631] = undefined
                $scope.item.obj[1632] = undefined
                $scope.item.obj[1633] = undefined
                $scope.item.obj[1634] = undefined
                $scope.item.obj[1635] = undefined
                $scope.item.obj[1636] = undefined
                $scope.item.obj[1637] = undefined
                $scope.item.obj[1638] = undefined
                $scope.item.obj[1639] = undefined
                //$scope.item.obj[1619] = undefined
            } 
        })

        //3
        $scope.$watch('item.obj[1785]', function(e) {
            if (e == true) {
                // $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1785]', function(e) {
            if (e == true) {
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1786]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1787]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1788]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1789]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1790]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1791]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1792]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1793] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1793]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                //$scope.item.obj[1784] = undefined
                $scope.item.obj[1794] = undefined
            } 
        })
        $scope.$watch('item.obj[1794]', function(e) {
            if (e == true) {
                $scope.item.obj[1785] = undefined
                $scope.item.obj[1786] = undefined
                $scope.item.obj[1787] = undefined
                $scope.item.obj[1788] = undefined
                $scope.item.obj[1789] = undefined
                $scope.item.obj[1790] = undefined
                $scope.item.obj[1791] = undefined
                $scope.item.obj[1792] = undefined
                $scope.item.obj[1793] = undefined
                //$scope.item.obj[1784] = undefined
            } 
        })
        
        //4
        $scope.$watch('item.obj[1653]', function(e) {
            if (e == true) {
                // //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        // $scope.$watch('item.obj[1653]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1652] = undefined
        //         $scope.item.obj[1654] = undefined
        //         $scope.item.obj[1655] = undefined
        //         $scope.item.obj[1656] = undefined
        //         $scope.item.obj[1657] = undefined
        //         $scope.item.obj[1658] = undefined
        //         $scope.item.obj[1659] = undefined
        //         $scope.item.obj[1660] = undefined
        //         $scope.item.obj[1661] = undefined
        //         $scope.item.obj[1662] = undefined
        //     } 
        // })
        $scope.$watch('item.obj[1654]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1655]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1656]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1657]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1658]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1659]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1660]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1661] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1661]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1662] = undefined
            } 
        })
        $scope.$watch('item.obj[1662]', function(e) {
            if (e == true) {
                //$scope.item.obj[1653] = undefined
                $scope.item.obj[1654] = undefined
                $scope.item.obj[1655] = undefined
                $scope.item.obj[1656] = undefined
                $scope.item.obj[1657] = undefined
                $scope.item.obj[1658] = undefined
                $scope.item.obj[1659] = undefined
                $scope.item.obj[1660] = undefined
                $scope.item.obj[1653] = undefined
                $scope.item.obj[1661] = undefined
            } 
        })

        //5
        $scope.$watch('item.obj[1664]', function(e) {
            if (e == true) {
                // $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1664]', function(e) {
            if (e == true) {
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1665]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1666]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1667]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1668]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1669]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1670]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1671]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1672] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1672]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                //$scope.item.obj[1663] = undefined
                $scope.item.obj[1673] = undefined
            } 
        })
        $scope.$watch('item.obj[1673]', function(e) {
            if (e == true) {
                $scope.item.obj[1664] = undefined
                $scope.item.obj[1665] = undefined
                $scope.item.obj[1666] = undefined
                $scope.item.obj[1667] = undefined
                $scope.item.obj[1668] = undefined
                $scope.item.obj[1669] = undefined
                $scope.item.obj[1670] = undefined
                $scope.item.obj[1671] = undefined
                $scope.item.obj[1672] = undefined
                //$scope.item.obj[1663] = undefined
            } 
        })

        //6
        $scope.$watch('item.obj[1675]', function(e) {
            if (e == true) {
                // $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1675]', function(e) {
            if (e == true) {
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1676]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1677]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1678]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1679]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1680]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1681]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1682]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1683] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1683]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                //$scope.item.obj[1674] = undefined
                $scope.item.obj[1684] = undefined
            } 
        })
        $scope.$watch('item.obj[1684]', function(e) {
            if (e == true) {
                $scope.item.obj[1675] = undefined
                $scope.item.obj[1676] = undefined
                $scope.item.obj[1677] = undefined
                $scope.item.obj[1678] = undefined
                $scope.item.obj[1679] = undefined
                $scope.item.obj[1680] = undefined
                $scope.item.obj[1681] = undefined
                $scope.item.obj[1682] = undefined
                $scope.item.obj[1683] = undefined
                //$scope.item.obj[1674] = undefined
            } 
        })

        //7
        $scope.$watch('item.obj[1686]', function(e) {
            if (e == true) {
                // //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        // $scope.$watch('item.obj[1686]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1685] = undefined
        //         $scope.item.obj[1687] = undefined
        //         $scope.item.obj[1688] = undefined
        //         $scope.item.obj[1689] = undefined
        //         $scope.item.obj[1690] = undefined
        //         $scope.item.obj[1691] = undefined
        //         $scope.item.obj[1692] = undefined
        //         $scope.item.obj[1693] = undefined
        //         $scope.item.obj[1694] = undefined
        //         $scope.item.obj[1695] = undefined
        //     } 
        // })
        $scope.$watch('item.obj[1687]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1688]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1689]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1690]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1691]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1692]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1693]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1694]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1686] = undefined
                $scope.item.obj[1695] = undefined
            } 
        })
        $scope.$watch('item.obj[1695]', function(e) {
            if (e == true) {
                //$scope.item.obj[1686] = undefined
                $scope.item.obj[1687] = undefined
                $scope.item.obj[1688] = undefined
                $scope.item.obj[1689] = undefined
                $scope.item.obj[1690] = undefined
                $scope.item.obj[1691] = undefined
                $scope.item.obj[1692] = undefined
                $scope.item.obj[1693] = undefined
                $scope.item.obj[1694] = undefined
                $scope.item.obj[1686] = undefined
            } 
        })

        //8
        $scope.$watch('item.obj[1697]', function(e) {
            if (e == true) {
                // //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        // $scope.$watch('item.obj[1697]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1696] = undefined
        //         $scope.item.obj[1698] = undefined
        //         $scope.item.obj[1699] = undefined
        //         $scope.item.obj[1700] = undefined
        //         $scope.item.obj[1701] = undefined
        //         $scope.item.obj[1702] = undefined
        //         $scope.item.obj[1703] = undefined
        //         $scope.item.obj[1704] = undefined
        //         $scope.item.obj[1705] = undefined
        //         $scope.item.obj[1706] = undefined
        //     } 
        // })
        $scope.$watch('item.obj[1698]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1699]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1700]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1701]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1702]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1703]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1704]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1705]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1697] = undefined
                $scope.item.obj[1706] = undefined
            } 
        })
        $scope.$watch('item.obj[1706]', function(e) {
            if (e == true) {
                //$scope.item.obj[1697] = undefined
                $scope.item.obj[1698] = undefined
                $scope.item.obj[1699] = undefined
                $scope.item.obj[1700] = undefined
                $scope.item.obj[1701] = undefined
                $scope.item.obj[1702] = undefined
                $scope.item.obj[1703] = undefined
                $scope.item.obj[1704] = undefined
                $scope.item.obj[1705] = undefined
                $scope.item.obj[1697] = undefined
            } 
        })

        //9
        $scope.$watch('item.obj[1708]', function(e) {
            if (e == true) {
                // $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1708]', function(e) {
            if (e == true) {
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1709]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1710]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1711]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1712]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1713]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1714]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1715]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1716] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1716]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                //$scope.item.obj[1707] = undefined
                $scope.item.obj[1717] = undefined
            } 
        })
        $scope.$watch('item.obj[1717]', function(e) {
            if (e == true) {
                $scope.item.obj[1708] = undefined
                $scope.item.obj[1709] = undefined
                $scope.item.obj[1710] = undefined
                $scope.item.obj[1711] = undefined
                $scope.item.obj[1712] = undefined
                $scope.item.obj[1713] = undefined
                $scope.item.obj[1714] = undefined
                $scope.item.obj[1715] = undefined
                $scope.item.obj[1716] = undefined
                //$scope.item.obj[1707] = undefined
            } 
        })

        //10
        $scope.$watch('item.obj[1730]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1731]', function(e) {
            if (e == true) {
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1732]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1733]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1734]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1735]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1736]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1737]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1738]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1730] = undefined
                $scope.item.obj[1739] = undefined               
            } 
        })
        $scope.$watch('item.obj[1739]', function(e) {
            if (e == true) {
                $scope.item.obj[1731] = undefined
                $scope.item.obj[1732] = undefined
                $scope.item.obj[1733] = undefined
                $scope.item.obj[1734] = undefined
                $scope.item.obj[1735] = undefined
                $scope.item.obj[1736] = undefined
                $scope.item.obj[1737] = undefined
                $scope.item.obj[1738] = undefined
                $scope.item.obj[1730] = undefined               
            } 
        })

        //11
        $scope.$watch('item.obj[1741]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1742]', function(e) {
            if (e == true) {
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1743]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1744]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1745]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1746]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1747]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1748]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1749]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1741] = undefined
                $scope.item.obj[1750] = undefined               
            } 
        })
        $scope.$watch('item.obj[1750]', function(e) {
            if (e == true) {
                $scope.item.obj[1742] = undefined
                $scope.item.obj[1743] = undefined
                $scope.item.obj[1744] = undefined
                $scope.item.obj[1745] = undefined
                $scope.item.obj[1746] = undefined
                $scope.item.obj[1747] = undefined
                $scope.item.obj[1748] = undefined
                $scope.item.obj[1749] = undefined
                $scope.item.obj[1741] = undefined               
            } 
        })

        //12
        $scope.$watch('item.obj[1752]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1753]', function(e) {
            if (e == true) {
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1754]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1755]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1756]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1757]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1758]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1759]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1760]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1752] = undefined
                $scope.item.obj[1761] = undefined               
            } 
        })
        $scope.$watch('item.obj[1761]', function(e) {
            if (e == true) {
                $scope.item.obj[1753] = undefined
                $scope.item.obj[1754] = undefined
                $scope.item.obj[1755] = undefined
                $scope.item.obj[1756] = undefined
                $scope.item.obj[1757] = undefined
                $scope.item.obj[1758] = undefined
                $scope.item.obj[1759] = undefined
                $scope.item.obj[1760] = undefined
                $scope.item.obj[1752] = undefined               
            } 
        })

        //13
        $scope.$watch('item.obj[1763]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1764]', function(e) {
            if (e == true) {
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1765]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1766]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1767]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1768]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1769]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1770]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1771]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1763] = undefined
                $scope.item.obj[1772] = undefined               
            } 
        })
        $scope.$watch('item.obj[1772]', function(e) {
            if (e == true) {
                $scope.item.obj[1764] = undefined
                $scope.item.obj[1765] = undefined
                $scope.item.obj[1766] = undefined
                $scope.item.obj[1767] = undefined
                $scope.item.obj[1768] = undefined
                $scope.item.obj[1769] = undefined
                $scope.item.obj[1770] = undefined
                $scope.item.obj[1771] = undefined
                $scope.item.obj[1763] = undefined               
            } 
        })

        //14
        $scope.$watch('item.obj[1774]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1775]', function(e) {
            if (e == true) {
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1776]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1777]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1778]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1779]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1780]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1781]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1782]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1774] = undefined
                $scope.item.obj[1783] = undefined               
            } 
        })
        $scope.$watch('item.obj[1783]', function(e) {
            if (e == true) {
                $scope.item.obj[1775] = undefined
                $scope.item.obj[1776] = undefined
                $scope.item.obj[1777] = undefined
                $scope.item.obj[1778] = undefined
                $scope.item.obj[1779] = undefined
                $scope.item.obj[1780] = undefined
                $scope.item.obj[1781] = undefined
                $scope.item.obj[1782] = undefined
                $scope.item.obj[1774] = undefined               
            } 
        })

        //15
        $scope.$watch('item.obj[1795]', function(e) {
            if (e == true) {
                $scope.item.obj[1796] = undefined
                $scope.item.obj[1797] = undefined
                $scope.item.obj[1798] = undefined
                $scope.item.obj[1799] = undefined
            } 
        })
        $scope.$watch('item.obj[1796]', function(e) {
            if (e == true) {
                $scope.item.obj[1795] = undefined
                $scope.item.obj[1797] = undefined
                $scope.item.obj[1798] = undefined
                $scope.item.obj[1799] = undefined
            } 
        })
        $scope.$watch('item.obj[1797]', function(e) {
            if (e == true) {
                $scope.item.obj[1796] = undefined
                $scope.item.obj[1795] = undefined
                $scope.item.obj[1798] = undefined
                $scope.item.obj[1799] = undefined
            } 
        })
        $scope.$watch('item.obj[1798]', function(e) {
            if (e == true) {
                $scope.item.obj[1796] = undefined
                $scope.item.obj[1797] = undefined
                $scope.item.obj[1795] = undefined
                $scope.item.obj[1799] = undefined
            } 
        })
        $scope.$watch('item.obj[1799]', function(e) {
            if (e == true) {
                $scope.item.obj[1796] = undefined
                $scope.item.obj[1797] = undefined
                $scope.item.obj[1798] = undefined
                $scope.item.obj[1795] = undefined
            } 
        }) 
        
        //16
        $scope.$watch('item.obj[1800]', function(e) {
            if (e == true) {
                $scope.item.obj[1801] = undefined
                $scope.item.obj[1802] = undefined
                $scope.item.obj[1803] = undefined
                $scope.item.obj[1804] = undefined
            } 
        })
        $scope.$watch('item.obj[1801]', function(e) {
            if (e == true) {
                $scope.item.obj[1800] = undefined
                $scope.item.obj[1802] = undefined
                $scope.item.obj[1803] = undefined
                $scope.item.obj[1804] = undefined
            } 
        })
        $scope.$watch('item.obj[1802]', function(e) {
            if (e == true) {
                $scope.item.obj[1801] = undefined
                $scope.item.obj[1800] = undefined
                $scope.item.obj[1803] = undefined
                $scope.item.obj[1804] = undefined
            } 
        })
        $scope.$watch('item.obj[1803]', function(e) {
            if (e == true) {
                $scope.item.obj[1801] = undefined
                $scope.item.obj[1802] = undefined
                $scope.item.obj[1800] = undefined
                $scope.item.obj[1804] = undefined
            } 
        })
        $scope.$watch('item.obj[1804]', function(e) {
            if (e == true) {
                $scope.item.obj[1801] = undefined
                $scope.item.obj[1802] = undefined
                $scope.item.obj[1803] = undefined
                $scope.item.obj[1800] = undefined
            } 
        })
        
        //17
        $scope.$watch('item.obj[1805]', function(e) {
            if (e == true) {
                $scope.item.obj[1806] = undefined
                $scope.item.obj[1807] = undefined
                $scope.item.obj[1808] = undefined
                $scope.item.obj[1809] = undefined
            } 
        })
        $scope.$watch('item.obj[1806]', function(e) {
            if (e == true) {
                $scope.item.obj[1805] = undefined
                $scope.item.obj[1807] = undefined
                $scope.item.obj[1808] = undefined
                $scope.item.obj[1809] = undefined
            } 
        })
        $scope.$watch('item.obj[1807]', function(e) {
            if (e == true) {
                $scope.item.obj[1806] = undefined
                $scope.item.obj[1805] = undefined
                $scope.item.obj[1808] = undefined
                $scope.item.obj[1809] = undefined
            } 
        })
        $scope.$watch('item.obj[1808]', function(e) {
            if (e == true) {
                $scope.item.obj[1806] = undefined
                $scope.item.obj[1807] = undefined
                $scope.item.obj[1805] = undefined
                $scope.item.obj[1809] = undefined
            } 
        })
        $scope.$watch('item.obj[1809]', function(e) {
            if (e == true) {
                $scope.item.obj[1806] = undefined
                $scope.item.obj[1807] = undefined
                $scope.item.obj[1808] = undefined
                $scope.item.obj[1805] = undefined
            } 
        })

        //18
        $scope.$watch('item.obj[1810]', function(e) {
            if (e == true) {
                $scope.item.obj[1811] = undefined
                $scope.item.obj[1812] = undefined
                $scope.item.obj[1813] = undefined
                $scope.item.obj[1814] = undefined
            } 
        })
        $scope.$watch('item.obj[1811]', function(e) {
            if (e == true) {
                $scope.item.obj[1810] = undefined
                $scope.item.obj[1812] = undefined
                $scope.item.obj[1813] = undefined
                $scope.item.obj[1814] = undefined
            } 
        })
        $scope.$watch('item.obj[1812]', function(e) {
            if (e == true) {
                $scope.item.obj[1811] = undefined
                $scope.item.obj[1810] = undefined
                $scope.item.obj[1813] = undefined
                $scope.item.obj[1814] = undefined
            } 
        })
        $scope.$watch('item.obj[1813]', function(e) {
            if (e == true) {
                $scope.item.obj[1811] = undefined
                $scope.item.obj[1812] = undefined
                $scope.item.obj[1810] = undefined
                $scope.item.obj[1814] = undefined
            } 
        })
        $scope.$watch('item.obj[1814]', function(e) {
            if (e == true) {
                $scope.item.obj[1811] = undefined
                $scope.item.obj[1812] = undefined
                $scope.item.obj[1813] = undefined
                $scope.item.obj[1810] = undefined
            } 
        })

        //19
        $scope.$watch('item.obj[1815]', function(e) {
            if (e == true) {
                $scope.item.obj[1816] = undefined
                $scope.item.obj[1817] = undefined
                $scope.item.obj[1818] = undefined
                $scope.item.obj[1819] = undefined
            } 
        })
        $scope.$watch('item.obj[1816]', function(e) {
            if (e == true) {
                $scope.item.obj[1815] = undefined
                $scope.item.obj[1817] = undefined
                $scope.item.obj[1818] = undefined
                $scope.item.obj[1819] = undefined
            } 
        })
        $scope.$watch('item.obj[1817]', function(e) {
            if (e == true) {
                $scope.item.obj[1816] = undefined
                $scope.item.obj[1815] = undefined
                $scope.item.obj[1818] = undefined
                $scope.item.obj[1819] = undefined
            } 
        })
        $scope.$watch('item.obj[1818]', function(e) {
            if (e == true) {
                $scope.item.obj[1816] = undefined
                $scope.item.obj[1817] = undefined
                $scope.item.obj[1815] = undefined
                $scope.item.obj[1819] = undefined
            } 
        })
        $scope.$watch('item.obj[1819]', function(e) {
            if (e == true) {
                $scope.item.obj[1816] = undefined
                $scope.item.obj[1817] = undefined
                $scope.item.obj[1818] = undefined
                $scope.item.obj[1815] = undefined
            } 
        })

        //20
        $scope.$watch('item.obj[1820]', function(e) {
            if (e == true) {
                $scope.item.obj[1821] = undefined
                $scope.item.obj[1822] = undefined
                $scope.item.obj[1823] = undefined
                $scope.item.obj[1824] = undefined
            } 
        })
        $scope.$watch('item.obj[1821]', function(e) {
            if (e == true) {
                $scope.item.obj[1820] = undefined
                $scope.item.obj[1822] = undefined
                $scope.item.obj[1823] = undefined
                $scope.item.obj[1824] = undefined
            } 
        })
        $scope.$watch('item.obj[1822]', function(e) {
            if (e == true) {
                $scope.item.obj[1821] = undefined
                $scope.item.obj[1820] = undefined
                $scope.item.obj[1823] = undefined
                $scope.item.obj[1824] = undefined
            } 
        })
        $scope.$watch('item.obj[1823]', function(e) {
            if (e == true) {
                $scope.item.obj[1821] = undefined
                $scope.item.obj[1822] = undefined
                $scope.item.obj[1820] = undefined
                $scope.item.obj[1824] = undefined
            } 
        })
        $scope.$watch('item.obj[1824]', function(e) {
            if (e == true) {
                $scope.item.obj[1821] = undefined
                $scope.item.obj[1822] = undefined
                $scope.item.obj[1823] = undefined
                $scope.item.obj[1820] = undefined
            } 
        })

        //21
        $scope.$watch('item.obj[1825]', function(e) {
            if (e == true) {
                $scope.item.obj[1826] = undefined
                $scope.item.obj[1827] = undefined
                $scope.item.obj[1828] = undefined
                $scope.item.obj[1829] = undefined
            } 
        })
        $scope.$watch('item.obj[1826]', function(e) {
            if (e == true) {
                $scope.item.obj[1825] = undefined
                $scope.item.obj[1827] = undefined
                $scope.item.obj[1828] = undefined
                $scope.item.obj[1829] = undefined
            } 
        })
        $scope.$watch('item.obj[1827]', function(e) {
            if (e == true) {
                $scope.item.obj[1826] = undefined
                $scope.item.obj[1825] = undefined
                $scope.item.obj[1828] = undefined
                $scope.item.obj[1829] = undefined
            } 
        })
        $scope.$watch('item.obj[1828]', function(e) {
            if (e == true) {
                $scope.item.obj[1826] = undefined
                $scope.item.obj[1827] = undefined
                $scope.item.obj[1825] = undefined
                $scope.item.obj[1829] = undefined
            } 
        })
        $scope.$watch('item.obj[1829]', function(e) {
            if (e == true) {
                $scope.item.obj[1826] = undefined
                $scope.item.obj[1827] = undefined
                $scope.item.obj[1828] = undefined
                $scope.item.obj[1825] = undefined
            } 
        })

        //22
        $scope.$watch('item.obj[1830]', function(e) {
            if (e == true) {
                $scope.item.obj[1831] = undefined
                $scope.item.obj[1832] = undefined
                $scope.item.obj[1833] = undefined
                $scope.item.obj[1834] = undefined
            } 
        })
        $scope.$watch('item.obj[1831]', function(e) {
            if (e == true) {
                $scope.item.obj[1830] = undefined
                $scope.item.obj[1832] = undefined
                $scope.item.obj[1833] = undefined
                $scope.item.obj[1834] = undefined
            } 
        })
        $scope.$watch('item.obj[1832]', function(e) {
            if (e == true) {
                $scope.item.obj[1831] = undefined
                $scope.item.obj[1830] = undefined
                $scope.item.obj[1833] = undefined
                $scope.item.obj[1834] = undefined
            } 
        })
        $scope.$watch('item.obj[1833]', function(e) {
            if (e == true) {
                $scope.item.obj[1831] = undefined
                $scope.item.obj[1832] = undefined
                $scope.item.obj[1830] = undefined
                $scope.item.obj[1834] = undefined
            } 
        })
        $scope.$watch('item.obj[1834]', function(e) {
            if (e == true) {
                $scope.item.obj[1831] = undefined
                $scope.item.obj[1832] = undefined
                $scope.item.obj[1833] = undefined
                $scope.item.obj[1830] = undefined
            } 
        })

        //23
        $scope.$watch('item.obj[1835]', function(e) {
            if (e == true) {
                $scope.item.obj[1836] = undefined
                $scope.item.obj[1837] = undefined
                $scope.item.obj[1838] = undefined
                $scope.item.obj[1839] = undefined
            } 
        })
        $scope.$watch('item.obj[1836]', function(e) {
            if (e == true) {
                $scope.item.obj[1835] = undefined
                $scope.item.obj[1837] = undefined
                $scope.item.obj[1838] = undefined
                $scope.item.obj[1839] = undefined
            } 
        })
        $scope.$watch('item.obj[1837]', function(e) {
            if (e == true) {
                $scope.item.obj[1836] = undefined
                $scope.item.obj[1835] = undefined
                $scope.item.obj[1838] = undefined
                $scope.item.obj[1839] = undefined
            } 
        })
        $scope.$watch('item.obj[1838]', function(e) {
            if (e == true) {
                $scope.item.obj[1836] = undefined
                $scope.item.obj[1837] = undefined
                $scope.item.obj[1835] = undefined
                $scope.item.obj[1839] = undefined
            } 
        })
        $scope.$watch('item.obj[1839]', function(e) {
            if (e == true) {
                $scope.item.obj[1836] = undefined
                $scope.item.obj[1837] = undefined
                $scope.item.obj[1838] = undefined
                $scope.item.obj[1835] = undefined
            } 
        })

        //24
        $scope.$watch('item.obj[1840]', function(e) {
            if (e == true) {
                $scope.item.obj[1841] = undefined
                $scope.item.obj[1842] = undefined
                $scope.item.obj[1843] = undefined
                $scope.item.obj[1844] = undefined
            } 
        })
        $scope.$watch('item.obj[1841]', function(e) {
            if (e == true) {
                $scope.item.obj[1840] = undefined
                $scope.item.obj[1842] = undefined
                $scope.item.obj[1843] = undefined
                $scope.item.obj[1844] = undefined
            } 
        })
        $scope.$watch('item.obj[1842]', function(e) {
            if (e == true) {
                $scope.item.obj[1841] = undefined
                $scope.item.obj[1840] = undefined
                $scope.item.obj[1843] = undefined
                $scope.item.obj[1844] = undefined
            } 
        })
        $scope.$watch('item.obj[1843]', function(e) {
            if (e == true) {
                $scope.item.obj[1841] = undefined
                $scope.item.obj[1842] = undefined
                $scope.item.obj[1840] = undefined
                $scope.item.obj[1844] = undefined
            } 
        })
        $scope.$watch('item.obj[1844]', function(e) {
            if (e == true) {
                $scope.item.obj[1841] = undefined
                $scope.item.obj[1842] = undefined
                $scope.item.obj[1843] = undefined
                $scope.item.obj[1840] = undefined
            } 
        })

        //25
        $scope.$watch('item.obj[1845]', function(e) {
            if (e == true) {
                $scope.item.obj[1846] = undefined
                $scope.item.obj[1847] = undefined
                $scope.item.obj[1848] = undefined
                $scope.item.obj[1849] = undefined
            } 
        })
        $scope.$watch('item.obj[1846]', function(e) {
            if (e == true) {
                $scope.item.obj[1845] = undefined
                $scope.item.obj[1847] = undefined
                $scope.item.obj[1848] = undefined
                $scope.item.obj[1849] = undefined
            } 
        })
        $scope.$watch('item.obj[1847]', function(e) {
            if (e == true) {
                $scope.item.obj[1846] = undefined
                $scope.item.obj[1845] = undefined
                $scope.item.obj[1848] = undefined
                $scope.item.obj[1849] = undefined
            } 
        })
        $scope.$watch('item.obj[1848]', function(e) {
            if (e == true) {
                $scope.item.obj[1846] = undefined
                $scope.item.obj[1847] = undefined
                $scope.item.obj[1845] = undefined
                $scope.item.obj[1849] = undefined
            } 
        })
        $scope.$watch('item.obj[1849]', function(e) {
            if (e == true) {
                $scope.item.obj[1846] = undefined
                $scope.item.obj[1847] = undefined
                $scope.item.obj[1848] = undefined
                $scope.item.obj[1845] = undefined
            } 
        })

        //26
        $scope.$watch('item.obj[1850]', function(e) {
            if (e == true) {
                $scope.item.obj[1851] = undefined
                $scope.item.obj[1852] = undefined
                $scope.item.obj[1853] = undefined
                $scope.item.obj[1854] = undefined
            } 
        })
        $scope.$watch('item.obj[1851]', function(e) {
            if (e == true) {
                $scope.item.obj[1850] = undefined
                $scope.item.obj[1852] = undefined
                $scope.item.obj[1853] = undefined
                $scope.item.obj[1854] = undefined
            } 
        })
        $scope.$watch('item.obj[1852]', function(e) {
            if (e == true) {
                $scope.item.obj[1851] = undefined
                $scope.item.obj[1850] = undefined
                $scope.item.obj[1853] = undefined
                $scope.item.obj[1854] = undefined
            } 
        })
        $scope.$watch('item.obj[1853]', function(e) {
            if (e == true) {
                $scope.item.obj[1851] = undefined
                $scope.item.obj[1852] = undefined
                $scope.item.obj[1850] = undefined
                $scope.item.obj[1854] = undefined
            } 
        })
        $scope.$watch('item.obj[1854]', function(e) {
            if (e == true) {
                $scope.item.obj[1851] = undefined
                $scope.item.obj[1852] = undefined
                $scope.item.obj[1853] = undefined
                $scope.item.obj[1850] = undefined
            } 
        })

        //26
        $scope.$watch('item.obj[1855]', function(e) {
            if (e == true) {
                $scope.item.obj[1856] = undefined
                $scope.item.obj[1857] = undefined
                $scope.item.obj[1858] = undefined
                $scope.item.obj[1859] = undefined
            } 
        })
        $scope.$watch('item.obj[1856]', function(e) {
            if (e == true) {
                $scope.item.obj[1855] = undefined
                $scope.item.obj[1857] = undefined
                $scope.item.obj[1858] = undefined
                $scope.item.obj[1859] = undefined
            } 
        })
        $scope.$watch('item.obj[1857]', function(e) {
            if (e == true) {
                $scope.item.obj[1856] = undefined
                $scope.item.obj[1855] = undefined
                $scope.item.obj[1858] = undefined
                $scope.item.obj[1859] = undefined
            } 
        })
        $scope.$watch('item.obj[1858]', function(e) {
            if (e == true) {
                $scope.item.obj[1856] = undefined
                $scope.item.obj[1857] = undefined
                $scope.item.obj[1855] = undefined
                $scope.item.obj[1859] = undefined
            } 
        })
        $scope.$watch('item.obj[1859]', function(e) {
            if (e == true) {
                $scope.item.obj[1856] = undefined
                $scope.item.obj[1857] = undefined
                $scope.item.obj[1858] = undefined
                $scope.item.obj[1855] = undefined
            } 
        })

        //27
        $scope.$watch('item.obj[1860]', function(e) {
            if (e == true) {
                $scope.item.obj[1861] = undefined
                $scope.item.obj[1862] = undefined
                $scope.item.obj[1863] = undefined
                $scope.item.obj[1864] = undefined
            } 
        })
        $scope.$watch('item.obj[1861]', function(e) {
            if (e == true) {
                $scope.item.obj[1860] = undefined
                $scope.item.obj[1862] = undefined
                $scope.item.obj[1863] = undefined
                $scope.item.obj[1864] = undefined
            } 
        })
        $scope.$watch('item.obj[1862]', function(e) {
            if (e == true) {
                $scope.item.obj[1861] = undefined
                $scope.item.obj[1860] = undefined
                $scope.item.obj[1863] = undefined
                $scope.item.obj[1864] = undefined
            } 
        })
        $scope.$watch('item.obj[1863]', function(e) {
            if (e == true) {
                $scope.item.obj[1861] = undefined
                $scope.item.obj[1862] = undefined
                $scope.item.obj[1860] = undefined
                $scope.item.obj[1864] = undefined
            } 
        })
        $scope.$watch('item.obj[1864]', function(e) {
            if (e == true) {
                $scope.item.obj[1861] = undefined
                $scope.item.obj[1862] = undefined
                $scope.item.obj[1863] = undefined
                $scope.item.obj[1860] = undefined
            } 
        })

        //28
        $scope.$watch('item.obj[1865]', function(e) {
            if (e == true) {
                $scope.item.obj[1866] = undefined
                $scope.item.obj[1867] = undefined
                $scope.item.obj[1868] = undefined
                $scope.item.obj[1869] = undefined
            } 
        })
        $scope.$watch('item.obj[1866]', function(e) {
            if (e == true) {
                $scope.item.obj[1865] = undefined
                $scope.item.obj[1867] = undefined
                $scope.item.obj[1868] = undefined
                $scope.item.obj[1869] = undefined
            } 
        })
        $scope.$watch('item.obj[1867]', function(e) {
            if (e == true) {
                $scope.item.obj[1866] = undefined
                $scope.item.obj[1865] = undefined
                $scope.item.obj[1868] = undefined
                $scope.item.obj[1869] = undefined
            } 
        })
        $scope.$watch('item.obj[1868]', function(e) {
            if (e == true) {
                $scope.item.obj[1866] = undefined
                $scope.item.obj[1867] = undefined
                $scope.item.obj[1865] = undefined
                $scope.item.obj[1869] = undefined
            } 
        })
        $scope.$watch('item.obj[1869]', function(e) {
            if (e == true) {
                $scope.item.obj[1866] = undefined
                $scope.item.obj[1867] = undefined
                $scope.item.obj[1868] = undefined
                $scope.item.obj[1865] = undefined
            } 
        })

        //29
        $scope.$watch('item.obj[1870]', function(e) {
            if (e == true) {
                $scope.item.obj[1871] = undefined
                $scope.item.obj[1872] = undefined
                $scope.item.obj[1873] = undefined
                $scope.item.obj[1874] = undefined
            } 
        })
        $scope.$watch('item.obj[1871]', function(e) {
            if (e == true) {
                $scope.item.obj[1870] = undefined
                $scope.item.obj[1872] = undefined
                $scope.item.obj[1873] = undefined
                $scope.item.obj[1874] = undefined
            } 
        })
        $scope.$watch('item.obj[1872]', function(e) {
            if (e == true) {
                $scope.item.obj[1871] = undefined
                $scope.item.obj[1870] = undefined
                $scope.item.obj[1873] = undefined
                $scope.item.obj[1874] = undefined
            } 
        })
        $scope.$watch('item.obj[1873]', function(e) {
            if (e == true) {
                $scope.item.obj[1871] = undefined
                $scope.item.obj[1872] = undefined
                $scope.item.obj[1870] = undefined
                $scope.item.obj[1874] = undefined
            } 
        })
        $scope.$watch('item.obj[1874]', function(e) {
            if (e == true) {
                $scope.item.obj[1871] = undefined
                $scope.item.obj[1872] = undefined
                $scope.item.obj[1873] = undefined
                $scope.item.obj[1870] = undefined
            } 
        })

        //30
        $scope.$watch('item.obj[2138]', function(e) {
            if (e == true) {
                $scope.item.obj[2139] = undefined
                $scope.item.obj[2140] = undefined
                $scope.item.obj[2141] = undefined
                $scope.item.obj[2142] = undefined
            } 
        })
        $scope.$watch('item.obj[2139]', function(e) {
            if (e == true) {
                $scope.item.obj[2138] = undefined
                $scope.item.obj[2140] = undefined
                $scope.item.obj[2141] = undefined
                $scope.item.obj[2142] = undefined
            } 
        })
        $scope.$watch('item.obj[2140]', function(e) {
            if (e == true) {
                $scope.item.obj[2139] = undefined
                $scope.item.obj[2138] = undefined
                $scope.item.obj[2141] = undefined
                $scope.item.obj[2142] = undefined
            } 
        })
        $scope.$watch('item.obj[2141]', function(e) {
            if (e == true) {
                $scope.item.obj[2139] = undefined
                $scope.item.obj[2140] = undefined
                $scope.item.obj[2138] = undefined
                $scope.item.obj[2142] = undefined
            } 
        })
        $scope.$watch('item.obj[2142]', function(e) {
            if (e == true) {
                $scope.item.obj[2139] = undefined
                $scope.item.obj[2140] = undefined
                $scope.item.obj[2141] = undefined
                $scope.item.obj[2138] = undefined
            } 
        })

        //31
        $scope.$watch('item.obj[2143]', function(e) {
            if (e == true) {
                $scope.item.obj[2144] = undefined
                $scope.item.obj[2145] = undefined
                $scope.item.obj[2146] = undefined
                $scope.item.obj[2147] = undefined
            } 
        })
        $scope.$watch('item.obj[2144]', function(e) {
            if (e == true) {
                $scope.item.obj[2143] = undefined
                $scope.item.obj[2145] = undefined
                $scope.item.obj[2146] = undefined
                $scope.item.obj[2147] = undefined
            } 
        })
        $scope.$watch('item.obj[2145]', function(e) {
            if (e == true) {
                $scope.item.obj[2144] = undefined
                $scope.item.obj[2143] = undefined
                $scope.item.obj[2146] = undefined
                $scope.item.obj[2147] = undefined
            } 
        })
        $scope.$watch('item.obj[2146]', function(e) {
            if (e == true) {
                $scope.item.obj[2144] = undefined
                $scope.item.obj[2145] = undefined
                $scope.item.obj[2143] = undefined
                $scope.item.obj[2147] = undefined
            } 
        })
        $scope.$watch('item.obj[2147]', function(e) {
            if (e == true) {
                $scope.item.obj[2144] = undefined
                $scope.item.obj[2145] = undefined
                $scope.item.obj[2146] = undefined
                $scope.item.obj[2143] = undefined
            } 
        })

        //32
        $scope.$watch('item.obj[2148]', function(e) {
            if (e == true) {
                $scope.item.obj[2149] = undefined
                $scope.item.obj[2150] = undefined
                $scope.item.obj[2151] = undefined
                $scope.item.obj[2152] = undefined
            } 
        })
        $scope.$watch('item.obj[2149]', function(e) {
            if (e == true) {
                $scope.item.obj[2148] = undefined
                $scope.item.obj[2150] = undefined
                $scope.item.obj[2151] = undefined
                $scope.item.obj[2152] = undefined
            } 
        })
        $scope.$watch('item.obj[2150]', function(e) {
            if (e == true) {
                $scope.item.obj[2149] = undefined
                $scope.item.obj[2148] = undefined
                $scope.item.obj[2151] = undefined
                $scope.item.obj[2152] = undefined
            } 
        })
        $scope.$watch('item.obj[2151]', function(e) {
            if (e == true) {
                $scope.item.obj[2149] = undefined
                $scope.item.obj[2150] = undefined
                $scope.item.obj[2148] = undefined
                $scope.item.obj[2152] = undefined
            } 
        })
        $scope.$watch('item.obj[2152]', function(e) {
            if (e == true) {
                $scope.item.obj[2149] = undefined
                $scope.item.obj[2150] = undefined
                $scope.item.obj[2151] = undefined
                $scope.item.obj[2148] = undefined
            } 
        })

        //33
        $scope.$watch('item.obj[2153]', function(e) {
            if (e == true) {
                $scope.item.obj[2154] = undefined
                $scope.item.obj[2155] = undefined
                $scope.item.obj[2156] = undefined
                $scope.item.obj[2157] = undefined
            } 
        })
        $scope.$watch('item.obj[2154]', function(e) {
            if (e == true) {
                $scope.item.obj[2153] = undefined
                $scope.item.obj[2155] = undefined
                $scope.item.obj[2156] = undefined
                $scope.item.obj[2157] = undefined
            } 
        })
        $scope.$watch('item.obj[2155]', function(e) {
            if (e == true) {
                $scope.item.obj[2154] = undefined
                $scope.item.obj[2153] = undefined
                $scope.item.obj[2156] = undefined
                $scope.item.obj[2157] = undefined
            } 
        })
        $scope.$watch('item.obj[2156]', function(e) {
            if (e == true) {
                $scope.item.obj[2154] = undefined
                $scope.item.obj[2155] = undefined
                $scope.item.obj[2153] = undefined
                $scope.item.obj[2157] = undefined
            } 
        })
        $scope.$watch('item.obj[2157]', function(e) {
            if (e == true) {
                $scope.item.obj[2154] = undefined
                $scope.item.obj[2155] = undefined
                $scope.item.obj[2156] = undefined
                $scope.item.obj[2153] = undefined
            } 
        })

        //34
        $scope.$watch('item.obj[2158]', function(e) {
            if (e == true) {
                $scope.item.obj[2159] = undefined
                $scope.item.obj[2160] = undefined
                $scope.item.obj[2161] = undefined
                $scope.item.obj[2162] = undefined
            } 
        })
        $scope.$watch('item.obj[2159]', function(e) {
            if (e == true) {
                $scope.item.obj[2158] = undefined
                $scope.item.obj[2160] = undefined
                $scope.item.obj[2161] = undefined
                $scope.item.obj[2162] = undefined
            } 
        })
        $scope.$watch('item.obj[2160]', function(e) {
            if (e == true) {
                $scope.item.obj[2159] = undefined
                $scope.item.obj[2158] = undefined
                $scope.item.obj[2161] = undefined
                $scope.item.obj[2162] = undefined
            } 
        })
        $scope.$watch('item.obj[2161]', function(e) {
            if (e == true) {
                $scope.item.obj[2159] = undefined
                $scope.item.obj[2160] = undefined
                $scope.item.obj[2158] = undefined
                $scope.item.obj[2162] = undefined
            } 
        })
        $scope.$watch('item.obj[2162]', function(e) {
            if (e == true) {
                $scope.item.obj[2159] = undefined
                $scope.item.obj[2160] = undefined
                $scope.item.obj[2161] = undefined
                $scope.item.obj[2158] = undefined
            } 
        })

        //35
        $scope.$watch('item.obj[2163]', function(e) {
            if (e == true) {
                $scope.item.obj[2164] = undefined
                $scope.item.obj[2165] = undefined
                $scope.item.obj[2166] = undefined
                $scope.item.obj[2167] = undefined
            } 
        })
        $scope.$watch('item.obj[2164]', function(e) {
            if (e == true) {
                $scope.item.obj[2163] = undefined
                $scope.item.obj[2165] = undefined
                $scope.item.obj[2166] = undefined
                $scope.item.obj[2167] = undefined
            } 
        })
        $scope.$watch('item.obj[2165]', function(e) {
            if (e == true) {
                $scope.item.obj[2164] = undefined
                $scope.item.obj[2163] = undefined
                $scope.item.obj[2166] = undefined
                $scope.item.obj[2167] = undefined
            } 
        })
        $scope.$watch('item.obj[2166]', function(e) {
            if (e == true) {
                $scope.item.obj[2164] = undefined
                $scope.item.obj[2165] = undefined
                $scope.item.obj[2163] = undefined
                $scope.item.obj[2167] = undefined
            } 
        })
        $scope.$watch('item.obj[2167]', function(e) {
            if (e == true) {
                $scope.item.obj[2164] = undefined
                $scope.item.obj[2165] = undefined
                $scope.item.obj[2166] = undefined
                $scope.item.obj[2163] = undefined
            } 
        })

        //36
        $scope.$watch('item.obj[2168]', function(e) {
            if (e == true) {
                $scope.item.obj[2169] = undefined
                $scope.item.obj[2170] = undefined
                $scope.item.obj[2171] = undefined
                $scope.item.obj[2172] = undefined
            } 
        })
        $scope.$watch('item.obj[2169]', function(e) {
            if (e == true) {
                $scope.item.obj[2168] = undefined
                $scope.item.obj[2170] = undefined
                $scope.item.obj[2171] = undefined
                $scope.item.obj[2172] = undefined
            } 
        })
        $scope.$watch('item.obj[2170]', function(e) {
            if (e == true) {
                $scope.item.obj[2169] = undefined
                $scope.item.obj[2168] = undefined
                $scope.item.obj[2171] = undefined
                $scope.item.obj[2172] = undefined
            } 
        })
        $scope.$watch('item.obj[2171]', function(e) {
            if (e == true) {
                $scope.item.obj[2169] = undefined
                $scope.item.obj[2170] = undefined
                $scope.item.obj[2168] = undefined
                $scope.item.obj[2172] = undefined
            } 
        })
        $scope.$watch('item.obj[2172]', function(e) {
            if (e == true) {
                $scope.item.obj[2169] = undefined
                $scope.item.obj[2170] = undefined
                $scope.item.obj[2171] = undefined
                $scope.item.obj[2168] = undefined
            } 
        })

        //37
        $scope.$watch('item.obj[2173]', function(e) {
            if (e == true) {
                $scope.item.obj[2174] = undefined
                $scope.item.obj[2175] = undefined
                $scope.item.obj[2176] = undefined
                $scope.item.obj[2177] = undefined
            } 
        })
        $scope.$watch('item.obj[2174]', function(e) {
            if (e == true) {
                $scope.item.obj[2173] = undefined
                $scope.item.obj[2175] = undefined
                $scope.item.obj[2176] = undefined
                $scope.item.obj[2177] = undefined
            } 
        })
        $scope.$watch('item.obj[2175]', function(e) {
            if (e == true) {
                $scope.item.obj[2174] = undefined
                $scope.item.obj[2173] = undefined
                $scope.item.obj[2176] = undefined
                $scope.item.obj[2177] = undefined
            } 
        })
        $scope.$watch('item.obj[2176]', function(e) {
            if (e == true) {
                $scope.item.obj[2174] = undefined
                $scope.item.obj[2175] = undefined
                $scope.item.obj[2173] = undefined
                $scope.item.obj[2177] = undefined
            } 
        })
        $scope.$watch('item.obj[2177]', function(e) {
            if (e == true) {
                $scope.item.obj[2174] = undefined
                $scope.item.obj[2175] = undefined
                $scope.item.obj[2176] = undefined
                $scope.item.obj[2173] = undefined
            } 
        })

        //38
        $scope.$watch('item.obj[2178]', function(e) {
            if (e == true) {
                $scope.item.obj[2179] = undefined
                $scope.item.obj[2180] = undefined
                $scope.item.obj[2181] = undefined
                $scope.item.obj[2182] = undefined
            } 
        })
        $scope.$watch('item.obj[2179]', function(e) {
            if (e == true) {
                $scope.item.obj[2178] = undefined
                $scope.item.obj[2180] = undefined
                $scope.item.obj[2181] = undefined
                $scope.item.obj[2182] = undefined
            } 
        })
        $scope.$watch('item.obj[2180]', function(e) {
            if (e == true) {
                $scope.item.obj[2179] = undefined
                $scope.item.obj[2178] = undefined
                $scope.item.obj[2181] = undefined
                $scope.item.obj[2182] = undefined
            } 
        })
        $scope.$watch('item.obj[2181]', function(e) {
            if (e == true) {
                $scope.item.obj[2179] = undefined
                $scope.item.obj[2180] = undefined
                $scope.item.obj[2178] = undefined
                $scope.item.obj[2182] = undefined
            } 
        })
        $scope.$watch('item.obj[2182]', function(e) {
            if (e == true) {
                $scope.item.obj[2179] = undefined
                $scope.item.obj[2180] = undefined
                $scope.item.obj[2181] = undefined
                $scope.item.obj[2178] = undefined
            } 
        })

        //39
        $scope.$watch('item.obj[1885]', function(e) {
            if (e == true) {
                $scope.item.obj[1886] = undefined
                $scope.item.obj[1887] = undefined
                $scope.item.obj[1888] = undefined
                $scope.item.obj[1889] = undefined
            } 
        })
        $scope.$watch('item.obj[1886]', function(e) {
            if (e == true) {
                $scope.item.obj[1885] = undefined
                $scope.item.obj[1887] = undefined
                $scope.item.obj[1888] = undefined
                $scope.item.obj[1889] = undefined
            } 
        })
        $scope.$watch('item.obj[1887]', function(e) {
            if (e == true) {
                $scope.item.obj[1886] = undefined
                $scope.item.obj[1885] = undefined
                $scope.item.obj[1888] = undefined
                $scope.item.obj[1889] = undefined
            } 
        })
        $scope.$watch('item.obj[1888]', function(e) {
            if (e == true) {
                $scope.item.obj[1886] = undefined
                $scope.item.obj[1887] = undefined
                $scope.item.obj[1885] = undefined
                $scope.item.obj[1889] = undefined
            } 
        })
        $scope.$watch('item.obj[1889]', function(e) {
            if (e == true) {
                $scope.item.obj[1886] = undefined
                $scope.item.obj[1887] = undefined
                $scope.item.obj[1888] = undefined
                $scope.item.obj[1885] = undefined
            } 
        })

        //40
        $scope.$watch('item.obj[1890]', function(e) {
            if (e == true) {
                $scope.item.obj[1891] = undefined
                $scope.item.obj[1892] = undefined
                $scope.item.obj[1893] = undefined
                $scope.item.obj[1894] = undefined
            } 
        })
        $scope.$watch('item.obj[1891]', function(e) {
            if (e == true) {
                $scope.item.obj[1890] = undefined
                $scope.item.obj[1892] = undefined
                $scope.item.obj[1893] = undefined
                $scope.item.obj[1894] = undefined
            } 
        })
        $scope.$watch('item.obj[1892]', function(e) {
            if (e == true) {
                $scope.item.obj[1891] = undefined
                $scope.item.obj[1890] = undefined
                $scope.item.obj[1893] = undefined
                $scope.item.obj[1894] = undefined
            } 
        })
        $scope.$watch('item.obj[1893]', function(e) {
            if (e == true) {
                $scope.item.obj[1891] = undefined
                $scope.item.obj[1892] = undefined
                $scope.item.obj[1890] = undefined
                $scope.item.obj[1894] = undefined
            } 
        })
        $scope.$watch('item.obj[1894]', function(e) {
            if (e == true) {
                $scope.item.obj[1891] = undefined
                $scope.item.obj[1892] = undefined
                $scope.item.obj[1893] = undefined
                $scope.item.obj[1890] = undefined
            } 
        })

        //41
        $scope.$watch('item.obj[1895]', function(e) {
            if (e == true) {
                $scope.item.obj[1896] = undefined
                $scope.item.obj[1897] = undefined
                $scope.item.obj[1898] = undefined
                $scope.item.obj[1899] = undefined
            } 
        })
        $scope.$watch('item.obj[1896]', function(e) {
            if (e == true) {
                $scope.item.obj[1895] = undefined
                $scope.item.obj[1897] = undefined
                $scope.item.obj[1898] = undefined
                $scope.item.obj[1899] = undefined
            } 
        })
        $scope.$watch('item.obj[1897]', function(e) {
            if (e == true) {
                $scope.item.obj[1896] = undefined
                $scope.item.obj[1895] = undefined
                $scope.item.obj[1898] = undefined
                $scope.item.obj[1899] = undefined
            } 
        })
        $scope.$watch('item.obj[1898]', function(e) {
            if (e == true) {
                $scope.item.obj[1896] = undefined
                $scope.item.obj[1897] = undefined
                $scope.item.obj[1895] = undefined
                $scope.item.obj[1899] = undefined
            } 
        })
        $scope.$watch('item.obj[1899]', function(e) {
            if (e == true) {
                $scope.item.obj[1896] = undefined
                $scope.item.obj[1897] = undefined
                $scope.item.obj[1898] = undefined
                $scope.item.obj[1895] = undefined
            } 
        })

        //42
        $scope.$watch('item.obj[1900]', function(e) {
            if (e == true) {
                $scope.item.obj[1901] = undefined
                $scope.item.obj[1902] = undefined
                $scope.item.obj[1903] = undefined
                $scope.item.obj[1904] = undefined
            } 
        })
        $scope.$watch('item.obj[1901]', function(e) {
            if (e == true) {
                $scope.item.obj[1900] = undefined
                $scope.item.obj[1902] = undefined
                $scope.item.obj[1903] = undefined
                $scope.item.obj[1904] = undefined
            } 
        })
        $scope.$watch('item.obj[1902]', function(e) {
            if (e == true) {
                $scope.item.obj[1901] = undefined
                $scope.item.obj[1900] = undefined
                $scope.item.obj[1903] = undefined
                $scope.item.obj[1904] = undefined
            } 
        })
        $scope.$watch('item.obj[1903]', function(e) {
            if (e == true) {
                $scope.item.obj[1901] = undefined
                $scope.item.obj[1902] = undefined
                $scope.item.obj[1900] = undefined
                $scope.item.obj[1904] = undefined
            } 
        })
        $scope.$watch('item.obj[1904]', function(e) {
            if (e == true) {
                $scope.item.obj[1901] = undefined
                $scope.item.obj[1902] = undefined
                $scope.item.obj[1903] = undefined
                $scope.item.obj[1900] = undefined
            } 
        })

        //43
        $scope.$watch('item.obj[1905]', function(e) {
            if (e == true) {
                $scope.item.obj[1906] = undefined
                $scope.item.obj[1907] = undefined
                $scope.item.obj[1908] = undefined
                $scope.item.obj[1909] = undefined
            } 
        })
        $scope.$watch('item.obj[1906]', function(e) {
            if (e == true) {
                $scope.item.obj[1905] = undefined
                $scope.item.obj[1907] = undefined
                $scope.item.obj[1908] = undefined
                $scope.item.obj[1909] = undefined
            } 
        })
        $scope.$watch('item.obj[1907]', function(e) {
            if (e == true) {
                $scope.item.obj[1906] = undefined
                $scope.item.obj[1905] = undefined
                $scope.item.obj[1908] = undefined
                $scope.item.obj[1909] = undefined
            } 
        })
        $scope.$watch('item.obj[1908]', function(e) {
            if (e == true) {
                $scope.item.obj[1906] = undefined
                $scope.item.obj[1907] = undefined
                $scope.item.obj[1905] = undefined
                $scope.item.obj[1909] = undefined
            } 
        })
        $scope.$watch('item.obj[1909]', function(e) {
            if (e == true) {
                $scope.item.obj[1906] = undefined
                $scope.item.obj[1907] = undefined
                $scope.item.obj[1908] = undefined
                $scope.item.obj[1905] = undefined
            } 
        })

        //44
        $scope.$watch('item.obj[1910]', function(e) {
            if (e == true) {
                $scope.item.obj[1911] = undefined
                $scope.item.obj[1912] = undefined
                $scope.item.obj[1913] = undefined
                $scope.item.obj[1914] = undefined
            } 
        })
        $scope.$watch('item.obj[1911]', function(e) {
            if (e == true) {
                $scope.item.obj[1910] = undefined
                $scope.item.obj[1912] = undefined
                $scope.item.obj[1913] = undefined
                $scope.item.obj[1914] = undefined
            } 
        })
        $scope.$watch('item.obj[1912]', function(e) {
            if (e == true) {
                $scope.item.obj[1911] = undefined
                $scope.item.obj[1910] = undefined
                $scope.item.obj[1913] = undefined
                $scope.item.obj[1914] = undefined
            } 
        })
        $scope.$watch('item.obj[1913]', function(e) {
            if (e == true) {
                $scope.item.obj[1911] = undefined
                $scope.item.obj[1912] = undefined
                $scope.item.obj[1910] = undefined
                $scope.item.obj[1914] = undefined
            } 
        })
        $scope.$watch('item.obj[1914]', function(e) {
            if (e == true) {
                $scope.item.obj[1911] = undefined
                $scope.item.obj[1912] = undefined
                $scope.item.obj[1913] = undefined
                $scope.item.obj[1910] = undefined
            } 
        })

        //45
        $scope.$watch('item.obj[1915]', function(e) {
            if (e == true) {
                $scope.item.obj[1916] = undefined
                $scope.item.obj[1917] = undefined
                $scope.item.obj[1918] = undefined
                $scope.item.obj[1919] = undefined
            } 
        })
        $scope.$watch('item.obj[1916]', function(e) {
            if (e == true) {
                $scope.item.obj[1915] = undefined
                $scope.item.obj[1917] = undefined
                $scope.item.obj[1918] = undefined
                $scope.item.obj[1919] = undefined
            } 
        })
        $scope.$watch('item.obj[1917]', function(e) {
            if (e == true) {
                $scope.item.obj[1916] = undefined
                $scope.item.obj[1915] = undefined
                $scope.item.obj[1918] = undefined
                $scope.item.obj[1919] = undefined
            } 
        })
        $scope.$watch('item.obj[1918]', function(e) {
            if (e == true) {
                $scope.item.obj[1916] = undefined
                $scope.item.obj[1917] = undefined
                $scope.item.obj[1915] = undefined
                $scope.item.obj[1919] = undefined
            } 
        })
        $scope.$watch('item.obj[1919]', function(e) {
            if (e == true) {
                $scope.item.obj[1916] = undefined
                $scope.item.obj[1917] = undefined
                $scope.item.obj[1918] = undefined
                $scope.item.obj[1915] = undefined
            } 
        })

        //46
        $scope.$watch('item.obj[1920]', function(e) {
            if (e == true) {
                $scope.item.obj[1921] = undefined
                $scope.item.obj[1922] = undefined
                $scope.item.obj[1923] = undefined
                $scope.item.obj[1924] = undefined
            } 
        })
        $scope.$watch('item.obj[1921]', function(e) {
            if (e == true) {
                $scope.item.obj[1920] = undefined
                $scope.item.obj[1922] = undefined
                $scope.item.obj[1923] = undefined
                $scope.item.obj[1924] = undefined
            } 
        })
        $scope.$watch('item.obj[1922]', function(e) {
            if (e == true) {
                $scope.item.obj[1921] = undefined
                $scope.item.obj[1920] = undefined
                $scope.item.obj[1923] = undefined
                $scope.item.obj[1924] = undefined
            } 
        })
        $scope.$watch('item.obj[1923]', function(e) {
            if (e == true) {
                $scope.item.obj[1921] = undefined
                $scope.item.obj[1922] = undefined
                $scope.item.obj[1920] = undefined
                $scope.item.obj[1924] = undefined
            } 
        })
        $scope.$watch('item.obj[1924]', function(e) {
            if (e == true) {
                $scope.item.obj[1921] = undefined
                $scope.item.obj[1922] = undefined
                $scope.item.obj[1923] = undefined
                $scope.item.obj[1920] = undefined
            } 
        })

        //47
        $scope.$watch('item.obj[1925]', function(e) {
            if (e == true) {
                $scope.item.obj[1926] = undefined
                $scope.item.obj[1927] = undefined
                $scope.item.obj[1928] = undefined
                $scope.item.obj[1929] = undefined
            } 
        })
        $scope.$watch('item.obj[1926]', function(e) {
            if (e == true) {
                $scope.item.obj[1925] = undefined
                $scope.item.obj[1927] = undefined
                $scope.item.obj[1928] = undefined
                $scope.item.obj[1929] = undefined
            } 
        })
        $scope.$watch('item.obj[1927]', function(e) {
            if (e == true) {
                $scope.item.obj[1926] = undefined
                $scope.item.obj[1925] = undefined
                $scope.item.obj[1928] = undefined
                $scope.item.obj[1929] = undefined
            } 
        })
        $scope.$watch('item.obj[1928]', function(e) {
            if (e == true) {
                $scope.item.obj[1926] = undefined
                $scope.item.obj[1927] = undefined
                $scope.item.obj[1925] = undefined
                $scope.item.obj[1929] = undefined
            } 
        })
        $scope.$watch('item.obj[1929]', function(e) {
            if (e == true) {
                $scope.item.obj[1926] = undefined
                $scope.item.obj[1927] = undefined
                $scope.item.obj[1928] = undefined
                $scope.item.obj[1925] = undefined
            } 
        })

        //48
        $scope.$watch('item.obj[1930]', function(e) {
            if (e == true) {
                $scope.item.obj[1931] = undefined
                $scope.item.obj[1932] = undefined
                $scope.item.obj[1933] = undefined
                $scope.item.obj[1934] = undefined
            } 
        })
        $scope.$watch('item.obj[1931]', function(e) {
            if (e == true) {
                $scope.item.obj[1930] = undefined
                $scope.item.obj[1932] = undefined
                $scope.item.obj[1933] = undefined
                $scope.item.obj[1934] = undefined
            } 
        })
        $scope.$watch('item.obj[1932]', function(e) {
            if (e == true) {
                $scope.item.obj[1931] = undefined
                $scope.item.obj[1930] = undefined
                $scope.item.obj[1933] = undefined
                $scope.item.obj[1934] = undefined
            } 
        })
        $scope.$watch('item.obj[1933]', function(e) {
            if (e == true) {
                $scope.item.obj[1931] = undefined
                $scope.item.obj[1932] = undefined
                $scope.item.obj[1930] = undefined
                $scope.item.obj[1934] = undefined
            } 
        })
        $scope.$watch('item.obj[1934]', function(e) {
            if (e == true) {
                $scope.item.obj[1931] = undefined
                $scope.item.obj[1932] = undefined
                $scope.item.obj[1933] = undefined
                $scope.item.obj[1930] = undefined
            } 
        })

        //49
        $scope.$watch('item.obj[1935]', function(e) {
            if (e == true) {
                $scope.item.obj[1936] = undefined
                $scope.item.obj[1937] = undefined
                $scope.item.obj[1938] = undefined
                $scope.item.obj[1939] = undefined
            } 
        })
        $scope.$watch('item.obj[1936]', function(e) {
            if (e == true) {
                $scope.item.obj[1935] = undefined
                $scope.item.obj[1937] = undefined
                $scope.item.obj[1938] = undefined
                $scope.item.obj[1939] = undefined
            } 
        })
        $scope.$watch('item.obj[1937]', function(e) {
            if (e == true) {
                $scope.item.obj[1936] = undefined
                $scope.item.obj[1935] = undefined
                $scope.item.obj[1938] = undefined
                $scope.item.obj[1939] = undefined
            } 
        })
        $scope.$watch('item.obj[1938]', function(e) {
            if (e == true) {
                $scope.item.obj[1936] = undefined
                $scope.item.obj[1937] = undefined
                $scope.item.obj[1935] = undefined
                $scope.item.obj[1939] = undefined
            } 
        })
        $scope.$watch('item.obj[1939]', function(e) {
            if (e == true) {
                $scope.item.obj[1936] = undefined
                $scope.item.obj[1937] = undefined
                $scope.item.obj[1938] = undefined
                $scope.item.obj[1935] = undefined
            } 
        })

        //50
        $scope.$watch('item.obj[1940]', function(e) {
            if (e == true) {
                $scope.item.obj[1941] = undefined
                $scope.item.obj[1942] = undefined
                $scope.item.obj[1943] = undefined
                $scope.item.obj[1944] = undefined
            } 
        })
        $scope.$watch('item.obj[1941]', function(e) {
            if (e == true) {
                $scope.item.obj[1940] = undefined
                $scope.item.obj[1942] = undefined
                $scope.item.obj[1943] = undefined
                $scope.item.obj[1944] = undefined
            } 
        })
        $scope.$watch('item.obj[1942]', function(e) {
            if (e == true) {
                $scope.item.obj[1941] = undefined
                $scope.item.obj[1940] = undefined
                $scope.item.obj[1943] = undefined
                $scope.item.obj[1944] = undefined
            } 
        })
        $scope.$watch('item.obj[1943]', function(e) {
            if (e == true) {
                $scope.item.obj[1941] = undefined
                $scope.item.obj[1942] = undefined
                $scope.item.obj[1940] = undefined
                $scope.item.obj[1944] = undefined
            } 
        })
        $scope.$watch('item.obj[1944]', function(e) {
            if (e == true) {
                $scope.item.obj[1941] = undefined
                $scope.item.obj[1942] = undefined
                $scope.item.obj[1943] = undefined
                $scope.item.obj[1940] = undefined
            } 
        })

        //51
        $scope.$watch('item.obj[1945]', function(e) {
            if (e == true) {
                $scope.item.obj[1946] = undefined
                $scope.item.obj[1947] = undefined
                $scope.item.obj[1948] = undefined
                $scope.item.obj[1949] = undefined
            } 
        })
        $scope.$watch('item.obj[1946]', function(e) {
            if (e == true) {
                $scope.item.obj[1945] = undefined
                $scope.item.obj[1947] = undefined
                $scope.item.obj[1948] = undefined
                $scope.item.obj[1949] = undefined
            } 
        })
        $scope.$watch('item.obj[1947]', function(e) {
            if (e == true) {
                $scope.item.obj[1946] = undefined
                $scope.item.obj[1945] = undefined
                $scope.item.obj[1948] = undefined
                $scope.item.obj[1949] = undefined
            } 
        })
        $scope.$watch('item.obj[1948]', function(e) {
            if (e == true) {
                $scope.item.obj[1946] = undefined
                $scope.item.obj[1947] = undefined
                $scope.item.obj[1945] = undefined
                $scope.item.obj[1949] = undefined
            } 
        })
        $scope.$watch('item.obj[1949]', function(e) {
            if (e == true) {
                $scope.item.obj[1946] = undefined
                $scope.item.obj[1947] = undefined
                $scope.item.obj[1948] = undefined
                $scope.item.obj[1945] = undefined
            } 
        })

        //52
        $scope.$watch('item.obj[1950]', function(e) {
            if (e == true) {
                $scope.item.obj[1951] = undefined
                $scope.item.obj[1952] = undefined
                $scope.item.obj[1953] = undefined
                $scope.item.obj[1954] = undefined
            } 
        })
        $scope.$watch('item.obj[1951]', function(e) {
            if (e == true) {
                $scope.item.obj[1950] = undefined
                $scope.item.obj[1952] = undefined
                $scope.item.obj[1953] = undefined
                $scope.item.obj[1954] = undefined
            } 
        })
        $scope.$watch('item.obj[1952]', function(e) {
            if (e == true) {
                $scope.item.obj[1951] = undefined
                $scope.item.obj[1950] = undefined
                $scope.item.obj[1953] = undefined
                $scope.item.obj[1954] = undefined
            } 
        })
        $scope.$watch('item.obj[1953]', function(e) {
            if (e == true) {
                $scope.item.obj[1951] = undefined
                $scope.item.obj[1952] = undefined
                $scope.item.obj[1950] = undefined
                $scope.item.obj[1954] = undefined
            } 
        })
        $scope.$watch('item.obj[1954]', function(e) {
            if (e == true) {
                $scope.item.obj[1951] = undefined
                $scope.item.obj[1952] = undefined
                $scope.item.obj[1953] = undefined
                $scope.item.obj[1950] = undefined
            } 
        })

        //53
        $scope.$watch('item.obj[1955]', function(e) {
            if (e == true) {
                $scope.item.obj[1956] = undefined
                $scope.item.obj[1957] = undefined
                $scope.item.obj[1958] = undefined
                $scope.item.obj[1959] = undefined
            } 
        })
        $scope.$watch('item.obj[1956]', function(e) {
            if (e == true) {
                $scope.item.obj[1957] = undefined
                $scope.item.obj[1958] = undefined
                $scope.item.obj[1959] = undefined
                $scope.item.obj[1955] = undefined
            } 
        })
        $scope.$watch('item.obj[1957]', function(e) {
            if (e == true) {
                $scope.item.obj[1956] = undefined
                $scope.item.obj[1955] = undefined
                $scope.item.obj[1958] = undefined
                $scope.item.obj[1959] = undefined
            } 
        })
        $scope.$watch('item.obj[1958]', function(e) {
            if (e == true) {
                $scope.item.obj[1956] = undefined
                $scope.item.obj[1957] = undefined
                $scope.item.obj[1955] = undefined
                $scope.item.obj[1959] = undefined
            } 
        })
        $scope.$watch('item.obj[1959]', function(e) {
            if (e == true) {
                $scope.item.obj[1956] = undefined
                $scope.item.obj[1957] = undefined
                $scope.item.obj[1958] = undefined
                $scope.item.obj[1955] = undefined
            } 
        })

        //54
        $scope.$watch('item.obj[1960]', function(e) {
            if (e == true) {
                $scope.item.obj[1961] = undefined
                $scope.item.obj[1962] = undefined
                $scope.item.obj[1963] = undefined
                $scope.item.obj[1964] = undefined
            } 
        })
        $scope.$watch('item.obj[1961]', function(e) {
            if (e == true) {
                $scope.item.obj[1960] = undefined
                $scope.item.obj[1962] = undefined
                $scope.item.obj[1963] = undefined
                $scope.item.obj[1964] = undefined
            } 
        })
        $scope.$watch('item.obj[1962]', function(e) {
            if (e == true) {
                $scope.item.obj[1961] = undefined
                $scope.item.obj[1960] = undefined
                $scope.item.obj[1963] = undefined
                $scope.item.obj[1964] = undefined
            } 
        })
        $scope.$watch('item.obj[1963]', function(e) {
            if (e == true) {
                $scope.item.obj[1961] = undefined
                $scope.item.obj[1962] = undefined
                $scope.item.obj[1960] = undefined
                $scope.item.obj[1964] = undefined
            } 
        })
        $scope.$watch('item.obj[1964]', function(e) {
            if (e == true) {
                $scope.item.obj[1961] = undefined
                $scope.item.obj[1962] = undefined
                $scope.item.obj[1963] = undefined
                $scope.item.obj[1960] = undefined
            } 
        })

        //55
        $scope.$watch('item.obj[1965]', function(e) {
            if (e == true) {
                $scope.item.obj[1966] = undefined
                $scope.item.obj[1967] = undefined
                $scope.item.obj[1968] = undefined
                $scope.item.obj[1969] = undefined
            } 
        })
        $scope.$watch('item.obj[1966]', function(e) {
            if (e == true) {
                $scope.item.obj[1965] = undefined
                $scope.item.obj[1967] = undefined
                $scope.item.obj[1968] = undefined
                $scope.item.obj[1969] = undefined
            } 
        })
        $scope.$watch('item.obj[1967]', function(e) {
            if (e == true) {
                $scope.item.obj[1966] = undefined
                $scope.item.obj[1965] = undefined
                $scope.item.obj[1968] = undefined
                $scope.item.obj[1969] = undefined
            } 
        })
        $scope.$watch('item.obj[1968]', function(e) {
            if (e == true) {
                $scope.item.obj[1966] = undefined
                $scope.item.obj[1967] = undefined
                $scope.item.obj[1965] = undefined
                $scope.item.obj[1969] = undefined
            } 
        })
        $scope.$watch('item.obj[1969]', function(e) {
            if (e == true) {
                $scope.item.obj[1966] = undefined
                $scope.item.obj[1967] = undefined
                $scope.item.obj[1968] = undefined
                $scope.item.obj[1965] = undefined
            } 
        })

        //56
        $scope.$watch('item.obj[1970]', function(e) {
            if (e == true) {
                $scope.item.obj[1971] = undefined
                $scope.item.obj[1972] = undefined
                $scope.item.obj[1973] = undefined
                $scope.item.obj[1974] = undefined
            } 
        })
        $scope.$watch('item.obj[1971]', function(e) {
            if (e == true) {
                $scope.item.obj[1970] = undefined
                $scope.item.obj[1972] = undefined
                $scope.item.obj[1973] = undefined
                $scope.item.obj[1974] = undefined
            } 
        })
        $scope.$watch('item.obj[1972]', function(e) {
            if (e == true) {
                $scope.item.obj[1971] = undefined
                $scope.item.obj[1970] = undefined
                $scope.item.obj[1973] = undefined
                $scope.item.obj[1974] = undefined
            } 
        })
        $scope.$watch('item.obj[1973]', function(e) {
            if (e == true) {
                $scope.item.obj[1971] = undefined
                $scope.item.obj[1972] = undefined
                $scope.item.obj[1970] = undefined
                $scope.item.obj[1974] = undefined
            } 
        })
        $scope.$watch('item.obj[1974]', function(e) {
            if (e == true) {
                $scope.item.obj[1971] = undefined
                $scope.item.obj[1972] = undefined
                $scope.item.obj[1973] = undefined
                $scope.item.obj[1970] = undefined
            } 
        })

        //57
        $scope.$watch('item.obj[1975]', function(e) {
            if (e == true) {
                $scope.item.obj[1976] = undefined
                $scope.item.obj[1977] = undefined
                $scope.item.obj[1978] = undefined
                $scope.item.obj[1979] = undefined
            } 
        })
        $scope.$watch('item.obj[1976]', function(e) {
            if (e == true) {
                $scope.item.obj[1975] = undefined
                $scope.item.obj[1977] = undefined
                $scope.item.obj[1978] = undefined
                $scope.item.obj[1979] = undefined
            } 
        })
        $scope.$watch('item.obj[1977]', function(e) {
            if (e == true) {
                $scope.item.obj[1976] = undefined
                $scope.item.obj[1975] = undefined
                $scope.item.obj[1978] = undefined
                $scope.item.obj[1979] = undefined
            } 
        })
        $scope.$watch('item.obj[1978]', function(e) {
            if (e == true) {
                $scope.item.obj[1976] = undefined
                $scope.item.obj[1977] = undefined
                $scope.item.obj[1975] = undefined
                $scope.item.obj[1979] = undefined
            } 
        })
        $scope.$watch('item.obj[1979]', function(e) {
            if (e == true) {
                $scope.item.obj[1976] = undefined
                $scope.item.obj[1977] = undefined
                $scope.item.obj[1978] = undefined
                $scope.item.obj[1975] = undefined
            } 
        })

        //58
        $scope.$watch('item.obj[1980]', function(e) {
            if (e == true) {
                $scope.item.obj[1981] = undefined
                $scope.item.obj[1982] = undefined
                $scope.item.obj[1983] = undefined
                $scope.item.obj[1984] = undefined
            } 
        })
        $scope.$watch('item.obj[1981]', function(e) {
            if (e == true) {
                $scope.item.obj[1980] = undefined
                $scope.item.obj[1982] = undefined
                $scope.item.obj[1983] = undefined
                $scope.item.obj[1984] = undefined
            } 
        })
        $scope.$watch('item.obj[1982]', function(e) {
            if (e == true) {
                $scope.item.obj[1981] = undefined
                $scope.item.obj[1980] = undefined
                $scope.item.obj[1983] = undefined
                $scope.item.obj[1984] = undefined
            } 
        })
        $scope.$watch('item.obj[1983]', function(e) {
            if (e == true) {
                $scope.item.obj[1981] = undefined
                $scope.item.obj[1982] = undefined
                $scope.item.obj[1980] = undefined
                $scope.item.obj[1984] = undefined
            } 
        })
        $scope.$watch('item.obj[1984]', function(e) {
            if (e == true) {
                $scope.item.obj[1981] = undefined
                $scope.item.obj[1982] = undefined
                $scope.item.obj[1983] = undefined
                $scope.item.obj[1980] = undefined
            } 
        })

        //59
        $scope.$watch('item.obj[1985]', function(e) {
            if (e == true) {
                $scope.item.obj[1986] = undefined
                $scope.item.obj[1987] = undefined
                $scope.item.obj[1988] = undefined
                $scope.item.obj[1989] = undefined
                $scope.item.obj[1990] = undefined
            } 
        })
        $scope.$watch('item.obj[1986]', function(e) {
            if (e == true) {
                $scope.item.obj[1985] = undefined
                $scope.item.obj[1987] = undefined
                $scope.item.obj[1988] = undefined
                $scope.item.obj[1989] = undefined
                $scope.item.obj[1990] = undefined
            } 
        })
        $scope.$watch('item.obj[1987]', function(e) {
            if (e == true) {
                $scope.item.obj[1986] = undefined
                $scope.item.obj[1985] = undefined
                $scope.item.obj[1988] = undefined
                $scope.item.obj[1989] = undefined
                $scope.item.obj[1990] = undefined
            } 
        })
        $scope.$watch('item.obj[1988]', function(e) {
            if (e == true) {
                $scope.item.obj[1986] = undefined
                $scope.item.obj[1987] = undefined
                $scope.item.obj[1985] = undefined
                $scope.item.obj[1989] = undefined
                $scope.item.obj[1990] = undefined
            } 
        })
        $scope.$watch('item.obj[1989]', function(e) {
            if (e == true) {
                $scope.item.obj[1986] = undefined
                $scope.item.obj[1987] = undefined
                $scope.item.obj[1988] = undefined
                $scope.item.obj[1985] = undefined
                $scope.item.obj[1990] = undefined
            } 
        })
        $scope.$watch('item.obj[1990]', function(e) {
            if (e == true) {
                $scope.item.obj[1986] = undefined
                $scope.item.obj[1987] = undefined
                $scope.item.obj[1988] = undefined
                $scope.item.obj[1989] = undefined
                $scope.item.obj[1985] = undefined
            } 
        })
        //60
        $scope.$watch('item.obj[1991]', function(e) {
            if (e == true) {
                $scope.item.obj[1992] = undefined
                $scope.item.obj[1993] = undefined
                $scope.item.obj[1994] = undefined
                $scope.item.obj[1995] = undefined
                $scope.item.obj[1996] = undefined
            } 
        })
        $scope.$watch('item.obj[1992]', function(e) {
            if (e == true) {
                $scope.item.obj[1991] = undefined
                $scope.item.obj[1993] = undefined
                $scope.item.obj[1994] = undefined
                $scope.item.obj[1995] = undefined
                $scope.item.obj[1996] = undefined
            } 
        })
        $scope.$watch('item.obj[1993]', function(e) {
            if (e == true) {
                $scope.item.obj[1992] = undefined
                $scope.item.obj[1991] = undefined
                $scope.item.obj[1994] = undefined
                $scope.item.obj[1995] = undefined
                $scope.item.obj[1996] = undefined
            } 
        })
        $scope.$watch('item.obj[1994]', function(e) {
            if (e == true) {
                $scope.item.obj[1992] = undefined
                $scope.item.obj[1993] = undefined
                $scope.item.obj[1991] = undefined
                $scope.item.obj[1995] = undefined
                $scope.item.obj[1996] = undefined
            } 
        })
        $scope.$watch('item.obj[1995]', function(e) {
            if (e == true) {
                $scope.item.obj[1992] = undefined
                $scope.item.obj[1993] = undefined
                $scope.item.obj[1994] = undefined
                $scope.item.obj[1991] = undefined
                $scope.item.obj[1996] = undefined
            } 
        })
        $scope.$watch('item.obj[1996]', function(e) {
            if (e == true) {
                $scope.item.obj[1992] = undefined
                $scope.item.obj[1993] = undefined
                $scope.item.obj[1994] = undefined
                $scope.item.obj[1995] = undefined
                $scope.item.obj[1991] = undefined
            } 
        })
        //61
        $scope.$watch('item.obj[1997]', function(e) {
            if (e == true) {
                $scope.item.obj[1998] = undefined
                $scope.item.obj[1999] = undefined
                $scope.item.obj[2000] = undefined
                $scope.item.obj[2001] = undefined
                $scope.item.obj[2002] = undefined
            } 
        })
        $scope.$watch('item.obj[1998]', function(e) {
            if (e == true) {
                $scope.item.obj[1997] = undefined
                $scope.item.obj[1999] = undefined
                $scope.item.obj[2000] = undefined
                $scope.item.obj[2001] = undefined
                $scope.item.obj[2002] = undefined
            } 
        })
        $scope.$watch('item.obj[1999]', function(e) {
            if (e == true) {
                $scope.item.obj[1998] = undefined
                $scope.item.obj[1997] = undefined
                $scope.item.obj[2000] = undefined
                $scope.item.obj[2001] = undefined
                $scope.item.obj[2002] = undefined
            } 
        })
        $scope.$watch('item.obj[2000]', function(e) {
            if (e == true) {
                $scope.item.obj[1998] = undefined
                $scope.item.obj[1999] = undefined
                $scope.item.obj[1997] = undefined
                $scope.item.obj[2001] = undefined
                $scope.item.obj[2002] = undefined
            } 
        })
        $scope.$watch('item.obj[2001]', function(e) {
            if (e == true) {
                $scope.item.obj[1998] = undefined
                $scope.item.obj[1999] = undefined
                $scope.item.obj[2000] = undefined
                $scope.item.obj[1997] = undefined
                $scope.item.obj[2002] = undefined
            } 
        })
        $scope.$watch('item.obj[2002]', function(e) {
            if (e == true) {
                $scope.item.obj[1998] = undefined
                $scope.item.obj[1999] = undefined
                $scope.item.obj[2000] = undefined
                $scope.item.obj[2001] = undefined
                $scope.item.obj[1997] = undefined
            } 
        })
        //62
        $scope.$watch('item.obj[2003]', function(e) {
            if (e == true) {
                $scope.item.obj[2004] = undefined
                $scope.item.obj[2005] = undefined
                $scope.item.obj[2006] = undefined
                $scope.item.obj[2007] = undefined
                $scope.item.obj[2008] = undefined
            } 
        })
        $scope.$watch('item.obj[2004]', function(e) {
            if (e == true) {
                $scope.item.obj[2003] = undefined
                $scope.item.obj[2005] = undefined
                $scope.item.obj[2006] = undefined
                $scope.item.obj[2007] = undefined
                $scope.item.obj[2008] = undefined
            } 
        })
        $scope.$watch('item.obj[2005]', function(e) {
            if (e == true) {
                $scope.item.obj[2004] = undefined
                $scope.item.obj[2003] = undefined
                $scope.item.obj[2006] = undefined
                $scope.item.obj[2007] = undefined
                $scope.item.obj[2008] = undefined
            } 
        })
        $scope.$watch('item.obj[2006]', function(e) {
            if (e == true) {
                $scope.item.obj[2004] = undefined
                $scope.item.obj[2005] = undefined
                $scope.item.obj[2003] = undefined
                $scope.item.obj[2007] = undefined
                $scope.item.obj[2008] = undefined
            } 
        })
        $scope.$watch('item.obj[2007]', function(e) {
            if (e == true) {
                $scope.item.obj[2004] = undefined
                $scope.item.obj[2005] = undefined
                $scope.item.obj[2006] = undefined
                $scope.item.obj[2003] = undefined
                $scope.item.obj[2008] = undefined
            } 
        })
        $scope.$watch('item.obj[2008]', function(e) {
            if (e == true) {
                $scope.item.obj[2004] = undefined
                $scope.item.obj[2005] = undefined
                $scope.item.obj[2006] = undefined
                $scope.item.obj[2007] = undefined
                $scope.item.obj[2003] = undefined
            } 
        })

        //63
        $scope.$watch('item.obj[2009]', function(e) {
            if (e == true) {
                $scope.item.obj[2010] = undefined
                $scope.item.obj[2011] = undefined
                $scope.item.obj[2012] = undefined
                $scope.item.obj[2013] = undefined
                $scope.item.obj[2014] = undefined
            } 
        })
        $scope.$watch('item.obj[2010]', function(e) {
            if (e == true) {
                $scope.item.obj[2009] = undefined
                $scope.item.obj[2011] = undefined
                $scope.item.obj[2012] = undefined
                $scope.item.obj[2013] = undefined
                $scope.item.obj[2014] = undefined
            } 
        })
        $scope.$watch('item.obj[2011]', function(e) {
            if (e == true) {
                $scope.item.obj[2010] = undefined
                $scope.item.obj[2009] = undefined
                $scope.item.obj[2012] = undefined
                $scope.item.obj[2013] = undefined
                $scope.item.obj[2014] = undefined
            } 
        })
        $scope.$watch('item.obj[2012]', function(e) {
            if (e == true) {
                $scope.item.obj[2010] = undefined
                $scope.item.obj[2011] = undefined
                $scope.item.obj[2009] = undefined
                $scope.item.obj[2013] = undefined
                $scope.item.obj[2014] = undefined
            } 
        })
        $scope.$watch('item.obj[2013]', function(e) {
            if (e == true) {
                $scope.item.obj[2010] = undefined
                $scope.item.obj[2011] = undefined
                $scope.item.obj[2012] = undefined
                $scope.item.obj[2009] = undefined
                $scope.item.obj[2014] = undefined
            } 
        })
        $scope.$watch('item.obj[2014]', function(e) {
            if (e == true) {
                $scope.item.obj[2010] = undefined
                $scope.item.obj[2011] = undefined
                $scope.item.obj[2012] = undefined
                $scope.item.obj[2013] = undefined
                $scope.item.obj[2009] = undefined
            } 
        })
        
        //64
        $scope.$watch('item.obj[2015]', function(e) {
            if (e == true) {
                $scope.item.obj[2016] = undefined
                $scope.item.obj[2017] = undefined
                $scope.item.obj[2018] = undefined
                $scope.item.obj[2019] = undefined
                $scope.item.obj[2020] = undefined
            } 
        })
        $scope.$watch('item.obj[2016]', function(e) {
            if (e == true) {
                $scope.item.obj[2015] = undefined
                $scope.item.obj[2017] = undefined
                $scope.item.obj[2018] = undefined
                $scope.item.obj[2019] = undefined
                $scope.item.obj[2020] = undefined
            } 
        })
        $scope.$watch('item.obj[2017]', function(e) {
            if (e == true) {
                $scope.item.obj[2016] = undefined
                $scope.item.obj[2015] = undefined
                $scope.item.obj[2018] = undefined
                $scope.item.obj[2019] = undefined
                $scope.item.obj[2020] = undefined
            } 
        })
        $scope.$watch('item.obj[2018]', function(e) {
            if (e == true) {
                $scope.item.obj[2016] = undefined
                $scope.item.obj[2017] = undefined
                $scope.item.obj[2015] = undefined
                $scope.item.obj[2019] = undefined
                $scope.item.obj[2020] = undefined
            } 
        })
        $scope.$watch('item.obj[2019]', function(e) {
            if (e == true) {
                $scope.item.obj[2016] = undefined
                $scope.item.obj[2017] = undefined
                $scope.item.obj[2018] = undefined
                $scope.item.obj[2015] = undefined
                $scope.item.obj[2020] = undefined
            } 
        })
        $scope.$watch('item.obj[2020]', function(e) {
            if (e == true) {
                $scope.item.obj[2016] = undefined
                $scope.item.obj[2017] = undefined
                $scope.item.obj[2018] = undefined
                $scope.item.obj[2019] = undefined
                $scope.item.obj[2015] = undefined
            } 
        })
        
        //65
        $scope.$watch('item.obj[2021]', function(e) {
            if (e == true) {
                $scope.item.obj[2022] = undefined
                $scope.item.obj[2023] = undefined
                $scope.item.obj[2024] = undefined
                $scope.item.obj[2025] = undefined
                $scope.item.obj[2026] = undefined
            } 
        })
        $scope.$watch('item.obj[2022]', function(e) {
            if (e == true) {
                $scope.item.obj[2021] = undefined
                $scope.item.obj[2023] = undefined
                $scope.item.obj[2024] = undefined
                $scope.item.obj[2025] = undefined
                $scope.item.obj[2026] = undefined
            } 
        })
        $scope.$watch('item.obj[2023]', function(e) {
            if (e == true) {
                $scope.item.obj[2022] = undefined
                $scope.item.obj[2021] = undefined
                $scope.item.obj[2024] = undefined
                $scope.item.obj[2025] = undefined
                $scope.item.obj[2026] = undefined
            } 
        })
        $scope.$watch('item.obj[2024]', function(e) {
            if (e == true) {
                $scope.item.obj[2022] = undefined
                $scope.item.obj[2023] = undefined
                $scope.item.obj[2021] = undefined
                $scope.item.obj[2025] = undefined
                $scope.item.obj[2026] = undefined
            } 
        })
        $scope.$watch('item.obj[2025]', function(e) {
            if (e == true) {
                $scope.item.obj[2022] = undefined
                $scope.item.obj[2023] = undefined
                $scope.item.obj[2024] = undefined
                $scope.item.obj[2021] = undefined
                $scope.item.obj[2026] = undefined
            } 
        })
        $scope.$watch('item.obj[2026]', function(e) {
            if (e == true) {
                $scope.item.obj[2022] = undefined
                $scope.item.obj[2023] = undefined
                $scope.item.obj[2024] = undefined
                $scope.item.obj[2025] = undefined
                $scope.item.obj[2021] = undefined
            } 
        })

        //66
        $scope.$watch('item.obj[2027]', function(e) {
            if (e == true) {
                $scope.item.obj[2028] = undefined
                $scope.item.obj[2029] = undefined
                $scope.item.obj[2030] = undefined
                $scope.item.obj[2031] = undefined
                $scope.item.obj[2032] = undefined
            } 
        })
        $scope.$watch('item.obj[2028]', function(e) {
            if (e == true) {
                $scope.item.obj[2027] = undefined
                $scope.item.obj[2029] = undefined
                $scope.item.obj[2030] = undefined
                $scope.item.obj[2031] = undefined
                $scope.item.obj[2032] = undefined
            } 
        })
        $scope.$watch('item.obj[2029]', function(e) {
            if (e == true) {
                $scope.item.obj[2028] = undefined
                $scope.item.obj[2027] = undefined
                $scope.item.obj[2030] = undefined
                $scope.item.obj[2031] = undefined
                $scope.item.obj[2032] = undefined
            } 
        })
        $scope.$watch('item.obj[2030]', function(e) {
            if (e == true) {
                $scope.item.obj[2028] = undefined
                $scope.item.obj[2029] = undefined
                $scope.item.obj[2031] = undefined
                $scope.item.obj[2027] = undefined
                $scope.item.obj[2032] = undefined
            } 
        })
        $scope.$watch('item.obj[2031]', function(e) {
            if (e == true) {
                $scope.item.obj[2028] = undefined
                $scope.item.obj[2029] = undefined
                $scope.item.obj[2030] = undefined
                $scope.item.obj[2027] = undefined
                $scope.item.obj[2032] = undefined
            } 
        })
        $scope.$watch('item.obj[2032]', function(e) {
            if (e == true) {
                $scope.item.obj[2028] = undefined
                $scope.item.obj[2029] = undefined
                $scope.item.obj[2030] = undefined
                $scope.item.obj[2031] = undefined
                $scope.item.obj[2027] = undefined
            } 
        })

        //67
        $scope.$watch('item.obj[2033]', function(e) {
            if (e == true) {
                $scope.item.obj[2034] = undefined
                $scope.item.obj[2035] = undefined
                $scope.item.obj[2036] = undefined
                $scope.item.obj[2037] = undefined
                $scope.item.obj[2038] = undefined
            } 
        })
        $scope.$watch('item.obj[2034]', function(e) {
            if (e == true) {
                $scope.item.obj[2033] = undefined
                $scope.item.obj[2035] = undefined
                $scope.item.obj[2036] = undefined
                $scope.item.obj[2037] = undefined
                $scope.item.obj[2038] = undefined
            } 
        })
        $scope.$watch('item.obj[2035]', function(e) {
            if (e == true) {
                $scope.item.obj[2034] = undefined
                $scope.item.obj[2033] = undefined
                $scope.item.obj[2036] = undefined
                $scope.item.obj[2037] = undefined
                $scope.item.obj[2038] = undefined
            } 
        })
        $scope.$watch('item.obj[2036]', function(e) {
            if (e == true) {
                $scope.item.obj[2034] = undefined
                $scope.item.obj[2035] = undefined
                $scope.item.obj[2033] = undefined
                $scope.item.obj[2037] = undefined
                $scope.item.obj[2038] = undefined
            } 
        })
        $scope.$watch('item.obj[2037]', function(e) {
            if (e == true) {
                $scope.item.obj[2034] = undefined
                $scope.item.obj[2035] = undefined
                $scope.item.obj[2036] = undefined
                $scope.item.obj[2033] = undefined
                $scope.item.obj[2038] = undefined
            } 
        })
        $scope.$watch('item.obj[2038]', function(e) {
            if (e == true) {
                $scope.item.obj[2034] = undefined
                $scope.item.obj[2035] = undefined
                $scope.item.obj[2036] = undefined
                $scope.item.obj[2037] = undefined
                $scope.item.obj[2033] = undefined
            } 
        })

        //68
        $scope.$watch('item.obj[2039]', function(e) {
            if (e == true) {
                $scope.item.obj[2040] = undefined
                $scope.item.obj[2041] = undefined
                $scope.item.obj[2042] = undefined
                $scope.item.obj[2043] = undefined
                $scope.item.obj[2044] = undefined
            } 
        })
        $scope.$watch('item.obj[2040]', function(e) {
            if (e == true) {
                $scope.item.obj[2039] = undefined
                $scope.item.obj[2041] = undefined
                $scope.item.obj[2042] = undefined
                $scope.item.obj[2043] = undefined
                $scope.item.obj[2044] = undefined
            } 
        })
        $scope.$watch('item.obj[2041]', function(e) {
            if (e == true) {
                $scope.item.obj[2040] = undefined
                $scope.item.obj[2039] = undefined
                $scope.item.obj[2042] = undefined
                $scope.item.obj[2043] = undefined
                $scope.item.obj[2044] = undefined
            } 
        })
        $scope.$watch('item.obj[2042]', function(e) {
            if (e == true) {
                $scope.item.obj[2040] = undefined
                $scope.item.obj[2041] = undefined
                $scope.item.obj[2039] = undefined
                $scope.item.obj[2043] = undefined
                $scope.item.obj[2044] = undefined
            } 
        })
        $scope.$watch('item.obj[2043]', function(e) {
            if (e == true) {
                $scope.item.obj[2040] = undefined
                $scope.item.obj[2041] = undefined
                $scope.item.obj[2042] = undefined
                $scope.item.obj[2039] = undefined
                $scope.item.obj[2044] = undefined
            } 
        })
        $scope.$watch('item.obj[2044]', function(e) {
            if (e == true) {
                $scope.item.obj[2040] = undefined
                $scope.item.obj[2041] = undefined
                $scope.item.obj[2042] = undefined
                $scope.item.obj[2043] = undefined
                $scope.item.obj[2039] = undefined
            } 
        })

        //69
        $scope.$watch('item.obj[2045]', function(e) {
            if (e == true) {
                $scope.item.obj[2046] = undefined
                $scope.item.obj[2047] = undefined
                $scope.item.obj[2048] = undefined
                $scope.item.obj[2049] = undefined
                $scope.item.obj[2050] = undefined
            } 
        })
        $scope.$watch('item.obj[2046]', function(e) {
            if (e == true) {
                $scope.item.obj[2045] = undefined
                $scope.item.obj[2047] = undefined
                $scope.item.obj[2048] = undefined
                $scope.item.obj[2049] = undefined
                $scope.item.obj[2050] = undefined
            } 
        })
        $scope.$watch('item.obj[2047]', function(e) {
            if (e == true) {
                $scope.item.obj[2046] = undefined
                $scope.item.obj[2045] = undefined
                $scope.item.obj[2048] = undefined
                $scope.item.obj[2049] = undefined
                $scope.item.obj[2050] = undefined
            } 
        })
        $scope.$watch('item.obj[2048]', function(e) {
            if (e == true) {
                $scope.item.obj[2046] = undefined
                $scope.item.obj[2047] = undefined
                $scope.item.obj[2045] = undefined
                $scope.item.obj[2049] = undefined
                $scope.item.obj[2050] = undefined
            } 
        })
        $scope.$watch('item.obj[2049]', function(e) {
            if (e == true) {
                $scope.item.obj[2046] = undefined
                $scope.item.obj[2047] = undefined
                $scope.item.obj[2048] = undefined
                $scope.item.obj[2045] = undefined
                $scope.item.obj[2050] = undefined
            } 
        })
        $scope.$watch('item.obj[2050]', function(e) {
            if (e == true) {
                $scope.item.obj[2046] = undefined
                $scope.item.obj[2047] = undefined
                $scope.item.obj[2048] = undefined
                $scope.item.obj[2049] = undefined
                $scope.item.obj[2045] = undefined
            } 
        })

        //70
        $scope.$watch('item.obj[2051]', function(e) {
            if (e == true) {
                $scope.item.obj[2052] = undefined
                $scope.item.obj[2053] = undefined
                $scope.item.obj[2054] = undefined
                $scope.item.obj[2055] = undefined               
            } 
        })
        $scope.$watch('item.obj[2052]', function(e) {
            if (e == true) {
                $scope.item.obj[2051] = undefined
                $scope.item.obj[2053] = undefined
                $scope.item.obj[2054] = undefined
                $scope.item.obj[2055] = undefined               
            } 
        })
        $scope.$watch('item.obj[2053]', function(e) {
            if (e == true) {
                $scope.item.obj[2052] = undefined
                $scope.item.obj[2051] = undefined
                $scope.item.obj[2054] = undefined
                $scope.item.obj[2055] = undefined               
            } 
        })
        $scope.$watch('item.obj[2054]', function(e) {
            if (e == true) {
                $scope.item.obj[2052] = undefined
                $scope.item.obj[2053] = undefined
                $scope.item.obj[2051] = undefined
                $scope.item.obj[2055] = undefined               
            } 
        })
        $scope.$watch('item.obj[2055]', function(e) {
            if (e == true) {
                $scope.item.obj[2052] = undefined
                $scope.item.obj[2053] = undefined
                $scope.item.obj[2054] = undefined
                $scope.item.obj[2051] = undefined               
            } 
        })

        //71
        $scope.$watch('item.obj[2056]', function(e) {
            if (e == true) {
                $scope.item.obj[2057] = undefined
                $scope.item.obj[2058] = undefined
                $scope.item.obj[2059] = undefined
                $scope.item.obj[2060] = undefined               
            } 
        })
        $scope.$watch('item.obj[2057]', function(e) {
            if (e == true) {
                $scope.item.obj[2056] = undefined
                $scope.item.obj[2058] = undefined
                $scope.item.obj[2059] = undefined
                $scope.item.obj[2060] = undefined               
            } 
        })
        $scope.$watch('item.obj[2058]', function(e) {
            if (e == true) {
                $scope.item.obj[2057] = undefined
                $scope.item.obj[2056] = undefined
                $scope.item.obj[2059] = undefined
                $scope.item.obj[2060] = undefined               
            } 
        })
        $scope.$watch('item.obj[2059]', function(e) {
            if (e == true) {
                $scope.item.obj[2057] = undefined
                $scope.item.obj[2058] = undefined
                $scope.item.obj[2056] = undefined
                $scope.item.obj[2060] = undefined               
            } 
        })
        $scope.$watch('item.obj[2060]', function(e) {
            if (e == true) {
                $scope.item.obj[2057] = undefined
                $scope.item.obj[2058] = undefined
                $scope.item.obj[2059] = undefined
                $scope.item.obj[2056] = undefined               
            } 
        })

        //72
        $scope.$watch('item.obj[2061]', function(e) {
            if (e == true) {
                $scope.item.obj[2062] = undefined
                $scope.item.obj[2063] = undefined
                $scope.item.obj[2066] = undefined
                $scope.item.obj[2065] = undefined               
            } 
        })
        $scope.$watch('item.obj[2062]', function(e) {
            if (e == true) {
                $scope.item.obj[2061] = undefined
                $scope.item.obj[2063] = undefined
                $scope.item.obj[2066] = undefined
                $scope.item.obj[2065] = undefined               
            } 
        })
        $scope.$watch('item.obj[2063]', function(e) {
            if (e == true) {
                $scope.item.obj[2062] = undefined
                $scope.item.obj[2061] = undefined
                $scope.item.obj[2066] = undefined
                $scope.item.obj[2065] = undefined               
            } 
        })
        $scope.$watch('item.obj[2066]', function(e) {
            if (e == true) {
                $scope.item.obj[2062] = undefined
                $scope.item.obj[2063] = undefined
                $scope.item.obj[2061] = undefined
                $scope.item.obj[2065] = undefined               
            } 
        })
        $scope.$watch('item.obj[2065]', function(e) {
            if (e == true) {
                $scope.item.obj[2062] = undefined
                $scope.item.obj[2063] = undefined
                $scope.item.obj[2066] = undefined
                $scope.item.obj[2061] = undefined               
            } 
        })      
        // $scope.$watch('item.obj[2066]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[2067] = undefined
        //         $scope.item.obj[2068] = undefined
        //         $scope.item.obj[2069] = undefined
        //         $scope.item.obj[2070] = undefined               
        //     } 
        // })

          //73
        $scope.$watch('item.obj[2067]', function(e) {
            if (e == true) {
                $scope.item.obj[2068] = undefined
                $scope.item.obj[2069] = undefined
                $scope.item.obj[2070] = undefined
                $scope.item.obj[2071] = undefined               
            } 
        })
        $scope.$watch('item.obj[2068]', function(e) {
            if (e == true) {
                $scope.item.obj[2067] = undefined
                $scope.item.obj[2069] = undefined
                $scope.item.obj[2070] = undefined
                $scope.item.obj[2071] = undefined               
            } 
        })
        $scope.$watch('item.obj[2069]', function(e) {
            if (e == true) {
                $scope.item.obj[2067] = undefined
                $scope.item.obj[2068] = undefined
                $scope.item.obj[2071] = undefined
                $scope.item.obj[2070] = undefined               
            } 
        })
        $scope.$watch('item.obj[2070]', function(e) {
            if (e == true) {
                $scope.item.obj[2067] = undefined
                $scope.item.obj[2068] = undefined
                $scope.item.obj[2069] = undefined
                $scope.item.obj[2071] = undefined               
            } 
        })        
        $scope.$watch('item.obj[2071]', function(e) {
            if (e == true) {
                $scope.item.obj[2067] = undefined
                $scope.item.obj[2068] = undefined
                $scope.item.obj[2069] = undefined
                $scope.item.obj[2070] = undefined               
            } 
        })

        //74
        $scope.$watch('item.obj[2072]', function(e) {
            if (e == true) {
                $scope.item.obj[2076] = undefined
                $scope.item.obj[2073] = undefined
                $scope.item.obj[2074] = undefined
                $scope.item.obj[2075] = undefined               
            } 
        })
        $scope.$watch('item.obj[2073]', function(e) {
            if (e == true) {
                $scope.item.obj[2072] = undefined
                $scope.item.obj[2076] = undefined
                $scope.item.obj[2074] = undefined
                $scope.item.obj[2075] = undefined               
            } 
        })
        $scope.$watch('item.obj[2074]', function(e) {
            if (e == true) {
                $scope.item.obj[2072] = undefined
                $scope.item.obj[2073] = undefined
                $scope.item.obj[2076] = undefined
                $scope.item.obj[2075] = undefined               
            } 
        })
        $scope.$watch('item.obj[2075]', function(e) {
            if (e == true) {
                $scope.item.obj[2072] = undefined
                $scope.item.obj[2073] = undefined
                $scope.item.obj[2074] = undefined
                $scope.item.obj[2076] = undefined               
            } 
        })        
        $scope.$watch('item.obj[2076]', function(e) {
            if (e == true) {
                $scope.item.obj[2072] = undefined
                $scope.item.obj[2073] = undefined
                $scope.item.obj[2074] = undefined
                $scope.item.obj[2075] = undefined               
            } 
        })
        //75
        $scope.$watch('item.obj[2077]', function(e) {
            if (e == true) {
                $scope.item.obj[2081] = undefined
                $scope.item.obj[2078] = undefined
                $scope.item.obj[2079] = undefined
                $scope.item.obj[2080] = undefined               
            } 
        })
        $scope.$watch('item.obj[2078]', function(e) {
            if (e == true) {
                $scope.item.obj[2077] = undefined
                $scope.item.obj[2081] = undefined
                $scope.item.obj[2079] = undefined
                $scope.item.obj[2080] = undefined               
            } 
        })
        $scope.$watch('item.obj[2079]', function(e) {
            if (e == true) {
                $scope.item.obj[2077] = undefined
                $scope.item.obj[2078] = undefined
                $scope.item.obj[2081] = undefined
                $scope.item.obj[2080] = undefined               
            } 
        })
        $scope.$watch('item.obj[2080]', function(e) {
            if (e == true) {
                $scope.item.obj[2077] = undefined
                $scope.item.obj[2078] = undefined
                $scope.item.obj[2079] = undefined
                $scope.item.obj[2081] = undefined               
            } 
        })        
        $scope.$watch('item.obj[2081]', function(e) {
            if (e == true) {
                $scope.item.obj[2077] = undefined
                $scope.item.obj[2078] = undefined
                $scope.item.obj[2079] = undefined
                $scope.item.obj[2080] = undefined               
            } 
        })

        //76
        $scope.$watch('item.obj[2082]', function(e) {
            if (e == true) {
                $scope.item.obj[2086] = undefined
                $scope.item.obj[2083] = undefined
                $scope.item.obj[2084] = undefined
                $scope.item.obj[2085] = undefined               
            } 
        })
        $scope.$watch('item.obj[2083]', function(e) {
            if (e == true) {
                $scope.item.obj[2082] = undefined
                $scope.item.obj[2086] = undefined
                $scope.item.obj[2084] = undefined
                $scope.item.obj[2085] = undefined               
            } 
        })
        $scope.$watch('item.obj[2084]', function(e) {
            if (e == true) {
                $scope.item.obj[2082] = undefined
                $scope.item.obj[2083] = undefined
                $scope.item.obj[2086] = undefined
                $scope.item.obj[2085] = undefined               
            } 
        })
        $scope.$watch('item.obj[2085]', function(e) {
            if (e == true) {
                $scope.item.obj[2082] = undefined
                $scope.item.obj[2083] = undefined
                $scope.item.obj[2084] = undefined
                $scope.item.obj[2086] = undefined               
            } 
        })        
        $scope.$watch('item.obj[2086]', function(e) {
            if (e == true) {
                $scope.item.obj[2082] = undefined
                $scope.item.obj[2083] = undefined
                $scope.item.obj[2084] = undefined
                $scope.item.obj[2085] = undefined               
            } 
        })

        //77
        $scope.$watch('item.obj[2087]', function(e) {
            if (e == true) {
                $scope.item.obj[2091] = undefined
                $scope.item.obj[2088] = undefined
                $scope.item.obj[2089] = undefined
                $scope.item.obj[2090] = undefined               
            } 
        })
        $scope.$watch('item.obj[2088]', function(e) {
            if (e == true) {
                $scope.item.obj[2087] = undefined
                $scope.item.obj[2091] = undefined
                $scope.item.obj[2089] = undefined
                $scope.item.obj[2090] = undefined               
            } 
        })
        $scope.$watch('item.obj[2089]', function(e) {
            if (e == true) {
                $scope.item.obj[2087] = undefined
                $scope.item.obj[2088] = undefined
                $scope.item.obj[2091] = undefined
                $scope.item.obj[2090] = undefined               
            } 
        })
        $scope.$watch('item.obj[2090]', function(e) {
            if (e == true) {
                $scope.item.obj[2087] = undefined
                $scope.item.obj[2088] = undefined
                $scope.item.obj[2089] = undefined
                $scope.item.obj[2091] = undefined               
            } 
        })        
        $scope.$watch('item.obj[2091]', function(e) {
            if (e == true) {
                $scope.item.obj[2087] = undefined
                $scope.item.obj[2088] = undefined
                $scope.item.obj[2089] = undefined
                $scope.item.obj[2090] = undefined               
            } 
        })

        //78
        $scope.$watch('item.obj[2092]', function(e) {
            if (e == true) {
                $scope.item.obj[2096] = undefined
                $scope.item.obj[2093] = undefined
                $scope.item.obj[2094] = undefined
                $scope.item.obj[2095] = undefined               
            } 
        })
        $scope.$watch('item.obj[2093]', function(e) {
            if (e == true) {
                $scope.item.obj[2092] = undefined
                $scope.item.obj[2096] = undefined
                $scope.item.obj[2094] = undefined
                $scope.item.obj[2095] = undefined               
            } 
        })
        $scope.$watch('item.obj[2094]', function(e) {
            if (e == true) {
                $scope.item.obj[2092] = undefined
                $scope.item.obj[2093] = undefined
                $scope.item.obj[2096] = undefined
                $scope.item.obj[2095] = undefined               
            } 
        })
        $scope.$watch('item.obj[2095]', function(e) {
            if (e == true) {
                $scope.item.obj[2092] = undefined
                $scope.item.obj[2093] = undefined
                $scope.item.obj[2094] = undefined
                $scope.item.obj[2096] = undefined               
            } 
        })
        $scope.$watch('item.obj[2096]', function(e) {
            if (e == true) {
                $scope.item.obj[2092] = undefined
                $scope.item.obj[2093] = undefined
                $scope.item.obj[2094] = undefined
                $scope.item.obj[2095] = undefined               
            } 
        })


        //79
        $scope.$watch('item.obj[2097]', function(e) {
            if (e == true) {
                $scope.item.obj[2098] = undefined
                $scope.item.obj[2099] = undefined
                $scope.item.obj[2100] = undefined
                $scope.item.obj[2101] = undefined               
            } 
        })
        $scope.$watch('item.obj[2098]', function(e) {
            if (e == true) {
                $scope.item.obj[2097] = undefined
                $scope.item.obj[2099] = undefined
                $scope.item.obj[2100] = undefined
                $scope.item.obj[2101] = undefined               
            } 
        })
        $scope.$watch('item.obj[2099]', function(e) {
            if (e == true) {
                $scope.item.obj[2098] = undefined
                $scope.item.obj[2097] = undefined
                $scope.item.obj[2100] = undefined
                $scope.item.obj[2101] = undefined               
            } 
        })
        $scope.$watch('item.obj[2100]', function(e) {
            if (e == true) {
                $scope.item.obj[2098] = undefined
                $scope.item.obj[2099] = undefined
                $scope.item.obj[2097] = undefined
                $scope.item.obj[2101] = undefined               
            } 
        })
        $scope.$watch('item.obj[2101]', function(e) {
            if (e == true) {
                $scope.item.obj[2098] = undefined
                $scope.item.obj[2099] = undefined
                $scope.item.obj[2100] = undefined
                $scope.item.obj[2097] = undefined               
            } 
        })

        //80
        $scope.$watch('item.obj[2102]', function(e) {
            if (e == true) {
                $scope.item.obj[2103] = undefined
                $scope.item.obj[2104] = undefined
                $scope.item.obj[2105] = undefined
                $scope.item.obj[2106] = undefined               
            } 
        })
        $scope.$watch('item.obj[2103]', function(e) {
            if (e == true) {
                $scope.item.obj[2102] = undefined
                $scope.item.obj[2104] = undefined
                $scope.item.obj[2105] = undefined
                $scope.item.obj[2106] = undefined               
            } 
        })
        $scope.$watch('item.obj[2104]', function(e) {
            if (e == true) {
                $scope.item.obj[2103] = undefined
                $scope.item.obj[2102] = undefined
                $scope.item.obj[2105] = undefined
                $scope.item.obj[2106] = undefined               
            } 
        })
        $scope.$watch('item.obj[2105]', function(e) {
            if (e == true) {
                $scope.item.obj[2103] = undefined
                $scope.item.obj[2104] = undefined
                $scope.item.obj[2102] = undefined
                $scope.item.obj[2106] = undefined               
            } 
        })
        $scope.$watch('item.obj[2106]', function(e) {
            if (e == true) {
                $scope.item.obj[2103] = undefined
                $scope.item.obj[2104] = undefined
                $scope.item.obj[2105] = undefined
                $scope.item.obj[2102] = undefined               
            } 
        })
        
        //81
        $scope.$watch('item.obj[2107]', function(e) {
            if (e == true) {
                $scope.item.obj[2108] = undefined
                $scope.item.obj[2109] = undefined
                $scope.item.obj[2110] = undefined
                $scope.item.obj[2111] = undefined               
            } 
        })
        $scope.$watch('item.obj[2108]', function(e) {
            if (e == true) {
                $scope.item.obj[2107] = undefined
                $scope.item.obj[2109] = undefined
                $scope.item.obj[2110] = undefined
                $scope.item.obj[2111] = undefined               
            } 
        })
        $scope.$watch('item.obj[2109]', function(e) {
            if (e == true) {
                $scope.item.obj[2108] = undefined
                $scope.item.obj[2107] = undefined
                $scope.item.obj[2110] = undefined
                $scope.item.obj[2111] = undefined               
            } 
        })
        $scope.$watch('item.obj[2110]', function(e) {
            if (e == true) {
                $scope.item.obj[2108] = undefined
                $scope.item.obj[2109] = undefined
                $scope.item.obj[2107] = undefined
                $scope.item.obj[2111] = undefined               
            } 
        })
        $scope.$watch('item.obj[2111]', function(e) {
            if (e == true) {
                $scope.item.obj[2108] = undefined
                $scope.item.obj[2109] = undefined
                $scope.item.obj[2110] = undefined
                $scope.item.obj[2107] = undefined               
            } 
        })

        //82
        $scope.$watch('item.obj[2112]', function(e) {
            if (e == true) {
                $scope.item.obj[2113] = undefined
                $scope.item.obj[2114] = undefined
                $scope.item.obj[2115] = undefined
                $scope.item.obj[2116] = undefined               
            } 
        })
        $scope.$watch('item.obj[2113]', function(e) {
            if (e == true) {
                $scope.item.obj[2112] = undefined
                $scope.item.obj[2114] = undefined
                $scope.item.obj[2115] = undefined
                $scope.item.obj[2116] = undefined               
            } 
        })
        $scope.$watch('item.obj[2114]', function(e) {
            if (e == true) {
                $scope.item.obj[2113] = undefined
                $scope.item.obj[2112] = undefined
                $scope.item.obj[2115] = undefined
                $scope.item.obj[2116] = undefined               
            } 
        })
        $scope.$watch('item.obj[2115]', function(e) {
            if (e == true) {
                $scope.item.obj[2113] = undefined
                $scope.item.obj[2114] = undefined
                $scope.item.obj[2112] = undefined
                $scope.item.obj[2116] = undefined               
            } 
        })
        $scope.$watch('item.obj[2116]', function(e) {
            if (e == true) {
                $scope.item.obj[2113] = undefined
                $scope.item.obj[2114] = undefined
                $scope.item.obj[2115] = undefined
                $scope.item.obj[2112] = undefined               
            } 
        })

        //83
        $scope.$watch('item.obj[2117]', function(e) {
            if (e == true) {
                $scope.item.obj[2118] = undefined
                $scope.item.obj[2119] = undefined
                $scope.item.obj[2120] = undefined
                $scope.item.obj[2121] = undefined               
            } 
        })
        $scope.$watch('item.obj[2118]', function(e) {
            if (e == true) {
                $scope.item.obj[2117] = undefined
                $scope.item.obj[2119] = undefined
                $scope.item.obj[2120] = undefined
                $scope.item.obj[2121] = undefined               
            } 
        })
        $scope.$watch('item.obj[2119]', function(e) {
            if (e == true) {
                $scope.item.obj[2118] = undefined
                $scope.item.obj[2117] = undefined
                $scope.item.obj[2120] = undefined
                $scope.item.obj[2121] = undefined               
            } 
        })
        $scope.$watch('item.obj[2120]', function(e) {
            if (e == true) {
                $scope.item.obj[2118] = undefined
                $scope.item.obj[2119] = undefined
                $scope.item.obj[2117] = undefined
                $scope.item.obj[2121] = undefined               
            } 
        })
        $scope.$watch('item.obj[2121]', function(e) {
            if (e == true) {
                $scope.item.obj[2118] = undefined
                $scope.item.obj[2119] = undefined
                $scope.item.obj[2120] = undefined
                $scope.item.obj[2117] = undefined               
            } 
        })
        


        function LoadCacheHelper() {
            var chacePeriode = cacheHelper.get('cacheRMelektronik');
            if (chacePeriode != undefined) {
                //var arrPeriode = chacePeriode.split(':');
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[13]
                $scope.cc.tglLahir = chacePeriode[14]
                $scope.cc.norec_emr = '-'
                $scope.cc.jenisemr = "pemeriksaanpsikogram"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                init()
            }
        }
        function clearAll() {
            $scope.item = {}
        }
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pemeriksaanpsikogram", true).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                if (dat.data.data.length > 0) {
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 893;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                } else {
                    medifirstService.get('emr/get-image-from-jenis-surat?').then(function(dat) {
                        debugger
                        $scope.user.poto = dat.data[0].template
                        $scope.user.poto2 = dat.data[1].template
                    })
                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                debugger
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[68] = $scope.now
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            // if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkorNutrisi(datass)
                            // }


                        }
                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        // if (dataLoad[i].emrdfk == "1270") {
                        //     $scope.user.poto = dataLoad[i].value
                        // }
                        // if (dataLoad[i].emrdfk == "1271") {
                        //     $scope.user.poto2 = dataLoad[i].value
                        // }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1580") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                    }

                }
            })
        }       
        
        $scope.simpan = function() {
            debugger
            var user = medifirstService.getPegawaiLogin();
            $scope.item.obj[1504] = moment($scope.now).format('YYYY-MM-DD')           
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 1580) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })                   
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }

            
            $scope.cc.jenisemr = 'pemeriksaanpsikogram'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                        init()
                        // init2()
                        // init3()
                    //     init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
        }
        $scope.cetak = function() {
            debugger
                if (nomorEMR == '') return
                var kiri = $scope.user.poto;
                var kanan = $scope.user.poto2;
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 1261; i <= 1270 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 1272; i <= 1275 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                arrPush[x].value = dataLoad[i].value
                            }
                        }
                    }

                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norm","dataLoad","namaPasien","jeniskelamin","umur","ruangan","kiri","kanan"],
                    "paramValue": [$scope.cc.nocm,arrPush,$scope.cc.namapasien,$scope.cc.jeniskelamin,$scope.cc.umur,$scope.cc.namaruangan,kiri,kanan],
                    "paramType" : ["","","","","","","",""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200){
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/poli-jiwa.pdf');
                }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/poli-jiwa.pdf');
                }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/poli-jiwa.pdf');
                }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/poli-jiwa.pdf');
                }else{
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/poli-jiwa.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));	
        }
    }
])
})