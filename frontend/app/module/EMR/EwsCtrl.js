define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EwsCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
    function ($mdDialog, $timeout, $parse, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
        $scope.now = new Date();
        $scope.item = {};
        $scope.cc = {};
        $scope.cc.emrfk = 876
        $scope.item.obj = []
        $scope.dataSelected = {}
        LoadCacheHelper()
        loadHistoryEws()
        getCombo()
        let jenisEws = []
        let sum1 = 0
        let sum2 = 0
        let sum3 = 0
        let sum4 = 0
        let sum5 = 0
        let sum6 = 0
        let sum7 = 0
        let sum8 = 0
        let keterangan = ''
        let jenisews = ''
        let flag = ''
        $scope.isRouteLoading = false
        jenisEws = [
            {id: 1, jenisews: "EWS ANAK < 28 HARI"},
            {id: 2, jenisews: "EWS ANAK < 1 TAHUN"},
            {id: 3, jenisews: "EWS ANAK 1 - 5 TAHUN"},
            {id: 4, jenisews: "EWS ANAK 5 - 11 TAHUN"},
            {id: 5, jenisews: "EWS ANAK 12 - 16 TAHUN"},
            {id: 6, jenisews: "EWS DEWASA"},
            {id: 7, jenisews: "EWS OBSTETRI / IBU HAMIL"},
            {id: 8, jenisews: "EWS DEWASA (BARU)"},
        ]
        $scope.dataSelectedJenis = {}
        $scope.tampilanDepan = true;

        function getCombo() {
            medifirstService.get("emr/get-combo").then(function(e) {
                $scope.listPetugas = e.data.bidan
            })
        }
        $scope.formatJam242 = {
            value: "00-00-0000 00:00", //set default value
            // format: "dd-MM-yyyy HH:mm", //set date format
            // timeFormat: "HH:mm",        //set drop down time format to 24 hours
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
                $scope.cc.jenisemr = "ews"
                // paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            }
        }
        $scope.$watch('item.obj[2723]', function(e) {
            if (e == true) {
                $scope.item.obj[2725] = false
                $scope.item.obj[2727] = false
                $scope.item.obj[2729] = false
            }
        })
        $scope.$watch('item.obj[2725]', function(e) {
            if (e == true) {
                $scope.item.obj[2723] = false
                $scope.item.obj[2727] = false
                $scope.item.obj[2729] = false
            }
        })
        $scope.$watch('item.obj[2727]', function(e) {
            if (e == true) {
                $scope.item.obj[2725] = false
                $scope.item.obj[2723] = false
                $scope.item.obj[2729] = false
            }
        })
        $scope.$watch('item.obj[2729]', function(e) {
            if (e == true) {
                $scope.item.obj[2725] = false
                $scope.item.obj[2727] = false
                $scope.item.obj[2723] = false
            }
        })
        $scope.$watch('item.obj[2731]', function(e) {
            if (e == true) {
                $scope.item.obj[2733] = false
            }
        })
        $scope.$watch('item.obj[2733]', function(e) {
            if (e == true) {
                $scope.item.obj[2731] = false
            }
        })
        $scope.$watch('item.obj[2729]', function(e) {
            if (e == true) {
                $scope.item.obj[2725] = false
                $scope.item.obj[2727] = false
                $scope.item.obj[2723] = false
            }
        })
        $scope.$watch('item.obj[2729]', function(e) {
            if (e == true) {
                $scope.item.obj[2725] = false
                $scope.item.obj[2727] = false
                $scope.item.obj[2723] = false
            }
        })
        $scope.$watch('item.obj[2735]', function(e) {
            if (e == true) {
                $scope.item.obj[2737] = false
                $scope.item.obj[2739] = false
                $scope.item.obj[2741] = false
            }
        })
        $scope.$watch('item.obj[2737]', function(e) {
            if (e == true) {
                $scope.item.obj[2735] = false
                $scope.item.obj[2739] = false
                $scope.item.obj[2741] = false
            }
        })
        $scope.$watch('item.obj[2739]', function(e) {
            if (e == true) {
                $scope.item.obj[2737] = false
                $scope.item.obj[2735] = false
                $scope.item.obj[2741] = false
            }
        })
        $scope.$watch('item.obj[2741]', function(e) {
            if (e == true) {
                $scope.item.obj[2737] = false
                $scope.item.obj[2739] = false
                $scope.item.obj[2735] = false
            }
        })
        $scope.$watch('item.obj[2743]', function(e) {
            if (e == true) {
                $scope.item.obj[2745] = false
                $scope.item.obj[2747] = false
                $scope.item.obj[2749] = false
                $scope.item.obj[2751] = false
                $scope.item.obj[2753] = false
            }
        })
        $scope.$watch('item.obj[2745]', function(e) {
            if (e == true) {
                $scope.item.obj[2743] = false
                $scope.item.obj[2747] = false
                $scope.item.obj[2749] = false
                $scope.item.obj[2751] = false
                $scope.item.obj[2753] = false
            }
        })
        $scope.$watch('item.obj[2747]', function(e) {
            if (e == true) {
                $scope.item.obj[2745] = false
                $scope.item.obj[2743] = false
                $scope.item.obj[2749] = false
                $scope.item.obj[2751] = false
                $scope.item.obj[2753] = false
            }
        })
        $scope.$watch('item.obj[2749]', function(e) {
            if (e == true) {
                $scope.item.obj[2745] = false
                $scope.item.obj[2747] = false
                $scope.item.obj[2743] = false
                $scope.item.obj[2751] = false
                $scope.item.obj[2753] = false
            }
        })
        $scope.$watch('item.obj[2751]', function(e) {
            if (e == true) {
                $scope.item.obj[2745] = false
                $scope.item.obj[2747] = false
                $scope.item.obj[2749] = false
                $scope.item.obj[2743] = false
                $scope.item.obj[2753] = false
            }
        })
        $scope.$watch('item.obj[2753]', function(e) {
            if (e == true) {
                $scope.item.obj[2745] = false
                $scope.item.obj[2747] = false
                $scope.item.obj[2749] = false
                $scope.item.obj[2751] = false
                $scope.item.obj[2743] = false
            }
        })
        $scope.$watch('item.obj[2755]', function(e) {
            if (e == true) {
                $scope.item.obj[2757] = false
            }
        })
        $scope.$watch('item.obj[2757]', function(e) {
            if (e == true) {
                $scope.item.obj[2755] = false
            }
        })
        $scope.$watch('item.obj[2759]', function(e) {
            if (e == true) {
                $scope.item.obj[2761] = false
                $scope.item.obj[2763] = false
                $scope.item.obj[2765] = false
                $scope.item.obj[2767] = false
                $scope.item.obj[2769] = false
            }
        })
        $scope.$watch('item.obj[2761]', function(e) {
            if (e == true) {
                $scope.item.obj[2759] = false
                $scope.item.obj[2763] = false
                $scope.item.obj[2765] = false
                $scope.item.obj[2767] = false
                $scope.item.obj[2769] = false
            }
        })
        $scope.$watch('item.obj[2763]', function(e) {
            if (e == true) {
                $scope.item.obj[2761] = false
                $scope.item.obj[2759] = false
                $scope.item.obj[2765] = false
                $scope.item.obj[2767] = false
                $scope.item.obj[2769] = false
            }
        })
        $scope.$watch('item.obj[2765]', function(e) {
            if (e == true) {
                $scope.item.obj[2761] = false
                $scope.item.obj[2763] = false
                $scope.item.obj[2759] = false
                $scope.item.obj[2767] = false
                $scope.item.obj[2769] = false
            }
        })
        $scope.$watch('item.obj[2767]', function(e) {
            if (e == true) {
                $scope.item.obj[2761] = false
                $scope.item.obj[2763] = false
                $scope.item.obj[2765] = false
                $scope.item.obj[2759] = false
                $scope.item.obj[2769] = false
            }
        })
        $scope.$watch('item.obj[2769]', function(e) {
            if (e == true) {
                $scope.item.obj[2761] = false
                $scope.item.obj[2763] = false
                $scope.item.obj[2765] = false
                $scope.item.obj[2767] = false
                $scope.item.obj[2759] = false
            }
        })
        $scope.$watch('item.obj[2771]', function(e) {
            if (e == true) {
                $scope.item.obj[2773] = false
                $scope.item.obj[2775] = false
            }
        })
        $scope.$watch('item.obj[2773]', function(e) {
            if (e == true) {
                $scope.item.obj[2771] = false
                $scope.item.obj[2775] = false
            }
        })
        $scope.$watch('item.obj[2775]', function(e) {
            if (e == true) {
                $scope.item.obj[2773] = false
                $scope.item.obj[2771] = false
            }
        })

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
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum2 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb2').on('change', function(){ // on change of state
            UpdateCost2();
        });
        function UpdateCost2() {
            var sum = 0;
            var gn, elem;
            $('.cb2:checked').each(function(){
                sum += Number($(this).val()); 
            })
            $('#totalcost2').val(sum.toFixed(0));
            if (sum <= 0) {
            keterangan = 'NORMAL'
            flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum2 = sum
            $('#keterangan2').val(keterangan);
        }

        $('.cb1').on('change', function(){ // on change of state
            UpdateCost1();
        });
        function UpdateCost1() {
            var sum = 0;
            var gn, elem;
            $('.cb1:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost1').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum1 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb3').on('change', function(){ // on change of state
            UpdateCost3();
        });
        function UpdateCost3() {
            var sum = 0;
            var gn, elem;
            $('.cb3:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost3').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum3 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb4').on('change', function(){ // on change of state
            UpdateCost4();
        });
        function UpdateCost4() {
            var sum = 0;
            var gn, elem;
            $('.cb4:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost4').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum4 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb5').on('change', function(){ // on change of state
            UpdateCost5();
        });
        function UpdateCost5() {
            var sum = 0;
            var gn, elem;
            $('.cb5:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost5').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum5 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb6').on('change', function(){ // on change of state
            UpdateCost6();
        });
        function UpdateCost6() {
            var sum = 0;
            var gn, elem;
            $('.cb6:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost6').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum6 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb7').on('change', function(){ // on change of state
            UpdateCost7();
        });
        function UpdateCost7() {
            var sum = 0;
            var gn, elem;
            $('.cb7:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost7').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum7 = sum
            $('#keterangan').val(keterangan);
        }

        $('.cb8').on('change', function(){ // on change of state
            UpdateCost8();
        });
        function UpdateCost8() {
            var sum = 0;
            var gn, elem;
            $('.cb8:checked').each(function(){
                sum += Number($(this).val()); 
            })
        $('#totalcost8').val(sum.toFixed(0));
            if (sum <= 0) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else if (sum == 1) {
                keterangan = 'MONITORING FREKUENSI 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 2) {
                keterangan = 'MONITORING FREKUENSI 2 - 4 JAM, TINDAKAN SEMUA PERUBAHAN KONDISI PASIEN HARUS MENINGKATKAN FREKUENSI MONITOR UNTUK TINDAKAN KLINIS YANG TEPAT';
                flag = 'white'
            } else if (sum == 3) {
                keterangan = 'MONITORING FREKUENSI MINIMAL 1 JAM, PERAWAT JAGA DAN DOKTER JAGA MELAKUKAN MONITORING ULANG';
                flag = 'green'
            } else if (sum >= 4 && sum <= 5) {
                keterangan = 'MONITORING FREKUENSI 30 MENIT, MELAPOR KE DOKTER JAGA'
                flag = 'yellow'
            } else if (sum == 6) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MELAPOR KE DPJP'
                flag = 'yellow'
            } else if (sum >= 7 && sum <= 98) {
                keterangan = 'MONITORING FREKUENSI BERKELANJUTAN, MENGHUBUNGI TIM EMERGENSI JUGA'
                flag = 'red'
            } else if (sum == 99) {
                keterangan = 'NORMAL'
                flag = 'white'
            } else {
                keterangan = '-'
                flag = 'white'
            }
            sum8 = sum
            $('#keterangan').val(keterangan);
        }

        function loadHistoryEws () {
            medifirstService.get('emr/get-history-ews?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                let ews = dat.data
                let tampungnoregis = ews[0].noregistrasi
                let tampungtgl = ews[0].tgl
                let totalskorFinal = ''
                let totalskor = ''
                let totalskor1 = ''
                let totalskor2 = ''
                let totalskor3 = ''
                let totalskor4 = ''
                let totalskor5 = ''
                let totalskor6 = ''
                let totalskor7 = ''
                let totalskor8 = ''
                let keterangan = ''
                let jenisews = ''
                let flag = ''
                let emrpasienfk = ''
                let dataReal = []
                for (let i = 0; i < ews.length; i++) {
                    if (tampungnoregis == ews[i].noregistrasi) {
                        if (tampungtgl == ews[i].tgl) {
                            if (ews[i].emrdfk == 2777) {
                                totalskor = ews[i].value
                            }
                            if (ews[i].emrdfk == 7752) {
                                totalskor1 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7753) {
                                totalskor2 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7754) {
                                totalskor3 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7755) {
                                totalskor4 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7756) {
                                totalskor5 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7757) {
                                totalskor6 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7758) {
                                totalskor7 = ews[i].value
                            }
                            if (ews[i].emrdfk == 7759) {
                                totalskor8 = ews[i].value
                            }
                            if (ews[i].emrdfk == 2778) {
                                keterangan = ews[i].value
                            }
                            if (ews[i].emrdfk == 2792) {
                                jenisews = ews[i].value
                            }
                            if (ews[i].emrdfk == 2833) {
                                flag = ews[i].value
                            }
                            emrpasienfk = ews[i].emrpasienfk
                            if (emrpasienfk != '') {
                                if (totalskor != '') {
                                    totalskorFinal = totalskor
                                    if (totalskor1 != 0 || totalskor1 != '') {
                                        totalskorFinal += totalskor1
                                        keterangan = '-'
                                    }
                                    if (totalskor3 != 0 || totalskor3 != '') {
                                        totalskorFinal += totalskor3
                                        keterangan = '-'
                                    }
                                    if (totalskor4 != 0 || totalskor4 != '') {
                                        totalskorFinal += totalskor4
                                        keterangan = '-'
                                    }
                                    if (totalskor5 != 0 || totalskor5 != '') {
                                        totalskorFinal += totalskor5
                                        keterangan = '-'
                                    }
                                    if (totalskor6 != 0 || totalskor6 != '') {
                                        totalskorFinal += totalskor6
                                        keterangan = '-'
                                    }
                                    if (totalskor7 != 0 || totalskor7 != '') {
                                        totalskorFinal += totalskor7
                                        keterangan = '-'
                                    }
                                    if (totalskor8 != 0 || totalskor8 != '') {
                                        totalskorFinal += totalskor8
                                        keterangan = '-'
                                    }
                                    if (keterangan != '') {
                                        if (jenisews != '') {
                                            if (flag != '') {
                                                dataReal.push({namapasien: ews[i].namapasien, nocm: ews[i].nocm, norec: ews[i].norec, noregistrasi: ews[i].noregistrasi, tgl: ews[i].tgl, totalskor: totalskorFinal, totalskor1: totalskor1, totalskor2: totalskor2, totalskor3: totalskor3, totalskor4: totalskor4, totalskor5: totalskor5, totalskor6: totalskor6, totalskor7: totalskor7, totalskor8: totalskor8, keterangan: keterangan, jenisews: jenisews, flag: flag, emrpasienfk: emrpasienfk, noemr: ews[i].noemr})
                                                totalskor = ''
                                                totalskor1 = ''
                                                totalskor2 = ''
                                                totalskor3 = ''
                                                totalskor4 = ''
                                                totalskor5 = ''
                                                totalskor6 = ''
                                                totalskor7 = ''
                                                totalskor8 = ''
                                                keterangan = ''
                                                jenisews = ''
                                                flag = ''
                                                emrpasienfk = ''
                                            } 
                                        }
                                    }
                                }
                            }
                        } else {
                            tampungnoregis = ews[i].noregistrasi
                            tampungtgl = ews[i].tgl
                            i = i - 1;
                        }
                    } else {
                        tampungnoregis = ews[i].noregistrasi
                        tampungtgl = ews[i].tgl
                        i = i - 1;
                    }
                }

            $scope.sourceEws = new kendo.data.DataSource({
                data: dataReal,
                length: dataReal.length,
                pageSize: 20
            });
            $scope.gridEws = {
                pageable: true,
                scrollable: true,
                columns: [
                    {field: "nocm", title: "No CM", width: 40},
                    {field: "noregistrasi", title: "No Registrasi", width: 40},
                    { field: "namapasien", title: "Nama Pasien", width: 120 },
                    { field: "tgl", title: "Tgl Mulai Input EWS", width: 120 },
                    { field: "jenisews", title: "Jenis EWS", width: 120 },
                    // { field: "totalskor", title: "Total Skor", width: 40 },
                    {
                        field: "totalskor",
                        title: "Total Skor",
                        width: 40,
                        template: function(dataItem) {
                            if (dataItem.totalskor === 99 || dataItem.totalskor == 99 || dataItem.totalskor === '99' || dataItem.totalskor == '99') {
                                return "0";
                            } else {
                                return dataItem.totalskor;
                            }
                        }
                    },
                    { field: "keterangan", title: "Keterangan", width: 120 },
                ],
            };
        })
        }
        $scope.tambahEws = function() {
            $scope.sourceJenisEws = new kendo.data.DataSource({
                data: jenisEws,
                length: jenisEws.length,
                pageSize: 20
            });
            $scope.gridJenisEws = {
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "jenisews", title: "Jenis EWS" }
                ],
            };
            $scope.popUpTambahEdukasi.center().open()
        }
        $scope.goEws = function() {
            if ($scope.dataSelectedJenis.jenisews == undefined) {
                toastr.error('Pilih data dahulu !')
                return
            }
            if ($scope.dataSelectedJenis.jenisews == "EWS ANAK < 28 HARI") {
                $scope.tampilanDepan = false;
                $scope.ewsanak28 = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS ANAK < 28 HARI'
                $scope.popUpTambahEdukasi.close();
            } 
            else if ($scope.dataSelectedJenis.jenisews == "EWS ANAK < 1 TAHUN") {
                $scope.tampilanDepan = false;
                $scope.ewsanak1 = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS ANAK < 1 TAHUN'
                $scope.popUpTambahEdukasi.close();
            }
            else if ($scope.dataSelectedJenis.jenisews == "EWS ANAK 1 - 5 TAHUN") {
                $scope.tampilanDepan = false;
                $scope.ewsanak15 = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS ANAK 1 - 5 TAHUN'
                $scope.popUpTambahEdukasi.close();
            }
            else if ($scope.dataSelectedJenis.jenisews == "EWS ANAK 5 - 11 TAHUN") {
                $scope.tampilanDepan = false;
                $scope.ewsanak511 = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS ANAK 5 - 11 TAHUN'
                $scope.popUpTambahEdukasi.close();
            }
            else if ($scope.dataSelectedJenis.jenisews == "EWS ANAK 12 - 16 TAHUN") {
                $scope.tampilanDepan = false;
                $scope.ewsanak1216 = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS ANAK 12 - 16 TAHUN'
                $scope.popUpTambahEdukasi.close();
            }
            else if ($scope.dataSelectedJenis.jenisews == "EWS DEWASA") {
                $scope.tampilanDepan = false;
                $scope.ewsdewasa = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS DEWASA'
                $scope.popUpTambahEdukasi.close();
            }
            else if ($scope.dataSelectedJenis.jenisews == "EWS OBSTETRI / IBU HAMIL") {
                $scope.tampilanDepan = false;
                $scope.ewshamil = true;
                $scope.haha = true;
                $scope.isSimpan = true;
                jenisews = 'EWS OBSTETRI / IBU HAMIL'
                $scope.popUpTambahEdukasi.close();
            }
            else if ($scope.dataSelectedJenis.jenisews == "EWS DEWASA (BARU)") {
                $scope.tampilanDepan = false;
                $scope.ewsdewasabaru = true;
                $scope.haha = false;
                $scope.isSimpan = true;
                jenisews = 'EWS DEWASA (BARU)'
                $scope.popUpTambahEdukasi.close();
            }
        }
        $scope.saveEws = function() {
            $scope.item.obj[2777] = sum2
            $scope.item.obj[7752] = sum1
            $scope.item.obj[7753] = sum2
            $scope.item.obj[7754] = sum3
            $scope.item.obj[7755] = sum4
            $scope.item.obj[7756] = sum5
            $scope.item.obj[7757] = sum6
            $scope.item.obj[7758] = sum7
            $scope.item.obj[7759] = sum8
            $scope.item.obj[2778] = keterangan
            $scope.item.obj[2792] = jenisews
            $scope.item.obj[2833] = flag
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if (arrobj[i] >= 8136 && arrobj[i] <= 8143) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                } else {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
            }

            if ($scope.isUpdate === true) {
                var method = 'update'
                $scope.cc.norec_emr = $scope.dataSelected.noemr
            }

            $scope.cc.jenisemr = 'ews'
            let jsonSave = {
                head: $scope.cc,
                method: method,
                data: arrSave
            }
            medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                $scope.tampilanDepan = true;
                $scope.ewsanak28 = false;
                $scope.ewsanak1 = false;
                $scope.ewsanak15 = false;
                $scope.ewsanak511 = false;
                $scope.ewsanak1216 = false;
                $scope.ewsdewasa = false;
                $scope.ewshamil = false;
                $scope.ewsdewasabaru = false;
                $scope.haha = false;
                $scope.isUpdate = false
                sum2 = ''
                sum1 = ''
                sum3 = ''
                sum4 = ''
                sum5 = ''
                sum6 = ''
                sum7 = ''
                sum8 = ''
                keterangan = ''
                jenisews = ''
                flag = ''
                loadHistoryEws()
            })
        }
        $scope.kembaliEws = function() {
            $scope.tampilanDepan = true;
            $scope.ewsanak28 = false;
            $scope.ewsanak1 = false;
            $scope.ewsanak15 = false;
            $scope.ewsanak511 = false;
            $scope.ewsanak1216 = false;
            $scope.ewsdewasa = false;
            $scope.ewshamil = false;
            $scope.ewsdewasabaru = false;
            $scope.haha = false;
            sum2 = ''
            sum1 = ''
            sum3 = ''
            sum4 = ''
            sum5 = ''
            sum6 = ''
            sum7 = ''
            sum8 = ''
            keterangan = ''
            jenisews = ''
            flag = ''
        }
        $scope.lihatEws = function() {
            debugger
            if ($scope.dataSelected.noregistrasi == undefined) {
                toastr.error('Pilih data dahulu !')
                return
            }
            let emrpasienfk = $scope.dataSelected.emrpasienfk
            if ($scope.dataSelected.jenisews == 'EWS ANAK < 28 HARI') {
                $scope.tampilanDepan = false;
                $scope.ewsanak28 = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS ANAK < 1 TAHUN') {
                $scope.tampilanDepan = false;
                $scope.ewsanak1 = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS ANAK 1 - 5 TAHUN') {
                $scope.tampilanDepan = false;
                $scope.ewsanak15 = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS ANAK 5 - 11 TAHUN') {
                $scope.tampilanDepan = false;
                $scope.ewsanak511 = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS ANAK 12 - 16 TAHUN') {
                $scope.tampilanDepan = false;
                $scope.ewsanak1216 = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS DEWASA') {
                $scope.tampilanDepan = false;
                $scope.ewsdewasa = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS OBSTETRI / IBU HAMIL') {
                $scope.tampilanDepan = false;
                $scope.ewshamil = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
            if ($scope.dataSelected.jenisews == 'EWS DEWASA (BARU)') {
                $scope.tampilanDepan = false;
                $scope.ewsdewasabaru = true;
                $scope.isSimpan = true;
                $scope.isUpdate = true;
                loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
            }
        }
        function loadDataEws(noRegistrasi, tgl, emrpasienfk) {
            $scope.isRouteLoading = true
            let paramSearch = 'noregistrasi=' + noRegistrasi
            let tglEws = ''
            if ($scope.isUpdate == false) {
                tglEws = tgl
            }
            let emrpasienfk2 = emrpasienfk

            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=ews", true).then(function(dat) {
                $scope.isRouteLoading = false

                if (dat.data.data.length > 0) {
                    setobjectToModel(emrpasienfk2, $scope.cc.emrfk, tglEws)
                }
            })
        }
        function setobjectToModel(nomorEMRSS, emrfk, tglEws2) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk + "&tgl=" + tglEws2, true).then(function (dat) {
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[68] = $scope.now
                let dataLoad = []
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        if ($scope.isUpdate === true) {
                            if (dataLoad[i].emrdfk === 2777) {
                                sum2 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7752) {
                                sum1 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7754) {
                                sum3 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7755) {
                                sum4 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7756) {
                                sum5 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7757) {
                                sum6 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7758) {
                                sum7 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 7759) {
                                sum8 = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 2778) {
                                keterangan = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 2792) {
                                jenisews = dataLoad[i].value;
                            }

                            if (dataLoad[i].emrdfk === 2833) {
                                flag = dataLoad[i].value;
                            }
                        }

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

                        if (dataLoad[i].emrdfk >= 7728 && dataLoad[i].emrdfk <= 7751) {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }

                        if (dataLoad[i].emrdfk >= 7760 && dataLoad[i].emrdfk <= 8095) {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }

                        if (dataLoad[i].emrdfk >= 7720 && dataLoad[i].emrdfk <= 7727) {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].emrdfk >= 7712 && dataLoad[i].emrdfk <= 7719) {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].emrdfk >= 7752 && dataLoad[i].emrdfk <= 7759) {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }

                        if (dataLoad[i].emrdfk >= 8096 && dataLoad[i].emrdfk <= 8135) {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }

                        if (dataLoad[i].emrdfk >= 8136 && dataLoad[i].emrdfk <= 8143) {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        // if (dataLoad[i].type == "time") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        // }
                        // if (dataLoad[i].type == "date") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        // }

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
                        // if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "890") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        // }
                        // if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "891") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        // }
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
        }

        $scope.hapusEws = function () {
            if ($scope.dataSelected.norec == undefined) {
                toastr.error('Pilih data dahulu !')
                return
            }
            var item = {
                norec: $scope.dataSelected.norec
            }
            medifirstService.post('emr/delete-emr-transaksi', item).then(function (e) {
                $scope.dataSelected.norec = undefined
                loadHistoryEws();
            });
        }
    }
])
})