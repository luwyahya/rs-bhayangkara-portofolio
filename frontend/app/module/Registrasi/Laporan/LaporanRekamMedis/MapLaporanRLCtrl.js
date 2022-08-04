define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapLaporanRLCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var dataPost = [];
            $scope.dataSelected = {};
            $scope.dataSelectedKonten = {};

            loadCombo()
            loadProduk()

            function loadCombo() {

                medifirstService.get("registrasi/laporan/get-combo-mapping-rl", true).then(function (dat) {
                    // $scope.listProduk = dat.data.produk
                    $scope.listKelompok = dat.data.kelompokLaporan
                    $scope.listCaraBayar = dat.data.caraBayar
                    $scope.listjenislaporan = dat.data.jenisLaporan
                    $scope.listdataruangan = dat.data.ruanganall
                    $scope.dataGridKonten = dat.data.kelompokLaporan;
                    // $scope.listproduk = dat.data.produk
                });
            }

            function loadProduk() {
                medifirstService.getPart("registrasi/laporan/get-produk-mapping-rl", true, true, 20).then(function (data) {
                    $scope.listproduk = data;
                });
            }


            $scope.Batal = function () {
                delete $scope.item.Produk
                delete $scope.item.jenislaporan;
                delete $scope.item.kelompok;
                delete $scope.item.norec;
                ClickGrid()
                loaaaaaaad()

            }
            $scope.BatalKonten = function () {
                delete $scope.item.namaKonten;
                delete $scope.item.norecKonten;
                $scope.dataGridKonten = $scope.listKelompok;
            }
            $scope.CariKonten = function () {
                delete $scope.item.norecKonten;
                var datalist = $scope.listKelompok
                var resultObject = [search($scope.item.namaKonten, datalist)];
                $scope.dataGridKonten = resultObject;
                console.log(resultObject);
            }

            function search(key, inputArray) {
                for (let i = 0; i < inputArray.length; i++) {
                    if (inputArray[i].kelompoklaporan.toUpperCase() === key.toUpperCase()) {
                        return inputArray[i];
                    }
                }
            }

            $scope.Hapus = function () {

                if ($scope.item.Produk == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }

                var mapping = { norec: $scope.item.norec }
                var objDelete = { mapping: mapping, }

                medifirstService.post('registrasi/laporan/delete-mapping-rl', objDelete).then(function (e) {
                    delete $scope.item.Produk
                    delete $scope.item.jenislaporan;
                    delete $scope.item.kelompok;
                    delete $scope.item.norec;
                    ClickGrid()
                    loaaaaaaad()
                })
            }

            $scope.Simpan = function () {

                if ($scope.item.Produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                if ($scope.item.kelompok == undefined) {
                    alert("Pilih Konten terlebih dahulu!!")
                    return
                }
                var jenislaporan = ""
                if ($scope.gridSelected == undefined) {
                    jenislaporan = $scope.item.jenislaporanC.id
                } else {
                    jenislaporan = $scope.gridSelected.id
                }
                var norec = "";
                if ($scope.item.norec != undefined) {
                    norec = $scope.item.norec
                }

                var mappingproduktolaporanrl = {
                    norec: norec,
                    produkfk: $scope.item.Produk.idproduk,
                    objectjenislaporanfk: jenislaporan,
                    objectkelompokkontenfk: $scope.item.kelompok.id,
                }
                // var objSave =
                //     {
                //         mappingproduktolaporanrl: mappingproduktolaporanrl,
                //     }
                medifirstService.post('registrasi/laporan/save-mapping-rl', mappingproduktolaporanrl).then(function (e) {
                    delete $scope.item.Produk
                    delete $scope.item.jenislaporan;
                    delete $scope.item.kelompok;
                    delete $scope.item.norec;
                    ClickGrid()
                    loaaaaaaad()
                    // window.history.back();
                })

            }

            $scope.Cari = function () {
                loaaaaaaad();
            }

            function loaaaaaaad() {
                var idLap = ""
                if ($scope.item.jenislaporanC != undefined) {
                    var idLap = "idLap=" + $scope.item.jenislaporanC.id
                }
                $scope.gridSelected = undefined
                medifirstService.get("registrasi/laporan/get-mapping-rl?"
                    + idLap).then(function (data) {
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].no = i + 1
                        }
                        $scope.GridSearch = new kendo.data.DataSource({
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.HapusKonten = function () {

                if ($scope.item.norecKonten == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }

                var mapping = { norec: $scope.item.norecKonten }
                var objDelete = { mapping: mapping, }

                medifirstService.post('registrasi/laporan/delete-kelompokproduk-rl', objDelete).then(function (e) {
                    delete $scope.item.norecKonten
                    delete $scope.item.namaKonten;
                    loadCombo();
                })
            }

            $scope.SimpanKonten = function () {

                if ($scope.item.namaKonten == undefined || $scope.item.namaKonten == "") {
                    alert("Isi Dulu Nama Kontennya!!")
                    return
                }
                var x = "";
                if ($scope.item.norecKonten != undefined) {
                    x = $scope.item.norecKonten
                }


                var mapping = { norec: x, nama: $scope.item.namaKonten }
                var objDelete = { mapping: mapping, }

                medifirstService.post('registrasi/laporan/simpan-kelompokproduk-rl', objDelete).then(function (e) {
                    delete $scope.item.norecKonten
                    delete $scope.item.namaKonten;
                    loadCombo();
                })
            }

            $scope.klikGridKonten = function (dataSelectedKonten) {
                $scope.item.namaKonten = dataSelectedKonten.kelompoklaporan
                $scope.item.norecKonten = dataSelectedKonten.id
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.listproduk.add({
                        id: dataSelected.id,
                        idkelompoklaporan: dataSelected.idkelompoklaporan,
                        idproduk: dataSelected.idproduk,
                        jenislaporan: dataSelected.jenislaporan,
                        kelompoklaporan: dataSelected.kelompoklaporan,
                        namaproduk: dataSelected.namaproduk,
                        norec: dataSelected.norec
                    })

                    $scope.item.norec = dataSelected.norec
                }

                $scope.item.Produk = {
                    // id: dataSelected.id,
                    // idkelompoklaporan: dataSelected.idkelompoklaporan,
                    idproduk: dataSelected.idproduk,
                    // jenislaporan: dataSelected.jenislaporan,
                    // kelompoklaporan: dataSelected.kelompoklaporan, 
                    namaproduk: dataSelected.namaproduk,
                    // norec: dataSelected.norec
                }
                $scope.item.kelompok = {
                    id: dataSelected.idkelompoklaporan,
                    kelompoklaporan: dataSelected.kelompoklaporan
                }
                $scope.item.norec = dataSelected.norec
            }

            $scope.clickGrid = function (gridSelected) {
                ClickGrid()
            }
            function ClickGrid() {
                var idKonten = ""
                var idLap = ""
                if ($scope.gridSelected != undefined) {
                    var idKonten = "idKonten=" + $scope.gridSelected.idkelompoklaporan
                    idLap = "&idLap=" + $scope.gridSelected.id
                }
                medifirstService.get("registrasi/laporan/get-mapping-rl?"
                    + idKonten + idLap, true).then(function (dat) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            // $scope.item.Produk = {idproduk:dat.data[i].idproduk,namaproduk:dat.data[i].namaproduk}

                        }
                        $scope.item.kelompok = {
                            id: $scope.gridSelected.idkelompoklaporan,
                            kelompoklaporan: $scope.gridSelected.kelompoklaporan
                        }
                        $scope.dataGrid = dat.data;

                    });
                delete $scope.item.Produk
                delete $scope.item.jenislaporan;
                delete $scope.item.kelompok;
                delete $scope.item.norec;
            }

            $scope.columnGridKonten = [
                {
                    "field": "id",
                    "title": "Kode Konten",
                    "width": "100px",
                },
                {
                    "field": "kelompoklaporan",
                    "title": "Nama Konten",
                    "width": "100px",
                }
            ];

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "idproduk",
                    "title": "Kode Produk",
                    "width": "100px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "100px",
                }
            ];

            $scope.columnGridSeacrh = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "kelompoklaporan",
                    "title": "Konten Laporan",
                    "width": "100px",
                }
            ];
        }
    ]);
});