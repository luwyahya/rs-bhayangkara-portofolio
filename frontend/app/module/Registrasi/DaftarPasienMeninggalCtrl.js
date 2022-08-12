define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('DaftarPasienMeninggalCtrl', ['MedifirstService', '$scope', '$state', 'CacheHelper',
        function (medifirstService, $scope, $state, cacheHelper) {
            $scope.title = "Daftar Pasien Meninggal";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.istempatLaporan = true;

            // $scope.data = {};
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            };
            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noReg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&noCm=" + $scope.item.noRm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&namaPasien=" + $scope.item.namaPasien
                }
                medifirstService.get("registrasi/get-daftar-pasien-meninggal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    reg +
                    rm +
                    nama).then(function (e) {
                        $scope.isRouteLoading = false;

                        $scope.dataPasienBatal = new kendo.data.DataSource({
                            data: e.data.data,
                            pageable: true,
                            pageSize: 1000,
                            total: e.data.data.length,
                            serverPaging: false,
                            // group: {
                            //     field: "tglmeninggal",
                            //     aggregates: [{
                            //         field: "noregistrasi",
                            //         aggregate: "count"
                            //     }, {
                            //         field: "namapasien",
                            //         aggregate: "count"
                            //     }]
                            // }
                        });
                    })

            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.findData();
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarPasienMeninggal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "Daftar Pasien Meninggal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                    field: "tglmeninggal",
                    title: "Tgl Meninggal",
                    template: "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"

                },
                {
                    field: "tglmasuk",
                    title: "Tgl Masuk Pemulasaran",
                    template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"

                },
                {
                    field: "noregistrasi",
                    title: "No Reg",
                    hidden: false
                },
                {
                    field: "nocm",
                    title: "No Rm",
                    hidden: false
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien"
                },
                {
                    field: "penyebabkematian",
                    title: "Penyebab Kematian"
                },
                {
                    field: "namaruangan",
                    title: "Ruangan Terakhir"
                },
                {
                    "field": "namadokter",
                    "title": "Nama Dokter",
                    "width": "150px",
                    "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "100px",
                    "template": "<span class='style-left'>#: kelompokpasien #</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Penjamin",
                    "width": "100px",
                    "template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
                }
                ],
                selectable: "row",
                sortable: true
            }

            $scope.inputTindakan = function () {
                debugger;
                if ($scope.data) {
                    $state.go('InputTindakan', {
                        norecPD: $scope.data.norec_pd,
                        norecAPD: $scope.data.norec_apd,
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.detailTagihan = function () {
                if ($scope.data.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.data.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }
            // $scope.pemeriksaanDokterForensik = function () {
            //     debugger;
            //     if ($scope.data == undefined){
            //         toastr.error('Pilih Data Dahulu !')
            //         return;
            //     }
            // else if ($scope.data.norec_pd != undefined) {
            //     var arrStr = {
            //         0: $scope.data.norec_pd
            //     }
            //     cacheHelper.set('PemeriksaanDokterForensik', arrStr);
            //     $state.go('PemeriksaanDokterForensik')
            // }
            //     else {
            //         toastr.error('Pilih Data Dahulu !')
            //         return;
            //     }
            // }
            $scope.pemeriksaanDokterForensik = function () {
                if ($scope.data == undefined) {
                    toastr.error('Pilih Data Dahulu !')
                    return;
                } else {
                    $scope.popupPassword.center().open()
                }
            }
            $scope.gas = function () {
                debugger
                if ($scope.item.password != "forensik") {
                    toastr.error('Password Salah !')
                    return;
                } else if ($scope.data.norec_pd != undefined) {
                    var arrStr = {
                        0: $scope.data.norec_pd
                    }
                    cacheHelper.set('PemeriksaanDokterForensik', arrStr);
                    $state.go('PemeriksaanDokterForensik')
                }
            }
            $scope.simpansuratjalan = function () {
                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    petugasfk: $scope.item.petugas.id,
                    tglberangkat: moment($scope.item.tglberangkat).format('YYYY-MM-DD HH:mm:ss'),
                    nopol: $scope.item.nopol,
                    keperluan: $scope.item.keperluan,
                    tujuan: $scope.item.tujuan,
                    keluargapasien: $scope.item.keluargapasien,
                }
                medifirstService.post('ambulance/save-suratjalan', objSave).then(function (e) {

                });
            }
            $scope.kembalirekanan = function () {
                $scope.popup_editor.close();
            }
            $scope.suratjalan = function () {
                $scope.item.noregistrasi = $scope.data.noregistrasi;
                if ($scope.data.noregistrasi != undefined) {
                    medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                        $scope.listRuangan = dat.data.ruanganambulan;
                        debugger;
                        $scope.ListDataPegawai = dat.data.pegawai;
                        $scope.item.caridatajenazahbyruangan = { id: dat.data.ruanganambulan[0].id, namaruangan: dat.data.ruanganambulan[0].namaruangan }
                        LoadCache();
                    })
                    medifirstService.get("ambulance/get-suratjalan?noregistrasi=" + $scope.data.noregistrasi).then(function (dat) {
                        $scope.item.nopol = dat.data.data.nopol
                        $scope.item.tujuan = dat.data.data.tujuan
                        $scope.item.keperluan = dat.data.data.keperluan
                        $scope.item.tglberangkat = dat.data.data.tanggalberangkat
                        $scope.item.petugas = { id: dat.data.data.id, namalengkap: dat.data.data.namalengkap }
                        $scope.item.keluargapasien = dat.dat.data.keluargapasien

                    });
                }
                $scope.popup_editor.center().open();
            }

            $scope.cetaksuratjalan = function () {

                var user = medifirstService.getPegawaiLogin();
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, $scope.item.noregistrasi],
                    "paramType": ["", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});

                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratjalan.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratjalan.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratjalan.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.BatalPeriksa = function () {
                if ($scope.data == undefined) {
                    toastr.error('Pilih Data Dahulu !', 'Peringatan !')
                    return;
                }
                var norecpd = ""
                if ($scope.data.norec_pd != undefined) {
                    norecpd = "norecpd=" + $scope.data.norec_pd;
                }
                medifirstService.get("jenazah/get-pelayanan-pasien?" + norecpd).then(function (dat) {
                    var mumet = dat.data
                    debugger;
                    if (mumet.length > 0) {
                        toastr.error('Mayat ini Sudah Mendapatkan Tindakan, Tidak bisa Batal Periksa !')
                        return;
                    }
                    var Batal = {
                        norec: $scope.data.norec_pd,
                    }
                    var Logging = {
                        noregistrasi: $scope.data.noregistrasi,
                    }
                    medifirstService.post('jenazah/simpan-batal-periksa', Batal).then(function (a) {

                    })
                    medifirstService.post('jenazah/save-logging-batal-periksa', Logging).then(function (q) {

                    })
                    $scope.isRouteLoading = true;
                    var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                    var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

                    var reg = ""
                    if ($scope.item.noReg != undefined) {
                        var reg = "&noReg=" + $scope.item.noReg
                    }
                    var rm = ""
                    if ($scope.item.noRm != undefined) {
                        var rm = "&noCm=" + $scope.item.noRm
                    }
                    var nama = ""
                    if ($scope.item.namaPasien != undefined) {
                        var nama = "&namaPasien=" + $scope.item.namaPasien
                    }
                    medifirstService.get("registrasi/get-daftar-pasien-meninggal?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg +
                        rm +
                        nama).then(function (e) {
                            $scope.isRouteLoading = false;

                            $scope.dataPasienBatal = new kendo.data.DataSource({
                                data: e.data.data,
                                pageable: true,
                                pageSize: 1000,
                                total: e.data.data.length,
                                serverPaging: false,
                                // group: {
                                //     field: "tglmeninggal",
                                //     aggregates: [{
                                //         field: "noregistrasi",
                                //         aggregate: "count"
                                //     }, {
                                //         field: "namapasien",
                                //         aggregate: "count"
                                //     }]
                                // }
                            });
                        })

                })
            }
        }
    ]);

});