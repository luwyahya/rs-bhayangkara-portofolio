define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianAwalKeperawatanIgdCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.dataSelectedVitalSign = {};
        $scope.dataSelectedTambah = {}
        $scope.cc = {};
        $scope.item.obj = []
        const dataTambah = []
        var dataLoad = []
        $scope.cc.emrfk = 872;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        // var nomorEMR = '-'
        var nomorEMR = ''
        $scope.lainnya = false;
        $scope.nilai = false;
        $scope.privasi = false;
        $scope.lihat = false;
        $scope.ya = false;
        $scope.sebutkan = false;
        $scope.lainnyaketergantungan = false;
        $scope.lainnyakebiasaan = false
        var lanjut = false;
        var totalNilai = 0;
        LoadCacheHelper()
        loadCombo()
        loadRekon()

        
        $scope.listNyeriAnak = [
            {
                "id": 6, "nama": "Hurts", "detail": [
                { "id": 74, "nama": "No Hurt", "descNilai": 4 },
                { "id": 75, "nama": "Hurts Little Bit", "descNilai": 6 }, 
                { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                { "id": 76, "nama": "Hurts Even More", "descNilai": 8 }, 
                { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                { "id": 77, "nama": "Hurts whorts", "descNilai": 10 }]
            }
        ]
        $scope.listSkorWong = [{
            "id": 7, "nama": "Score ",
            "detail": [
                { "id": 2510, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                { "id": 2511, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                { "id": 2512, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                { "id": 2513, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                { "id": 2514, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                { "id": 2515, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
            ]
        }]
        $('.cb').on('change', function(){ // on change of state
            UpdateCost();
         });
         function UpdateCost() {
           var sum = 0;
           var gn, elem;
           $('.cb:checked').each(function(){
              sum += Number($(this).val()); 
           })
          
          $('#totalcost').val(sum.toFixed(0));
          cekSkor(sum)
         }
        function cekSkor(nilai) {
            debugger
            if (nilai >= 2) {
                if ($scope.item.obj[2532] != true) {
                    $scope.item.obj[2532] = true
                    $scope.item.obj[2496] = true
                }
            } else {
                $scope.item.obj[2532] = false
                $scope.item.obj[2496] = false
            }
        }
        $scope.$watch('item.obj[2455]', function(e) {
            if (e == true) {
                $scope.lainnya = true;
                $scope.item.obj[2454] = undefined
                $scope.item.obj[2453] = undefined
            } else {
                $scope.lainnya = false;
            }
        })

        $scope.$watch('item.obj[2454]', function(e) {
            if (e == true) {
                $scope.item.obj[2455] = undefined
                $scope.item.obj[2453] = undefined
            } 
        })

        $scope.$watch('item.obj[2453]', function(e) {
            if (e == true) {
                $scope.item.obj[2455] = undefined
                $scope.item.obj[2454] = undefined
            } 
        })

        $scope.$watch('item.obj[2459]', function(e) {
            if (e == true) {
                $scope.nilai = true
            } else {
                $scope.nilai = false
            } 
        })

        $scope.$watch('item.obj[2461]', function(e) {
            if (e == true) {
                $scope.privasi = true
            } else {
                $scope.privasi = false
            }
        })

        $scope.$watch('item.obj[2479]', function(e) {
            if (e == true) {
                $scope.lihat = true
                $scope.item.obj[2480] = undefined
            } else {
                $scope.lihat = false
            }
        })

        $scope.$watch('item.obj[2480]', function(e) {
            if (e == true) {
                $scope.lihat = false
                $scope.item.obj[2479] = undefined
            }
        })

        $scope.$watch('item.obj[2484]', function(e) {
            if (e == true) {
                $scope.ya = true
            } else {
                $scope.ya = false
            }
        })

        $scope.$watch('item.obj[2527]', function(e) {
            if (e == true) {
                $scope.sebutkan = true
            } else {
                $scope.sebutkan = false
            }
        })

        $scope.$watch('item.obj[2500]', function(e) {
            if (e == true) {
                $scope.lainnyaketergantungan = true; 
                $scope.item.obj[2531] = true              
            } else {
                $scope.lainnyaketergantungan = false;
                $scope.item.obj[2531] = false;
            }
        })

        $scope.$watch('item.obj[2510]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '0 - 1'              
            } else {
                $scope.item.obj[2518] = undefined
            }
        })
        $scope.$watch('item.obj[2511]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '2 - 3'              
            } else {
                $scope.item.obj[2518] = undefined
            }
        })
        $scope.$watch('item.obj[2512]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '4 - 5'              
            } else {
                $scope.item.obj[2518] = undefined
            }
        })
        $scope.$watch('item.obj[2513]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '6 - 7'              
            } else {
                $scope.item.obj[2518] = undefined
            }
        })
        $scope.$watch('item.obj[2514]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '8 - 9'              
            } else {
                $scope.item.obj[2518] = undefined
            }
        })
        $scope.$watch('item.obj[2515]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '10'              
            } else {
                $scope.item.obj[2518] = undefined
            }
        })
        $scope.$watch('item.obj[2553]', function(e) {
            if (e == true) {
                $scope.item.obj[2551] = false
                $scope.item.obj[2552] = false
                $scope.lainnyakebiasaan = true            
            } else {
                // $scope.item.obj[2553] = false
                $scope.lainnyakebiasaan = false
            }
        })
        $scope.$watch('item.obj[2552]', function(e) {
            if (e == true) {
                $scope.item.obj[2551] = false
                $scope.item.obj[2553] = false         
            } else {
                // $scope.item.obj[2553] = false
            }
        })
        $scope.$watch('item.obj[2551]', function(e) {
            if (e == true) {
                $scope.item.obj[2552] = false
                $scope.item.obj[2553] = false         
            } else {
                // $scope.item.obj[2553] = false
            }
        })
        $scope.$watch('item.obj[2501]', function(e) {
            if (e == true) {
                $scope.item.obj[2502] = false
            }
            cekSkriningResikoJatuh()
        })
        $scope.$watch('item.obj[2502]', function(e) {
            if (e == true) {
                $scope.item.obj[2501] = false
            }
            cekSkriningResikoJatuh()
        })
        $scope.$watch('item.obj[2503]', function(e) {
            if (e == true) {
                $scope.item.obj[2504] = false
            }
            cekSkriningResikoJatuh()
        })
        $scope.$watch('item.obj[2504]', function(e) {
            if (e == true) {
                $scope.item.obj[2503] = false
            }
            cekSkriningResikoJatuh()
        })
        $scope.$watch('item.obj[2555]', function(e) {
            if (e == true) {
                $scope.item.obj[2556] = false
                $scope.item.obj[2557] = false
                $scope.item.obj[2558] = false
            }
        })
        $scope.$watch('item.obj[2556]', function(e) {
            if (e == true) {
                $scope.item.obj[2555] = false
                $scope.item.obj[2557] = false
                $scope.item.obj[2558] = false
            }
        })
        $scope.$watch('item.obj[2557]', function(e) {
            if (e == true) {
                $scope.item.obj[2556] = false
                $scope.item.obj[2555] = false
                $scope.item.obj[2558] = false
            }
        })
        $scope.$watch('item.obj[2558]', function(e) {
            if (e == true) {
                $scope.item.obj[2556] = false
                $scope.item.obj[2555] = false
                $scope.item.obj[2557] = false
            }
        })
        $scope.$watch('item.obj[2559]', function(e) {
            if (e == true) {
                $scope.item.obj[2560] = false
                $scope.item.obj[2561] = false
                $scope.item.obj[2562] = false
            }
        })
        $scope.$watch('item.obj[2560]', function(e) {
            if (e == true) {
                $scope.item.obj[2559] = false
                $scope.item.obj[2561] = false
                $scope.item.obj[2562] = false
            }
        })
        $scope.$watch('item.obj[2561]', function(e) {
            if (e == true) {
                $scope.item.obj[2559] = false
                $scope.item.obj[2560] = false
                $scope.item.obj[2562] = false
            }
        })
        $scope.$watch('item.obj[2562]', function(e) {
            if (e == true) {
                $scope.item.obj[2559] = false
                $scope.item.obj[2560] = false
                $scope.item.obj[2561] = false
            }
        })
        $scope.$watch('item.obj[2563]', function(e) {
            if (e == true) {
                $scope.item.obj[2564] = false
                $scope.item.obj[2565] = false
                $scope.item.obj[2566] = false
            }
        })
        $scope.$watch('item.obj[2564]', function(e) {
            if (e == true) {
                $scope.item.obj[2563] = false
                $scope.item.obj[2565] = false
                $scope.item.obj[2566] = false
            }
        })
        $scope.$watch('item.obj[2565]', function(e) {
            if (e == true) {
                $scope.item.obj[2563] = false
                $scope.item.obj[2564] = false
                $scope.item.obj[2566] = false
            }
        })
        $scope.$watch('item.obj[2566]', function(e) {
            if (e == true) {
                $scope.item.obj[2563] = false
                $scope.item.obj[2564] = false
                $scope.item.obj[2565] = false
            }
        })
        $scope.$watch('item.obj[2567]', function(e) {
            if (e == true) {
                $scope.item.obj[2568] = false
                $scope.item.obj[2569] = false
                $scope.item.obj[2570] = false
            }
        })
        $scope.$watch('item.obj[2568]', function(e) {
            if (e == true) {
                $scope.item.obj[2567] = false
                $scope.item.obj[2569] = false
                $scope.item.obj[2570] = false
            }
        })
        $scope.$watch('item.obj[2569]', function(e) {
            if (e == true) {
                $scope.item.obj[2568] = false
                $scope.item.obj[2567] = false
                $scope.item.obj[2570] = false
            }
        })
        $scope.$watch('item.obj[2570]', function(e) {
            if (e == true) {
                $scope.item.obj[2568] = false
                $scope.item.obj[2569] = false
                $scope.item.obj[2567] = false
            }
        })
        $scope.$watch('item.obj[2571]', function(e) {
            if (e == true) {
                $scope.item.obj[2572] = false
                $scope.item.obj[2573] = false
                $scope.item.obj[2574] = false
            }
        })
        $scope.$watch('item.obj[2572]', function(e) {
            if (e == true) {
                $scope.item.obj[2571] = false
                $scope.item.obj[2573] = false
                $scope.item.obj[2574] = false
            }
        })
        $scope.$watch('item.obj[2573]', function(e) {
            if (e == true) {
                $scope.item.obj[2572] = false
                $scope.item.obj[2571] = false
                $scope.item.obj[2574] = false
            }
        })
        $scope.$watch('item.obj[2574]', function(e) {
            if (e == true) {
                $scope.item.obj[2572] = false
                $scope.item.obj[2573] = false
                $scope.item.obj[2571] = false
            }
        })
        $scope.$watch('item.obj[2576]', function(e) {
            if (e == true) {
                $scope.item.obj[2577] = false;               
            }
        })
        $scope.$watch('item.obj[2577]', function(e) {
            if (e == true) {
                $scope.item.obj[2576] = false;               
            }
        })
        $scope.$watch('item.obj[2578]', function(e) {
            if (e == true) {
                $scope.item.obj[2579] = false;               
            }
        })
        $scope.$watch('item.obj[2579]', function(e) {
            if (e == true) {
                $scope.item.obj[2578] = false;               
            }
        })
        $scope.$watch('item.obj[2580]', function(e) {
            if (e == true) {
                $scope.item.obj[2581] = false;               
            }
        })
        $scope.$watch('item.obj[2581]', function(e) {
            if (e == true) {
                $scope.item.obj[2580] = false;               
            }
        })
        $scope.$watch('item.obj[2582]', function(e) {
            if (e == true) {
                $scope.item.obj[2583] = false;               
            }
        })
        $scope.$watch('item.obj[2583]', function(e) {
            if (e == true) {
                $scope.item.obj[2582] = false;               
            }
        })
        $scope.$watch('item.obj[2584]', function(e) {
            if (e == true) {
                $scope.item.obj[2585] = false;               
            }
        })
        $scope.$watch('item.obj[2585]', function(e) {
            if (e == true) {
                $scope.item.obj[2584] = false;               
            }
        })
        $scope.$watch('item.obj[2507]', function(e) {
            if (e == true) {
                $scope.item.obj[2530] = true;
            }
        })

        $scope.$watch('item.obj[2482]', function(e) {
            if (e == true) {
                $scope.item.obj[2483] = false
                $scope.item.obj[2484] = false
            } 
        })

        $scope.$watch('item.obj[2483]', function(e) {
            if (e == true) {
                $scope.item.obj[2482] = false
                $scope.item.obj[2484] = false
            } 
        })

        $scope.$watch('item.obj[2484]', function(e) {
            if (e == true) {
                $scope.item.obj[2483] = false
                $scope.item.obj[2482] = false
            } 
        })

        $scope.$watch('item.obj[2485]', function(e) {
            if (e == true) {
                $scope.item.obj[2486] = false
                $scope.item.obj[2487] = false
                $scope.item.obj[2488] = false
            } 
        })

        $scope.$watch('item.obj[2486]', function(e) {
            if (e == true) {
                $scope.item.obj[2485] = false
                $scope.item.obj[2487] = false
                $scope.item.obj[2488] = false
            } 
        })

        $scope.$watch('item.obj[2487]', function(e) {
            if (e == true) {
                $scope.item.obj[2486] = false
                $scope.item.obj[2485] = false
                $scope.item.obj[2488] = false
            } 
        })

        $scope.$watch('item.obj[2488]', function(e) {
            if (e == true) {
                $scope.item.obj[2486] = false
                $scope.item.obj[2487] = false
                $scope.item.obj[2485] = false
            } 
        })

        $scope.$watch('item.obj[2489]', function(e) {
            if (e == true) {
                $scope.item.obj[2490] = false
            } 
        })

        $scope.$watch('item.obj[2490]', function(e) {
            if (e == true) {
                $scope.item.obj[2489] = false
            } 
        })

        function cekSkriningResikoJatuh() {
            if ($scope.item.obj[2501] == true && $scope.item.obj[2503] == true) {
                $scope.item.obj[2507] = true
                $scope.item.obj[2506] = false
                $scope.item.obj[2505] = false
            } else if ($scope.item.obj[2501] == true && $scope.item.obj[2504] == true) {
                $scope.item.obj[2506] = true
                $scope.item.obj[2505] = false
                $scope.item.obj[2507] = false
            } else if ($scope.item.obj[2502] == true && $scope.item.obj[2503] == true) {
                $scope.item.obj[2506] = true
                $scope.item.obj[2505] = false
                $scope.item.obj[2507] = false
            } else if ($scope.item.obj[2502] == true && $scope.item.obj[2504] == true) {
                $scope.item.obj[2506] = false
                $scope.item.obj[2505] = true
                $scope.item.obj[2507] = false
            } else {
                $scope.item.obj[2506] = false
                $scope.item.obj[2505] = false
                $scope.item.obj[2507] = false
            }
        }

        // $scope.$watch('item.obj[1179]', function(e) {
        //      
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 0
        //     } else if (e == false) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 0
        //     }
        // })
        
        // $scope.$watch('item.obj[1180]', function(e) {
        //      
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 2
        //     } else if (e == false) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 2
        //     }
        // })
        
        // $scope.$watch('item.obj[1182]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 1
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 1
        //     }
        // })
        
        // $scope.$watch('item.obj[1183]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 2
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 2
        //     }
        // })
        
        // $scope.$watch('item.obj[1184]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 3
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 3
        //     }
        // })
        
        // $scope.$watch('item.obj[1185]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 4
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 4
        //     }
        // })
        
        // $scope.$watch('item.obj[1186]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 0
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 0
        //     }
        // })
        
        // $scope.$watch('item.obj[1187]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 1
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 1
        //     }
        // })

        $scope.$watch('item.obj[2510]', function(e) {
            if (e == true) {
                $scope.item.obj[2518] = '0 - 1' 
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
                $scope.item.obj[2529] = false
                $scope.item.obj[2529] = false
            } else {
                $scope.item.obj[2529] = false
            }
        })
        $scope.$watch('item.obj[2511]', function(e) {
            if (e == true) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2518] = '2 - 3' 
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = false
            } else {
                $scope.item.obj[2529] = false
            }
        })
        $scope.$watch('item.obj[2512]', function(e) {
            if (e == true) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2518] = '4 - 5' 
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = true
            } else {
                $scope.item.obj[2529] = false
            }
        })
        $scope.$watch('item.obj[2513]', function(e) {
            if (e == true) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2518] = '6 - 7' 
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = true
            } else {
                $scope.item.obj[2529] = false
            }
        })
        $scope.$watch('item.obj[2514]', function(e) {
            if (e == true) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[2518] = '8 - 9' 
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = true
            } else {
                $scope.item.obj[2529] = false
            }
        })
        $scope.$watch('item.obj[2515]', function(e) {
            if (e == true) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = true
                $scope.item.obj[2518] = '10' 
                $scope.item.obj[2529] = true
            } else {
                $scope.item.obj[2529] = false
            }
        })
        $scope.getSkalaNyeri = function (data, stat) {
             
            $scope.item.obj[2518] = undefined
            $scope.activeStatus = stat.descNilai
            var nilai = stat.descNilai
            if (nilai >= 0 && nilai <= 1) {
                $scope.item.obj[2510] = true
                $scope.item.obj[2518] = '0 - 1' 
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
                $scope.item.obj[2529] = false
            }
            if (nilai >= 2 && nilai <= 3) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = true
                $scope.item.obj[2518] = '2 - 3' 
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = false
            }
            if (nilai >= 4 && nilai <= 5) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = true
                $scope.item.obj[2518] = '4 - 5' 
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = true
            }
            if (nilai >= 6 && nilai <= 7) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = true
                $scope.item.obj[2518] = '6 - 7' 
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = true
            }
            if (nilai >= 8 && nilai <= 9) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = true
                $scope.item.obj[2518] = '8 - 9' 
                $scope.item.obj[2515] = false
                $scope.item.obj[2529] = true
            }

            if (nilai == 10) {
                $scope.item.obj[2510] = false
                $scope.item.obj[2511] = false
                $scope.item.obj[2512] = false
                $scope.item.obj[2513] = false
                $scope.item.obj[2514] = false
                $scope.item.obj[2515] = true
                $scope.item.obj[2518] = '10' 
                $scope.item.obj[2529] = true
            }

        }

        // $scope.$watch('item.obj[1149]', function(e) {
        //      
        //     if (e != undefined) {
        //         medifirstService.get('emr/get-combo-diagnosa-pengkajian?kodeDiagnosa=' + e).then(function(dat) {
        //              
        //             $scope.listDiagnosa = dat.data.diagnosa
        //         })
        //     } else {
        //         loadCombo()
        //     }
        // })

        function loadCombo() {
            // medifirstService.get('emr/get-combo-diagnosa-pengkajian?').then(function(dat) {
            //     $scope.listDiagnosa = dat.data.diagnosa
            // })
             
            if ($scope.cc.objectruanganfk == 8 || $scope.cc.objectruanganfk == 250 || $scope.cc.objectruanganfk == 268 || $scope.cc.objectruanganfk == 130 || $scope.cc.objectruanganfk == 446 || $scope.cc.objectruanganfk == 97 || $scope.cc.objectruanganfk == 89 || $scope.cc.objectruanganfk == 459) {
                medifirstService.get("emr/get-combo-diagnosa-keperawatan-new?idRuangan=" + $scope.cc.objectruanganfk).then(function(data) {
                    $scope.listDiagnosa = data.data;
                })
            } else {
                medifirstService.getPart("emr/get-combo-diagnosa-keperawatan", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                })
            }
        //     medifirstService.getPart("emr/get-combo-diagnosa-keperawatan-new?idRuangan=" + $scope.cc.objectruanganfk, true, true, 10).then(function(data) {
        //          
        //         if (data.length > 0) {
        //             $scope.listDiagnosa = data;
        //         } else {
        //             medifirstService.getPart("emr/get-combo-diagnosa-keperawatan", true, true, 10).then(function(data) {
        //                 $scope.listDiagnosa = data;
        //             })
        //         }
        //    }); 
           $scope.listKesadaran = [
            { text: "Compos Mentis", value: 1 },
            { text: "Apatis", value: 2 },
            { text: "Delirium", value: 3 },
            { text: "Somnolent", value: 4 },
            { text: "Sopor", value: 5 },
            { text: "Semi Coma", value: 6 },
            { text: "Coma", value: 7 }
        ];
            $scope.listGcs = [
                { text: "E", value: 1},
                { text: "M", value: 2},
                { text: "V", value: 3}
            ];
            $scope.listGcsE = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4}
            ];
            $scope.listGcsM = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "6", value: 6}
            ];
            $scope.listGcsV = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5}
            ];
            medifirstService.get('emr/get-combo-anyar-hehe').then(function(dat) {
                 
                $scope.listAgama = dat.data.agama
                $scope.listPendidikan = dat.data.pendidikan
                $scope.listPekerjaan = dat.data.pekerjaan
            })
        }

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
                $scope.cc.jenisemr = "pengkajianawalkeperawatanigd"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                 
                $scope.item.obj[2450] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD')
                $scope.item.obj[2451] = moment($scope.now).format('HH:mm')
                $scope.item.obj[2548] = { id: chacePeriode[26], agama: chacePeriode[27]}
                $scope.item.obj[2549] = { id: chacePeriode[28], pendidikan: chacePeriode[29]}
                $scope.item.obj[2550] = { id: chacePeriode[30], pekerjaan: chacePeriode[31]}
                debugger;
                init()
                cekVitalSign()
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianawalkeperawatanigd", true).then(function(dat) {
                $scope.isRouteLoading = false
                 
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'pengkajianawalkeperawatanigd') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 872;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        cekDiagnosa()
                    }
                    // if (dat.data.data[0].jenisemr == 'pengkajianawal') {
                    //     $scope.noemr = dat.data.data[0].noemr
                    //     $scope.cc.norec_emr = dat.data.data[0].noemr
                    //         nomorEMRSS = ''
                    //         nomorEMRSS = dat.data.data[0].noemr
                    //         nomorEMR = nomorEMRSS
                    //         $scope.cc.emrfk = 674;
                    //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    // } else {
                    //     cekDiagnosa()
                    // }
                } else {
                    cekDiagnosa()
                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                 
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
                            if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2452") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2471") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "890") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "891") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2539") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2540") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2541") {
                             
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2550") {
                             
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], pekerjaan: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2549") {
                             
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], pendidikan: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2548") {
                             
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], agama: str }

                        }
                        // if (dataLoad[i].type == "combobox") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        // }
                        if (dataLoad[i].type == "photo") {
                            $scope.user.poto = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == "2491") {
                            totalcost[0].value = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == "2575") {
                            totalcost2[0].value = dataLoad[i].value
                        }
                    }

                }
            })
            cekVitalSign()
        }
        $scope.Save = function() {
             
            var user = medifirstService.getPegawaiLogin();
            $scope.item.obj[2535] = moment($scope.now).format('YYYY-MM-DD')
            $scope.item.obj[2536] = moment($scope.now).format('HH:mm:ss')
            $scope.item.obj[2537] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 2452) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namadiagnosa })
                    } else if (arrobj[i] == 2471) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 2539) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 2540) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 2541) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 2550) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].pekerjaan })
                    } else if (arrobj[i] == 2549) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].pendidikan })
                    } else if (arrobj[i] == 2548) {
                        debugger
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].agama })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }
            if (totalcost[0].value != "") {
                arrSave.push ({ id: "2491", values: totalcost[0].value})
            }
            if (totalcost2[0].value != "") {
                arrSave.push ({ id: "2575", values: totalcost2[0].value})
            }
            $scope.cc.jenisemr = 'pengkajianawalkeperawatanigd'
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
        $scope.Cetak = function () {
             
            if (nomorEMR == '') return
            var arrPush = []
            for (var i = 1147; i <= 1236 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            for (let i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "date") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD')
                }
                if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                    for (var x = 0; x <= arrPush.length - 1; x++) {
                        if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                            arrPush[x].value = dataLoad[i].value
                        }
                    }
                }
            }

                var nama = $scope.cc.namapasien
                var nocm = $scope.cc.nocm
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan

            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["dataLoad","nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan"],
                "paramValue": [arrPush,nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan],
                "paramType" : ["","","","","","","","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    //this.response is what you're looking for
                    // handler(this.response);
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                     ;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));	
        }
        function cekVitalSign() {
            medifirstService.get('emr/get-vital-sign-pengkajian?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                 
                if (dat.data.length > 0) {
                    for (let i = 0; i < dat.data.length; i++) {
                        if (dat.data[i].caption == 'Tekanan Darah') {
                            $scope.item.obj[2472] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Tinggi badan') {
                            $scope.item.obj[2477] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Berat Badan') {
                            $scope.item.obj[2478] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Suhu') {
                            $scope.item.obj[2475] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Nadi') {
                            $scope.item.obj[2473] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Pernapasan') {
                            $scope.item.obj[2476] = dat.data[i].value
                        } else if (dat.data[i].caption == 'kesadaran') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[2471] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang E') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[2539] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang M') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[2540] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang V') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[2541] = { value: res[0], text: res[1] }
                        }
                    }
                }
            })
        }
        // function cekDiagnosa() {
        //     medifirstService.get('emr/get-diagnosa-from-pengkajian-mata?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                 
        //         $scope.item.obj[1149] = { namadiagnosa: dat.data[0].value }
        //     })
        // }
        function loadRekon() {
            medifirstService.get('emr/get-rekonsiliasi-obat?norec=' + $scope.cc.norec_pd).then(function(dat) {
                for(let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1
                }
                $scope.sourceRekon = new kendo.data.DataSource({
                    data: dat.data,
                    length: dat.data.length,
                    pageSize: 20
                });
            })
			$scope.gridRekon = {
				toolbar: [{
					name: "create", text: "Input Baru",
					template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Input Baru</button>'
				},],
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "no", title: "No", width: 40 },
					{ field: "namaobat", title: "Nama Obat", width: 120 },
					{ field: "dosis", title: "Dosis", width: 120 },
					{ field: "frekuensi", title: "Frekuensi", width: 150 },
					{ field: "carapemberian", title: "Cara Pemberian", width: 120 },
					{ field: "pemberianterakhir", title: "Waktu Pemberian Terakhir", width: 120 },
					{ field: "tindaklanjut", title: "Tindak Lanjut", width: 150 },
					{ field: "perubahanaturanpakai", title: "Perubahan Aturan Pakai", width: 120 },
					// { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }, { name: "edit", text: "Edit", click: editData }], title: "&nbsp;", width: 150 }
				],
			};
        }
        $scope.hapusGridRekon = function() {
                
            if($scope.dataSelected==null || $scope.dataSelected=='undefined') {
                toastr.error("Pilih data yang akan dihapus");
                return;
            }

            var item = {
                "norec": $scope.dataSelected.norec
            }

            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Peringatan, Anda yakin akan menghapus data yang dipilih?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                medifirstService.post('emr/delete-rekonsiliasi-obat/delete', item).then(function(e) {
                                    clear()
                                    // init();
                                    loadRekon()
                                });
                            })

        }
        function clear() {
            $scope.item = {}

        }
        $scope.inputBaru = function() {
            jiahaha()
            $scope.popUpTambahRekonsiliasi.center().open()
        }
        function jiahaha() {
            if (dataTambah.length > 0) {
                for(let i = 0; i < dataTambah.length; i++) {
                    dataTambah[i].no = i + 1
                }
            }
            $scope.sourceTambah = new kendo.data.DataSource({
                data: dataTambah,
                length: dataTambah.length,
                pageSize: 20
            });
			$scope.gridTambah = {
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "no", title: "No", width: 40 },
					{ field: "namaobat", title: "Nama Obat", width: 120 },
					{ field: "dosis", title: "Dosis", width: 120 },
					{ field: "frekuensi", title: "Frekuensi", width: 150 },
					{ field: "carapemberian", title: "Cara Pemberian", width: 120 },
					{ field: "pemberianterakhir", title: "Waktu Pemberian Terakhir", width: 120 },
					{ field: "tindaklanjut", title: "Tindak Lanjut", width: 150 },
					{ field: "perubahanaturanpakai", title: "Perubahan Aturan Pakai", width: 120 },
				],
			};
        }
        $scope.simpanBohongan = function() {
            let waktu = undefined
            if ($scope.item.waktuPemberianTerakhir != undefined) {
                waktu = moment($scope.item.waktuPemberianTerakhir).format('YYYY-MM-DD 00:00:00')
            }
            dataTambah.push({namaobat: $scope.item.namaObat, dosis: $scope.item.dosis, frekuensi: $scope.item.frekuensi, carapemberian: $scope.item.caraPemberian, pemberianterakhir: waktu, tindaklanjut: $scope.item.tindakLanjut, perubahanaturanpakai: $scope.item.perubahanAturanPakai})
            delete $scope.item.namaObat
            delete $scope.item.dosis
            delete $scope.item.frekuensi
            delete $scope.item.caraPemberian
            delete $scope.item.waktuPemberianTerakhir
            delete $scope.item.tindakLanjut
            delete $scope.item.perubahanAturanPakai
            jiahaha()
        }
        $scope.hapusBohongan = function() {
            $scope.dataSelectedTambah
            for(let i = 0; i < dataTambah.length; i++) {
                if (dataTambah[i].no == $scope.dataSelectedTambah.no) {
                    delete dataTambah[i]
                }
            }
            dataTambah.length = dataTambah.length - 1
            jiahaha()
        }
        $scope.simpanBeneran = function() {
            let pegawaiid = JSON.parse(localStorage.getItem('pegawai')).id;
            if (dataTambah.length == 0) {
                toastr.error('Tambah Data Terlebih Dahulu !', 'Peringatan !')
                return
            }
            let objSave = {
                norec_pd: $scope.cc.norec_pd,
                data: dataTambah,
                idpegawai: pegawaiid
            }
            medifirstService.post('emr/save-rekonsiliasi-obat', objSave).then(function(e) {
                 
                if (e.status == 201) {
                    $scope.popUpTambahRekonsiliasi.close();
                    loadRekon()
                }
            })
        }
        $scope.cetakRekonObat = function() {
            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["norec_pd"],
                "paramValue": [$scope.cc.norec_pd],
                "paramType" : [""] // "paramType" : ["","date"] selain date, isinya kosong saja
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    //this.response is what you're looking for
                    // handler(this.response);
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                     ;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/formulirrekonsiliasiobat.pdf');
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));	
        }
        $scope.getVitalSign = function() {
            medifirstService.get('emr/get-vital-sign-2?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                 
                let vs = dat.data
                let tampungnoregis = vs[0].noregistrasifk
                let tampungtgl = vs[0].tgl
                const dataReal = [];
                let tinggibadan = ''
                let beratbadan = ''
                let nadi = ''
                let kesadaran = ''
                let spo2 = ''
                let keadaanumum = ''
                let e = ''
                let m = ''
                let v = ''
                let tekanandarah = ''
                let suhu = ''
                let pernapasan = ''
                for(let i = 0; i < vs.length; i++) {
                    if (tampungnoregis == vs[i].noregistrasifk) {
                        if (tampungtgl == vs[i].tgl) {
                            debugger
                            if (vs[i].tinggibadan != '') {
                                tinggibadan = vs[i].tinggibadan
                            }
                            if (vs[i].beratbadan != '') {
                                beratbadan = vs[i].beratbadan
                            }
                            if (vs[i].nadi != '') {
                                nadi = vs[i].nadi
                            }
                            if (vs[i].kesadaran != '') {
                                let panjang = vs[i].kesadaran.length
                                let temukan = vs[i].kesadaran.indexOf("~");
                                let filter = vs[i].kesadaran.slice(temukan, panjang)
                                filter = filter.replace("~", "")
                                kesadaran = filter
                            }
                            if (vs[i].spo2 != '') {
                                spo2 = vs[i].spo2
                            }
                            if (vs[i].keadaanumum != '') {
                                keadaanumum = vs[i].keadaanumum
                            }
                            if (vs[i].e != '') {
                                let panjang = vs[i].e.length
                                let temukan = vs[i].e.indexOf("~");
                                let filter = vs[i].e.slice(temukan, panjang)
                                filter = filter.replace("~", "")
                                e = filter
                            }
                            if (vs[i].m != '') {
                                let panjang = vs[i].m.length
                                let temukan = vs[i].m.indexOf("~");
                                let filter = vs[i].m.slice(temukan, panjang)
                                filter = filter.replace("~", "")
                                m = filter
                            }
                            if (vs[i].v) {
                                let panjang = vs[i].v.length
                                let temukan = vs[i].v.indexOf("~");
                                let filter = vs[i].v.slice(temukan, panjang)
                                filter = filter.replace("~", "")
                                v = filter
                            }
                            if (vs[i].tekananDarah != '') {
                                tekanandarah = vs[i].tekananDarah
                            }
                            if (vs[i].suhu != '') {
                                suhu = vs[i].suhu
                            }
                            if (vs[i].pernapasan != '') {
                                pernapasan = vs[i].pernapasan
                            }
                            if (tinggibadan != '') {
                                if (beratbadan != '') {
                                    if (nadi != '') {
                                        if (kesadaran != '') {
                                            if (spo2 != '') {
                                                if (keadaanumum != '') {
                                                    if (e != '') {
                                                        if (m != '') {
                                                            if (v != '') {
                                                                if (tekanandarah != '') {
                                                                    if (suhu != '') {
                                                                        if (pernapasan != '') {
                                                                            dataReal.push({ namapasien: vs[i].namapasien, nocm: vs[i].nocm, tgl: vs[i].tgl, tinggibadan: tinggibadan, beratbadan: beratbadan, nadi: nadi, kesadaran: kesadaran, spo2: spo2, keadaanumum: keadaanumum, e: e, m: m, v: v, tekanandarah: tekanandarah, suhu: suhu, pernapasan: pernapasan});
                                                                            tampungnoregis = vs[i].noregistrasifk
                                                                            tampungtgl = vs[i].tgl
                                                                            tinggibadan = ''
                                                                            beratbadan = ''
                                                                            nadi = ''
                                                                            kesadaran = ''
                                                                            spo2 = ''
                                                                            keadaanumum = ''
                                                                            e = ''
                                                                            m = ''
                                                                            v = ''
                                                                            tekanandarah = ''
                                                                            suhu = ''
                                                                            pernapasan = ''
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            tampungnoregis = vs[i].noregistrasifk
                            tampungtgl = vs[i].tgl
                            i = i - 1;
                        }
                    } else {
                        tampungnoregis = vs[i].noregistrasifk
                        tampungtgl = vs[i].tgl
                        i = i - 1;
                    }
                }
                 
                $scope.sourceVitalSign = new kendo.data.DataSource({
                    data: dataReal,
                    length: dataReal.length,
                    pageSize: 20
                });
                $scope.gridVitalSign = {
                    pageable: true,
                    scrollable: true,
                    columns: [
                        { field: "nocm", title: "No CM", width: 80 },
                        { field: "namapasien", title: "Nama Pasien", width: 120 },
                        { field: "tgl", title: "Tgl Input Vital Sign", width: 140 },
                        { field: "tinggibadan", title: "Tinggi Badan", width: 150 },
                        { field: "beratbadan", title: "Berat Badan", width: 120 },
                        { field: "nadi", title: "Nadi", width: 120 },
                        { field: "kesadaran", title: "Kesadaran", width: 150 },
                        // { field: "spo2", title: "SPO 2", width: 120 },
                        // { field: "keadaanumum", title: "Keadaan Umum", width: 120 },
                        { field: "tekanandarah", title: "Tekanan Darah", width: 120 },
                        { field: "pernapasan", title: "Pernapasan", width: 120 },
                        { field: "suhu", title: "Suhu", width: 120 },
                        { field: "e", title: "E", width: 120 },
                        { field: "m", title: "M", width: 120 },
                        { field: "v", title: "V", width: 120 },
                    ],
                };
            })
            $scope.popUpVitalSign.center().open();
        }
        $scope.ambilVitalSign = function() {
             
            $scope.dataSelectedVitalSign
            $scope.item.obj[2471] = {value: $scope.dataSelectedVitalSign.kesadaran, text: $scope.dataSelectedVitalSign.kesadaran}
            $scope.item.obj[2472] = $scope.dataSelectedVitalSign.tekanandarah
            $scope.item.obj[2473] = $scope.dataSelectedVitalSign.nadi
            $scope.item.obj[2539] = {value: $scope.dataSelectedVitalSign.e, text: $scope.dataSelectedVitalSign.e}
            $scope.item.obj[2540] = {value: $scope.dataSelectedVitalSign.m, text: $scope.dataSelectedVitalSign.m}
            $scope.item.obj[2541] = {value: $scope.dataSelectedVitalSign.v, text: $scope.dataSelectedVitalSign.v}
            $scope.item.obj[2475] = $scope.dataSelectedVitalSign.suhu
            $scope.item.obj[2476] = $scope.dataSelectedVitalSign.pernapasan
            $scope.item.obj[2478] = $scope.dataSelectedVitalSign.beratbadan
            $scope.item.obj[2477] = $scope.dataSelectedVitalSign.tinggibadan
            toastr.success('Berhasil !', 'Success !')
            $scope.popUpVitalSign.close();
        }
    }
])
})