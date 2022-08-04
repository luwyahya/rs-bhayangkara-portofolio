define(['initialize'], function (initialize) {
    'use strict';
    // initialize.controller('KonversiSatuanCtrl', ['$q', '$rootScope', '$scope', 'manageTataRekening','$state','CacheHelper',
    initialize.controller('MappingJasaPelayananToPegawaiCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterBy = [];
            var dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterByKlikGrid = [];



            Init();
            $scope.listDataFilterBy = [
                { id: 1, name: 'namakaryawan', desc: 'Nama' },
                { id: 2, name: 'jabatan', desc: 'Jabatan' },
                //{ id: 3, name: 'unitbagianinstalasi', desc: 'Bagian' },
                { id: 3, name: 'golongan', desc: 'Golongan' }
            ]
            $scope.Cari = function () {
                var jenispaguid = "&jenispagufk=-"
                if ($scope.item.jenisPagu != undefined) {
                    jenispaguid = "&jenispagufk=" + $scope.item.jenisPagu.id
                }
                var nilai = $scope.item.filterBy.toString()
                var filterBy = $scope.listDataFilterBy[nilai - 1].name
                var namadesc = ''
                if ($scope.item.nama != undefined) {
                    namadesc = $scope.item.nama
                }
                medifirstService.get("remunerasi/get-list-pegawai?field=" + filterBy + "&teks=" + namadesc +
                    jenispaguid
                    , true).then(function (dat) {
                        var data = dat.data.data
                        for (var i = 0; i < data.length; i++) {
                            data[i].no = i + 1
                        }
                        dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterBy = data
                        $scope.dataGrid = dat.data.data;

                    })
            }
            function Init() {

                medifirstService.get("remunerasi/get-data-combo", true).then(function (dat) {
                    $scope.listJenisPagu = dat.data.data

                })

            }

            $scope.klikGridProduk = function (dataSelected) {
                KlikProduk()
            }
            function KlikProduk() {
                // idProduk=$scope.dataSelectedProduk.id;
                // manageTataRekening.getDataTableTransaksi("logistik/get-konversi-satuan?produkfk="+idProduk, true).then(function(dat){
                //     for (var i = 0; i < dat.data.length; i++) {
                //         dat.data[i].no = i+1
                //         $scope.item.satuanstandar_asal = {id:dat.data[i].ssidasal,satuanstandar:dat.data[i].satuanstandar_asal}
                //     }
                //     $scope.dataGrid = dat.data;

                // });
                // kosong();
            }
            $scope.klikGrid = function (dataSelected) {
                dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterByKlikGrid = [dataSelected]
                // $scope.item.satuanstandar_asal = {id:dataSelected.ssidasal,satuanstandar:dataSelected.satuanstandar_asal}
                // $scope.item.satuanstandar_tujuan = {id:dataSelected.ssidtujuan,satuanstandar:dataSelected.satuanstandar_tujuan}
                // $scope.item.nilaikonversi = dataSelected.nilaikonversi
                // $scope.item.norec = dataSelected.norec
            }

            $scope.tambahData = function () {
                if ($scope.item.jenisPagu == undefined) {
                    alert('Pilih jenis pagu!')
                    return;
                }
                var djpid = ''
                if ($scope.item.detailjenispagu != undefined) {
                    djpid = $scope.item.detailjenispagu.id
                }
                var objSave =
                {
                    data: dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterByKlikGrid,
                    jenispaguid: $scope.item.jenisPagu.id,
                    detailjenispaguid: djpid
                }

                medifirstService.post('remunerasi/save-map-jenis-pagu-topegawai', objSave).then(function (e) {
                    TRalalaGetPegwaiPerDetailJenisPagu({ jpid: $scope.item.jenisPagu.id, djpid: djpid })
                })

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.kosongkan = function () {
                kosong();
            }
            $scope.getPegawaiPerJenisPagu = function (data) {
                TRalalaGetPegwaiPerJenisPagu(data)
            }
            function TRalalaGetPegwaiPerJenisPagu(dat) {
                // remunerasi/get-list-pegawai-perjenispagu
                medifirstService.get("remunerasi/get-list-pegawai-perjenispagu?jpid=" + dat.id, true).then(function (dat) {
                    var data2 = dat.data.data
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataGridMap = data2
                    $scope.listDetailJenisPagu = dat.data.detailjenispagu

                })
            }
            $scope.getPegawaiPerDetailJenisPagu = function (dat) {
                TRalalaGetPegwaiPerDetailJenisPagu({ jpid: $scope.item.jenisPagu.id, djpid: $scope.item.detailjenispagu.id })
            }
            function TRalalaGetPegwaiPerDetailJenisPagu(dat) {
                medifirstService.get("remunerasi/get-list-pegawai-perdetailjenispagu?jpid=" + dat.jpid + "&djpid=" + dat.djpid, true).then(function (dat) {
                    var data2 = dat.data.data
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataGridMap = data2
                    // $scope.listDetailJenisPagu = dat.data.detailjenispagu

                })
            }
            $scope.tambahDataAll = function () {
                if ($scope.item.jenisPagu == undefined) {
                    alert('Pilih jenis pagu!')
                    return;
                }
                var djpid = ''
                if ($scope.item.detailjenispagu != undefined) {
                    djpid = $scope.item.detailjenispagu.id
                }
                var objSave =
                {
                    data: dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterBy,
                    jenispaguid: $scope.item.jenisPagu.id,
                    detailjenispaguid: djpid
                }

                medifirstService.post('remunerasi/save-map-jenis-pagu-topegawai', objSave).then(function (e) {
                    TRalalaGetPegwaiPerJenisPagu($scope.item.jenisPagu)
                })

            }
            $scope.HapusdariGridMappingJenisPaguYangSebelahKananYa = function () {
                if ($scope.dataSelectedMap == undefined) {
                    alert("Pilih Pegawai yang akan di hapus dari mapping!!")
                    return;
                }
                var objSave =
                {
                    norec: $scope.dataSelectedMap.norec
                }

                medifirstService.post('remunerasi/save-hapus-map-jenis-pagu', objSave).then(function (e) {
                    TRalalaGetPegwaiPerDetailJenisPagu({ jpid: $scope.item.jenisPagu.id, djpid: $scope.item.detailjenispagu.id })
                })
            }
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "idpegawai",
                    "title": "IDPegawai",
                    "width": "30px",
                },
                {
                    "field": "namakaryawan",
                    "title": "Nama Pegawai",
                    "width": "80px",
                },
                {
                    "field": "jabatan",
                    "title": "Jabatan",
                    "width": "80px",
                },
                {
                    "field": "golongan",
                    "title": "Golongan",
                    "width": "80px",
                }
            ];

            $scope.columnGridMap = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "id",
                    "title": "Id",
                    "width": "30px",
                },
                {
                    "field": "namalengkap",
                    "title": "Nama Pegawai",
                    "width": "80px",
                }
                // ,
                // {
                //     "field": "namakelompokjabatan",
                //     "title": "Kelompok",
                //     "width" : "80px",
                // },
                // {
                //     "field": "namajabatan",
                //     "title": "Jabatan",
                //     "width" : "80px",
                // },
                // {
                //     "field": "jenispegawai",
                //     "title": "Jenis",
                //     "width" : "80px",
                // }
            ];

            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //***********************************

        }
    ]);
});
