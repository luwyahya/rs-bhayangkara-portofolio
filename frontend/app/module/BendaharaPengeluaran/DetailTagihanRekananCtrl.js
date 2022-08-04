define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DetailTagihanRekananCtrl', ['CacheHelper', '$scope', '$state', 'MedifirstService',
        function (cacheHelper, $scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataPasienSelected = {};
            var noRECC = "";
            $scope.pegawaiUser = {};
            formLoad();

            function LoadCache() {
                if ($state.params.noTerima !== "") {
                    var chacePeriode = cacheHelper.get('DetailTagihanRekanan');
                    if (chacePeriode != undefined) {
                        var arrPeriode = chacePeriode.split('#');
                        $scope.item.tglTerima = new Date(arrPeriode[0]);
                        $scope.item.namaRekanan = arrPeriode[1];
                        $scope.item.noFaktur = arrPeriode[2];
                        $scope.item.tglFaktur = new Date(arrPeriode[4]);
                        $scope.item.tglJatuhTempo = new Date(arrPeriode[3]);
                        noRECC = arrPeriode[5];
                        var darisini = arrPeriode[6];
                        $scope.item.noTerima = arrPeriode[7];
                    }
                }
            }

            function loadDetailPenerimaan() {
                //Ambil data Pegawai dari database
                medifirstService.get("bendaharapengeluaran/get-detail-tagihan-suplier?"
                    + "NoTerima=" + $scope.item.noTerima +
                    "&noFaktur=" + $scope.item.noFaktur +
                    "&namaRekanan=" + $scope.item.namaRekanan +
                    "&NoStrukFk=" + noRECC, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data;
                        $scope.pegawaiUser = dat.data.dataPegawaiUser[0];
                        //Set data untuk total
                        var ttlHrg = 0;
                        var ttlPpn = 0;
                        var ttldiscount = 0;
                        var subtotal = 0;
                        var totQty = 0
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                            ttlHrg = ttlHrg + (parseInt(datas[i].hargasatuan) * datas[i].qtyproduk);
                            ttlPpn = ttlPpn + (parseInt(datas[i].hargappn) * datas[i].qtyproduk);
                            ttldiscount = ttldiscount + (parseInt(datas[i].hargadiscount) * datas[i].qtyproduk);
                            totQty = totQty + datas[i].qtyproduk
                        }
                        $scope.dataPenyusunanTRPNBP = new kendo.data.DataSource({
                            data: datas,
                            // pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                        subtotal = ttlHrg + ttlPpn - ttldiscount
                        $scope.item.harga = 'Rp. ' + parseFloat(ttlHrg).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.ppn = 'Rp. ' + parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.faktur = 'Rp. ' + parseFloat(subtotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.diskon = 'Rp. ' + parseFloat(ttldiscount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    });
            }

            function loadRiwayatPembayaran() {
                medifirstService.get("bendaharapengeluaran/get-riwayat-pembayaran-suplier?"
                    + "NoTerima=" + $scope.item.noTerima +
                    "&NoFaktur=" + $scope.item.noFaktur, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }
                        $scope.dataRiwayat = new kendo.data.DataSource({
                            data: datas,
                            total: datas.length,
                            serverPaging: false,
                            // pageSize: 10,
                        })
                    });
            }

            function formLoad() {
                LoadCache();
                loadDetailPenerimaan();
                loadRiwayatPembayaran();
            }

            $scope.columnPenyusunanTRPNBP = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "40px"
                },
                {
                    "field": "kdproduk",
                    "title": "Kode Barang",
                    "width": "100px"
                },
                {
                    "field": "kdsirs",
                    "title": "Kode Sirs",
                    "width": "85px"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang"
                },
                {
                    "field": "asalproduk",
                    "title": "Asal Barang"
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty Terima",
                    "template": "<span class='style-right'>#= kendo.toString(qtyproduk) #</span>",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan"
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp.')}}</span>"
                },
                {
                    "field": "subtotal",
                    "title": "Total",
                    "template": "<span class='style-right'>{{formatRupiah('#: subtotal #', 'Rp.')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', 'Rp.')}}</span>"
                }
            ];

            $scope.columnRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "40px"
                },
                {
                    "field": "tglsbk",
                    "title": "Tgl SBK",
                    "width": "110px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglsbk #', '')}}</span>"
                },
                {
                    "field": "nosbk",
                    "title": "NOSBK",
                    "width": "125px"
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Harus Dibayar",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', '')}}</span>"
                },
                {
                    "field": "totaldibayar",
                    "title": "Total Dibayar",
                    "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', '')}}</span>"
                },
                {
                    "field": "totaldibayarbefore",
                    "title": "Total Dibayar Sebelumnya",
                    "template": "<span class='style-right'>{{formatRupiah('#: totaldibayarbefore #', '')}}</span>"
                },
                {
                    "field": "totalsudahdibayar",
                    "title": "Total Sudah Dibayar",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalsudahdibayar #', '')}}</span>"
                },
                {
                    "field": "totalsisahutang",
                    "title": "Total Sisa Hutang",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalsisahutang #', '')}}</span>"
                }
            ];


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            $scope.Cetak = function () {
                ////debugger;
                var xxx = $scope.dataPasienSelected.detail;
                var yyy = "aasas";
            }

            $scope.Back = function () {
                //$state.go('DaftarTagihanSupplier')
                $state.go(darisini)
            }

            $scope.CetakKwitansi = function () {
                if ($scope.dataRiwayatSelected == undefined) {
                    toastr.error("Data Belum Dipilih");
                    return
                }

                var stt = 'false'
                if (confirm('View Kwitansi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-sbk=1&noSbk=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.CetakBukti = function () {
                $scope.popUp.center().open();
            }

            $scope.CetakAh = function () {
                var jabatan1 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan1 = $scope.item.DataJabatan1.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan2 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan3 != undefined) {
                    jabatan3 = $scope.item.DataJabatan3.namajabatan;
                }

                var pegawai3 = ''
                if ($scope.item.DataPegawai3 != undefined) {
                    pegawai3 = $scope.item.DataPegawai3.id;
                }


                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&pegawaiPenerima=' + pegawai2 + '&pegawaiPenyerahan=' + pegawai1 + '&pegawaiMengetahui=' + pegawai3
                    + '&jabatanPenerima=' + jabatan2 + '&jabatanPenyerahan=' + jabatan1 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + $scope.pegawaiUser.namalengkap, function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
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
        }
    ]);
});