define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('LaporanKinerjaPelaksanaPerTindakanCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper', '$window',
        function ($scope, medifirstService, $state, cacheHelper, DateHelper, $window) {
            $scope.item = {};
            // $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isLoading = false;
            var norec_apd = ''
            var norec_pd = ''
            var norecPPas = ''
            var aaa = [];
            $scope.dataPasienSelected = {};
            $scope.istempatLaporan = true;
            $scope.cboUbahDokter = true;
            var norec_so = ''
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.PegawaiLogin2 = {};

            var arrPush = []
            $scope.beforeedit = {};
            $scope.ruanganasaldirujuk = "";

            $scope.item = {
                tglInput: new Date(),
                tglInputCetak: new Date(),
                tglAwal: new Date(),
                tglAkhir: new Date(),
            };
            var urlHasilVansLab = ''
            medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                urlHasilVansLab = dat.data

            })


            function init() {

                $scope.isLoading = true;

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var namaPasien = $scope.item.namaPasien
                medifirstService.get("radiologi/get-laporan-kinerja-pertindakan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
                        debugger
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }

                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            // $scope.disableDna = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                            // $scope.disableDna = true
                            if (dat.data.data[0].objectruanganfk == 575)
                                $scope.disablePenjamin = true
                        }
                        $scope.isLoading = false;
                        debugger
                        arrPush = []
                        for (var i = 0; i <= dat.data.data.length - 1; i++) {
                            arrPush.push({
                                no: dat.data.data[i].no,
                                tanggalekpertise: dat.data.data[i].tanggalekpertise,
                                namapasien: dat.data.data[i].namapasien,
                                nofoto: dat.data.data[i].nofoto,
                                kelompokpasien: dat.data.data[i].kelompokpasien,
                                dokterbaca: dat.data.data[i].dokterbaca,
                            })
                        }

                        $scope.dataGrid = {
                            data: dat.data.data,
                            group: $scope.group,
                            pageSize: 100,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [{
                                field: 'total',
                                aggregate: 'sum'
                            },]

                        };

                        if (dat.data.data[0].objectdepartemenfk == 27) {
                            $scope.showRadiologi = true;
                        }

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });

            }
            medifirstService.get("tatarekening/get-combo-penjamin").then(function (dat) {
                $scope.listUbahPenjamin = dat.data.penjamin;
                $scope.listUbahRekanan = dat.data.rekanan;
            })


            $scope.SaveUbahPenjamin = function () {
                //;
                if ($scope.item.ubahpenjamin == undefined) {
                    toastr.error('Penjamin belum dipilih !', 'Warning !')
                    return;
                }
                if ($scope.item.password2 != "ubahpenjamin") {
                    toastr.error("Password Salah !")
                    return;
                }
                // var 
                var dataJson = {
                    noregistrasi: $scope.item.noregistrasi,
                    penjamin: $scope.item.ubahpenjamin.id,
                }
                var ubahPenjamin = {
                    noregistrasi: $scope.item.noregistrasi,
                    penjamin: $scope.item.ubahpenjamin.penjamin,
                    penjaminasal: $scope.item.kelompokPasien

                }
                medifirstService.post('tatarekening/save-update-penjamin-lab', dataJson).then(function (e) {



                    $scope.popupUbahPenjamin.close();
                })
                medifirstService.post('rawatinap/save-logging-ubah-penjamin', ubahPenjamin).then(function (dat) {

                })
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.group = {
                field: "namalengkap",
                aggregates: [
                    // {
                    //     field: "pasien",
                    //     aggregate: "count"
                    // }, 
                    {
                        field: "namalengkap",
                        aggregate: "count"
                    }
                ]
            };

            $scope.columnGrid = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Kinerja Pelaksana Per Tindakan.xlsx",
                    allPages: true,
                    sortable: true,
                    pageable: true,
                    resizable: true,
                },

                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1"];
                    sheet.name = "LAPORAN";
                    var nama = ''
                    if ($scope.item.namaPasien != '' || $scope.item.namaPasien != undefined) {
                        nama = ' ATAS NAMA ' + $scope.item.namaPasien

                    }


                    var myHeaders = [

                        {
                            // value: "LAPORAN WAKTU TUNGGU HASIL RADIOLOGIxx " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' SAMPAI ' +
                            //     DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY') + nama,
                            value: "Laporan Kinerja Pelaksana Per Tindakan",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 50
                    });
                },
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No.",
                    //     "width": "10px",
                    //     attributes: {
                    //         // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "namapasien",
                    //     "title": "Nama Pasien",
                    //     "width": "60px"

                    // },
                    {
                        "field": "jenispetugaspe",
                        "title": "Jenis Pelaksana",
                        "width": "60px"

                    },
                    {
                        "field": "tindakan",
                        "title": "Nama Tindakan",
                        "width": "60px"

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "60px"

                    },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.clickCari = function () {
                init();
            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $scope.cetakPdf = function () {


                init()


                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                // if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                //     xhr.open('POST', 'http://192.168.0.62:1002/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
                // } else {
                //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/evaluasiigd.pdf');
                // }
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporandokterbaca.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/laporandokterbaca.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }


            //***********************************

        }
    ]);
});