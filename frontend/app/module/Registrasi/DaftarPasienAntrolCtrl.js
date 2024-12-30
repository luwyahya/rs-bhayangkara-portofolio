define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienAntrolCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService', 'CacheHelper',
    function ($scope, dateHelper, $http, $state, medifirstService, cacheHelper) {
        $scope.now = new Date();
        $scope.item = {};
        $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
        $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')
        $scope.isRouteLoading = false;
        $scope.dataPasienSelected = {};
        let dataAntrol = [];
        var a = 0;
        var yeuh =0;
        var awal =0;
        yeuh =a;
        awal =a;
        var lengthakhir = 0;
        loadCombo();

        function loadCombo() {
            $scope.listTaskId = [
                {id: 1, taskid: "1"},
                {id: 2, taskid: "2"},
                {id: 3, taskid: "3"},
                {id: 4, taskid: "4"},
                {id: 5, taskid: "5"},
                {id: 6, taskid: "6"},
                {id: 7, taskid: "7"},
            ]
        }
        $scope.search = function() {
            loadData()
        }
        function loadData() {
            $scope.isRouteLoading = true
            let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
            let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
            let taskId = "";
            let noregistrasi = "";
            let nocm = "";
            if ($scope.item.taskid != undefined) {
                taskId = "&taskId=" + $scope.item.taskid.taskid;
            }
            if ($scope.item.noregistrasi != undefined) {
                taskId = "&noregistrasi=" + $scope.item.noregistrasi;
            }
            if ($scope.item.nocm != undefined) {
                taskId = "&nocm=" + $scope.item.nocm;
            }
            medifirstService.get('registrasi/get-pasien-antrol?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + taskId + noregistrasi + nocm).then(function(dat) {
                dataAntrol = dat.data
                a = 0;
                yeuh =0;
                awal =0;
                
                yeuh =a;
                awal =a;
                lengthakhir = dataAntrol.length;
                $scope.isRouteLoading = false
                $scope.dataPasienAntrol = new kendo.data.DataSource({
                    data: dat.data,
                    pageSize: 200,
                    total: dat.data.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    }
                })
            })
        }
        $scope.columnPasienAntrol = {
            selectable: 'row',
            pageable: true,
            columns: [
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px"
                },
                {
                    "field": "istaskantrol",
                    "title": "Task Id",
                    "width": "30px"
                },
                {
                    "field": "nocm",
                    "title": "No CM",
                    "width": "70px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "140px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px"
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "150px"
                },
                {
                    "field": "nosep",
                    "title": "No Sep",
                    "width": "170px"
                },
                {
                    "field": "isobat",
                    "title": "Ada Obat",
                    "width": "70px",
                    "template": '# if( isobat==false) {# Tidak Ada Obat # } else {# Ada Obat #} #'
                },
                {
                    "field": "response",
                    "title": "Response",
                    "width": "170px"
                }
            ],
            toolbar: ["excel"],
            excel: {
                fileName: "Data_Pasien_Antrol.xlsx",
                filterable: true,
                allPages: true
            }
        }
        $scope.kirimUlang = function () {
            var a = 0;
            var yeuh =0;
            var awal =0;
            
            yeuh =a;
            awal =a;
            var lengthakhir = dataAntrol.length;
            if (lengthakhir == 0) {
                toastr.error('Data Tidak Ada !')
                return
            }
            let i = 0;
            sendAntrol(i,yeuh,awal,lengthakhir)
        }
        $scope.kirimulang = function() {
            var a = 0;
            var yeuh =0;
            var awal =0;
            
            yeuh =a;
            awal =a;
            var lengthakhir = dataAntrol.length;
            for(let i = 0; i < dataAntrol.length; i++) {
                if (dataAntrol[i].istaskantrol == 3) {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 1200)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 4,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                        var a = new Date(dataAntrol[i].tglinsert)
                        var c = moment(a).add('second', 1800)._d;
                        var x = Date.parse(c);
                        let data = {
                            kodebooking: dataAntrol[i].kodebookingantrol,
                            taskid: 5,
                            waktu: x
                        }
                        var objSave = {
                            data: data
                        }
                        medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                            yeuh =yeuh+1;
                            var ini = (yeuh/lengthakhir)*100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal +1;
                            var id = setInterval(frame, 1);
                            function frame() {
                                if (width >= ini) {
                                    clearInterval(id);
                                } else {
                                    width++;
                                    elem.style.width = width + "%";
                                    elem.innerHTML = width + "%";
                                }
                            }
                        })
                    })
                } else if (dataAntrol[i].istaskantrol == 4) {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 1800)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 5,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                            yeuh =yeuh+1;
                            var ini = (yeuh/lengthakhir)*100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal +1;
                            var id = setInterval(frame, 1);
                            function frame() {
                                if (width >= ini) {
                                    clearInterval(id);
                                } else {
                                    width++;
                                    elem.style.width = width + "%";
                                    elem.innerHTML = width + "%";
                                }
                            }
                    })
                } else if (dataAntrol[i].istaskantrol == 5) {
                            yeuh =yeuh+1;
                            var ini = (yeuh/lengthakhir)*100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal +1;
                            var id = setInterval(frame, 1);
                            function frame() {
                                if (width >= ini) {
                                    clearInterval(id);
                                } else {
                                    width++;
                                    elem.style.width = width + "%";
                                    elem.innerHTML = width + "%";
                                }
                            }
                } else if (dataAntrol[i].istaskantrol == 6) {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 2400)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 7,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                            yeuh =yeuh+1;
                            var ini = (yeuh/lengthakhir)*100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal +1;
                            var id = setInterval(frame, 1);
                            function frame() {
                                if (width >= ini) {
                                    clearInterval(id);
                                } else {
                                    width++;
                                    elem.style.width = width + "%";
                                    elem.innerHTML = width + "%";
                                }
                            }
                    })
                } else {
                            yeuh =yeuh+1;
                            var ini = (yeuh/lengthakhir)*100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal +1;
                            var id = setInterval(frame, 1);
                            function frame() {
                                if (width >= ini) {
                                    clearInterval(id);
                                } else {
                                    width++;
                                    elem.style.width = width + "%";
                                    elem.innerHTML = width + "%";
                                }
                            }
                }
            }
        }
        function sendAntrol(i,yeuh,awal,lengthakhir) {
            $scope.isRouteLoading = false;
            if (i < lengthakhir) {
                $scope.isRouteLoading = true;
                if (dataAntrol[i].istaskantrol == 3) {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 600)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 4,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                        var a = new Date(dataAntrol[i].tglinsert)
                        var c = moment(a).add('second', 1200)._d;
                        var x = Date.parse(c);
                        let data = {
                            kodebooking: dataAntrol[i].kodebookingantrol,
                            taskid: 5,
                            waktu: x
                        }
                        var objSave = {
                            data: data
                        }
                        medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                            if (dataAntrol[i].isobat == 'true') {
                                var a = new Date(dataAntrol[i].tglinsert)
                                var c = moment(a).add('second', 1800)._d;
                                var x = Date.parse(c);
                                let data = {
                                    kodebooking: dataAntrol[i].kodebookingantrol,
                                    taskid: 6,
                                    waktu: x
                                }
                                var objSave = {
                                    data: data
                                }
                                medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                                    var a = new Date(dataAntrol[i].tglinsert)
                                    var c = moment(a).add('second', 2400)._d;
                                    var x = Date.parse(c);
                                    let data = {
                                        kodebooking: dataAntrol[i].kodebookingantrol,
                                        taskid: 7,
                                        waktu: x
                                    }
                                    var objSave = {
                                        data: data
                                    }
                                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                                        i = i + 1;
                                        sendAntrol(i,yeuh,awal,lengthakhir)
                                        
                                    })
                                })
                            } else {
                                i = i + 1;
                                sendAntrol(i,yeuh,awal,lengthakhir)
                            }
                        })
                    })
                } else if (dataAntrol[i].istaskantrol == 4) {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 1200)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 5,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                        if (dataAntrol[i].isobat == 'true') {
                            var a = new Date(dataAntrol[i].tglinsert)
                            var c = moment(a).add('second', 1800)._d;
                            var x = Date.parse(c);
                            let data = {
                                kodebooking: dataAntrol[i].kodebookingantrol,
                                taskid: 6,
                                waktu: x
                            }
                            var objSave = {
                                data: data
                            }
                            medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                                var a = new Date(dataAntrol[i].tglinsert)
                                var c = moment(a).add('second', 2400)._d;
                                var x = Date.parse(c);
                                let data = {
                                    kodebooking: dataAntrol[i].kodebookingantrol,
                                    taskid: 7,
                                    waktu: x
                                }
                                var objSave = {
                                    data: data
                                }
                                medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                                    i = i + 1;
                                    sendAntrol(i,yeuh,awal,lengthakhir)
                                })
                            })
                        } else {
                            i = i + 1;
                            sendAntrol(i,yeuh,awal,lengthakhir)
                        }
                    })
                } else if (dataAntrol[i].istaskantrol == 5 && dataAntrol[i].isobat == 'true') {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 1800)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 6,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                        var a = new Date(dataAntrol[i].tglinsert)
                        var c = moment(a).add('second', 2400)._d;
                        var x = Date.parse(c);
                        let data = {
                            kodebooking: dataAntrol[i].kodebookingantrol,
                            taskid: 7,
                            waktu: x
                        }
                        var objSave = {
                            data: data
                        }
                        medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                            i = i + 1;
                            sendAntrol(i,yeuh,awal,lengthakhir)
                        })
                    })
                } else if (dataAntrol[i].istaskantrol == 6) {
                    var a = new Date(dataAntrol[i].tglinsert)
                    var c = moment(a).add('second', 1200)._d;
                    var x = Date.parse(c);
                    let data = {
                        kodebooking: dataAntrol[i].kodebookingantrol,
                        taskid: 7,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskIdRombongan', objSave).then(function(e) {
                        i = i + 1;
                        sendAntrol(i,yeuh,awal,lengthakhir)
                    })
                } else {
                    i = i + 1;
                    sendAntrol(i,yeuh,awal,lengthakhir)
                }
            } else {
                loadData()
            }
        }
    }
])
})