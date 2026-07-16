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
            $scope.belumBeres = false
            jenisEws = [
                { id: 1, jenisews: "EWS ANAK < 28 HARI" },
                { id: 2, jenisews: "EWS ANAK < 1 TAHUN" },
                { id: 3, jenisews: "EWS ANAK 1 - 5 TAHUN" },
                { id: 4, jenisews: "EWS ANAK 5 - 11 TAHUN" },
                { id: 5, jenisews: "EWS ANAK 12 - 16 TAHUN" },
                { id: 6, jenisews: "EWS DEWASA" },
                { id: 7, jenisews: "EWS OBSTETRI / IBU HAMIL" },
                { id: 8, jenisews: "EWS DEWASA (BARU)" },
                { id: 9, jenisews: "PEWS ANAK" },
                { id: 10, jenisews: "MEOWS" },
            ]
            $scope.dataSelectedJenis = {}
            $scope.tampilanDepan = true;

            function getCombo() {
                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listPetugas = e.data.bidan
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
                    $scope.cc.iddokter = chacePeriode[17]
                    $scope.cc.objectdepartemenfk = chacePeriode[23]
                    $scope.cc.departementerakhir = chacePeriode[32]
                    $scope.cc.objectruanganterakhir = chacePeriode[33]
                    $scope.cc.norecterakhir = chacePeriode[34]
                    $scope.cc.norec_emr = '-'
                    $scope.cc.jenisemr = "ews"
                    // paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi

                    // ambil index terakhir dari cache
                    // Logika: baca lastIndex; selalu isi slot berikutnya (lastIndex+1) jika belum terisi,
                    // tanpa mengubah nilai cache di sini. Cache hanya maju setelah save sukses.
                    // let lastIndex = cacheHelper.get('cacheLastEwsIndex') || 8135;
                    // let initIndex = lastIndex + 1;
                    // if (initIndex > 8143) initIndex = 8143;

                    // // ambil data login
                    // let pegawai = medifirstService.getPegawaiLogin();
                    // if (pegawai) {
                    //     // hanya isi jika slot belum terisi
                    //     if (!$scope.item.obj[initIndex]) {
                    //         $scope.item.obj[initIndex] = {
                    //             id: pegawai.id,
                    //             namalengkap: pegawai.namaLengkap
                    //         };
                    //         // console.log('Isi otomatis field:', initIndex, '→', pegawai.namaLengkap);
                    //     } else {
                    //         console.log('Slot', initIndex, 'sudah terisi, tidak diubah');
                    //     }
                    // } else {
                    //     console.warn('Pegawai login tidak ditemukan dari medifirstService.getPegawaiLogin()');
                    // }
                }
            }
            $scope.$watch('item.obj[2723]', function (e) {
                if (e == true) {
                    $scope.item.obj[2725] = false
                    $scope.item.obj[2727] = false
                    $scope.item.obj[2729] = false
                }
            })
            $scope.$watch('item.obj[2725]', function (e) {
                if (e == true) {
                    $scope.item.obj[2723] = false
                    $scope.item.obj[2727] = false
                    $scope.item.obj[2729] = false
                }
            })
            $scope.$watch('item.obj[2727]', function (e) {
                if (e == true) {
                    $scope.item.obj[2725] = false
                    $scope.item.obj[2723] = false
                    $scope.item.obj[2729] = false
                }
            })
            $scope.$watch('item.obj[2729]', function (e) {
                if (e == true) {
                    $scope.item.obj[2725] = false
                    $scope.item.obj[2727] = false
                    $scope.item.obj[2723] = false
                }
            })
            $scope.$watch('item.obj[2731]', function (e) {
                if (e == true) {
                    $scope.item.obj[2733] = false
                }
            })
            $scope.$watch('item.obj[2733]', function (e) {
                if (e == true) {
                    $scope.item.obj[2731] = false
                }
            })
            $scope.$watch('item.obj[2729]', function (e) {
                if (e == true) {
                    $scope.item.obj[2725] = false
                    $scope.item.obj[2727] = false
                    $scope.item.obj[2723] = false
                }
            })
            $scope.$watch('item.obj[2729]', function (e) {
                if (e == true) {
                    $scope.item.obj[2725] = false
                    $scope.item.obj[2727] = false
                    $scope.item.obj[2723] = false
                }
            })
            $scope.$watch('item.obj[2735]', function (e) {
                if (e == true) {
                    $scope.item.obj[2737] = false
                    $scope.item.obj[2739] = false
                    $scope.item.obj[2741] = false
                }
            })
            $scope.$watch('item.obj[2737]', function (e) {
                if (e == true) {
                    $scope.item.obj[2735] = false
                    $scope.item.obj[2739] = false
                    $scope.item.obj[2741] = false
                }
            })
            $scope.$watch('item.obj[2739]', function (e) {
                if (e == true) {
                    $scope.item.obj[2737] = false
                    $scope.item.obj[2735] = false
                    $scope.item.obj[2741] = false
                }
            })
            $scope.$watch('item.obj[2741]', function (e) {
                if (e == true) {
                    $scope.item.obj[2737] = false
                    $scope.item.obj[2739] = false
                    $scope.item.obj[2735] = false
                }
            })
            $scope.$watch('item.obj[2743]', function (e) {
                if (e == true) {
                    $scope.item.obj[2745] = false
                    $scope.item.obj[2747] = false
                    $scope.item.obj[2749] = false
                    $scope.item.obj[2751] = false
                    $scope.item.obj[2753] = false
                }
            })
            $scope.$watch('item.obj[2745]', function (e) {
                if (e == true) {
                    $scope.item.obj[2743] = false
                    $scope.item.obj[2747] = false
                    $scope.item.obj[2749] = false
                    $scope.item.obj[2751] = false
                    $scope.item.obj[2753] = false
                }
            })
            $scope.$watch('item.obj[2747]', function (e) {
                if (e == true) {
                    $scope.item.obj[2745] = false
                    $scope.item.obj[2743] = false
                    $scope.item.obj[2749] = false
                    $scope.item.obj[2751] = false
                    $scope.item.obj[2753] = false
                }
            })
            $scope.$watch('item.obj[2749]', function (e) {
                if (e == true) {
                    $scope.item.obj[2745] = false
                    $scope.item.obj[2747] = false
                    $scope.item.obj[2743] = false
                    $scope.item.obj[2751] = false
                    $scope.item.obj[2753] = false
                }
            })
            $scope.$watch('item.obj[2751]', function (e) {
                if (e == true) {
                    $scope.item.obj[2745] = false
                    $scope.item.obj[2747] = false
                    $scope.item.obj[2749] = false
                    $scope.item.obj[2743] = false
                    $scope.item.obj[2753] = false
                }
            })
            $scope.$watch('item.obj[2753]', function (e) {
                if (e == true) {
                    $scope.item.obj[2745] = false
                    $scope.item.obj[2747] = false
                    $scope.item.obj[2749] = false
                    $scope.item.obj[2751] = false
                    $scope.item.obj[2743] = false
                }
            })
            $scope.$watch('item.obj[2755]', function (e) {
                if (e == true) {
                    $scope.item.obj[2757] = false
                }
            })
            $scope.$watch('item.obj[2757]', function (e) {
                if (e == true) {
                    $scope.item.obj[2755] = false
                }
            })
            $scope.$watch('item.obj[2759]', function (e) {
                if (e == true) {
                    $scope.item.obj[2761] = false
                    $scope.item.obj[2763] = false
                    $scope.item.obj[2765] = false
                    $scope.item.obj[2767] = false
                    $scope.item.obj[2769] = false
                }
            })
            $scope.$watch('item.obj[2761]', function (e) {
                if (e == true) {
                    $scope.item.obj[2759] = false
                    $scope.item.obj[2763] = false
                    $scope.item.obj[2765] = false
                    $scope.item.obj[2767] = false
                    $scope.item.obj[2769] = false
                }
            })
            $scope.$watch('item.obj[2763]', function (e) {
                if (e == true) {
                    $scope.item.obj[2761] = false
                    $scope.item.obj[2759] = false
                    $scope.item.obj[2765] = false
                    $scope.item.obj[2767] = false
                    $scope.item.obj[2769] = false
                }
            })
            $scope.$watch('item.obj[2765]', function (e) {
                if (e == true) {
                    $scope.item.obj[2761] = false
                    $scope.item.obj[2763] = false
                    $scope.item.obj[2759] = false
                    $scope.item.obj[2767] = false
                    $scope.item.obj[2769] = false
                }
            })
            $scope.$watch('item.obj[2767]', function (e) {
                if (e == true) {
                    $scope.item.obj[2761] = false
                    $scope.item.obj[2763] = false
                    $scope.item.obj[2765] = false
                    $scope.item.obj[2759] = false
                    $scope.item.obj[2769] = false
                }
            })
            $scope.$watch('item.obj[2769]', function (e) {
                if (e == true) {
                    $scope.item.obj[2761] = false
                    $scope.item.obj[2763] = false
                    $scope.item.obj[2765] = false
                    $scope.item.obj[2767] = false
                    $scope.item.obj[2759] = false
                }
            })
            $scope.$watch('item.obj[2771]', function (e) {
                if (e == true) {
                    $scope.item.obj[2773] = false
                    $scope.item.obj[2775] = false
                }
            })
            $scope.$watch('item.obj[2773]', function (e) {
                if (e == true) {
                    $scope.item.obj[2771] = false
                    $scope.item.obj[2775] = false
                }
            })
            $scope.$watch('item.obj[2775]', function (e) {
                if (e == true) {
                    $scope.item.obj[2773] = false
                    $scope.item.obj[2771] = false
                }
            })

            $('.cb').on('change', function () { // on change of state
                UpdateCost();
            });
            function UpdateCost() {
                var sum = 0;
                var gn, elem;
                $('.cb:checked').each(function () {
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

            $('.cb2').on('change', function () { // on change of state
                UpdateCost2();
            });
            function UpdateCost2() {
                var sum = 0;
                var gn, elem;
                $('.cb2:checked').each(function () {
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

            $('.cb1').on('change', function () { // on change of state
                UpdateCost1();
            });
            function UpdateCost1() {
                var sum = 0;
                var gn, elem;
                $('.cb1:checked').each(function () {
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

            $('.cb3').on('change', function () { // on change of state
                UpdateCost3();
            });
            function UpdateCost3() {
                var sum = 0;
                var gn, elem;
                $('.cb3:checked').each(function () {
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

            $('.cb4').on('change', function () { // on change of state
                UpdateCost4();
            });
            function UpdateCost4() {
                var sum = 0;
                var gn, elem;
                $('.cb4:checked').each(function () {
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

            $('.cb5').on('change', function () { // on change of state
                UpdateCost5();
            });
            function UpdateCost5() {
                var sum = 0;
                var gn, elem;
                $('.cb5:checked').each(function () {
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

            $('.cb6').on('change', function () { // on change of state
                UpdateCost6();
            });
            function UpdateCost6() {
                var sum = 0;
                var gn, elem;
                $('.cb6:checked').each(function () {
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

            $('.cb7').on('change', function () { // on change of state
                UpdateCost7();
            });
            function UpdateCost7() {
                var sum = 0;
                var gn, elem;
                $('.cb7:checked').each(function () {
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

            $('.cb8').on('change', function () { // on change of state
                UpdateCost8();
            });
            function UpdateCost8() {
                var sum = 0;
                var gn, elem;
                $('.cb8:checked').each(function () {
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

            $('.cb122').on('change', function () { // on change of state
                UpdateCost122();
            });
            function UpdateCost122() {
                var sum = 0;
                var gn, elem;
                $('.cb122:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost122').val(sum.toFixed(0));
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

            $('.cb111').on('change', function () { // on change of state
                UpdateCost111();
            });
            function UpdateCost111() {
                var sum = 0;
                var gn, elem;
                $('.cb111:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost111').val(sum.toFixed(0));
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

            $('.cb133').on('change', function () { // on change of state
                UpdateCost133();
            });
            function UpdateCost133() {
                var sum = 0;
                var gn, elem;
                $('.cb133:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost133').val(sum.toFixed(0));
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

            $('.cb144').on('change', function () { // on change of state
                UpdateCost144();
            });
            function UpdateCost144() {
                var sum = 0;
                var gn, elem;
                $('.cb144:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost144').val(sum.toFixed(0));
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

            $('.cb155').on('change', function () { // on change of state
                UpdateCost155();
            });
            function UpdateCost155() {
                var sum = 0;
                var gn, elem;
                $('.cb155:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost155').val(sum.toFixed(0));
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

            $('.cb166').on('change', function () { // on change of state
                UpdateCost166();
            });
            function UpdateCost166() {
                var sum = 0;
                var gn, elem;
                $('.cb166:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost166').val(sum.toFixed(0));
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

            $('.cb177').on('change', function () { // on change of state
                UpdateCost177();
            });
            function UpdateCost177() {
                var sum = 0;
                var gn, elem;
                $('.cb177:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost177').val(sum.toFixed(0));
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

            $('.cb188').on('change', function () { // on change of state
                UpdateCost188();
            });
            function UpdateCost188() {
                var sum = 0;
                var gn, elem;
                $('.cb188:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost188').val(sum.toFixed(0));
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

            $('.cb12').on('change', function () { // on change of state
                UpdateCost12();
            });
            function UpdateCost12() {
                var sum = 0;
                var gn, elem;
                $('.cb12:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost12').val(sum.toFixed(0));
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

            $('.cb11').on('change', function () { // on change of state
                UpdateCost11();
            });
            function UpdateCost11() {
                var sum = 0;
                var gn, elem;
                $('.cb11:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost11').val(sum.toFixed(0));
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

            $('.cb13').on('change', function () { // on change of state
                UpdateCost13();
            });
            function UpdateCost13() {
                var sum = 0;
                var gn, elem;
                $('.cb13:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost13').val(sum.toFixed(0));
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

            $('.cb14').on('change', function () { // on change of state
                UpdateCost14();
            });
            function UpdateCost14() {
                var sum = 0;
                var gn, elem;
                $('.cb14:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost14').val(sum.toFixed(0));
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

            $('.cb15').on('change', function () { // on change of state
                UpdateCost15();
            });
            function UpdateCost15() {
                var sum = 0;
                var gn, elem;
                $('.cb15:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost15').val(sum.toFixed(0));
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

            $('.cb16').on('change', function () { // on change of state
                UpdateCost16();
            });
            function UpdateCost16() {
                var sum = 0;
                var gn, elem;
                $('.cb16:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost16').val(sum.toFixed(0));
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

            $('.cb17').on('change', function () { // on change of state
                UpdateCost17();
            });
            function UpdateCost17() {
                var sum = 0;
                var gn, elem;
                $('.cb17:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost17').val(sum.toFixed(0));
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

            $('.cb18').on('change', function () { // on change of state
                UpdateCost18();
            });
            function UpdateCost18() {
                var sum = 0;
                var gn, elem;
                $('.cb18:checked').each(function () {
                    sum += Number($(this).val());
                })
                $('#totalcost18').val(sum.toFixed(0));
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

            // function loadHistoryEws () {
            //     medifirstService.get('emr/get-history-ews?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
            //         let ews = dat.data
            //         let tampungnoregis = ews[0].noregistrasi
            //         let tampungtgl = ews[0].tgl
            //         let totalskorFinal = 0
            //         let totalskor1 = ''
            //         let totalskor2 = ''
            //         let totalskor3 = ''
            //         let totalskor4 = ''
            //         let totalskor5 = ''
            //         let totalskor6 = ''
            //         let totalskor7 = ''
            //         let totalskor8 = ''
            //         let keterangan = ''
            //         let jenisews = ''
            //         let flag = ''
            //         let emrpasienfk = ''
            //         let dataReal = []
            //         for (let i = 0; i < ews.length; i++) {
            //             if (tampungnoregis == ews[i].noregistrasi) {
            //                 if (tampungtgl == ews[i].tgl) {
            //                     if (ews[i].emrdfk == 2778) {
            //                         keterangan = ews[i].value
            //                     }
            //                     if (ews[i].emrdfk == 2792) {
            //                         jenisews = ews[i].value
            //                     }
            //                     if (ews[i].emrdfk == 2833) {
            //                         flag = ews[i].value
            //                     }
            //                     emrpasienfk = ews[i].emrpasienfk
            //                     if (emrpasienfk != '') {
            //                             if (keterangan != '') {
            //                                 if (jenisews != '') {
            //                                     if (flag != '') {
            //                                         dataReal.push({namapasien: ews[i].namapasien, nocm: ews[i].nocm, norec: ews[i].norec, noregistrasi: ews[i].noregistrasi, tgl: ews[i].tgl, totalskor: totalskorFinal, totalskor1: totalskor1, totalskor2: totalskor2, totalskor3: totalskor3, totalskor4: totalskor4, totalskor5: totalskor5, totalskor6: totalskor6, totalskor7: totalskor7, totalskor8: totalskor8, keterangan: keterangan, jenisews: jenisews, flag: flag, emrpasienfk: emrpasienfk, noemr: ews[i].noemr})
            //                                         totalskor = ''
            //                                         totalskor1 = ''
            //                                         totalskor2 = ''
            //                                         totalskor3 = ''
            //                                         totalskor4 = ''
            //                                         totalskor5 = ''
            //                                         totalskor6 = ''
            //                                         totalskor7 = ''
            //                                         totalskor8 = ''
            //                                         keterangan = ''
            //                                         jenisews = ''
            //                                         flag = ''
            //                                         emrpasienfk = ''
            //                                     } 
            //                                 }
            //                         }
            //                     }
            //                 } else {
            //                     tampungnoregis = ews[i].noregistrasi
            //                     tampungtgl = ews[i].tgl
            //                     i = i - 1;
            //                 }
            //             } else {
            //                 tampungnoregis = ews[i].noregistrasi
            //                 tampungtgl = ews[i].tgl
            //                 i = i - 1;
            //             }
            //         }

            //     $scope.sourceEws = new kendo.data.DataSource({
            //         data: dataReal,
            //         length: dataReal.length,
            //         pageSize: 20
            //     });
            //     $scope.gridEws = {
            //         pageable: true,
            //         scrollable: true,
            //         columns: [
            //             {field: "nocm", title: "No CM", width: 40},
            //             {field: "noregistrasi", title: "No Registrasi", width: 40},
            //             { field: "namapasien", title: "Nama Pasien", width: 120 },
            //             { field: "tgl", title: "Tgl Mulai Input EWS", width: 120 },
            //             { field: "jenisews", title: "Jenis EWS", width: 120 },
            //             // { field: "totalskor", title: "Total Skor", width: 40 },
            //             {
            //                 field: "totalskor",
            //                 title: "Total Skor",
            //                 width: 40,
            //                 template: function(dataItem) {
            //                     if (dataItem.totalskor === 99 || dataItem.totalskor == 99 || dataItem.totalskor === '99' || dataItem.totalskor == '99') {
            //                         return "0";
            //                     } else {
            //                         return dataItem.totalskor;
            //                     }
            //                 }
            //             },
            //             { field: "keterangan", title: "Keterangan", width: 120 },
            //         ],
            //     };
            // })
            // }

            function loadHistoryEws() {
                medifirstService.get('emr/get-history-ews?noRegistrasi=' + $scope.cc.noregistrasi).then(function (dat) {
                    let ews = dat.data;
                    let dataReal = [];
                    let dataMap = {};

                    if (ews.length === 0) {
                        $scope.belumBeres = false;
                    } else {
                        // helper parse: ubah "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss" lalu new Date()
                        function parseTgl(s) {
                            if (!s) return new Date(0);
                            s = String(s).trim();
                            if (s.indexOf('T') === -1) {
                                s = s.replace(' ', 'T');
                            }
                            return new Date(s);
                        }

                        let times = ews.map(e => parseTgl(e.tgl).getTime());
                        let maxTime = Math.max.apply(null, times);

                        // selisih 3 menit dalam milidetik
                        let batas3Menit = 3 * 60 * 1000;

                        // ambil semua data dalam rentang 3 menit terakhir
                        let latestData = ews.filter(e => {
                            let t = parseTgl(e.tgl).getTime();
                            return (maxTime - t) <= batas3Menit && t <= maxTime;
                        });

                        // cek ada emrdfk 8143
                        let ada8143 = latestData.some(e => Number(e.emrdfk) === 8143 ||
                            String(e.value).toUpperCase() === "PEWS ANAK");

                        $scope.belumBeres = !ada8143;
                    }

                    // iterasi lewat data ews
                    for (let i = 0; i < ews.length; i++) {
                        let item = ews[i];
                        let noemr = item.noemr;

                        // kalo noemr belum ada di dataMap, buat entri baru
                        if (!dataMap[noemr]) {
                            dataMap[noemr] = {
                                nocm: item.nocm,
                                namapasien: item.namapasien,
                                noregistrasi: item.noregistrasi,
                                tgl: item.tgl,
                                jenisews: [],
                                totalskor: null,
                                monitoring: '',
                                keterangan: '',
                                emrpasienfk: item.emrpasienfk,
                                norec: item.norec,
                                noemr: item.noemr
                            };
                        }

                        // mengisi jenisews dan totalskor
                        if (item.emrdfk === 7759 || item.emrdfk === 7758 || item.emrdfk === 7757 || item.emrdfk === 7756 || item.emrdfk === 7755 || item.emrdfk === 7754 || item.emrdfk === 7752 || item.emrdfk === 7753) {
                            if (item.value !== 0) {
                                // memperbarui totalskor jika emrdfk lebih tinggi
                                if (dataMap[noemr].totalskor === null || item.emrdfk > dataMap[noemr].totalskor) {
                                    dataMap[noemr].totalskor = item.emrdfk; // nyimpen emrdfk sebagai totalskor
                                }
                            }
                        }

                        // if (item.emrdfk === 2778) {
                        //     dataMap[noemr].keterangan = item.value;
                        // }

                        // mengisi jenisews
                        if (item.emrdfk === 2792) {
                            dataMap[noemr].jenisews.push(item.value);
                        }
                    }

                    // ubah dataMap menjadi array
                    for (let key in dataMap) {
                        // ambil nilai dari emrdfk yang sesuai dengan totalskor
                        let totalskorValue = null;
                        for (let i = 0; i < ews.length; i++) {
                            if (ews[i].noemr === key && ews[i].emrdfk === dataMap[key].totalskor) {
                                totalskorValue = ews[i].value;
                                break;
                            }
                        }
                        dataMap[key].totalskor = totalskorValue; // update totalskor dengan value yang sesuai

                        // set monitoring dan keterangan berdasarkan nilai totalskor
                        // Cek apakah ini form MEOWS atau EWS Dewasa
                        let isMeows = dataMap[key].jenisews.includes("MEOWS");
                        let skor = parseInt(dataMap[key].totalskor);

                        if (isNaN(skor)) skor = 0;

                        if (isMeows) {
                            if (skor === 0) {
                                dataMap[key].monitoring = "Setiap 6-8 jam";
                                dataMap[key].keterangan = "Lakukan monitoring per shift";
                            } else if (skor >= 1 && skor <= 4) {
                                dataMap[key].monitoring = "Setiap 4 jam";
                                dataMap[key].keterangan = "Ka Tim Bidan melakukan pengkajian ulang Lakukan monitoring tiap 4 jam";
                            } else if (skor === 5 || skor === 6) {
                                dataMap[key].monitoring = "Setiap 1 jam.";
                                dataMap[key].keterangan = "Bidan lapor Dokter Jaga. Dokter Jaga melakukan pengkajian ulang. Dokter jaga konsultasi ke DPJP untuk pertimbangan perawatan HCU/ICU. Monitoring oleh dokter";
                            } else if (skor >= 7) {
                                dataMap[key].monitoring = "Penilaian ulang kontinyu";
                                dataMap[key].keterangan = "Resusitasi. Perawatan di HCU/ICU. Dokter jaga melakukan konsultasi";
                            }

                        } else {
                            if (skor === 0) {
                                dataMap[key].monitoring = "Minimal setiap shift.";
                                dataMap[key].keterangan = "Perawat pelaksana melanjutkan observasi secara rutin.";
                            } else if (skor >= 1 && skor <= 4) {
                                dataMap[key].monitoring = "Minimal setiap 6-8 jam.";
                                dataMap[key].keterangan = "Perawat pelaksana menginformasikan ke Ka Shift, Ka Shift meningkatkan frekuensi monitoring.";
                            } else if (skor >= 5 && skor <= 6) {
                                dataMap[key].monitoring = "Minimal setiap jam.";
                                dataMap[key].keterangan = "Ka Shift menginformasikan ke Dokter Jaga atau DPJP, Ka Shift tetap melanjutkan monitoring, Dokter Jaga atau DPJP melakukan asesmen ulang, Dokter Jaga melakukan konsultasi ke DPJP, Dokter Jaga atau DPJP melakukan tindakan emergensi, Mempertimbangkan untuk transfer pasien ke ICU/HCU.";
                            } else if (skor >= 7 && skor <= 17) {
                                dataMap[key].monitoring = "Minimal setiap 15 menit.";
                                dataMap[key].keterangan = "Ka Shift menginformasikan ke Dokter Jaga atau DPJP, Dokter Jaga atau DPJP melakukan asesmen ulang, Dokter Jaga atau DPJP melakukan tindakan emergensi, Persiapan transfer pasien ke ICU/HCU.";
                            } else if (skor >= 18) {
                                dataMap[key].monitoring = "Minimal setiap 10 menit.";
                                dataMap[key].keterangan = "Aktivitasi Tim reaksi cepat atau tim Code Blue.";
                            }
                        }


                        dataReal.push(dataMap[key]);
                    }

                    // atur data ke DataSource Kendo
                    $scope.sourceEws = new kendo.data.DataSource({
                        data: dataReal,
                        length: dataReal.length,
                        pageSize: 20
                    });

                    // mengatur grid
                    $scope.gridEws = {
                        pageable: true,
                        scrollable: true,
                        columns: [
                            { field: "nocm", title: "No CM", width: 40 },
                            { field: "noregistrasi", title: "No Registrasi", width: 40 },
                            { field: "namapasien", title: "Nama Pasien", width: 120 },
                            { field: "tgl", title: "Tgl Mulai Input EWS", width: 120 },
                            { field: "jenisews", title: "Jenis EWS", width: 120, template: function (dataItem) { return dataItem.jenisews.join(", "); } },
                            { field: "totalskor", title: "Total Skor", width: 40, template: "#= totalskor !== null ? totalskor : 0 #" },
                            { field: "monitoring", title: "Frekuensi Monitoring", width: 120 },
                            { field: "keterangan", title: "Keterangan", width: 120 },
                        ],
                    };
                });
            }

            $scope.tambahEws = function () {
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
            $scope.goEws = function () {
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
                    if ($scope.belumBeres == true) {
                        toastr.info("Selesaikan terlebih dahulu EWS sebelumnya!")
                        return
                    }
                    $scope.tampilanDepan = false;
                    $scope.ewsdewasabaru = true;
                    $scope.haha = false;
                    $scope.isSimpan = true;
                    jenisews = 'EWS DEWASA (BARU)'
                    $scope.popUpTambahEdukasi.close();
                }
                else if ($scope.dataSelectedJenis.jenisews == "PEWS ANAK") {
                    if ($scope.belumBeres == true) {
                        toastr.info("Selesaikan terlebih dahulu EWS sebelumnya!")
                        return
                    }
                    $scope.tampilanDepan = false;
                    $scope.pews = true;
                    $scope.haha = false;
                    $scope.isSimpan = true;
                    jenisews = 'PEWS ANAK'
                    $scope.popUpTambahEdukasi.close();
                }
                else if ($scope.dataSelectedJenis.jenisews == "MEOWS") {
                    if ($scope.belumBeres == true) {
                        toastr.info("Selesaikan terlebih dahulu EWS sebelumnya!")
                        return
                    }
                    $scope.tampilanDepan = false;
                    $scope.meows = true;
                    $scope.haha = false;
                    $scope.isSimpan = true;
                    jenisews = 'MEOWS'
                    $scope.popUpTambahEdukasi.close();
                }
            }
                        $scope.saveEws = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    var currentId = arrobj[i];
                    var currentObj = $scope.item.obj[parseInt(currentId)];
                    arrSave.push({ id: currentId, values: currentObj });
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
                medifirstService.post('emr/save-emr-new', jsonSave).then(function (e) {
                    $scope.tampilanDepan = true;
                    $scope.ewsanak28 = false;
                    $scope.ewsanak1 = false;
                    $scope.ewsanak15 = false;
                    $scope.ewsanak511 = false;
                    $scope.ewsanak1216 = false;
                    $scope.ewsdewasa = false;
                    $scope.ewshamil = false;
                    $scope.ewsdewasabaru = false;
                    $scope.pews = false;
                    $scope.meows = false;
                    $scope.haha = false;
                    $scope.isUpdate = false;
                    sum2 = ''; sum1 = ''; sum3 = ''; sum4 = ''; sum5 = ''; sum6 = ''; sum7 = ''; sum8 = '';
                    keterangan = ''; jenisews = ''; flag = '';
                    loadHistoryEws();
                });
            }
            $scope.kembaliEws = function () {
                $scope.tampilanDepan = true;
                $scope.ewsanak28 = false;
                $scope.ewsanak1 = false;
                $scope.ewsanak15 = false;
                $scope.ewsanak511 = false;
                $scope.ewsanak1216 = false;
                $scope.ewsdewasa = false;
                $scope.ewshamil = false;
                $scope.ewsdewasabaru = false;
                $scope.pews = false;
                $scope.meows = false;
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
            $scope.lihatEws = function () {
                debugger
                if ($scope.dataSelected.noregistrasi == undefined) {
                    toastr.error('Pilih data dahulu !')
                    return
                }
                let emrpasienfk = $scope.dataSelected.emrpasienfk
                if ($scope.dataSelected.jenisews[0] == 'EWS ANAK < 28 HARI') {
                    $scope.tampilanDepan = false;
                    $scope.ewsanak28 = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS ANAK < 1 TAHUN') {
                    $scope.tampilanDepan = false;
                    $scope.ewsanak1 = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS ANAK 1 - 5 TAHUN') {
                    $scope.tampilanDepan = false;
                    $scope.ewsanak15 = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS ANAK 5 - 11 TAHUN') {
                    $scope.tampilanDepan = false;
                    $scope.ewsanak511 = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS ANAK 12 - 16 TAHUN') {
                    $scope.tampilanDepan = false;
                    $scope.ewsanak1216 = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS DEWASA') {
                    $scope.tampilanDepan = false;
                    $scope.ewsdewasa = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS OBSTETRI / IBU HAMIL') {
                    $scope.tampilanDepan = false;
                    $scope.ewshamil = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'EWS DEWASA (BARU)') {
                    $scope.tampilanDepan = false;
                    $scope.ewsdewasabaru = true;
                    $scope.isSimpan = true;
                    $scope.isUpdate = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'PEWS ANAK') {
                    $scope.tampilanDepan = false;
                    $scope.pews = true;
                    $scope.isSimpan = true;
                    $scope.isUpdate = true;
                    loadDataEws($scope.dataSelected.noregistrasi, $scope.dataSelected.tgl, emrpasienfk)
                }
                if ($scope.dataSelected.jenisews[0] == 'MEOWS') {
                    $scope.tampilanDepan = false;
                    $scope.meows = true;
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

                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=ews", true).then(function (dat) {
                    $scope.isRouteLoading = false

                    if (dat.data.data.length > 0) {
                        setobjectToModel(emrpasienfk2, $scope.cc.emrfk, tglEws)
                    }
                })
            }
                        function setobjectToModel(nomorEMRSS, emrfk, tglEws2) {
                medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk + "&tgl=" + tglEws2, true).then(function (dat) {
                    $scope.isLoading = false
                    var chekedd = false
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    
                    let dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].nilai != null ? dataLoad[i].nilai : dataLoad[i].value;
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].nilai == '1' || dataLoad[i].value == '1' || dataLoad[i].value == 'true') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            }
                            if (dataLoad[i].type == "datetime" || dataLoad[i].type == "time" || dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].nilai != null ? dataLoad[i].nilai : dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].nilai != null ? dataLoad[i].nilai : dataLoad[i].value;
                                $scope.item.obj2[dataLoad[i].emrdfk] = true
                            }
                            if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].nilai != null ? dataLoad[i].nilai : dataLoad[i].value;
                            }
                            
                            let val = dataLoad[i].nilai != null ? dataLoad[i].nilai : dataLoad[i].value;
                            if (dataLoad[i].emrdfk == 2777 || dataLoad[i].emrdfk == 7752) sum2 = val;
                            if (dataLoad[i].emrdfk == 7753) sum1 = val;
                            if (dataLoad[i].emrdfk == 7754) sum3 = val;
                            if (dataLoad[i].emrdfk == 7755) sum4 = val;
                            if (dataLoad[i].emrdfk == 7756) sum5 = val;
                            if (dataLoad[i].emrdfk == 7757) sum6 = val;
                            if (dataLoad[i].emrdfk == 7758) sum7 = val;
                            if (dataLoad[i].emrdfk == 7759) sum8 = val;
                            if (dataLoad[i].emrdfk == 2778) keterangan = val;
                            if (dataLoad[i].emrdfk == 2792) jenisews = val;
                            if (dataLoad[i].emrdfk == 2833) flag = val;
                        }
                    }

                    $scope.isUpdate = true
                    if (jenisews) {
                        if (jenisews === 'EWS ANAK < 28 HARI') { $scope.ewsanak28 = true }
                        if (jenisews === 'EWS ANAK < 1 TAHUN') { $scope.ewsanak1 = true }
                        if (jenisews === 'EWS ANAK 1 - 5 TAHUN') { $scope.ewsanak15 = true }
                        if (jenisews === 'EWS ANAK 5 - 11 TAHUN') { $scope.ewsanak511 = true }
                        if (jenisews === 'EWS ANAK 12 - 16 TAHUN') { $scope.ewsanak1216 = true }
                        if (jenisews === 'EWS DEWASA') { $scope.ewsdewasa = true }
                        if (jenisews === 'EWS OBSTETRI / IBU HAMIL') { $scope.ewshamil = true }
                        if (jenisews === 'EWS DEWASA (BARU)') { $scope.ewsdewasabaru = true }
                        if (jenisews === 'PEWS ANAK') { $scope.pews = true }
                        if (jenisews === 'MEOWS') { $scope.meows = true }
                        $scope.tampilanDepan = false;
                        $scope.haha = true;
                    }
                    LoadCacheHelper();
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

            $scope.cekUrutan = function (current, previous) {
                if ($scope.item.obj[current] && !$scope.item.obj[previous]) {
                    $scope.item.obj[current] = null
                    toastr.warning('Isi kolom sebelumnya terlebih dahulu!')
                }
            };

            // $scope.cekCheckbox = function(id) {
            //     const mapping = [
            //         { atas: 7728, bawah: 7736 },
            //         { atas: 7729, bawah: 7737 },
            //         { atas: 7730, bawah: 7738 },
            //         { atas: 7731, bawah: 7739 },
            //         { atas: 7732, bawah: 7740 },
            //         { atas: 7733, bawah: 7741 },
            //         { atas: 7734, bawah: 7742 },
            //         { atas: 7735, bawah: 7743 },
            //     ];

            //     const idx = mapping.findIndex(m => m.atas === id || m.bawah === id)
            //     if (idx <= 0) return

            //     const prev = mapping[idx - 1]
            //     const prevAtas = $scope.item.obj[prev.atas]
            //     const prevBawah = $scope.item.obj[prev.bawah]

            //     if (!prevAtas && !prevBawah) {
            //         $scope.item.obj[id] = false
            //         toastr.warning('Harap isi salah satu checkbox di kolom sebelumnya terlebih dahulu!')
            //     }
            // }

            // $scope.cekCheckbox2 = function(id) {
            //     const mapping = [
            //         { atas: 8049, bawah: 8057 },
            //         { atas: 8050, bawah: 8058 },
            //         { atas: 8051, bawah: 8059 },
            //         { atas: 8052, bawah: 8060 },
            //         { atas: 8053, bawah: 8061 },
            //         { atas: 8054, bawah: 8062 },
            //         { atas: 8055, bawah: 8063 },
            //     ];

            //     const idx = mapping.findIndex(m => m.atas === id || m.bawah === id)
            //     if (idx <= 0) return

            //     const prev = mapping[idx - 1]
            //     const prevAtas = $scope.item.obj[prev.atas]
            //     const prevBawah = $scope.item.obj[prev.bawah]

            //     if (!prevAtas && !prevBawah) {
            //         $scope.item.obj[id] = false
            //         toastr.warning('Harap isi salah satu checkbox di kolom sebelumnya terlebih dahulu!')
            //     }
            // }

            // $scope.validateCheckbox = function(id) {
            //     // bikin peraturan
            //     const rules = {
            //         7745: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7761: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7769: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7777: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7785: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7793: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7801: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7809: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7817: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7825: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7833: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7841: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7849: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7857: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7865: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7873: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7881: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7889: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],
            //         7897: [7744, 7760, 7768, 7776, 7784, 7792, 7800, 7808, 7816, 7824, 7832, 7840, 7848, 7856, 7864, 7872, 7880, 7888, 7896],

            //         7746: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7762: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7770: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7778: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7786: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7794: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7802: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7810: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7818: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7826: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7834: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7842: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7850: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7858: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7866: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7874: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7882: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7890: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],
            //         7898: [7745, 7761, 7769, 7777, 7785, 7793, 7801, 7809, 7817, 7825, 7833, 7841, 7849, 7857, 7865, 7873, 7881, 7889, 7897],

            //         7747: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7763: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7771: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7779: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7787: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7795: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7803: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7811: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7819: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7827: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7835: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7843: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7851: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7859: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7867: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7875: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7883: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7891: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],
            //         7899: [7746, 7762, 7770, 7778, 7786, 7794, 7802, 7810, 7818, 7826, 7834, 7842, 7850, 7858, 7866, 7874, 7882, 7890, 7898],

            //         7348: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7764: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7772: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7780: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7788: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7796: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7804: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7813: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7820: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7828: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7837: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7845: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7852: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7860: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7868: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7876: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7884: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7892: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],
            //         7900: [7747, 7763, 7771, 7779, 7787, 7795, 7803, 7811, 7819, 7827, 7835, 7843, 7851, 7859, 7867, 7875, 7883, 7891, 7899],

            //         7749: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7765: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7773: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7781: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7789: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7797: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7805: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7813: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7821: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7829: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7837: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7845: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7853: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7861: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7869: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7877: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7885: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7893: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],
            //         7901: [7748, 7764, 7772, 7780, 7788, 7796, 7804, 7812, 7820, 7828, 7836, 7844, 7852, 7860, 7868, 7876, 7884, 7892, 7900],

            //         7750: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7766: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7774: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7782: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7790: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7798: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7806: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7814: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7822: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7830: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7838: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7846: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7854: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7862: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7870: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7878: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7886: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7894: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7902: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],

            //         7751: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7767: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7775: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7783: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7791: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7799: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7807: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7815: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7823: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7831: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7839: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7847: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7855: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7863: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7871: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7879: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7887: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7895: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],
            //         7903: [7749, 7765, 7773, 7781, 7789, 7797, 7805, 7813, 7821, 7829, 7837, 7845, 7853, 7861, 7869, 7877, 7885, 7893, 7901],

            //         7905: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7913: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7921: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7929: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7937: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7945: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7953: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7961: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7969: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7977: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7985: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         7993: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],
            //         8001: [7904, 7912, 7920, 7928, 7936, 7944, 7952, 7960, 7968, 7976, 7984, 7992, 8000],

            //         7906: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7914: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7922: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7930: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7938: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7946: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7954: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7962: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7970: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7978: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7986: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         7994: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],
            //         8002: [7905, 7913, 7921, 7929, 7937, 7945, 7953, 7961, 7969, 7977, 7985, 7993, 8001],

            //         7907: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7915: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7923: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7931: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7939: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7947: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7955: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7963: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7971: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7979: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7987: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         7995: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],
            //         8003: [7906, 7914, 7922, 7930, 7938, 7946, 7954, 7962, 7970, 7978, 7986, 7994, 8002],

            //         7908: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7916: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7924: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7932: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7940: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7948: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7956: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7964: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7972: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7980: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7988: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         7996: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],
            //         8004: [7907, 7915, 7923, 7931, 7939, 7947, 7955, 7963, 7971, 7979, 7987, 7995, 8003],

            //         7909: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7917: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7925: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7933: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7941: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7949: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7957: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7965: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7973: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7981: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7989: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         7997: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],
            //         8005: [7908, 7916, 7924, 7932, 7940, 7948, 7956, 7964, 7972, 7980, 7988, 7996, 8004],

            //         7910: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7918: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7926: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7934: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7942: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7950: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7958: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7966: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7974: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7982: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7990: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         7998: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],
            //         8006: [7909, 7917, 7925, 7933, 7941, 7949, 7957, 7965, 7973, 7981, 7989, 7997, 8005],

            //         7911: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7919: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7927: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7935: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7943: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7951: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7959: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7967: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7975: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7983: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7991: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         7999: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],
            //         8007: [7910, 7918, 7926, 7934, 7942, 7950, 7958, 7966, 7974, 7982, 7990, 7998, 8006],

            //         8009: [8008, 8016, 8024, 8032, 8040],
            //         8017: [8008, 8016, 8024, 8032, 8040],
            //         8025: [8008, 8016, 8024, 8032, 8040],
            //         8033: [8008, 8016, 8024, 8032, 8040],
            //         8041: [8008, 8016, 8024, 8032, 8040],

            //         8010: [8009, 8017, 8025, 8033, 8041],
            //         8018: [8009, 8017, 8025, 8033, 8041],
            //         8026: [8009, 8017, 8025, 8033, 8041],
            //         8034: [8009, 8017, 8025, 8033, 8041],
            //         8042: [8009, 8017, 8025, 8033, 8041],

            //         8011: [8010, 8018, 8026, 8034, 8042],
            //         8019: [8010, 8018, 8026, 8034, 8042],
            //         8027: [8010, 8018, 8026, 8034, 8042],
            //         8035: [8010, 8018, 8026, 8034, 8042],
            //         8043: [8010, 8018, 8026, 8034, 8042],

            //         8012: [8011, 8019, 8027, 8035, 8043],
            //         8020: [8011, 8019, 8027, 8035, 8043],
            //         8028: [8011, 8019, 8027, 8035, 8043],
            //         8036: [8011, 8019, 8027, 8035, 8043],
            //         8044: [8011, 8019, 8027, 8035, 8043],

            //         8013: [8012, 8020, 8028, 8036, 8044],
            //         8021: [8012, 8020, 8028, 8036, 8044],
            //         8029: [8012, 8020, 8028, 8036, 8044],
            //         8037: [8012, 8020, 8028, 8036, 8044],
            //         8045: [8012, 8020, 8028, 8036, 8044],

            //         8014: [8013, 8021, 8029, 8037, 8045],
            //         8022: [8013, 8021, 8029, 8037, 8045],
            //         8030: [8013, 8021, 8029, 8037, 8045],
            //         8038: [8013, 8021, 8029, 8037, 8045],
            //         8046: [8013, 8021, 8029, 8037, 8045],

            //         8015: [8014, 8022, 8030, 8038, 8046],
            //         8023: [8014, 8022, 8030, 8038, 8046],
            //         8031: [8014, 8022, 8030, 8038, 8046],
            //         8039: [8014, 8022, 8030, 8038, 8046],
            //         8047: [8014, 8022, 8030, 8038, 8046],

            //         8146: [8145, 8153, 8161, 8169, 8177, 8185],
            //         8154: [8145, 8153, 8161, 8169, 8177, 8185],
            //         8162: [8145, 8153, 8161, 8169, 8177, 8185],
            //         8170: [8145, 8153, 8161, 8169, 8177, 8185],
            //         8178: [8145, 8153, 8161, 8169, 8177, 8185],
            //         8186: [8145, 8153, 8161, 8169, 8177, 8185],

            //         8147: [8146, 8154, 8162, 8170, 8178, 8186],
            //         8155: [8146, 8154, 8162, 8170, 8178, 8186],
            //         8163: [8146, 8154, 8162, 8170, 8178, 8186],
            //         8171: [8146, 8154, 8162, 8170, 8178, 8186],
            //         8179: [8146, 8154, 8162, 8170, 8178, 8186],
            //         8187: [8146, 8154, 8162, 8170, 8178, 8186],

            //         8148: [8147, 8155, 8163, 8171, 8179, 8187],
            //         8156: [8147, 8155, 8163, 8171, 8179, 8187],
            //         8164: [8147, 8155, 8163, 8171, 8179, 8187],
            //         8172: [8147, 8155, 8163, 8171, 8179, 8187],
            //         8180: [8147, 8155, 8163, 8171, 8179, 8187],
            //         8188: [8147, 8155, 8163, 8171, 8179, 8187],

            //         8149: [8148, 8156, 8164, 8172, 8180, 8188],
            //         8157: [8148, 8156, 8164, 8172, 8180, 8188],
            //         8165: [8148, 8156, 8164, 8172, 8180, 8188],
            //         8173: [8148, 8156, 8164, 8172, 8180, 8188],
            //         8181: [8148, 8156, 8164, 8172, 8180, 8188],
            //         8189: [8148, 8156, 8164, 8172, 8180, 8188],

            //         8150: [8149, 8157, 8165, 8173, 8181, 8189],
            //         8158: [8149, 8157, 8165, 8173, 8181, 8189],
            //         8166: [8149, 8157, 8165, 8173, 8181, 8189],
            //         8174: [8149, 8157, 8165, 8173, 8181, 8189],
            //         8182: [8149, 8157, 8165, 8173, 8181, 8189],
            //         8190: [8149, 8157, 8165, 8173, 8181, 8189],

            //         8151: [8150, 8158, 8166, 8174, 8182, 8190],
            //         8159: [8150, 8158, 8166, 8174, 8182, 8190],
            //         8167: [8150, 8158, 8166, 8174, 8182, 8190],
            //         8175: [8150, 8158, 8166, 8174, 8182, 8190],
            //         8183: [8150, 8158, 8166, 8174, 8182, 8190],
            //         8191: [8150, 8158, 8166, 8174, 8182, 8190],

            //         8152: [8151, 8159, 8167, 8175, 8183, 8191],
            //         8160: [8151, 8159, 8167, 8175, 8183, 8191],
            //         8168: [8151, 8159, 8167, 8175, 8183, 8191],
            //         8176: [8151, 8159, 8167, 8175, 8183, 8191],
            //         8184: [8151, 8159, 8167, 8175, 8183, 8191],
            //         8192: [8151, 8159, 8167, 8175, 8183, 8191],

            //         8065: [8064, 8072, 8080, 8088],
            //         8073: [8064, 8072, 8080, 8088],
            //         8081: [8064, 8072, 8080, 8088],
            //         8089: [8064, 8072, 8080, 8088],

            //         8066: [8065, 8073, 8081, 8089],
            //         8074: [8065, 8073, 8081, 8089],
            //         8082: [8065, 8073, 8081, 8089],
            //         8090: [8065, 8073, 8081, 8089],

            //         8067: [8066, 8074, 8082, 8090],
            //         8075: [8066, 8074, 8082, 8090],
            //         8083: [8066, 8074, 8082, 8090],
            //         8091: [8066, 8074, 8082, 8090],

            //         8068: [8067, 8075, 8083, 8091],
            //         8076: [8067, 8075, 8083, 8091],
            //         8084: [8067, 8075, 8083, 8091],
            //         8092: [8067, 8075, 8083, 8091],

            //         8069: [8068, 8076, 8084, 8092],
            //         8077: [8068, 8076, 8084, 8092],
            //         8085: [8068, 8076, 8084, 8092],
            //         8093: [8068, 8076, 8084, 8092],

            //         8070: [8069, 8077, 8085, 8093],
            //         8078: [8069, 8077, 8085, 8093],
            //         8086: [8069, 8077, 8085, 8093],
            //         8094: [8069, 8077, 8085, 8093],

            //         8071: [8070, 8078, 8086, 8094],
            //         8079: [8070, 8078, 8086, 8094],
            //         8087: [8070, 8078, 8086, 8094],
            //         8095: [8070, 8078, 8086, 8094],
            //     }

            //     // kalo ga ada rule untuk checkbox itu, skip
            //     if (!rules[id]) return

            //     // ambil daftar id yang harus dicek dulu
            //     const required = rules[id]

            //     // cek apakah salah satunya udah dicentang
            //     const valid = required.some(dep => $scope.item.obj[dep])

            //     // kalo belum, balikin ke false
            //     if (!valid && $scope.item.obj[id]) {
            //         $scope.item.obj[id] = false
            //         toastr.warning('Isi kolom sebelumnya terlebih dahulu.')
            //     }
            // };




            $scope.cekCheckbox = function (id) {
                const groups = [
                    1901302624, // Kesadaran
                    7728, // Kesadaran
                    1901303032, // Pain
                    1901303048, // Discharge
                    1901303064, // Proteinuria
                    1901302984,  // Penggunaan Oksigen (Menggantikan fungsi cekCheckbox2 lama)
                    8048  // Penggunaan Oksigen (Menggantikan fungsi cekCheckbox2 lama)
                ];

                let startId = null;

                for (let i = 0; i < groups.length; i++) {
                    // Tiap grup punya 16 elemen (2 baris x 8 kolom).
                    if (id >= groups[i] && id <= groups[i] + 15) {
                        startId = groups[i];
                        break;
                    }
                }

                if (!startId) return; // Jika tidak ketemu, abaikan

                let col = (id - startId) % 8;

                if (col === 0) return;

                let prevColAtas = startId + (col - 1);
                let prevColBawah = startId + 8 + (col - 1); // +8 karena lompat ke baris bawahnya

                const isPrevFilled = $scope.item.obj[prevColAtas] || $scope.item.obj[prevColBawah];

                if (!isPrevFilled) {
                    $scope.item.obj[id] = false;
                    toastr.warning('Harap isi salah satu checkbox di kolom sebelumnya terlebih dahulu!');
                }
            };

            $scope.cekCheckbox2 = function (id) {
                $scope.cekCheckbox(id);
            };


            $scope.validateCheckbox = function (id) {
                const groups = [
                    { start: 1901302640, rows: 19 }, // Sistolik
                    { start: 7744, rows: 19 }, // Sistolik
                    { start: 1901302792, rows: 13 }, // Nadi
                    { start: 7904, rows: 13 }, // Nadi
                    { start: 1901302896, rows: 5 },  // Pernafasan
                    { start: 8008, rows: 5 },  // Pernafasan
                    { start: 1901302936, rows: 6 },  // Suhu
                    { start: 8145, rows: 6 },  // Suhu
                    { start: 1901303000, rows: 4 },   // Saturasi
                    { start: 8064, rows: 4 }   // Saturasi
                ];

                let activeGroup = null;

                // Cari grup mana yang diklik
                for (let i = 0; i < groups.length; i++) {
                    let endId = groups[i].start + (groups[i].rows * 8) - 1;
                    if (id >= groups[i].start && id <= endId) {
                        activeGroup = groups[i];
                        break;
                    }
                }

                if (!activeGroup) return;

                let col = (id - activeGroup.start) % 8;

                if (col === 0) return;

                let isPrevFilled = false;
                for (let r = 0; r < activeGroup.rows; r++) {
                    let prevDepId = activeGroup.start + (r * 8) + (col - 1);
                    if ($scope.item.obj[prevDepId]) {
                        isPrevFilled = true;
                        break;
                    }
                }

                if (!isPrevFilled && $scope.item.obj[id]) {
                    $scope.item.obj[id] = false;
                    toastr.warning('Isi baris observasi di kolom sebelumnya terlebih dahulu.');
                }
            };
            //    $scope.cekCheckbox3 = function() {
            //         const mapping = [
            //             { atas: 8048, bawah: 8056 },
            //             { atas: 8049, bawah: 8057 },
            //             { atas: 8050, bawah: 8058 },
            //             { atas: 8051, bawah: 8059 },
            //             { atas: 8052, bawah: 8060 },
            //             { atas: 8053, bawah: 8061 },
            //             { atas: 8054, bawah: 8062 },
            //             { atas: 8055, bawah: 8063 },
            //         ];

            //         const jamIds = [7712, 7713, 7714, 7715, 7716, 7717, 7718, 7719];

            //         // 🔸 Cek apakah ada pasangan Ya & Tidak yang dua-duanya tercentang
            //         for (const m of mapping) {
            //             const yaChecked = $scope.item.obj[m.atas] === true;
            //             const tidakChecked = $scope.item.obj[m.bawah] === true;

            //             if (yaChecked && tidakChecked) {
            //                 toastr.warning('Pilih hanya satu checkbox: Ya atau Tidak!');
            //                 return;
            //             }
            //         }

            //         // 🔸 Cari indeks pertama "Ya" dan terakhir "Tidak"
            //         const firstYaIndex = mapping.findIndex(m => $scope.item.obj[m.atas]);
            //         const lastTidakIndex = mapping.map(m => $scope.item.obj[m.bawah]).lastIndexOf(true);

            //         if (firstYaIndex !== -1 && lastTidakIndex !== -1 && lastTidakIndex > firstYaIndex) {
            //             const jamAwal = $scope.item.obj[jamIds[firstYaIndex]];
            //             const jamAkhir = $scope.item.obj[jamIds[lastTidakIndex]];

            //             if (jamAwal && jamAkhir) {
            //                 const start = moment(jamAwal, 'HH:mm');
            //                 const end = moment(jamAkhir, 'HH:mm');

            //                 let durasiJam = end.diff(start, 'hours', true);

            //                 if (durasiJam <= 0) {
            //                     toastr.warning('Jam akhir harus lebih besar dari jam awal!');
            //                     return;
            //                 }

            //                 // 🔹 kalau < 1 jam, tetap dihitung 1
            //                 durasiJam = durasiJam < 1 ? 1 : Math.ceil(durasiJam);

            //                 console.log("Durasi oksigen:", durasiJam, "jam");

            //                 // 🔹 Panggil fungsi simpan ke backend
            //                 saveBiayaOksigen(
            //                     $scope.cc.noregistrasi,
            //                     $scope.cc.norecterakhir,
            //                     $scope.cc.norec_pd,
            //                     $scope.cc.objectruanganterakhir,
            //                     $scope.cc.departementerakhir,
            //                     $scope.cc.iddokter,
            //                     durasiJam
            //                 );

            //                 toastr.success('Durasi oksigen ' + durasiJam + ' jam tersimpan.');
            //             }
            //         }
            //     };

            //     $scope.sudahSimpanOksigen = {}; 

            //       $scope.cekCheckbox3 = function () {

            //     if (!$scope.sudahSimpanOksigen) {
            //         $scope.sudahSimpanOksigen = {}; 
            //     }

            //     const mapping = [
            //         { atas: 8048, bawah: 8056 }, // blok 1
            //         { atas: 8049, bawah: 8057 }, // blok 2
            //         { atas: 8050, bawah: 8058 }, // blok 3
            //         { atas: 8051, bawah: 8059 }, // blok 4
            //         { atas: 8052, bawah: 8060 }, // blok 5
            //         { atas: 8053, bawah: 8061 }, // blok 6
            //         { atas: 8054, bawah: 8062 }, // blok 7
            //         { atas: 8055, bawah: 8063 }, // blok 8
            //     ];

            //     const jamIds = [7712, 7713, 7714, 7715, 7716, 7717, 7718, 7719];
            //     const tanggalIds = [7720, 7721, 7722, 7723, 7724, 7725, 7726, 7727];

            //     // Cek per blok
            //     for (let i = 0; i < mapping.length - 1; i++) {

            //         const ya = $scope.item.obj[mapping[i].atas];
            //         const tidak = $scope.item.obj[mapping[i + 1].bawah];

            //         // blok valid = atas YA dan bawah berikutnya TIDAK
            //         if (ya && tidak) {

            //             // ✔ jika sudah pernah disimpan → skip
            //             if ($scope.sudahSimpanOksigen[i]) {
            //                 continue;
            //             }

            //             const jamAwal = $scope.item.obj[jamIds[i]];
            //             const jamAkhir = $scope.item.obj[jamIds[i + 1]];
            //             const tglAwal = $scope.item.obj[tanggalIds[i]];
            //             const tglAkhir = $scope.item.obj[tanggalIds[i + 1]];

            //             if (!jamAwal || !jamAkhir || !tglAwal || !tglAkhir) {
            //                 toastr.warning("Tanggal & Jam harus lengkap pada blok " + (i+1));
            //                 continue;
            //             }

            //             // Jam adalah object Date
            //             const startMoment = moment(tglAwal).set({
            //                 hour: jamAwal.getHours(),
            //                 minute: jamAwal.getMinutes()
            //             });

            //             const endMoment = moment(tglAkhir).set({
            //                 hour: jamAkhir.getHours(),
            //                 minute: jamAkhir.getMinutes()
            //             });

            //             let durasiJam = endMoment.diff(startMoment, "hours", true);
            //             durasiJam = durasiJam < 1 ? 1 : Math.ceil(durasiJam);

            //             console.log("Durasi blok " + (i+1), durasiJam);

            //             saveBiayaOksigen(
            //                 $scope.cc.noregistrasi,
            //                 $scope.cc.norecterakhir,
            //                 $scope.cc.norec_pd,
            //                 $scope.cc.objectruanganterakhir,
            //                 $scope.cc.departementerakhir,
            //                 $scope.cc.iddokter,
            //                 durasiJam
            //             );

            //             toastr.success(
            //                 "Durasi oksigen blok " + (i+1) + " tersimpan: " + durasiJam + " jam"
            //             );

            //             // Tandai blok sudah disimpan
            //             $scope.sudahSimpanOksigen[i] = true;
            //         }
            //     }
            // };



            //         function saveBiayaOksigen(noregistrasi, norecterakhir, norec_pd, objectruanganterakhir, departementerakhir, iddokter, durasiJam) {
            //             var data = {
            //                 noregistrasi: noregistrasi,
            //                 norec_apd: norecterakhir,
            //                 norec_pd: norec_pd,
            //                 idruangan: objectruanganterakhir,
            //                 objectdepartemenfk: departementerakhir,
            //                 idpegawai: iddokter,
            //                 jenisPel: 1,
            //                 qty: durasiJam
            //             };

            //             medifirstService.post('registrasi/save-biaya-oksigen', data).then(function (e) {
            //                 if (e.status === 201) {
            //                     toastr.success('Biaya oksigen berhasil disimpan');
            //                 } else {
            //                     toastr.warning('Gagal menyimpan biaya oksigen');
            //                 }
            //             });
            //         }

        }
    ])
})