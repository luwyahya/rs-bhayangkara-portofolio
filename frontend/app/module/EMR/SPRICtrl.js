define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SPRICtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isKembali = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 2022
            var dataLoad = []
            $scope.item = {};
            $scope.item.objcbo = []
            $scope.item.obj = []
            $scope.isCetak = true
            var paramSearch = ''
            $scope.user = {};
            $scope.istempatLaporan = true;
            var nomorEMRSS = '';
            var nomorEMR = '-'
            var noemr = ''
            LoadCacheHelper();
            loadCombo();

            $scope.listTujuanRanap = [
                {id: 1, tujuanranap: 'Preventif'},
                {id: 2, tujuanranap: 'Kuratif'},
                {id: 3, tujuanranap: 'Rehabilitatif'},
                {id: 4, tujuanranap: 'Paliatif'}
            ]

            $scope.listPenjamin = [
                {id: 1, penjamin: 'Umum'},
                {id: 2, penjamin: 'Jasa Raharja'},
                {id: 3, penjamin: 'Asuransi Lain'},
                {id: 4, penjamin: 'KTT'},
                {id: 5, penjamin: 'BPJS Tenaga Kerja'},
                {id: 6, penjamin: 'BPJS Kesehatan Polri'},
                {id: 7, penjamin: 'BPJS Keluarga Polri'},
                {id: 8, penjamin: 'BPJS Non Polri'},
            ]

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
                    $scope.cc.tgllahir = chacePeriode[18]
                    $scope.cc.rekanan = chacePeriode[21]
                    $scope.cc.objectdepartemenfk = chacePeriode[23]
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    init()
                }
            }
            function init() {
                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listDokter = e.data.dokter
                    // $scope.listRuangan = e.data.ri
                    //  
                })
                // medifirstService.get("emr/get-diagnosa-combo-all").then(function (dat) {

                //     $scope.listDiagnosa = dat.data;
                // });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                $scope.isRouteLoading = true
                medifirstService.get("registrasi/get-bynocm?noCm=" + $scope.cc.nocm).then(function (e) {
                    //  
                    $scope.isRouteLoading = false
                    var result = e.data.data
                    if (result.foto)
                        $scope.item.image = result.foto
                    $scope.item.noCmIbu = result.nocm;
                    $scope.item.namaIbu = result.namapasien
                    $scope.item.namaPasien = result.namapasien + " By Ny";
                    $scope.item.alamatLengkap = result.alamatlengkap
                    $scope.item.tempatLahir = result.tempatlahir;
                    $scope.item.jenisKelamin = { id: result.objectjeniskelaminfk, jeniskelamin: result.jeniskelamin }
                    if (result.objectagamafk)
                        $scope.item.agama = { id: result.objectagamafk, agama: result.agama }
                    // $scope.item.kebangsaan = { id: $scope.listKebangsaan._data[1].id, name: $scope.listKebangsaan._data[1].name }
                    if (result.kodepos)
                        $scope.item.kodePos = result.kodepos;
                    $scope.idIbu = result.nocmfk;
                    if (result.namasuamiistri)
                        $scope.item.namaAyah = result.namasuamiistri;
                    if (result.namasuamiistri)
                        $scope.item.namaKeluarga = result.namasuamiistri;
                    if (result.notelepon)
                        $scope.item.noTelepon = result.notelepon;
                    if (result.nohp)
                        $scope.item.noHp = result.nohp;

                    if (result.objectpekerjaanfk == '128') {
                        $scope.item.pangkat = { id: result.pangkatpns, namapangkat: result.namapangkatpns }
                        $scope.item.kesatuan = { id: result.objectkesatuanfk, kesatuanpasien: result.kesatuanpasien }
                    } else if (result.objectpekerjaanfk == '6') {
                        $scope.item.pangkat = { id: result.pangkatpolisi, namapangkat: result.namapangkatpolisi }
                        $scope.item.kesatuan = { id: result.objectkesatuanfk, kesatuanpasien: result.kesatuanpasien }
                    } else {
                        // $scope.item.pangkat = { id: result.pangkatkeluarga, namapangkat: result.namapangkatkel }
                    }

                    // $scope.item.kesatuan = { id: result.objectkesatuanfk, kesatuanpasien: result.kesatuanpasien }

                    if (result.objectdesakelurahanfk) {
                        medifirstService.get("registrasi/get-desa-kelurahan-paging?iddesakelurahan=" + result.objectdesakelurahanfk).then(function (re) {
                            if (re.data[0] != undefined) {
                                var data = {
                                    id: re.data[0].id,
                                    namadesakelurahan: re.data[0].namadesakelurahan,
                                    kodepos: re.data[0].kodepos,
                                    namakecamatan: re.data[0].namakecamatan,
                                    namakotakabupaten: re.data[0].namakotakabupaten,
                                    namapropinsi: re.data[0].namapropinsi,
                                    objectkecamatanfk: re.data[0].objectkecamatanfk,
                                    objectkotakabupatenfk: re.data[0].objectkotakabupatenfk,
                                    objectpropinsifk: re.data[0].objectpropinsifk,
                                    desa: re.data[0].namadesakelurahan,
                                }
                                $scope.listDataKelurahan.add(data)
                                $scope.item.desaKelurahan = data
                            }
                        });
                    }
                    if (result.objectkecamatanfk)
                        $scope.item.kecamatan = { id: result.objectkecamatanfk, namakecamatan: result.namakecamatan }
                    if (result.objectkotakabupatenfk)
                        $scope.item.kotaKabupaten = { id: result.objectkotakabupatenfk, namakotakabupaten: result.namakotakabupaten, }
                    if (result.objectpropinsifk)
                        $scope.item.propinsi = { id: result.objectpropinsifk, namapropinsi: result.namapropinsi }

                    if ($scope.item.kodePos != undefined && $scope.item.kodePos != null) {
                        $scope.findKodePos();
                    } else {

                    }

                }, function (error) {
                    $scope.isRouteLoading = false
                })

                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi

                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=spri", true).then(function (dat) {

                    $scope.isRouteLoading = false
                    if (dat.data.data.length > 0) {
                        $scope.noemr = dat.data.data[0].noemr
                        $scope.cc.norec_emr = dat.data.data[0].noemr
                        nomorEMRSS = ''
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = 2022;
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        $scope.item.obj[796] = $scope.cc.tglregistrasi
                        $scope.item.obj[798] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                        loadDiagnosa10()
                    }
                });

                function setobjectToModel(nomorEMRSS, emrfk) {
                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {

                        $scope.isLoading = false
                        var chekedd = false
                        $scope.item.obj2 = []
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
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].type == "time") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
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
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "703") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], hubungankeluarga: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "708") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], hubungankeluarga: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "795") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], kodeNama: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "799") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], namalengkap: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4806") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], namaruangan: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "367") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], namaruangan: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "218") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], tujuanranap: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "366") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], namalengkap: str }
                                }
                                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "130") {
                                    var str = dataLoad[i].value
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], penjamin: str }
                                }
                                if (dataLoad[i].type == "photo") {
                                    $scope.user.poto = dataLoad[i].value
                                }
                            }

                        }
                    })
                }


                /*Capitalize*/
                $scope.$watch('item.obj[701]', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        var nama = $scope.item.obj[701].toUpperCase()
                        $scope.item.obj[701] = nama;
                    }
                });
                $scope.$watch('item.obj[705]', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        var nama = $scope.item.obj[705].toUpperCase()
                        $scope.item.obj[705] = nama;
                    }
                });
                $scope.$watch('item.obj[706]', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        var nama = $scope.item.obj[706].toUpperCase()
                        $scope.item.obj[706] = nama;
                    }
                });
                $scope.$watch('item.obj[1]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[2]', function (e) {
                    if (e == true) {
                        $scope.item.obj[1] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[3]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[7]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[4]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[5]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[8]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[6] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[6]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[10] = false;
                    }
                })
                $scope.$watch('item.obj[10]', function (e) {
                    if (e == true) {
                        $scope.item.obj[2] = false;
                        $scope.item.obj[3] = false;
                        $scope.item.obj[1] = false;
                        $scope.item.obj[4] = false;
                        $scope.item.obj[5] = false;
                        $scope.item.obj[7] = false;
                        $scope.item.obj[8] = false;
                        $scope.item.obj[6] = false;
                    }
                })

                $scope.treeSourceRuangan = [];
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=navigasi").then(function (e) {
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                children: "child",
                                expanded: true
                            }
                        }
                    });
                    $scope.treeSourceBedah = inlineDefault
                    $scope.mainTreeViewBedahOption = {
                        dataTextField: ["caption"],
                        datakKeyField: ["id"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: false
                    }
                    // var treeview = $("#treeview").data("kendoTreeView");
                    // .expandPath([2, 5])
                })
            }

            function loadCombo() {
                $q.all([
                    medifirstService.get("registrasi/get-combo-registrasi"),
                    medifirstService.get("registrasi/get-combo-address"),
                ]).then(function (result) {

                    if (result[0].statResponse) {
                        $scope.listDataJenisKelamin = result[0].data.jeniskelamin
                        $scope.listDataPekerjaan = result[0].data.pekerjaan
                        $scope.listDataAgama = result[0].data.agama
                        $scope.listDataPendidikan = result[0].data.pendidikan
                        $scope.listDataStatusPerkawinan = result[0].data.statusperkawinan
                        $scope.listGolonganDarah = result[0].data.golongandarah
                        $scope.listSuku = result[0].data.suku
                        $scope.listpangkat = result[0].data.pangkat
                        $scope.listjeniskelompokpasien = result[0].data.jeniskelompokpasien
                        $scope.listkesatuanpasien = result[0].data.kesatuanpasien
                        $scope.listkaryawanrs = result[0].data.karyawanrs
                        $scope.listhubungankeluarga = result[0].data.hubungankeluarga
                        $scope.listanggotaaktif = result[0].data.anggotaaktif
                        $scope.listsatuanKerja = result[0].data.satuankerjapasien
                    }
                    if (result[1].statResponse) {
                        $scope.listDataKecamatan = result[1].data.kecamatan
                        $scope.listDataKotaKabupaten = result[1].data.kotakabupaten
                        $scope.listDataPropinsi = result[1].data.propinsi
                        $scope.listKebangsaan = result[1].data.kebangsaan
                        $scope.listNegara = result[1].data.negara
                        $scope.item.kebangsaan = $scope.listKebangsaan[0]

                    }
                })
                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listRuangan = e.data.ruangan
                    $scope.listRuanganDari = e.data.ruangigdrajal
                    $scope.listPerawat = e.data.perawat
                })
            }
            function loadDiagnosa10() {
                medifirstService.get('emr/get-diagnosapasienbynoreg?noReg=' + $scope.cc.noregistrasi).then(function (dat) {
                    for (let i = 0; i < dat.data.datas.length; i++) {
                        if ($scope.cc.objectdepartemenfk == 24) {
                            if (dat.data.datas[i].objectjenisdiagnosafk == 5) {
                                $scope.item.obj[795] = { id: dat.data.datas[i].objectdiagnosafk, kodeNama: dat.data.datas[i].kddiagnosa + " - " + dat.data.datas[i].namadiagnosa }
                            }
                        } else {
                            if (dat.data.datas[i].objectjenisdiagnosafk == 1) {
                                $scope.item.obj[795] = { id: dat.data.datas[i].objectdiagnosafk, kodeNama: dat.data.datas[i].kddiagnosa + " - " + dat.data.datas[i].namadiagnosa }
                            }
                        }
                    }
                    if ($scope.cc.objectdepartemenfk == 24) {
                        loadDokterPengkajianIgd()
                    } else {
                        loadDpjp()
                    }
                })
            }
            function loadDokterPengkajianIgd() {
                medifirstService.get('emr/get-pengkajian-awal-medis?noRegistrasi=' + $scope.cc.noregistrasi).then(function (dat) {
                    let data = dat.data
                    let tampungNama = '';
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].emrdfk == 2447) {
                            tampungNama = data[i].value
                        }
                    }
                    if (tampungNama != '') {
                        for (let i = 0; $scope.listDokter.length; i++) {
                            if ($scope.listDokter[i].namalengkap == tampungNama) {
                                $scope.item.obj[799] = { id: $scope.listDokter[i].id, namalengkap: tampungNama }
                            }
                        }
                    }
                })
            }
            function loadDpjp() {
                medifirstService.get('emr/get-dpjp-for-spri?noregistrasi=' + $scope.cc.noregistrasi).then(function (dat) {
                    $scope.item.obj[799] = { id: dat.data[0].id, namalengkap: dat.data[0].namalengkap }
                })
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }


            $scope.kembali = function () {

                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            

            $scope.cetakPermohonanRawatInap = function () {
                debugger
                medifirstService.get('registrasi/get-kelas-penjamin?noregistrasi=' + $scope.cc.noregistrasi).then(function (dat) {
                    let kelaspenjamin = '-';
                    if (dat.data.length > 0) {
                        if ($scope.cc.kelompokpasien != "Umum/Pribadi") {
                            kelaspenjamin = dat.data[0].namakelas
                        }
                    }
                    if (nomorEMR == '' || nomorEMR == '-') return
                    var user = medifirstService.getPegawaiLogin();
                    var arrPush = []
                    var ruangan = '';
                    let umur = dateHelper.CountAge(new Date($scope.cc.tgllahir), new Date($scope.cc.tglregistrasi))
                    let umurz = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr';
                    let pangkat = '-';
                    let kesatuan = '-';
                    var dari = '-';
                    var indikasi = '-';
                    var tujuan = '-';
                    var rencana = '-';
                    var perkiraan = '-';
                    var konfirmasi = '-';
                    var ruangann = '-';
                    var tgloperasi = '-';
                    if ($scope.item.pangkat != undefined) {
                        pangkat = $scope.item.pangkat.namapangkat
                    }
                    if ($scope.item.kesatuan != undefined) {
                        kesatuan = $scope.item.kesatuan.kesatuanpasien
                    }
                    // for (var i = 0; i <= 150 - 1; i++) {
                    //     arrPush.push({ emrdfk: i.toString(), value: "" })
                    // }
                    var isi = "     Demikian surat pernyataan kronologi kejadian ini saya buat dengan sesungguhnya. Apabila lain hari surat ini tidak benar maka saya siap dipidanakan sesuai dengan hukum yang berlaku."
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].emrdfk == 702) {
                                var diagnosa = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 796) {
                                var tglmasuk = moment(dataLoad[i].value).format('DD-MM-YYYY')
                            } else if (dataLoad[i].emrdfk == 797) {
                                tgloperasi = moment(dataLoad[i].value).format('DD-MM-YYYY')
                            } else if (dataLoad[i].emrdfk == 798) {
                                var tglsurat = moment(dataLoad[i].value).format('DD-MM-YYYY')
                            } else if (dataLoad[i].emrdfk == 799) {
                                var dokter = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 367) {
                                var dari = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 358) {
                                var indikasi = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 358) {
                                var indikasi = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 218) {
                                var tujuan = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 379) {
                                var rencana = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 372) {
                                var perkiraan = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 366) {
                                var konfirmasi = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 4806) {
                                var ruangann = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 1) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "PICU"
                                }
                            } else if (dataLoad[i].emrdfk == 2) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "NICU"
                                }
                            } else if (dataLoad[i].emrdfk == 3) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ICU"
                                }
                            } else if (dataLoad[i].emrdfk == 7) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ISOLASI NON TB"
                                }
                            } else if (dataLoad[i].emrdfk == 4) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ISOLASI TB"
                                }
                            } else if (dataLoad[i].emrdfk == 5) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "PERINA"
                                }
                            } else if (dataLoad[i].emrdfk == 8) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ISOLASI PINERE"
                                }
                            } else if (dataLoad[i].emrdfk == 6) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "RAWAT BIASA"
                                }
                            } else if (dataLoad[i].emrdfk == 10) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "TAHANAN"
                                }
                            }
                        }
                    }
                    let qrcode = "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-fleksibel-aps?namaPegawai=" + $scope.item.obj[799].namalengkap + '&pesan=' + 'SURAT PERMOHONAN RAWAT INAP' + "&noregistrasi=" + $scope.cc.noregistrasi + "&tglcetak=" + moment($scope.item.obj[798]).format('YYYY-MM-DD HH:mm')

                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namapetugas", "namapasien", "umur", "jeniskelamin", "nocm", "pangkat", "kesatuan", "diagnosa", "tglmasuk", "tgloperasi", "tglsurat", "dokter", "alamat", "nohp", "qrcode", "ruangan", "penjamin", "kelaspenjamin", "dari", "indikasi", "tujuan", "rencana", "perkiraan", "konfirmasi", "ruangann"],
                        "paramValue": [user.namaLengkap, $scope.cc.namapasien, umurz, $scope.cc.jeniskelamin, $scope.cc.nocm, pangkat, kesatuan, diagnosa, tglmasuk, tgloperasi, tglsurat, dokter, $scope.item.alamatLengkap, $scope.item.noHp, qrcode, ruangan, $scope.cc.rekanan, kelaspenjamin, dari, indikasi, tujuan, rencana, perkiraan, konfirmasi, ruangann],
                        "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            // console.log(this.response, typeof this.response);
                            // var res = this.response
                            // var file = new Blob( [res], {type: 'application/pdf'});
                            var url = window.URL.createObjectURL(this.response)
                            // var jenis = 'laporanoperasi';
                            // getBase64(file,jenis)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }


                    //ash 2023-11-30 untuk menentukan apa dia PPA atau bukan
                    var datauserkelompok = medifirstService.getKelompokUser();


                    // if (datauserkelompok == "ppa") {
                        if (window.location.hostname.indexOf('localhost') > -1) {
                            xhr.open('POST', 'http://127.0.0.16:8797/generic/report/suratPermohonanRawatInap.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/suratPermohonanRawatInap.pdf');
                        }
                    // } else {
                    //     if (window.location.hostname.indexOf('localhost') > -1) {
                    //         xhr.open('POST', 'http://127.0.0.16:8797/generic/report/suratPermohonanRawatInapSalinan.pdf');
                    //     } else {
                    //         xhr.open('POST', '/jasper1/generic/report/suratPermohonanRawatInapSalinan.pdf');
                    //     }
                    // }


                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    // saveToFilePapj();
                })
            }

            



            $scope.hapusSPRI = function () {
                debugger
                let hapusSPRI = {
                    noregistrasifk: $scope.cc.noregistrasi
                }
                medifirstService.post('registrasi/hapus-spri', hapusSPRI).then(function (e) {
                    init();
                    loadCombo();
                })
            }

            $scope.Save = function () {
                // if ($scope.item.obj[367] == undefined) {
                //     toastr.warning('Dari ruangan belum dipilih!')
                //     return;
                // }
                if ($scope.item.obj[702] == undefined) {
                    toastr.warning('Diagnosis masih kosong!')
                    return;
                }
                if ($scope.item.obj[358] == undefined) {
                    toastr.warning('Indikasi rawat inap masih kosong!')
                    return;
                }
                if ($scope.item.obj[218] == undefined) {
                    toastr.warning('Tujuan rawat inap belum dipilih!')
                    return;
                }
                if ($scope.item.obj[379] == undefined) {
                    toastr.warning('Rencana asuhan masih kosong!')
                    return;
                }
                if ($scope.item.obj[372] == undefined) {
                    toastr.warning('Perkiraan hasil asuhan masih kosong!')
                    return;
                }
                // if ($scope.item.obj[797] == undefined) {
                //     toastr.warning('Tanggal operasi masih kosong!')
                //     return;
                // }
                // if ($scope.item.obj[1] == undefined && $scope.item.obj[2] == undefined && $scope.item.obj[3] == undefined && $scope.item.obj[4] == undefined && $scope.item.obj[5] == undefined && $scope.item.obj[6] == undefined && $scope.item.obj[7] == undefined && $scope.item.obj[8] == undefined && $scope.item.obj[10] == undefined) {
                //     toastr.warning('Ruangan belum dipilih!')
                //     return;
                // }
                // if ($scope.item.obj[366] == undefined) {
                //     toastr.warning('Konfirmasi ruangan belum dipilih!')
                //     return;
                // }
                // if ($scope.item.obj[4806] == undefined) {
                //     toastr.warning('Ruangan belum dipilih!')
                //     return;
                // }
                // if ($scope.item.obj[130] == undefined) {
                //     toastr.warning('Status Penjamin belum dipilih!')
                //     return;
                // }
                // if ($scope.item.obj[19] == undefined) {
                //     toastr.warning('Belum di tanda tangani oleh pasien!')
                //     return;
                // }
                // var photo = ""
                // kendo.drawing.drawDOM($(".surface"))
                //     .then(function (group) {
                //          ;
                //         // Render the result as a SVG document
                //         return kendo.drawing.exportImage(group);
                //     }).done(function (data) {
                //         photo = data
                //          ;
                //     })
                $scope.tombolSimpanVis = false;
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 703) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].hubungankeluarga })
                    } else if (arrobj[i] == 708) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].hubungankeluarga })
                    } else if (arrobj[i] == 795) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].kodeNama })
                    } else if (arrobj[i] == 799) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 5470) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namaruangan })
                    } else if (arrobj[i] == 4806) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namaruangan })
                    } else if (arrobj[i] == 367) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namaruangan })
                    } else if (arrobj[i] == 218) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].tujuanranap })
                    } else if (arrobj[i] == 366) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 130) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].penjamin })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                // arrSave.push({ id: "132", values: photo })
                $scope.cc.jenisemr = 'spri'
                debugger
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Surat Persetujuan Rawat Inap ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })

                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })
                    init()
                    // saveToFilePapj(arrSave);
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    if (e.status != 201) {
                        $scope.tombolSimpanVis = true;
                    } else {
                        $scope.tombolSimpanVis = true
                    }
                });

            }
            function getBase64(file, jenis) {
                debugger
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    // foto.push({ foto: (reader.result), id: 4 })
                    saveFilePapj(reader.result, jenis)
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            function saveFilePapj(file, jenis) {
                debugger
                let objSave = {
                    'jenis': jenis,
                    'noregistrasi': $scope.cc.noregistrasi,
                    'file': file
                }
                medifirstService.postNonMessage('registrasi/post-file-papj', objSave).then(function (e) {

                })
            }
            function saveToFilePapj(arrSave) {
                medifirstService.get('registrasi/get-kelas-penjamin?noregistrasi=' + $scope.cc.noregistrasi).then(function (dat) {
                    let kelaspenjamin = '-';
                    if (dat.data.length > 0) {
                        if ($scope.cc.kelompokpasien != "Umum/Pribadi") {
                            kelaspenjamin = dat.data[0].namakelas
                        }
                    }
                    if (nomorEMR == '') return
                    var user = medifirstService.getPegawaiLogin();
                    var arrPush = []
                    var ruangan = '';
                    let umur = dateHelper.CountAge(new Date($scope.cc.tgllahir), new Date($scope.cc.tglregistrasi))
                    let umurz = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr';
                    let pangkat = '-';
                    let kesatuan = '-';
                    var dari = '-';
                    var indikasi = '-';
                    var tujuan = '-';
                    var rencana = '-';
                    var perkiraan = '-';
                    var konfirmasi = '-';
                    var ruangann = '-';
                    var tgloperasi = '-';
                    if ($scope.item.pangkat != undefined) {
                        pangkat = $scope.item.pangkat.namapangkat
                    }
                    if ($scope.item.kesatuan != undefined) {
                        kesatuan = $scope.item.kesatuan.kesatuanpasien
                    }
                    // for (var i = 0; i <= 150 - 1; i++) {
                    //     arrPush.push({ emrdfk: i.toString(), value: "" })
                    // }
                    var isi = "     Demikian surat pernyataan kronologi kejadian ini saya buat dengan sesungguhnya. Apabila lain hari surat ini tidak benar maka saya siap dipidanakan sesuai dengan hukum yang berlaku."
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].emrdfk == 702) {
                                var diagnosa = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 796) {
                                var tglmasuk = moment(dataLoad[i].value).format('DD-MM-YYYY')
                            } else if (dataLoad[i].emrdfk == 797) {
                                tgloperasi = moment(dataLoad[i].value).format('DD-MM-YYYY')
                            } else if (dataLoad[i].emrdfk == 798) {
                                var tglsurat = moment(dataLoad[i].value).format('DD-MM-YYYY')
                            } else if (dataLoad[i].emrdfk == 799) {
                                var dokter = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 367) {
                                var dari = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 358) {
                                var indikasi = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 358) {
                                var indikasi = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 218) {
                                var tujuan = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 379) {
                                var rencana = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 379) {
                                var perkiraan = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 366) {
                                var konfirmasi = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 4806) {
                                var ruangann = dataLoad[i].value;
                            } else if (dataLoad[i].emrdfk == 1) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "PICU"
                                }
                            } else if (dataLoad[i].emrdfk == 2) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "NICU"
                                }
                            } else if (dataLoad[i].emrdfk == 3) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ICU"
                                }
                            } else if (dataLoad[i].emrdfk == 7) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ISOLASI NON TB"
                                }
                            } else if (dataLoad[i].emrdfk == 4) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ISOLASI TB"
                                }
                            } else if (dataLoad[i].emrdfk == 5) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "PERINA"
                                }
                            } else if (dataLoad[i].emrdfk == 8) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "ISOLASI PINERE"
                                }
                            } else if (dataLoad[i].emrdfk == 6) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "RAWAT BIASA"
                                }
                            } else if (dataLoad[i].emrdfk == 10) {
                                if (dataLoad[i].value == 1) {
                                    ruangan = "TAHANAN"
                                }
                            }
                        }
                    }
                    let qrcode = "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-fleksibel-aps?namaPegawai=" + $scope.item.obj[799].namalengkap + '&pesan=' + 'SURAT PERMOHONAN RAWAT INAP' + "&noregistrasi=" + $scope.cc.noregistrasi + "&tglcetak=" + moment($scope.item.obj[798]).format('YYYY-MM-DD HH:mm')

                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namapetugas", "namapasien", "umur", "jeniskelamin", "nocm", "pangkat", "kesatuan", "diagnosa", "tglmasuk", "tgloperasi", "tglsurat", "dokter", "alamat", "nohp", "qrcode", "ruangan", "penjamin", "kelaspenjamin", "dari", "indikasi", "tujuan", "rencana", "perkiraan", "konfirmasi", "ruangann"],
                        "paramValue": [user.namaLengkap, $scope.cc.namapasien, umurz, $scope.cc.jeniskelamin, $scope.cc.nocm, pangkat, kesatuan, diagnosa, tglmasuk, tgloperasi, tglsurat, dokter, $scope.item.alamatLengkap, $scope.item.noHp, qrcode, ruangan, $scope.cc.rekanan, kelaspenjamin, dari, indikasi, tujuan, rencana, perkiraan, konfirmasi, ruangann],
                        "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            var res = this.response
                            var file = new Blob([res], { type: 'application/pdf' });
                            var url = window.URL.createObjectURL(this.response)
                            var jenis = 'spri';
                            getBase64(file, jenis)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    
                    if (window.location.hostname.indexOf('localhost') > -1) {
                        xhr.open('POST', 'http://127.0.0.16:8797/generic/report/suratPermohonanRawatInap.pdf');
                    } else {
                        xhr.open('POST', '/jasper1/generic/report/suratPermohonanRawatInap.pdf');
                    }
                                              

                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                })
            }
            $scope.TTDPasien = function () {
                $scope.item.obj[19] = $scope.cc.namapasien
            }
        } //BATAS SUCI
    ]);
});