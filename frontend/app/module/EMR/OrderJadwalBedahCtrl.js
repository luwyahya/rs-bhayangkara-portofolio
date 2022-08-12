define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OrderJadwalBedahCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglOperasi = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            var datalabstat = []
            var datalab = []
            var datalabs = []
            // $scope.cc = {}
            var dataLoadVitaSign = [];
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            $scope.header.DataNoregis = '';
            var myVar = 0
            var detail = ''
            var popc = true;
            $scope.item.obj = []
            $scope.item.obj2 = []


            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var jenisPelayananId = ""
            LoadCacheHelper();
            var norec_temp = "";

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.nocm = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.namapasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.jeniskelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.kelompokpasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    $scope.item.tglregistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.norec = chacePeriode[7]
                    $scope.item.norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.idkelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.namakelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    namaRuanganFk = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    $scope.item.objectruanganfk = chacePeriode[11]
                    $scope.item.namaruangan = chacePeriode[12]
                    $scope.item.DataNoregis = chacePeriode[13]
                    $scope.item.norec_emr = '-'
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    // if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                    //     $scope.showTombol = true
                    // }
                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });
                    medifirstService.get('sysadmin/general/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                        jenisPelayananId = e.data.jenispelayanan
                    })
                }
                loadDaftarRmPp($scope.item.noregistrasi);
                init()
            }

            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            //  LoadCache();
            //  function LoadCache(){
            //      var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterCtrl');
            //      if(chacePeriode != undefined){
            //          norec_apd = chacePeriode[0]
            //          nocm_str = chacePeriode[1]
            //          // $scope.item.ruanganAsal = namaRuangan;
            //          // manageSarprasPhp.getDataTableTransaksi("logistik/get_detailPD?norec_apd="+norec_apd, true).then(function(data_ih){
            //          //     $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
            //          //     $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
            //          //     $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
            //          // });
            //          init()
            //     }else{

            //     }

            // }
            $scope.$watch('item.ruangantujuan', function (newValue, oldValue) {
                if (newValue != oldValue && jenisPelayananId != '') {

                    medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan=" +
                        newValue.id +
                        "&idKelas=" +
                        6 +
                        "&idJenisPelayanan=" +
                        jenisPelayananId, true, 10, 10)
                        .then(function (x) {
                            $scope.listLayanan = x;
                            //    $scope.isRouteLoading = false;

                        })

                    //  modelItemAkuntansi.getDataDummyPHPV2('pelayanan/get-produk-penunjang-part?idRuangan='+newValue.id,true,10,10).then(function(e){
                    //      $scope.listLayanan = e
                    //  })
                }

            })

            function init() {

                medifirstService.get("emr/get-combo-penunjang?departemenfk=25", true).then(function (dat) {
                    $scope.item.ruanganAsal = $scope.item.namaRuangan

                    $scope.listRuanganTujuan = dat.data.ruangantujuan;
                    $scope.item.ruangantujuan = {
                        id: dat.data.ruangantujuan[5].id,
                        namaruangan: dat.data.ruangantujuan[5].namaruangan
                    };
                });

                medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-tindakan?idRuangan=44", true, 10, 10)
                    .then(function (x) {
                        $scope.listProduk = x;
                    })

                medifirstService.get("emr/get-emr-transaksi?noregistrasi=" + $scope.item.noregistrasi + "&jenisEmr=navigasi", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheVitalSign', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        // nomorEMRSS =  dat.data.data[0].noemr
                        // $scope.cc.emrfk = '147'
                        for (let i = 0; i < dat.data.data.length; i++) {
                            if (dat.data.data[i].emrfk == '147') {
                                setobjectToModel(dat.data.data[i].noemr, dat.data.data[i].emrfk)
                            } else if (dat.data.data[i].emrfk == '4') {
                                setobjectToModelBedah(dat.data.data[i].noemr, dat.data.data[i].emrfk)
                            }
                        }
                    }
                });

                medifirstService.get("emr/get-emr-transaksi?noregistrasi=" + $scope.item.noregistrasi + "&jenisEmr=bedah", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheVitalSign', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }

                        // for (let i = 0; i <  dat.data.data.length; i++) {
                        //     if(dat.data.data[i].emrfk == '147') {
                        //         setobjectToModel(dat.data.data[i].noemr,  dat.data.data[i].emrfk )
                        //     } else if(dat.data.data[i].emrfk == '4') {
                        //         setobjectToModelBedah(dat.data.data[i].noemr,  dat.data.data[i].emrfk )
                        //     }
                        // }

                        setobjectToModelBedah(dat.data.data[0].noemr, dat.data.data[0].emrfk)
                    }
                });

                medifirstService.get("emr/get-emr-transaksi?nocm=" + $scope.item.noMr + "&jenisEmr=bedah", true).then(function (dat) {
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });

                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listDokter = e.data.dokter
                    $scope.listPerawat = e.data.perawat
                    $scope.listRuangan = e.data.ruangan;
                })

                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                // medifirstService.get("get-detail-login", true).then(function (dat) {
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                // });

                if ($scope.header.DataNoregis == false) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)


                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }

                $scope.treeSourceRuangan = [];
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=bedah").then(function (e) {
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

            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    // $scope.item.obj = []
                    // $scope.item.obj2 = []

                    // dataLoadVitaSign.push([dat.data.data])
                    dataLoadVitaSign = dat.data.data
                    cacheHelper.set('cacheVitalSign', dataLoadVitaSign)
                    for (var i = 0; i <= dataLoadVitaSign.length - 1; i++) {
                        if ('147' == dataLoadVitaSign[i].emrfk) {
                            if (dataLoadVitaSign[i].type == "textbox") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = dataLoadVitaSign[i].value
                            }
                            if (dataLoadVitaSign[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoadVitaSign[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = chekedd
                            }

                            if (dataLoadVitaSign[i].type == "datetime") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = new Date(dataLoadVitaSign[i].value)
                            }
                            if (dataLoadVitaSign[i].type == "time") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = new Date(dataLoadVitaSign[i].value)
                            }
                            if (dataLoadVitaSign[i].type == "date") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = new Date(dataLoadVitaSign[i].value)
                            }

                            if (dataLoadVitaSign[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = dataLoadVitaSign[i].value
                                $scope.item.obj2[dataLoadVitaSign[i].emrdfk] = true
                            }
                            if (dataLoadVitaSign[i].type == "textarea") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = dataLoadVitaSign[i].value
                            }
                            if (dataLoadVitaSign[i].type == "combobox") {
                                var str = dataLoadVitaSign[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoadVitaSign[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], text: res[1] }
                            }
                        }
                    }
                })
            }

            function setobjectToModelBedah(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isLoading = false
                    var chekedd = false
                    // $scope.item.obj = []
                    // $scope.item.obj2 = []
                    // dataLoadVitaSign.push([dat.data.data])
                    dataLoadVitaSign = dat.data.data
                    for (var i = 0; i <= dataLoadVitaSign.length - 1; i++) {
                        if (emrfk == dataLoadVitaSign[i].emrfk) {

                            if (dataLoadVitaSign[i].type == "textbox") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = dataLoadVitaSign[i].value
                            }
                            if (dataLoadVitaSign[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoadVitaSign[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = chekedd
                                if (dataLoadVitaSign[i].emrdfk >= 74 && dataLoadVitaSign[i].emrdfk <= 78 && chekedd) {
                                    $scope.getSkalaNyeri(1, { descNilai: dataLoadVitaSign[i].reportdisplay })
                                }
                                if (dataLoadVitaSign[i].emrdfk >= 5053 && dataLoadVitaSign[i].emrdfk <= 5084 && dataLoadVitaSign[i].reportdisplay != null) {
                                    var datass = { id: dataLoadVitaSign[i].emrdfk, descNilai: dataLoadVitaSign[i].reportdisplay }
                                    $scope.getSkor2(datass)
                                }
                                if (dataLoadVitaSign[i].emrdfk >= 5085 && dataLoadVitaSign[i].emrdfk <= 5093 && dataLoadVitaSign[i].reportdisplay != null) {
                                    var datass = { id: dataLoadVitaSign[i].emrdfk, descNilai: dataLoadVitaSign[i].reportdisplay }
                                    $scope.getSkorNutrisi(datass)
                                }


                            }

                            if (dataLoadVitaSign[i].type == "datetime") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = new Date(dataLoadVitaSign[i].value)
                            }
                            if (dataLoadVitaSign[i].type == "time") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = new Date(dataLoadVitaSign[i].value)
                            }
                            if (dataLoadVitaSign[i].type == "date") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = new Date(dataLoadVitaSign[i].value)
                            }

                            if (dataLoadVitaSign[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = dataLoadVitaSign[i].value
                                $scope.item.obj2[dataLoadVitaSign[i].emrdfk] = true
                            }
                            if (dataLoadVitaSign[i].type == "textarea") {
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = dataLoadVitaSign[i].value
                            }
                            // if (dataLoadVitaSign[i].type == "combobox") {
                            //     var str = dataLoadVitaSign[i].value
                            //     var res = str.split("~");
                            //     $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], hubungankeluarga: str }
                            // }
                            // if (dataLoadVitaSign[i].type == "combobox" && dataLoadVitaSign[i].emrdfk == "708") {
                            //     var str = dataLoadVitaSign[i].value
                            //     var res = str.split("~");
                            //     $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], hubungankeluarga: str }
                            // }
                            if (dataLoadVitaSign[i].type == "combobox" && dataLoadVitaSign[i].emrdfk == "800") {
                                var str = dataLoadVitaSign[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], kodeNama: str }
                            }
                            if (dataLoadVitaSign[i].type == "combobox" && dataLoadVitaSign[i].emrdfk == "838") {
                                var str = dataLoadVitaSign[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], namaproduk: str }
                            }
                            if (dataLoadVitaSign[i].emrdfk == "809" || dataLoadVitaSign[i].emrdfk == "824" || dataLoadVitaSign[i].emrdfk == "825" || dataLoadVitaSign[i].emrdfk == "826") {
                                var str = dataLoadVitaSign[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], namalengkap: str }
                            }

                            if (dataLoadVitaSign[i].emrdfk == "800") {
                                var str = dataLoadVitaSign[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], kodeNama: str }
                            } else {
                                $scope.item.obj[834]
                            }

                            // if (dataLoadVitaSign[i].type == "combobox" && dataLoadVitaSign[i].emrdfk == "799") {
                            //     var str = dataLoadVitaSign[i].value
                            //     var res = str.split("~");
                            //     $scope.item.obj[dataLoadVitaSign[i].emrdfk] = { value: res[0], namalengkap: str }
                            // }
                            if (dataLoadVitaSign[i].type == "photo") {
                                $scope.user.poto = dataLoadVitaSign[i].value
                            }
                        }

                    }
                })
            }

            $scope.hitungLamaOP = function () {
                debugger
                var jamselesai = moment($scope.item.obj[811]).format('HH') * 60;
                var jammulai = moment($scope.item.obj[810]).format('HH') * 60;
                var selesai = moment($scope.item.obj[811]).format('mm') * 1 + jamselesai;
                var mulai = moment($scope.item.obj[810]).format('mm') * 1 + jammulai;
                var beda = selesai - mulai;
                var jam = Math.floor(beda / 60);
                var menit = beda % 60;
                $scope.item.obj[846] = jam + " jam " + menit + " menit";
                // $scope.item.lamaOP = moment($scope.item.obj[811]).format('YYYY-MM-DD HH:MM:SS') $scope.item.obj[811] - $scope.item.obj[810];
            }

            $scope.simpanAssesmenPraBedah = function () {
                // var photo = ""
                // kendo.drawing.drawDOM($(".surface"))
                //     .then(function (group) {
                //         debugger;
                //         // Render the result as a SVG document
                //         return kendo.drawing.exportImage(group);
                //     }).done(function (data) {
                //         photo = data
                //         debugger;
                //     })
                $scope.item.emrfk = '4'
                $scope.item.jenisemr = 'bedah'
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 703) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].hubungankeluarga })
                    } else if (arrobj[i] == 708) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].hubungankeluarga })
                    } else if (arrobj[i] == 800) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].kodeNama })
                    } else if (arrobj[i] == 838) {
                        debugger
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namaproduk })
                    } else if (arrobj[i] == 809 || arrobj[i] == 824 || arrobj[i] == 825 || arrobj[i] == 826) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 806 || arrobj[i] == 808) {
                        arrSave.push({ id: arrobj[i], values: moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm') })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                // arrSave.push({ id: "132", values: photo })
                // $scope.item.jenisemr = 'suratpersetujuan'
                var jsonSave = {
                    head: $scope.item,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Surat Persetujuan Jaminan Covid-19 ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.item.noregistrasi).then(function (res) {
                    //     })

                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })
                    init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $rootScope.loadHistoryEMRBedah = function () {
                debugger

                $scope.myVar = 1
                $scope.dataDaftar = []
                // medifirstService.get("emr/get-emr-transaksi?nocm=" + $scope.item.noMr + "&jenisEmr=bedah", true).then(function (dat) {
                //     $scope.dataDaftar = new kendo.data.DataSource({
                //         data: dat.data.data,
                //         pageSize: 10,


                //     });
                // });
            }

            $scope.resumeOptRm = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="AddHasilKonsul()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Hasil Laboratorium</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 30 },
                    { field: "tglpelayanan", title: "Tgl Pelayanan", width: 100 },
                    { field: "namaruangan", title: "Ruangan", width: 150 },
                    { field: "namaruanganasal", title: "Ruangan Asal", width: 150 },
                    { field: "dokterpemeriksa", title: "Dokter Pemeriksa", width: 150 },
                    { field: "namaproduk", title: "Layanan", width: 150 },
                    // { field: "namaproduk", click: simpanDeletePpRm(dataItem) , title: "Layanan", width: 150 },
                    // "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    // { command: [{text: "Hapus", click: simpanDeletePpRm }], title: "&nbsp;", width: 80 }
                    { field: "dokterpengirim", title: "Dokter Pengirim", width: 150 },
                    { field: "tglhasil", title: "Tgl Hasil", width: 100 },
                    { field: "tglcetak", title: "Tgl Cetak", width: 100 },
                    { command: [{ text: "Hapus", click: simpanDeletePpRm }], title: "&nbsp;", width: 80 }
                    // {command: [{name: "destroy", text: "Hapus"},{name: "edit", text: "Edit"}], title: "&nbsp;", width: 120 }
                ],

            };

            $scope.AddHasilKonsul = function () {
                var ruid = 575;
                datalabs = []
                loadClaimGridPp(norec_pd, ruid);
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm?noregistrasi=" + $scope.item.noregistrasi + "&ruid=" + ruid
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            dat.data.data[i].statCheckbox = false;
                            if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                dat.data.data[i].statusbridging = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statusbridging = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].iscito == "1") {
                                dat.data.data[i].statuscito = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statuscito = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].statusperiksa == 1) {
                                dat.data.data[i].statusperiksa = "✔";
                            } else {
                                dat.data.data[i].statusperiksa = "✘";
                            }

                        }
                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                        }
                        $scope.isLoading = false;

                        $scope.dataGrid = {
                            data: dat.data.data,
                            _data: dat.data.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        };

                        // $scope.popUpPelayanan.center().open();
                        datalab = dat.data.data;
                        popUps(datalab)

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
            }

            function loadClaimGridPp(noregistrasifk, objectruanganfk) {
                medifirstService.get("radiologi/get-lab-inacbg-grid-bedah?noregistrasifk=" + noregistrasifk + "&objectruanganfk=" + objectruanganfk, true).then(function (dat) {
                    datalabstat = dat.data.data;
                    popUps();
                });
            }

            function popUps(datalab) {
                if (datalab != undefined || datalab != null) {
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].rm = datalabstat[i].rm;
                    }
                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            $scope.popUpPelayananRadio.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGridLab = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: false,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }

            $scope.TutupPopUpPelayanan = function () {
                $scope.popUpPelayanan.center().close();
            }

            function simpanDeletePpRm(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                var norec_pp = ''
                norec_pp = dataItem.norec_pp
                var json = {
                    'norec': norec_pp,
                    'isbedah': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-bedah', json).then(function (e) {
                    if (e.status === 201) {
                        loadDaftarRmPp($scope.item.noregistrasi);
                    }
                })

            }

            function loadDaftarRmPp(noregistrasi) {
                medifirstService.get("registrasi/daftar-registrasi/get-daftar-bedah-pp?noregistrasi=" + noregistrasi).then(function (dat) {
                    if (dat.data.data.length > 0) {
                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                    }
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                        dat.data.data[i].statCheckbox = false;
                        if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                            dat.data.data[i].statusbridging = "✔";
                            // ✅
                            // ✔
                        } else {
                            dat.data.data[i].statusbridging = "✘";
                            // ✘
                            // ❎
                        }
                        if (dat.data.data[i].iscito == "1") {
                            dat.data.data[i].statuscito = "✔";
                            // ✅
                            // ✔
                        } else {
                            dat.data.data[i].statuscito = "✘";
                            // ✘
                            // ❎
                        }
                        if (dat.data.data[i].statusperiksa == 1) {
                            dat.data.data[i].statusperiksa = "✔";
                        } else {
                            dat.data.data[i].statusperiksa = "✘";
                        }

                    }
                    if (dat.data.data.length > 0) {
                        if (dat.data.data[0].objectdepartemenfk == 3)
                            $scope.disableRad = true
                        if (dat.data.data[0].objectdepartemenfk == 27)
                            $scope.disableLab = true
                    }
                    $scope.isLoading = false;

                    $scope.dataGridRm = {
                        data: dat.data.data,
                        _data: dat.data.data,
                        // pageSize: 10,
                        selectable: true,
                        refresh: true,
                        total: dat.data.data.length,
                        serverPaging: false,
                        aggregate: [
                            { field: 'total', aggregate: 'sum' },
                        ]
                    };

                },
                    function (error) {
                        $scope.isLoading = false;
                    });
            }

            function loadRiwayat(params) {
                medifirstService.get('emr/get-order-ok?' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }
            // $scope.klikBedah = function(tree){
            //     $state.go("RekamMedis.OrderJadwalBedah.PersetujuanTindakanAnestesiA");
            // }
            $scope.Lihat = function () {
                $scope.myVar = 2

                var noemr2 = '-'
                if ($scope.dataSelected != undefined) {
                    noemr2 = $scope.dataSelected.noemr
                }
                $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    namaEMR: 1,
                    nomorEMR: noemr2
                });

                var arrStr = {
                    0: noemr2
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }
            $scope.getHargaTindakan = function () {
                delete $scope.item.hargaTindakan
                // $scope.item.qty = 1
                getKomponenHarga()
            }

            function getKomponenHarga() {

                if ($scope.item.layanan != undefined) {
                    $scope.listKomponen = []
                    medifirstService.get("sysadmin/general/get-komponenharga?idRuangan=" +
                        $scope.item.ruangantujuan.id +
                        "&idKelas=" + 6 +
                        "&idProduk=" + $scope.item.layanan.id +
                        "&idJenisPelayanan=" + jenisPelayananId
                        // +"&idKelas="
                        // +$scope.item.pasien.objectkelasfk
                        // +"&idJenisPelayanan="
                        // + $scope.item.pasien.objectjenispelayananfk
                    ).then(function (dat) {
                        $scope.listKomponen = dat.data.data;
                        $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                        $scope.item.jumlah = 1;
                    })

                }
            }
            $scope.create = function () {
                $scope.myVar = 2

                var noemr2 = '-'
                $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    namaEMR: 1,
                    nomorEMR: noemr2
                });
                var arrStr = {
                    0: noemr2
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }

            $scope.LihatHasil = function (data) {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheHasilLaboratorium', arrStr);
                $state.go('HasilLaboratorium', {
                    norecPd: $scope.dataSelectedRiwayat.norecpd,
                    noOrder: $scope.dataSelectedRiwayat.noorder,
                    norecApd: $scope.dataSelectedRiwayat.norecapd,
                })
                // $state.go(data ? data : 'DashboardLaboratoriumCtrlInputHasil', {
                //     noRegistrasi: $scope.dataSelectedRiwayat.norecpd,
                //     noOrder: $scope.dataSelectedRiwayat.noorder,
                //     noAntrianPasien: $scope.dataSelectedRiwayat.norecapd,
                //     status : "hasil"
                // })
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "10px",
            },
            {
                "field": "tglorder",
                "title": "Tgl Order",
                "width": "90px",
            },
            {
                "field": "ruangan",
                "title": "Nama Ruangan",
                "width": "140px"
            },
            {
                "field": "produkfk",
                "title": "Kode",
                "width": "40px",
            },
            {
                "field": "namaproduk",
                "title": "Layanan",
                "width": "160px",
            },
            {
                "field": "jumlah",
                "title": "Qty",
                "width": "40px",
            },
            {
                "field": "hargasatuan",
                "title": "Harga Satuan",
                "width": "80px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            },
            {
                "field": "hargadiscount",
                "title": "Diskon",
                "width": "80px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "80px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            },
            {
                "field": "nostruk",
                "title": "No Struk",
                "width": "80px"
            }
            ];
            $scope.columnGridLab = {
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "ruangan",
                    "title": "Ruangan",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "dokterpemeriksa",
                    "title": "Dokter Pemeriksa",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "dokterpengirim",
                    "title": "Dokter Pengririm",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    // "field": "claim",
                    "title": "Data Penunjang",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                },
                {
                    "field": "tglhasil",
                    "title": "Tgl Hasil",
                    "width": "90px",
                },
                {
                    "field": "tglcetak",
                    "title": "Tgl Cetak",
                    "width": "90px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "100px",
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "80px"
                },
                {
                    "field": "statusbridging",
                    "title": "Status Kirim",
                    "width": "50px",
                },
                {
                    "field": "statusperiksa",
                    "title": "Status Periksa",
                    "width": "100px",

                },
                {
                    "field": "statuscito",
                    "title": "Status Cito",
                    "width": "100px",
                },
                {
                    "field": "nofoto",
                    "title": "No Foto",
                    "width": "100px",
                }
                ],
            }

            $scope.columnGridOrder = [{
                "field": "no",
                "title": "No",
                "width": "10px",
            },
            {
                "field": "namaproduk",
                "title": "Layanan",
                "width": "160px",
            },
            {
                "field": "qtyproduk",
                "title": "Qty",
                "width": "40px",
            },
            {
                "field": "keterangan2",
                "title": "Keterangan",
                "width": "40px",
            },
            {
                "field": "diagnosa",
                "title": "diagnosa",
                "width": "40px",
            }
            ];
            $scope.columnGridRiwayat = [{
                "field": "no",
                "title": "No",
                "width": "20px",
            },
            {
                "field": "tglorder",
                "title": "Tgl Order",
                "width": "50px",
            },
            {
                "field": "noorder",
                "title": "No Order",
                "width": "60px",
            },
            {
                "field": "dokter",
                "title": "Dokter",
                "width": "100px"
            },
            {
                "field": "namaruangantujuan",
                "title": "Ruangan",
                "width": "100px",
            },
            {
                "field": "statusorder",
                "title": "Status",
                "width": "70px",
            }
            ];
            $scope.mainGridOptions = {
                pageable: true,
                columns: [{
                    "field": "kdpap",
                    "title": "Kode PAP",
                    "width": "15%"
                }, {
                    "field": "tglinput",
                    "title": "Tgl Pengkajian Awal",
                    "width": "20%",
                    template: "#= new moment(tglinput).format(\'DD-MM-YYYY HH:mm\') #",
                }, {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "15%"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "25%"
                },
                {
                    "field": "namalengkap",
                    "title": "Petugas",
                    "width": "25%"
                },
                {
                    "command": [{
                        text: "Hapus",
                        click: hapusData,
                        imageClass: "k-icon k-delete"
                    }],
                    title: "",
                    width: "100px",
                }
                ]
            };

            // $scope.columnDaftar = {
            //     selectable: 'row',
            //     pageable: true,
            //     columns:
            //         [
            //             {
            //                 "field": "tglemr",
            //                 "title": "Tgl EMR",
            //                 "width": "80px",
            //                 "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
            //             },
            //             {
            //                 "field": "noemr",
            //                 "title": "No EMR",
            //                 "width": "80px"
            //             },
            //             {
            //                 "field": "noregistrasi",
            //                 "title": "NoRegistrasi",
            //                 "width": "150px",
            //                 "template": "<span class='style-left'>#: noregistrasi #</span>"
            //             },
            //             {
            //                 "field": "namaruangan",
            //                 "title": "Nama Ruangan",
            //                 "width": "150px",
            //                 "template": "<span class='style-left'>#: namaruangan #</span>"
            //             }
            //         ]
            // };
            $scope.columnDaftar = [{
                "field": "tglemr",
                "title": "Tgl EMR",
                "width": "80px",
                "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
            },
            {
                "field": "noemr",
                "title": "No EMR",
                "width": "80px"
            },
            {
                "field": "noregistrasi",
                "title": "NoRegistrasi",
                "width": "150px",
                "template": "<span class='style-left'>#: noregistrasi #</span>"
            },
            {
                "field": "namaruangan",
                "title": "Nama Ruangan",
                "width": "150px",
                "template": "<span class='style-left'>#: namaruangan #</span>"
            }
            ]

            function hapusData(e) {
                // // if (loginITI ==false){
                // //  toastr.error('Tidak Bisa Menghapus Data','Info')
                // //  return
                // // }
                // e.preventDefault();
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                // if (!dataItem) {
                //     toastr.error("Data Tidak Ditemukan");
                //     return;
                // }
                // var itemDelete = {
                //     "norec": dataItem.norec
                // }

                // managePhp.postData(itemDelete, 'rekam-medis/hapus-pengkajianpasien').then(function (e) {
                //     if (e.status === 201) {
                //         loadGrid()

                //         grid.removeRow(row);
                //     }
                // })

            }

            $scope.loadClaimPpLuar = function (dataItem) {
                var norec_pp = dataItem.norec_pp;
                var noregistrasifk = dataItem.norec_pd;
                var noregistrasi = dataItem.noregistrasi;
                var objectruanganfk = dataItem.objectruanganfk;
                var bedahstat
                if (dataItem.rm == "Hapus") {
                    bedahstat = false
                } else {
                    bedahstat = true
                }
                var json = {
                    'norec': norec_pp,
                    'isbedah': bedahstat
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-bedah', json).then(function (e) {
                    if (e.status === 201) {
                        medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                            $scope.statusSelesaiPeriksaPp = rmpp.data.isrm;
                            loadClaimGridPp(noregistrasifk, objectruanganfk);
                            loadDaftarRmPp(noregistrasi);
                        });
                    }
                })
            }

            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        field: "namaproduk",
                        title: "Deskripsi",
                        width: "300px"
                    },
                    {
                        field: "qtyproduk",
                        title: "Qty",
                        width: "100px"
                    }
                    ]
                };
            };
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {

            }

            $scope.add = function () {
                if ($scope.item.statusVerif == true) {
                    toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                    return;
                }
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.layanan == undefined) {
                //     alert("Pilih Layanan terlebih dahulu!!")
                //     return;
                // }
                var nomor = 0
                if ($scope.dataGridOrder == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.keterangan = $scope.item.keterangan

                            // data.produkfk = $scope.item.layanan.id
                            // data.namaproduk = $scope.item.layanan.namaproduk
                            data.produkfk = '4041353'
                            data.namaproduk = $scope.item.keterangan
                            data.keterangan2 = $scope.item.keterangan2
                            data.qtyproduk = parseFloat($scope.item.qty)
                            data.objectruanganfk = namaRuanganFk
                            data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                            data.pemeriksaanluar = $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                                data.objectkelasfk = $scope.item.idKelas
                            data.diagnosa = $scope.item.diagnosa

                            data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        // produkfk: $scope.item.layanan.id,
                        // namaproduk: $scope.item.layanan.namaproduk,
                        produkfk: '4041353',
                        namaproduk: $scope.item.keterangan,

                        keterangan: $scope.item.keterangan,
                        keterangan2: $scope.item.keterangan2,
                        qtyproduk: parseFloat($scope.item.qty),
                        objectruanganfk: namaRuanganFk,
                        objectruangantujuanfk: $scope.item.ruangantujuan.id,
                        pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                        objectkelasfk: $scope.item.idKelas,
                        diagnosa: $scope.item.diagnosa
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.batal();
            }
            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no
                $scope.item.no = dataSelected.no
                $scope.item.keterangan = dataSelected.keterangan;
                $scope.item.keterangan2 = dataSelected.keterangan2;
                $scope.item.diagnosa = dataSelected.diagnosa;
                for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                    if ($scope.listLayanan[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listLayanan[i]
                        break;
                    }
                }
                $scope.item.layanan = dataProduk; //{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 

                $scope.item.qty = dataSelected.qtyproduk
                $scope.item.pemeriksaanKeluar = dataSelected.pemeriksaanluar == 1 ? true : false
            }
            $scope.hapus = function () {
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            // data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                }
                $scope.batal();
            }
            $scope.batal = function () {
                $scope.item.layanan = ''
                $scope.item.qty = 1
                $scope.item.keterangan = ''
                $scope.item.keterangan2 = ''
                $scope.item.no = undefined
                // norec_temp = '';
            }
            $scope.BatalOrder = function () {
                data2 = []
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
                $scope.CmdOrderPelayanan = true;
                $scope.OrderPelayanan = false;
                norec_temp = '';
            }
            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.inputOrder = false;
                loadRiwayat('NoCM=' + $scope.item.noMr);
            }
            $scope.newOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
                norec_temp = '';
            }
            $scope.editOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
                debugger;
                norec_temp = $scope.dataSelectedRiwayat.norec;
                var datax = $scope.dataSelectedRiwayat.details;
                var data = {};
                data2 = [];
                for (var i = datax.length - 1; i >= 0; i--) {
                    data = {
                        no: i + 1,

                        produkfk: '4041353',
                        namaproduk: datax[i].keteranganlainnya,

                        keterangan: datax[i].keteranganlainnya,
                        keterangan2: datax[i].keteranganlainnya_quo,
                        qtyproduk: parseFloat($scope.item.qty),
                        objectruanganfk: datax[i].objectruanganfk,
                        objectruangantujuanfk: datax[i].objectruangantujuanfk,
                        pemeriksaanluar: 0,
                        objectkelasfk: datax[i].objectkelasfk,
                        diagnosa: datax[i].diagnosa
                    }
                    data2.push(data)
                }

                // $scope.dataGrid.add($scope.dataSelected)
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
            }
            $scope.Simpan = function () {
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }
                if (data2.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }
                debugger
                if ($scope.item.dokterbed == undefined) {
                    alert("Pilih dokter terlebih dahulu!!")
                    return
                }

                var ruanganinap = "0";
                if ($scope.item.ruanganinap != undefined) {
                    ruanganinap = $scope.item.ruanganinap.id
                }
                var objSave = {
                    norec_so: norec_temp,
                    norec_apd: norec_apd,
                    norec_pd: norec_pd,
                    qtyproduk: data2.length, //
                    objectruanganfk: namaRuanganFk,
                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    objectruanganinap: ruanganinap,
                    departemenfk: 25,
                    pegawaiorderfk: $scope.item.dokterbed.id,
                    tgloperasi: moment($scope.item.tglOperasi).format('YYYY-MM-DD hh:mm'),
                    details: data2
                }


                medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                    medifirstService.postLogging('Order Jadwal Bedah', 'Norec strukorder_t', e.data.strukorder.norec,
                        'Order Jadwal Bedah No Order-' + e.data.strukorder.noorder + ' No Registrasi ' + $scope.item.noregistrasi
                    ).then(function (res) { })
                    init();
                    $scope.BatalOrder();

                    // $scope.item.resep = e.data.noresep.norec
                    // var stt = 'false'
                    // if (confirm('View resep? ')) {
                    //     // Save it!
                    //     stt='true';
                    // } else {
                    //     // Do nothing!
                    //     stt='false'
                    // }
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores='+e.data.noresep.norec+'&view='+stt+'&user='+pegawaiUser.namalengkap, function(response) {
                    //     //aadc=response;
                    // });
                    // if (noOrder == 'EditResep') {
                    //     var objDelete = {norec:norecResep}
                    //     manageSarprasPhp.posthapuspelayananapotik(objDelete).then(function(e) {

                    //     })
                    // }
                    // window.history.back();
                })
            }


            $scope.CetakLabKlinikLangsung = function (dataItem) {
                debugger
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function (data) {
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }
                    }
                });

                if (dataItem.tglhasil == null) {
                    alert("Hasil Tidak Ditersedia.");
                    return;
                } else {
                    var umurDay = dataItem.umur
                    var tglpelayanan = dataItem.tglpelayanan
                    var tglhasil = dataItem.tglhasil
                    var tglcetak = dataItem.tglcetak
                    var norecPP = "'" + dataItem.norec_pp + "'"
                    var norecAPD = dataItem.norec_apd
                    var ruangan = dataItem.ruangan
                    var ruanganasal = dataItem.namaruanganasal
                    var dokterpemeriksa = dataItem.dokterpemeriksa
                    var dokterpengirim = dataItem.dokterpengirim
                    $scope.item.norec_pp = dataItem.norec_pp;
                    var norec_pp = "'" + dataItem.norec_pp + "'"

                    debugger
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }

                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["", "RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177", user.namaLengkap,
                            x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log(this.response, typeof this.response);
                            debugger;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
            }

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
            // $scope.back=function(){
            //     //$state.go("DaftarPasienApotik")
            //     window.history.back();
            // }
            // $scope.TambahObat =function(){
            //      ////debugger;
            //     var arrStr ={ 0 : $scope.item.noMr ,
            //         1 : $scope.item.namaPasien,
            //         2 : $scope.item.jenisKelamin,
            //         3 : $scope.item.noregistrasi, 
            //         4 : $scope.item.umur,
            //         5 : $scope.item.kelas.id,
            //         6 : $scope.item.kelas.namakelas,
            //         7 : $scope.item.tglRegistrasi,
            //         8 : norec_apd,
            //         9 : '',
            //         10 : $scope.item.jenisPenjamin,
            //         11 : $scope.item.kelompokPasien,
            //         12 : $scope.item.beratBadan,
            //         13 : $scope.item.AlergiYa
            //     }
            //     cacheHelper.set('InputResepApotikCtrl', arrStr);
            //     $state.go('InputResepApotik')
            // }
            // $scope.EditResep =function(){
            //      ////debugger;
            //     var arrStr ={ 0 : $scope.item.noMr ,
            //         1 : $scope.item.namaPasien,
            //         2 : $scope.item.jenisKelamin,
            //         3 : $scope.item.noregistrasi, 
            //         4 : $scope.item.umur,
            //         5 : $scope.item.kelas.id,
            //         6 : $scope.item.kelas.namakelas,
            //         7 : $scope.item.tglRegistrasi,
            //         8 : norec_apd,
            //         9 : 'EditResep',
            //         10 : $scope.item.jenisPenjamin,
            //         11 : $scope.item.kelompokPasien,
            //         12 : $scope.item.beratBadan,
            //         13 : $scope.item.AlergiYa,
            //         14 : $scope.dataSelected.norec_resep
            //     }
            //     cacheHelper.set('InputResepApotikCtrl', arrStr);
            //     $state.go('InputResepApotik')
            // }

            // $scope.orderApotik =function(){
            //     $state.go("InputResepApotikOrder")
            // }
            // $scope.HapusResep = function(){
            //     var objDelete = {norec:$scope.dataSelected.norec_resep}
            //     manageSarprasPhp.posthapuspelayananapotik(objDelete).then(function(e) {
            //         init();
            //     })
            // }
            // $scope.cetakEtiket = function(){
            //     var client = new HttpClient();
            //     client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec='+$scope.dataSelected.norec_resep+'&cetak=1', function(response) {
            //         // aadc=response;
            //     });
            // }
            $scope.cetakResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
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
            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }
            $scope.resep = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }
            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }
            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }
            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }
            $scope.hapusOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data yang mau dihapus')
                    return
                }
                if ($scope.dataSelectedRiwayat.statusorder != 'PENDING') {
                    toastr.error('Tidak bisa dihapus')
                    return
                }
                var data = {
                    norec_order: $scope.dataSelectedRiwayat.norec
                }
                norec_temp = '';
                // managePhp.saveDataProduk2(data,"lab-radiologi/delete-orderlabrad")
                //     .then(function(e){
                //         init()

                //     })
            }
            // ,
            //                     "child": [
            //                         {
            //                             "id": "RekamMedis.OrderJadwalBedah.PersetujuanTindakanAnestesiB",
            //                             "title": "Informasi Anestesi"
            //                         },
            //                         {
            //                             "id": "RekamMedis.OrderJadwalBedah.PersetujuanTindakanAnestesiC",
            //                             "title": "Persetujuan Tindakan Anestesi"
            //                         },
            //                         {
            //                             "id": "RekamMedis.OrderJadwalBedah.PersetujuanTindakanAnestesiD",
            //                             "title": "Persetujuan Transfusi Darah"
            //                         }
            //                     ]


            // manageSarprasPhp.getDataTableTransaksi("pegawai/data-map-login-usertoruangan?jenis=departemenruangan", true).then(function(dat){
            // $scope.listInstalasi = dat.data
            // var inlineDefault = new kendo.data.HierarchicalDataSource({
            //     data: [
            //             {
            //                 "id": "d1",
            //                 "title": "Catatan Anestesi"
            //             },
            //             {
            //                 "id": "RekamMedis.OrderJadwalBedah.PersetujuanTindakanAnestesiA",
            //                 "title": "Persetujuan Tindakan Anestesi"
            //             },
            //             {
            //                 "id": "RekamMedis.OrderJadwalBedah.ProsedurKeselamatan",
            //                 "title": "Checklist Prosedur Keselamatan Pasien di Kamar Operasi",
            //                 "child":[
            //                     {
            //                         "id": 1,
            //                         "title": "Check In",
            //                     },
            //                     {
            //                         "id": "PKPSignIn",
            //                         "title": "Sign In",
            //                     },
            //                     {
            //                         "id": "PKPTimeOut",
            //                         "title": "Time Out",
            //                     },
            //                     {
            //                         "id": "PKPSignOut",
            //                         "title": "Sign Out",
            //                     },
            //                     {
            //                         "id": "PKPCheckOut",
            //                         "title": "Check Out",
            //                     }
            //                 ]
            //             },
            //             {
            //                 "id": "d4",
            //                 "title": "Laporan Perhitungan Kassa dan Alat Operasi",
            //             },
            //             {
            //                 "id": "d5",
            //                 "title": "Formulir Pra-Anestesi/Sedasi",
            //             },
            //             {
            //                 "id": "d6",
            //                 "title": "Asuhan Keperawatan Peri Operatif di Kamar Operasi"
            //             }
            //         ],
            //     // check: onCheck,
            //     schema: {
            //         model: {
            //             children: "child"
            //         }
            //     }
            // });
            // $scope.treeSourceBedah = inlineDefault
            // $scope.mainTreeViewBedahOption = {
            //     dataTextField: ["title"],
            //     datakKeyField: ["id"],
            //     select: onSelect,
            //     dragAndDrop: true,
            //     checkboxes: false
            // }

            // });
            function onSelect(e) {
                var data3 = e.sender.dataSource._data
                // var itm = findObjectByKey(data3, 'uid', "245421fd-68db-4d25-8afc-dbe1d20a2056");
                var uid_select = e.node.dataset.uid
                var idTree = '';
                var urlTrue = null;
                for (var i = data3.length - 1; i >= 0; i--) {
                    if (uid_select == data3[i].uid) {
                        idTree = data3[i].id
                        urlTrue = data3[i].reportdisplay
                        break;
                    }
                    if (data3[i].child != undefined) {
                        for (var ii = data3[i].child.length - 1; ii >= 0; ii--) {
                            if (uid_select == data3[i].child[ii].uid) {
                                idTree = data3[i].child[ii].id
                                urlTrue = data3[i].child[ii].reportdisplay
                                break;
                            }
                            if (data3[i].child[ii].child != undefined) {
                                for (var iii = data3[i].child[ii].child.length - 1; iii >= 0; iii--) {
                                    if (uid_select == data3[i].child[ii].child[iii].uid) {
                                        idTree = data3[i].child[ii].child[iii].id
                                        urlTrue = data3[i].child[ii].child[iii].reportdisplay
                                        break;
                                    }
                                }
                            }

                        }
                    }

                }
                var noemr = '-'
                if ($scope.dataSelected != undefined) {
                    noemr = $scope.dataSelected.noemr
                }
                if (urlTrue == null) {
                    $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                        namaEMR: idTree,
                        nomorEMR: noemr
                    });
                } else {
                    $state.go(urlTrue);
                }




            }
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1