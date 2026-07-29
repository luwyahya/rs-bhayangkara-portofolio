define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RencanaPenatalaksanaanTerpaduCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
        function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.cc = {};
            $scope.item.obj = []
            var dataLoad = []
            $scope.cc.emrfk = 2109; // As requested, emrfk set to 0
            $scope.now = new Date();
            var paramSearch = ''
            var nomorEMRSS = '';
            var nomorEMR = '-'
            $scope.lainnya = false;
            var lanjut = false;
            var totalNilai = 0;
            LoadCacheHelper()
            loadCombo()

            function loadCombo() {
                medifirstService.getPart("emr/get-combo-dokter-new", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });
            }

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRMelektronik');
                if (chacePeriode != undefined) {
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
                    $scope.cc.jenisemr = "rencanapenatalaksanaanterpadu"
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi

                    init()
                }
            }

            // Inisialisasi awal baris
            $scope.listBaris = [];
            let baseIdAwal = 300000000;

            function buatBarisBaru(index) {
                let baseId = baseIdAwal + (index * 10);
                return {
                    no: index + 1,
                    idTglJam: baseId,
                    idProfesi: baseId + 1,
                    idMasalah: baseId + 2,
                    idTujuan: baseId + 3,
                    idRencana: baseId + 4,
                    idDpjp: baseId + 5,
                    idTglTeratasi: baseId + 6,
                    idMasalahTeratasi: baseId + 7
                };
            }

            $scope.listBaris.push(buatBarisBaru(0)); // 1 baris awal

            $scope.tambahBarisManual = function () {
                let indexBaru = $scope.listBaris.length;
                $scope.listBaris.push(buatBarisBaru(indexBaru));
            };

            $scope.hapusBaris = function (index) {
                if ($scope.listBaris.length > 1) {
                    $scope.listBaris.splice(index, 1);
                } else {
                    toastr.info("Minimal 1 baris tidak bisa dihapus");
                }
            };

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=rencanapenatalaksanaanterpadu", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    if (dat.data.data.length > 0) {
                        for (let i = 0; i < dat.data.data.length; i++) {
                            if (dat.data.data[i].jenisemr == 'rencanapenatalaksanaanterpadu') {
                                lanjut = true;
                            }
                        }
                        if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                        }
                    }
                })
            }

            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isLoading = false
                    $scope.item.obj = []
                    dataLoad = dat.data.data
                    let maxIndex = -1;
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                            // Deteksi jumlah baris yang sudah tersimpan
                            let diff = parseInt(dataLoad[i].emrdfk) - baseIdAwal;
                            if (diff >= 0 && diff < 100000) {
                                let idx = Math.floor(diff / 10);
                                if (idx > maxIndex) maxIndex = idx;
                            }

                            if (dataLoad[i].type == "textbox" || dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }
                            if (dataLoad[i].type == "text" || dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }
                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                            }
                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1], id: res[0], namalengkap: res[1] }
                            }
                        }
                    }

                    if (maxIndex >= 0) {
                        $scope.listBaris = [];
                        for (let j = 0; j <= maxIndex; j++) {
                            $scope.listBaris.push(buatBarisBaru(j));
                        }
                    }
                });
            }

            $scope.cetakPdf = function () {
                $scope.popUpCetak.center().open();
            };

            $scope.tutupCetak = function () {
                $scope.popUpCetak.close();
            };

            $scope.isLakiLaki = function() {
                if (!$scope.cc.jeniskelamin) return false;
                return $scope.cc.jeniskelamin.toLowerCase().indexOf('laki') > -1;
            };

            $scope.isPerempuan = function() {
                if (!$scope.cc.jeniskelamin) return false;
                return $scope.cc.jeniskelamin.toLowerCase().indexOf('perempuan') > -1;
            };

            $scope.formatTanggal = function (tanggal) {
                if (!tanggal) return "";
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            };

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (let i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] != undefined && $scope.item.obj[parseInt(arrobj[i])] !== "") {
                        let val = $scope.item.obj[parseInt(arrobj[i])];
                        if (val && typeof val === 'object' && val.hasOwnProperty('id') && val.hasOwnProperty('namalengkap')) {
                            arrSave.push({ id: arrobj[i], values: { value: val.id, text: val.namalengkap } })
                        } else if (val && typeof val === 'object' && val.hasOwnProperty('value') && val.hasOwnProperty('text')) {
                            arrSave.push({ id: arrobj[i], values: { value: val.value, text: val.text } })
                        } else {
                            arrSave.push({ id: arrobj[i], values: val })
                        }
                    }
                }

                $scope.cc.jenisemr = 'rencanapenatalaksanaanterpadu'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-new', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr Rencana Penatalaksanaan Terpadu dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    init()
                });
            }

            $scope.Kembali = function () {
                $window.history.back();
            }
        }
    ])
})
