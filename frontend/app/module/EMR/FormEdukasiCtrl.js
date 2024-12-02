define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormEdukasiCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
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

        var dataadmisi = []
        var datadokter = []
        var dataperawat = []
        var datafisio = []
        var dataapoteker = []
        var datagizi = []

        loadCombo()
        LoadCacheHelper()
        loadEdukasi()

        $scope.$watch('item.obj[2322]', function(e) {
            if (e == true) {
                $scope.item.obj[2323] = false
                $scope.hambatan = true
            } else {
                $scope.hambatan = false
            } 
        })
        $scope.$watch('item.obj[2323]', function(e) {
            if (e == true) {
                $scope.item.obj[2322] = false
                $scope.hambatan = false
            } 
        })
        $scope.$watch('item.obj[2336]', function(e) {
            if (e.caption != 'Indonesia') {
                $scope.namaBahasa = true
            } else {
                $scope.namaBahasa = false
            } 
        })
        $scope.$watch('item.obj[2340]', function(e) {
            if (e.caption == 'Ada') {
                $scope.namaKepercayaan = true
            } else {
                $scope.namaKepercayaan = false
            } 
        })
        $scope.$watch('item.materiedukasi', function(e) {
            if (e.caption == 'Lain - Lain') {
                $scope.lainlain = true
            } else {
                $scope.lainlain = false
            } 
        })
        $scope.$watch('item.obj[2321]', function(e) {
            if (e.caption == 'Lain - Lain') {
                $scope.lainlaintinggal = true
            } else {
                $scope.lainlaintinggal = false
            } 
        })

        function loadCombo() {
            medifirstService.get('emr/get-combo-edukasi-pasien?').then(function(dat) {
                debugger
                const tinggalBersama = []
                const edukasi = []
                const kemampuanBahasa = []
                const perluPenterjemah = []
                const bacaDanTulis = []
                const kepercayaanLainnya = []
                const ketersediaanEdukasi = []
                const caraEdukasi = []
                const Edukasi = []
                const LamaEdukasi = []
                const HasilVerifikasi = []
                const leaflet = []
                const agama = []

                const petugas = []
                const metodaedukasi = []
                const mediaedukasi = []
                for (let i = 0; i < dat.data.data.length; i++) {
                    if (dat.data.data[i].reportdisplay == 'Tinggal Bersama') {
                        tinggalBersama.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Edukasi diberikan') {
                        edukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Kemampuan Bahasa') {
                        kemampuanBahasa.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Perlu Penterjemah') {
                        perluPenterjemah.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Baca dan Tulis') {
                        bacaDanTulis.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Kepercayaan Lainnya') {
                        kepercayaanLainnya.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Ketersediaan Edukasi') {
                        ketersediaanEdukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Cara Edukasi') {
                        caraEdukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Edukasi') {
                        Edukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Lama Edukasi') {
                        LamaEdukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Hasil Verifikasi') {
                        HasilVerifikasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Leaflet') {
                        leaflet.push({id: dat.data.data[i].kodeexternal, caption: dat.data.data[i].kodeexternal + " " + dat.data.data[i].caption})
                    }
                   
                    if (dat.data.data[i].reportdisplay == 'Agama') {
                        agama.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'Petugas') {
                        petugas.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'MediaEdukasi') {
                        mediaedukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }
                    if (dat.data.data[i].reportdisplay == 'MetodaEdukasi') {
                        metodaedukasi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    }

                    
                    
                        if (dat.data.data[i].reportdisplay == 'ADMISI') dataadmisi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                        else if (dat.data.data[i].reportdisplay == 'DOKTER') datadokter.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                        else if (dat.data.data[i].reportdisplay == 'APOTEKER') dataapoteker.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                        else if (dat.data.data[i].reportdisplay == 'GIZI') datagizi.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                        else if (dat.data.data[i].reportdisplay == 'PERAWAT') dataperawat.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                        else if (dat.data.data[i].reportdisplay == 'FISIOTHERAPIS') datafisio.push({id: dat.data.data[i].id, caption: dat.data.data[i].caption})
                    
                }
                $scope.listTinggalBersama = tinggalBersama
                $scope.listEdukasi = edukasi
                $scope.listKemampuanBahasa = kemampuanBahasa
                $scope.listPerluPenterjemah = perluPenterjemah
                $scope.listBacaTulis = bacaDanTulis
                $scope.listKepercayaanLainnya = kepercayaanLainnya
                $scope.listKetersediaan = ketersediaanEdukasi
                $scope.listCaraEdukasi = caraEdukasi
                $scope.listPegawai = dat.data.pegawai
                $scope.listMateriEdukasi = Edukasi
                $scope.listLamaEdukasi = LamaEdukasi
                $scope.listHasilVerifikasi = HasilVerifikasi
                $scope.listLeaflet = leaflet
                
                $scope.listAgama = agama //ash 08-08-2023
                $scope.listPetugas = petugas //ash 08-08-2023
                $scope.listMetodaEdukasi = metodaedukasi //ash 08-08-2023
                $scope.listMediaEdukasi = mediaedukasi //ash 08-08-2023
            })
        }

        $scope.$watch('item.obj[2335]', function(e) {
        debugger
            if (e == true) {
                $scope.isHambatanlain = true
            } else {
                $scope.isHambatanlain = false
            } 
        })

        
        $scope.$watch('item.mediaedukasi', function(e) {
            if (e.caption == 'Leaflet') {
                $scope.isLeaflet = true
            } else {
                $scope.isLeaflet = false
            } 
        })

        $scope.$watch('item.petugas', function(e) {
            if (e.caption == 'ADMISI') {
                $scope.listMateriEdukasi = dataadmisi
            } else if (e.caption == 'APOTEKER') {
                $scope.listMateriEdukasi = dataapoteker
            } else if (e.caption == 'DOKTER') {
                $scope.listMateriEdukasi = datadokter
            } else if (e.caption == 'FISIOTHERAPIS') {
                $scope.listMateriEdukasi = datafisio
            } else if (e.caption == 'PERAWAT') {
                $scope.listMateriEdukasi = dataperawat
            } else if (e.caption == 'GIZI') {
                $scope.listMateriEdukasi = datagizi
            } 
        })

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
                $scope.cc.norec_emr = '-'
                $scope.cc.jenisemr = "formedukasi"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                init()
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=formedukasi", true).then(function(dat) {
                $scope.isRouteLoading = false
                
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'formedukasi') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 895;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {

                    }
                    // if (dat.data.data[0].jenisemr == 'pengkajianawal') {
                    //     $scope.noemr = dat.data.data[0].noemr
                    //     $scope.cc.norec_emr = dat.data.data[0].noemr
                    //         nomorEMRSS = ''
                    //         nomorEMRSS = dat.data.data[0].noemr
                    //         nomorEMR = nomorEMRSS
                    //         $scope.cc.emrfk = 674;
                    //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    // } else {
                    //     cekDiagnosa()
                    // }
                } else {

                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[68] = $scope.now
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
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2321") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2344") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2336") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2338") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2339") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2340") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2342") {
                            
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], caption: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2343") {
                            
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], caption: str }

                        }
                    }

                }
            })
        }
        function loadEdukasi() {
            medifirstService.get('emr/get-edukasi-pasien?norec=' + $scope.cc.norec_pd).then(function(dat) {
                for(let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1
                }
                $scope.sourceEdukasi = new kendo.data.DataSource({
                    data: dat.data,
                    length: dat.data.length,
                    pageSize: 20
                });
            })
			$scope.gridEdukasi = {
				toolbar: [{
					name: "create", text: "Input Baru",
					template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Input Baru</button>'
				},],
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "no", title: "No", width: 40 },
					{ field: "tgljamedukasi", title: "Tgl dan Jam Edukasi", width: 120 },
					{ field: "petugas", title: "Petugas", width: 120 },
					{ field: "materiedukasi", title: "Materi Edukasi Berdasarkan Kebutuhan", width: 120 },
					{ field: "kodeleaflet", title: "Kode Leaflet", width: 150 },
					{ field: "lamaedukasi", title: "Lama Edukasi (Menit)", width: 120 },
					{ field: "hasilverifikasi", title: "Hasil Verifikasi", width: 120 },
					{ field: "tglredukasi", title: "Tgl Redukasi / Redemonstrasi", width: 150 },
					{ field: "namalengkap", title: "Pemberi Edukasi", width: 120 },
					{ field: "pasienkeluarga", title: "Pasien / Keluarga (Hubungan)", width: 120 },
					// { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }, { name: "edit", text: "Edit", click: editData }], title: "&nbsp;", width: 150 }
				],
			};
        }
        
        $scope.inputBaru = function() {
            $scope.item.petugas=""
            $scope.item.materiedukasi=""
            $scope.item.lainlain=""
            $scope.item.tgljamedukasi=""
            $scope.item.lamaedukasi=""
            $scope.item.metodaedukasi=""
            $scope.item.mediaedukasi=""
            $scope.item.leaflet=""
            $scope.item.pasienkeluarga=""
            $scope.item.pemberiedukasi=""
            $scope.item.hasilverifikasi=""
            $scope.item.tglredukasi=""



            $scope.item.tgljamedukasi = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglredukasi = moment($scope.now).format('YYYY-MM-DD HH:mm');
            let pegawai = JSON.parse(localStorage.getItem('pegawai'));
            $scope.item.pemberiedukasi = {id: pegawai.id, namalengkap: pegawai.namaLengkap}
            debugger
            $scope.popUpTambahEdukasi.center().open()
        }
        $scope.simpan = function() {
            let tampung = '';
            debugger
            $scope.item.obj
            var user = medifirstService.getPegawaiLogin();
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 2321) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2344) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2336) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2338) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2339) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2340) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2341) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2342) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2343) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }
            
            
            $scope.cc.jenisemr = 'formedukasi'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                        init()
                        // init2()
                        // init3()
                    //     init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
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
