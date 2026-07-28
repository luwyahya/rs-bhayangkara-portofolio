define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianGiziCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.cc = {};
        $scope.item.obj = []
        var dataLoad = []
        $scope.cc.emrfk = 890;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        $scope.lainnya = false;      
        var lanjut = false;
        var totalNilai = 0;
        LoadCacheHelper()
        loadCombo()

        
       
        $scope.$watch('item.obj[1470]', function(e) {
            if (e == true) {
                $scope.lainnya = true;
                $scope.item.obj[1469] = undefined
                // $scope.item.obj[1150] = undefined
            } 
            else {
                $scope.lainnya = false;
            }
        })

        $scope.$watch('item.obj[1469]', function(e) {
            if (e == true) {
                $scope.item.obj[1470] = undefined
                // $scope.item.obj[1150] = undefined
            } 
        })

        

        // $scope.$watch('item.obj[1179]', function(e) {
        //     debugger
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 0
        //     } else if (e == false) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 0
        //     }
        // })
        
        // $scope.$watch('item.obj[1180]', function(e) {
        //     debugger
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 2
        //     } else if (e == false) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 2
        //     }
        // })
        
        // $scope.$watch('item.obj[1182]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 1
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 1
        //     }
        // })
        
        // $scope.$watch('item.obj[1183]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 2
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 2
        //     }
        // })
        
        // $scope.$watch('item.obj[1184]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 3
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 3
        //     }
        // })
        
        // $scope.$watch('item.obj[1185]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 4
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 4
        //     }
        // })
        
        // $scope.$watch('item.obj[1186]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 0
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 0
        //     }
        // })
        
        // $scope.$watch('item.obj[1187]', function(e) {
        //     if (e == true) {
        //         $scope.item.obj[1188] = parseInt(totalNilai) + 1
        //     } else {
        //         $scope.item.obj[1188] = parseInt(totalNilai) - 1
        //     }
        // })

       

        // $scope.$watch('item.obj[1149]', function(e) {
        //     debugger
        //     if (e != undefined) {
        //         medifirstService.get('emr/get-combo-diagnosa-pengkajian?kodeDiagnosa=' + e).then(function(dat) {
        //             debugger
        //             $scope.listDiagnosa = dat.data.diagnosa
        //         })
        //     } else {
        //         loadCombo()
        //     }
        // })

        function loadCombo() {
            // medifirstService.get('emr/get-combo-diagnosa-pengkajian?').then(function(dat) {
            //     $scope.listDiagnosa = dat.data.diagnosa
            // })
            medifirstService.getPart("emr/get-combo-diagnosa-pengkajian", true, true, 10).then(function(data) {
                $scope.listDiagnosa = data;
           }); 
           medifirstService.get('emr/get-combo?').then(function(dat) {
            $scope.listDokter = dat.data.dokter;
            var defaultDokter = $scope.listDokter.find(function(dokter) {
                return dokter.id === 50491;
            });
            if (defaultDokter) {
                $scope.item.obj[1501] = defaultDokter;
            }
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
                $scope.cc.tglLahir = chacePeriode[14]
                $scope.cc.norec_emr = '-'
                $scope.cc.jenisemr = "pengkajiangizi"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                // $scope.item.obj[1499] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD')
                $scope.item.obj[1500] = moment($scope.now).format('HH:mm')
                $scope.listKesadaran = [
                    { text: "Compos Mentis", value: 1 },
                    { text: "Apatis", value: 2 },
                    { text: "Delirium", value: 3 },
                    { text: "Somnolent", value: 4 },
                    { text: "Sopor", value: 5 },
                    { text: "Semi Coma", value: 6 },
                    { text: "Coma", value: 7 }
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
                init()
                cekVitalSign()
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajiangizi", true).then(function(dat) {
                $scope.isRouteLoading = false
                debugger
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'pengkajiangizi') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 890;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } 
                    // else {
                        // cekDiagnosa()
                    // }
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
                $scope.item.obj[1499] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                // else {
                    // cekDiagnosa()
                // }
                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                debugger
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[1499] = moment($scope.item.obj[1499]).format('YYYY-MM-DD HH:mm')
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1501") {
                            debugger
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1168") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "890") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "891") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1259") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6362") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6366") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6367") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "6368") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        // if (dataLoad[i].type == "combobox") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        // }
                        // if (dataLoad[i].type == "photo") {
                        //     $scope.user.poto = dataLoad[i].value
                        // }
                        // if (dataLoad[i].emrdfk == "1188") {
                        //     debugger
                        //     // totalNilai = dataLoad[i].value
                        //     // $scope.item.obj[1188] = parseInt(dataLoad[i].value)
                        //     totalcost[0].value = dataLoad[i].value
                        // }
                    }

                }
                console.log($scope.item.obj[1501])
                medifirstService.get('report/create-qr?idPegawai=' + $scope.item.obj[1501].id).then(function (et) {
                    console.log(et.data); // Tambahkan ini untuk melihat respons
                    $scope.item.qr = et.data.data;
                }).catch(function (error) {
                    console.error('Error:', error); // Tangani kesalahan
                });
            })
            cekVitalSign()
        }
        $scope.Save = function() {
            debugger
            var user = medifirstService.getPegawaiLogin();
            // $scope.item.obj[1499] = moment($scope.now).format('YYYY-MM-DD')
            $scope.item.obj[1499] = moment($scope.item.obj[1499]).format('YYYY-MM-DD HH:mm')
            $scope.item.obj[1500] = moment($scope.now).format('HH:mm:ss')
            $scope.item.obj[1234] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 1501) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })
                    } else if (arrobj[i] == 1168) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1259) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }
            // if (totalcost[0].value != "") {
            //     arrSave.push ({ id: "1188", values: totalcost[0].value})
            // }
            $scope.cc.jenisemr = 'pengkajiangizi'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-new', jsonSave).then(function (e) {
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
        $scope.Cetak = function () {
            debugger
            if (nomorEMR == '') return
            var arrPush = []
            for (var i = 1147; i <= 1236 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
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

                var nama = $scope.cc.namapasien
                var nocm = $scope.cc.nocm
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan

            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["dataLoad","nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan"],
                "paramValue": [arrPush,nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan],
                "paramType" : ["","","","","","","","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    //this.response is what you're looking for
                    // handler(this.response);
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                    debugger;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }
            // set `Content-Type` header
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';
            // send rquest with JSON payload
            xhr.send(JSON.stringify(data));	
        }
        function cekVitalSign() {
            medifirstService.get('emr/get-vital-sign-pengkajian?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                if (dat.data.length > 0) {
                    for (let i = 0; i < dat.data.length; i++) {
                        if (dat.data[i].caption == 'Tekanan Darah') {
                            $scope.item.obj[1169] = dat.data[i].value
                        } else if (dat.data[i].caption == 'TInggi badan') {
                            $scope.item.obj[1174] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Berat Badan') {
                            $scope.item.obj[1175] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Suhu') {
                            $scope.item.obj[1172] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Nadi') {
                            $scope.item.obj[1170] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Pernapasan') {
                            $scope.item.obj[1173] = dat.data[i].value
                        }
                    }
                }
            })
        }
        // function cekDiagnosa() {
        //     medifirstService.get('emr/get-diagnosa-from-pengkajian-mata?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
        //         debugger
        //         $scope.item.obj[1149] = { namadiagnosa: dat.data[0].value }
        //     })
        // }
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

        $scope.Clear = function () {
            $scope.item.obj[6357] = undefined
            $scope.item.obj[6358] = undefined
            $scope.item.obj[6359] = undefined
            $scope.item.obj[6360] = undefined
            $scope.item.obj[6361] = undefined
            $scope.item.obj[6362] = undefined
            $scope.item.obj[6363] = undefined
            $scope.item.obj[6364] = undefined
            $scope.item.obj[6365] = undefined
            // $scope.item.obj[6366] = undefined
            // $scope.item.obj[6367] = undefined
            // $scope.item.obj[6368] = undefined\
            $scope.item.obj[6369] = undefined
            $scope.item.obj[6431] = undefined
            $scope.dataSelected = undefined
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
        loadVitalSign()
            function loadVitalSign() {
                medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMR, true).then(function (dat) {
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (dataLoad[i].emrdfk == 4241) {
                            $scope.item.obj[6357] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4246) {
                            $scope.item.obj[6358] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4244) {
                            $scope.item.obj[6359] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4245) {
                            $scope.item.obj[6360] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 116065) {
                            $scope.item.obj[6361] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 116066) {
                            $scope.item.obj[6363] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 116064) {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[6362] = { value: res[0], text: res[1] }
                        }
                        if (dataLoad[i].emrdfk == 4243) {
                            $scope.item.obj[6364] = dataLoad[i].value
                        }
                        if (dataLoad[i].emrdfk == 4242) {
                            $scope.item.obj[6365] = dataLoad[i].value
                        }
                        // if (dataLoad[i].emrdfk == 116066) {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     $scope.item.obj[1901300130] = { value: res[0], text: res[1] }
                        // }
                        // if (dataLoad[i].emrdfk == 6366) {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     $scope.item.obj[6366] = { value: res[0], text: res[1] }
                        // }
                        // if (dataLoad[i].emrdfk == 6367) {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     $scope.item.obj[6367] = { value: res[0], text: res[1] }
                        // }
                        // if (dataLoad[i].emrdfk == 6368) {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     $scope.item.obj[6368] = { value: res[0], text: res[1] }
                        // }
                    }
                })
            }
            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        {
                            "field": "no",
                            "title": "No ",
                            "width": "15px"
                        },

                        {
                            "field": "tglemr",
                            "title": "Tgl EMR",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "tglregistrasi",
                            "title": "Tgl Registrasi",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                        },
                        {
                            "field": "noregistrasifk",
                            "title": "No Registrasi",
                            "width": "50px",
                        },
                        {
                            "field": "noemr",
                            "title": "No EMR Vital Sign",
                            "width": "85px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Pegawai",
                            "width": "100px"
                        },
                        {
                            "field": "namaruangan",
                            "title": "Nama Ruangan",
                            "width": "100px"
                        }
                    ]
            };
    }
])
})