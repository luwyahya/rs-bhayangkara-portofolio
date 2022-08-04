define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarPenerimaanBarangSuplierPerUnitCtrl', ['$scope', 'ModelItem', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function($scope, ModelItem, dateHelper, medifirstService, cacheHelper) {
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
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function(data) {
                    $scope.listNamaBarang = data;
                    // $scope.listDetailJenisBrg = data;
                });

                medifirstService.getPart("logistik/get-combo-detail-jenis-logistik", true, true, 20).then(function(data) {

                    // $scope.listNamaBarang = data;
                    $scope.listDetailJenisBrg = data;
                });




            }

            $scope.Tambah = function() {
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
                if ($scope.item.jenisBarang != undefined) {
                    jenis = "&IdJenis=" + $scope.item.jenisBarang.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-penerimaan-perunit?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    "&namarekanan=" + $scope.item.namarekanan +
                    produkfk + KdSirs1 + KdSirs2 + jenis, true).then(function(dat) {

                    $scope.isRouteLoading = false;
                    var datas = dat.data.data;
                    var total = 0;
                    var totalQty = 0;
                    var ppn = 0;
                    var diskon = 0;
                    for (var i = 0; i < datas.length; i++) {
                        var y = 0
                        datas[i].no = i + 1
                        total = parseFloat(datas[i].total) + total;
                        totalQty = parseFloat(datas[i].qtyproduk) + totalQty;
                    }
                    $scope.item.SubTotalQty = parseFloat(totalQty).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    $scope.item.SubTotal = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
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
            $scope.getRuangan = function() {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function() {

                init();
            }

            $scope.CetakRincian = function() {
                var stt = 'false'
                if (confirm('View Laporan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function(response) {
                    //aadc=response;
                });
            }

            $scope.CetakRincianDetailRekap = function() {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var stt = 'false'
                if (confirm('View Laporan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var detailjenisproduk = "";
                if ($scope.item.jenisBarang != undefined) {
                    detailjenisproduk = $scope.item.jenisBarang.detailjenisproduk;
                }
                var namaBrg = "";
                if ($scope.item.namaBarang != undefined) {
                    namaBrg = $scope.item.namaBarang.namaproduk;
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-detail-penerimaan-sp-sum=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&jnsBarang=' + detailjenisproduk + '&namaBrg=' + namaBrg + '&view=' + stt, function(response) {
                    //aadc=response;
                });
            }


            $scope.LaporanSupplier = function() {
                var stt = 'false'
                if (confirm('View Laporan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var objPrd = "";
                if ($scope.item.namaBarang != undefined) {
                    objPrd = $scope.item.namaBarang.id;
                }
                var jns = "";
                if ($scope.item.jenisBarang != undefined) {
                    jns = $scope.item.jenisBarang.id;
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-laporan-penerimaan-supplier=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&objectProduk=' + objPrd + '&jenis=' + jns + '&view=' + stt, function(response) {
                    //aadc=response;
                });
            }
            $scope.LaporanSupplierRekap = function() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var jenisPasien = "";
                if ($scope.item.jenisBarang != undefined) {
                    jenisPasien = $scope.item.jenisBarang.detailjenisproduk;
                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "detailjenisproduk"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString(), jenisPasien.toString()],
                    "paramType": ["", "", "", "", ""]
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/RekapitulasiPembelianObat.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/RekapitulasiPembelianObat.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/RekapitulasiPembelianObat.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/RekapitulasiPembelianObat.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/RekapitulasiPembelianObat.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;




            }
            $scope.penerimaanharian = function() {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString()],
                    "paramType": ["", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/penerimaanharian.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/penerimaanharian.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/penerimaanharian.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1002/generic/report/penerimaanharian.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/penerimaanharian.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/penerimaanharian.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.Laporanrekon = function() {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglawal", "tglakhir"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", tglAwal.toString(), tglAkhir.toString()],
                    "paramType": ["", "","date", "date"]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/laporanrekon.pdf');

                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/laporanrekon.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/laporanrekon.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.9') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1002/generic/report/laporanrekon.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/laporanrekon.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporanrekon.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakBukti = function() {
                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function(response) {
                    //aadc=response;
                });
            }

            $scope.EditTerima = function() {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('PenerimaanBarangSuplier')
            }

            $scope.RegisAset = function() {
                debugger;
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'RegisAset',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('RegisterAsetCtrl', chacePeriode);
                $state.go('RegisterAset')
            }

            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Detail Penerimaan Barang Suplier  " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-" +
                        moment($scope.item.tglAkhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                excelExport: function(e) {

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
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "namarekanan",
                        "title": "Nama Rekanan",
                        "width": "90px",
                    },
                    {
                        "field": "nofaktur",
                        "title": "No Faktur",
                        "width": "80px",
                    },
                    {
                        "field": "kdproduk",
                        "title": "Kode Produk",
                        "width": "80px"
                    },
                    {
                        "field": "kdsirs",
                        "title": "Kode Produk Sirs",
                        "width": "95px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "100px",
                    },

                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Produk",
                        "width": "100px",
                    },

                    {
                        "field": "tglfaktur",
                        "title": "Tanggal faktur",
                        "width": "60px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglfaktur #', '')}}</span>"
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tanggal Penerimaan",
                        "width": "60px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                    },
                    {
                        "field": "nosppb",
                        "title": "No PO",
                        "width": "80px",
                        "template": "#if (nosppb) {# #= nosppb # #} else {# - #} #",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "80px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty Terima",
                        "width": "55px",
                        "template": "<span class='style-right'>#= kendo.toString(qtyproduk) #</span>",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "90px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Diskon",
                        "width": "90px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', 'Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                    },
                    {
                        "field": "hargappn",
                        "title": "PPn",
                        "width": "90px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', 'Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                        // footerTemplate: "#:data.hargappn.sum  #"
                        footerTemplate: "TOTAL"
                    },
                    {
                        "field": "hna",
                        "title": "HNA",
                        "width": "90px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hna #', 'Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                        // footerTemplate: "#:data.hargappn.sum  #"
                        // footerTemplate: "TOTAL"
                    }, {
                        "field": "hasilkonversi",
                        "title": "QTY terkecil",
                        "width": "90px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        // "template": "<span class='style-right'>{{formatRupiah('#: HNA #', 'Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                        // footerTemplate: "#:data.hargappn.sum  #"
                        // footerTemplate: "TOTAL"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "120px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp. ')}}</span>"

                        footerTemplate: "#:data.total.sum  #"
                            // footerTemplate: "<span class='style-right'>{{formatRupiah('#: total #', 'Rp. ')}}</span>"
                            // footerTemplate: "#:data.total.sum  #"
                    },
                    {
                        "field": "HNA",
                        "title": "HNA",
                        "width": "120px",
                        // "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        // "template": "<span class='style-right'>{{formatRupiah('#: HNA #', 'Rp. ')}}</span>",
                        // attributes: { style: "text-align:right;" },
                        // aggregates: ["sum"],
                        // // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp. ')}}</span>"

                        // footerTemplate: "#:data.HNA.sum  #"
                    },
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "80px",
                    },
                    {
                        "field": "tglkadaluarsa",
                        "title": "Tanggal Expire",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                    }
                ]
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn ' // + bln + ' bln'
            }
            var HttpClient = function() {
                    this.get = function(aUrl, aCallback) {
                        var anHttpRequest = new XMLHttpRequest();
                        anHttpRequest.onreadystatechange = function() {
                            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                                aCallback(anHttpRequest.responseText);
                        }

                        anHttpRequest.open("GET", aUrl, true);
                        anHttpRequest.send(null);
                    }
                }
                //***********************************
        }
    ]);
});