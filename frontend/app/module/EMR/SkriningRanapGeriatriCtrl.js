define(["initialize"], function (initialize) {
    "use strict";

    initialize.controller("SkriningRanapGeriatriCtrl", [
        "$mdDialog",
        "$q",
        "$rootScope",
        "$scope",
        "ModelItem",
        "$state",
        "CacheHelper",
        "DateHelper",
        "MedifirstService",

        function (
            $mdDialog,
            $q,
            $rootScope,
            $scope,
            ModelItem,
            $state,
            cacheHelper,
            dateHelper,
            medifirstService
        ) {

            // ============================================================
            // INITIAL DATA
            // ============================================================

            $scope.item = {};
            $scope.item.obj = [];
            $scope.user = {};

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true;
            $scope.isCetak = true;
            $scope.isKembali = true;

            $scope.totalJawabanYa = 0;
            $scope.cc = {};

            var nomorEMR = "-";
            var nomorEMRSS = "";
            var paramSearch = "";

            $scope.isAdmin = false;
            $scope.isSave = true;
            $scope.isUpdate = false;
            $scope.isUpdateCetak = false;

            $scope.Back = function () {

                var confirm = $mdDialog.confirm()
                    .title("Konfirmasi")
                    .textContent("Yakin ingin mengosongkan semua jawaban?")
                    .ok("Ya")
                    .cancel("Tidak");

                $mdDialog.show(confirm).then(function () {

                    $scope.item.obj = {};
                    $scope.totalJawabanYa = 0;

                });

            };

            // ============================================================
            // SETTING EMR
            // ============================================================

            $scope.cc.emrfk = 2108;
            $scope.cc.jenisemr = "skrininggeriatri";
            $scope.now = new Date();
            $scope.tipemodul = "skrininggeriatri";

            // ============================================================
            // LIST PERTANYAAN GERIATRI
            // Pemetaan emrdfk_ya (Jawaban Ya) & emrdfk_tidak (Jawaban Tidak)
            // ============================================================

            $scope.listPertanyaanGeriatri = [
                { id: 1,  emrdfk_ya: 1368, emrdfk_tidak: 2368, nama: "Berkurangnya Kemampuan Gerak (Immobilisation)" },
                { id: 2,  emrdfk_ya: 1369, emrdfk_tidak: 2369, nama: "Jatuh dan Patah Tulang (Instabilitas Postural)" },
                { id: 3,  emrdfk_ya: 1362, emrdfk_tidak: 2362, nama: "Mengompol (Inkontinensia Urin)" },
                { id: 4,  emrdfk_ya: 1367, emrdfk_tidak: 2367, nama: "Infeksi (Infection)" },
                { id: 5,  emrdfk_ya: 1364, emrdfk_tidak: 2364, nama: "Gangguan Fungsi Indera (Impairment Of Senses)" },
                { id: 6,  emrdfk_ya: 1365, emrdfk_tidak: 2365, nama: "Kekurangan Gizi (Inanition)" },
                { id: 7,  emrdfk_ya: 1370, emrdfk_tidak: 2370, nama: "Masalah Akibat Tindakan Medis (Iatrogenik)" },
                { id: 8,  emrdfk_ya: 1371, emrdfk_tidak: 2371, nama: "Gangguan Tidur (Insomnia)" },
                { id: 9,  emrdfk_ya: 1372, emrdfk_tidak: 2372, nama: "Gangguan Fungsi Kognitif (Intellectual Impairment)" },
                { id: 10, emrdfk_ya: 1373, emrdfk_tidak: 2373, nama: "Isolasi atau Menarik Diri (Isolation)" },
                { id: 11, emrdfk_ya: 1374, emrdfk_tidak: 2374, nama: "Berkurangnya Kemampuan Keuangan (Impecunity)" },
                { id: 12, emrdfk_ya: 1363, emrdfk_tidak: 2363, nama: "Konstipasi (Impaction)" },
                { id: 13, emrdfk_ya: 1366, emrdfk_tidak: 2366, nama: "Gangguan Sistem Imun (Immune Deficiency)" },
                { id: 14, emrdfk_ya: 1375, emrdfk_tidak: 2375, nama: "Gangguan Fungsi Seksual (Impotence)" }
            ];

            // ============================================================
            // LOAD CACHE
            // ============================================================

            LoadCacheHelper();

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
                    $scope.cc.namadpjp = chacePeriode[16];
                    $scope.cc.pgId = chacePeriode[17];
                    $scope.cc.alamat = chacePeriode[15];
                    $scope.cc.ruangakakhir = chacePeriode[24];

                    $scope.cc.norec_emr = "-";
                    paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;

                    init();
                }

                if (
                    medifirstService.getKelompokUser() == "admin" ||
                    medifirstService.getKelompokUser() == "operator"
                ) {
                    $scope.isAdmin = true;
                }
            }

            // ============================================================
            // INIT
            // ============================================================

            function init() {
                $scope.isLoading = true;
                $scope.item.obj = [];

                medifirstService
                    .get(
                        "emr/get-emr-transaksi?" +
                        paramSearch +
                        "&jenisEmr=" +
                        $scope.cc.jenisemr,
                        true
                    )
                    .then(function (dat) {
                        $scope.isRouteLoading = false;

                        if (dat.data && dat.data.data && dat.data.data.length > 0) {
                            $scope.isSave = false;
                            $scope.isUpdate = true;
                            $scope.isUpdateCetak = true;

                            $scope.cc.noemr = dat.data.data[0].noemr;
                            $scope.cc.norec_emr = dat.data.data[0].noemr;
                            nomorEMRSS = dat.data.data[0].noemr;

                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
                        } else {
                            $scope.isLoading = false;
                        }
                    })
                    .catch(function (err) {
                        console.error("ERROR GET EMR TRANSAKSI:", err);
                        $scope.isLoading = false;
                    });
            }

            // ============================================================
            // LOAD DETAIL EMR TRANSAKSI NEW
            // ============================================================

            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService
                    .get(
                        "emr/get-emr-transaksi-detail-new?noemr=" +
                        nomorEMRSS +
                        "&emrfk=" +
                        emrfk,
                        true
                    )
                    .then(function (dat) {
                        $scope.isLoading = false;
                        var dataLoad = dat.data && dat.data.data ? dat.data.data : [];

                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                                if (dataLoad[i].type == "checkbox") {
                                    var checkedd = false;
                                    if (
                                        dataLoad[i].value == "1" ||
                                        dataLoad[i].value == "true" ||
                                        dataLoad[i].value === true
                                    ) {
                                        checkedd = true;
                                    }
                                    $scope.item.obj[dataLoad[i].emrdfk] = checkedd;
                                } else if (dataLoad[i].type == "combobox") {
                                    var str = dataLoad[i].value;
                                    if (str != null) {
                                        var res = str.split("~");
                                        $scope.item.obj[dataLoad[i].emrdfk] = {
                                            id: res[0],
                                            namalengkap: res[1] !== undefined ? res[1] : res[0]
                                        };
                                    }
                                } else if (dataLoad[i].type == "datetime") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).toDate();
                                } else {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                                }
                            }
                        }

                        // Hitung total skor berdasarkan data yang di-load
                        $scope.hitungTotal();
                    })
                    .catch(function (err) {
                        console.error("ERROR LOAD DETAIL EMR:", err);
                        $scope.isLoading = false;
                    });
            }

            // ============================================================
            // FUNGSI SWITCH UNCHECK DUA CHECKBOX DALAM SATU GRUP
            // ============================================================

            $scope.toggleSwitch = function (idChecked, arrGroup) {
                if ($scope.item.obj[idChecked]) {
                    // Uncheck opsi lain dalam grup yang sama
                    for (var i = 0; i < arrGroup.length; i++) {
                        if (arrGroup[i] !== idChecked) {
                            $scope.item.obj[arrGroup[i]] = false;
                        }
                    }
                }
                $scope.hitungTotal();
            };

            // ============================================================
            // HITUNG TOTAL JAWABAN YA
            // ============================================================

            $scope.hitungTotal = function () {
                var countYa = 0;

                if ($scope.listPertanyaanGeriatri && $scope.listPertanyaanGeriatri.length > 0) {
                    $scope.listPertanyaanGeriatri.forEach(function (q) {
                        if ($scope.item.obj[q.emrdfk_ya] === true) {
                            countYa++;
                        }
                    });
                }

                $scope.totalJawabanYa = countYa;
            };

            // ============================================================
            // KEMBALI
            // ============================================================

            $scope.kembali = function () {
                $rootScope.showRiwayat();
            };

            // ============================================================
            // KONFIRMASI SIMPAN
            // ============================================================

            $scope.Save = function () {
                var confirm = $mdDialog
                    .confirm()
                    .title("Konfirmasi")
                    .textContent("Apakah Anda yakin akan menyimpan data?")
                    .ariaLabel("Konfirmasi Simpan")
                    .cancel("Tidak")
                    .ok("Ya");

                $mdDialog.show(confirm).then(function () {
                    $scope.Saveok();
                });
            };

            // ============================================================
            // PROSES SIMPAN
            // ============================================================

            $scope.Saveok = function () {
                $scope.isLoading = true;
                var arrSave = [];

                var arrobj = Object.keys($scope.item.obj);
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    var currentId = arrobj[i];
                    var currentObj = $scope.item.obj[parseInt(currentId)];

                    if (
                        currentObj !== undefined &&
                        currentObj !== "" &&
                        currentObj !== false &&
                        currentObj !== null
                    ) {
                        if (typeof currentObj === 'object' && currentObj.id) {
                            arrSave.push({
                                id: currentId,
                                values: { value: currentObj.id, text: currentObj.namalengkap }
                            });
                        } else {
                            arrSave.push({
                                id: currentId,
                                values: currentObj
                            });
                        }
                    }
                }

                $scope.cc.jenisemr = "skrininggeriatri";
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                };

                medifirstService
                    .post("emr/save-emr-new", jsonSave)
                    .then(function (e) {
                        $scope.noemr = e.data.data.noemr;

                        medifirstService
                            .postLogging(
                                "EMR",
                                "norec emrpasien_t",
                                e.data.data.norec,
                                "Skrining Rawat Inap Geriatri dengan No EMR - " +
                                e.data.data.noemr +
                                " pada No Registrasi " +
                                $scope.cc.noregistrasi
                            )
                            .then(function () {
                                var arrStr = { 0: $scope.noemr };
                                cacheHelper.set("cacheNomorEMR", arrStr);
                                $scope.isLoading = false;
                                $rootScope.showRiwayat();
                            });
                    })
                    .catch(function (err) {
                        console.error("ERROR SAVE EMR:", err);
                        $scope.isLoading = false;
                    });
            };

        }
    ]);
});