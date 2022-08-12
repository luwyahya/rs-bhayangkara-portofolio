define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarMenuGiziCtrl', ['$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function ($scope, ModelItem, $state, dateHelper, medifirstService, cacheHelper) {
            $scope.item = {};
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();
            $scope.istempatLaporan = true;

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPenerimaanBarangSuplierPerUnitCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00'); //$scope.now;
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59:59'); // $scope.now;
                    init();
                }
            }

            function loadCombo() {
                medifirstService.getPart("sysadmin/master/get-daftar-menu-gizi-transaksi", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                    // $scope.listDetailJenisBrg = data;
                });

                medifirstService.getPart("logistik/get-combo-detail-jenis-logistik", true, true, 20).then(function (data) {

                    // $scope.listNamaBarang = data;
                    $scope.listDetailJenisBrg = data;
                });




            }

            $scope.listjammakan = [
                { "id": 1, "nama": "MAKAN SIANG JAM: 12.00-13.00 WIB" },
                { "id": 2, "nama": "MAKAN MALAM JAM: 18.00-19.00 WIB" },
                { "id": 3, "nama": "MAKAN PAGI JAM: 06.00-07.00 WIB" }
            ]


            $scope.Tambah = function () {
                $state.go('PenerimaanBarangSuplier')
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                }
                var jenis = ""
                if ($scope.item.namajammakan != undefined) {
                    jenis = "&IdJenis=" + $scope.item.namajammakan.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("sysadmin/master/get-daftar-transaksi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    jenis, true).then(function (dat) {

                        $scope.isRouteLoading = false;
                        $scope.selectedOnCheck = [];
                        for (var i = 0; i < dat.data.length; i++) {
                            var y = 0
                            dat.data[i].no = i + 1;
                            dat.data[i].statCheckbox = false
                        }

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.length,
                            serverPaging: false,
                            selectable: true,
                            refresh: true,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                                { field: 'hargappn', aggregate: 'sum' }
                                // scrollable: false,
                                // pageSize: 5
                            ],
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
                cacheHelper.set('DaftarPenerimaanBarangSuplierCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }


            $scope.input = function () {
                $state.go('InputMenuGizi')
                // $state.go('InputResepApotikRetur')
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.selectRow = function (dataItem) {
                debugger;
                var dataSelect = _.find($scope.dataGrid._data, function (data) {
                    return data.norec == dataItem.norec;
                });
                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedOnCheck.length; i++) {
                        if (dataSelect.norec == $scope.selectedOnCheck[i].norec) {
                            $scope.selectedOnCheck.splice([i], 1)
                            break
                        }
                    }
                } else {
                    dataSelect.statCheckbox = true;
                    $scope.selectedOnCheck.push(dataSelect)
                }



                /*end Get */
            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGrid._data;
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedOnCheck = []
                    }
                } else {
                    isCheckAll = true;

                    for (var i = 0; i < tempData.length; i++) {

                        tempData[i].statCheckbox = true;
                        $scope.selectedOnCheck.push(tempData[i])

                        // var tglMenu = moment(tempData[i].tglmenu).format('YYYY-MM-DD');
                        // var arrTgl = tglMenu.split('-');
                        // medifirstService.get("gizi/get-produk-menudiet?jenisDietId="
                        // 	+ tempData[i].objectjenisdietfk
                        // 	+ "&kelasId=" + tempData[i].objectkelasfk
                        // 	+ "&siklusKe=" + arrTgl[2]
                        // 	+ "&jenisWaktuId=" + tempData[i].objectjeniswaktufk
                        // 	+ "&norec_op=" + tempData[i].norec_op
                        // 	+ "&norec_pd=" + tempData[i].norec_pd
                        // ).then(function (e) {
                        // 	var result = e.data.data
                        // 	result.forEach(function (res) {
                        // 		dataMenuSiklus.push(res)

                        // 	})
                        // 	console.log(JSON.stringify(dataMenuSiklus));

                        // })
                    }
                }
                // console.log($scope.selectedOnCheck)
                // reloaddataSourceGrid(tempData);
            }
            $scope.cetak = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var jenisPasien = "";

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir",],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString()],
                    "paramType": ["", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/menugizi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/menugizi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/menugizi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/menugizi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/menugizi.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }
            $scope.cetaknota = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var jenis = "BARANG KENA PAJAK";
                var kodedetailproduk = "128"

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "jenis", "kodedetailproduk"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString(), jenis, kodedetailproduk],
                    "paramType": ["", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/bongizi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/bongizi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/bongizi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/bongizi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bongizi.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }
            $scope.cetaknotabasah = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var jenis = "BARANG TIDAK KENA PAJAK";
                var kodedetailproduk = "127"

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "jenis", "kodedetailproduk"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString(), jenis, kodedetailproduk],
                    "paramType": ["", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/bongizi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/bongizi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/bongizi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/bongizi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bongizi.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }
            $scope.cetaknota2 = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var jenis = "BARANG KENA PAJAK";
                var kodedetailproduk = "128"

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "jenis", "kodedetailproduk"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString(), jenis, kodedetailproduk],
                    "paramType": ["", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/bongizi2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/bongizi2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/bongizi2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/bongizi2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bongizi2.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }
            $scope.cetaknotabasah2 = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var jenis = "BARANG TIDAK KENA PAJAK";
                var kodedetailproduk = "127"

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "jenis", "kodedetailproduk"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString(), jenis, kodedetailproduk],
                    "paramType": ["", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/bongizi2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/bongizi2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/bongizi2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/bongizi2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/bongizi2.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }
            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Detail Penerimaan Barang Suplier  " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-" +
                        moment($scope.item.tglAkhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:N1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Detail Penerimaan Barang Suplier",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });
                },
                sortable: true,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                        "# } #",
                    width: "30px"
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Menu",
                    "width": "80px",
                }, {
                    "field": "bahan",
                    "title": "Nama Bahan",
                    "width": "80px",
                },
                {
                    "field": "tglmenu",
                    "title": "Tanggal Menu",
                    "width": "60px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglmenu #', '')}}</span>"
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah Porsi",
                    "width": "90px",

                    "template": "<span class='style-right'>#= kendo.toString(jumlah) #</span>",
                },
                {
                    "field": "keterangan",
                    "title": "keterangan",
                    "width": "80px",
                }

                ]
            }

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
            $scope.hapus = function () {

                if ($scope.selectedOnCheck.length == 0) {
                    toastr.error('Ceklis Peritem dulu')
                    return
                }

                var data = {
                    'hapus': $scope.selectedOnCheck
                }
                debugger;
                medifirstService.post('gizi/hapus-peritem-menugizi', data).then(function (e) {
                    $scope.selectedOnCheck = []
                    init()

                })

            }
            //***********************************
        }
    ]);
});