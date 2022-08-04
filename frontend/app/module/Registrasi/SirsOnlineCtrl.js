define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('SirsOnlineCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout',
        function($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $timeout) {
            $scope.item = {};
            $scope.item2 = {}
            $scope.item3 = {};
            $scope.item4 = {};
            $scope.item5 = {}
            $scope.item6 = {}
             var data2x = [];
            var noreckamar = "";
            var norecbed = "";
            var tt = [];
            let data2 = []
            $scope.isRouteLoading = false
            $scope.jmlbed = [];

            // loadDataJP()
            // loadDataSH()
            // loadDataNilai()
            // loadMap()
            // loadMasterProduk()
            loadCombo()

            // loadAlamat()

            // function loadAlamat() {
            //     medifirstService.get("farmasi/get-alamat?noregistrasi=" + $scope.item.noRegistrasi).then(function(e) {
            //         if ($scope.item.jenisPenjamin == undefined)
            //             $scope.item.jenisPenjamin = e.data.kelompokpasien
            //         $scope.item.alamatPasien = e.data.alamatlengkap
            //     })
            // }

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
                    loadTT()
                } else if (value === 6) {
                    loadSDM()
                } else if (value === 7) {
                    loadMapping()
                }
            };

            $scope.gridPelayanan = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
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
            $scope.klikGrid = function(selectedTT) {

                if (selectedTT != undefined) {
                    $scope.item.namaruanganx = selectedTT.namaruangan
                    $scope.item.namakamarx = selectedTT.namakamar
                    $scope.item.jmlbedx = selectedTT.qtybed
                    $scope.item.ttonline = { id: selectedTT.kodesirs, namasirs: selectedTT.namasirs }
                    noreckamar = selectedTT.noreckamar
                }
            }

            $scope.klikMapping = function(selectedMapping) {
                debugger;
                if (selectedMapping != undefined) {
                    debugger;
                    $scope.item.namaruanganx2 = selectedMapping.namaruangan
                    $scope.item.namakamarx2 = selectedMapping.namakamar
                    $scope.item.bedx2 = selectedMapping.namaexternal
                    $scope.item.kelasx2 = selectedMapping.namakelas
                    $scope.item.kodeisrsx2 = selectedMapping.idttsirs
                    norecbed = selectedMapping.norec
                        // $scope.item.ttonline = { id: selectedTT.kodesirs, namasirs: selectedTT.namasirs }
                        // noreckamar = selectedTT.noreckamar
                }
            }
            $scope.saveMapping = function() {
                debugger;
                var objSave = {
                    norecbed: norecbed,
                    kodesirs: $scope.item.kodeisrsx2

                }
                medifirstService.postSIRS('Fasyankesupdatesirsbed/' + 'post', objSave).then(function(e) {
                    // toastr.success(e.data.fasyankes[0].message)
                    // loadMapping()
                })

            }
            $scope.gridJenisPemeriksaan = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "ri_suspect_l",
                        "title": "Suspect Laki-laki",
                        "width": 110,
                    },
                    {
                        "field": "ri_suspect_p",
                        "title": "Suspect Perempuan",
                        "width": 110,
                    },
                    {
                        "field": "ri_confirm_l",
                        "title": "Konfirmasi Laki-laki",
                        "width": 110,
                    },
                    {
                        "field": "ri_confirm_p",
                        "title": "Konfirmasi Perempuan",
                        "width": 110,
                    },
                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridKomorbid = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_confirm_l",
                        "title": "Isolasi Tanpa Tekanan Negatif Konfirmasi Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_confirm_p",
                        "title": "Isolasi Tanpa Tekanan Negatif Konfirmasi Perempuan",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_suspect_l",
                        "title": "Isolasi Tanpa Tekanan Negatif Suspect Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_suspect_p",
                        "title": "Isolasi Tanpa Tekanan Negatif Suspect Perempuan",
                        "width": 110,
                    },

                    {
                        "field": "isolasi_tekanan_negatif_confirm_l",
                        "title": "Isolasi Tekanan Negatif Konfirmasi Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_confirm_p",
                        "title": "Isolasi Tekanan Negatif Konfirmasi Perempuan",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_suspect_l",
                        "title": "Isolasi Tekanan Negatif Suspect Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_suspect_p",
                        "title": "Isolasi Tekanan Negatif Suspect Perempuan",
                        "width": 110,
                    },

                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridNonKomorbid = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_confirm_l",
                        "title": "Isolasi Tanpa Tekanan Negatif Konfirmasi Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_confirm_p",
                        "title": "Isolasi Tanpa Tekanan Negatif Konfirmasi Perempuan",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_suspect_l",
                        "title": "Isolasi Tanpa Tekanan Negatif Suspect Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tanpa_tekanan_negatif_suspect_p",
                        "title": "Isolasi Tanpa Tekanan Negatif Suspect Perempuan",
                        "width": 110,
                    },

                    {
                        "field": "isolasi_tekanan_negatif_confirm_l",
                        "title": "Isolasi Tekanan Negatif Konfirmasi Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_confirm_p",
                        "title": "Isolasi Tekanan Negatif Konfirmasi Perempuan",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_suspect_l",
                        "title": "Isolasi Tekanan Negatif Suspect Laki",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_suspect_p",
                        "title": "Isolasi Tekanan Negatif Suspect Perempuan",
                        "width": 110,
                    },

                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridPasienKeluar = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "sembuh",
                        "title": "Sembuh",
                        "width": 110,
                    },
                    {
                        "field": "discarded",
                        "title": "Discarded",
                        "width": 110,
                    },
                    {
                        "field": "dirujuk",
                        "title": "Di Rujuk",
                        "width": 110,
                    },
                    {
                        "field": "isman",
                        "title": "Isman",
                        "width": 110,
                    },
                    {
                        "field": "aps",
                        "title": "APS",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_komorbid",
                        "title": "Meninggal Komorbi",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_tanpa_komorbid",
                        "title": "Meninggal Tanpa Komorbid",
                        "width": 110,
                    },

                    {
                        "field": "meninggal_prob_pre_komorbid",
                        "title": "Meninggal Probable Prenatal Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_neo_komorbid",
                        "title": "Meninggal Probable Neonatal Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_bayi_komorbid",
                        "title": "Meninggal Probable Bayi Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_balita_komorbid",
                        "title": "Meninggal Probable Balita Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_anak_komorbid",
                        "title": "Meninggal Probable Anak Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_remaja_komorbid",
                        "title": "Meninggal Probable Remaja Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_dws_komorbid",
                        "title": "Meninggal Probable Dewasa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_lansia_komorbid",
                        "title": "Meninggal Probable Lansia Komorbid",
                        "width": 110,
                    },


                    {
                        "field": "meninggal_prob_pre_tanpa_komorbid",
                        "title": "Meninggal Probable Prenatal Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_neo_tanpa_komorbid",
                        "title": "Meninggal Probable Neonatal Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_bayi_tanpa_komorbid",
                        "title": "Meninggal Probable Bayi Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_balita_tanpa_komorbid",
                        "title": "Meninggal Probable Balita Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_anak_tanpa_komorbid",
                        "title": "Meninggal Probable Anak Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_remaja_tanpa_komorbid",
                        "title": "Meninggal Probable Remaja Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_dws_tanpa_komorbid",
                        "title": "Meninggal Probable Dewasa Tanpa Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_prob_lansia_tanpa_komorbid",
                        "title": "Meninggal Probable Lansia Tanpa Komorbid",
                        "width": 110,
                    },

                    {
                        "field": "meninggal_discarded_komorbid",
                        "title": "Meninggal Discarded Komorbid",
                        "width": 110,
                    },
                    {
                        "field": "meninggal_discarded_tanpa_komorbid",
                        "title": "Meninggal Discarded Tanpa Komorbid",
                        "width": 110,
                    },

                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridTT = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "tt.xlsx",
                    allPages: true,
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "TT",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "id_tt",
                        "title": "id",
                        "width": 20,
                    }, {
                        "field": "id_t_tt",
                        "title": "id tt di SIRS Online",
                        "width": 150,
                    }, {
                        "field": "ruang",
                        "title": "Namaruangan",
                        "width": 150,
                    },
                    {
                        "field": "tt",
                        "title": "Tempat Tidur",
                        "width": 110,
                    },
                    {
                        "field": "jumlah_ruang",
                        "title": "Jumlah Ruang",
                        "width": 110,
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": 110,
                    },
                    {
                        "field": "terpakai",
                        "title": "Terpakai",
                        "width": 110,
                    },
                    {
                        "field": "kosong",
                        "title": "Kosong",
                        "width": 110,
                    },

                    {
                        "field": "kosong",
                        "title": "Kosong",
                        "width": 110,
                    },

                    {
                        "field": "jmlbedrs",
                        "title": "Jumlah Bed Di RS",
                        "width": 110,
                    },
                    {
                        "field": "ruangan",
                        "title": "Nama Ruangan Di RS",
                        "width": 110,
                    },




                ],
            };

            // $scope.dropDownPegawai = function(container, options) {
            //     
            //     var editor = $('<input kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listPegawai" data-bind="value:' + options.field + '"/>')
            //         .appendTo(container);
            // };
            $scope.columnDaftarTT = {

                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "namaruangan",
                        "title": "ID",
                        "width": 30,
                    },
                    {
                        "field": "namakamar",
                        "title": "Tempat Tidur",
                        "width": 110,
                    },
                    {
                        "field": "qtybed",
                        "title": "Jumlah Ruang",
                        "width": 110,
                    },
                    {
                        "field": "namasirs",
                        "title": "TT di SIRS ONLINE",
                        "width": 110,
                        // "editor": $scope.dropDownPegawai,
                        // "template": "#=ttddokter.text#"
                        //  { field: "ttddokter", title: "TTD Dokter", width: 100  ,editor: $scope.dropDownPegawai,template: "#=ttddokter.text#"},
                    }
                    // ,
                    // {
                    //     "field": "status",
                    //     "title": "Verifikasi",
                    //     "width": 110,
                    //     "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >KIRIM</button> ",
                    // },

                ],
            };
            $scope.gridSDM = {

                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "id_kebutuhan",
                        "title": "ID",
                        "width": 30,
                    },
                    {
                        "field": "kebutuhan",
                        "title": "Kebutuhan",
                        "width": 110,
                    },
                    {
                        "field": "jumlah_eksisting",
                        "title": "Jumlah Eksisting",
                        "width": 110,
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": 110,
                    },
                    {
                        "field": "jumlah_diterima",
                        "title": "Jumlah Diterima",
                        "width": 110,
                    },
                    {
                        "field": "tglupdate",
                        "title": "Tgl update",
                        "width": 110,
                    },

                ],
            };

            $scope.gridMapping = {

                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "namaruangan",
                        "title": "Nama RUangan",
                        "width": 110,
                    },
                    {
                        "field": "namakamar",
                        "title": "Nama Kamar",
                        "width": 110,
                    },
                    {
                        "field": "namaexternal",
                        "title": "Nama Bed",
                        "width": 110,
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": 110,
                    },
                    {
                        "field": "idttsirs",
                        "title": "Kode SIRS",
                        "width": 110,
                    },

                ],
            };


            function loadCombo() {
                // medifirstService.get('laboratorium/get-combo-map-lab').then(function (e) {
                //     $scope.listJenisProduk = e.data.jenisproduk
                //     $scope.listJK = e.data.jeniskelamin
                //     $scope.listKelompokUmur = e.data.kelompokumur
                //     $scope.listProduk = e.data.produk
                //     $scope.listSatuan = e.data.satuanstandar
                //     $scope.listJenisPemeriksaan = e.data.detailjenisproduk
                // })
            }

            function loadDataJP() {
                var nama = ''
                if ($scope.item.cariJenisPemeriksaan != undefined) {
                    nama = $scope.item.cariJenisPemeriksaan
                }
                medifirstService.postSIRS('LapV2/PasienMasuk/get', {}).then(function(e) {
                    if (e.data.RekapPasienMasuk.length == undefined) {
                        $scope.sourceJenisPemeriksaan = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienMasuk.length; i++) {
                        const element = e.data.RekapPasienMasuk[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienMasuk.sort(function(a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.sourceJenisPemeriksaan = e.data.RekapPasienMasuk
                        // $scope.listJenisPemeriksaan = e.data.data
                })
            }
            var timeoutPromise
            $scope.$watch('item.tanggal', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("tanggal", newVal)
                    }
                }, 500)
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#grid1").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter1 = function() {
                var dataGrid = $("#grid1").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item = {};
            }
            $scope.SaveJP = function() {
                if ($scope.item.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item.tglsave1).format('YYYY-MM-DD')
                medifirstService.postSIRS('LapV2/PasienMasuk/post', { 'tgl': tgl }).then(function(e) {
                    toastr.success(e.data.RekapPasienMasuk[0].message)
                    $scope.BatalJP()
                    loadDataJP()
                        // loadCombo()
                })

            }
            $scope.BatalJP = function() {
                $scope.item = {}
            }
            $scope.HapusJP = function() {
                if ($scope.selectedJenisPemeriksaan == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postSIRS('LapV2/PasienMasuk/delete', { 'tgl': $scope.selectedJenisPemeriksaan.tanggal }).then(function(e) {
                    toastr.success(e.data.RekapPasienMasuk[0].message)
                    $scope.BatalJP()
                    loadDataJP()
                        // loadCombo()
                })
            }

            function loadMap() {

                medifirstService.postSIRS('LapV2/PasienDirawatKomorbid/get', {}).then(function(e) {
                    if (e.data.RekapPasienDirawatKomorbid.length == undefined) {
                        $scope.sourceKomorbid = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienDirawatKomorbid.length; i++) {
                        const element = e.data.RekapPasienDirawatKomorbid[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienDirawatKomorbid.sort(function(a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.sourceKomorbid = e.data.RekapPasienDirawatKomorbid
                        // $scope.listJenisPemeriksaan = e.data.data
                })
            }
            var timeoutPromise
            $scope.$watch('item2.tanggal', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter2("tanggal", newVal)
                    }
                }, 500)
            })

            function applyFilter2(filterField, filterValue) {
                var dataGrid = $("#grid2").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter2 = function() {
                var dataGrid = $("#grid2").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item2 = {};
            }

            $scope.SaveKom = function() {
                if ($scope.item2.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item2.tglsave1).format('YYYY-MM-DD')
                medifirstService.postSIRS('LapV2/PasienDirawatKomorbid/post', { 'tgl': tgl }).then(function(e) {
                    toastr.success(e.data.RekapPasienDirawatKomorbid[0].message)
                    $scope.BatalKom()
                    loadMap()
                })

            }
            $scope.BatalKom = function() {
                $scope.item2 = {}
                $scope.selectedKomorbid = undefined
            }
            $scope.HapusKom = function() {
                if ($scope.selectedKomorbid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postSIRS('LapV2/PasienDirawatKomorbid/delete', { 'tgl': $scope.selectedKomorbid.tanggal }).then(function(e) {
                    toastr.success(e.data.RekapPasienDirawatKomorbid[0].message)
                    $scope.BatalKom()
                    loadMap()
                })
            }



            // --------------
            function loadDataSH() {

                medifirstService.postSIRS('LapV2/PasienDirawatTanpaKomorbid/get', {}).then(function(e) {
                    if (e.data.RekapPasienDirawatTanpaKomorbid.length == undefined) {
                        $scope.sourceNonKomorbid = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienDirawatTanpaKomorbid.length; i++) {
                        const element = e.data.RekapPasienDirawatTanpaKomorbid[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienDirawatTanpaKomorbid.sort(function(a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.sourceNonKomorbid = e.data.RekapPasienDirawatTanpaKomorbid
                })
            }
            var timeoutPromise
            $scope.$watch('item3.tanggal', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter3("tanggal", newVal)
                    }
                }, 500)
            })

            function applyFilter3(filterField, filterValue) {
                var dataGrid = $("#grid3").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter3 = function() {
                var dataGrid = $("#grid3").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item3 = {};
            }

            $scope.SaveNonKom = function() {
                if ($scope.item3.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item3.tglsave1).format('YYYY-MM-DD')
                medifirstService.postSIRS('LapV2/PasienDirawatTanpaKomorbid/post', { 'tgl': tgl }).then(function(e) {
                    toastr.success(e.data.RekapPasienDirawatTanpaKomorbid[0].message)
                    $scope.BatalNonKom()
                    loadDataSH()
                })

            }
            $scope.BatalNonKom = function() {
                $scope.item3 = {}
                $scope.selectedNonKomorbid = undefined
            }
            $scope.HapusNonKom = function() {
                    if ($scope.selectedNonKomorbid == undefined) {
                        toastr.error('Pilih data dulu')
                        return
                    }
                    medifirstService.postSIRS('LapV2/PasienDirawatTanpaKomorbid/delete', { 'tgl': $scope.selectedNonKomorbid.tanggal }).then(function(e) {
                        toastr.success(e.data.RekapPasienDirawatTanpaKomorbid[0].message)
                        $scope.BatalNonKom()
                        loadDataSH()
                    })
                }
                // ------------

            // --------------
            function loadDataNilai() {

                medifirstService.postSIRS('LapV2/PasienKeluar/get', {}).then(function(e) {
                    if (e.data.RekapPasienKeluar.length == undefined) {
                        $scope.sourcePasienKeluar = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienKeluar.length; i++) {
                        const element = e.data.RekapPasienKeluar[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienKeluar.sort(function(a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.sourcePasienKeluar = e.data.RekapPasienKeluar
                })
            }
            var timeoutPromise
            $scope.$watch('item3.tanggal', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter3("tanggal", newVal)
                    }
                }, 500)
            })

            function applyFilter3(filterField, filterValue) {
                var dataGrid = $("#grid4").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter4 = function() {
                var dataGrid = $("#grid4").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item4 = {};
            }

            $scope.SaveKeluar = function() {
                if ($scope.item4.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item4.tglsave1).format('YYYY-MM-DD')
                medifirstService.postSIRS('LapV2/PasienKeluar/post', { 'tgl': tgl }).then(function(e) {
                    toastr.success(e.data.RekapPasienKeluar[0].message)
                    $scope.BatalKeluar()
                    loadDataNilai()
                })

            }
            $scope.BatalKeluar = function() {
                $scope.item4 = {}
                $scope.selectedPasienKeluar = undefined
            }
            $scope.HapusKeluar = function() {
                    if ($scope.selectedPasienKeluar == undefined) {
                        toastr.error('Pilih data dulu')
                        return
                    }
                    medifirstService.postSIRS('LapV2/PasienKeluar/delete', { 'tgl': $scope.selectedPasienKeluar.tanggal }).then(function(e) {
                        toastr.success(e.data.RekapPasienKeluar[0].message)
                        $scope.BatalKeluar()
                        loadDataNilai()
                    })
                }
                // ------------

            // --------------
            function loadTT() {
                var $total = 0;
                var $total2 = 0;
                medifirstService.getSIRS('Fasyankesbedrs/get', {}).then(function(e) {

                    $scope.jmlbed = e;
                    medifirstService.postSIRS('Fasyankestt/get', {}).then(function(x) {
                        debugger;
                        tt=x;

                        medifirstService.postSIRS('Fasyankes/get', {}).then(function(e) {
                            if (e.data.fasyankes.length == undefined) {
                                $scope.sourceTT = []
                                return
                            }
                            var x = '';
                            // for (let i = 0; i < e.data.fasyankes.length; i++) {
                            //     const element = e.data.fasyankes[i];
                            //     element.no = i + 1;
                            //     if (element.jumlah_ruang == null) {
                            //         $total = parseInt($total) + 0
                            //             // $total2 = parseInt($total) + 0
                            //     } else {
                            //         $total = parseInt($total) + parseInt(element.jumlah_ruang)
                            //             // $total2 = parseInt($total2) + parseInt(element.jmlbedrs)
                            //     }
                            // }
                            for (let i = 0; i < e.data.fasyankes.length; i++) {
                                const element = e.data.fasyankes[i];
                                element.no = i + 1;
                                if (x == '') {
                                    x = element.id_t_tt
                                } else {
                                    x = x + "," + element.id_t_tt
                                }
                                for (let j = 0; j < $scope.jmlbed.data.data.length; j++) {
                                    const element2 = $scope.jmlbed.data.data[j];
                                    element2.no = j + 1;
                                    if (element2.idttsirs == element.id_t_tt) {
                                        element.jmlbedrs = element2.jumlah
                                        element.ruangan = element2.namaruangan
                                        break;
                                    } else {
                                        element.jmlbedrs = 0
                                        element.ruangan = 'Manual'
                                    }

                                }



                            }
                            for (let i = 0; i < e.data.fasyankes.length; i++) {
                                for (let ti = 0; ti < tt.data.length; ti++) {
                                    if(e.data.fasyankes[i].id_t_tt == tt.data[ti].idttsirs){
                                        var data = {};
                                        data = {
                                            id_tt: e.data.fasyankes[i].id_t_tt ,
                                            tt:  e.data.fasyankes[i].tt,
                                            ruang:  e.data.fasyankes[i].ruang,
                                            kode_siranap:  e.data.fasyankes[i].kode_siranap,
                                            jumlah_ruang:  e.data.fasyankes[i].jumlah_ruang,
                                            jumlah:  e.data.fasyankes[i].jumlah,
                                            terpakai:  e.data.fasyankes[i].terpakai,
                                            antrian:  e.data.fasyankes[i].antrian,
                                            prepare:  e.data.fasyankes[i].prepare,
                                            prepare_plan:  e.data.fasyankes[i].prepare_plan,
                                            kosong:  e.data.fasyankes[i].kosong,
                                            covid:  e.data.fasyankes[i].covid,
                                            id_t_tt:  e.data.fasyankes[i].id_t_tt,
                                            tglupdate:  e.data.fasyankes[i].tglupdate
                                            
                                        }
                                          data2x.push(data) 
                                    }
                                }
                            }
                            // return(data2x);
                            // die();

                            // e.data.RekapPasienKeluar.sort(function (a, b) {
                            //     if (a.tanggal < b.tanggal) { return -1; }
                            //     if (a.tanggal > b.tanggal) { return 1; }
                            //     return 0;
                            // })
                            $total = 0;
                            for (let i = 0; i < data2x.length; i++) {
                                const element = data2x[i];
                                element.no = i + 1;
                                if (element.jumlah_ruang == null) {
                                    $total = parseInt($total) + 0
                                        // $total2 = parseInt($total) + 0
                                } else {
                                    $total = parseInt($total) + parseInt(element.jumlah_ruang)
                                        // $total2 = parseInt($total2) + parseInt(element.jmlbedrs)
                                }
                            }
                            $scope.item.totalTT = $total;
                            $scope.item.totalTT2 = $total2;
                            // $scope.sourceTT = e.data.fasyankes
                            $scope.sourceTT = data2x
                            
                        })
                    })
                    
                });
            }
            var timeoutPromise
            $scope.$watch('item5.tanggal', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter5("tt", newVal)
                    }
                }, 500)
            })

            function applyFilter5(filterField, filterValue) {
                var dataGrid = $("#grid5").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter5 = function() {
                var dataGrid = $("#grid5").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item5 = {};
            }
            $scope.lihatTT = function() {
                loadCombo()
                medifirstService.getSIRS('Fasyankesbedrsbelummaping/get', {}).then(function(e) {
                    $scope.dataTT = e.data
                })

                $scope.popupkamar.center().open();
            }
            $scope.saveTT = function(method) {
                medifirstService.postSIRS('Fasyankes/' + method, {}).then(function(e) {
                    toastr.success(e.data.fasyankes[0].message)
                    loadTT()
                })

            }
            $scope.kirim = function(method) {
                var objSave = {
                    noreckamar: noreckamar,
                    nott: $scope.item.ttonline.id

                }
                debugger;
                medifirstService.postSIRS('Fasyankessatuan/' + 'post', objSave).then(function(e) {
                    toastr.success(e.data.fasyankes[0].message)
                    loadTT()
                })

            }
            $scope.hapusTT = function() {
                    if ($scope.selectedTT == undefined) {
                        toastr.error('Pilih data dulu')
                        return
                    }
                    medifirstService.postSIRS('Fasyankes/delete', { 'id_tt': $scope.selectedTT.id_tt }).then(function(e) {
                        toastr.success(e.data.fasyankes[0].message)
                            // $scope.BatalKeluar()
                        loadTT()
                    })
                }
                // ------------

            // --------------
            function loadSDM() {

                medifirstService.postSIRS('Fasyankes/sdm/get', {}).then(function(e) {
                    if (e.data.sdm.length == undefined) {
                        $scope.sourceSDM = []
                        return
                    }
                    for (let i = 0; i < e.data.sdm.length; i++) {
                        const element = e.data.sdm[i];
                        element.no = i + 1
                    }
                    // e.data.RekapPasienKeluar.sort(function (a, b) {
                    //     if (a.tanggal < b.tanggal) { return -1; }
                    //     if (a.tanggal > b.tanggal) { return 1; }
                    //     return 0;
                    // })
                    $scope.sourceSDM = e.data.sdm
                })
            }

            $scope.loadsemua = function() {
                loadMapping()
            }
            $scope.loadtidaksemua = function() {
                medifirstService.postSIRS('Fasyankes/get', {}).then(function(e) {

                    if (e.data.fasyankes.length == undefined) {
                        $scope.sourceTT = []
                        return
                    }
                    var x = '';
                    var y = [];
                    var data = {};
                    for (let i = 0; i < e.data.fasyankes.length; i++) {
                        const element = e.data.fasyankes[i];
                        element.no = i + 1;
                        if (element.id_t_tt != null) {
                            if (x == '') {
                                x = element.id_t_tt
                            } else {
                                x = x + "," + element.id_t_tt
                            }

                        }
                        data = {
                            kodesirs: element.id_t_tt,
                            kodett: element.id_tt,
                            jumlah: parseFloat(element.jumlah)
                        }

                        y.push(data);
                    }
                    debugger;
                    var objSave = {
                        query: 'notin',
                        notin: x,
                        datasirs: y

                    }
                    medifirstService.postSIRS('Fasyankesbed/get', objSave).then(function(e) {
                        debugger;
                        if (e.data.data.length == undefined) {
                            $scope.sourceMapping = []
                            return
                        }
                        for (let i = 0; i < e.data.data.length; i++) {
                            const element = e.data.data[i];
                            element.no = i + 1
                        }
                        // e.data.RekapPasienKeluar.sort(function (a, b) {
                        //     if (a.tanggal < b.tanggal) { return -1; }
                        //     if (a.tanggal > b.tanggal) { return 1; }
                        //     return 0;
                        // })
                        $scope.sourceMapping = e.data.data
                    })

                })

            }

            function loadMapping() {
                var objSave = {
                    query: 'all',
                    kode: $scope.item.kodesirs

                }
                medifirstService.postSIRS('Fasyankesbed/get', objSave).then(function(e) {
                    debugger;
                    if (e.data.data.length == undefined) {
                        $scope.sourceMapping = []
                        return
                    }
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    // e.data.RekapPasienKeluar.sort(function (a, b) {
                    //     if (a.tanggal < b.tanggal) { return -1; }
                    //     if (a.tanggal > b.tanggal) { return 1; }
                    //     return 0;
                    // })
                    $scope.sourceMapping = e.data.data
                })
            }
            var timeoutPromise
            $scope.$watch('item6.tanggal', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter6("kebutuhan", newVal)
                    }
                }, 500)
            })

            function applyFilter6(filterField, filterValue) {
                var dataGrid = $("#grid6").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter6 = function() {
                var dataGrid = $("#grid6").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item6 = {};
            }

            $scope.saveSDM = function() {
                    // if ($scope.item5.tglsave1 == undefined) {
                    //     toastr.error('Pilih tanggal dulu')
                    //     return
                    // }
                    // var tgl = moment($scope.item4.tglsave1).format('YYYY-MM-DD')
                    medifirstService.postSIRS('Fasyankes/sdm/post', {}).then(function(e) {
                        toastr.success(e.data.sdm[0].message)
                            // $scope.BatalKeluar()
                        loadSDM()
                    })

                }
                // $scope.BatalKeluar = function () {
                //     $scope.item4 = {}
                //     $scope.selectedPasienKeluar = undefined
                // }
            $scope.hapusSDM = function() {
                if ($scope.selectedSDM == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postSIRS('Fasyankes/sdm/delete', { 'id_kebutuhan': $scope.selectedSDM.id_kebutuhan }).then(function(e) {
                    toastr.success(e.data.sdm[0].message)
                        // $scope.BatalKeluar()
                    loadSDM()
                })
            }

            function loadCombo() {

                medifirstService.getPart("sysadmin/general/get-combo-sirs", true, true, 10).then(function(data) {
                    $scope.listSIRS = data;
                });
            }

            // ------------
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1