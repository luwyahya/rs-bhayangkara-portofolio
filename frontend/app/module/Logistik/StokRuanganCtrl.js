define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('StokRuanganCtrl', ['$sce', '$rootScope', '$scope', 'ModelItem', 'DateHelper', '$http', 'MedifirstService',
        function ($sce, $rootScope, $scope, ModelItem, dateHelper, $http, medifirstService) {
            $scope.isRouteLoading = false;
            var init = function () {
                $scope.dataVOloaded = true;
                $scope.isNext = true;
                $scope.isEdit = false;
                $scope.isReport = true;
                $scope.grid1 = true;
                $scope.grid2 = false;
                $scope.dataEdit = false;
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                $scope.now = new Date();
                $scope.cboShow = true;
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
                $scope.ceklispilihManual = function(bool){
                    debugger
                    if(bool){
                       $scope.grid1 = false;
                       $scope.grid2 = true;
                       $scope.dataEdit = true; 
                    }else{
                        $scope.grid1 = true;
                       $scope.grid2 = false;
                       $scope.dataEdit = false;  
                    }
                    
                }
                $scope.item.jmlRows = 10
                $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listSumberDana = dataCombo.asalproduk
                    $scope.sourceRuangan = dataCombo.ruanganall
                    $scope.listKelompokBarang = dataCombo.kelompokproduk2
                    $scope.listJenisBarang = dataCombo.jenisbarang
                    $scope.item.passwordAd = dataCombo.passwordAdjusment
                    $scope.listKelompokpasien = dataCombo.kelompokpasien
                })
            }
            init();
            // $scope.columnGrid = [
            //     {
            //         "field": "noTerima",
            //         "title": "No Terima",
            //         "width": "50px",
            //     },
            //     {
            //         "field": "kodeProduk",
            //         "title": "Kode Produk",
            //         "width": "50px",
            //     },
            //     {
            //         "field": "namaProduk",
            //         "title": "Nama Produk",
            //         "width": "120px",
            //     },
            //     {
            //         "field": "asalProduk",
            //         "title": "Asal Produk",
            //         "width": "80px",
            //     },
            //     {
            //         "field": "qtyProduk",
            //         "title": "Stok",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "qtyProduk",
            //         "title": "OnHand",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "qtyProduk",
            //         "title": "OnOrder",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "satuanStandar",
            //         "title": "Satuan",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "tglKadaluarsa",
            //         "title": "Tgl Kadaluarsa",
            //         "width": "80px",
            //     },
            //     {
            //         "field": "harga",
            //         "title": "Harga",
            //         "width": "70px",
            //         "template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
            //     },
            //     {
            //         "field": "noBatch",
            //         "title": "NoBatch",
            //         "width": "70px"
            //     }
            // ];

            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows

                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var dateNow = new Date();

                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var tglKadaluarsa = kendoGrid.dataItem(row).tglKadaluarsa;
                    if (tglKadaluarsa != null) {
                        var dateEx = new Date(tglKadaluarsa);
                        var diffDays = Math.round(Math.abs((dateEx.getTime() - dateNow.getTime()) / (oneDay)))
                        if (diffDays <= 7) {
                            $(row.cells).addClass("red");
                        }
                    }
                }
            }
            $scope.columnGrid = {
                dataBound: onDataBound,
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Stok Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
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
                scrollable: true,

                pageable: true,
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
                    {
                        "field": "asalProduk",
                        "title": "Asal Produk",
                        "width": "80px",
                    },
                    {
                        "field": "qtyProduk",
                        "title": "Stok",
                        "width": "60px",
                    },
                    // {
                    //     "field": "qtyOnHand",
                    //     "title": "OnHand",
                    //     "width": "60px",
                    // },
                    // {
                    //     "field": "qtyorder",
                    //     "title": "OnOrder",
                    //     "width": "60px",
                    // },
                    {
                        "field": "satuanStandar",
                        "title": "Satuan",
                        "width": "60px",
                    },
                    {
                        "field": "tglKadaluarsa",
                        "title": "Tgl Kadaluarsa",
                        "width": "80px",
                    },
                    {
                        "field": "harga",
                        "title": "Harga Netto Awal",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
                    }, 
                    {
                        "field": "hargajual",
                        "title": "Harga + 25%",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargajual #', '')}}</span>"
                    },
                    {
                        "field": "noBatch",
                        "title": "NoBatch",
                        "width": "70px"
                    }
                ]

            };

            $scope.columnGridStok = {
                dataBound: onDataBound,
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Stok Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
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
                scrollable: true,

                pageable: true,
                // editable: true,  
                columns: [
                    {
                        "field": "kodeproduk",
                        "title": "Kode Produk",
                        "width": "50px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "120px",
                    },
                    {
                        "field": "asalproduk",
                        "title": "Asal Produk",
                        "width": "80px",
                    },
                    {
                        "field": "stokproduk",
                        "title": "Stok",
                        "width": "60px",
                    },
                    {
                    "field": "stokmin",
                    "title": "Stok Minumum",
                    "width": "10%",
                    attributes: {
                            class: "#=stokproduk <= stokmin ? 'red' : ' ' #"
                        },
                    },
                    {
                        "field": "stokmax",
                        "title": "Stok Maximum",
                        "width": "10%",
                        attributes: {
                                class: "#=stokproduk > stokmax ? 'green' : ' ' #",
                            },
                    }
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
            $scope.editStok = function(){                
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }
                debugger
                // $scope.item.norec = $scope.dataSelected.norec;
                $scope.item.kodeproduk = $scope.dataSelected.kodeproduk;
                $scope.item.namaproduk = $scope.dataSelected.namaproduk;
                $scope.item.stokmin = $scope.dataSelected.stokmin;
                $scope.item.stokmax = $scope.dataSelected.stokmax;
                $scope.StokShow.center().open();               
            }
             $scope.SimpanStok = function(){
                debugger
                if ($scope.item.stokmin == undefined) {
                    alert("Stok Minimum Harus Diisi!")
                    return
                }
                if ($scope.item.stokmax == undefined) {
                    alert("Stok Maximum Harus Diisi!")
                    return
                }

                if ($scope.item.stokmin > $scope.item.stokmax) {
                    toastr.error("Stok Minimum Tidak Bisa Lebih Besar Dari Stok Maximum!")
                    return;
                }

                var kodeproduk = "";
                if ($scope.item.kodeproduk != undefined) {
                    kodeproduk = $scope.item.kodeproduk
                }

                var norec = "";
                if ($scope.item.norec != undefined) {
                    norec = $scope.item.norec
                }

                var namaproduk = "";
                if ($scope.item.namaproduk !=undefined) {
                    namaproduk = $scope.item.namaproduk
                }

                var stokmin = "";
                if ($scope.item.stokmin != undefined) {
                    stokmin = $scope.item.stokmin
                }

                var stokmax = "";
                if ($scope.item.stokmax != undefined) {
                    stokmax = $scope.item.stokmax
                }

                var stok = {
                    kodeproduk: kodeproduk,
                    norec:norec,
                    namaproduk: namaproduk,
                    stokmin: stokmin,
                    stokmax: stokmax
                }

                var objSave = {
                    stok:stok
                }
                medifirstService.post('logistik/save-edit-stok',objSave).then(function (e) {
                    initData()
                })
                $scope.StokShow.close();
            }

            $scope.BatalStok = function(){
                $scope.item.kodeProduk = undefined;
                $scope.item.namaProduk = undefined;
                $scope.item.stokmin = undefined;
                $scope.item.stokmax = undefined;
                $scope.StokShow.close();
            }
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
            $scope.KlikGrids = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected
                }
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function initData() {
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
                    ruanganId = $scope.item.ruangan.id
                }

                var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                }
                var kelompokpasien = "&kelompokpasien=1"
                if ($scope.item.kelompokpasien != undefined) {
                    kelompokpasien = "&kelompokpasien=" + $scope.item.kelompokpasien.id
                }

                medifirstService.get('logistik/get-stok-ruangan-detail?' +
                    'kelompokprodukid=' + kelBarang +
                    '&jeniskprodukid=' + jenBarang +
                    '&namaproduk=' + $scope.item.namaProduk +
                    '&ruanganfk=' + ruanganId +
                    '&asalprodukfk=' + asalProdukId +
                    KdSirs1 + KdSirs2 + kelompokpasien +
                    '&jmlRows=' + jmlRows).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.detail;
                        var datasOrder = data.data.detailorder;
                        var stokproduk = data.data.stok;
                        var subTotal = 0; //harga
                        var stok = 0; //qtyProduk
                        var totalAll = 0;
                        var total = 0;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            subTotal = subTotal + parseFloat(datas[i].harga);
                            stok = stok + parseFloat(datas[i].qtyProduk);
                            datas[i].total = parseFloat(datas[i].qtyProduk) * parseFloat(datas[i].harga);
                            total = total + parseFloat(datas[i].total);
                            datas[i].qtyorder = 0
                            for (var j = datasOrder.length - 1; j >= 0; j--) {
                                if (datasOrder[j].objectprodukfk == datas[i].kodeProduk) {
                                    if (datas[i].qtyProduk > datasOrder[j].qty) {
                                        datas[i].qtyorder = datasOrder[j].qty
                                        datasOrder[j].qty = 0
                                    } else {
                                        datas[i].qtyorder = datas[i].qtyProduk
                                        datasOrder[j].qty = datasOrder[j].qty - datas[i].qtyProduk
                                    }

                                }

                            }
                            datas[i].qtyOnHand = datas[i].qtyProduk
                            if (datas[i].qtyorder != 0) {
                                datas[i].qtyOnHand = datas[i].qtyProduk - datas[i].qtyorder
                            }
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
                        $scope.dataGrid2 = new kendo.data.DataSource({
                            data: stokproduk,
                            total: stokproduk.length,
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

            $scope.cari = function () {
                initData()
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


            $scope.InputTgl = function () {                
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }
                $scope.norec_Spd = $scope.dataSelected.norec_spd;
                $scope.idProduk = $scope.dataSelected.kodeProduk;
                $scope.noTerimaFk = $scope.dataSelected.nostrukterimafk
                $scope.item.TglKadaluarsa = moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.cboShow = false
                $scope.updateShow = true
            }
              $scope.InputTgl = function () {                
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }
                
                $scope.updateShow = true
                $scope.norec_Spd = $scope.dataSelected.norec_spd;
                $scope.idProduk = $scope.dataSelected.kodeProduk;
                $scope.noTerimaFk = $scope.dataSelected.nostrukterimafk
                $scope.item.TglKadaluarsa = moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.cboShow = false
                $scope.updateShow = true
            }

            $scope.SimpanTgl = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }

                var objSave = {
                    'norec_spd': $scope.dataSelected.norec_spd,
                    'produkfk': $scope.dataSelected.kodeProduk,
                    'nostruterimafk': $scope.dataSelected.nostrukterimafk,
                    'tanggal':moment($scope.item.TglKadaluarsa).format('YYYY-MM-DD HH:mm')
                }

                medifirstService.post('logistik/update-tglkadaluarsa-spd', objSave).then(function (e) {
                    $scope.item.TglKadaluarsa = undefined;
                    $scope.norec_Spd = undefined;
                    $scope.idProduk = undefined;
                    $scope.noTerimaFk = undefined
                    $scope.cboShow = true
                    $scope.updateShow = false
                })
            }

            $scope.HapusTgl = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }

                var objSave = {
                    'norec_spd': $scope.dataSelected.norec_spd,
                    'produkfk': $scope.dataSelected.kodeProduk,
                    'nostruterimafk': $scope.dataSelected.nostrukterimafk,
                    'tanggal':moment($scope.item.TglKadaluarsa).format('YYYY-MM-DD HH:mm')
                }

                medifirstService.post('logistik/update-hapus-tglkadaluarsa-spd', objSave).then(function (e) {
                    // $scope.item.TglKadaluarsa = undefined;
                    // $scope.norec_Spd = undefined;
                    // $scope.idProduk = undefined;
                    // $scope.noTerimaFk = undefined
                    // $scope.cboShow = true
                    // $scope.updateShow = false
                })
            }

            $scope.batalTgl = function () {
                $scope.item.TglKadaluarsa = undefined;
                $scope.norec_Spd = undefined;
                $scope.idProduk = undefined;
                $scope.noTerimaFk = undefined
                $scope.cboShow = true
                $scope.updateShow = false
            }

            var norec_spd ='';
            var nostruterimafk = '';
            $scope.Adjustment = function(){                
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }
                norec_spd = $scope.dataSelected.norec_spd;
                nostruterimafk = $scope.dataSelected.nostrukterimafk;
                $scope.item.idProduk = $scope.dataSelected.kodeProduk
                $scope.item.namaProduk = $scope.dataSelected.namaProduk;
                $scope.item.QtyReal = parseFloat($scope.dataSelected.qtyProduk);
                $scope.hargaSatuan = parseFloat($scope.dataSelected.harga);  
                 $scope.AdjustmentShow.center().open();                   
            }
              $scope.UbahHarga = function(){                
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Di Pilih")
                    return;
                }
                norec_spd = $scope.dataSelected.norec_spd;
                nostruterimafk = $scope.dataSelected.nostrukterimafk;
                $scope.item.idProduk = $scope.dataSelected.kodeProduk
                $scope.item.namaProduk = $scope.dataSelected.namaProduk;
                $scope.item.QtyReal = parseFloat($scope.dataSelected.qtyProduk);
                $scope.hargaSatuan = parseFloat($scope.dataSelected.harga); 
                $scope.item.asalanggaran = {id:$scope.dataSelected.objectasalprodukfk , asalProduk:$scope.dataSelected.asalanggaran}
               
                $scope.HargaShow.center().open();      
            }

            $scope.SimpanAdjustment = function(){
                $scope.popUp.center().open();
            }

            $scope.BatalAdjustment = function(){
                norec_spd = '';
                nostruterimafk = '';
                $scope.item.idProduk = undefined;
                $scope.item.namaProduk = undefined;
                $scope.item.QtyReal = undefined;
                $scope.item.QtyAdjustment = undefined;
                $scope.hargaSatuan = undefined;
                $scope.AdjustmentShow.close();
            }

            $scope.BatalStokOpname = function(){
                norec_spd = '';
                nostruterimafk = '';
                $scope.item.idProduk = undefined;
                $scope.item.namaProduk = undefined;
                $scope.item.QtyReal = undefined;
                $scope.item.QtyAdjustment = undefined;
                $scope.hargaSatuan = undefined;
                $scope.popUp.close();
                $scope.AdjustmentShow.close();
            }
            $scope.lanjutStokOpname2 = function(){
                $scope.isRouteLoading = true;
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Ruangan Harus Diisi");
                    return
                }

                if ($scope.item.idProduk == undefined) {
                    toastr.error("Produk Belum Dipilih");
                    return
                }

                if ($scope.item.asalanggaran == undefined) {
                    toastr.error("Anggaran Belum Dipilih");
                    return
                }

                if ($scope.dataLogin.id !== 30071 && $scope.dataLogin.id !== 3160) {
                    toastr.error("Anda Tidak Berhak Merubah Data!!!!  ");
                    $scope.isRouteLoading = false;
                    return
                }


                 var objSave = {
                    'namaRuangan': $scope.item.ruangan.namaruangan,
                    'ruanganfk' : $scope.item.ruangan.id,
                    'norec_spd': norec_spd,
                    'produkfk': $scope.item.idProduk ,
                    'nostruterimafk': nostruterimafk,
                    'qtyreal' : $scope.item.QtyReal,
                    'qtyad': parseFloat($scope.item.QtyAdjustment),
                    'harga': parseFloat($scope.hargaSatuan),  
                    'asalproduk': $scope.item.asalanggaran.id                    
                }

                medifirstService.post('logistik/save-adjusment-stok2', objSave).then(function (e) {
                  
                    var objSave2 = { 
                        'produkfk': $scope.item.idProduk,
                        'hargaawal': parseFloat($scope.dataSelected.harga),
                        'hargaakhir': $scope.hargaSatuan
                    }

                    medifirstService.postNonMessage('sysadmin/logging/save-log-ubah-harga', objSave2).then(function (data) { })
                    norec_spd = '';
                    nostruterimafk = '';
                    $scope.item.idProduk = undefined;
                    $scope.item.namaProduk = undefined;
                    $scope.item.QtyReal = undefined;
                    $scope.item.QtyAdjustment = undefined;
                    $scope.item.kataKunciPass = undefined;
                    $scope.popUp.close();
                    $scope.HargaShow.close();
                    $scope.isRouteLoading = false;
                    $scope.hargaSatuan = 0;

                    //    initData();
                })
            }
            $scope.lanjutStokOpname = function(){
                $scope.isRouteLoading = true;
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Ruangan Harus Diisi");
                    return
                }

                if ($scope.item.idProduk == undefined) {
                    toastr.error("Produk Belum Dipilih");
                    return
                }

                if ($scope.item.kataKunciPass != $scope.item.passwordAd) {
                    toastr.error("Kata kunci / password salah")                                        
                    $scope.item.kataKunciPass = undefined;
                    $scope.isRouteLoading = false;
                    $scope.popUp.close();
                    $scope.AdjustmentShow.close();
                    return
                }
                if ($scope.dataLogin.id !== 30071 && $scope.dataLogin.id !== 3160) {
                    toastr.error("Anda Tidak Berhak Merubah Data!!!!  ");
                    $scope.isRouteLoading = false;
                    return
                }

                 var objSave = {
                    'namaRuangan': $scope.item.ruangan.namaruangan,
                    'ruanganfk' : $scope.item.ruangan.id,
                    'norec_spd': norec_spd,
                    'produkfk': $scope.item.idProduk ,
                    'nostruterimafk': nostruterimafk,
                    'qtyreal' : $scope.item.QtyReal,
                    'qtyad': parseFloat($scope.item.QtyAdjustment),
                    'harga': parseFloat($scope.hargaSatuan)                    
                }

                medifirstService.post('logistik/save-adjusment-stok', objSave).then(function (e) {
                    
                    norec_spd = '';
                    nostruterimafk = '';
                    $scope.item.idProduk = undefined;
                    $scope.item.namaProduk = undefined;
                    $scope.item.QtyReal = undefined;
                    $scope.item.QtyAdjustment = undefined;
                    $scope.item.kataKunciPass = undefined;
                    $scope.popUp.close();
                    $scope.AdjustmentShow.close();
                    $scope.isRouteLoading = false;
                })
            }

            //////////////////////////////////////////////////////////////////       END         ////////////////////////////////////////////////////////////////
        }
    ]);
});