define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InventarisSanitasiCtrl', ['$sce', '$rootScope', '$scope', 'ModelItem', 'DateHelper', '$state', 'MedifirstService','CacheHelper',
        function ($sce, $rootScope, $scope, ModelItem, dateHelper, $state, medifirstService,cacheHelper) {
            $scope.isRouteLoading = false;
            var init = function () {
                $scope.dataVOloaded = true;
                $scope.isNext = true;
                $scope.isEdit = false;
                $scope.isReport = true;
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                $scope.now = new Date();
                $scope.item = {
                    kelUser: document.cookie.split(';')[0].split('=')[1]
                };
                if ($scope.item.kelUser === 'logistik' || $scope.item.kelUser === "bagianUmum") {
                    $scope.bukanLogistik = false;
                    $scope.iniFarmasi = true;
                } else {
                    $scope.bukanLogistik = true;
                    $scope.iniFarmasi = false;
                }
                $scope.item.jmlRows = 10
                $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                // $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                medifirstService.get('laundry/get-combo-laundry').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listSumberDana = dataCombo.asalproduk
                    $scope.sourceRuangan = dataCombo.ruanganall
                    $scope.listKelompokBarang = dataCombo.kelompokproduk
                    $scope.listJenisBarang = dataCombo.jenisbarang
                    $scope.item.kelompokBarang = { id: 44, kelompokproduk: 'Barang Sanitasi' }
                })
            }
            init();
    
            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Stok " + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                // filterable: {
                //     extra: false,
                //     operators: {
                //         string: {
                //             contains: "Contains",
                //             startswith: "Starts with"
                //         }
                //     }
                // },
                selectable: 'row',
                // pageable: true,
                // editable: true,  
                columns: [
                    {
                        "field": "noTerima",
                        "title": "No Terima",
                        "width": "50px",
                    },
                    {
                        "field": "kodeProduk",
                        "title": "Kode Produk",
                        "width": "50px",
                    },
                    {
                        "field": "namaProduk",
                        "title": "Nama Produk",
                        "width": "120px",
                    },
                    // {
                    //     "field": "asalProduk",
                    //     "title": "Asal Produk",
                    //     "width": "80px",
                    // },
                    {
                        "field": "qtyProduk",
                        "title": "Stok",
                        "width": "60px",
                    },
                    {
                        "field": "satuanStandar",
                        "title": "Satuan",
                        "width": "60px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px",
                    },
                   
                   
                ]

            };

            $scope.$watch('item.hargaJual', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.hargaJual > 0) {
                        $scope.item.harga = (parseFloat($scope.item.hargaJual) / 125) * 100
                    }
                }
            });

            // $scope.$watch('item.harga', function(newValue, oldValue) {
            //     if (newValue != oldValue  ) {
            //         if ($scope.item.harga > 0) {
            //             $scope.item.hargaJual = (parseFloat($scope.item.harga) /100)*125
            //         }
            //     }
            // });

            $scope.simpan = function () {
                var objSave = {
                    objectprodukfk: $scope.dataSelected.kodeProduk,
                    nostrukterimafk: $scope.dataSelected.nostrukterimafk,
                    harga: $scope.item.harga,
                    norec_spd: $scope.dataSelected.norec_spd,
                    qtyproduk: $scope.item.qtyproduk
                }
                medifirstService.post('', objSave).then(function (data) {
                    $scope.listRuangan = data.data.ruangan
                })
            }
            $scope.klikGrid = function (Data) {
                $scope.item.noterima = Data.noTerima
                $scope.item.namaBarang = Data.namaProduk
                $scope.item.harga = Data.harga
                $scope.item.qtyproduk = Data.qtyProduk
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.cari = function () {
                $scope.isRouteLoading = true;
                var kelBarang, jenBarang, ruanganId, barangId, noTerima, asalProdukId;
                kelBarang = "";
                if ($scope.item.kelompokBarang != undefined) {
                    kelBarang = $scope.item.kelompokBarang.id
                }
                jenBarang = "";
                if ($scope.item.jenisProduk != undefined) {
                    jenBarang = $scope.item.jenisProduk.id
                }
                barangId = "";
                if ($scope.item.namaBarang != undefined) {
                    barangId = $scope.item.namaBarang.id
                }
                noTerima = "";
                if ($scope.item.noTerima != undefined) {
                    noTerima = $scope.item.noTerima
                }
                asalProdukId = "";
                if ($scope.item.asalProduk != undefined) {
                    asalProdukId = $scope.item.asalProduk.id
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                if ($scope.enableNamaRuangan === true && $scope.item.ruanganAsal !== undefined) {
                    ruanganId = $scope.item.ruanganAsal.id
                } else {
                    if($scope.item.ruangan != undefined ){
                        ruanganId = $scope.item.ruangan.id
                    }else{
                        ruanganId =''
                    }
                   
                }

                var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                }

                medifirstService.get('laundry/get-stok-ruangan-linen?' +
                    'kelompokprodukid=' + kelBarang +
                    '&jeniskprodukid=' + jenBarang +
                    '&namaproduk=' + $scope.item.namaProduk +
                    '&ruanganfk=' + ruanganId +
                    '&asalprodukfk=' + asalProdukId +
                    KdSirs1 + KdSirs2 +
                    '&jmlRows=' + jmlRows).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.detail;
                        var subTotal = 0; //harga
                        var stok = 0; //qtyProduk
                        var totalAll = 0;
                        var total = 0;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            subTotal = subTotal + parseFloat(datas[i].harga);
                            stok = stok + parseFloat(datas[i].qtyProduk);
                            datas[i].total = parseFloat(datas[i].qtyProduk) * parseFloat(datas[i].harga);
                            total = total + parseFloat(datas[i].total);
                        }
                        $scope.item.jmlStok = parseFloat(stok).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.jmlRupiah = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });                        
                    })
            }

            $scope.kl = function (current) {
                $scope.current = current;
                console.log(current);
            };

            $scope.Save = function () {
                var listRawRequired = [
                    "item.tanggal|k-ng-model|Tanggal Penutupan"
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var dataArray = [];
                    $scope.dataStokOpname._data.forEach(function (element) {
                        if (element.stokReal !== null) {
                            dataArray.push({
                                "id": element.id,
                                "stokReal": element.stokReal
                            });
                        }
                    })

                    if (dataArray.length !== 0) {
                        var tempData = {
                            "tanggal": DateHelper.getPeriodeFormatted($scope.item.tanggal),
                            "stokProdukGlobal": dataArray
                        }
                        manageSarpras.saveDataSarPras(tempData, "stok-op-name/save-stok-op-name").then(function (e) {
                            console.log(JSON.stringify(e.data));
                            $scope.isNext = true;
                        });
                    } else {
                        window.messageContainer.error('Saldo Real barang belum di isi');
                    }
                } else {
                    ModelItem.showMessages(isValid.messages);
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

            $scope.cetak = function () {
                var strIdRuangan = $scope.item.ruangan.id;

                var stt = 'false'
                if (confirm('View Laporan Data Stok Ruangan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokruangan=1&strIdRuangan=' + strIdRuangan + '&view=' + stt + '&user=' + $scope.dataLogin.namaLengkap, function (response) {
                });
            }

            $scope.batal = function () {
                $scope.item = {};
                init();
            }
            $scope.Ubah = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec_sp,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('RegistrasiLinenCtrl', chacePeriode);
                $state.go('RegistrasiLinen')
                // cacheHelper.set('UbahPenerimaanBarangSuplierCtrl', chacePeriode);
                // $state.go('UbahPenerimaanBarangSuplier')
            }
            //////////////////////////////////////////////////////////////////       END         ////////////////////////////////////////////////////////////////
        }
    ]);
});