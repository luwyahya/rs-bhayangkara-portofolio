define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DataPegawaiSudahInputCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.isRouteLoading = false;
        $scope.item = {};
        $scope.model = {};
        $scope.dataSelectedPegawai = {};
        var dataGrid = [];
        var dataGrid2 = [];
        var dataGrid3 = [];
        var dataGrid4 = [];
        var dataGrid5 = [];
        var dataGrid6 = [];
        var dataGrid7 = [];
        var dataGrid8 = [];
        var dataGrid9 = [];
        var dataGrid10 = [];
        var dataGrid11 = [];
        var dataGrid12 = [];
        var dataGrid13 = [];
        var dataGrid14 = [];
        var dataRekap = [];
        var dataRekap2 = [];
        var dataRekap3 = [];
        $scope.show1 = false;
        $scope.show2 = true;
        $scope.show3 = true;
        $scope.show4 = true;
        $scope.show5 = true;
        $scope.show6 = true;
        $scope.pegawai = false;
        $scope.pegawai2 = false;
        $scope.pegawai3 = false;
        $scope.pegawai4 = false;
        $scope.pegawai5 = false;
        $scope.pegawai6 = false;
        loadCombo();
        // loadData()

        function loadCombo() {
            medifirstService.get('sdm/get-combo-2?').then(function(dat) {
                $scope.listInstalasi = dat.data.instalasi;
                $scope.listRuangan = dat.data.ruangan;
                $scope.listUnitKerja = dat.data.unitKerja;
            })
        }

        $scope.search = function() {
            clearArray()
            loadData()
        }
        $scope.searchRekap = function() {
            clearArrayRekap()
            loadDataRekap()
        }

        function clearArrayRekap() {
            dataRekap = [];
            dataRekap2 = [];
            dataRekap3 = [];
        }

        function clearArray() {
            dataGrid = [];
            dataGrid2 = [];
            dataGrid3 = [];
            dataGrid4 = [];
            dataGrid5 = [];
            dataGrid6 = [];
            dataGrid7 = [];
            dataGrid8 = [];
            dataGrid9 = [];
            dataGrid10 = [];
            dataGrid11 = [];
            dataGrid12 = [];
            dataGrid13 = [];
            dataGrid14 = [];
        }

        function loadData() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            // var pnsnonmedis = '';

            medifirstService.get('sdm/get-pegawai-isi?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    dataGrid.push({ idPegawai: dat.data.data[i].id, namaLengkap: dat.data.data[i].namalengkap, dataKeluarga: dat.data.data[i].dataKeluarga })
                }
                loadDataPendidikan()
            })
        }
        function loadDataPendidikan() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-pendidikan?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid.length; j++) {
                        if (dat.data.data[i].id == dataGrid[j].idPegawai) {
                            dataGrid2.push({ idPegawai: dataGrid[j].idPegawai, namaLengkap: dataGrid[j].namaLengkap, dataKeluarga: dataGrid[j].dataKeluarga, dataPendidikan: dat.data.data[i].dataPendidikan })
                        }
                    }
                }
                loadDataPelatihan()
            })
        }
        function loadDataPelatihan() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-pelatihan?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid2.length; j++) {
                        if (dat.data.data[i].id == dataGrid2[j].idPegawai) {
                            dataGrid3.push({ idPegawai: dataGrid2[j].idPegawai, namaLengkap: dataGrid2[j].namaLengkap, dataKeluarga: dataGrid2[j].dataKeluarga, dataPendidikan: dataGrid2[j].dataPendidikan, dataPelatihan: dat.data.data[i].dataPelatihan })
                        }
                    }
                }
                loadDataJabatan()
            })
        }
        function loadDataJabatan() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-jabatan?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid3.length; j++) {
                        if (dat.data.data[i].id == dataGrid3[j].idPegawai) {
                            dataGrid4.push({  idPegawai: dataGrid3[j].idPegawai, namaLengkap: dataGrid3[j].namaLengkap, dataKeluarga: dataGrid3[j].dataKeluarga, dataPendidikan: dataGrid3[j].dataPendidikan, dataPelatihan: dataGrid3[j].dataPelatihan, dataJabatan: dat.data.data[i].dataJabatan })
                        }
                    }
                }
                loadDataSip()
            })
        }
        function loadDataSip() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-sip-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid4.length; j++) {
                        if (dat.data.data[i].id == dataGrid4[j].idPegawai) {
                            dataGrid5.push({ idPegawai: dataGrid4[j].idPegawai, namaLengkap: dataGrid4[j].namaLengkap, dataKeluarga: dataGrid4[j].dataKeluarga, dataPendidikan: dataGrid4[j].dataPendidikan, dataPelatihan: dataGrid4[j].dataPelatihan, dataJabatan: dataGrid4[j].dataJabatan,
                             dataSip: dat.data.data[i].dataSip})
                        }
                    }
                }
                loadDataStr()
            })
        }
        function loadDataStr() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-str-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid5.length; j++) {
                        if (dat.data.data[i].id == dataGrid5[j].idPegawai) {
                            dataGrid6.push({ idPegawai: dataGrid5[j].idPegawai, namaLengkap: dataGrid5[j].namaLengkap, dataKeluarga: dataGrid5[j].dataKeluarga, dataPendidikan: dataGrid5[j].dataPendidikan, dataPelatihan: dataGrid5[j].dataPelatihan, dataJabatan: dataGrid5[j].dataJabatan,
                                dataSip: dataGrid5[j].dataSip, dataStr: dat.data.data[i].dataStr})
                        }
                    }
                }
                loadDataSpkk()
            })
        }
        function loadDataSpkk() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-spkk-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid6.length; j++) {
                        if (dat.data.data[i].id == dataGrid6[j].idPegawai) {
                            dataGrid7.push({ idPegawai: dataGrid6[j].idPegawai, namaLengkap: dataGrid6[j].namaLengkap, dataKeluarga: dataGrid6[j].dataKeluarga, dataPendidikan: dataGrid6[j].dataPendidikan, dataPelatihan: dataGrid6[j].dataPelatihan, dataJabatan: dataGrid6[j].dataJabatan,
                                dataSip: dataGrid6[j].dataSip, dataStr: dataGrid6[j].dataStr, dataSpkk: dat.data.data[i].dataSpkk})
                        }
                    }
                }
                loadDataSeminar()
            })
        }
        function loadDataSeminar() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-seminar-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid7.length; j++) {
                        if (dat.data.data[i].id == dataGrid7[j].idPegawai) {
                            dataGrid8.push({ idPegawai: dataGrid7[j].idPegawai, namaLengkap: dataGrid7[j].namaLengkap, dataKeluarga: dataGrid7[j].dataKeluarga, dataPendidikan: dataGrid7[j].dataPendidikan, dataPelatihan: dataGrid7[j].dataPelatihan, dataJabatan: dataGrid7[j].dataJabatan,
                                dataSip: dataGrid7[j].dataSip, dataStr: dataGrid7[j].dataStr, dataSpkk: dataGrid7[j].dataSpkk, dataSeminar: dat.data.data[i].dataSeminar})
                        }
                    }
                }
                loadDataDikjur()
            })
        }
        function loadDataDikjur() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-dikjur-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid8.length; j++) {
                        if (dat.data.data[i].id == dataGrid8[j].idPegawai) {
                            dataGrid9.push({ idPegawai: dataGrid8[j].idPegawai, namaLengkap: dataGrid8[j].namaLengkap, dataKeluarga: dataGrid8[j].dataKeluarga, dataPendidikan: dataGrid8[j].dataPendidikan, dataPelatihan: dataGrid8[j].dataPelatihan, dataJabatan: dataGrid8[j].dataJabatan,
                                dataSip: dataGrid8[j].dataSip, dataStr: dataGrid8[j].dataStr, dataSpkk: dataGrid8[j].dataSpkk, dataSeminar: dataGrid8[j].dataSeminar, dataDikjur: dat.data.data[i].dataDikjur})
                        }
                    }
                }
                loadDataJasa()
            })
        }
        function loadDataJasa() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-jasa-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid9.length; j++) {
                        if (dat.data.data[i].id == dataGrid9[j].idPegawai) {
                            dataGrid10.push({ idPegawai: dataGrid9[j].idPegawai, namaLengkap: dataGrid9[j].namaLengkap, dataKeluarga: dataGrid9[j].dataKeluarga, dataPendidikan: dataGrid9[j].dataPendidikan, dataPelatihan: dataGrid9[j].dataPelatihan, dataJabatan: dataGrid9[j].dataJabatan,
                                dataSip: dataGrid9[j].dataSip, dataStr: dataGrid9[j].dataStr, dataSpkk: dataGrid9[j].dataSpkk, dataSeminar: dataGrid9[j].dataSeminar, dataDikjur: dataGrid9[j].dataDikjur, dataJasa: dat.data.data[i].tandaJasa})
                        }
                    }
                }
                loadDataBahasa()
            })
        }
        function loadDataBahasa() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-bahasa-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid10.length; j++) {
                        if (dat.data.data[i].id == dataGrid10[j].idPegawai) {
                            dataGrid11.push({ idPegawai: dataGrid10[j].idPegawai, namaLengkap: dataGrid10[j].namaLengkap, dataKeluarga: dataGrid10[j].dataKeluarga, dataPendidikan: dataGrid10[j].dataPendidikan, dataPelatihan: dataGrid10[j].dataPelatihan, dataJabatan: dataGrid10[j].dataJabatan,
                                dataSip: dataGrid10[j].dataSip, dataStr: dataGrid10[j].dataStr, dataSpkk: dataGrid10[j].dataSpkk, dataSeminar: dataGrid10[j].dataSeminar, dataDikjur: dataGrid10[j].dataDikjur, dataJasa: dataGrid10[j].dataJasa, dataBahasa: dat.data.data[i].dataBahasa})
                        }
                    }
                }
                loadStatusPegawai()
            })
        }
        function loadStatusPegawai() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }

            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }

            medifirstService.get('sdm/get-status-pegawai?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid11.length; j++) {
                        if (dat.data.data[i].id == dataGrid11[j].idPegawai) {
                            dataGrid12.push({ idPegawai: dataGrid11[j].idPegawai, namaLengkap: dataGrid11[j].namaLengkap, dataKeluarga: dataGrid11[j].dataKeluarga, dataPendidikan: dataGrid11[j].dataPendidikan, dataPelatihan: dataGrid11[j].dataPelatihan, dataJabatan: dataGrid11[j].dataJabatan,
                                dataSip: dataGrid11[j].dataSip, dataStr: dataGrid11[j].dataStr, dataSpkk: dataGrid11[j].dataSpkk, dataSeminar: dataGrid11[j].dataSeminar, dataDikjur: dataGrid11[j].dataDikjur, dataJasa: dataGrid11[j].dataJasa, dataBahasa: dataGrid11[j].dataBahasa, dataStatusPegawai: dat.data.data[i].statusPegawai})
                        }
                    }
                }
                loadDataOrganisasi()
            })
        }
        function loadDataRiwayatKepangkatan() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }

            medifirstService.get('sdm/get-riwayat-kepangkatan-pegawai?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid12.length; j++) {
                        if (dat.data.data[i].id == dataGrid12[j].idPegawai) {
                            dataGrid13.push({ idPegawai: dataGrid12[j].idPegawai, namaLengkap: dataGrid12[j].namaLengkap, dataKeluarga: dataGrid12[j].dataKeluarga, dataPendidikan: dataGrid12[j].dataPendidikan, dataPelatihan: dataGrid12[j].dataPelatihan, dataJabatan: dataGrid12[j].dataJabatan,
                                dataSip: dataGrid12[j].dataSip, dataStr: dataGrid12[j].dataStr, dataSpkk: dataGrid12[j].dataSpkk, dataSeminar: dataGrid12[j].dataSeminar, dataDikjur: dataGrid12[j].dataDikjur, dataJasa: dataGrid12[j].dataJasa, dataBahasa: dataGrid12[j].dataBahasa,dataStatusPegawai: dataGrid12[j].dataStatusPegawai, dataRiwayatKepangkatan: dat.data.data[i].dataRiwayatKepangkatan})
                        }
                    }
                }
                loadDataOrganisasi()
            })
        }
        function loadDataOrganisasi() {
            $scope.isRouteLoading = true
            var pegawai = '';
            if ($scope.item.namaPegawai != undefined) {
                pegawai = $scope.item.namaPegawai
            }
            var instalasi = '';
            if ($scope.item.instalasi != undefined) {
                instalasi = $scope.item.instalasi.id
            }
            var ruangan = '';
            if ($scope.item.ruangan != undefined) {
                ruangan = $scope.item.ruangan.id
            }
            var unitKerja = '';
            if ($scope.item.unitKerja != undefined) {
                unitKerja = $scope.item.unitKerja.id
            }
            // var ceklis = '';
            // if ($scope.model.cekpilihManual2 == true) {
            //     ceklis = '23'
            // } else if ($scope.model.cekpilihManual3 == true) {
            //     ceklis = "nakes"
            // } else if ($scope.model.cekpilihManual4 == true) {
            //     ceklis = "polpns"
            // } else {
                
            // }
            var pttnomedis = '';
            if ($scope.model.cekpilihManual2 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            var pttmedis = '';
            if ($scope.model.cekpilihManual3 == true) {
                pttmedis = '&pttmedis=' + true
            }
            var pttdokter = '';
            if ($scope.model.cekpilihManual4 == true) {
                pttdokter = '&pttdokter=' + true
            }
            var pns = '';
            if ($scope.model.cekpilihManual12 == true) {
                pns = '&pns=' + true
            }
            var polri = '';
            if ($scope.model.cekpilihManual13 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-data-organisasi-2?namaPegawai=' + pegawai + "&instalasi=" + instalasi + "&ruangan=" + ruangan + "&unitkerja=" + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                for (let i = 0; i < dat.data.data.length; i++) {
                    for (let j = 0; j < dataGrid13.length; j++) {
                        if (dat.data.data[i].id == dataGrid13[j].idPegawai) {
                            dataGrid14.push({ idPegawai: dataGrid13[j].idPegawai, namaLengkap: dataGrid13[j].namaLengkap, dataKeluarga: dataGrid13[j].dataKeluarga, dataPendidikan: dataGrid13[j].dataPendidikan, dataPelatihan: dataGrid13[j].dataPelatihan, dataJabatan: dataGrid13[j].dataJabatan,
                                dataSip: dataGrid13[j].dataSip, dataStr: dataGrid13[j].dataStr, dataSpkk: dataGrid13[j].dataSpkk, dataSeminar: dataGrid13[j].dataSeminar, dataDikjur: dataGrid13[j].dataDikjur, dataJasa: dataGrid13[j].dataJasa, dataBahasa: dataGrid13[j].dataBahasa, dataStatusPegawai:dataGrid13[j].dataStatusPegawai,dataRiwayatKepangkatan: dataGrid13[j].dataRiwayatKepangkatan, dataOrganisasi: dat.data.data[i].dataOrganisasi}) 
                        }
                    }
                }
                // if ($scope.model.cekpilihManual == true) {
                //     filterPegawai()
                //     loadGrid()
                // } 
                debugger
                if ($scope.model.cekpilihManual2 == true) {
                    if ($scope.model.cekpilihManual == true) {
                        $scope.pegawai2 = true;
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = false;
                        $scope.pegawai = false;
                        filterPegawai2()
                        loadGridPtt()
                    } else {
                        $scope.pegawai2 = true;
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = false;
                        $scope.pegawai = false;
                        loadGridPtt()
                    }
                    // loadGridPtt()
                } else if ($scope.model.cekpilihManual3 == true) {
                    if ($scope.model.cekpilihManual == true) {
                        $scope.pegawai3 = true;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = false;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        filterPegawai3()
                        loadGridNakes()
                    } else {
                        $scope.pegawai3 = true;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = false;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        loadGridNakes()
                    }
                } else if ($scope.model.cekpilihManual4 == true) {
                    if ($scope.model.cekpilihManual == true) {
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = true;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = false;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        filterPegawai4()
                        loadGridPolPns()
                    } else {
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = true;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = false;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        loadGridPolPns()
                    }
                } else if ($scope.model.cekpilihManual12 == true) {
                    if ($scope.model.cekpilihManual == true) {
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = true;
                        $scope.pegawai6 = false;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        filterPegawai5()
                        loadGrid5()
                    } else {
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = true;
                        $scope.pegawai6 = false;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        loadGrid5()
                    }
                } else if ($scope.model.cekpilihManual13 == true) {
                    if ($scope.model.cekpilihManual == true) {
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = true;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        filterPegawai6()
                        loadGrid6()
                    } else {
                        $scope.pegawai3 = false;
                        $scope.pegawai4 = false;
                        $scope.pegawai5 = false;
                        $scope.pegawai6 = true;
                        $scope.pegawai2 = false;
                        $scope.pegawai = false;
                        loadGrid6()
                    }
                } else {
                    $scope.pegawai = true;
                    $scope.pegawai2 = false;
                    $scope.pegawai3 = false;
                    $scope.pegawai4 = false;
                    $scope.pegawai5 = false;
                    $scope.pegawai6 = false;
                    loadGrid()
                }
            })
        }
        function loadDataRekap() {
            $scope.isRouteLoading = true;
            var instalasi = ''
            if ($scope.item.instalasi2 != undefined) {
                instalasi = "&instalasi=" + $scope.item.instalasi2.id
            }
            var ruangan = ''
            if ($scope.item.ruangan3 != undefined) {
                ruangan = "&ruangan=" + $scope.item.ruangan3.id
            }
            var unitKerja = ''
            if ($scope.item.unitKerja3 != undefined) {
                unitKerja = "&unitkerja=" + $scope.item.unitKerja3.id
            }
            var pttnomedis = ''
            if ($scope.model.cekpilihManual8 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            
            var pttmedis = ''
            if ($scope.model.cekpilihManual9 == true) {
                pttmedis = '&pttmedis=' + true
            }

            var pttdokter = ''
            if ($scope.model.cekpilihManual10 == true) {
                pttdokter = '&pttdokter=' + true
            }

            var pns = ''
            if ($scope.model.cekpilihManual22 == true) {
                pns = '&pns=' + true
            }

            var polri = ''
            if ($scope.model.cekpilihManual23 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-rekap-pegawai-sudah-input?' + instalasi + ruangan + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.length; i++) {
                    dataRekap.push(dat.data[i])
                }
                loadDataRekapSip()
            })
        }
        function loadDataRekapSip() {
            $scope.isRouteLoading = true;
            var instalasi = ''
            if ($scope.item.instalasi2 != undefined) {
                instalasi = "&instalasi=" + $scope.item.instalasi2.id
            }
            var ruangan = ''
            if ($scope.item.ruangan3 != undefined) {
                ruangan = "&ruangan=" + $scope.item.ruangan3.id
            }
            var unitKerja = ''
            if ($scope.item.unitKerja3 != undefined) {
                unitKerja = "&unitkerja=" + $scope.item.unitKerja3.id
            }
            var pttnomedis = ''
            if ($scope.model.cekpilihManual8 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            
            var pttmedis = ''
            if ($scope.model.cekpilihManual9 == true) {
                pttmedis = '&pttmedis=' + true
            }

            var pttdokter = ''
            if ($scope.model.cekpilihManual10 == true) {
                pttdokter = '&pttdokter=' + true
            }

            var pns = ''
            if ($scope.model.cekpilihManual22 == true) {
                pns = '&pns=' + true
            }

            var polri = ''
            if ($scope.model.cekpilihManual23 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-rekap-pegawai-sip?' + instalasi + ruangan + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.length; i++) {
                    for (let j = 0; j < dataRekap.length; j++) {
                        if (dataRekap[j].namadepartemen == dat.data[i].namadepartemen) {
                            dataRekap2.push({ namadepartemen: dataRekap[i].namadepartemen, jumlahkb: dataRekap[i].jumlahkb, jumlahkp: dataRekap[i].jumlahkp, jumlahop: dataRekap[i].jumlahop, jumlahrd: dataRekap[i].jumlahrd, jumlahrj: dataRekap[i].jumlahrj, jumlahrp: dataRekap[i].jumlahrp, jumlahrpp: dataRekap[i].jumlahrpp, jumlahrs: dataRekap[i].jumlahrs, jumlahrss: dataRekap[i].jumlahrss, jumlahtj: dataRekap[i].jumlahtj,
                            jumlahsip: dat.data[i].jumlahsip})
                        }
                    }
                    // if (dataRekap[i].namadepartemen == dat.data[i].namadepartemen) {
                    //     dataRekap2.push({ namadepartemen: dataRekap[i].namadepartemen, jumlahkb: dataRekap[i].jumlahkb, jumlahkp: dataRekap[i].jumlahkp, jumlahop: dataRekap[i].jumlahop, jumlahrd: dataRekap[i].jumlahrd, jumlahrj: dataRekap[i].jumlahrj, jumlahrp: dataRekap[i].jumlahrp, jumlahrpp: dataRekap[i].jumlahrpp, jumlahrs: dataRekap[i].jumlahrs, jumlahrss: dataRekap[i].jumlahrss, jumlahtj: dataRekap[i].jumlahtj,
                    //     jumlahsip: dat.data[i].jumlahsip})
                    // } else {
                    //     dataRekap2.push({ namadepartemen: dataRekap[i].namadepartemen, jumlahkb: dataRekap[i].jumlahkb, jumlahkp: dataRekap[i].jumlahkp, jumlahop: dataRekap[i].jumlahop, jumlahrd: dataRekap[i].jumlahrd, jumlahrj: dataRekap[i].jumlahrj, jumlahrp: dataRekap[i].jumlahrp, jumlahrpp: dataRekap[i].jumlahrpp, jumlahrs: dataRekap[i].jumlahrs, jumlahrss: dataRekap[i].jumlahrss, jumlahtj: dataRekap[i].jumlahtj,
                    //     jumlahsip: 0})
                    // } dataRekap2[k] == undefined
                }
                for (let k = 0; k < dataRekap.length; k++) {
                    if (dataRekap2[k] == undefined) {
                        dataRekap2.push({ namadepartemen: dataRekap[k].namadepartemen, jumlahkb: dataRekap[k].jumlahkb, jumlahkp: dataRekap[k].jumlahkp, jumlahop: dataRekap[k].jumlahop, jumlahrd: dataRekap[k].jumlahrd, jumlahrj: dataRekap[k].jumlahrj, jumlahrp: dataRekap[k].jumlahrp, jumlahrpp: dataRekap[k].jumlahrpp, jumlahrs: dataRekap[k].jumlahrs, jumlahrss: dataRekap[k].jumlahrss, jumlahtj: dataRekap[k].jumlahtj,
                        jumlahsip: "0"})
                    } else if (dataRekap[k].namadepartemen != dataRekap2[k].namadepartemen) {
                        dataRekap2.push({ namadepartemen: dataRekap[k].namadepartemen, jumlahkb: dataRekap[k].jumlahkb, jumlahkp: dataRekap[k].jumlahkp, jumlahop: dataRekap[k].jumlahop, jumlahrd: dataRekap[k].jumlahrd, jumlahrj: dataRekap[k].jumlahrj, jumlahrp: dataRekap[k].jumlahrp, jumlahrpp: dataRekap[k].jumlahrpp, jumlahrs: dataRekap[k].jumlahrs, jumlahrss: dataRekap[k].jumlahrss, jumlahtj: dataRekap[k].jumlahtj,
                        jumlahsip: "0"})
                    }
                }
                loadDataRekapStr()
            })
        }
        function loadDataRekapStr() {
            $scope.isRouteLoading = true;
            var instalasi = ''
            if ($scope.item.instalasi2 != undefined) {
                instalasi = "&instalasi=" + $scope.item.instalasi2.id
            }
            var ruangan = ''
            if ($scope.item.ruangan3 != undefined) {
                ruangan = "&ruangan=" + $scope.item.ruangan3.id
            }
            var unitKerja = ''
            if ($scope.item.unitKerja3 != undefined) {
                unitKerja = "&unitkerja=" + $scope.item.unitKerja3.id
            }
            var pttnomedis = ''
            if ($scope.model.cekpilihManual8 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            
            var pttmedis = ''
            if ($scope.model.cekpilihManual9 == true) {
                pttmedis = '&pttmedis=' + true
            }

            var pttdokter = ''
            if ($scope.model.cekpilihManual10 == true) {
                pttdokter = '&pttdokter=' + true
            }

            var pns = ''
            if ($scope.model.cekpilihManual22 == true) {
                pns = '&pns=' + true
            }

            var polri = ''
            if ($scope.model.cekpilihManual23 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-rekap-pegawai-str?' + instalasi + ruangan + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false;
                for (let i = 0; i < dat.data.length; i++) {
                    for (let j = 0; j < dataRekap2.length; j++) {
                        if (dat.data[i].namadepartemen == dataRekap2[j].namadepartemen) {
                            dataRekap3.push({ namadepartemen: dataRekap2[i].namadepartemen, jumlahkb: dataRekap2[i].jumlahkb, jumlahkp: dataRekap2[i].jumlahkp, jumlahop: dataRekap2[i].jumlahop, jumlahrd: dataRekap2[i].jumlahrd, jumlahrj: dataRekap2[i].jumlahrj, jumlahrp: dataRekap2[i].jumlahrp, jumlahrpp: dataRekap2[i].jumlahrpp, jumlahrs: dataRekap2[i].jumlahrs, jumlahrss: dataRekap2[i].jumlahrss, jumlahtj: dataRekap2[i].jumlahtj,
                            jumlahsip: dataRekap2[i].jumlahsip, jumlahstr: dat.data[i].jumlahstr})
                        }
                    }
                }
                for (let k = 0; k < dataRekap2.length; k++) {
                    if (dataRekap3[k] == undefined) {
                        dataRekap3.push({ namadepartemen: dataRekap2[k].namadepartemen, jumlahkb: dataRekap2[k].jumlahkb, jumlahkp: dataRekap2[k].jumlahkp, jumlahop: dataRekap2[k].jumlahop, jumlahrd: dataRekap2[k].jumlahrd, jumlahrj: dataRekap2[k].jumlahrj, jumlahrp: dataRekap2[k].jumlahrp, jumlahrpp: dataRekap2[k].jumlahrpp, jumlahrs: dataRekap2[k].jumlahrs, jumlahrss: dataRekap2[k].jumlahrss, jumlahtj: dataRekap2[k].jumlahtj,
                        jumlahsip: dataRekap2[k].jumlahsip, jumlahstr: "0"})
                    } else if (dataRekap2[k].namadepartemen != dataRekap3[k].namadepartemen) {
                        dataRekap3.push({ namadepartemen: dataRekap2[k].namadepartemen, jumlahkb: dataRekap2[k].jumlahkb, jumlahkp: dataRekap2[k].jumlahkp, jumlahop: dataRekap2[k].jumlahop, jumlahrd: dataRekap2[k].jumlahrd, jumlahrj: dataRekap2[k].jumlahrj, jumlahrp: dataRekap2[k].jumlahrp, jumlahrpp: dataRekap2[k].jumlahrpp, jumlahrs: dataRekap2[k].jumlahrs, jumlahrss: dataRekap2[k].jumlahrss, jumlahtj: dataRekap2[k].jumlahtj,
                        jumlahsip: dataRekap2[k].jumlahsip, jumlahstr: "0"})
                    }
                }
                loadGridRekap()
            })
        }
        function loadGrid() {
            $scope.sourcePegawai = new kendo.data.DataSource({
                data: dataGrid12,
                pageSize: 50,
                total: dataGrid12.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnPegawai = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "DataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namaLengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "dataKeluarga",
                        "title": "Data Keluarga",
                        "width": "50px",
                        attributes: {
							class: "#=dataKeluarga == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPendidikan",
                        "title": "Data Pendidikan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPendidikan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPelatihan",
                        "title": "Data Pelatihan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPelatihan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJabatan",
                        "title": "Data Jabatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataJabatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataSip",
                        "title": "Data Sip",
                        "width": "50px",
                        attributes: {
							class: "#=dataSip == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataStr",
                        "title": "Data Str",
                        "width": "50px",
                        attributes: {
							class: "#=dataStr == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataSpkk",
                        "title": "Data Spkk",
                        "width": "50px",
                        attributes: {
							class: "#=dataSpkk == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataSeminar",
                        "title": "Data Seminar",
                        "width": "50px",
                        attributes: {
							class: "#=dataSeminar == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataDikjur",
                        "title": "Data Dikjur",
                        "width": "50px",
                        attributes: {
							class: "#=dataDikjur == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJasa",
                        "title": "Data Jasa",
                        "width": "50px",
                        attributes: {
							class: "#=dataJasa == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataBahasa",
                        "title": "Data Bahasa",
                        "width": "50px",
                        attributes: {
							class: "#=dataBahasa == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    // {
                    //     "field": "dataOrganisasi",
                    //     "title": "Data Organisasi",
                    //     "width": "50px",
                    //     attributes: {
					// 		class: "#=dataOrganisasi == 'Belum Input' ? 'red' : 'ijo' #"
					// 	},
                    // },
                ]
            }
        }
        function loadGridRekap() {
            $scope.sourceRekap = new kendo.data.DataSource({
                data: dataRekap3,
                pageSize: 50,
                total: dataRekap3.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnRekap = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "RekapDataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namadepartemen",
                        "title": "Nama Instalasi",
                        "width": "150px"
                    },
                    {
                        "field": "jumlahkp",
                        "title": "Data Keluarga",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahrp",
                        "title": "Data Pendidikan",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahrpp",
                        "title": "Data Pelatihan",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahrj",
                        "title": "Data Jabatan",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahsip",
                        "title": "Data Sip",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahstr",
                        "title": "Data Str",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahrs",
                        "title": "Data Spkk",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahrss",
                        "title": "Data Seminar",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahrd",
                        "title": "Data Dikjur",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahtj",
                        "title": "Data Jasa",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahkb",
                        "title": "Data Bahasa",
                        "width": "50px",
                    },
                    {
                        "field": "jumlahop",
                        "title": "Data Organisasi",
                        "width": "50px",
                    },
                ]
            }
        }
        function filterPegawai() {
            var tampung = []
            for (let i = 0; i < dataGrid12.length; i++) {
                if (dataGrid12[i].dataBahasa == "Sudah Input" && dataGrid12[i].dataDikjur == "Sudah Input" && dataGrid12[i].dataJabatan == "Sudah Input" && dataGrid12[i].dataJasa == "Sudah Input" && dataGrid12[i].dataKeluarga == "Sudah Input" && dataGrid12[i].dataOrganisasi == "Sudah Input"
                && dataGrid12[i].dataPelatihan == "Sudah Input" && dataGrid12[i].dataPendidikan == "Sudah Input" && dataGrid12[i].dataSeminar == "Sudah Input" && dataGrid12[i].dataSip == "Sudah Input" && dataGrid12[i].dataSpkk == "Sudah Input" && dataGrid12[i].dataStr == "Sudah Input") {
                    tampung.push(dataGrid12[i])
                }
            }
            dataGrid12 = [];
            // dataGrid12.push(tampung)
            for (let j = 0; j < tampung.length; j++) {
                dataGrid12.push({ idPegawai: tampung[j].idPegawai, namaLengkap: tampung[j].namaLengkap, dataBahasa: tampung[j].dataBahasa, dataDikjur: tampung[j].dataDikjur, dataJabatan: tampung[j].dataJabatan, dataJasa: tampung[j].dataJasa, dataKeluarga: tampung[j].dataKeluarga, dataOrganisasi: tampung[j].dataOrganisasi, dataPelatihan: tampung[j].dataPelatihan, dataPendidikan: tampung[j].dataPendidikan, dataSeminar: tampung[j].dataSeminar,
                    dataSip: tampung[j].dataSip,dataSpkk: tampung[j].dataSpkk,dataStr: tampung[j].dataStr,})
            }
        }
        function filterPegawai2() {
            var tampung = []
            for (let i = 0; i < dataGrid14.length; i++) {
                if (dataGrid14[i].dataStatusPegawai == "Sudah Input" && dataGrid14[i].dataPendidikan == "Sudah Input" && dataGrid14[i].dataJabatan == "Sudah Input" ) {
                    tampung.push(dataGrid14[i])
                }
            }
            dataGrid14 = [];
            // dataGrid12.push(tampung)
            for (let j = 0; j < tampung.length; j++) {
                dataGrid14.push({ idPegawai: tampung[j].idPegawai, namaLengkap: tampung[j].namaLengkap, dataBahasa: tampung[j].dataBahasa, dataDikjur: tampung[j].dataDikjur, dataJabatan: tampung[j].dataJabatan, dataJasa: tampung[j].dataJasa, dataKeluarga: tampung[j].dataKeluarga, dataOrganisasi: tampung[j].dataOrganisasi, dataPelatihan: tampung[j].dataPelatihan, dataPendidikan: tampung[j].dataPendidikan, dataSeminar: tampung[j].dataSeminar,
                    dataSip: tampung[j].dataSip, dataStatusPegawai: tampung[j].dataStatusPegawai,dataSpkk: tampung[j].dataSpkk,dataStr: tampung[j].dataStr,dataRiwayatKepangkatan: tampung[j].dataRiwayatKepangkatan})
            }
        }
        function filterPegawai3() {
            var tampung = []
            for (let i = 0; i < dataGrid14.length; i++) {
                if (dataGrid14[i].dataStatusPegawai == "Sudah Input" && dataGrid14[i].dataPendidikan == "Sudah Input" && dataGrid14[i].dataJabatan == "Sudah Input" && dataGrid14[i].dataStr == "Sudah Input" && dataGrid14[i].dataSip == "Sudah Input" && dataGrid14[i].dataSpkk == "Sudah Input" ) {
                    tampung.push(dataGrid14[i])
                }
            }
            dataGrid14 = [];
            // dataGrid12.push(tampung)
            for (let j = 0; j < tampung.length; j++) {
                dataGrid14.push({ idPegawai: tampung[j].idPegawai, namaLengkap: tampung[j].namaLengkap, dataBahasa: tampung[j].dataBahasa, dataDikjur: tampung[j].dataDikjur, dataJabatan: tampung[j].dataJabatan, dataJasa: tampung[j].dataJasa, dataKeluarga: tampung[j].dataKeluarga, dataOrganisasi: tampung[j].dataOrganisasi, dataPelatihan: tampung[j].dataPelatihan, dataPendidikan: tampung[j].dataPendidikan, dataSeminar: tampung[j].dataSeminar,
                    dataSip: tampung[j].dataSip, dataStatusPegawai: tampung[j].dataStatusPegawai,dataSpkk: tampung[j].dataSpkk,dataStr: tampung[j].dataStr,dataRiwayatKepangkatan: tampung[j].dataRiwayatKepangkatan})
            }
        }
        function filterPegawai4() {
            var tampung = []
            for (let i = 0; i < dataGrid14.length; i++) {
                if (dataGrid14[i].dataStatusPegawai == "Sudah Input" && dataGrid14[i].dataPendidikan == "Sudah Input" && dataGrid14[i].dataJabatan == "Sudah Input" && dataGrid14[i].dataRiwayatKepangkatan == "Sudah Input") {
                    tampung.push(dataGrid14[i])
                }
            }
            dataGrid14 = [];
            // dataGrid12.push(tampung)
            for (let j = 0; j < tampung.length; j++) {
                dataGrid14.push({ idPegawai: tampung[j].idPegawai, namaLengkap: tampung[j].namaLengkap, dataBahasa: tampung[j].dataBahasa, dataDikjur: tampung[j].dataDikjur, dataJabatan: tampung[j].dataJabatan, dataJasa: tampung[j].dataJasa, dataKeluarga: tampung[j].dataKeluarga, dataOrganisasi: tampung[j].dataOrganisasi, dataPelatihan: tampung[j].dataPelatihan, dataPendidikan: tampung[j].dataPendidikan, dataSeminar: tampung[j].dataSeminar,
                    dataSip: tampung[j].dataSip, dataStatusPegawai: tampung[j].dataStatusPegawai,dataSpkk: tampung[j].dataSpkk,dataStr: tampung[j].dataStr,dataRiwayatKepangkatan: tampung[j].dataRiwayatKepangkatan})
            }
        }
        function filterPegawai5() {
            var tampung = []
            for (let i = 0; i < dataGrid14.length; i++) {
                if (dataGrid14[i].dataStatusPegawai == "Sudah Input" && dataGrid14[i].dataPendidikan == "Sudah Input" && dataGrid14[i].dataJabatan == "Sudah Input" && dataGrid14[i].dataRiwayatKepangkatan == "Sudah Input") {
                    tampung.push(dataGrid14[i])
                }
            }
            dataGrid14 = [];
            // dataGrid12.push(tampung)
            for (let j = 0; j < tampung.length; j++) {
                dataGrid14.push({ idPegawai: tampung[j].idPegawai, namaLengkap: tampung[j].namaLengkap, dataBahasa: tampung[j].dataBahasa, dataDikjur: tampung[j].dataDikjur, dataJabatan: tampung[j].dataJabatan, dataJasa: tampung[j].dataJasa, dataKeluarga: tampung[j].dataKeluarga, dataOrganisasi: tampung[j].dataOrganisasi, dataPelatihan: tampung[j].dataPelatihan, dataPendidikan: tampung[j].dataPendidikan, dataSeminar: tampung[j].dataSeminar,
                    dataSip: tampung[j].dataSip, dataStatusPegawai: tampung[j].dataStatusPegawai,dataSpkk: tampung[j].dataSpkk,dataStr: tampung[j].dataStr,dataRiwayatKepangkatan: tampung[j].dataRiwayatKepangkatan})
            }
        }
        function filterPegawai6() {
            var tampung = []
            for (let i = 0; i < dataGrid14.length; i++) {
                if (dataGrid14[i].dataStatusPegawai == "Sudah Input" && dataGrid14[i].dataPendidikan == "Sudah Input" && dataGrid14[i].dataJabatan == "Sudah Input" && dataGrid14[i].dataRiwayatKepangkatan == "Sudah Input") {
                    tampung.push(dataGrid14[i])
                }
            }
            dataGrid14 = [];
            // dataGrid12.push(tampung)
            for (let j = 0; j < tampung.length; j++) {
                dataGrid14.push({ idPegawai: tampung[j].idPegawai, namaLengkap: tampung[j].namaLengkap, dataBahasa: tampung[j].dataBahasa, dataDikjur: tampung[j].dataDikjur, dataJabatan: tampung[j].dataJabatan, dataJasa: tampung[j].dataJasa, dataKeluarga: tampung[j].dataKeluarga, dataOrganisasi: tampung[j].dataOrganisasi, dataPelatihan: tampung[j].dataPelatihan, dataPendidikan: tampung[j].dataPendidikan, dataSeminar: tampung[j].dataSeminar,
                    dataSip: tampung[j].dataSip, dataStatusPegawai: tampung[j].dataStatusPegawai,dataSpkk: tampung[j].dataSpkk,dataStr: tampung[j].dataStr,dataRiwayatKepangkatan: tampung[j].dataRiwayatKepangkatan})
            }
        }
        //dataRiwayatKepangkatan
        $scope.$watch('model.cekpilihManual2', function(e) {
            if (e == true) {
                $scope.show1 = true;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;
                $scope.show6 = false;
            } else {
                $scope.show1 = false;
                $scope.show3 = true;
                $scope.show4 = true;
                $scope.show5 = true;
                $scope.show6 = true;
            }
        })
        $scope.$watch('model.cekpilihManual3', function(e) {
            if (e == true) {
                $scope.show1 = true;
                $scope.show2 = false;
                $scope.show4 = false;
                $scope.show5 = false;
                $scope.show6 = false;
            } else {
                $scope.show1 = false;
                $scope.show2 = true;
                $scope.show4 = true;
                $scope.show5 = true;
                $scope.show6 = true;
            }
        })
        $scope.$watch('model.cekpilihManual4', function(e) {
            if (e == true) {
                $scope.show1 = true;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show5 = false;
                $scope.show6 = false;
            } else {
                $scope.show1 = false;
                $scope.show2 = true;
                $scope.show3 = true;
                $scope.show5 = true;
                $scope.show6 = true;
            }
        })
        $scope.$watch('model.cekpilihManual12', function(e) {
            if (e == true) {
                $scope.show1 = true;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show6 = false;
            } else {
                $scope.show1 = false;
                $scope.show2 = true;
                $scope.show3 = true;
                $scope.show4 = true;
                $scope.show6 = true;
            }
        })
        $scope.$watch('model.cekpilihManual13', function(e) {
            if (e == true) {
                $scope.show1 = true;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;
            } else {
                $scope.show1 = false;
                $scope.show2 = true;
                $scope.show3 = true;
                $scope.show4 = true;
                $scope.show5 = true;
            }
        })
        
        function loadGridPtt() {
            $scope.sourcePegawai2 = new kendo.data.DataSource({
                data: dataGrid14,
                pageSize: 50,
                total: dataGrid14.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnPegawai2 = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "DataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namaLengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "dataStatusPegawai",
                        "title": "Data Status Pegawai",
                        "width": "50px",
                        attributes: {
							class: "#=dataStatusPegawai == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPendidikan",
                        "title": "Data Pendidikan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPendidikan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJabatan",
                        "title": "Data Jabatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataJabatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                ]
            }
        }
        function loadGridNakes() {
            $scope.sourcePegawai3 = new kendo.data.DataSource({
                data: dataGrid14,
                pageSize: 50,
                total: dataGrid14.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnPegawai3 = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "DataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namaLengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "dataStatusPegawai",
                        "title": "Data Status Pegawai",
                        "width": "50px",
                        attributes: {
							class: "#=dataStatusPegawai == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPendidikan",
                        "title": "Data Pendidikan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPendidikan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJabatan",
                        "title": "Data Jabatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataJabatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataStr",
                        "title": "Data Str",
                        "width": "50px",
                        attributes: {
							class: "#=dataStr == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataSip",
                        "title": "Data SIP",
                        "width": "50px",
                        attributes: {
							class: "#=dataSip == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataSpkk",
                        "title": "Data Spkk",
                        "width": "50px",
                        attributes: {
							class: "#=dataSpkk == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                ]
            }
        }
        function loadGridPolPns() {
            $scope.sourcePegawai4 = new kendo.data.DataSource({
                data: dataGrid14,
                pageSize: 50,
                total: dataGrid14.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnPegawai4 = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "DataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namaLengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "dataStatusPegawai",
                        "title": "Data Status Pegawai",
                        "width": "50px",
                        attributes: {
							class: "#=dataStatusPegawai == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPendidikan",
                        "title": "Data Pendidikan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPendidikan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJabatan",
                        "title": "Data Jabatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataJabatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataRiwayatKepangkatan",
                        "title": "Data Riwayat Kepangkatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataRiwayatKepangkatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                ]
            }
        }
        function loadGrid5() {
            $scope.sourcePegawai5 = new kendo.data.DataSource({
                data: dataGrid14,
                pageSize: 50,
                total: dataGrid14.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnPegawai5 = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "DataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namaLengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "dataStatusPegawai",
                        "title": "Data Status Pegawai",
                        "width": "50px",
                        attributes: {
							class: "#=dataStatusPegawai == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPendidikan",
                        "title": "Data Pendidikan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPendidikan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJabatan",
                        "title": "Data Jabatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataJabatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataRiwayatKepangkatan",
                        "title": "Data Riwayat Kepangkatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataRiwayatKepangkatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                ]
            }
        }
        function loadGrid6() {
            $scope.sourcePegawai6 = new kendo.data.DataSource({
                data: dataGrid14,
                pageSize: 50,
                total: dataGrid14.length,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {

                        }
                    }
                }
            });
            $scope.columnPegawai6 = {
                toolbar: [
                    "excel",
                    // "pdf",
                ],
                excel: {
                    fileName: "DataPegawaiSudahInput.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapPengunjung.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    // sheet.mergedCells = ["A1:M1"];
                    // sheet.name = "LAPORAN";

                    // var myHeaders = [

                    //     {
                    //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                    //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                    //         fontSize: 15,
                    //         textAlign: "center",
                    //         background: "#c1d2d2",
                    //         // color:"#ffffff"
                    //     }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namaLengkap",
                        "title": "Nama Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "dataStatusPegawai",
                        "title": "Data Status Pegawai",
                        "width": "50px",
                        attributes: {
							class: "#=dataStatusPegawai == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataPendidikan",
                        "title": "Data Pendidikan",
                        "width": "50px",
                        attributes: {
							class: "#=dataPendidikan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataJabatan",
                        "title": "Data Jabatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataJabatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                    {
                        "field": "dataRiwayatKepangkatan",
                        "title": "Data Riwayat Kepangkatan",
                        "width": "50px",
                        attributes: {
							class: "#=dataRiwayatKepangkatan == 'Belum Input' ? 'red' : 'ijo' #"
						},
                    },
                ]
            }
        }
        $scope.searchStatus = function() {
            loadRekapDataPegawai()
        }
        function loadRekapDataPegawai() {
            $scope.isRouteLoading = true;

            var instalasi = ''
            if ($scope.item.instalasi3 != undefined) {
                instalasi = '&instalasi=' + $scope.item.instalasi3.id
            }

            var ruangan = ''
            if ($scope.item.ruangan2 != undefined) {
                ruangan = '&ruangan=' + $scope.item.ruangan2.id
            }

            var unitKerja = ''
            if ($scope.item.unitKerja2 != undefined) {
                unitKerja = '&unitkerja=' + $scope.item.unitKerja2.id
            }

            var pttnomedis = ''
            if ($scope.model.cekpilihManual5 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            
            var pttmedis = ''
            if ($scope.model.cekpilihManual6 == true) {
                pttmedis = '&pttmedis=' + true
            }

            var pttdokter = ''
            if ($scope.model.cekpilihManual7 == true) {
                pttdokter = '&pttdokter=' + true
            }

            var pns = ''
            if ($scope.model.cekpilihManual32 == true) {
                pns = '&pns=' + true
            }

            var polri = ''
            if ($scope.model.cekpilihManual33 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get('sdm/get-rekap-data-pegawai?' + instalasi + ruangan + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false;
                var data = dat.data.data
                for (let i = 0; i < data.length; i++ ) {
                    if (data[i].departemen == null) {
                        data[i].departemen = "Belum Input Instalasi Kerja"
                    }
                }
                $scope.sourceStatus = new kendo.data.DataSource({
                    data: data,
                    pageSize: 50,
                    total: data.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
                $scope.columnStatus = {
                    toolbar: [
                        "excel",
                        // "pdf",
                    ],
                    excel: {
                        fileName: "DataPegawaiSudahInput.xlsx",
                        allPages: true,
                    },
                    pdf: {
    
                        fileName: "LaporanRekapPengunjung.pdf",
                        allPages: true,
                        avoidLinks: true,
                        paperSize: "A4",
                        margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                        landscape: true,
                        repeatHeaders: true,
                        template: $("#page-template").html(),
                        scale: 0.8
                    },
                    excelExport: function (e) {
    
                        var sheet = e.workbook.sheets[0];
                        // sheet.frozenRows = 2;
                        // sheet.mergedCells = ["A1:M1"];
                        // sheet.name = "LAPORAN";
    
                        // var myHeaders = [
    
                        //     {
                        //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                        //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        //         fontSize: 15,
                        //         textAlign: "center",
                        //         background: "#c1d2d2",
                        //         // color:"#ffffff"
                        //     }];
    
                        // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [
                        {
                            "field": "departemen",
                            "title": "Nama Instalasi",
                            "width": "150px"
                        },
                        {
                            "field": "jmlBelumLengkap",
                            "title": "Jumlah Belum Lengkap",
                            "width": "50px",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlBelumLengkapDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlBelumLengkap #</button>",
                        },
                        {
                            "field": "jmlSudahLengkap",
                            "title": "Jumlah Sudah Lengkap",
                            "width": "50px",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlSudahLengkapDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlSudahLengkap #</button>",
                        },
                    ]
                }
            })
        }
        $scope.jmlBelumLengkapDetail = function (dataPasienSelected) {
            $scope.isRouteLoading = true;
            debugger
            var departemen = "departemen=" + dataPasienSelected.objectdepartemenkerjafk;
            var link = "sdm/get-rekap-data-pegawai-detail?"
            var setParam = "&setParam=1"
            var ruangan = ''
            if ($scope.item.ruangan2 != undefined) {
                ruangan = '&ruangan=' + $scope.item.ruangan2.id
            }

            var unitKerja = ''
            if ($scope.item.unitKerja2 != undefined) {
                unitKerja = '&unitkerja=' + $scope.item.unitKerja2.id
            }

            var pttnomedis = ''
            if ($scope.model.cekpilihManual5 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            
            var pttmedis = ''
            if ($scope.model.cekpilihManual6 == true) {
                pttmedis = '&pttmedis=' + true
            }

            var pttdokter = ''
            if ($scope.model.cekpilihManual7 == true) {
                pttdokter = '&pttdokter=' + true
            }

            var pns = ''
            if ($scope.model.cekpilihManual32 == true) {
                pns = '&pns=' + true
            }

            var polri = ''
            if ($scope.model.cekpilihManual33 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get(link + departemen + setParam + ruangan + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false;
                debugger
                var detail = dat.data.data
                for (let i = 0; i < detail.length; i++) {
                    if (detail[i].email == null) {
                        detail[i].email = "Belum Input"
                    } else {
                        detail[i].email = "Sudah Input"
                    }
                    if (detail[i].nik_intern == null) {
                        detail[i].nik_intern = "Belum Input"
                    } else {
                        detail[i].nik_intern = "Sudah Input"
                    }
                    if (detail[i].nocm == null) {
                        detail[i].nocm = "Belum Input"
                    } else {
                        detail[i].nocm = "Sudah Input"
                    }
                    if (detail[i].objectagamafk == null) {
                        detail[i].objectagamafk = "Belum Input"
                    } else {
                        detail[i].objectagamafk = "Sudah Input"
                    }
                    if (detail[i].objectdepartemenkerjafk == null) {
                        detail[i].objectdepartemenkerjafk = "Belum Input"
                    } else {
                        detail[i].objectdepartemenkerjafk = "Sudah Input"
                    }
                    if (detail[i].objectjeniskelaminfk == null) {
                        detail[i].objectjeniskelaminfk = "Belum Input"
                    } else {
                        detail[i].objectjeniskelaminfk = "Sudah Input"
                    }
                    if (detail[i].objectpendidikanterakhirfk == null) {
                        detail[i].objectpendidikanterakhirfk = "Belum Input"
                    } else {
                        detail[i].objectpendidikanterakhirfk = "Sudah Input"
                    }
                    if (detail[i].objectruangankerjafk == null) {
                        detail[i].objectruangankerjafk = "Belum Input"
                    } else {
                        detail[i].objectruangankerjafk = "Sudah Input"
                    }
                    if (detail[i].objectunitkerjapegawaifk == null) {
                        detail[i].objectunitkerjapegawaifk = "Belum Input"
                    } else {
                        detail[i].objectunitkerjapegawaifk = "Sudah Input"
                    }
                    if (detail[i].tempatlahir == null) {
                        detail[i].tempatlahir = "Belum Input"
                    } else {
                        detail[i].tempatlahir = "Sudah Input"
                    }
                    if (detail[i].tgllahir == null) {
                        detail[i].tgllahir = "Belum Input"
                    } else {
                        detail[i].tgllahir = "Sudah Input"
                    }
                    // if (detail[i].email == null) {
                    //     detail2.push({
                    //         Data: "Email"
                    //     })
                    // }
                    // if (detail[i].nik_intern == null) {
                    //     detail2.push({
                    //         Data: "NIK"
                    //     })
                    // }
                    // if (detail[i].nocm == null) {
                    //     detail2.push({
                    //         Data: "No CM"
                    //     })
                    // }
                    // if (detail[i].objectagamafk == null) {
                    //     detail2.push({
                    //         Data: "Agama"
                    //     })
                    // }
                    // if (detail[i].objectdepartemenkerjafk == null) {
                    //     detail2.push({
                    //         Data: "Departemen Kerja"
                    //     })
                    // }
                    // if (detail[i].objectjeniskelaminfk == null) {
                    //     detail2.push({
                    //         Data: "Jenis Kelamin"
                    //     })
                    // }
                    // if (detail[i].objectpendidikanterakhirfk == null) {
                    //     detail2.push({
                    //         Data: "Pendidikan"
                    //     })
                    // }
                    // if (detail[i].objectruangankerjafk == null) {
                    //     detail2.push({
                    //         Data: "Ruang Kerja"
                    //     })
                    // }
                    // if (detail[i].objectunitkerjapegawaifk == null) {
                    //     detail2.push({
                    //         Data: "Unit Kerja"
                    //     })
                    // }
                    // if (detail[i].tempatlahir == null) {
                    //     detail2.push({
                    //         Data: "Tempat Lahir"
                    //     })
                    // }
                    // if (detail[i].tgllahir == null) {
                    //     detail2.push({
                    //         Data: "Tgl Lahir"
                    //     })
                    // }
                }
                $scope.dataPegawaiDetail = {
                    data: detail,
                    pageSize: 50,
                    total: detail.length
                }
                $scope.popUpDetail.center().open()
            })
        }
        $scope.jmlSudahLengkapDetail = function (dataPasienSelected) {
            $scope.isRouteLoading = true;
            debugger
            var departemen = "departemen=" + dataPasienSelected.objectdepartemenkerjafk;
            var link = "sdm/get-rekap-data-pegawai-detail?"
            var setParam = "&setParam=2"
            var ruangan = ''
            if ($scope.item.ruangan2 != undefined) {
                ruangan = '&ruangan=' + $scope.item.ruangan2.id
            }

            var unitKerja = ''
            if ($scope.item.unitKerja2 != undefined) {
                unitKerja = '&unitkerja=' + $scope.item.unitKerja2.id
            }

            var pttnomedis = ''
            if ($scope.model.cekpilihManual5 == true) {
                pttnomedis = '&pttnomedis=' + true
            }
            
            var pttmedis = ''
            if ($scope.model.cekpilihManual6 == true) {
                pttmedis = '&pttmedis=' + true
            }

            var pttdokter = ''
            if ($scope.model.cekpilihManual7 == true) {
                pttdokter = '&pttdokter=' + true
            }

            var pns = ''
            if ($scope.model.cekpilihManual32 == true) {
                pns = '&pns=' + true
            }

            var polri = ''
            if ($scope.model.cekpilihManual33 == true) {
                polri = '&polri=' + true
            }
            medifirstService.get(link + departemen + setParam + ruangan + unitKerja + pttnomedis + pttmedis + pttdokter + pns + polri).then(function(dat) {
                $scope.isRouteLoading = false;
                debugger
                var detail = dat.data.data
                for (let i = 0; i < detail.length; i++) {
                    if (detail[i].email == null) {
                        detail[i].email = "Belum Input"
                    } else {
                        detail[i].email = "Sudah Input"
                    }
                    if (detail[i].nik_intern == null) {
                        detail[i].nik_intern = "Belum Input"
                    } else {
                        detail[i].nik_intern = "Sudah Input"
                    }
                    if (detail[i].nocm == null) {
                        detail[i].nocm = "Belum Input"
                    } else {
                        detail[i].nocm = "Sudah Input"
                    }
                    if (detail[i].objectagamafk == null) {
                        detail[i].objectagamafk = "Belum Input"
                    } else {
                        detail[i].objectagamafk = "Sudah Input"
                    }
                    if (detail[i].objectdepartemenkerjafk == null) {
                        detail[i].objectdepartemenkerjafk = "Belum Input"
                    } else {
                        detail[i].objectdepartemenkerjafk = "Sudah Input"
                    }
                    if (detail[i].objectjeniskelaminfk == null) {
                        detail[i].objectjeniskelaminfk = "Belum Input"
                    } else {
                        detail[i].objectjeniskelaminfk = "Sudah Input"
                    }
                    if (detail[i].objectpendidikanterakhirfk == null) {
                        detail[i].objectpendidikanterakhirfk = "Belum Input"
                    } else {
                        detail[i].objectpendidikanterakhirfk = "Sudah Input"
                    }
                    if (detail[i].objectruangankerjafk == null) {
                        detail[i].objectruangankerjafk = "Belum Input"
                    } else {
                        detail[i].objectruangankerjafk = "Sudah Input"
                    }
                    if (detail[i].objectunitkerjapegawaifk == null) {
                        detail[i].objectunitkerjapegawaifk = "Belum Input"
                    } else {
                        detail[i].objectunitkerjapegawaifk = "Sudah Input"
                    }
                    if (detail[i].tempatlahir == null) {
                        detail[i].tempatlahir = "Belum Input"
                    } else {
                        detail[i].tempatlahir = "Sudah Input"
                    }
                    if (detail[i].tgllahir == null) {
                        detail[i].tgllahir = "Belum Input"
                    } else {
                        detail[i].tgllahir = "Sudah Input"
                    }
                    // if (detail[i].email == null) {
                    //     detail2.push({
                    //         Data: "Email"
                    //     })
                    // }
                    // if (detail[i].nik_intern == null) {
                    //     detail2.push({
                    //         Data: "NIK"
                    //     })
                    // }
                    // if (detail[i].nocm == null) {
                    //     detail2.push({
                    //         Data: "No CM"
                    //     })
                    // }
                    // if (detail[i].objectagamafk == null) {
                    //     detail2.push({
                    //         Data: "Agama"
                    //     })
                    // }
                    // if (detail[i].objectdepartemenkerjafk == null) {
                    //     detail2.push({
                    //         Data: "Departemen Kerja"
                    //     })
                    // }
                    // if (detail[i].objectjeniskelaminfk == null) {
                    //     detail2.push({
                    //         Data: "Jenis Kelamin"
                    //     })
                    // }
                    // if (detail[i].objectpendidikanterakhirfk == null) {
                    //     detail2.push({
                    //         Data: "Pendidikan"
                    //     })
                    // }
                    // if (detail[i].objectruangankerjafk == null) {
                    //     detail2.push({
                    //         Data: "Ruang Kerja"
                    //     })
                    // }
                    // if (detail[i].objectunitkerjapegawaifk == null) {
                    //     detail2.push({
                    //         Data: "Unit Kerja"
                    //     })
                    // }
                    // if (detail[i].tempatlahir == null) {
                    //     detail2.push({
                    //         Data: "Tempat Lahir"
                    //     })
                    // }
                    // if (detail[i].tgllahir == null) {
                    //     detail2.push({
                    //         Data: "Tgl Lahir"
                    //     })
                    // }
                }
                $scope.dataPegawaiDetail = {
                    data: detail,
                    pageSize: 50,
                    total: detail.length
                }
                $scope.popUpDetail.center().open()
            })
        }
        $scope.columnPegawaiDetail = {toolbar: [
            "excel",
            // "pdf",
        ],
        excel: {
            fileName: "DataPegawaiSudahInput.xlsx",
            allPages: true,
        },
        pdf: {

            fileName: "LaporanRekapPengunjung.pdf",
            allPages: true,
            avoidLinks: true,
            paperSize: "A4",
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: true,
            repeatHeaders: true,
            template: $("#page-template").html(),
            scale: 0.8
        },
        excelExport: function (e) {

            var sheet = e.workbook.sheets[0];
            // sheet.frozenRows = 2;
            // sheet.mergedCells = ["A1:M1"];
            // sheet.name = "LAPORAN";

            // var myHeaders = [

            //     {
            //         value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA PENGUNJUNG " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
            //             DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
            //         fontSize: 15,
            //         textAlign: "center",
            //         background: "#c1d2d2",
            //         // color:"#ffffff"
            //     }];

            // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
        },
            selectable: 'row',
            sortable: false,
            reorderable: true,
            filterable: false,
            pageable: true,
            columnMenu: false,
            resizable: true,
            columns: [
                {
                    "field": "namalengkap",
                    "title": "Nama Pegawai",
                    "width": "150px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruang kerja",
                    "width": "100px"
                },
                {
                    "field": "email",
                    "title": "Email",
                    "width": "80px",
                    attributes: {
                        class: "#=email == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "nik_intern",
                    "title": "NIK",
                    "width": "80px",
                    attributes: {
                        class: "#=nik_intern == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "nocm",
                    "title": "No CM",
                    "width": "80px",
                    attributes: {
                        class: "#=nocm == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "objectagamafk",
                    "title": "Agama",
                    "width": "80px",
                    attributes: {
                        class: "#=objectagamafk == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "objectdepartemenkerjafk",
                    "title": "Departemen Kerja",
                    "width": "80px",
                    attributes: {
                        class: "#=objectdepartemenkerjafk == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "objectjeniskelaminfk",
                    "title": "Jenis Kelamin",
                    "width": "80px",
                    attributes: {
                        class: "#=objectjeniskelaminfk == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "objectpendidikanterakhirfk",
                    "title": "Pendidikan Terakhir",
                    "width": "80px",
                    attributes: {
                        class: "#=objectpendidikanterakhirfk == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "objectruangankerjafk",
                    "title": "Ruangan Kerja",
                    "width": "80px",
                    attributes: {
                        class: "#=objectruangankerjafk == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "objectunitkerjapegawaifk",
                    "title": "Unit Kerja",
                    "width": "80px",
                    attributes: {
                        class: "#=objectunitkerjapegawaifk == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "tempatlahir",
                    "title": "Tempat Lahir",
                    "width": "80px",
                    attributes: {
                        class: "#=tempatlahir == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
                {
                    "field": "tgllahir",
                    "title": "Tgl Lahir",
                    "width": "80px",
                    attributes: {
                        class: "#=tgllahir == 'Belum Input' ? 'red' : 'ijo' #"
                    },
                },
            ]
        }
    }
])
})