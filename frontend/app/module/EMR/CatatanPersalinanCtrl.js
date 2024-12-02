define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPersalinanCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
        function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.user = {};
            $scope.cc = {};
            $scope.cc.emrfk = 2017;
            $scope.now = new Date();
            var paramSearch = ''
            var nomorEMRSS = '';
            var nomorEMR = '-'
            var dataLoad = []
            $scope.istempatLaporan = true;
            $scope.ada = false;
            $scope.ruanglainnya = false;
            var noemr = ''
            $scope.item.obj = []
            var tanggal1 = ''
            var tanggal2 = ''
            var tanggal3 = ''
            var tanggal4 = ''
            var tanggal5 = ''
            $scope.tunggal = false;
            $scope.gemmly = false;
            $scope.rupture = false;
            LoadCombo()
            LoadCacheHelper()

            function LoadCombo() {
                medifirstService.get('emr/get-combo').then(function (dat) {
                    $scope.listDokter = dat.data.dokter
                    $scope.listperawatBidan = dat.data.perawatBidan
                })

                $scope.listKeadaanUmum = [
                    { text: "Baik", value: 1 },
                    { text: "Tampak Sakit Ringan", value: 2 },
                    { text: "Tampak Sakit Sedang", value: 3 },
                    { text: "Tampak Sakit Berat", value: 4 },
                ];
                $scope.listBayiLahir = [
                    { text: "Tunggal", value: 1 },
                    { text: "Gemmly", value: 2 },
                    { text: "Triplet", value: 3 },
                    { text: "Kuarte", value: 4 },
                ];
                $scope.listRupture = [
                    { text: "1", value: 1 },
                    { text: "2", value: 2 },
                    { text: "3", value: 3 },
                    { text: "4", value: 4 },
                ];

            }

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
                    $scope.cc.jenisemr = "catatanpersalinan"
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    // $scope.item.obj[4640] = {value: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap}
                    init()
                }
            }

            function init() {
                $scope.isRouteLoading = true

                // medifirstService.get("emr/get-riwayat-asuhan-gizi?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                //     $scope.isRouteLoading = false;                        
                //     let data = dat.data
                //     for(let i = 0; i < data.length; i++) {
                //         data[i].no = i + 1;
                //     }
                //     $scope.dataRiwayatGizi = new kendo.data.DataSource({
                //         data: data,
                //         schema: {
                //             model: {
                //             }
                //         },
                //         pageSize: 10,
                //         total: data.length,
                //         serverPaging: false,

                //     });  
                // })

                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=catatanpersalinan", true).then(function (dat) {
                    //debugger
                    $scope.isRouteLoading = false
                    if (dat.data.data.length > 0) {
                        $scope.noemr = dat.data.data[0].noemr
                        $scope.cc.norec_emr = dat.data.data[0].noemr
                        nomorEMRSS = ''
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = 2017;
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    }
                    else {
                        // medifirstService.get('emr/get-image-from-jenis-surat?').then(function(dat) {
                        //     //debugger
                        //     $scope.user.poto = dat.data[0].template
                        //     $scope.user.poto2 = dat.data[1].template
                        // })
                    }
                })
                // loadData()
            }
            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    //debugger
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
                            }
                            // if (dataLoad[i].type == "datetime") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                            // }
                            if (dataLoad[i].emrdfk == 7441) {
                                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
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
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "7442") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "7443") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "7410") {
                                var str = dataLoad[i].value
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: dataLoad[i].value, text: dataLoad[i].value }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "7484") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6230") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                            }

                            //datetime
                            if (dataLoad[i].emrdfk == 6073) {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].emrdfk == 6078) {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].emrdfk == 6085) {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].emrdfk == 6112) {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                        }

                    }
                })
            }


            $scope.simpan = function () {
                //debugger
                var user = medifirstService.getPegawaiLogin();
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (let i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 7410) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 7442) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 7443) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseFloat(arrobj[i])] })
                    }

                }
                $scope.cc.jenisemr = 'catatanpersalinan'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })

                    // medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    //     'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    //     + $scope.cc.noregistrasi).then(function (res) {
                    //     })
                    var jsonLog = {
                        'jenislog': 'Simpan Catatan Persalinan',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Simpan Catatan Persalinan ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                            + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function (e) {
                    })
                    $scope.isRouteLoading = true;
                    setTimeout(function() {
                        init()
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                        $scope.isRouteLoading = false
                    }, 5000)
                });
            }
            $scope.cetak = function () {
                //debugger
                if (nomorEMR == '') return
                var kiri = $scope.user.poto;
                var kanan = $scope.user.poto2;
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 1261; i <= 1270 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 1272; i <= 1275 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                arrPush[x].value = dataLoad[i].value
                            }
                        }
                    }

                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norm", "dataLoad", "namaPasien", "jeniskelamin", "umur", "ruangan", "kiri", "kanan"],
                    "paramValue": [$scope.cc.nocm, arrPush, $scope.cc.namapasien, $scope.cc.jeniskelamin, $scope.cc.umur, $scope.cc.namaruangan, kiri, kanan],
                    "paramType": ["", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        //debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/poli-jiwa.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/poli-jiwa.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/poli-jiwa.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/poli-jiwa.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/poli-jiwa.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.columnRiwayatGizi = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "5px",
                    "template": "<span class='style-center'>#: no #</span>",
                },
                {
                    "field": "tglemr",
                    "title": "Tanggal EMR",
                    "width": "10px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                },
                {
                    "field": "namalengkap",
                    "title": "Dietisien / Ahli Gizi",
                    "width": "30px",
                }
            ];

            $scope.CetakSurat = function () {
                debugger
                if (nomorEMR == '') return
                var arrPush = []
                for (var i = 6072; i <= 6139 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 6173; i < 6233 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (let i = 0; i <= dataLoad.length - 1; i++) {
                    if (dataLoad[i].type == "datetime") {
                        dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                    }
                    if (dataLoad[i].type == "date") {
                        dataLoad[i].value = moment(dataLoad[i].value).format('DD-MM-YYYY')
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
                    if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6230") {
                        var str = dataLoad[i].value
                        var res = str.split("~");
                        dataLoad[i].value = res[0];
                    }
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                arrPush[x].value = dataLoad[i].value
                            }
                        }
                    }
                }
                tanggal1 = moment($scope.item.obj[6072]).format('DD-MM-YYYY')
                tanggal2 = moment($scope.item.obj[6077]).format('DD-MM-YYYY')
                tanggal3 = moment($scope.item.obj[6084]).format('DD-MM-YYYY')
                tanggal4 = moment($scope.item.obj[6111]).format('DD-MM-YYYY')
                // if ($scope.item.obj[6173] != undefined) {

                // }
                tanggal5 = moment($scope.item.obj[7441]).format('YYYY-MM-DD')
                var tglnow = ''
                var namaHariFix = ''

                var namaHari = moment(tanggal5).format('dddd');
                if(namaHari == 'Sunday'){
                    namaHariFix = 'Minggu,' 
                } else if(namaHari == 'Monday'){
                    namaHariFix = 'Senin,' 
                } else if(namaHari == 'Tuesday'){
                    namaHariFix = 'Selasa,' 
                } else if(namaHari == 'Wednesday'){
                    namaHariFix = 'Rabu,' 
                } else if(namaHari == 'Thursday'){
                    namaHariFix = 'Kamis,' 
                } else if(namaHari == 'Friday'){
                    namaHariFix = 'Jumat,' 
                } else if(namaHari == 'Saturday'){
                    namaHariFix = 'Sabtu,' 
                } 

                medifirstService.get("registrasi/git-tinggil-hirif?tanggal=" + tanggal5).then(function (dat) {
                    tglnow = dat.data.tglayeuna;

                    var nama = $scope.cc.namapasien
                    var nocm = $scope.cc.nocm
                    var tgllahir = $scope.cc.tglLahir
                    var jk = $scope.cc.jeniskelamin
                    var umur = $scope.cc.umur
                    var ruangan = $scope.cc.namaruangan
                    var norecpd = $scope.cc.norec_pd
                    var bidan = $scope.item.obj[7443] != undefined ? $scope.item.obj[7443].namalengkap : null
                    var dokter = $scope.item.obj[7442] != undefined ? $scope.item.obj[7442].namalengkap : null
                    var qrcode1 = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel-persalinan?namaPegawai=" + bidan + "&pesan=CATATAN PERSALINAN" + "&noregistrasi=" + $scope.cc.noregistrasi + "&tglnow=" + tglnow
                    var qrcode2 = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel-persalinan?namaPegawai=" + dokter + "&pesan=CATATAN PERSALINAN" + "&noregistrasi=" + $scope.cc.noregistrasi + "&tglnow=" + tglnow
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["dataLoad", "nomorEMR", "noregistrasi", "ruanganfk", "nama", "nocm", "tgllahir", "jeniskelamin", "umur", "qrcode1",  "tanggal1", "tanggal2", "tanggal3", "tanggal4","namaHariFix","tglnow","qrcode2"],
                        "paramValue": [arrPush, nomorEMR, $scope.cc.noregistrasi, $scope.cc.objectruanganfk, nama, nocm, tgllahir, jk, umur,   qrcode1,  tanggal1, tanggal2, tanggal3, tanggal4,namaHariFix,tglnow,qrcode2],
                        "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","",""]
                    };

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log(this.response, typeof this.response);
                            var res = this.response
                            var file = new Blob( [res], {type: 'application/pdf'});
                            var url = window.URL.createObjectURL(this.response)
                            var jenis = 'catatanpersalinan';
                            getBase64(file,jenis)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    if ($scope.item.obj[7484].value == 4) {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/CatatanPersalinan4.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/CatatanPersalinan4.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/CatatanPersalinan4.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/CatatanPersalinan4.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/CatatanPersalinan4.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/CatatanPersalinan4.pdf');
                        }
                    } else if ($scope.item.obj[7484].value == 3) {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/CatatanPersalinan3.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/CatatanPersalinan3.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/CatatanPersalinan3.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/CatatanPersalinan3.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/CatatanPersalinan3.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/CatatanPersalinan3.pdf');
                        }
                    } else if ($scope.item.obj[7484].value == 2) {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/CatatanPersalinan2.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/CatatanPersalinan2.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/CatatanPersalinan2.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/CatatanPersalinan2.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/CatatanPersalinan2.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/CatatanPersalinan2.pdf');
                        }
                    } else {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/CatatanPersalinan.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/CatatanPersalinan.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/CatatanPersalinan.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/CatatanPersalinan.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/CatatanPersalinan.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/CatatanPersalinan.pdf');
                        }
                    }
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    xhr.send(JSON.stringify(data));
                })
            }
            $scope.$watch('item.obj[7484]', function(e) {
                debugger
                if (e.value == 1) {
                    $scope.tunggal = true
                    $scope.gemmly = false
                    $scope.triplet = false
                    $scope.kuarte = false
                } else if (e.value == 2) {
                    $scope.tunggal = true
                    $scope.gemmly = true
                    $scope.triplet = false
                    $scope.kuarte = false
                } else if (e.value == 3) {
                    $scope.tunggal = true
                    $scope.gemmly = true
                    $scope.triplet = true
                    $scope.kuarte = false
                } else if (e.value == 4) {
                    $scope.tunggal = true
                    $scope.gemmly = true
                    $scope.triplet = true
                    $scope.kuarte = true
                } else {
                    $scope.tunggal = false
                    $scope.gemmly = false
                    $scope.triplet = false
                    $scope.kuarte = false
                }
            })
            $scope.$watch('item.obj[6109]', function(e) {
                if (e == true) {
                    $scope.item.obj[6110] = false;
                    $scope.rupture = true;
                } else {
                    $scope.rupture = false;
                }
            })
            $scope.$watch('item.obj[6110]', function(e) {
                if (e == true) {
                    $scope.rupture = false;
                    $scope.item.obj[6109] = false;
                }
            })
            function getBase64(file,jenis) {
                 

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    // foto.push({ foto: (reader.result), id: 4 })
                    saveFilePapj(reader.result,jenis)
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            function saveFilePapj(file,jenis) {
                 
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