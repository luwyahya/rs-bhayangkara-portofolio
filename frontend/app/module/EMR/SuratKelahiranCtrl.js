define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SuratKelahiranCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isKembali = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 2028
            var dataLoad = []
            $scope.item = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            var paramSearch = ''
            $scope.user = {};
            $scope.istempatLaporan = true;
            $scope.item.obj = []
            $scope.isRouteLoading = false         
            let hari = ''
            let tanggal = ''
            let jam = ''   
            $scope.keterangantidaknormal = false;
            $scope.kembarya = false;
            loadCombo();
            LoadCacheHelper();

            function loadCombo() {
                $scope.listJenisKelamin = [
                    { id: 1, jeniskelamin: "LAKI-LAKI" },
                    { id: 2, jeniskelamin: "PEREMPUAN" },
                ];
                $scope.listUrutanAnak = [
                    { id: 1, urutananak: "1" },
                    { id: 2, urutananak: "2" },
                    { id: 3, urutananak: "3" },
                    { id: 4, urutananak: "4" },
                    { id: 5, urutananak: "5" },
                ];
                medifirstService.get("emr/get-combo-anyar-hehe").then(function (e) {
                    $scope.listDokter = e.data.dokterbidan
                })
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
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
                    $scope.cc.norec_emr = '-'
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    init()
                }
            }
            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=suratkelahiran", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheRMelektronik', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '2028'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        // medifirstService.get("emr/get-Biodata-Pasien?norm=" + $scope.cc.nocm).then(function (dat) {
                        //     debugger
                        //     $scope.item.obj[5110] = $scope.cc.namapasien
                        //     $scope.item.obj[5111] = dat.data.data[0].noidentitas
                        //     $scope.item.obj[5112] = dat.data.data[0].alamatlengkap
                        //     $scope.item.obj[5113] = dat.data.data[0].pekerjaan
                        // })
                    }
                });
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
            
            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isLoading = false
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
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }

                            if (dataLoad[i].type == "datetime" && dataLoad[i].emrdfk == "5118") {                                    
                                var dateObj = new Date(dataLoad[i].value);

                                // Mendapatkan tanggal dalam format DD-MM-YYYY
                                var formattedDate = ('0' + dateObj.getDate()).slice(-2) + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + dateObj.getFullYear();
                            
                                // Mendapatkan jam dalam format HH:mm
                                var formattedTime = ('0' + dateObj.getHours()).slice(-2) + ':' + ('0' + dateObj.getMinutes()).slice(-2);
                            
                                // Gabungkan tanggal dan jam
                                var combinedDateTime = formattedDate + ' ' + formattedTime;                               
                            
                                // Mendapatkan nama hari
                                var daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                                var dayOfWeek = daysOfWeek[dateObj.getDay()];

                                hari = dayOfWeek
                                tanggal = formattedDate
                                jam = formattedTime                                                                    
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
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5107") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], namalengkap: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5131") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], namalengkap: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5109") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], jeniskelamin: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5124") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], kodeNama: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5125") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], kodeNama: str }
                            }
                            if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "5129") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], urutananak: str }
                            }
                        }
                    }
                    // console.log($scope.item.obj)
                })
            }

            $scope.$watch('item.obj[5122]', function(e) {
                if (e == true) {
                    $scope.keterangantidaknormal = true;
                    $scope.item.obj[5121] = undefined
                } else {
                    $scope.keterangantidaknormal = false;
                }
            })
            $scope.$watch('item.obj[5122]', function(e) {
                if (e == true) {
                    $scope.item.obj[5121] = false
                }
            })
            $scope.$watch('item.obj[5121]', function(e) {
                if (e == true) {
                    $scope.item.obj[5122] = false
                }
            })
            $scope.$watch('item.obj[5127]', function(e) {
                if (e == true) {
                    $scope.kembarya = true;
                    $scope.item.obj[5126] = undefined
                } else {
                    $scope.kembarya = false;
                }
            })
            $scope.$watch('item.obj[5126]', function(e) {
                if (e == true) {
                    $scope.item.obj[5127] = false
                }
            })
            $scope.$watch('item.obj[5127]', function(e) {
                if (e == true) {
                    $scope.item.obj[5126] = false
                }
            })

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

            $scope.CetakSurat = function () {            
             
                if (nomorEMR == '') return
                var arrPush = []
                for (var i = 5107; i <= 5132 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (let i = 0; i <= dataLoad.length - 1; i++) {
                    if (dataLoad[i].type == "datetime") {
                        dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
                    }
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                arrPush[x].value = dataLoad[i].value
                            }
                        }
                    }
                    // if (dataLoad[i].emrdfk == "5131") {
                    //     var perawat = dataLoad[i].pegawaifk        
                    // }
                }
                    var nama = $scope.cc.namapasien
                    var nocm = $scope.cc.nocm
                    var tgllahir = $scope.cc.tglLahir
                    var jk = $scope.cc.jeniskelamin
                    var umur = $scope.cc.umur
                    var ruangan = $scope.cc.namaruangan
                    var norecpd = $scope.cc.norec_pd
                    var no = $scope.item.obj[6164] != undefined ? $scope.item.obj[6164] : null
                    var pol = $scope.item.obj[6165] != undefined ? $scope.item.obj[6165] : null
                    var keb = $scope.item.obj[6166] != undefined ? $scope.item.obj[6166] : null
                    var perawat = $scope.item.obj[5131] != undefined ? $scope.item.obj[5131].value : null
                    var qrcode1 = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?namaPegawai=" + perawat + "&pesan=SURAT KELAHIRAN"  + "&noregistrasi=" + $scope.cc.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["dataLoad","nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan","norecpd","hari","tanggal","jam","no","pol","keb","qrcode1","perawat"],
                    "paramValue": [arrPush,nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan,norecpd,hari,tanggal,jam,no,pol,keb,qrcode1,perawat],
                    "paramType" : ["","","","","","","","","","","","","","","","","","","","",""]
                };
                
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200){                    
                        console.log(this.response, typeof this.response);
                        var res = this.response
                        var file = new Blob( [res], {type: 'application/pdf'});
                        var url = window.URL.createObjectURL(this.response)
                        var jenis = 'suratkelahiran';
                        getBase64(file,jenis)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/SuratKelahiran.pdf');
                }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/SuratKelahiran.pdf');
                }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/SuratKelahiran.pdf');
                }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/SuratKelahiran.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', '/report8797/generic/report/SuratKelahiran.pdf');
                }else{
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/SuratKelahiran.pdf');
                }            
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                xhr.responseType = 'blob';            
                xhr.send(JSON.stringify(data));	
            }





            $scope.Save = function () {
                debugger
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 5107) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 5131) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 5109) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].jeniskelamin })
                    } else if (arrobj[i] == 5124) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].kodeNama })
                    } else if (arrobj[i] == 5125) {
                        if ($scope.item.obj[parseInt(arrobj[i])] == null ){
                            arrSave.push({ id: arrobj[i], values: "" })
                        }else[
                            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].kodeNama })
                        ]
                    } else if (arrobj[i] == 5129) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].urutananak })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                $scope.cc.jenisemr = 'suratkelahiran'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Surat Kelahiran ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                        $scope.isRouteLoading = true;
                        setTimeout(function() {
                            init()
                            var arrStr = {
                                0: e.data.data.noemr
                            }
                            cacheHelper.set('cacheNomorEMR', arrStr);
                            $scope.isRouteLoading = false
                        }, 5000);
                });
            }
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
    ]);
});