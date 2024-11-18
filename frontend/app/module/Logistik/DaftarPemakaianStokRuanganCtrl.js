define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPemakaianStokRuanganCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPemakaianStokRuanganCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                } else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
                    init();
                }
            }

            function loadCombo() {
                $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
            }

            function init() {
                $scope.isRouteLoading = true;
                var nostruk = ""
                if ($scope.item.nostruk != undefined)
                    nostruk = "&nostruk=" + $scope.item.nostruk
                var ket = ""
                if ($scope.item.keterangan != undefined)
                    ket = "&keterangan=" + $scope.item.keterangan
                var ruid = ""
                if ($scope.item.ruangan != undefined)
                    ruid = "&ruanganid=" + $scope.item.ruangan.id

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-pemakaian-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    nostruk + ket + ruid, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 10,
                            total: dat.data.length,
                            serverPaging: false,
                        })
                        pegawaiUser = dat.data.datalogin
                    });
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPemakaianStokRuanganCtrl', chacePeriode);
            }

            $scope.addPemakaian = function () {
                $state.go("PemakaianStokRuangan")
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.CetakRincian = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.CetakBukti = function () {
                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }


            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-usulanpermintaanbarang=1&nores=' + $scope.dataSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response;
                });
            }
            $scope.cetakpemakaian = function () {

                $scope.isRouteLoading = true;
                $scope.dataSelected.norec
                var norec = $scope.dataSelected.norec
                var data = {
                    "gambarLogo": "logo_rs.jpg",
                    "paramKey": ["namaRS", "alamatRS", "norec"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.dataSelected.norec.toString()],
                    "paramType": ["", "", "", ""]
                };
                debugger
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan2');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakpemakaian.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetakpemakaian.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetakpemakaian.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakpemakaian.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakpemakaian.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakpemakaian.pdf');
                }
                debugger
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }

            $scope.editPemakaian = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu', 'Error')
                    return
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditPemakaian',
                    2: '',
                    3: '',
                    4: $scope.dataSelected,
                    5: '',
                    6: ''
                }
                cacheHelper.set('PemakaianStokRuanganCtrl', chacePeriode);
                $state.go('PemakaianStokRuangan')
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "25px",
            },
            {
                "field": "tglstruk",
                "title": "Tanggal",
                "width": "50px",
                "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
            },
            {
                "field": "nostruk",
                "title": "No Pemakaian",
                "width": "80px",
            },
            {
                "field": "keterangan",
                "title": "Keterangan",
                "width": "120px",
            },
            {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "60px",
            },
            {
                "field": "namapegawai",
                "title": "Pegawai",
                "width": "100px",
            },
            {
                "field": "total",
                "title": "Total",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            }
            ];

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        "field": "namaproduk",
                        "title": "Deskripsi",
                        "width": "50px"
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "30px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty",
                        "width": "20px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "40px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                    }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn ' // + bln + ' bln'
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

            $scope.hapusPemakaian = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu', 'Error')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah anda yakin mau menghapus data ini !? ')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')
                $mdDialog.show(confirm).then(function () {
                    $scope.Hapus($scope.dataSelected.norec);

                })
            }

            $scope.Hapus = function (norecSP) {
                var data = {
                    "nostruk": norecSP,
                }
                medifirstService.post('logistik/delete-pemakaian-ruangan', data).then(function (e) {
                    init()
                })

            }
            //***********************************
        }
    ]);
});