define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('LaporanOperasiNewCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.user = {};
        $scope.cc = {};
        $scope.cc.emrfk = 899;
        $scope.cc.namaBedah = ''
        $scope.cc.idPegawai = ''
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        var dataLoad = []
        $scope.istempatLaporan = true;
        $scope.ada = false;
        $scope.ruanglainnya = false;
        var noemr = ''
        $scope.isRouteLoading = false;
        LoadCombo()
        LoadCacheHelper()
        // loadRiwayat()

        function LoadCombo() {
            medifirstService.get('emr/get-combo?').then(function(dat) {
                $scope.listDokter = dat.data.dokter
                $scope.listPerawat = dat.data.perawat
            })
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
                $scope.cc.jenisemr = "laporanoperasinew"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                init()
            }
        }
        function clearAll() {
            $scope.item = {}
        }

        // function loadRiwayat(){
        //     medifirstService.get("emr/get-riwayat-laporan-operasi?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
        //         $scope.isRouteLoading = false;                        
        //         let data = dat.data
        //         for(let i = 0; i < data.length; i++) {
        //             data[i].no = i + 1;
        //         }
        //         $scope.dataRiwayatOperasi = new kendo.data.DataSource({
        //             data: data,
        //             schema: {
        //                 model: {
        //                 }
        //             },
        //             pageSize: 10,
        //             total: data.length,
        //             serverPaging: false,
                   
        //         });  
        //     })
        // }
        
        function init() {
            
            $scope.isRouteLoading = true

            medifirstService.get("emr/get-riwayat-laporan-operasi?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                $scope.isRouteLoading = false;                        
                let data = dat.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataRiwayatOperasi = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })

            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=laporanoperasinew", true).then(function(dat) {
                // debugger
                $scope.isRouteLoading = false
                if (dat.data.data.length > 0) {
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 899;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    getIdPegawai()
                } else {
                    medifirstService.get('emr/get-image-from-jenis-surat?').then(function(dat) {
                        // debugger
                        $scope.user.poto = dat.data[0].template
                        $scope.user.poto2 = dat.data[1].template
                    })
                }
            })
            // loadRiwayat()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                // debugger
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[68] = $scope.now
                dataLoad = dat.data.data
                // debugger
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    // debugger
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }

                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        // if (dataLoad[i].emrdfk == "4494") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                        // }
                        // if (dataLoad[i].emrdfk == "4496") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                        // }
                        // if (dataLoad[i].emrdfk == "4493") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                        // }
                        // if (dataLoad[i].type == "time" && dataLoad[i].emrdfk == "4494") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                        // }
                        // if (dataLoad[i].type == "time" && dataLoad[i].emrdfk == "4496") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                        // }
                        // if (dataLoad[i].type == "time" && dataLoad[i].emrdfk == "4493") {
                        //     $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('HH:mm')
                        // }
                        if (dataLoad[i].type == "textbox" && dataLoad[i].emrdfk == "4493") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4503") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4478") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6583") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4479") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6584") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "4480") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6585") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6586") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }        
                        }
                        if (dataLoad[i].emrdfk == "4503") {
                            $scope.cc.namaBedah = dataLoad[i].value
                        }
                    }
                }
                medifirstService.get('emr/get-id-pegawai?namalengkap=' + $scope.cc.namaBedah).then(function (e) {
                    if (e.data.message = 'dapet nich') {
                        $scope.cc.idPegawai = e.data.data.id
                    }
                })
            })
        }
        // $scope.$watchGroup(['item.obj[4494]', 'item.obj[4496]'], function(newValues, oldValues) {
        //     if (newValues[0] && newValues[1]) {
        //         $scope.calculateDuration();
        //     }
        // });
        // $scope.calculateDuration = function() {
        //     // Ambil nilai jam mulai operasi dan jam selesai operasi dari model
        //     var startTime = moment($scope.item.obj[4494]).format('HH:mm')
        //     var endTime = moment($scope.item.obj[4496]).format('HH:mm')
        
        //     // Konversi string ke objek waktu
        //     var startTimeObj = new Date("1970-01-01T" + startTime + "Z");
        //     var endTimeObj = new Date("1970-01-01T" + endTime + "Z");
        
        //     // Hitung selisih waktu dalam milisecond
        //     var durationInMs = endTimeObj - startTimeObj;
        
        //     // Konversi milisecond menjadi jam dan menit
        //     var hours = Math.floor(durationInMs / (1000 * 60 * 60));
        //     var minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
        
        //     // Format hasil ke dalam string "HH:mm"
        //     var durationFormatted = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
        
        //     // Assign hasil perhitungan ke model untuk input lama operasi
        //     $scope.item.obj[4493] = durationFormatted;
        // };

        $scope.columnRiwayatOperasi = [
            {
                "field": "no",  
                "title": "No",
                "width": "5px",
                "template": "<span class='style-center'>#: no #</span>",
            },  
            {
                "field": "tglemr",
                "title": "Tanggal Operasi",
                "width": "20px"
            },               
            {
                "field": "namalengkap",
                "title": "Pegawai Pembuat Jadwal Operasi",
                "width": "30px",
            },
            {
                "title": "Hapus",
                "width": "10px",
                "template": "<button class=\"k-button custom-button\" ng-click=\"hapusGrid(dataSelectedRiwayatOperasi)\" style=\"margin:0 0 5px\">Hapus</button>"
            }
        ];

        $scope.simpan = function() {
            debugger
            // var user = medifirstService.getPegawaiLogin();
            // $scope.item.obj[4494] = moment($scope.item.obj[4494]).format('HH:mm')
            // $scope.item.obj[4496] = moment($scope.item.obj[4496]).format('HH:mm')
            // $scope.item.obj[4493] = moment($scope.item.obj[4493]).format('HH:mm')
            // $scope.item.obj[1234] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 4503) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 4478) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 6583) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 4479) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 6584) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 4480) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 6585) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 6586) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    }else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
            }
            $scope.cc.jenisemr = 'laporanoperasinew'
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
                        'jenislog': 'Simpan Laporan Operasi',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Simpan Laporan Operasi ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {

                    })
                        init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });

                
                
                medifirstService.get("emr/get-riwayat-laporan-operasi?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                    $scope.isRouteLoading = false;                        
                    let data = dat.data
                    for(let i = 0; i < data.length; i++) {
                        data[i].no = i + 1;
                    }
                    $scope.dataRiwayatOperasi = new kendo.data.DataSource({
                        data: data,
                        schema: {
                            model: {
                            }
                        },
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                    
                    });  
                })
        }
        $scope.cetak = function () {           
            if (nomorEMR == '') return
            var arrPush = []
            for (var i = 4478; i <= 4504 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            for (var i = 6583; i <= 6619 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            arrPush.push({ emrdfk: "8144", value: "" })
            for (let i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "date") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD')
                }
                if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                    for (var x = 0; x <= arrPush.length - 1; x++) {
                        if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                            arrPush[x].value = dataLoad[i].value
                        }
                    }
                }
            }
            var kontrol = ''
            for (let y = 0; y < arrPush.length; y++) {
                if (arrPush[y].emrdfk == "6598" && arrPush[y].value == "1") {
                    kontrol = "Kontrol Nadi :"
                } else if (arrPush[y].emrdfk == "6599" && arrPush[y].value == "1") {
                    kontrol = "Kontrol Tensi :"
                } else if (arrPush[y].emrdfk == "6600" && arrPush[y].value == "1") {
                    kontrol = "Kontrol Pernapasan :"
                } else if (arrPush[y].emrdfk == "6601" && arrPush[y].value == "1") {
                    kontrol = "Kontrol Suhu :"
                }
            }

            var patologi = ''
            for (let y = 0; y < arrPush.length; y++) {
                if (arrPush[y].emrdfk == "4489" && arrPush[y].value == "1") {
                    patologi = "Ya"
                } else if (arrPush[y].emrdfk == "4488" && arrPush[y].value == "1") {
                    patologi = "Tidak"
                }
            }

            var intraoperasi = ''
            for (let y = 0; y < arrPush.length; y++) {
                if (arrPush[y].emrdfk == "6592" && arrPush[y].value == "1") {
                    intraoperasi = "Ya"
                } else if (arrPush[y].emrdfk == "6593" && arrPush[y].value == "1") {
                    intraoperasi = "Tidak"
                }
            }

            if ($scope.cc.namaBedah == '' || $scope.cc.namaBedah == undefined) {
                toastr.warning('Tanda Tangan Dokter Bedah belum terisi!')
            } else if ($scope.cc.idPegawai == '' || $scope.cc.idPegawai == '') {
                toastr.warning('Tidak dapat menemukan id dokter, mohon simpan kembali!')  
            }

                var nama = $scope.cc.namapasien
                var nocm = $scope.cc.nocm
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan
                var norecpd = $scope.cc.norec_pd
                var qr = "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai="+$scope.cc.idPegawai
                // var petugasedukasi = $scope.petugasedukasi
            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["dataLoad","nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan","norecpd", "kontrol", "patologi", "intraoperasi", "qr"],
                "paramValue": [arrPush,nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan,norecpd, kontrol, patologi, intraoperasi, qr],
                "paramType" : ["","","","","","","","","","","","","","","","",""]
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){                    
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                     ;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('localhost') > -1) {
                xhr.open('POST', 'http://localhost:8797/generic/report/LaporanOperasiSalinan.pdf');
            } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                xhr.open('POST', 'http://103.151.226.36:2222/generic/report/LaporanOperasiSalinan.pdf');
            } else {
                xhr.open('POST', '/jasper1/generic/report/LaporanOperasiSalinan.pdf');
            }      
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';            
            xhr.send(JSON.stringify(data));	
        }

        $scope.BuatBaru = function (){
            var chekedd = false
            $scope.item.obj = []
            nomorEMRSS = ''
            $scope.cc.norec_emr = '-'
            $scope.item.obj[4491] = moment($scope.now).format('YYYY-MM-DD')
            // LoadCacheHelper();
        }
        $scope.formatTanggal = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY');
        }
        $scope.EditLihat = function () {
            if ($scope.dataSelectedRiwayatOperasi == undefined) {
                alert("Pilih Tanggal Operasi Yang Mau di Edit / Lihat !!")
                return;
            }
            $scope.isRouteLoading = true
            noemr = '&noemr=' + $scope.dataSelectedRiwayatOperasi.noemr
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=laporanoperasinew" + noemr, true).then(function(dat) {
                // debugger
                $scope.isRouteLoading = false
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 899;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
            })
        }

        $scope.hapusGrid = function(dataSelectedRiwayatOperasi) {
            debugger
            if($scope.dataSelectedRiwayatOperasi==null || $scope.dataSelectedRiwayatOperasi=='undefined') {
                toastr.error("Pilih data yang akan dihapus");
                return;
            }

            var item = {
                "norec": $scope.dataSelectedRiwayatOperasi.norec
            }

            var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                .textContent('Peringatan, Anda yakin akan menghapus riwayat laporan operasi yang dipilih?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                                $mdDialog.show(confirm).then(function () {
                                    medifirstService.post('emr/delete-riwayat-laporan-operasi/delete', item).then(function(e) {
                                        debugger                                    
                                        init()
                                    });
                                })
        }
    }
])
})