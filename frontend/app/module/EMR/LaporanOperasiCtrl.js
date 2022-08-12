define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanOperasiCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, cacheHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 516
            var dataLoad = []
            $scope.item = {};
            $scope.item.objcbo = []
            $scope.isCetak = true
            $scope.isKembali = true
            var paramSearch = ''
            $scope.user = {};
            $scope.istempatLaporan = true;
            LoadCacheHelper();

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
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=dinamis", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false
                    var nomorEMRSS = ''
                    cacheHelper.set('cacheEmrLaporanOperasi', undefined)
                    if (dat.data.data.length > 0) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            const element = dat.data.data[i];
                            element.no = i + 1
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '516'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        nomorEMRSS = '-'
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = '516'
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    }
                });

                function setobjectToModel(nomorEMRSS, emrfk) {
                    if (nomorEMRSS == '-') {
                        medifirstService.get("emr/get-rekam-medis-dynamic-polri?emrid=" + emrfk).then(function (e) {
                            $scope.listData = e.data
                            $scope.item.title = e.data.title
                            $scope.item.classgrid = e.data.classgrid

                            $scope.cc.emrfk = emrfk
                            $scope.item.objcbo = []
                            for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                                if (e.data.kolom1[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom1[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }

                            for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                                if (e.data.kolom2[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom2[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }
                            for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                                if (e.data.kolom3[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom3.child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom3[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }

                        })
                    } else {
                        var chekedd = false
                        //  medifirstService.get("emr/get-emr-transaksi-detail?noemr="+$state.params.nomorEMR, true).then(function(dat){
                        medifirstService.get("emr/get-rekam-medis-dynamic-polri?emrid=" + emrfk).then(function (e) {
                            $scope.listData = e.data
                            $scope.item.title = e.data.title
                            $scope.item.classgrid = e.data.classgrid

                            $scope.cc.emrfk = emrfk

                            $scope.item.objcbo = []
                            for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                                if (e.data.kolom1[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom1[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }
                            for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                                if (e.data.kolom2[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom2[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }
                            for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                                if (e.data.kolom3[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom3[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom3[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }
                            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                                $scope.item.obj = []
                                $scope.item.obj2 = []
                                dataLoad = dat.data.data
                                for (var i = 0; i <= dataLoad.length - 1; i++) {
                                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                                        if (dataLoad[i].type == "textbox") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                        }
                                        if (dataLoad[i].type == "textbox2") {
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
                                            $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD HH:mm:ss'); //new Date(dataLoad[i].value)
                                        }
                                        if (dataLoad[i].type == "time") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('HH:mm'); //new Date(dataLoad[i].value)
                                        }
                                        if (dataLoad[i].type == "date") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD'); //new Date(dataLoad[i].value)
                                        }

                                        if (dataLoad[i].type == "checkboxtextbox") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                                        }
                                        if (dataLoad[i].type == "textarea") {
                                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                        }
                                        if (dataLoad[i].type == "combobox") {
                                            var str = dataLoad[i].value
                                            var res = str.split("~");
                                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                                        }
                                    }

                                }
                            })


                            // for (var i = 0; i < dat.data.data.length - 1; i++) {
                            //     switch(dat.data.data[i].type) {
                            //       case "textbox":
                            //         this.item.obj[dat.data.data[i].emrdfk] = dat.data.data[i].value
                            //         // $scope.item.obj[dat.data.data[i].emrdfk] = dat.data.data[i].value
                            //         // break;

                            //         // break;
                            //       default:
                            //         // code block
                            //     }
                            // }
                            // })


                        });
                    }
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
            }

            $scope.kembali = function () {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.cc.norec,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.txt_change = function (index) {
                $scope.item.txt[index] = "asdasdad"
            };
            // $scope.kembali = function () {

            // }


            $scope.checkClick = function (data) {

            }




            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'dinamis'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave //$scope.item.obj
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    loadGrid()

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });

                function loadGrid() {
                    $rootScope.loadHistoryEMRBedah();
                }
            }

            $scope.cetakPdf = function () {
                debugger
                if (nomorEMR == '') return
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 149; i <= 217 - 1; i++) {
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
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "nocm", "nomorEMR", "dataLoad"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap, $scope.cc.noregistrasi, nomorEMR, arrPush],
                    "paramType": ["", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
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
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    // xhr.open('POST', 'http://192.168.0.62:1002/generic/report/bedah2.pdf');
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bedah2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    // xhr.open('POST', 'http://192.168.88.56:8797/generic/report/bedah2.pdf');
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bedah2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    // xhr.open('POST', '/jasper1/generic/report/bedah2.pdf');
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bedah2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    // xhr.open('POST', '/jasper1/generic/report/bedah2.pdf');
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bedah2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bedah2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

        }
    ]);
});