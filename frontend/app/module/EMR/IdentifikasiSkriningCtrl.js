define(["initialize"], function (initialize) {
    "use strict";
    initialize.controller("IdentifikasiSkriningCtrl", [
        "$q",
        "$rootScope",
        "$scope",
        "$state",
        "CacheHelper",
        "MedifirstService",
        "ModelItem",
        function (
            $q,
            $rootScope,
            $scope,
            $state,
            cacheHelper,
            medifirstService,
            ModelItem
        ) {
            $scope.item = {}
            $scope.now = new Date()
            $scope.item.obj = []
            $scope.cc = {}
            $scope.cc.emrfk = 2052
            var dataLoad = [];
            var nomorEMRSS = ""
            var nomorEMR = "-"
            var paramSearch = ""
            var lanjut = false
            LoadCacheHelper()
            LoadCombo()

            function LoadCombo() {
                medifirstService.get("emr/get-combo").then(function (dat) {
                    $scope.listPerawat = dat.data.pegawai;
                    $scope.listDokter = dat.data.dokter;
                    $scope.listRuangan = dat.data.ruangan;

                    var pegawaiLogin = medifirstService.getPegawaiLogin();
                    if (pegawaiLogin && pegawaiLogin.id) {
                        var found = false;
                        for (var i = 0; i < $scope.listPerawat.length; i++) {
                            if ($scope.listPerawat[i].id == pegawaiLogin.id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $scope.listPerawat.push({
                                id: pegawaiLogin.id,
                                namalengkap: pegawaiLogin.namaLengkap || pegawaiLogin.namalengkap
                            });
                        }
                        $scope.item.obj[129] = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap || pegawaiLogin.namalengkap };
                    }
                });

                medifirstService
                    .getPart(
                        "registrasi/daftar-registrasi/get-data-diagnosa",
                        true,
                        true,
                        10
                    )
                    .then(function (data) {
                        $scope.listDiagnosa = data;
                    });
                medifirstService
                    .get("rawatinap/get-dokters-combos", false)
                    .then(function (data) {
                        $scope.listDokter = data.data.dokter;
                    });
            }

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get("cacheRMelektronik");
                if (chacePeriode != undefined) {
                    $scope.cc.nocm = chacePeriode[0];
                    $scope.cc.namapasien = chacePeriode[1];
                    $scope.cc.jeniskelamin = chacePeriode[2];
                    $scope.cc.noregistrasi = chacePeriode[3];
                    $scope.cc.umur = chacePeriode[4];
                    $scope.cc.kelompokpasien = chacePeriode[5];
                    $scope.cc.tglregistrasi = chacePeriode[6];
                    $scope.cc.norec = chacePeriode[7];
                    $scope.cc.norec_pd = chacePeriode[8];
                    $scope.cc.objectkelasfk = chacePeriode[9];
                    $scope.cc.namakelas = chacePeriode[10];
                    $scope.cc.objectruanganfk = chacePeriode[11];
                    $scope.cc.namaruangan = chacePeriode[12];
                    $scope.cc.DataNoregis = chacePeriode[13];
                    $scope.cc.tglLahir = chacePeriode[14];
                    $scope.cc.norec_emr = "-";
                    $scope.cc.jenisemr = "identifikasiskrining";
                    paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
                    init();
                }
                if (medifirstService.getKelompokUser() == 'admin' || medifirstService.getKelompokUser() == 'operator') {
                    $scope.isAdmin = true
                }
            }

            function ClearAll() {
                $scope.item = {};
            }

            function init() {
                $scope.item.obj = [];
                $scope.item.obj2 = [];
                $scope.isRouteLoading = true
                paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=identifikasiskrining", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    nomorEMRSS = "";
                    if (dat.data.data.length > 0) {
                        for (let i = 0; i < dat.data.data.length; i++) {
                            if (dat.data.data[i].jenisemr == "identifikasiskrining") {
                                lanjut = true
                            }
                        }
                        if (lanjut == true) {
                            $scope.cc.noemr = dat.data.data[0].noemr;
                            $scope.cc.norec_emr = dat.data.data[0].noemr;
                            nomorEMRSS = dat.data.data[0].noemr;
                            nomorEMR = nomorEMRSS;
                            $scope.cc.emrfk = 2052;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
                        }
                    } else {
                        $scope.item.obj[810] = moment($scope.now).format("HH:mm");
                        $scope.item.obj[798] = moment($scope.now).format("YYYY-MM-DD");
                    }
                });
                $scope.isRouteLoading = false
            }

            function setobjectToModel(nomorEMRSS, emrfk) {
                let namaPegawai = ""
                medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isRouteLoading = false
                    var chekedd = false
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].value == "1") {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            } else if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "time") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            } else if (dataLoad[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                $scope.item.obj2[dataLoad[i].emrdfk] = true
                            } else if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "text") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            } else if (dataLoad[i].type == "combobox") {
                                try {
                                    var parsed = JSON.parse(dataLoad[i].value);
                                    if (parsed.hasOwnProperty('value') && parsed.hasOwnProperty('text')) {
                                        if (dataLoad[i].emrdfk == "39" || dataLoad[i].emrdfk == "129") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = { id: parsed.value, namalengkap: parsed.text };
                                        } else {
                                            $scope.item.obj[dataLoad[i].emrdfk] = { id: parsed.value, namadiagnosa: parsed.text };
                                        }
                                    } else {
                                        $scope.item.obj[dataLoad[i].emrdfk] = parsed;
                                    }
                                } catch (e) {
                                    var str = dataLoad[i].value;
                                    if (str.indexOf("~") > -1) {
                                        var res = str.split("~");
                                        if (dataLoad[i].emrdfk == "39" || dataLoad[i].emrdfk == "129") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] };
                                        } else {
                                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: res[1] };
                                        }
                                    } else {
                                        $scope.item.obj[dataLoad[i].emrdfk] = { id: str, namadiagnosa: str };
                                    }
                                }
                            } else if (dataLoad[i].type == "photo") {
                                $scope.user.poto = dataLoad[i].value;
                            } else if (dataLoad[i].type == "image") {
                                $scope.user.poto = dataLoad[i].value;
                            }

                        }
                    }
                    //   if (namaPegawai) {
                    //     medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
                    //       .then(function (et) {
                    //         $scope.item.qr = et.data.data;
                    //       })
                    //       .catch(function (error) {
                    //         console.error("QR Error:", error);
                    //       });
                    //   }
                })
            }

            $scope.Simpan = function () {
                $scope.isRouteLoading = true
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = [];
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    var currentId = arrobj[i];
                    var currentObj = $scope.item.obj[parseInt(currentId)];
                    if (currentObj != undefined && currentObj !== "") {
                        if (currentObj.hasOwnProperty('id') && currentObj.hasOwnProperty('namalengkap')) {
                            arrSave.push({ id: currentId, values: { value: currentObj.id, text: currentObj.namalengkap } });
                        } else if (currentObj.hasOwnProperty('id') && currentObj.hasOwnProperty('namadiagnosa')) {
                            arrSave.push({ id: currentId, values: { value: currentObj.id, text: currentObj.namadiagnosa } });
                        } else if (moment(currentObj).isValid() && !(typeof currentObj === 'boolean')) {
                            arrSave.push({
                                id: currentId,
                                values: moment(currentObj).format("YYYY-MM-DD HH:mm")
                            });
                        } else {
                            arrSave.push({ id: currentId, values: currentObj });
                        }
                    }
                }
                $scope.cc.jenisemr = "identifikasiskrining";
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave,
                };
                medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
                    $scope.noemr = e.data.data.noemr;
                    medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Pengkajian Medis Pasien Rawat Inap " + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
                        var arrStr = {
                            0: $scope.noemr,
                        };
                        cacheHelper.set("cacheNomorEMR", arrStr);
                        LoadCacheHelper();
                        init()
                        $scope.isRouteLoading = false
                    });
                });
            };

            $scope.Batal = function () {
                ClearAll()
            }
        } //BATAS SUCI
    ]);
});