define(['initialize'], function(initalize) {
    'use strict';
    initalize.controller('KetersediaanKamarRSCtrl', ['$mdDialog','ModelItem', 'CacheHelper', '$scope','$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, ModelItem, cacheHelper, $scope, $state, medifirstService, dateHelper, $window) {
        $scope.item = {}
        loadKelas()
        loadCombo()
        let tampungidruangan = '';

        var ppkRumahSakit = ''
        medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
            ppkRumahSakit = dat.data

        })

        function loadKelas() {
            medifirstService.get('bridging/bpjs/aplicaresws/rest/ref/kelas').then(function(dat) {
                if (dat.data.metadata.message == 'OK') {
                    $scope.listKelas = dat.data.response.list
                } else {
                    toastr.error('Bridging Gagal !')
                    return
                }
            })
        }
        function loadCombo() {
            medifirstService.get('rawatinap/get-ruanganranap-for-aplicare').then(function(dat) {
                $scope.listRuangan = dat.data
            })
        }
        $scope.cari = function() {
            loadData()
        }
        function loadData() {
            medifirstService.get('bridging/bpjs/aplicaresws/rest/bed/read/'+ppkRumahSakit+'/1/1000').then(function(dat) {
                let data = dat.data.response.list
                let tampungdata = [];
                if (dat.data.metadata.message == 'OK') {
                    if ($scope.item.kelas != undefined) {
                        for(let i = 0; i < data.length; i++) {
                            if (data[i].kodekelas == $scope.item.kelas.kodekelas) {
                                tampungdata.push(data[i])
                            }
                        }
                        data = tampungdata
                    }
                    $scope.sourceKamarRS = new kendo.data.DataSource({
                        data: data,
                        schema: {
                            model: {

                            }
                        },
                        pageSize: 200,
                        total: data.length,
                        serverPaging: false,
                    })
                }
            })
        }
        $scope.columnKamarRS = {
            selectable: 'row',
            pageable: true,
            columns: [
                {
                    "field": "namaruang",
                    "title": "Nama Ruangan",
                    "width": "150px"
                },
                {
                    "field": "namakelas",
                    "title": "Nama Kelas",
                    "width": "150px"
                },
                {
                    "field": "kapasitas",
                    "title": "Kapasitas",
                    "width": "150px"
                },
                {
                    "field": "tersedia",
                    "title": "Tersedia",
                    "width": "150px"
                },
                {
                    "field": "tersediawanita",
                    "title": "Tersedia Wanita",
                    "width": "150px"
                },
                {
                    "field": "tersediapria",
                    "title": "Tersedia Pria",
                    "width": "150px"
                },
                {
                    "field": "tersediapriawanita",
                    "title": "Tersedia Pria Dan Wanita",
                    "width": "150px"
                },
                {
                    "field": "lastupdate",
                    "title": "Last Update",
                    "width": "150px"
                },
                {
                    "title": "Action",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"deleteKamar(dataItem)\"  style=\"margin:0 0 5px\">#:  'Hapus' #</button> ",
                }
            ]
        }
        $scope.deleteKamar = function(dataItem) {
            let dataSend = {
                "json": {
                    "kodekelas": dataItem.kodekelas,
                    "koderuang": dataItem.koderuang
                }
            }
            medifirstService.post('bridging/bpjs/aplicaresws/rest/bed/delete/'+ppkRumahSakit, dataSend).then(function(e) {
                if (e.data.metadata.message == "Data berhasil dihapus.") {
                    loadData()
                } else {
                    toastr.error('GAGAL !')
                    return
                }
            })
        }
        $scope.create = function() {
            $scope.popUpCreateKamar.center().open()
        }
        $scope.createRuangAplicare = function() {
            let dataSend = {
                "json": {
                    "kodekelas": $scope.item.kelas1.namaexternal,
                    "koderuang": $scope.item.ruangan.id,
                    "namaruang": $scope.item.ruangan.namaruangan,
                    "kapasitas": $scope.item.kapasitas,
                    "tersedia": $scope.item.tersedia,
                    "tersediapria": 0,
                    "tersediawanita": 0,
                    "tersediapriawanita": $scope.item.tersedia,
                }
            }
            medifirstService.post('bridging/bpjs/aplicaresws/rest/bed/create/'+ppkRumahSakit, dataSend).then(function(e) {
                if(e.data.metadata.message == "Data berhasil disimpan.") {
                    loadData()
                    delete $scope.item.kelas1
                    delete $scope.item.ruangan
                    delete $scope.item.kapasitas
                    delete $scope.item.tersedia
                }
            })
        }
        $scope.update = function () {
            var ppkRumahSakit = ''
            medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                ppkRumahSakit = dat.data
                updateKetersediaanTT(ppkRumahSakit)

            })
        }
        function loadRuangKelas(ruang) {
            medifirstService.get('rawatinap/get-kelasruangan-for-aplicare?idruangan=' + ruang.id).then(function(dat) {
                $scope.listKelas1 = dat.data
            })
        }
        function loadJumlahTT(kelas) {
            medifirstService.get('rawatinap/get-jumlahtt-for-aplicare?idRuangan=' + tampungidruangan + "&idKelas=" + kelas.id).then(function(dat) {
                $scope.item.kapasitas = dat.data[0].kapasitas
                $scope.item.tersedia = dat.data[0].tersedia
            })
        }
        function updateKetersediaanTT(ppkRumahSakit) {
             
            medifirstService.get("bridging/bpjs/aplicaresws/get-tt?namaruangan=&kelas=").then(function (e) {
                var res = e.data
                for (var i = 0; i < res.length; i++) {
                    const element = res[i]
                    var tersedia = (element.tersedia.valueOf() < 0 ? 0 : element.tersedia);
                    var tersediapria = (element.tersediapria.valueOf() < 0 ? 0 : element.tersediapria);
                    var tersediawanita = (element.tersediawanita.valueOf() < 0 ? 0 : element.tersediawanita);
                    var tersediapriawanita = (element.tersediapriawanita.valueOf() < 0 ? 0 : element.tersediapriawanita);
                    let data = {
                        "json": {
                            "kodekelas": element.kodekelas,
                            "koderuang": element.koderuang,
                            "namaruang": element.namaruang,
                            "kapasitas": element.kapasitas,
                            "tersedia": tersedia,
                            "tersediapria": tersediapria,
                            "tersediawanita": tersediawanita,
                            "tersediapriawanita": tersediapriawanita,
                        }
                    }
                    medifirstService.postNonMessage('bridging/bpjs/aplicaresws/rest/bed/update2/' + ppkRumahSakit, data).then(function (e) {
                        if (e.data.metadata.code == 1) {
                            // toastr.success(e.data.metadata.message, 'Info')
                        } else {
                            // toastr.error(e.data.metadata.message, 'Info')
                        }
                        // $scope.isRouteLoading = false
                    }, function (error) {
                        // $scope.isRouteLoading = false
                    })
                }
            })

        }
        $scope.$watch('item.ruangan', function(e) {
            if (e != undefined) {
                tampungidruangan = $scope.item.ruangan.id
                loadRuangKelas($scope.item.ruangan)
            }
        })
        $scope.$watch('item.kelas1', function(e) {
            if (e != undefined) {
                loadJumlahTT($scope.item.kelas1)
            }
        })
    }
])
})