define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienAmbulanCtrl', ['$q', '$rootScope', '$scope', 'CacheHelper', '$state', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, cacheHelper, $state, DateHelper, medifirstService) {
            $scope.item = {};
            // DaftarPasienAmbulanCtrl
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.caritglawal = moment(new Date()).format('YYYY-MM-DD 00:00');
            $scope.item.caritglakhir = moment(new Date()).format('YYYY-MM-DD 23:59');
            FormLoad();


            function FormLoad() {
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganambulan;
                    debugger;
                    $scope.ListDataPegawai = dat.data.pegawai;
                    $scope.item.caridatajenazahbyruangan = { id: dat.data.ruanganambulan[0].id, namaruangan: dat.data.ruanganambulan[0].namaruangan }
                    LoadCache();
                })
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienAmbulanCache');
                if (chacePeriode != undefined) {
                    $scope.item.caridatajenazahbynocm = chacePeriode[0]
                    $scope.item.caridatajenazahbyNoRegis = chacePeriode[1]
                    $scope.item.caridatajenazahbynama = chacePeriode[2]
                    $scope.item.caritglawal = chacePeriode[3];
                    $scope.item.caritglakhir = chacePeriode[4];
                    loadData()
                } else {
                    loadData()
                }
            }

            function loadData() {
                var noCm = "";
                var nama = "";
                var noRegis = "";
                var idRuangan = "";

                if ($scope.item.caridatajenazahbynocm != undefined) {
                    noCm = "&noCm=" + $scope.item.caridatajenazahbynocm;
                }

                if ($scope.item.caridatajenazahbyNoRegis != undefined) {
                    noRegis = "&noRegis=" + $scope.item.caridatajenazahbyNoRegis;
                }

                if ($scope.item.caridatajenazahbynama != undefined) {
                    nama = "&namaPasien=" + $scope.item.caridatajenazahbynama;
                }

                if ($scope.item.caridatajenazahbyruangan != undefined) {
                    idRuangan = "&idRuangan=" + $scope.item.caridatajenazahbyruangan.id;
                }

                var tglAwal = "";
                if ($scope.item.caritglawal != undefined) {
                    tglAwal = moment($scope.item.caritglawal).format('YYYY-MM-DD HH:mm:ss');
                }

                var tglAkhir = "";
                if ($scope.item.caritglawal != undefined) {
                    tglAkhir = moment($scope.item.caritglakhir).format('YYYY-MM-DD HH:mm:ss');
                }

                var chacePeriode = {
                    0: $scope.item.caridatajenazahbynocm,
                    1: $scope.item.caridatajenazahbyNoRegis,
                    2: $scope.item.caridatajenazahbynama,
                    3: tglAwal,
                    4: tglAkhir,

                }
                cacheHelper.set('DaftarPasienAmbulanCache', chacePeriode);

                var i = 0;
                medifirstService.get("ambulance/get-data-pasien-ambulan?" + noCm + noRegis + nama +
                    idRuangan + "&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir).then(function (dat) {
                        $scope.listDataJenazah = dat.data.data;
                        if ($scope.listDataJenazah != undefined) {
                            for (i = 0; i < $scope.listDataJenazah.length; i++) {
                                $scope.listDataJenazah[i].no = i + 1;
                                var tanggal = $scope.now;
                                var tanggalLahir = new Date($scope.listDataJenazah[i].tgllahir);
                                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                                $scope.listDataJenazah[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            }
                            $scope.dataSource = new kendo.data.DataSource({
                                pageSize: 10,
                                data: $scope.listDataJenazah,
                                autoSync: true
                            });
                        }
                    });
            }
            $scope.kembalirekanan = function () {
                $scope.popup_editor.close();
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
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
            $scope.suratjalan = function () {
                if ($scope.current != undefined) {
                    medifirstService.get("ambulance/get-suratjalan?noregistrasi=" + $scope.current.noregistrasi).then(function (dat) {
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

            $scope.cetak = function () {

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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/suratjalan.pdf');
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

            $scope.columnDataJenazah = [{
                "field": "tglregistrasi",
                "title": "Tgl Registrasi",
                "width": "130px",
                "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
            },
            // {
            // 	"field": "tglorder",
            // 	"title": "Tgl Order",
            // 	"width":"130px",
            // 	"template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
            // },
            // {
            // 	"field": "tglmasuk",
            // 	"title": "Tgl Layanan",
            // 	"width":"130px",
            // 	"template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
            // },
            // {
            // 	"field": "tglpelayanan",
            // 	"title": "Tgl Layanan",
            // 	"width":"130px",
            // 	"template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
            // },				
            {
                "field": "nocm",
                "title": "No RM",
                "width": "80px",
                "template": "<span class='style-center'>#: nocm #</span>"
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px",
                "template": "<span class='style-center'>#: noregistrasi #</span>"
            },
            {
                "field": "namapasien",
                "title": "Nama Pasien",
                "width": "200px",
                "template": "<span class='style-left'>#: namapasien #</span>"
            },
            {
                "field": "umur",
                "title": "Umur",
                "width": "150px",
                "template": "<span class='style-left'>#: umur #</span>"
            },
            {
                "field": "namadokter",
                "title": "Dokter",
                "width": "150px",
                // "template": "<span class='style-left'>#: namadokter #</span>"
                "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
            },
            {
                "field": "jeniskelamin",
                "title": "JK",
                "width": "80px",
                "template": "<span class='style-left'>#: jeniskelamin #</span>"
            },
            {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "150px",
                "template": "<span class='style-left'>#: namaruangan #</span>"
            },
            {
                "field": "namakelas",
                "title": "Kelas",
                "width": "80px",
                "template": "<span class='style-left'>#:  namakelas #</span>"
            },
            {
                "field": "kelompokpasien",
                "title": "Tipe Pembayaran",
                "width": "150px",
                "template": "<span class='style-center'>#: kelompokpasien #</span>"
            }
            ];

            $scope.mainGridOptions = {
                pageable: true,
                columns: $scope.columnDataJenazah,
                editable: "popup",
                selectable: "row",
                scrollable: false
            };

            $scope.klik = function (current) {
                $scope.current = current;
                $scope.item.norec = current.norec;
                $scope.item.objectpasiendaftarfk = current.objectpasiendaftarfk;
                $scope.item.objectantrianpasiendiperiksafk = current.objectantrianpasiendiperiksafk;
                $scope.item.noregistrasi = current.noregistrasi;
            };

            $scope.cari = function () {
                loadData()
            }

            $scope.inputTindakan = function () {
                if ($scope.current != undefined) {
                    $state.go('InputTindakan', {
                        norecPD: $scope.current.norec_pd,
                        norecAPD: $scope.current.norec_apd
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.DetailTagihan = function () {
                if ($scope.current != undefined) {
                    var obj = {
                        noRegistrasi: $scope.current.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
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
            //** BATAS SUCI */

        }
    ]);
});