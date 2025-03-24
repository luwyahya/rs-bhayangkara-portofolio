define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RujukanLuarLaboratoriumCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
    function ($mdDialog, $timeout, $parse, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
        $scope.item = {}
        $scope.item.obj = {};
        $scope.dataSelected = {};
        $scope.cc = {};
        $scope.cc.emrfk = 895;
        $scope.now = new Date();
        $scope.hambatan = false
        $scope.isHambatanlain = false
        $scope.namaBahasa = false;
        $scope.namaKepercayaan = false;
        $scope.lainlain = false;
        $scope.lainlaintinggal = false;
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = ''
        var lanjut = false;
        var dataLoad = []
        var norec_apd = ''
        var norec_pd = ''
        var norecPPas = ''
        var dataadmisi = []
        var datadokter = []
        var dataperawat = []
        var datafisio = []
        var dataapoteker = []
        var datagizi = []
        var namaRuangan = ''
        var namaRuanganFk = ''
        var departemenfk = ''
        var tglpulang = ''
        var norec_so = ''
        loadCombo()
        LoadCacheHelper()

        function loadCombo() {
            medifirstService.get("radiologi/get-data-combo-luarlab").then(function (dat) {
                $scope.listJenisPelayanan = dat.data.dataPelayanan;

            })
        }


        function LoadCacheHelper() {
            debugger
            var chacePeriode = cacheHelper.get('RujukanLuarLaboratorium');
            if (chacePeriode != undefined) {
                $scope.item.noMr = chacePeriode[0]
                $scope.item.namaPasien = chacePeriode[1]
                $scope.item.jenisKelamin = chacePeriode[2]
                $scope.item.noregistrasi = chacePeriode[3]
                $scope.item.kelompokPasien = chacePeriode[13]
                $scope.item.umur = chacePeriode[4]
                $scope.listKelas = ([{
                    id: chacePeriode[5],
                    namakelas: chacePeriode[6]
                }])
                $scope.item.kelas = {
                    id: chacePeriode[5],
                    namakelas: chacePeriode[6]
                }
                $scope.item.tglRegistrasi = chacePeriode[7]
                $scope.item.dokter = chacePeriode[14]
                norec_apd = chacePeriode[8]
                namaRuangan = chacePeriode[9]
                namaRuanganFk = chacePeriode[10]
                norec_pd = chacePeriode[11]
                norec_so = chacePeriode[12]
                departemenfk = chacePeriode[16]
                $scope.item.jenisPenjamin = chacePeriode[17]
                $scope.item.golonganDarah = chacePeriode[19]
                tglpulang = chacePeriode[20]
                $scope.ruanganasaldirujuk = {
                    id: chacePeriode[21],
                    namaruangan: chacePeriode[22]
                }
                init()
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=formedukasi", true).then(function(dat) {
                $scope.isRouteLoading = false
               
            })
            // loadData()
        }

    
        
    
        $scope.simpan = function() {
            debugger
            var dataJson = {
                noregistrasi: $scope.item.noregistrasi,
                tglpelayanan: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm'),
                tglkirimsample: moment($scope.item.tglkirimsample).format('YYYY-MM-DD HH:mm'),
                namafaskes: $scope.item.namafaskes,
                jenispelayanan: $scope.item.jenispelayanan.jenispelayanan,
                jenispelayananfk: $scope.item.jenispelayanan.id,
                tarifluar: $scope.item.tarifLuar,
            }
            
            
            
            medifirstService.post('tatarekening/save-pemeriksaan-luar-lab', dataJson).then(function (e) {

                   
                        init()
                   
                });
        }
        $scope.simpanEdukasi = function() {
            let materiedukasi = ''
            let lamaedukasi = ''
            let hasilverifikasi = ''
            let leaflet = ''
            let tglredukasi = ''
            let agamafk = 0
            let agama = ''
            if ($scope.item.materiedukasi.caption == "Lain - Lain") {
                materiedukasi = $scope.item.lainlain
            } else {
                materiedukasi = $scope.item.materiedukasi.caption
            }
            if ($scope.item.lamaedukasi != undefined) {
                lamaedukasi = $scope.item.lamaedukasi.caption
            }
            if ($scope.item.hasilverifikasi != undefined) {
                hasilverifikasi = $scope.item.hasilverifikasi.caption
            }
            if ($scope.item.leaflet != undefined) {
                leaflet = $scope.item.leaflet.id
            }
            if ($scope.item.tglredukasi != undefined) {
                tglredukasi = moment($scope.item.tglredukasi).format('YYYY-MM-DD HH:mm')
            }
            let objSave = {
                tgljamedukasi: moment($scope.item.tgljamedukasi).format('YYYY-MM-DD HH:mm'),
                materiedukasi: materiedukasi,
                leaflet: leaflet,
                lamaedukasi: lamaedukasi,
                hasilverifikasi: hasilverifikasi,
                tglredukasi: tglredukasi,
                pemberiedukasi: $scope.item.pemberiedukasi.id,
                pasienkeluarga: $scope.item.pasienkeluarga,
                noregistrasifk: $scope.cc.norec_pd
            }
            medifirstService.post('emr/save-edukasi-pasien', objSave).then(function(e) {
                if (e.status == 201) {
                    $scope.item.tgljamedukasi = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    delete $scope.item.materiedukasi
                    delete $scope.item.lainlain
                    delete $scope.item.lamaedukasi
                    delete $scope.item.hasilverifikasi
                    delete $scope.item.leaflet
                    $scope.item.tglredukasi = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    delete $scope.item.pemberiedukasi
                    delete $scope.item.pasienkeluarga
                    loadEdukasi()
                }
            })
        }

        $scope.tutupEdukasi = function() {
            $scope.popUpTambahEdukasi.close()
        }
        $scope.hapusEdukasi = function() {
            if ($scope.dataSelected.norec == undefined) {
                toastr.error('Pilih Data Dahulu !')
                return
            }
            let objSave = {
                'norec': $scope.dataSelected.norec
            }
            medifirstService.post('emr/delete-edukasi', objSave).then(function(e) {
                loadEdukasi()
            })
        }
    }
])
})
