define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienLabRadRICtrl', ['$q', '$rootScope', '$scope', '$window', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper',
        function ($q, $rootScope, $scope, window, medifirstService, $state, cacheHelper, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.tombolSimpanVis = true
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarRIPenunjang');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                }
                else {
                    $scope.item.tglAwal = $scope.now;
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
            function loadCombo() {

                medifirstService.get("radiologi/get-combo", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganinap
                    $scope.listDokters = dat.data.dokter
                });
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kpid=" + $scope.item.kelompokPasien.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');
                medifirstService.get("laboratorium/get-datfar-pasien-ri-lab?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + kp
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                        }
                        $scope.dataGrid = dat.data;
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarRIPenunjang', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            // $scope.TransaksiPelayanan = function(){
            //     if ($scope.dataSelected.nostruklastfk !=null && $scope.dataSelected.rpp != null)
            //        {
            //             window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!")
            //             return
            //         }
            //     // debugger;
            //     var arrStr ={ 0 : $scope.dataSelected.nocm ,
            //         1 : $scope.dataSelected.namapasien,
            //         2 : $scope.dataSelected.jeniskelamin,
            //         3 : $scope.dataSelected.noregistrasi, 
            //         4 : $scope.dataSelected.umur,
            //         5 : $scope.dataSelected.klid,
            //         6 : $scope.dataSelected.namakelas,
            //         7 : $scope.dataSelected.tglregistrasi,
            //         8 : $scope.dataSelected.norec,
            //         9 : ''
            //     }
            //     cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
            //     $state.go('TransaksiPelayananApotik')
            // }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "70px",
                },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "100px",
                },
                // {
                //     "field": "namarekanan",
                //     "title": "namarekanan",
                //     "width" : "100px"//,
                //     //"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                // },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "130px",
                },
                {
                    "field": "namakelas",
                    "title": "Nama Kelas",
                    "width": "80px",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px",
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "100px",
                }
            ];
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
            function itungUsia(tgl) {
                debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
            }

            $scope.transaksiPelayanan = function () {
                //  ** cek status closing
                medifirstService.get("sysadmin/general/get-status-close/" + $scope.dataSelected.noregistrasi, false).then(function (rese) {
                    if (rese.data.status == true) {
                        toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                        $scope.isSelesaiPeriksa = true
                        return
                    } else {
                        $scope.listRuanganApd = []

                        $scope.listRuanganApd = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
                        $scope.item.ruanganAntrian = $scope.listRuanganApd[0]
                        $scope.popupAntrians.center().open()
                        delete $scope.item.dokterDPJP

                        $scope.dataPopUpAPD = [];

                        $scope.isRouteLoading = true;
                        medifirstService.get("laboratorium/get-detail-reg-lab-rad?" +
                            "noregistrasi=" + $scope.dataSelected.noregistrasi
                            , true).then(function (dat) {
                                $scope.isRouteLoading = false;
                                for (var i = 0; i < dat.data.length; i++) {
                                    dat.data[i].no = i + 1
                                }
                                $scope.dataPopUpAPD = dat.data;
                            });

                    }
                })
            }
            $scope.showRincian = function () {

                medifirstService.get("radiologi/get-apd?noregistrasi="
                    + $scope.dataSelected.noregistrasi
                ).then(function (data) {
                    $scope.daftarApd = data.data.ruangan;
                    if ($scope.daftarApd.length > 0) {
                        var status = false
                        var norec_apd = ''
                        for (var i = 0; i < $scope.daftarApd.length; i++) {
                            status = false
                            if ($scope.daftarApd[i].id == $scope.item.ruanganAntrian.id) {
                                status = true
                                norec_apd = $scope.daftarApd[i].norec_apd
                                break
                            }
                        }
                        if (status == true) {
                            $scope.lihatRincian(norec_apd)
                        } else {
                            $scope.saveKonsul()
                        }
                    }
                })


            }
            $scope.saveKonsul = function (argument) {
                if ($scope.dataSelectedPopUpAPD == undefined) {
                    toastr.error('Pilih data detail registrasi dulu')
                    return
                }
                if ($scope.item.dokterDpjp == undefined) {
                    toastr.error('Pilih Dokter DPJP')
                    return
                }
                $scope.tombolSimpanVis = false;
                var dataKonsul = {
                    "asalrujukanfk": 5, //datang sendiri
                    "norec_pd": $scope.dataSelected.norec,
                    "dokterfk": $scope.item.dokterDpjp.id,
                    "objectruangantujuanfk": $scope.item.ruanganAntrian.id,
                    "objectruanganasalfk": $scope.dataSelectedPopUpAPD.objectruanganfk,
                    "tglregistrasidate": moment($scope.dataSelected.tglregistrasi).format('YYYY-MM-DD'),
                }
                medifirstService.post('radiologi/save-apd', dataKonsul).then(function (e) {
                    $scope.tombolSimpanVis = true;
                    var norec_apd = e.data.data.norec
                    var arrStr = {
                        0: $scope.dataSelected.nocm,
                        1: $scope.dataSelected.namapasien,
                        2: $scope.dataSelected.jeniskelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.dataSelected.umur,
                        5: $scope.dataSelected.objectkelasfk,
                        6: $scope.dataSelected.namakelas,
                        7: $scope.dataSelected.tglregistrasi,
                        8: norec_apd,//NOREC ANTRIAN
                        9: $scope.dataSelected.namaruangan,
                        10: $scope.dataSelected.objectruanganlastfk,
                        11: $scope.dataSelected.norec,
                        12: "",//nor
                        13: $scope.dataSelected.kelompokpasien,
                        14: $scope.dataSelected.pgid,
                        15: $scope.item.ruanganAntrian.id,
                        16: $scope.item.ruanganAntrian.objectdepartemenfk,
                        17: $scope.dataSelected.rekanan
                    }
                    cacheHelper.set('RincianTagihanPenunjang', arrStr);
                    $state.go('RincianTagihanPenunjang')

                }, function (error) {
                    $scope.tombolSimpanVis = true;
                })
            }
            $scope.lihatRincian = function (norec_apd) {

                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.objectkelasfk,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: norec_apd,//NOREC ANTRIAN
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.objectruanganlastfk,
                    11: $scope.dataSelected.norec,
                    12: "",//nor
                    13: $scope.dataSelected.kelompokpasien,
                    14: $scope.dataSelected.pgid,
                    15: $scope.item.ruanganAntrian.id,
                    16: $scope.item.ruanganAntrian.objectdepartemenfk,
                    17: $scope.dataSelected.rekanan
                }
                cacheHelper.set('RincianTagihanPenunjang', arrStr);
                $state.go('RincianTagihanPenunjang')
            }

            $scope.columnPopUpAPD = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namakelas",
                    "title": "Kelas",
                    "width": "100px"
                },
                {
                    "field": "tglmasuk",
                    "title": "Tgl Masuk",
                    "width": "100px"
                },
                {
                    "field": "tglkeluar",
                    "title": "Tgl Keluar",
                    "width": "100px"
                }
            ];

            $scope.klikPopUpAPD = function (e) {
                delete $scope.item.dokterDPJP

                $scope.item.dokterDpjp = { id: e.pgid, namakengkap: e.namadokter }
            }
            //***********************************

        }
    ]);
});
