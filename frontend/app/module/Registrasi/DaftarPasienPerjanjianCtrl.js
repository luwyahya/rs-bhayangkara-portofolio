define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienPerjanjianCtrl', ['CacheHelper', '$rootScope', '$scope', '$state', 'MedifirstService', '$mdDialog',
        function (cacheHelper, $rootScope, $scope, $state, medifirstService, $mdDialog) {
            //function (saveToWindow, $rootScope, $scope, ModelItem, $state, dateHelper, socket, $mdDialog, window, cetakHelper, medifirstService, cacheHelper, $q) {
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = false;
            $rootScope.isOpen = true;
            $scope.item = {};
            $scope.item.isTelemedicine = false;
            $scope.item.isSedangDisiapkan = false;
            $scope.item.isMcu = false;
            $scope.istempatLaporan = true;
            var dateNow = new Date();
            dateNow.setDate(dateNow.getDate() + 1);
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.now = new Date();
            $scope.from = $scope.now;
            $scope.until = $scope.now;

            LoadCombo();
            loadCache()
            LoadData();



            $scope.listStatus = [
                { id: 1, nama: 'Confirm' }, //#
                { id: 2, nama: 'Reservasi' },
            ]



            $scope.kodeReservasi = '';
            $scope.Column = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarReservasiOnline.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "Daftar Reservasi Online",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                reorderable: true,
                resizable: true,
                pageable: true,
                scrollable: true,
                columns: [{
                    field: "isjanjidisiapkan",
                    title: "Dikirim",
                    width: 100,
                    template: "<button class=\"k-button custom-button\" ng-click=\"KlikCuyy(dataItem)\" style=\"margin:0 0 5px\">#: isjanjidisiapkan #</button>",
                    attributes: {
                        class: "#=isjanjidisiapkan != 'Belum' ? 'red' : 'blue' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                }, {
                    field: "statuscekin",
                    title: "Chekin JKN",
                    width: 100,
                    template: "<button class=\"k-button custom-button\" ng-click=\"KlikChekin(dataItem)\" style=\"margin:0 0 5px\">#: statuscekin #</button>",
                    attributes: {
                        class: "#=statuscekin != 'Belum Chekin' ? 'red' : 'blue' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                }, {
                    field: "noantrianpoli",
                    title: "No Antrian Poli",
                    width: 100
                }, {
                    field: "noreservasi",
                    title: "Kode Reservasi",
                    width: 100
                }, {
                    field: "noregistrasi",
                    title: "Noregistrasi",
                    width: 100,
                    attributes: {
                        class: "#=flag == true ? 'blue' : 'red' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                }, {
                    field: "nocm",
                    title: "No RM",
                    width: 50
                }, {
                    field: "tanggalreservasi",
                    title: "Tanggal Reservasi",

                    template: "<span class='style-left'>{{formatTanggal('#: tanggalreservasi #')}}</span>",
                    width: 120
                }, {
                    field: "namapasien",
                    title: "Nama Pasien",
                    width: 200
                }, {
                    field: "namaruangan",
                    title: "Ruangan Tujuan",
                    width: 150
                },
                {
                    field: "kelompokpasien",
                    title: "Tipe",
                    width: 100
                }, {
                    field: "namarekanan",
                    title: "Rekanan",
                    width: 100
                }, {
                    field: "status",
                    title: "Status",
                    width: 60
                },
                {
                    field: "nohp",
                    title: "Nomor Telepon",
                    width: 200
                },
                {
                    field: "alamatlengkap",
                    title: "Alamat",
                    width: 200
                },
                {
                    field: "dokter",
                    title: "Dokter",
                    width: 200
                },
                {
                    field: "tglinput",
                    title: "Tanggal Input",
                    width: 120,
                    template: "<span class='style-left'>{{formatTanggal('#: tglinput #')}}</span>",
                },
                {
                    field: "nobpjs",
                    title: "NoBPJS",
                    width: 200
                },
                {
                    field: "norujukan",
                    title: "NoRujukan",
                    width: 200
                },
                {
                    field: "asalrujukan",
                    title: "Asal Rujukan",
                    width: 200
                },
                {
                    field: "nimmaba",
                    title: "NIM",
                    width: 200
                },
                {
                    field: "nm_fakultas",
                    title: "Fakultas",
                    width: 200
                },
                {
                    field: "prodi",
                    title: "Prodi",
                    width: 200
                },
                ]
            };
            var a = 0;
            var yeuh = 1;
            var awal = 1;
            var j = 0;
            $scope.CekNoRujukanAll = function (j) {
                yeuh = j;
                awal = j;
                var lengthakhir = $scope.dataExcel.data.length;
                var lop = true;
                for (; j < $scope.dataExcel.data.length; j++) {
                    if ($scope.dataExcel.data[j].kelompokpasien != 'BPJS') {
                        yeuh = j + 1;
                        var ini = (yeuh / lengthakhir) * 100;
                        var elem = document.getElementById("myBar");
                        var width = 0;
                        awal = awal + 1;
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
                        a = a + 1;
                        var json = {
                            'norec': $scope.dataExcel.data[j].norec,
                            'flag': true
                        }
                        medifirstService.post('registrasi/update-flag-apr', json).then(function (e) {
                            if (e.status === 201) {
                                // loadData()
                                $scope.CekNoRujukanAll(j + 1)
                            }
                        })
                    } else {
                        if ($scope.dataExcel.data[j].norujukan == "Pasca Ranap") {
                            yeuh = j + 1;
                            var ini = (yeuh / lengthakhir) * 100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal + 1;
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
                            a = a + 1;
                            var json = {
                                'norec': $scope.dataExcel.data[j].norec,
                                'flag': true
                            }
                            medifirstService.post('registrasi/update-flag-apr', json).then(function (e) {
                                if (e.status === 201) {
                                    // loadData()
                                    $scope.CekNoRujukanAll(j + 1)
                                }
                            })
                        } else if ($scope.dataExcel.data[j].norujukan == undefined || $scope.dataExcel.data[j].norujukan == null || $scope.dataExcel.data[j].norujukan == "") {
                            yeuh = j + 1;
                            var ini = (yeuh / lengthakhir) * 100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal + 1;
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
                            a = a + 1;
                            $scope.CekNoRujukanAll(j + 1)
                        } else {
                            var asalrujuk = 'rs';
                            if ($scope.dataExcel.data[j].asalrujukan == 'Rumah sakit') {
                                asalrujuk = 'rs';
                            } else if ($scope.dataExcel.data[j].asalrujukan == 'Puskesmas / Klinik') {
                                asalrujuk = 'pcare';
                            }
                            medifirstService.get("bridging/bpjs/get-rujukan-" + asalrujuk + "?norujukan=" + $scope.dataExcel.data[j].norujukan).then(function (e) {
                                lop = false
                                if (e.data.metaData == undefined) {
                                    $scope.CekNoRujukanAll(j + 1);
                                } else if (e.data.metaData == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
                                    $scope.CekNoRujukanAll(j);
                                } else if (e.data.metaData == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
                                    $scope.CekNoRujukanAll(j);
                                } else if (e.data.metaData.code == 500) {
                                    $scope.CekNoRujukanAll(j);
                                } else {
                                    $scope.CekNoRujukanAll(j + 1)
                                }
                                if (e.data.metaData.code === "200") {
                                    // for (var i = 0; i < e.data.response.rujukan.length; i++) {
                                    // if($scope.dataExcel.data[j].objectruanganlastfk == 132) {
                                    //     if($scope.dataExcel.data[j].kdinternalrujuk == e.data.response.rujukan[i].poliRujukan.kode) {
                                    //         var tglreg = new Date(moment($scope.dataExcel.data[j].tglregistrasi).format('MM/DD/YYYY'));
                                    //         var tglrujuk = new Date(moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY'));
                                    //         var difreg = getDifferenceInDays(tglreg, tglrujuk);

                                    //         function getDifferenceInDays(date1, date2) {
                                    //             const diffInMs = Math.abs(date2 - date1);
                                    //             return diffInMs / (1000 * 60 * 60 * 24);
                                    //         }

                                    //         if(difreg < 90) {
                                    //             var json = {
                                    //                 'norec_pa': $scope.dataExcel.data[j].norec_pa,
                                    //                 'norujukan': e.data.response.rujukan[i].noKunjungan,
                                    //                 'objectruanganrujukfk': $scope.dataExcel.data[j].objectruangnrujukfk
                                    //             }
                                    //             medifirstService.post('registrasi/update-norujukan', json).then(function (e) { 
                                    //                 if (e.status === 201) {
                                    //                     // loadData()
                                    //                 }
                                    //             })
                                    //         }
                                    //     }
                                    // } else 
                                    if ($scope.dataExcel.data[j].kdinternal == e.data.response.rujukan.poliRujukan.kode) {
                                        var tglreg = new Date(moment($scope.dataExcel.data[j].tanggalreservasi).format('MM/DD/YYYY'));
                                        // moment($scope.dataExcel.data[j].tglregistrasi).format('MM/DD/YYYY');
                                        var tglrujuk = new Date(moment(e.data.response.rujukan.tglKunjungan).format('MM/DD/YYYY'));
                                        // moment(e.data.response.rujukan[i].tglKunjungan).format('MM/DD/YYYY');
                                        var difreg = getDifferenceInDays(tglreg, tglrujuk);

                                        function getDifferenceInDays(date1, date2) {
                                            const diffInMs = Math.abs(date2 - date1);
                                            return diffInMs / (1000 * 60 * 60 * 24);
                                        }

                                        if (difreg < 89) {
                                            var json = {
                                                'norec': $scope.dataExcel.data[j].norec,
                                                'flag': true
                                            }
                                            medifirstService.post('registrasi/update-flag-apr', json).then(function (e) {
                                                if (e.status === 201) {
                                                    // loadData()
                                                }
                                            })
                                        }
                                    }
                                    // }
                                } else {
                                    toastr.error(e.data.metaData.message, 'Info');
                                }

                                $scope.isRouteLoading = false;
                                yeuh = j + 1;
                                var ini = (yeuh / lengthakhir) * 100;
                                var elem = document.getElementById("myBar");
                                var width = 0;
                                awal = awal + 1;
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
                                a = a + 1
                            }, function (err) {
                                $scope.isRouteLoading = false;
                            });
                        }
                    }

                    if (lop == true) {
                        if ((lengthakhir) == j + 1) {
                            debugger
                            $scope.LoadData();
                        } else {
                            break;
                        }
                    }
                }
            }

            $scope.formatTanggal = function (tanggal) {
                if (tanggal != 'null')
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-';
            }
            $scope.Page = {
                refresh: true //,
                //pageSizes: true//,
                //buttonCount: 5
            }

            function LoadCombo() {
                medifirstService.get("registrasi/get-combo-perjanjian").then(function (e) {
                    $scope.listRuangan = e.data.ruanganrajal
                })
            }
            $scope.findData = function () {
                // $scope.item.isTelemedicine = false
                // $scope.item.isSedangDisiapkan = false
                // $scope.item.isMcu = false
                LoadData()

            }
            $scope.KlikChekin = function (dataItem) {
                if (dataItem.statuscekin == "Sudah Chekin") {
                    toastr.error('Pasien ini sudah Chekin');
                    return
                }
                var json = {
                    'kodebooking': dataItem.noreservasi,
                    'waktu': new Date().getTime()
                }
                medifirstService.post('bridging/bpjs2/mjkn/antrian/CekinAntrian', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                        // loadRmPp(norec_pp);
                        // loadDaftarRmPp(noregistrasi);
                        LoadData();
                    }
                })
            }

            $scope.KlikCuyy = function (dataItem) {
                debugger
                var noregistrasi = dataItem.noregistrasi;
                if (dataItem.isjanjidisiapkan == "Batal") {
                    toastr.error('Pasien ' + dataItem.namapasien + '(' + dataItem.nocm + ')' + ' dengan kode reservasi ' + dataItem.noreservasi + ' dengan ruang tujuan ' + dataItem.namaruangan + ' batal melakukan perjanjian/pendaftaran.');
                    return
                }
                var cuyy
                if (dataItem.isjanjidisiapkan == "Sedang") {
                    cuyy = false
                } else {
                    cuyy = true
                }
                // var norec_ppc = ''
                // norec_ppc = $scope.item.norec_pp
                var json = {
                    'noregistrasi': noregistrasi,
                    'cuyy': cuyy
                }
                medifirstService.post('tatarekening/save-KlikCuyy', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                        // loadRmPp(norec_pp);
                        // loadDaftarRmPp(noregistrasi);
                        LoadData();
                    }
                })
            }

            $scope.cekTelemedicine = function (bool) {
                if (bool) {
                    $scope.item.isTelemedicine = true
                    LoadData()
                } else {
                    $scope.item.isTelemedicine = false
                    LoadData()
                }
            }

            $scope.cekSedangDisiapkan = function (bool) {
                if (bool) {
                    $scope.item.isSedangDisiapkan = true
                    LoadData()
                } else {
                    $scope.item.isSedangDisiapkan = false
                    LoadData()
                }
            }

            $scope.cekMcu = function (bool) {
                if (bool) {
                    $scope.item.isMcu = true
                    LoadData()
                } else {
                    $scope.item.isMcu = false
                    LoadData()
                }
            }


            $scope.LoadData = function () {
                LoadData();
            }

            function LoadData() {
                debugger
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD');
                if ($scope.tglinput == undefined || $scope.tglinput == null) {
                    var tglInput = undefined;
                } else {
                    var tglInput = moment($scope.tglinput).format('YYYY-MM-DD');
                }

                var status = "";
                if ($scope.status != undefined) {
                    status = $scope.status.nama;
                }
                var ruanganId = "";
                if ($scope.namaRuangan != undefined) {
                    ruanganId = $scope.namaRuangan.id;
                }
                var namapasienpm = ''
                var namapasienapr = ''
                if ($scope.namaPasien != undefined) {
                    namapasienpm = $scope.namaPasien;
                    namapasienapr = $scope.namaPasien;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: tglInput,
                    3: ruanganId,
                    4: namapasienpm,
                    5: namapasienapr,
                    6: $scope.kodeReservasi,
                    7: status,
                    8: $scope.item.isTelemedicine,
                    9: $scope.item.isSedangDisiapkan,
                    10: $scope.item.isMcu
                }
                cacheHelper.set('DaftarPasienPerjanjian', chacePeriode);


                medifirstService.get("registrasi/get-data-pasien-reservasi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&kdReservasi=" + $scope.kodeReservasi +
                    "&statusRev=" + status +
                    "&namapasienpm=" + $scope.namaPasien +
                    "&nocm=" + $scope.noCm +
                    "&ruanganId=" + ruanganId +
                    "&istelemedicine=" + $scope.item.isTelemedicine +
                    "&issedangdisiapkan=" + $scope.item.isSedangDisiapkan +
                    "&ismcu=" + $scope.item.isMcu +
                    "&tglInput=" + tglInput
                    // + "&namapasienapr=" + $scope.namaPasien
                ).then(function (data) {
                    $scope.isRouteLoading = false;

                    $scope.listPasien = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
                        pageSize: 1000,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.dataExcel = data.data;
                })
            }

            function loadCache() {
                debugger
                var chacePeriode = cacheHelper.get('DaftarPasienPerjanjian');
                if (chacePeriode != undefined) {
                    $scope.from = new Date(chacePeriode[0]);
                    $scope.until = new Date(chacePeriode[1]);
                    $scope.tglInput = new Date(chacePeriode[2]);
                    $scope.namaRuangan = chacePeriode[3];
                    $scope.namaPasien = chacePeriode[4];
                    $scope.kodeReservasi = chacePeriode[6];
                    // $scope.status.nama = chacePeriode[7];
                    $scope.item.isTelemedicine = chacePeriode[8];
                    $scope.item.isSedangDisiapkan = chacePeriode[9];
                    $scope.item.isMcu = chacePeriode[10];
                } else {
                    $scope.from = new Date(moment($scope.now).format('YYYY-MM-DD'));
                    $scope.until = new Date(moment($scope.now).format('YYYY-MM-DD'));
                }
            }

            $scope.reconfirm = function () {
                // window.isPerjanjian = $scope.item.noreservasi;
                // findPasien.CheckNoReconfirm($scope.item.noreservasi).then(function(e) {
                debugger
                if ($scope.item.nocm != undefined || $scope.item.nocm != null) {
                    if ($scope.item.noidentitas == undefined || $scope.item.noidentitas == null || $scope.item.noidentitas == '') {
                        toastr.error('NIK Belum Benar, Harap Perbaiki NIK pasien Terlebih dahulu');
                        return
                    }
                }

                //Hapus Wisnu
                //|| $scope.item.noidentitas != '0000000000000000'
                if ($scope.item.nocm != undefined || $scope.item.nocm != null) {
                    if ($scope.item.noidentitas.length != 16) {
                        toastr.error('NIK Belum Benar, Harap Perbaiki NIK pasien Terlebih dahulu');
                        return
                    }
                }

                if ($scope.item.nocm == undefined ||$scope.item.nocm == 0 || $scope.item.nocm == null) {

                    //  var data={
                    //          "noreservasi":  $scope.item.noreservasi,                                 
                    // }

                    // manageAkuntansi.postupdatestatusconfirm(data).then(function(e) {
                    //        LoadData();
                    var cahce = {
                        0: $scope.item,
                        1: 'Online',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    };
                    cacheHelper.set('CacheRegisOnline', cahce);
                    // var isMenuDinamis = JSON.parse(localStorage.getItem('isMenuDinamis'))
                    // if(isMenuDinamis && isMenuDinamis == true){
                    debugger
                    // if ($scope.item.objectruanganfk == 322) {
                    //     $state.go('RegistrasiPasienBaruMCU', {
                    //         noRec: $scope.item.norec
                    //     });
                    // } else {
                    $state.go('RegistrasiPasienBaru', {
                        noRec: $scope.item.norec
                    });
                    // }


                } else {
                    var a = new Date();
                    var x = Date.parse(a);
                    var data = {
                        kodebooking: $scope.item.noreservasi,
                        taskid: 3,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                        debugger
                        // body...
                    })
                    if ($scope.item.noregistrasi != null) {
                        var cacheSet = $scope.item.norec_pd +
                            "~" + $scope.item.noregistrasi +
                            "~" + $scope.item.norec_apd;
                        cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                        $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                            noCm: $scope.item.nocm
                        });
                    } else {
                        cacheHelper.set('cacheStatusPasien', 'LAMA');
                        var param = $scope.item.norec + "*" + $scope.item.nocm;

                        var cacheSet = undefined;
                        cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                        var cahce = {
                            0: $scope.item,
                            1: 'Online',
                            2: '',
                            3: '',
                            4: '',
                            5: '',
                            6: ''
                        };
                        cacheHelper.set('CacheRegisOnline', cahce);
                        $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                            noCm: $scope.item.nocm
                        });
                    }

                    // })
                }
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
            $scope.cetakTracer = function () {
                debugger
                if ($scope.item == undefined) {
                    toastr.error('Pilih Dulu NoRegistrasi Pasien')
                    return
                }
                if ($scope.item.noregistrasi != undefined) {

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.item.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.CetakLaporan = function () {
                var tglAwal = moment($scope.from).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD 23:59');

                var status = "";
                if ($scope.status != undefined) {
                    status = $scope.status.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Reservasi Online? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-LaporanReservasiOnline=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&statusId=' + status + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }
            $scope.cetakulangtracer = function () {
                debugger
                var noregistrasi = $scope.item.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noregistrasi"],
                    "paramValue": [$scope.item.noregistrasi,], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/cetakulangtracer.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakulangtracer.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakulangtracer.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.cetakMCU = function () {
                debugger
                var norec = $scope.item.noreservasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreservasi"],
                    "paramValue": [$scope.item.noreservasi,], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakmcu2reservasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakmcu2reservasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakmcu2reservasi.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/cetakmcu2reservasi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakmcu2reservasi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakmcu2reservasi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.hapusReservasi = function () {
                if ($scope.item == undefined) {
                    toastr.error('silahkan pilih data ...')
                    return
                }
                if ($scope.item.status == 'Confirm') {
                    toastr.error('Pasien sudah di confirm, jadi tidak bisa di Tolak ...')
                    return
                }
                $scope.item.keteranganTolak = ""
                $scope.popupTolakPasien.center().open();
            }
            $scope.simpanTolakPasien = function () {
                $scope.popupTolakPasien.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah anda yakin akan menolak Reservasi Pasien ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.confirmDelete();
                })
            }
            $scope.confirmDelete = function () {
                medifirstService.post("reservasionline/delete", { "norec": $scope.item.norec, "keterangan": $scope.item.keteranganTolak })
                    .then(function (data) {
                        LoadData();
                    })
            }

        }
    ]);
});