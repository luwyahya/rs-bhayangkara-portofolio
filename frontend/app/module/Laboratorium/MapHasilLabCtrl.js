define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('MapHasilLabCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function($q, $rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.item2 = {}
            $scope.item3 = {};
            $scope.item4 = {};
            $scope.item6 = {};
            $scope.item7 = {};
            $scope.selectedNilaiKritis = {};
            let data2 = []
            let data8 = []
            let data3 = []
            $scope.item2.spasi = 1
            $scope.isRouteLoading = false

            loadCombo()
                // loadDataJP()
                // loadDataSH()
                // loadDataNilai()
                // loadMap()
                // loadMasterProduk()

            $scope.onTabChanges = function(value) {
                if (value === 1) {
                    loadDataJP()
                } else if (value === 2) {
                    loadMap()
                } else if (value === 3) {
                    loadDataSH()
                } else if (value === 4) {
                    loadDataNilai()
                } else if (value === 5) {
                    loadMasterProduk()
                } else if (value === 6) {
                    loadNilaiKritis()
                }
            };
            $scope.gridPelayanan = {

                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": 110,
                    },
                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jenisproduk",
                        "title": "Jenis Produk",
                        "width": 110,
                    },

                ],
            };
            $scope.gridJenisPemeriksaan = {

                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jenisproduk",
                        "title": "Jenis Produk",
                        "width": 110,
                    },
                    {
                        "field": "namadepartemen",
                        "title": "Departemen",
                        "width": 110,
                    },
                    {
                        "field": "kodeexternal",
                        "title": "Kode Ekternal",
                        "width": 80,
                    },
                    {
                        "field": "namaexternal",
                        "title": "Nama Eksternal",
                        "width": 80,
                    },
                    {
                        "field": "statusenabled",
                        "title": "Status Enabled",
                        "width": 60,
                    },
                ],
            };
            $scope.gridSH = {
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },

                    {
                        "field": "statusenabled",
                        "title": "Status Enabled",
                        "width": 60,
                    },
                ],

            }
            $scope.gridNilai = {
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "metode",
                        "title": "Metode Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": 110,
                    },
                    {
                        "field": "kelompokumur",
                        "title": "Kelompok Umur",
                        "width": 110,
                    },
                    {
                        "field": "nilaimin",
                        "title": "Nilai Min",
                        "width": 90,
                    },
                    {
                        "field": "nilaimax",
                        "title": "Nilai Max",
                        "width": 90,
                    },
                    {
                        "field": "nilaitext",
                        "title": "Nilai Teks",
                        "width": 110,
                    },
                    {
                        "field": "statusenabled",
                        "title": "Status Enabled",
                        "width": 60,
                    },
                    {
                        "field": "tipedata",
                        "title": "Tipe Data",
                        "width": 60,
                    }
                ],

            }
            $scope.gridDataMap = {
                selectable: 'row',
                pageable: true,
                columns: [

                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": 110,
                    },
                    {
                        "field": "detailpemeriksaan",
                        "title": "Detail Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "nourutjenispemeriksaan",
                        "title": "No Urut Jenis",
                        "width": 90,
                    },
                    {
                        "field": "nourutdetail",
                        "title": "No Urut Detail",
                        "width": 90,
                    },

                    {
                        "field": "satuanstandar",
                        "title": "Satuan Hasil",
                        "width": 110,
                    },
                    {
                        "field": "memohasil",
                        "title": "Memo Hasil Pemeriksa",
                        "width": 200,
                    },
                ],
            }

            $scope.columnMapNilai = [{
                    "field": "detailpemeriksaan",
                    "title": "Detail Pemeriksaan",
                    "width": 60,
                },
                {
                    "field": "nourutdetail",
                    "title": "No Urut Detail",
                    "width": 60,
                },
                {
                    "field": "nourutjenis",
                    "title": "No Urut Jenis",
                    "width": 60,
                },
                {
                    "field": "satuanstandarfk",
                    "title": "Satuan Hasil",
                    "width": 60,
                },
                {
                    "field": "memohasil",
                    "title": "Memo",
                    "width": 60,
                },
                {
                    "field": "jeniskelamin",
                    "title": "JK",
                    "width": 60,
                },
                {
                    "field": "kelompokumur",
                    "title": "Kel. Umur",
                    "width": 110,
                },
                {
                    "field": "nilainormal",
                    "title": "Nilai Normal",
                    "width": 110,
                }
            ];
            $scope.columnMapNilaiKritis = [{
                    "field": "detailpemeriksaan",
                    "title": "Detail Pemeriksaan",
                    "width": 60,
                },
                {
                    "field": "nourutdetail",
                    "title": "No Urut Detail",
                    "width": 60,
                },
                {
                    "field": "nourutjenis",
                    "title": "No Urut Jenis",
                    "width": 60,
                },
                {
                    "field": "satuanstandarfk",
                    "title": "Satuan Hasil",
                    "width": 60,
                },
                {
                    "field": "memohasil",
                    "title": "Memo",
                    "width": 60,
                },
                {
                    "field": "kelompokumur",
                    "title": "Kel. Umur",
                    "width": 110,
                },
                {
                    "field": "nilaikritis",
                    "title": "Nilai Kritis",
                    "width": 110,
                }
            ];
            $scope.cariJP = function() {
                loadDataJP()
            }
            $scope.cariSH = function() {
                loadDataSH()
            }
            $scope.cariNilai = function() {
                loadDataNilai()
            }

            function onSelect(e) {

            }

            function loadCombo() {
                medifirstService.get('laboratorium/get-combo-map-lab').then(function(e) {
                    $scope.listJenisProduk = e.data.jenisproduk
                    $scope.listJK = e.data.jeniskelamin
                    $scope.listKelompokUmur = e.data.kelompokumur
                    $scope.listProduk = e.data.produk
                    $scope.listSatuan = e.data.satuanstandar
                    $scope.listJenisPemeriksaan = e.data.detailjenisproduk


                })
            }

            function loadDataJP() {
                var nama = ''
                if ($scope.item.cariJenisPemeriksaan != undefined) {
                    nama = $scope.item.cariJenisPemeriksaan
                }
                medifirstService.get('laboratorium/get-data-jenis-pemeriksaan?nama=' + nama).then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceJenisPemeriksaan = e.data.data
                        // $scope.listJenisPemeriksaan = e.data.data
                })
            }
            $scope.cari = function() {
                $scope.treeSourceRuangan = [];
                medifirstService.get("laboratorium/get-mappinglab?kdjenisproduk=" + $scope.item3.jenismpemeriksaan.id, true).then(function(dat) {

                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: dat.data,
                        // check: onCheck,
                        schema: {
                            model: {
                                // children: "child"
                            }
                        }
                    });
                    $scope.treeSourceRuangan = inlineDefault
                    $scope.mainTreeViewOptionRuangan = {
                        dataTextField: ["title"],
                        select: onSelect,
                        dragAndDrop: true,
                        // checkboxes: true
                    }

                });
            }
            $scope.cari2 = function() {
                $scope.treeSourceRuangan2 = [];
                medifirstService.get("laboratorium/get-mappinglab2?kdjenisproduk=" + $scope.item3.detailjenismpemeriksaanfix.id, true).then(function(dat) {

                    var inlineDefault2 = new kendo.data.HierarchicalDataSource({
                        data: dat.data,
                        // check: onCheck,
                        schema: {
                            model: {
                                // children: "child"
                            }
                        }
                    });
                    $scope.treeSourceRuangan2 = inlineDefault2
                    $scope.mainTreeViewOptionRuangan2 = {
                        dataTextField: ["title"],
                        select: onSelect,
                        dragAndDrop: true,
                        children: false,
                        checkboxes: true
                    }
                    $scope.item3.nourutdetailpemeriksaan = dat.data[1].nourut;
                });
            }
            $scope.SaveJP = function() {
                if ($scope.item.detailjenisproduk == undefined) {
                    toastr.error('Jenis Pemeriksaan Belum di isi')
                    return
                }
                if ($scope.item.jenisproduk == undefined) {
                    toastr.error('Jenis Produk Belum di isi')
                    return
                }

                let json = {
                    'id': $scope.item.id != undefined ? $scope.item.id : '',
                    'detailjenisproduk': $scope.item.detailjenisproduk,
                    'objectjenisprodukfk': $scope.item.jenisproduk.id,
                    // 'statusenabled': $scope.item.statusenabled,
                    'kodeexternal': $scope.item.kodeexternal != undefined ? $scope.item.kodeexternal : null,
                    'namaexternal': $scope.item.namaexternal != undefined ? $scope.item.namaexternal : null,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-detail-jenis', json).then(function(e) {
                    $scope.BatalJP()
                    loadDataJP()
                    loadCombo()
                })

            }
            $scope.BatalJP = function() {
                $scope.item.id = undefined
                $scope.item.detailjenisproduk = undefined
                $scope.item.jenisproduk = undefined
                $scope.item.kodeexternal = undefined
                $scope.item.namaexternal = undefined
            }
            $scope.HapusJP = function() {
                if ($scope.selectedJenisPemeriksaan == undefined) {
                    toastr.error('Pilih Jenis Pemeriksaan dulu')
                    return
                }
                let json = {
                    'id': $scope.selectedJenisPemeriksaan.id,
                    'method': 'delete'
                }
                medifirstService.post('laboratorium/save-detail-jenis', json).then(function(e) {
                    $scope.BatalJP()
                    loadDataJP()
                    loadCombo()
                })

            }
            $scope.klikJp = function(da) {
                    $scope.item.id = da.id
                    $scope.item.detailjenisproduk = da.detailjenisproduk
                    $scope.item.jenisproduk = { id: da.jenisprodukfk, jenisproduk: da.jenisproduk }
                    $scope.item.kodeexternal = da.kodeexternal
                    $scope.item.namaexternal = da.namaexternal
                        // $scope.item.statusenabled = da.statusenabled
                }
                // satuan standar
            function loadDataSH() {
                var nama = ''
                if ($scope.item3.cariSatuanHasil != undefined) {
                    nama = $scope.item3.cariSatuanHasil
                }
                medifirstService.get('laboratorium/get-data-satuan-hasil?nama=' + nama).then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceSH = e.data.data
                })
            }
            $scope.SaveSH = function() {
                if ($scope.item3.satuanstandar == undefined) {
                    toastr.error('Satuan Standar Belum di isi')
                    return
                }


                let json = {
                    'id': $scope.item3.id != undefined ? $scope.item3.id : '',
                    'satuanstandar': $scope.item3.satuanstandar,
                    // 'statusenabled': $scope.item3.statusenabled,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-satuan', json).then(function(e) {
                    $scope.BatalSH()
                    loadDataSH()
                    loadCombo()
                })

            }
            $scope.BatalSH = function() {
                $scope.item3.id = undefined
                $scope.item3.satuanstandar = undefined
            }
            $scope.HapusSH = function() {
                if ($scope.selectedSH == undefined) {
                    toastr.error('Pilih Satuan Hasil dulu')
                    return
                }
                let json = {
                    'id': $scope.selectedSH.id,
                    'method': 'delete'
                }
                medifirstService.post('laboratorium/save-satuan', json).then(function(e) {
                    $scope.BatalSH()
                    loadDataSH()
                    loadCombo()
                })

            }
            $scope.klikSH = function(da) {
                $scope.item3.id = da.id
                $scope.item3.satuanstandar = da.satuanstandar
                $scope.item3.statusenabled = da.statusenabled
            }

            // nilai normal
            function loadDataNilai() {
                var nama = ''
                if ($scope.item4.cariNilaiNormal != undefined) {
                    nama = $scope.item4.cariNilaiNormal
                }
                medifirstService.get('laboratorium/get-data-nilai-normal?nama=' + nama).then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceNilai = e.data.data
                        // $scope.listNilaiNormal = e.data.data
                })
            }
            $scope.SaveNilai = function() {
                var $chek = "";
                if ($scope.item4.metode == undefined) {
                    toastr.error('Metode Belum di isi')
                    return
                }
                if ($scope.item4.jeniskelamin == undefined) {
                    toastr.error('Jenis Kelamin Belum di isi')
                    return
                }
                if ($scope.item4.kelompokumur == undefined) {
                    toastr.error('Kelompok Umur Belum di isi')
                    return
                }
                if ($scope.item4.nilaimin == undefined) {
                    toastr.error('Nilai Min Belum di isi')
                    return
                }
                if ($scope.item4.nilaimax == undefined) {
                    toastr.error('Nilai Max Belum di isi')
                    return
                }
                if ($scope.item4.nilaitext == undefined) {
                    toastr.error('Nilai Teks Belum di isi')
                    return
                }
                if ($scope.item.cekinteger == undefined && $scope.item.cekstring == undefined) {
                    toastr.error('Pilih Type Data String/integer')
                    return
                }

                if ($scope.item.cekinteger == undefined || $scope.item.cekinteger == "") {
                    $chek = 2;
                }
                if ($scope.item.cekstring == undefined || $scope.item.cekstring == "") {
                    $chek = 1;
                }


                let json = {
                    'id': $scope.item4.idnilai,
                    'metode': $scope.item4.metode,
                    'objectjeniskelaminfk': $scope.item4.jeniskelamin.id,
                    'kelompokumurfk': $scope.item4.kelompokumur.id,
                    'nilaimin': $scope.item4.nilaimin,
                    'nilaimax': $scope.item4.nilaimax,
                    'nilaitext': $scope.item4.nilaitext,
                    'tipedata': $chek,

                    // 'statusenabled': $scope.item4.statusenabled,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-nilai-normal', json).then(function(e) {
                    $scope.BatalNilai()
                    loadDataNilai()
                    loadCombo()
                })

            }
            $scope.BatalNilai = function() {
                $scope.item4.id = undefined
                $scope.item4.metode = undefined
                $scope.item4.jeniskelamin = undefined
                $scope.item4.kelompokumur = undefined
                $scope.item4.nilaimin = undefined
                $scope.item4.nilaimax = undefined
                $scope.item4.nilaitext = undefined
            }
            $scope.HapusNilai = function() {
                if ($scope.selectedNilai == undefined) {
                    toastr.error('Pilih Satuan Hasil dulu')
                    return
                }
                let json = {
                    'id': $scope.selectedNilai.id,
                    'method': 'delete'
                }
                medifirstService.post('laboratorium/save-nilai-normal', json).then(function(e) {
                    $scope.BatalNilai()
                    loadDataNilai()
                    loadCombo()
                })

            }
            $scope.klikNilai = function(da) {
                $scope.item4.idnilai = da.id
                $scope.item4.metode = da.metode
                $scope.item4.jeniskelamin = { id: da.objectjeniskelaminfk, jeniskelamin: da.jeniskelamin }
                $scope.item4.kelompokumur = { id: da.kelompokumurfk, kelompokumur: da.kelompokumur }
                $scope.item4.nilaimin = da.nilaimin
                $scope.item4.nilaimax = da.nilaimax
                $scope.item4.nilaitext = da.nilaitext
                    // if (da.tipedata == 1){
                    //     find('[type=checkbox]').prop('checked', true)
                    // }else{
                    //     find('[type=checkbox]').prop('checked', true)
                    // }

            }


            $scope.$watch('item2.jeniskelamin', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    getNilaiNormal(newValue.id, $scope.item2.kelompokumur != undefined && $scope.item2.kelompokumur.kelompokumur != '-' ? $scope.item2.kelompokumur.id : '-')
                }
            });
            $scope.$watch('item2.kelompokumur', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    getNilaiNormal($scope.item2.jeniskelamin != undefined && $scope.item2.kelompokumur.kelompokumur != '-' ? $scope.item2.jeniskelamin.id : '-', newValue.id)
                }
            });
            $scope.$watch('item7.kelompokumur', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    getNilaiKritis(newValue.id)
                }
            });

            function getNilaiNormal(jenis, kelompok) {
                if (jenis != null && kelompok != null) {
                    medifirstService.get('laboratorium/get-data-nilai-normal?nama=&jeniskelaminfk=' + jenis + '&kelompokfk=' + kelompok).then(function(e) {
                        $scope.listNilaiNormal = e.data.data
                    })
                }

            }

            function getNilaiKritis(kelompok) {
                if (kelompok != null) {
                    medifirstService.get('laboratorium/get-data-nilai-kritis?kelompokfk=' + kelompok).then(function(e) {
                        $scope.listNilaiKritis = e.data.data
                    })
                }
            }

            $scope.addNilai = function() {
                debugger

                if ($scope.item2.jeniskelamin == undefined) {
                    toastr.error("Pilih Jenis Kelamin ");
                    return;
                }
                if ($scope.item2.kelompokumur == undefined) {
                    toastr.error("Pilih Kelompok Umur ");
                    return;
                }
                if ($scope.item2.nilainormal == undefined) {
                    toastr.error("Pilih Nilai Normal ");
                    return;
                }

                var nomor = 0
                if ($scope.gridMapNilai == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var iddetail = ""
                if ($scope.item2.iddetail != undefined) {
                    iddetail = $scope.item2.iddetail;
                }
                var data = {};
                if ($scope.item2.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item2.no) {
                            data.no = $scope.item2.no

                            data.jeniskelaminfk = $scope.item2.jeniskelamin.id
                            data.kelompokumurfk = $scope.item2.kelompokumur.id
                            data.nilainormalfk = $scope.item2.nilainormal.id
                            data.nilainormal = $scope.item2.nilainormal.nilaitext
                            data.kelompokumur = $scope.item2.kelompokumur.kelompokumur
                            data.jeniskelamin = $scope.item2.jeniskelamin.jeniskelamin
                            data.detailpemeriksaan = $scope.item2.detailpemeriksaan != undefined ? $scope.item2.detailpemeriksaan : null
                            data.nourutdetail = $scope.item2.nourutdetail != undefined ? $scope.item2.nourutdetail : null
                            data.nourutjenis = $scope.item2.nourutjenispemeriksaan != undefined ? $scope.item2.nourutjenispemeriksaan : null
                            data.satuanstandarfk = $scope.item2.satuanstandar.id
                            data.memohasil = $scope.item2.memohasil != undefined ? $scope.item2.memohasil : null
                            data.id = $scope.item2.id != undefined ? $scope.item2.id : '',
                                data.produkfk = $scope.item2.namaproduk.id,
                                data.iddetail = iddetail,
                                data2[i] = data;
                            $scope.gridMapNilai = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        jeniskelaminfk: $scope.item2.jeniskelamin.id,
                        kelompokumurfk: $scope.item2.kelompokumur.id,
                        nilainormalfk: $scope.item2.nilainormal.id,
                        nilainormal: $scope.item2.nilainormal.nilaitext,
                        kelompokumur: $scope.item2.kelompokumur.kelompokumur,
                        jeniskelamin: $scope.item2.nilainormal.jeniskelamin,
                        detailpemeriksaan: $scope.item2.detailpemeriksaan != undefined ? $scope.item2.detailpemeriksaan : null,
                        nourutdetail: $scope.item2.nourutdetail != undefined ? $scope.item2.nourutdetail : null,
                        nourutjenis: $scope.item2.nourutjenispemeriksaan != undefined ? $scope.item2.nourutjenispemeriksaan : null,
                        satuanstandarfk: $scope.item2.satuanstandar.id,
                        memohasil: $scope.item2.memohasil != undefined ? $scope.item2.memohasil : null,
                        id: $scope.item2.id != undefined ? $scope.item2.id : '',
                        produkfk: $scope.item2.namaproduk.id,
                        iddetail: iddetail
                    }
                    data2.push(data)
                        // $scope.dataGrid.add($scope.dataSelected)
                    $scope.gridMapNilai = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.item2.iddetail = undefined;
                $scope.batal2();
            }
            $scope.addNilaiKritis = function() {
                debugger

                if ($scope.item7.kelompokumur == undefined) {
                    toastr.error("Pilih Kelompok Umur ");
                    return;
                }
                if ($scope.item7.nilaikritis == undefined) {
                    toastr.error("Pilih Nilai Kritis ");
                    return;
                }

                var nomor = 0
                if ($scope.gridMapNilai == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item7.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item7.no) {
                            data.no = $scope.item7.no

                            data.kelompokumurfk = $scope.item7.kelompokumur.id
                            data.nilainormalfk = $scope.item7.nilaikritis.id
                            data.nilainormal = $scope.item7.nilaikritis.nilaitext
                            data.kelompokumur = $scope.item7.kelompokumur.kelompokumur
                            data.detailpemeriksaan = $scope.item7.detailpemeriksaan != undefined ? $scope.item7.detailpemeriksaan : null
                            data.nourutdetail = $scope.item7.nourutdetail != undefined ? $scope.item7.nourutdetail : null
                            data.nourutjenis = $scope.item7.nourutjenispemeriksaan != undefined ? $scope.item7.nourutjenispemeriksaan : null
                            data.satuanstandarfk = $scope.item7.satuanstandar.id
                            data.memohasil = $scope.item7.memohasil != undefined ? $scope.item7.memohasil : null
                            data.id = $scope.item7.id != undefined ? $scope.item7.id : '',
                                data.produkfk = $scope.item7.namaproduk.id,
                                data2[i] = data;
                            $scope.gridMapNilai = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        kelompokumurfk: $scope.item7.kelompokumur.id,
                        nilaikritisfk: $scope.item7.nilaikritis.id,
                        nilaikritis: $scope.item7.nilaikritis.nilaitext,
                        kelompokumur: $scope.item7.kelompokumur.kelompokumur,
                        detailpemeriksaan: $scope.item7.detailpemeriksaan != undefined ? $scope.item7.detailpemeriksaan : null,
                        nourutdetail: $scope.item7.nourutdetail != undefined ? $scope.item7.nourutdetail : null,
                        nourutjenis: $scope.item7.nourutjenispemeriksaan != undefined ? $scope.item7.nourutjenispemeriksaan : null,
                        satuanstandarfk: $scope.item7.satuanstandar.id,
                        memohasil: $scope.item7.memohasil != undefined ? $scope.item7.memohasil : null,
                        id: $scope.item7.id != undefined ? $scope.item7.id : '',
                        produkfk: $scope.item7.namaproduk.id,
                    }
                    data8.push(data)
                        // $scope.dataGrid.add($scope.dataSelected)
                    $scope.gridMapNilaiKritis = new kendo.data.DataSource({
                        data: data8
                    });
                }
                $scope.batal2();
            }
            $scope.batal2 = function() {
                $scope.item2.jeniskelamin = undefined
                $scope.item2.kelompokumur = undefined
                $scope.item2.nilainormal = undefined
                $scope.item2.no = undefined
            }

            $scope.klikMapNilai = function(dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item2.no = dataSelected.no
                $scope.item2.iddetail = dataSelected.iddetail;
                $scope.item2.jeniskelamin = { id: dataSelected.jeniskelaminfk, jeniskelamin: dataSelected.jeniskelamin };
                $scope.item2.kelompokumur = { id: dataSelected.kelompokumurfk, kelompokumur: dataSelected.kelompokumur };
                getNilaiNormal(dataSelected.jeniskelaminfk, dataSelected.kelompokumurfk)
                $scope.klikMapNilai2();


            }
            $scope.klikMapNilai2 = function() {
                for (var i = $scope.listNilaiNormal.length - 1; i >= 0; i--) {
                    if ($scope.listNilaiNormal[i].id == dataSelected.nilainormalfk) {
                        dataProduk = $scope.listNilaiNormal[i]
                        break;
                    }
                }
                $scope.item2.nilainormal = dataProduk
            }
            $scope.delNilai = function() {

                    // if ($scope.item2.nilainormal == undefined) {
                    //     toastr.error("Pilih Nilai Normal terlebih dahulu!!")
                    //     return;
                    // }
                    var nomor = 0
                    if ($scope.gridMapNilai == undefined) {
                        nomor = 1
                    } else {
                        nomor = data2.length + 1
                    }
                    var data = {};
                    if ($scope.item2.no != undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].no == $scope.item2.no) {
                                data2.splice(i, 1);
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    data2[i].no = i + 1
                                }
                                // data2[i] = data;
                                $scope.gridMapNilai = new kendo.data.DataSource({
                                    data: data2
                                });
                            }
                        }

                    }
                    if ($scope.item2.iddetail != undefined) {
                        let json = {
                            iddetail: $scope.item2.iddetail
                        }
                        medifirstService.post('laboratorium/delete-hasil-lab', json).then(function(e) {

                        })
                    }
                    $scope.item2.iddetail = undefined;
                    $scope.batal2();
                }
                // map hasil
            function loadMap() {
                var nama = ''
                var nourutjenispemeriksaan = ''
                var nourutDetail = ''
                if ($scope.item2.cariPelayanan != undefined) {
                    nama = $scope.item2.cariPelayanan
                }
                if ($scope.item2.cariUrutJenis != undefined) {
                    nourutjenispemeriksaan = $scope.item2.cariUrutJenis
                }
                if ($scope.item2.cariUrutDetail != undefined) {
                    nourutDetail = $scope.item2.cariUrutDetail
                }
                medifirstService.get('laboratorium/get-map-hasil-lab?nama=' + nama + '&nourutjenispemeriksaan=' + nourutjenispemeriksaan +
                    '&nourutdetail=' + nourutDetail).then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceDataMap = e.data.data
                        // $scope.listNilaiNormal = e.data.data
                })


            }

            function lastNumber() {
                medifirstService.get('laboratorium/get-map-hasil-lab-no').then(function(e) {
                    $scope.item2.nourutjenispemeriksaan = e.data

                })
            }
            $scope.cariMap = function() {
                $scope.item2.id = undefined
                loadMap()
                lastNumber()
            }
            $scope.klikDataMap = function(selc) {
                debugger
                data2 = []
                data8 = []
                    //    $scope.item2.nourutjenispemeriksaan = selc.nourutjenis
                $scope.item2.id = selc.id
                $scope.item7.id = selc.id
                $scope.item2.namaproduk = { id: selc.produkfk, namaproduk: selc.namaproduk }
                $scope.item2.satuanstandar = { id: selc.satuanstandarfk, satuanstandar: selc.satuanstandar }
                $scope.item7.namaproduk = { id: selc.produkfk, namaproduk: selc.namaproduk }
                $scope.item7.satuanstandar = { id: selc.satuanstandarfk, satuanstandar: selc.satuanstandar }

                $scope.item2.spasi = selc.spasi
                    // $scope.item2.namaproduk = selc.details
                for (var i = 0; i < selc.details.length; i++) {
                    const el = selc.details[i]
                    var data = {
                        no: i + 1,
                        jeniskelaminfk: el.jeniskelaminfk,
                        kelompokumurfk: el.kelompokumurfk,
                        nilainormalfk: el.nilainormalfk,
                        nilainormal: el.nilaitext,
                        kelompokumur: el.kelompokumur,
                        jeniskelamin: el.jeniskelamin,
                        detailpemeriksaan: selc.detailpemeriksaan,
                        nourutdetail: selc.nourutdetail,
                        nourutjenis: selc.nourutjenispemeriksaan,
                        satuanstandarfk: selc.satuanstandarfk,
                        memohasil: selc.memohasil,
                        id: selc.id,
                        produkfk: selc.produkfk,
                        iddetail: el.id
                    }
                    data2.push(data)
                }
                for (var i = 0; i < selc.detailkritis.length; i++) {
                    const el = selc.detailkritis[i]
                    var data3 = {
                        no: i + 1,
                        kelompokumurfk: el.kelompokumurfk,
                        nilaikritisfk: el.nilaikritisfk,
                        nilaikritis: el.nilaitextkritis,
                        kelompokumur: el.kelompokumur,
                        detailpemeriksaan: selc.detailpemeriksaan,
                        nourutdetail: selc.nourutdetail,
                        nourutjenis: selc.nourutjenispemeriksaan,
                        satuanstandarfk: selc.satuanstandarfk,
                        memohasil: selc.memohasil,
                        id: selc.id,
                        produkfk: selc.produkfk,
                        iddetail: el.id
                    }
                    data8.push(data3)
                }

                // $scope.dataGrid.add($scope.dataSelected)
                $scope.gridMapNilai = new kendo.data.DataSource({
                    data: data2
                });
                $scope.gridMapNilaiKritis = new kendo.data.DataSource({
                    data: data8
                });
                if (selc.detailpemeriksaan)
                    $scope.item2.detailpemeriksaan = selc.detailpemeriksaan
                $scope.item7.detailpemeriksaan = selc.detailpemeriksaan
                if (selc.memohasil)
                    $scope.item2.memohasil = selc.memohasil
                $scope.item7.memohasil = selc.memohasil
                if (selc.nourutdetail)
                    $scope.item2.nourutdetail = selc.nourutdetail
                $scope.item7.nourutdetail = selc.nourutdetail
                if (selc.nourutjenispemeriksaan)
                    $scope.item2.nourutjenispemeriksaan = selc.nourutjenispemeriksaan
                $scope.item7.nourutjenispemeriksaan = selc.nourutjenispemeriksaan
                    // body...
            }
            $scope.saveMapproduk = function() {
                debugger
                let json = {
                    id: $scope.item3.detailjenismpemeriksaanfix.id,
                    nourut: $scope.item3.nourutdetailpemeriksaan,
                    details: $scope.treeSourceRuangan2._data,

                }
                medifirstService.post('laboratorium/save-map-hasil-labmap2', json).then(function(e) {
                    $scope.cari2()
                })
            }
            $scope.deleteMapproduk = function() {
                debugger
                let json = {
                    id: $scope.item3.detailjenismpemeriksaanfix.id,
                    nourut: $scope.item3.nourutdetailpemeriksaan,
                    details: $scope.treeSourceRuangan2._data,

                }
                medifirstService.post('laboratorium/delete-map-hasil-labmap2', json).then(function(e) {
                    $scope.cari2()
                })
            }
            $scope.saveMap = function() {
                let data55 = []
                if ($scope.item2.namaproduk == undefined) {
                    toastr.error("Pilih Pelayanan dahulu!!")
                    return;
                }
                if ($scope.item2.satuanstandar == undefined) {
                    toastr.error("Pilih Satuan Hasil dahulu!!")
                    return;
                }
                if (data2.length == 0) {
                    toastr.error("Nilai Normal Belum di isi!!")
                    return;
                }
                // let loop = loop;
                for (var i = 0; i < $scope.item2.spasi; i++) {
                    var data = {
                        spasi: ' ',
                    }
                    data55.push(data)
                }

                debugger
                let json = {
                    id: $scope.item2.id != undefined ? $scope.item2.id : '',
                    produkfk: $scope.item2.namaproduk.id,
                    detailpemeriksaan: $scope.item2.detailpemeriksaan != undefined ? $scope.item2.detailpemeriksaan : null,
                    nourutdetail: $scope.item2.nourutdetail != undefined ? $scope.item2.nourutdetail : null,
                    nourutjenis: $scope.item2.nourutjenispemeriksaan != undefined ? $scope.item2.nourutjenispemeriksaan : null,
                    satuanstandarfk: $scope.item2.satuanstandar.id,
                    memohasil: $scope.item2.memohasil != undefined ? $scope.item2.memohasil : null,
                    details: data2,
                    detailkritis: data8,
                    dataspasi: data55,
                    spasi: $scope.item2.spasi
                }
                medifirstService.post('laboratorium/save-map-hasil-lab', json).then(function(e) {
                    $scope.batal3()
                    loadMap()
                    loadCombo()
                    lastNumber()
                })
            }
            $scope.batal3 = function() {
                $scope.item2.id = undefined
                $scope.item2.jeniskelamin = undefined
                $scope.item2.kelompokumur = undefined
                $scope.item2.nilainormal = undefined
                $scope.item2.no = undefined
                data2 = []
                $scope.gridMapNilai = new kendo.data.DataSource({
                    data: data2
                });
                $scope.item2.namaproduk = undefined
                $scope.item2.detailpemeriksaan = undefined
                $scope.item2.nourutdetail = undefined
                $scope.item2.satuanstandar = undefined
                $scope.item2.memohasil = undefined
                    //
                $scope.item7.id = undefined
                $scope.item7.jeniskelamin = undefined
                $scope.item7.kelompokumur = undefined
                $scope.item7.nilaikritis = undefined
                $scope.item7.no = undefined
                data8 = []
                $scope.gridMapNilaiKritis = new kendo.data.DataSource({
                    data: data8
                });
                $scope.item7.namaproduk = undefined
                $scope.item7.detailpemeriksaan = undefined
                $scope.item7.nourutdetail = undefined
                $scope.item7.satuanstandar = undefined
                $scope.item7.memohasil = undefined
                    // medifirstService.get('laboratorium/get-map-hasil-lab-no').then(function (e) {
                    //     $scope.item2.nourutjenispemeriksaan  = e.aku
                    //     // $scope.listNilaiNormal = e.data.data
                    // })
                lastNumber()
            }
            $scope.hapusMap = function() {
                if ($scope.selectedDataMap == undefined) {
                    toastr.error("Pilih data dulu!")
                    return;
                }
                medifirstService.post('laboratorium/hapus-map-hasil-lab', { id: $scope.selectedDataMap.id }).then(function(e) {
                    $scope.selectedDataMap == undefined
                    loadMap()
                    loadCombo()
                    lastNumber()
                })

            }
            $scope.batalMap = function() {
                $scope.batal3()
            }
            $scope.dataGridDetail = function(dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "5%",
                        },
                        {
                            "field": "jeniskelamin",
                            "title": "Jenis Kelamin",
                            "width": "25%",

                        },
                        {
                            "field": "kelompokumur",
                            "title": "Kel Umur",
                            "width": "25%",

                        },
                        {
                            "field": "nilaitext",
                            "title": "Nilai Normal",
                            "width": "25%",

                        }

                    ]
                }
            };
            // map hasil
            function loadMasterProduk() {
                var nama = ''
                if ($scope.item4.cariPelayanans != undefined) {
                    nama = $scope.item4.cariPelayanans
                }
                medifirstService.get('laboratorium/get-master-produk?nama=' + nama).then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourcePelayanan = e.data.data
                        // $scope.listNilaiNormal = e.data.data
                })
            }
            $scope.cariPel = function() {
                loadMasterProduk()
            }
            $scope.klikPel = function(e) {
                $scope.item4.id = e.id
                $scope.item4.namaproduk = e.namaproduk
                    // $scope.item4.jenisproduk = { id: e.objectjenisprodukfk, jenisproduk: e.jenisproduk }
                $scope.item4.detailjenisproduk = { id: e.objectdetailjenisprodukfk, detailjenisproduk: e.detailjenisproduk }
            }
            $scope.batalProduk = function() {
                $scope.item4.id = undefined
                $scope.item4.namaproduk = undefined
                    // $scope.item4.jenisproduk = undefined
                $scope.item4.detailjenisproduk = undefined
            }
            $scope.saveProduk = function() {
                if ($scope.item4.id == undefined) {
                    toastr.error("Pilih data dulu!")
                    return;
                }
                let json = {
                    id: $scope.item4.id,
                    detailjenisprodukfk: $scope.item4.detailjenisproduk.id,
                    // jenisprodukfk: $scope.item4.jenisproduk.id,
                }
                medifirstService.post('laboratorium/update-produk', json).then(function(e) {
                    loadMasterProduk()
                    $scope.batalProduk()
                    loadCombo()
                })
            }

            function loadNilaiKritis() {
                var nama = ''
                if ($scope.item6.cariNilaiNormal != undefined) {
                    nama = $scope.item6.cariNilaiNormal
                }
                medifirstService.get('laboratorium/get-data-nilai-kritis?nama=' + nama).then(function(dat) {
                    var kritis = dat.data.data

                    $scope.sourceNilaiKritis = kritis
                })
                $scope.gridNilaiKritis = {
                    selectable: 'row',
                    pageable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": 15,
                        },
                        {
                            "field": "metode",
                            "title": "Metode Pemeriksaan",
                            "width": 110,
                        },
                        {
                            "field": "kelompokumur",
                            "title": "Kelompok Umur",
                            "width": 110,
                        },
                        {
                            "field": "nilaimin",
                            "title": "Nilai Min",
                            "width": 90,
                        },
                        {
                            "field": "nilaimax",
                            "title": "Nilai Max",
                            "width": 90,
                        },
                        {
                            "field": "nilaitext",
                            "title": "Nilai Teks",
                            "width": 110,
                        },
                        {
                            "field": "statusenabled",
                            "title": "Status Enabled",
                            "width": 60,
                        },
                        {
                            "field": "tipedata",
                            "title": "Tipe Data",
                            "width": 60,
                        }
                    ],

                }

            }
            $scope.SaveNilai6 = function() {
                var $chek = "";
                if ($scope.item6.metode == undefined) {
                    toastr.error('Metode Belum di isi')
                    return
                }
                if ($scope.item6.kelompokumur == undefined) {
                    toastr.error('Kelompok Umur Belum di isi')
                    return
                }
                if ($scope.item6.nilaimin == undefined) {
                    toastr.error('Nilai Min Belum di isi')
                    return
                }
                if ($scope.item6.nilaimax == undefined) {
                    toastr.error('Nilai Max Belum di isi')
                    return
                }
                if ($scope.item6.nilaitext == undefined) {
                    toastr.error('Nilai Teks Belum di isi')
                    return
                }
                if ($scope.item6.cekinteger6 == undefined && $scope.item6.cekstring6 == undefined) {
                    toastr.error('Pilih Type Data String/integer')
                    return
                }

                if ($scope.item6.cekinteger6 == undefined || $scope.item6.cekinteger6 == "") {
                    $chek = 2;
                }
                if ($scope.item6.cekstring6 == undefined || $scope.item6.cekstring6 == "") {
                    $chek = 1;
                }


                let json = {
                    'id': $scope.item6.idnilai,
                    'metode': $scope.item6.metode,
                    'kelompokumurfk': $scope.item6.kelompokumur.id,
                    'nilaimin': $scope.item6.nilaimin,
                    'nilaimax': $scope.item6.nilaimax,
                    'nilaitext': $scope.item6.nilaitext,
                    'tipedata': $chek,

                    // 'statusenabled': $scope.item4.statusenabled,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-nilai-kritis', json).then(function(e) {
                    // $scope.BatalNilai()
                    loadNilaiKritis()
                    loadCombo()
                })

            }
            $scope.BatalNilai6 = function() {
                $scope.item6.id = undefined
                $scope.item6.metode = undefined
                $scope.item6.jeniskelamin = undefined
                $scope.item6.kelompokumur = undefined
                $scope.item6.nilaimin = undefined
                $scope.item6.nilaimax = undefined
                $scope.item6.nilaitext = undefined
            }
            $scope.klikNilaiKritis = function(da) {
                $scope.item6.idnilai = da.id
                $scope.item6.metode = da.metode
                $scope.item6.jeniskelamin = { id: da.objectjeniskelaminfk, jeniskelamin: da.jeniskelamin }
                $scope.item6.kelompokumur = { id: da.kelompokumurfk, kelompokumur: da.kelompokumur }
                $scope.item6.nilaimin = da.nilaimin
                $scope.item6.nilaimax = da.nilaimax
                $scope.item6.nilaitext = da.nilaitext
                    // if (da.tipedata == 1){
                    //     find('[type=checkbox]').prop('checked', true)
                    // }else{
                    //     find('[type=checkbox]').prop('checked', true)
                    // }

            }
            $scope.HapusNilai6 = function() {
                    debugger
                    if ($scope.selectedNilaiKritis.id == undefined) {
                        toastr.error('Pilih dahulu datanya !')
                        return
                    }
                    var objSave = {
                        "id": $scope.selectedNilaiKritis.id
                    }
                    medifirstService.post('laboratorium/delete-nilai-kritis', objSave).then(function(e) {
                        loadNilaiKritis()
                        loadCombo()
                    })
                }
                //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1