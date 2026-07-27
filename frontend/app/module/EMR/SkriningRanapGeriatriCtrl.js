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
            $scope.user = {};

            $scope.noCM = $state.params.noCM;

            $scope.tombolSimpanVis = true;
            $scope.isCetak = true;
            $scope.isKembali = true;

            $scope.noRecPap = cacheHelper.get("noRecPap");

            $scope.totalJawabanYa = 0;

            $scope.cc = {};

            var nomorEMR = "-";
            var nomorEMRSS = "";
            var paramSearch = "";

            $scope.isAdmin = false;
            $scope.isSave = true;
            $scope.isUpdate = false;
            $scope.isUpdateCetak = false;

            // ============================================================
            // SETTING EMR
            // ============================================================

            $scope.cc.emrfk = 2108;
            $scope.cc.jenisemr = "skrininggeriatri";

            $scope.now = new Date();

            $scope.item.obj = {};
            $scope.item.obj2 = {};

            $scope.item.image = "../app/images/svg/no-image.svg";

            $scope.tipemodul = "skrininggeriatri";

            // ============================================================
            // LIST PERTANYAAN GERIATRI
            // ============================================================

            $scope.listPertanyaanGeriatri = [

                {
                    id: 1,
                    emrdfk: 1368,
                    nama: "Berkurangnya Kemampuan Gerak (Immobilisation)"
                },

                {
                    id: 2,
                    emrdfk: 1369,
                    nama: "Jatuh dan Patah Tulang (Instabilitas Postural)"
                },

                {
                    id: 3,
                    emrdfk: 1362,
                    nama: "Mengompol (Inkontinensia Urin)"
                },

                {
                    id: 4,
                    emrdfk: 1367,
                    nama: "Infeksi (Infection)"
                },

                {
                    id: 5,
                    emrdfk: 1364,
                    nama: "Gangguan Fungsi Indera (Impairment Of Senses)"
                },

                {
                    id: 6,
                    emrdfk: 1365,
                    nama: "Kekurangan Gizi (Inanition)"
                },

                {
                    id: 7,
                    emrdfk: 1370,
                    nama: "Masalah Akibat Tindakan Medis (Iatrogenik)"
                },

                {
                    id: 8,
                    emrdfk: 1371,
                    nama: "Gangguan Tidur (Insomnia)"
                },

                {
                    id: 9,
                    emrdfk: 1372,
                    nama: "Gangguan Fungsi Kognitif (Intellectual Impairment)"
                },

                {
                    id: 10,
                    emrdfk: 1373,
                    nama: "Isolasi atau Menarik Diri (Isolation)"
                },

                {
                    id: 11,
                    emrdfk: 1374,
                    nama: "Berkurangnya Kemampuan Keuangan (Impecunity)"
                },

                {
                    id: 12,
                    emrdfk: 1363,
                    nama: "Konstipasi (Impaction)"
                },

                {
                    id: 13,
                    emrdfk: 1366,
                    nama: "Gangguan Sistem Imun (Immune Deficiency)"
                },

                {
                    id: 14,
                    emrdfk: 1375,
                    nama: "Gangguan Fungsi Seksual (Impotence)"
                }

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

                    paramSearch =
                        "noregistrasi=" +
                        $scope.cc.noregistrasi;

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

                // Reset data
                $scope.item.obj = {};

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

                        nomorEMRSS = "";

                        if (
                            dat.data &&
                            dat.data.data &&
                            dat.data.data.length > 0
                        ) {

                            var isExist = false;

                            for (
                                var i = 0;
                                i < dat.data.data.length;
                                i++
                            ) {

                                if (
                                    dat.data.data[i].jenisemr ==
                                    $scope.cc.jenisemr
                                ) {

                                    isExist = true;

                                    nomorEMRSS =
                                        dat.data.data[i].noemr;

                                    break;

                                }

                            }

                            if (
                                isExist &&
                                nomorEMRSS !== ""
                            ) {

                                $scope.isSave = false;
                                $scope.isUpdate = true;
                                $scope.isUpdateCetak = true;

                                $scope.cc.noemr =
                                    nomorEMRSS;

                                $scope.cc.norec_emr =
                                    nomorEMRSS;

                                nomorEMR =
                                    nomorEMRSS;

                                setobjectToModel(
                                    nomorEMRSS,
                                    $scope.cc.emrfk
                                );

                            } else {

                                $scope.isLoading = false;

                            }

                        } else {

                            $scope.isLoading = false;

                        }

                    })

                    .catch(function (err) {

                        console.error(
                            "ERROR GET EMR TRANSAKSI:",
                            err
                        );

                        $scope.isLoading = false;

                    });

            }

            // ============================================================
            // LOAD DETAIL EMR
            // ============================================================

            function setobjectToModel(
                nomorEMRSS,
                emrfk
            ) {

                console.log(
                    "=== START LOAD DETAIL EMR ==="
                );

                console.log(
                    "Nomor EMR:",
                    nomorEMRSS
                );

                console.log(
                    "EMRFK:",
                    emrfk
                );

                medifirstService

                    .get(
                        "emr/get-emr-transaksi-detail-new" +
                        "?noemr=" +
                        nomorEMRSS +
                        "&emrfk=" +
                        emrfk,
                        true
                    )

                    .then(function (dat) {

                        $scope.isLoading = false;

                        var dataLoad =
                            dat.data &&
                            dat.data.data
                                ? dat.data.data
                                : [];

                        console.log(
                            "=== RESPONSE DETAIL EMR ==="
                        );

                        console.log(
                            "Total Data:",
                            dataLoad.length
                        );

                        var tempObj = {};

                        for (
                            var i = 0;
                            i < dataLoad.length;
                            i++
                        ) {

                            var itemData =
                                dataLoad[i];

                            if (
                                parseInt(
                                    $scope.cc.emrfk
                                ) ===
                                parseInt(
                                    itemData.emrfk
                                )
                            ) {

                                var emrdfkInt =
                                    parseInt(
                                        itemData.emrdfk
                                    );

                                var val =
                                    itemData.value;

                                console.log(
                                    "DATA EMR:",
                                    {
                                        emrdfk:
                                            emrdfkInt,

                                        value:
                                            val,

                                        type:
                                            typeof val
                                    }
                                );

                                if (
                                    val !== null &&
                                    val !== undefined &&
                                    val !== ""
                                ) {

                                    // ====================================================
                                    // KONVERSI VALUE MENJADI BOOLEAN
                                    // ====================================================

                                    if (
                                        val === true ||
                                        val === "true" ||
                                        val === "1" ||
                                        val === 1
                                    ) {

                                        tempObj[
                                            emrdfkInt
                                        ] = true;

                                    }

                                    else if (
                                        val === false ||
                                        val === "false" ||
                                        val === "0" ||
                                        val === 0
                                    ) {

                                        tempObj[
                                            emrdfkInt
                                        ] = false;

                                    }

                                    else {

                                        tempObj[
                                            emrdfkInt
                                        ] = val;

                                    }

                                }

                            }

                        }

                        console.log(
                            "=== DATA FINAL YANG DILOAD ==="
                        );

                        console.log(
                            tempObj
                        );

                        $scope.$evalAsync(function () {

                            $scope.item.obj =
                                tempObj;

                            $scope.hitungTotal();

                        });

                    })

                    .catch(function (err) {

                        console.error(
                            "ERROR LOAD DETAIL EMR:",
                            err
                        );

                        $scope.isLoading = false;

                    });

            }

            // ============================================================
            // HITUNG TOTAL JAWABAN YA
            // ============================================================

            $scope.hitungTotal = function () {

                var countYa = 0;

                if (
                    $scope.listPertanyaanGeriatri &&
                    $scope.listPertanyaanGeriatri.length > 0
                ) {

                    $scope.listPertanyaanGeriatri
                        .forEach(function (q) {

                            var val =
                                $scope.item.obj[
                                    q.emrdfk
                                ];

                            console.log(
                                "Checking Soal ID:",
                                q.id,
                                "| emrdfk:",
                                q.emrdfk,
                                "| Current Value:",
                                val
                            );

                            if (
                                val === true
                            ) {

                                countYa++;

                            }

                        });

                }

                $scope.totalJawabanYa =
                    countYa;

                console.log(
                    "TOTAL JAWABAN YA:",
                    $scope.totalJawabanYa
                );

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

                var confirm =
                    $mdDialog

                        .confirm()

                        .title(
                            "Konfirmasi"
                        )

                        .textContent(
                            "Apakah Anda yakin akan menyimpan data?"
                        )

                        .ariaLabel(
                            "Konfirmasi Simpan"
                        )

                        .cancel(
                            "Tidak"
                        )

                        .ok(
                            "Ya"
                        );

                $mdDialog

                    .show(confirm)

                    .then(function () {

                        $scope.Saveok();

                    });

            };

            // ============================================================
            // PROSES SIMPAN
            // ============================================================

            $scope.Saveok = function () {

                $scope.isUpdateCetak = false;

                $scope.isLoading = true;

                var photo = "";

                if (
                    $(".surface").length > 0
                ) {

                    kendo.drawing

                        .drawDOM(
                            $(".surface")
                        )

                        .then(function (group) {

                            return kendo.drawing.exportImage(
                                group
                            );

                        })

                        .done(function (data) {

                            photo = data;

                        });

                }

                var photo2 = "";

                if (
                    $(".surface2").length > 0
                ) {

                    kendo.drawing

                        .drawDOM(
                            $(".surface2")
                        )

                        .then(function (group) {

                            return kendo.drawing.exportImage(
                                group
                            );

                        })

                        .done(function (data2) {

                            photo2 = data2;

                        });

                }

                // ========================================================
                // SIAPKAN DATA
                // ========================================================

                var arrobj =
                    Object.keys(
                        $scope.item.obj
                    );

                var arrSave = [];

                for (
                    var i =
                        arrobj.length - 1;
                    i >= 0;
                    i--
                ) {

                    var currentId =
                        parseInt(
                            arrobj[i]
                        );

                    var currentValue =
                        $scope.item.obj[
                            currentId
                        ];

                    if (
                        currentValue !== undefined &&
                        currentValue !== null &&
                        currentValue !== ""
                    ) {

                        var formattedValue =
                            "";

                        // ====================================================
                        // VALUE BOOLEAN
                        // ====================================================

                        if (
                            typeof currentValue ===
                            "boolean"
                        ) {

                            formattedValue =
                                currentValue
                                    ? "true"
                                    : "false";

                        }

                        // ====================================================
                        // VALUE OBJECT
                        // ====================================================

                        else if (
                            typeof currentValue ===
                            "object"
                        ) {

                            var valId =
                                currentValue.id ||
                                currentValue.value ||
                                "";

                            var valText =
                                currentValue.namalengkap ||
                                currentValue.text ||
                                "";

                            formattedValue =
                                valId &&
                                valText
                                    ? valId +
                                      "~" +
                                      valText
                                    : valId ||
                                      valText;

                        }

                        // ====================================================
                        // VALUE LAIN
                        // ====================================================

                        else {

                            formattedValue =
                                currentValue.toString();

                        }

                        arrSave.push({

                            id:
                                arrobj[i],

                            values:
                                formattedValue

                        });

                    }

                }

                // ========================================================
                // TAMBAH IMAGE
                // ========================================================

                if (
                    photo
                ) {

                    arrSave.push({

                        id:
                            "2421",

                        values:
                            photo

                    });

                }

                if (
                    photo2
                ) {

                    arrSave.push({

                        id:
                            "2422",

                        values:
                            photo2

                    });

                }

                // ========================================================
                // JSON SAVE
                // ========================================================

                var jsonSave = {

                    head:
                        $scope.cc,

                    data:
                        arrSave,

                    image:
                        $scope.item.image !==
                        undefined &&
                        $scope.item.image !==
                        "../app/images/svg/no-image.svg"
                            ? $scope.item.image
                            : null

                };

                console.log(
                    "===================================="
                );

                console.log(
                    "JSON YANG AKAN DISIMPAN:"
                );

                console.log(
                    jsonSave
                );

                console.log(
                    "ARR SAVE:"
                );

                console.log(
                    arrSave
                );

                console.log(
                    "===================================="
                );

                // ========================================================
                // POST SIMPAN EMR
                // ========================================================

                medifirstService

                    .post(
                        "emr/save-emr-new",
                        jsonSave
                    )

                    .then(function (e) {

                        console.log(
                            "=== SAVE EMR BERHASIL ==="
                        );

                        console.log(
                            e
                        );

                        $scope.isSave =
                            false;

                        $scope.isUpdate =
                            true;

                        $scope.isUpdateCetak =
                            true;

                        nomorEMR =
                            e.data.data.noemr;

                        $scope.noemr =
                            e.data.data.noemr;

                        $scope.cc.norec_emr =
                            e.data.data.noemr;

                        // ====================================================
                        // POST LOGGING DIHAPUS
                        // Karena error:
                        // postLoggingEMR is not a function
                        // ====================================================

                        console.log(
                            "Logging EMR dilewati karena fungsi postLoggingEMR tidak tersedia"
                        );

                        var arrStr = {

                            0:
                                e.data.data.noemr

                        };

                        cacheHelper.set(

                            "cacheNomorEMR",

                            arrStr

                        );

                        // ====================================================
                        // LOAD ULANG DATA SETELAH SAVE
                        // ====================================================

                        if (
                            typeof LoadCacheHelper ===
                            "function"
                        ) {

                            LoadCacheHelper();

                        }

                        $scope.isLoading =
                            false;

                    })

                    .catch(function (err) {

                        console.error(
                            "===================================="
                        );

                        console.error(
                            "ERROR SAVE EMR:"
                        );

                        console.error(
                            err
                        );

                        console.error(
                            "===================================="
                        );

                        $scope.isLoading =
                            false;

                    });

            };

        }

    ]);

});