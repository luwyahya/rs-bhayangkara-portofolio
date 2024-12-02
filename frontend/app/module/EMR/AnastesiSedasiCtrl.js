define(['initialize', 'Configuration'], function (initialize,config) {
    'use strict';
    initialize.controller('AnastesiSedasiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state','CacheHelper', 'DateHelper', 'MedifirstService',
    function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, medifirstService) {
        $scope.item = {};
        $scope.cc = {};
        $scope.item.obj = {};
        $scope.user = {};
        $scope.istempatLaporan = true;
        let nomorEMR = ''
        let pgid = ''
        $scope.rajal = false;
        let tglemredit = ''
        let paramSearch = '';
        $scope.tombolSimpanVis = true;
        $scope.isCetak = true;
        $scope.isKembali = true;
        let noverifikasipa = ''
        let dataLoad = []
        $scope.cc.emrfk = 2024
        $scope.now = new Date()
        $scope.yaalergi = false;
        $scope.edukasilainnya = false;
        SetCacheHelper();
        
      
        function SetCacheHelper() {
          
            medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function(e) {
                var result = e.data.result 
                $scope.header = result
                var tanggal = $scope.now;
                var tanggalLahir = new Date(result.tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
				result.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                $scope.item.umur = result.umur
                var arrStr = {
                        0: $scope.header.nocm,
                        1: $scope.header.namapasien,
                        2: $scope.header.jeniskelamin,
                        3: $scope.header.noregistrasi,
                        4: $scope.header.umur,
                        5: $scope.header.kelompokpasien,
                        6: $scope.header.tglregistrasi,
                        7: $scope.header.norec,
                        8: $scope.header.norec_pd,
                        9: $scope.header.objectkelasfk,
                        10: $scope.header.namakelas,
                        11: $scope.header.objectruanganfk,
                        12: $scope.header.namaruangan,
                        13: $scope.checkNoregis,
                        14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                        15: $scope.header.alamatlengkap,
                        16: $scope.header.dokterdpjp,
                        17: $scope.header.iddpjp,
                        18: $scope.header.tgllahir,
                        19: $scope.header.objectkelompokpasienlastfk,
                        20: $scope.header.golongandarah,
                        21: $scope.header.namarekanan,
                        22: $scope.header.objectrekananfk,
                        23: $scope.header.objectdepartemenfk,
                        24: $scope.header.ruanganterakhir,
                        25: $scope.header.nocmfk,
                        26: $scope.header.objectagamafk,
                        27: $scope.header.agama,
                        28: $scope.header.objectpendidikanfk,
                        29: $scope.header.pendidikan,
                    30: $scope.header.objectpekerjaanfk,
                    31: $scope.header.pekerjaan,
                    32: $scope.header.suku
                    } 
                    cacheHelper.set('cacheRMelektronik', arrStr); 
                    LoadCacheHelper();
            })     
        }
        medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
            $scope.listDiagnosa10 = data;
        });
        function LoadCacheHelper() {
            var dariHalamanDaftarPasienPenunjang = cacheHelper.get('dariHalamanDaftarPasienPenunjang');

            if (dariHalamanDaftarPasienPenunjang == true) {
                // Lakukan sesuatu jika berasal dari halaman daftarpasienpenunjang
                $scope.rajal = false;
            }
            medifirstService.get("emr/get-combo-cppt").then(function(dat) {
                $scope.listJenisPetugas = dat.data.jenispetugas
                $scope.listDokter = dat.data.pegawaiAll
                $scope.listPerawat = dat.data.pegawai
                $scope.listPerawatSaja = dat.data.perawatsaja
                $scope.listTandaTangan = dat.data.pegawaiAll
            })
            var cachepengkajianranap = cacheHelper.get('cachePengkajianRI');
            $scope.cc.status = 'baru'
            if(cachepengkajianranap != undefined){
                $scope.cc.status = cachepengkajianranap[1]
            }
            var cacheLabPA = cacheHelper.get('cacheOrderLabPA');
            if (cacheLabPA != undefined) {
                $scope.item.obj[5819] = cacheLabPA[0]
                $scope.item.obj[5820] = cacheLabPA[1]
            }
            $scope.cc.edit = false
            var cacheLabPAEdit = cacheHelper.get('cacheOrderLabPAEdit');
            if (cacheLabPAEdit != undefined) {
                $scope.cc.edit = true
                nomorEMR = cacheLabPAEdit[0]
                pgid = cacheLabPAEdit[1]
                tglemredit = cacheLabPAEdit[2]
            }
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
                $scope.cc.dpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                $scope.cc.norec_emr = '-'
                $scope.item.kdKelompokPasien = chacePeriode[19]
                $scope.cc.objectrekananfk = chacePeriode[22]
                $scope.cc.objectdepartemenfk = chacePeriode[23]
                $scope.cc.noregistrasi2 = chacePeriode[25]               
                $scope.cc.emrfk = 2024
                init()
                loadCombo()
            }
        }

        $scope.listRhesus = [
            { id: 1, namalengkap: '+' },
            { id: 2, namalengkap: '-'},
        ];
        $scope.listGolonganDarah = [
            { id: 1, namalengkap: 'A' },
            { id: 2, namalengkap: 'B'},
            { id: 2, namalengkap: 'O'},
            { id: 2, namalengkap: 'AB'}
        ];
        
        function init() {
            $scope.isRouteLoading = true
            //  if( $scope.cc.status =='lihat'){
            if ($scope.cc.edit == false ) {
                paramSearch = 'noregistrasi=' +  $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=anastesisedasi", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    
                    var nomorEMRSS = ''
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        noverifikasipa = dat.data.data[0].noverifikasipa
                        $scope.cc.norec_emr = nomorEMR
                        $scope.cc.emrfk = '2024'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                      
                     
                        medifirstService.get("emr/get-emr-transaksi?" + "noregistrasi=" + $scope.cc.noregistrasi + "&jenisEmr=pemeriksaanbankdarah", true).then(function (dat) {
                            // $scope.item.obj[5817] = dat.data.data[0].noverifikasipa
                            
                        })
                        //  loadPengkajianKeperawatan()
                    }
                })
            }else{
               

                medifirstService.get("emr/get-emr-transaksi?" + "nocm=" + $scope.cc.nocm + "&jenisEmr=pemeriksaanbankdarah", true).then(function (dat) {
                    // $scope.item.obj[5791] = dat.data.data[0].noverifikasipa
                    var emrfk = dat.data.data[0].noemr
                    // $scope.item.obj[5817] = dat.data.data[0].noverifikasip
                })

            }
           
            //  }
           
        }
        $scope.$watch('item.obj[6430]', function(e) {
            if (e == true) {
                $scope.edukasilainnya = true;
                // $scope.item.obj[4267] = undefined
                // $scope.item.obj[4268] = undefined
                // $scope.item.obj[4269] = undefined
                // $scope.item.obj[4270] = undefined
                // $scope.item.obj[4271] = undefined
                // $scope.item.obj[4272] = undefined
            } else {
                $scope.edukasilainnya = false;
            }
        })
        function setobjectToModel(nomorEMRSS, emrfk) {
            
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                $scope.isLoading = false
                debugger
                var chekedd = false  
                $scope.item.obj = []                      
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
                        }
                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format("YYYY-MM-DD");
                        }
                        
                        if (dataLoad[i].type == "time") {
                            let timeParts = dataLoad[i].value.split(":"); // Memisahkan string waktu menjadi jam dan menit
                            let date = new Date();
                            date.setHours(timeParts[0], timeParts[1]);
                            $scope.item.obj[dataLoad[i].emrdfk] = date;
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
                        if (dataLoad[i].emrdfk == "2421") {
                            $scope.user.poto = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == "2422") {
                            $scope.user.poto2 = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4652") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4653") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4656") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4657") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4658") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                         if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4658") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                      
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6432") {
                            $scope.item.obj[dataLoad[i].emrdfk] = {text: dataLoad[i].value  }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6433") {
                            $scope.item.obj[dataLoad[i].emrdfk] = {namalengkap: dataLoad[i].value  }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6434") {
                            $scope.item.obj[dataLoad[i].emrdfk] = {namalengkap: dataLoad[i].value  }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6547") {
                            $scope.item.obj[dataLoad[i].emrdfk] = {namalengkap: dataLoad[i].value  }
                        }
                    }
                }
                
                // $scope.item.obj[5791] = noverifikasipa
            })
        }
        $scope.RiwayatVitalSign = function () {
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-vital-sign-igd?" + paramSearch, true).then(function (dat) {
                for (var i = 0; i < dat.data.data.length; i++) {
                    dat.data.data[i].no = i + 1
                }
                $scope.dataDaftar = new kendo.data.DataSource({
                    data: dat.data.data,
                    pageSize: 10,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    }
                });
                $scope.popUpRiwayat.center().open();
            });
        }
        $scope.tambahriwayat = function () {
            if ($scope.dataSelected == undefined) {
                toastr.error('Pilih data dulu')
                return
            }
            nomorEMR = $scope.dataSelected.noemr
            loadVitalSign()
            $scope.popUpRiwayat.center().close();
        }
        function loadVitalSign() {
            debugger
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMR, true).then(function (dat) {
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (dataLoad[i].emrdfk == 4241) {
                        $scope.item.obj[4647] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 4242) {
                        $scope.item.obj[4655] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 4243) {
                        $scope.item.obj[4654] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 4244) {
                        $scope.item.obj[4649] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 4245) {
                        $scope.item.obj[4650] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 4246) {
                        $scope.item.obj[4648] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 116064) {
                        var str = dataLoad[i].value
                        var res = str.split("~");
                        $scope.item.obj[4652] = { value: res[0], text: res[1] }
                    }
                    if (dataLoad[i].emrdfk == 116065) {
                        $scope.item.obj[4651] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 116066) {
                        $scope.item.obj[4653] = dataLoad[i].value
                    }
                    if (dataLoad[i].emrdfk == 116067) {
                        var str = dataLoad[i].value
                        var res = str.split("~");
                        $scope.item.obj[4656] = { value: res[0], text: res[1] }
                    }
                    if (dataLoad[i].emrdfk == 116068) {
                        var str = dataLoad[i].value
                        var res = str.split("~");
                        $scope.item.obj[4657] = { value: res[0], text: res[1] }
                    }
                    if (dataLoad[i].emrdfk == 116069) {
                        var str = dataLoad[i].value
                        var res = str.split("~");
                        $scope.item.obj[4658] = { value: res[0], text: res[1] }
                    }
                    if (dataLoad[i].emrdfk == 116066) {
                        var str = dataLoad[i].value
                        var res = str.split("~");
                        $scope.item.obj[4653] = { value: res[0], text: res[1] }
                    }
                }
            })
        }
        $scope.BatalVital = function () {
            $scope.popUpRiwayat.center().close();
        }
        $scope.ClearVital = function () {
            delete $scope.item.obj[4647]
            delete $scope.item.obj[4655]
            delete $scope.item.obj[4654]
            delete $scope.item.obj[4649]
            delete $scope.item.obj[4650]
            delete $scope.item.obj[4648]
            delete $scope.item.obj[4652]
            delete $scope.item.obj[4651]
            delete $scope.item.obj[4653]
            delete $scope.item.obj[4656]
            delete $scope.item.obj[4657]
            delete $scope.item.obj[4658]
        }
        function loadCombo() {
            medifirstService.get('emr/get-combo-anyar-hehe').then(function(dat) {
                $scope.listDokter = dat.data.dokter
            })
            $scope.listKeadaanUmum = [
                { text: "Baik", value: 1 },
                { text: "Tampak Sakit Ringan", value: 2 },
                { text: "Tampak Sakit Sedang", value: 3 },
                { text: "Tampak Sakit Berat", value: 4 },                        
            ];
            $scope.listKesadaran = [
                { text: "Compos Mentis", value: 1 },
                { text: "Apatis", value: 2 },
                { text: "Delirium", value: 3 },
                { text: "Somnolent", value: 4 },
                { text: "Sopor", value: 5 },
                { text: "Semi Coma", value: 6 },
                { text: "Coma", value: 7 }
            ];
            $scope.listAnastesi = [
                { text: "Moderat", value: 1 },
                { text: "Dalam", value: 2 },
            
            ];
            $scope.listGcs = [
                { text: "E", value: 1 },
                { text: "M", value: 2 },
                { text: "V", value: 3 }
            ];
            $scope.listGcsE = [
                { text: "1", value: 1 },
                { text: "2", value: 2 },
                { text: "3", value: 3 },
                { text: "4", value: 4 }
            ];
            $scope.listGcsM = [
                { text: "1", value: 1 },
                { text: "2", value: 2 },
                { text: "3", value: 3 },
                { text: "4", value: 4 },
                { text: "5", value: 5 },
                { text: "6", value: 6 }
            ];
            $scope.listGcsV = [
                { text: "1", value: 1 },
                { text: "2", value: 2 },
                { text: "3", value: 3 },
                { text: "4", value: 4 },
                { text: "5", value: 5 }
            ];
            $scope.listRisikoJatuh = [{
                "id": 8,
                "nama": "Kepala :",
                "detail": [
                    { "id": 4671, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4672, "nama": "Ada Kelainan", "type": "checkbox" },
                    { "id": 4673, "nama": " Jelaskan :", "type": "textbox" },
                ]
            },
            {
                "id": 9,
                "nama": "Leher :",
                "detail": [
                    { "id": 4674, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4675, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4676, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 10,
                "nama": "Thorax :",
                "detail": [
                    { "id": 4677, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4678, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4679, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 11,
                "nama": "Abdomen :",
                "detail": [
                    { "id": 4680, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4681, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4682, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 20,
                "nama": "Extremitas :",
                "detail": [
                    { "id": 4683, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4684, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4685, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 21,
                "nama": "Genitalia :",
                "detail": [
                    { "id": 4686, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4687, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4688, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 22,
                "nama": "Anus :",
                "detail": [
                    { "id": 4689, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4690, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4691, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 23,
                "nama": "Pemeriksaan Neurologis :",
                "detail": [
                    { "id": 4692, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4693, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4694, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            {
                "id": 24,
                "nama": "Kulit :",
                "detail": [
                    { "id": 4695, "nama": "Tidak Ada Kelainan ", "type": "checkbox" },
                    { "id": 4696, "nama": "Ada Kelainan ", "type": "checkbox" },
                    { "id": 4697, "nama": "Jelaskan ", "type": "textbox" },
                ]
            },
            ]
        }
        $scope.$watch('item.obj[5812]', function (e) {
            if (e == true) {
                $scope.showbuffer = true;
            } else {
                $scope.showbuffer = false
            }
        })
        $scope.$watch('item.obj[4660]', function (e) {
            if (e == true) {
                $scope.item.obj[4659] = false;
                $scope.item.obj[4661] = false;
            }
        })
        $scope.$watch('item.obj[4661]', function (e) {
            if (e == true) {
                $scope.item.obj[4660] = false;
                $scope.item.obj[4659] = false;
            }
        })
        $scope.$watch('item.obj[4662]', function (e) {
            if (e == true) {
                $scope.item.obj[4663] = false;
                $scope.item.obj[4664] = false;
            }
        })
        $scope.$watch('item.obj[4663]', function (e) {
            if (e == true) {
                $scope.item.obj[4662] = false;
                $scope.item.obj[4664] = false;
            }
        })
        $scope.$watch('item.obj[4664]', function (e) {
            if (e == true) {
                $scope.item.obj[4663] = false;
                $scope.item.obj[4662] = false;
            }
        })
        $scope.$watch('item.obj[4665]', function (e) {
            if (e == true) {
                $scope.item.obj[4666] = false;
                $scope.item.obj[4667] = false;
            }
        })
        $scope.$watch('item.obj[4666]', function (e) {
            if (e == true) {
                $scope.item.obj[4665] = false;
                $scope.item.obj[4667] = false;
            }
        })
        $scope.$watch('item.obj[4667]', function (e) {
            if (e == true) {
                $scope.item.obj[4666] = false;
                $scope.item.obj[4665] = false;
            }
        })
        $scope.$watch('item.obj[4668]', function (e) {
            if (e == true) {
                $scope.item.obj[4669] = false;
            }
        })
        $scope.$watch('item.obj[4669]', function (e) {
            if (e == true) {
                $scope.yaalergi = true
                $scope.item.obj[4668] = false;
            } else {
                $scope.yaalergi = false
            }
        })
        $scope.$watch('item.obj[4671]', function (e) {
            if (e == true) {
                $scope.item.obj[4672] = false;
            }
        })
        $scope.$watch('item.obj[4672]', function (e) {
            if (e == true) {
                $scope.item.obj[4671] = false;
            }
        })
        $scope.$watch('item.obj[4674]', function (e) {
            if (e == true) {
                $scope.item.obj[4675] = false;
            }
        })
        $scope.$watch('item.obj[4675]', function (e) {
            if (e == true) {
                $scope.item.obj[4674] = false;
            }
        })
        $scope.$watch('item.obj[4677]', function (e) {
            if (e == true) {
                $scope.item.obj[4678] = false;
            }
        })
        $scope.$watch('item.obj[4678]', function (e) {
            if (e == true) {
                $scope.item.obj[4677] = false;
            }
        })
        $scope.$watch('item.obj[4680]', function (e) {
            if (e == true) {
                $scope.item.obj[4681] = false;
            }
        })
        $scope.$watch('item.obj[4681]', function (e) {
            if (e == true) {
                $scope.item.obj[4680] = false;
            }
        })
        $scope.$watch('item.obj[4683]', function (e) {
            if (e == true) {
                $scope.item.obj[4684] = false;
            }
        })
        $scope.$watch('item.obj[4684]', function (e) {
            if (e == true) {
                $scope.item.obj[4683] = false;
            }
        })
        $scope.$watch('item.obj[4686]', function (e) {
            if (e == true) {
                $scope.item.obj[4687] = false;
            }
        })
        $scope.$watch('item.obj[4687]', function (e) {
            if (e == true) {
                $scope.item.obj[4686] = false;
            }
        })
        $scope.$watch('item.obj[4689]', function (e) {
            if (e == true) {
                $scope.item.obj[4690] = false;
            }
        })
        $scope.$watch('item.obj[4690]', function (e) {
            if (e == true) {
                $scope.item.obj[4689] = false;
            }
        })
        $scope.$watch('item.obj[4692]', function (e) {
            if (e == true) {
                $scope.item.obj[4693] = false;
            }
        })
        $scope.$watch('item.obj[4693]', function (e) {
            if (e == true) {
                $scope.item.obj[4692] = false;
            }
        })
        $scope.$watch('item.obj[4695]', function (e) {
            if (e == true) {
                $scope.item.obj[4696] = false;
            }
        })
        $scope.$watch('item.obj[4696]', function (e) {
            if (e == true) {
                $scope.item.obj[4695] = false;
            }
        })
        function loadPengkajianKeperawatan() {
            medifirstService.get('emr/get-pengkajian-awal-keperawatan?noRegistrasi=' + $scope.cc.noregistrasi + "&emrfk=892").then(function(dat) {
                let data = dat.data
                for (let i = 0; i < data.length; i++) {
                    if (data[i].emrdfk == 3648) {
                        $scope.item.obj[4647] = data[i].value
                    } else if (data[i].emrdfk == 3654) {
                        $scope.item.obj[4748] = data[i].value
                    } else if (data[i].emrdfk == 3653) {
                        $scope.item.obj[4749] = data[i].value
                    } else if (data[i].emrdfk == 3649) {
                        $scope.item.obj[4750] = data[i].value
                    } else if (data[i].emrdfk == 3647) {
                        $scope.item.obj[4752] = { value: data[i].value, text: data[i].value }
                    } else if (data[i].emrdfk == 3655) {
                        $scope.item.obj[4754] = data[i].value
                    } else if (data[i].emrdfk == 3656) {
                        $scope.item.obj[4755] = data[i].value
                    } else if (data[i].emrdfk == 3650) {
                        $scope.item.obj[4756] = { value: data[i].value, text: data[i].value }
                    } else if (data[i].emrdfk == 3651) {
                        $scope.item.obj[4757] = { value: data[i].value, text: data[i].value }
                    } else if (data[i].emrdfk == 3652) {
                        $scope.item.obj[4758] = { value: data[i].value, text: data[i].value }
                    }
                }
            })
        }
        $scope.Save = function () {
            debugger
        
            var arrobj = Object.keys($scope.item.obj);
            var arrSave = [];
            
            for (let i = arrobj.length - 1; i >= 0; i--) {
                const key = parseInt(arrobj[i]);
                const value = $scope.item.obj[key];
            
                if (key == 4652) {
                    arrSave.push({ id: key, values: value.text });
                }
                else if ([6433, 6434, 6547].includes(key)) {
                    arrSave.push({ id: key, values: value ? value.namalengkap : null });
                }
                else if (key == 6432) {
                    arrSave.push({ id: key, values: value ? value.text : null });
                }
                else if (key == 6423) {
                    arrSave.push({ id: key, values: moment(value).format('HH:mm') });
                }
                else if ([6435, 6436, 6437, 6438, 6439, 6440, 6441, 6442, 6443, 6507, 6511, 6515, 6519, 6523, 6527, 6530, 6533, 6536, 6539, 6546].includes(key)) {
                    arrSave.push({ id: key, values: moment(value).format('HH:mm') });
                }
                else {
                    arrSave.push({ id: key, values: value });
                }
            }            
            if($scope.cc.edit == true){
                $scope.cc.pegawaifk= pgid
            } else {
                $scope.cc.pegawaifk= ''
            }
            
            if($scope.cc.edit == true){
                $scope.cc.tglemr= tglemredit
            } else {
                $scope.cc.tglemr= moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            }
            $scope.cc.jenisemr = 'anastesisedasi';
            var jsonSave = {
                head: $scope.cc,
                data: arrSave
            }
            debugger
            medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                // loadPdfForPapj921(e.data.data.noemr)
                nomorEMR = e.data.data.noemr
                $scope.cc.norec_emr = e.data.data.noemr
                var jsonLog = {
                    'jenislog': 'Simpan Anastesi Sedasi',
                    'referensi': 'noregistrasi',
                    'noreff': $scope.cc.noregistrasi,
                    'keterangan': 'Simpan Anastesi Sedasi ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi,
                    'data': arrSave,
                    'jenisemr': $scope.cc.jenisemr,
                    'emrfk': $scope.cc.emrfk
                }
                medifirstService.postLoggingEMR(jsonLog).then(function(e) {

                })
                var arrStr = {
                    0: e.data.data.noemr
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
            });
            $scope.popupttd.center().close();
        }
        function loadPdfForPapj921(nomorEMR) {
            medifirstService.get('emr/get-emr-transaksi-detail-polri?noemr=' + nomorEMR + "&emrfk=" + 2024, true).then(function(dat) {
                let pegawai = '';
                let dataLoad = dat.data.data
                if (nomorEMR == '') return
                var arrPush = [];
                for (let i = 5790; i <= 5821 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (let i = 6144; i <= 6149 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                arrPush.push({ emrdfk: "6155", value: "" })
                arrPush.push({ emrdfk: "5921", value: "" })
                for (let i = 0; i <= dataLoad.length - 1; i++) {
                    if (dataLoad[i].type == "date") {
                        dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD')
                    }
                    if (dataLoad[i].type == "datetime") {
                        dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                    }

                    if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5790") {                        
                        var str = dataLoad[i].value;
                        var res = str.split("~");                        
                        dataLoad[i].value = res[0]
                        pegawai = res[0]
                    }
                    if (parseFloat(921) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                arrPush[x].value = dataLoad[i].value
                            }
                        }
                    }
                }
                let qrcode = ("http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?namaPegawai=" + pegawai + "&pesan=" + "PEMERIKSAAN IMUNOHISTOKIMIA");
                let tglemr = $scope.current.tglemrindo
                let noverifikasipa = $scope.current.noverifikasipa
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["dataLoad","qrcode","tglemr","noverifikasipa"],
                    "paramValue": [arrPush,qrcode,tglemr,noverifikasipa],
                    "paramType" : ["","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                    //this.response is what you're looking for
                    // handler(this.response);
                    // console.log(this.response, typeof this.response);
                    var res = this.response
                    var file = new Blob( [res], {type: 'application/pdf'});
                    var url = window.URL.createObjectURL(this.response)
                    var jenis = 'imunohistokimia';
                    getBase64(file,jenis)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                    }
                }
                if(window.location.hostname.indexOf('10.5.1.2') > -1){
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/imunohistokimia.pdf');
                }else if(window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1){
                    xhr.open('POST', '/report8797/generic/report/imunohistokimia.pdf');
                }else{
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/imunohistokimia.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));	
            })
        }
        $scope.kembali = function () {
            window.history.back()
        }
        $scope.openPopup = function (){
            $scope.popupttd.center().open();


        }
        $scope.cetakPdf = function () {    
        paramSearch = 'noregistrasi=' +  $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pemeriksaanbankdarah", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    
                    var nomorEMRSS = ''
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.tglemr = dat.data.data[0].tglemr
                       
                        $scope.cc.norec_emr = nomorEMR
                        } })
        medifirstService.get('emr/get-emr-transaksi-detail-polri?noemr=' + nomorEMR + "&emrfk=" + 2024, true).then(function(dat) {
            
            let pegawai = '';
            let dataLoad = dat.data.data
            if (nomorEMR == '') return
            var arrPush = [];
            for (let i = 6421; i <= 6548 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            for (let i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "date") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD')
                }
                if (dataLoad[i].type == "time") {
                    if (dataLoad[i].value != "Invalid date") {
                        if (dataLoad[i].value != null) {
                            if (dataLoad[i].value.length > 5) {
                                // let time = moment(dataLoad[i].value).format('HH:mm')
                                dataLoad[i].value = moment(dataLoad[i].value).format('HH:mm')
                            } else {
                                dataLoad[i].value = dataLoad[i].value
                            }
                        }
                    } else {
                        dataLoad[i].value = ""
                    }
                }
                if (dataLoad[i].type == "datetime") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                }
                
                if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6290") {                        
                    var str = dataLoad[i].value;
                    var res = str.split("~");                        
                    dataLoad[i].value = res[0]
                    pegawai = res[0]
                }
                if (parseFloat(2024) == dataLoad[i].emrfk) {
                    for (var x = 0; x <= arrPush.length - 1; x++) {
                        if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                            arrPush[x].value = dataLoad[i].value
                        }
                    }
                }
            }
            let nocm = $scope.header.nocm;
            let nama = $scope.header.namapasien;
            let umur = $scope.header.umur;
            let noregistrasi = $scope.header.noregistrasi;
            let tgllahir = moment($scope.header.tgllahir).format('DD-MM-YYYY');
            let jeniskelamin = $scope.header.jeniskelamin;
            let ruangan = $scope.header.namaruangan;
            let qrcode1 = ("http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?namaPegawai=" + arrPush[126].value + "&pesan=" + "ANASTESI SEDASI");
           
            let tglemr =   $scope.tglemr
            let tglnow = moment($scope.now).format('YYYY-MM-DD')
            let jamnow = moment($scope.now).format('HH:mm')
            debugger
            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["dataLoad","qrcode1","tglemr","noverifikasipa","tglnow", "jamnow","nama", "nocm", "noregistrasi","umur", "tgllahir", "jeniskelamin", "ruangan"],
                "paramValue": [arrPush,qrcode1,tglemr,noverifikasipa,tglnow,jamnow,nama,nocm,noregistrasi,umur,tgllahir,jeniskelamin,ruangan],
                "paramType" : ["","","","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
            };
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                //this.response is what you're looking for
                // handler(this.response);
                // console.log(this.response, typeof this.response);
                var res = this.response
                var file = new Blob( [res], {type: 'application/pdf'});
                var url = window.URL.createObjectURL(this.response)
                var jenis = 'imunohistokimia';
                getBase64(file,jenis)
                var pdf = document.getElementById('tempatLaporan');
                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                var win = window.open(url, '_blank');
                win.focus();
                }
            }
            var datauserkelompok = medifirstService.getKelompokUser();

            if (datauserkelompok == "ppa") {
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/anastesisedasi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/anastesisedasi.pdf');
                }
            } else {
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/anastesisedasi.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/anastesisedasi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/anastesisedasi.pdf');
                }
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));	
        })
        }
        function getBase64(file,jenis) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                //    tes.push(reader)
                console.log(reader.result)
                // foto.push({ foto: (reader.result), id: 4 })
                // saveFilePapj(reader.result,jenis)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
        function saveFilePapj(file,jenis) {
            debugger
            let objSave = {
                'jenis': jenis,
                'noregistrasi': $scope.cc.noregistrasi,
                'file': file
            }
            medifirstService.postNonMessage('registrasi/post-file-papj', objSave).then(function(e) {

            })
        }
    }
])
})