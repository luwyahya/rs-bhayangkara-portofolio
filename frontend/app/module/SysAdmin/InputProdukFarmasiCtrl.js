define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('InputProdukFarmasiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', '$timeout', 'MedifirstService',
        function($scope, $state, ModelItem, $mdDialog, $timeout, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.active = true;
            $scope.dataSelected = {};
            var dataLoad = {}
            $scope.kembali = function() { $state.go('MasterProdukFarmasi') }
            load();
            formLoad();
         

            function load() {
                 $scope.item.noreckonversi="-"
                $scope.item.maxHari = 1;
                $scope.item.maxQty = 1;
                $scope.item.minTime = 1;
                $scope.item.maxTime = 1;
                $scope.listverifikasiAnggaran = [
                    { "id": 1, "namaExternal": "t", "namaAlias": "True" },
                    { "id": 2, "namaExternal": "f", "namaAlias": "False" }
                ];

                $scope.listStatusEnabled = [
                    { "id": 1, "status": "t", "statusenabled": "True" },
                    { "id": 0, "status": "f", "statusenabled": "False" }
                ];

               
                LoadCombo()
                if ($state.params.idx != "") {
                  
                    $scope.isRouteLoading = true;
                    $scope.item.id = $state.params.idx;
                    medifirstService.get("sysadmin/master/get-produkbyid?idProduk=" + $scope.item.id, true).then(function(e) {
                        // medifirstService.get("sysadmin/master/get-data-barang-konversi?namaproduk=" + e.data[0].namaproduk, true).then(function (dat) {
                        //     for (var i = 0; i < dat.data.produk.length; i++) {
                        //         dat.data.produk[i].no = i + 1
                        //     }
                        //     $scope.dataGridProduk = dat.data.produk;
                        //     $scope.listsatuanstandar_asal = dat.data.satuanstandar;
                        //     $scope.listsatuanstandar_tujuan = dat.data.satuanstandar;
                        // });
                        medifirstService.get("sysadmin/master/get-konversi-satuan?produkfk=" + $state.params.idx , true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                $scope.item.satuanstandar_asal = { id: dat.data[i].ssidasal, satuanstandar: dat.data[i].satuanstandar_asal }
                            }
                            $scope.dataGridkonversi = dat.data;

                        });
                        var datax = e.data;
                        dataLoad = e.data
                        $scope.isRouteLoading = false;
                        $scope.item.getKelompok = { id: e.data[0].objectkelompokprodukfk, kelompokproduk: e.data[0].kelompokproduk };
                        medifirstService.get("sysadmin/master/get-jenis-produk?kelompokProdukfk=" + e.data[0].objectkelompokprodukfk, true).then(function(dat) {
                            $scope.listJenisProduk = dat.data;
                            $scope.item.jenisProduk = { id: dataLoad[0].objectjenisprodukfk, jenisproduk: dataLoad[0].jenisproduk };
                          
                            $scope.JenisToDetailfix(dataLoad[0].objectjenisprodukfk,e.data[0].objectdetailjenisprodukfk,e.data[0].detailjenisproduk );
                            // $scope.item.detailJenisProduk = { id: e.data[0].objectdetailjenisprodukfk, detailjenisproduk: e.data[0].detailjenisproduk };
                        })
                        
                        $scope.getJP = { id: e.data[0].objectjenisprodukfk, jenisproduk: e.data[0].jenisproduk };
                        $scope.item.id = e.data[0].id;
                        $scope.item.kdprofile = e.data[0].kdprofile;
                        // $scope.item.statusenabled = e.data[0].statusenabled;
                        $scope.item.idx = e.data[0].id;
                        $scope.item.norec = e.data[0].norec;
                        $scope.item.kdProduk = e.data[0].kdproduk;
                        $scope.item.kdProdukIntern = e.data[0].kdproduk_intern;
                        $scope.item.kdBarcode = e.data[0].kdbarcode;
                        $scope.item.kodeBmn = e.data[0].kodebmn;
                        $scope.item.kodeExternal = e.data[0].kodeexternal;
                        $scope.item.namaProduk = e.data[0].namaproduk;
                        $scope.item.maxHari = e.data[0].maxhari;
                        $scope.item.maxQty = e.data[0].maxqty;
                        $scope.item.minTime = e.data[0].mintime;
                        $scope.item.maxTime = e.data[0].maxtime;
                        $scope.item.deskripsiProduk = e.data[0].deskripsiproduk;
                        $scope.item.keterangan = e.data[0].keterangan;
                        $scope.item.namaExternal = e.data[0].namaexternal;
                        $scope.item.reportDisplay = e.data[0].reportdisplay;
                      
                        $scope.item.kategoryProduk = { id: e.data[0].objectkategoryprodukfk, kategoryproduk: "" };
                        $scope.item.generik = { id: e.data[0].objectgenerikfk, name: "" }
                        $scope.item.gProduk = { id: e.data[0].objectgprodukfk, namagproduk: "" }
                        $scope.item.levelProduk = { id: e.data[0].objectlevelprodukfk, levelproduk: "" }
                        $scope.item.kelompokBPJS = { id: e.data[0].objectkelompokprodukbpjsfk, kelompokprodukbpjs: "" }
                        $scope.item.isProdukIntern = e.data[0].isprodukintern;
                        $scope.item.departemen = {
                            id: e.data[0].objectdepartemenfk,
                            namadepartemen: ""
                        }
                        $scope.item.Departemen = { id: 0, namadepartemen: "" }
                        $scope.item.fungsiProduk = { id: e.data[0].objectfungsiprodukfk, fungsiproduk: "" };
                        $scope.item.bentukProduk = { id: e.data[0].objectbentukprodukfk, namabentukproduk: "" };
                        $scope.item.bahanProduk = { id: e.data[0].objectbahanprodukfk, namabahanproduk: "" };
                        $scope.item.typeProduk = { id: e.data[0].objecttypeprodukfk, typeproduk: "" };
                        $scope.item.warnaProduk = { id: e.data[0].objectwarnaprodukfk, warnaproduk: "" };
                        $scope.item.kekuatan = e.data[0].kekuatan;
                        $scope.item.merkProduk = { id: e.data[0].objectmerkprodukfk, merkproduk: "" };
                        $scope.item.detailObat = { id: e.data[0].objectdetailobatfk, name: "" };
                        $scope.item.spesifikasi = e.data[0].spesifikasi
                        $scope.item.golonganProduk = { id: e.data[0].objectgolonganprodukfk, golonganproduk: "" };
                        $scope.item.detailGolonganProduk = { id: e.data[0].objectdetailgolonganprodukfk, detailgolonganproduk: "" };
                        $scope.item.sediaan = { id: e.data[0].objectsediaanfk, reportdisplay: "" };
                        $scope.item.satuanStandar = { id: e.data[0].objectsatuanstandarfk, satuanstandar: e.data[0].objectsatuanstandar };
                        $scope.item.satuanBesar = { id: e.data[0].objectsatuanbesarfk, satuanbesar: e.data[0].objectsatuanbesarfk };
                        $scope.item.satuanKecil = { id: e.data[0].objectsatuankecilfk, satuankecil: e.data[0].objectsatuankecilfk };
                        $scope.item.qtyKalori = e.data[0].qtykalori;
                        $scope.item.qtyKarbohidrat = e.data[0].qtykarbohidrat;
                        $scope.item.qtyLemak = e.data[0].qtylemak;
                        $scope.item.qtyPorsi = e.data[0].qtyporsi;
                        $scope.item.qtyProtein = e.data[0].qtyprotein;
                        $scope.item.qtysatukemasan = e.data[0].qtysatukemasan;
                        $scope.item.qtyterkecil = e.data[0].qtyterkecil;
                        $scope.item.jenisperiksa = { id: e.data[0].objectjenisperiksafk, jenisperiksa: "" };
                        $scope.item.jenisPeriksaPenunjang = { id: e.data[0].objectjenisperiksapenunjangfk, jenisperiksa: "" };
                        $scope.item.nilaiNormal = e.data[0].nilainormal;
                        $scope.item.bahanSample = { id: e.data[0].bahansamplefk, namabahansample: "" };
                        $scope.item.golonganDarah = { id: e.data[0].golongandarahfk, golongandarah: "" };
                        $scope.item.rhesus = { id: e.data[0].rhesusfk, rhesus: "" }
                        $scope.item.account = { id: e.data[0].objectaccountfk, namaaccount: "" };
                        $scope.item.verifikasiAnggaran = { id: e.data[0].verifikasianggaran, namaExternal: "" };
                        $scope.item.statusProduk = { id: e.data[0].objectstatusprodukfk, statusproduk: "" };
                        $scope.item.IsARVDonasi = { id: e.data[0].isarvdonasi, namaExternal: e.data[0].isarvdonasi };
                        $scope.item.IsNarkotika = { id: e.data[0].isnarkotika, namaExternal:e.data[0].isnarkotika };
                        $scope.item.IsPsikotropika = { id: e.data[0].ispsikotropika, namaExternal: e.data[0].ispsikotropika };
                        $scope.item.IsOnkologi = { id: e.data[0].isonkologi, namaExternal: e.data[0].isonkologi };
                        $scope.item.Oot = { id: e.data[0].isoot, namaExternal:  e.data[0].isoot };
                        $scope.item.IsPrekusor = { id: e.data[0].isprekusor, namaExternal: e.data[0].isprekusor };
                        $scope.item.IsVaksinDonasi = { id: e.data[0].isvaksindonasi, namaExternal: e.data[0].isvaksindonasi };
                        $scope.item.produsenProduk = { id: e.data[0].objectprodusenprodukfk, namaprodusenproduk: "" };
                        $scope.item.rekanan = { id: e.data[0].objectrekananfk, namarekanan: "" };
                        $scope.item.persen_individu = e.data[0].persen_individu;
                        $scope.item.persen_kelompok = e.data[0].persen_kelompok;
                        $scope.item.persen_pengirim = e.data[0].persen_pengirim;

                        if (e.data[0].statusenabled == true || e.data[0].statusenabled == 't') {
                            $scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
                        } else {
                            $scope.item.StatusEnabledT = { id: 0, status: "f", statusenabled: "False" }
                        }
                        LoadCombo()
                           initData();
                    })
                } else {
                    LoadCombo()
                    $scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
                }
            }

            function formLoad() {
                $scope.monthSelectorOptions = {
                    start: "year",
                    depth: "year"
                };

                // var data = cacheHelper.get('listPegawai');
                // $scope.filteredData = [];

                // if (data === undefined) {
                //     data = [];
                // }

                var data = [];

                $scope.daftarPegawai = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                    serverFiltering: false
                });

                var timeoutPromise;
                $scope.$watch('item.qnamaPegawai', function(newVal, oldVal) {
                    if (!newVal) return;
                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = $timeout(function() {
                        if (newVal && newVal !== oldVal) {
                            applyFilter("namalengkap", newVal);
                        }
                    }, 500)
                });

                function applyFilter(filterField, filterValue) {
                    
                    var dataGrid = $("#gridDataPegawai").data("kendoGrid");
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

                    if (filterField === "namalengkap") {
                        currentFilters.push({
                            field: filterField,
                            operator: "contains",
                            value: filterValue
                        });
                    } else if (filterField === "statuspegawai") {
                        currentFilters.push({
                            field: filterField,
                            operator: "eq",
                            value: filterValue.statuspegawai
                        });
                    } else if (filterField === "objectjabatanstrukturalfk" || filterField === "objectunitkerjafk") {
                        currentFilters.push({
                            field: filterField,
                            operator: "eq",
                            value: filterValue.id
                        });
                    } else if (filterField === "kategorypegawai") {
                        currentFilters.push({
                            field: filterField,
                            operator: "eq",
                            value: filterValue.kategorypegawai
                        });
                    } else if (filterField === "objectunitkerjapegawaifk") {
                        currentFilters.push({
                            field: filterField,
                            operator: "eq",
                            value: filterValue.id
                        });
                    }
                    // else if (filterField === "namakategorypegawai") {
                    //     currentFilters.push({
                    //         field: filterField,
                    //         operator: "contains",
                    //         value: filterValue.kategorypegawai
                    //     });

                    // } 
                    else if (filterField === "namakategorypegawai") {
                        currentFilters.push({
                            // field: filterField,
                            // operator: "contains",
                            // value: filterValue,
                            field: "namakategorypegawai",
                            operator: function(namakategorypegawai, value) {
                                // 
                                for (var i = 0; i < $scope.item.qstatusPegawai.length; i++) {
                                    var tag = $scope.item.qstatusPegawai[i].kategorypegawai;
                                    if (tag === namakategorypegawai)
                                        return true;
                                }

                                return false;
                            }
                        });


                    } else if (filterField === "namakategorypegawainot") {
                        currentFilters.push({
                            // field: filterField,
                            // operator: "contains",
                            // value: filterValue,
                            field: "namakategorypegawai",
                            operator: function(namakategorypegawai, value) {
                                // 
                                // for (var i = 0; i < $scope.item.qstatusPegawaiNot.length; i++) {
                                //     var tag = $scope.item.qstatusPegawaiNot[i].kategorypegawai;
                                if (namakategorypegawai != 'PNS' && namakategorypegawai != 'BLUD') {
                                    return true;
                                }
                                // }

                                return false;
                            }
                        });


                    } else if (filterField === "tglmasuk") {

                        var date = new Date($scope.item.tglMasuk),
                            y = date.getFullYear(),
                            m = date.getMonth() + 1;

                        if (m < 10) {
                            m = '0' + m;
                        }

                        var filter = y + '-' + m;

                        // var filter = moment( new Date($scope.item.tglMasuk)).format('MMM-YYYY')

                        currentFilters.push({
                            field: filterField,
                            operator: "contains",
                            value: filter
                        });
                    }

                    dataGrid.dataSource.filter({
                        logic: "and",
                        filters: currentFilters
                    });

                    var allData = dataGrid.dataSource.data();
                    var params = dataGrid.dataSource.filter();
                    var query = new kendo.data.Query(allData);
                    $scope.filteredData = query.filter(params).data;
                }

                $scope.listPetugasPelaksana = function() {
                    
                    medifirstService.get("sdm/get-data-pegawai-all-pp?idPegawai=" + $scope.dataItem.id, true).then(function(dat) {
                        var dataForGrid = dat.data
                        $scope.daftarPegawaiPp = new kendo.data.DataSource({
                            data: dataForGrid,
                            pageSize: 10,
                            total: dataForGrid.length,
                            serverPaging: false
                        });
                        $scope.isRouteLoading = false
                    });
                    $scope.popUpPp.center().open()
                }

                $scope.ColumnPetugasPelaksana = {
                    columns: [
                        // {
                        //     "field": "namaruangan",
                        //     "title": "No",
                        //     "width": "30px",
                        // },
                        {
                            'field': "namakpb",
                            'title': "Nama InaCbg",
                            "width": "160px",
                        },
                        {
                            'field': "namajpp",
                            'title': "Nama Pelaksana",
                            "width": "160px",
                        }
                        // {
                        //     "field": "namaproduk",
                        //     "title": "Layanan",
                        //     "width": "160px",
                        //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>"
                        // }

                    ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                }

                $scope.petugasPelaksanaHapus = function() {
                    if ($scope.dataSelected.idkpb != undefined) {
                        var stt = 'false'
                        if (confirm('Hapus Data? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }

                        if (stt === 'true') {
                            $scope.statusenabled = false
                            $scope.flag = false;
                            $scope.simpanPetugas();
                        }
                    } else {
                        messageContainer.error('Data belum di pilih')
                    };

                    // $scope.statusenabled = false
                    // $scope.flag = false;
                    // if ($scope.dataSelected.idkpb != undefined) {
                    //     $scope.item.namakpbs = { idkpb:  $scope.dataSelected.idkpb, kelompokprodukbpjs: $scope.dataSelected.namakpb}
                    //     $scope.item.namajpps = { idjpp:  $scope.dataSelected.idjpp, jenispetugaspe: $scope.dataSelected.namajpp}
                    //     $scope.popUpPelP.center().open()
                    // } else {
                    //     messageContainer.error('Data belum di pilih')
                    // };

                }
                $scope.simpanPetugas = function() {
                    ;
                    // $flag = false 
                    // if($scope.item.namakpbs.idkpb === $scope.item.namakpbs.id && $scope.item.namajpps.idjpp === $scope.item.namajpps.id)
                    if ($scope.statusenabled === false) {
                        var json = {
                            'id': $scope.dataSelected.id,
                            'statusenabled': $scope.statusenabled,
                            'objectpegawaifk': $scope.dataItem.id,
                            'objectkelompokprodukbpjsfk': $scope.dataSelected.idkpb,
                            'objectpetugaspelaksanafk': $scope.dataSelected.idjpp,
                        }
                    } else {
                        if ($scope.item.namakpbs.idkpb === undefined) {
                            $scope.item.namakpbs.idkpb = $scope.item.namakpbs.id
                                // $flag = true
                        }
                        if ($scope.item.namajpps.idjpp === undefined) {
                            $scope.item.namajpps.idjpp = $scope.item.namajpps.id
                                // $flag = true
                        }
                        if ($scope.dataSelected.id === undefined) {
                            $scope.dataSelected.id = null
                        }
                        var json = {
                            'id': $scope.dataSelected.id,
                            'statusenabled': $scope.statusenabled,
                            'objectpegawaifk': $scope.dataItem.id,
                            'objectkelompokprodukbpjsfk': $scope.item.namakpbs.idkpb,
                            'objectpetugaspelaksanafk': $scope.item.namajpps.idjpp,
                        }
                    }
                    if ($scope.flag === true) {
                        medifirstService.post('tatarekening/save-petugas-pelaksana', json).then(function(e) {
                            $scope.saveLogging('Map Petugas Pelaksana', 'IdPegawai',
                                $scope.dataItem.id, 'Penambahan Pelaksana ' + $scope.dataItem.nama + ' ke Kelompok INA-CBG ' + $scope.item.namakpbs.kelompokprodukbpjs + ' ke Kelompok Pelaksana ' + $scope.item.namajpps.jenispetugaspe)
                        })
                    } else {
                        medifirstService.post('tatarekening/update-petugas-pelaksana', json).then(function(e) {
                            if ($scope.statusenabled == true) {
                                $scope.saveLogging('Map Petugas Pelaksana', 'IdPegawai',
                                    $scope.dataItem.id, 'Perubahan Pelaksana ' + $scope.dataItem.nama + ' ke Kelompok INA-CBG ' + $scope.item.namakpbs.kelompokprodukbpjs + ' ke Kelompok Pelaksana ' + $scope.item.namajpps.jenispetugaspe)
                            } else {
                                $scope.saveLogging('Map Petugas Pelaksana', 'IdPegawai',
                                    $scope.dataItem.id, 'Penghapusan Pelaksana ' + $scope.dataItem.nama + ' ke Kelompok INA-CBG ' + $scope.item.namakpbs.kelompokprodukbpjs + ' ke Kelompok Pelaksana ' + $scope.item.namajpps.jenispetugaspe)
                            }
                        })
                    }
                    $scope.popUpPelP.close()
                    $scope.popUpPp.close()
                }

                $scope.TutupPopUpPp = function() {
                    $scope.popUpPp.center().close();
                }

                $scope.petugasPelaksana = function() {
                    $scope.statusenabled = true
                    $scope.flag = false;
                    if ($scope.dataSelected.idkpb != undefined) {
                        $scope.item.namakpbs = { idkpb: $scope.dataSelected.idkpb, kelompokprodukbpjs: $scope.dataSelected.namakpb }
                        $scope.item.namajpps = { idjpp: $scope.dataSelected.idjpp, jenispetugaspe: $scope.dataSelected.namajpp }
                        $scope.popUpPelP.center().open()
                    } else {
                        messageContainer.error('Data belum di pilih')
                    };

                }

                $scope.petugasPelaksanaTam = function() {
                    
                    $scope.dataSelected.id = undefined;
                    $scope.flag = true;
                    $scope.statusenabled = true
                    $scope.item.namakpbs = { idkpb: 0, kelompokprodukbpjs: 0 }
                    $scope.item.namajpps = { idjpp: 0, jenispetugaspe: 0 }
                    $scope.popUpPelP.center().open()
                }
                $scope.daftarpegawaiOpt = {
                    // toolbar: [
                    // "excel",
                    // {text: "export", name:"Export detail", template: '<button ng-click="exportDetail()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export All to Excel</button>'},
                    // {name: "username", text:"Show username", template: '<button ng-click="toogleClick()" class="k-button k-button-icontext k-grid-upload pull-right"><span class="k-icon k-i-refresh"></span>{{username}} Username</button>'}
                    // ],
                    // excel: {
                    //     allPages: true,
                    //     fileName: "RSAB HK Export Data Pegawai-" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY HH:mm:ss') +".xlsx"
                    // },
                    toolbar: [
                        "excel",

                    ],
                    excel: {
                        fileName: "Pegawai.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:L1"];
                        sheet.name = "Pegawai";

                        var myHeaders = [{
                            value: "Pegawai",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    },
                    pageable: true,
                    pageSize: 10, //page size
                    selectable: 'row',
                    scrollable: true,
                    columns: [
                        { field: "nippns", title: "Nip", width: "10%" },
                        { field: "namalengkap", title: "Nama Lengkap", width: "25%" },
                        // {
                        //   field: "NamaUser",
                        //   title: "Username", 
                        //   width: "20%", 
                        //   hidden: true ,
                        //   // template: "# for(var i=0; i < usernames.length;i++){# usernames.usernames.namaUser #}"
                        // },
                        { field: "agama", title: "Agama", width: "10%" },
                        { field: "unitkerja", title: "Unit Kerja", width: "25%" },
                        { field: "namaruangan", title: "Ruangan", width: "25%" },
                        { field: "jbfungsional", title: "Jabatan Fungsional", width: "20%" },
                        { field: "golongan", title: "Golongan", width: "20%" },
                        { field: "pendidikan", title: "Pendidikan", width: "20%" },
                        { field: "petugasdiklat", title: "Diklat", width: "20%" },
                        { field: "jbstruktural", title: "Jabatan Internal", width: "20%", hidden: "true" },
                        { field: "statuspegawai", title: "Status", width: "10%" },
                        { field: "namakategorypegawai", title: "Kategory", width: "10%" },
                        { field: "detailkelompokjabatan", title: "Kelompok Jabatan", width: "20%" },

                        { field: "tglmasuk", title: "TglMasuk", width: "10%", template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>" }
                    ],
                    // set column width to auto
                    excelExport: function(e) {
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function(column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                    },
                    change: function(e) {
                        // ;
                        var grid = $("#gridDataPegawai").data("kendoGrid");
                        var selectedRows = grid.dataItem(grid.select());
                        // for(var i=0; i < $scope.arrayMapAtasan.length; i++){
                        //     if(selectedRows.idPegawai == $scope.arrayMapAtasan[i].pegawai.id){
                        //         if($scope.arrayMapAtasan[i].atasanLangsung) selectedRows.atasanLangsung = $scope.arrayMapAtasan[i].atasanLangsung;
                        //         if($scope.arrayMapAtasan[i].atasanPejabatPenilai) selectedRows.atasanPejabatPenilai = $scope.arrayMapAtasan[i].atasanPejabatPenilai;
                        //         break;
                        //     }
                        // }
                        $scope.dataItem = selectedRows;
                    }
                };

                function LoadDataGrid() {
                    $scope.isRouteLoading = true;
                    medifirstService.get("sdm/get-data-pegawai-all-sdm?", true).then(function(dat) {
                        var dataForGrid = dat.data
                        $scope.daftarPegawai = new kendo.data.DataSource({
                            data: dataForGrid,
                            pageSize: 10,
                            total: dataForGrid.length,
                            serverPaging: false
                        });
                        $scope.isRouteLoading = false
                    });
                }

                // medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                //     var dataCombo = dat.data
                //     
                //     // var dataLogin = dat.datalogin[0];
                //     $scope.listUnitKerja = dataCombo.dataunitkerja;
                //     $scope.ListKedudukanPegawai = dataCombo.statuspegawai;
                //     $scope.ListStatusPegawai = dataCombo.kategorypegawai;
                //     $scope.ListTahunPajak = dataCombo.tahunpajak;
                //     $scope.ListKelompokProdukBpjs = dataCombo.kelompokprodukbpjs;
                //     $scope.ListJenisPetugasPelaksana = dataCombo.jenispetugaspelaksana;
                //     $scope.optStatus = {
                //         placeholder: "Pilih Kategory...",
                //         dataTextField: "kategorypegawai",
                //         dataValueField: "id",
                //         // dataSource:{
                //         //     data: $scope.listRuangan
                //         // },
                //         autoBind: true,

                //     };

                // });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function(data) {
                    $scope.dropDownPegawai = data;
                    LoadDataGrid();
                });
            }


            $scope.KelompokToJenis = function(kelompok) {
                medifirstService.get("sysadmin/master/get-jenis-produk?kelompokProdukfk=" + kelompok.id, true).then(function(dat) {
                    $scope.listJenisProduk = dat.data;
                })
            }
            
            $scope.JenisToDetail = function(jenisProduk) {
                var jenis = $scope.item.jenisProduk.id
                medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + jenis, true).then(function(dat) {
                    $scope.listdetailjenis = dat.data;
                })
            }
             $scope.JenisToDetailfix = function(jenisProduk,id,nama) {
                var jenis = jenisProduk
                medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + jenisProduk, true).then(function(dat) {
                    $scope.listdetailjenis = dat.data;
                      $scope.item.detailJenisProduk = { id:id, detailjenisproduk: nama };
                })
            }

            function LoadCombo() {
                //Menu Kategori get Combo
                if (dataLoad.length == undefined) {
                    var kelompokId = ''
                    var jenisID = ''
                } else {
                    var kelompokId = dataLoad[0].objectkelompokprodukfk
                    var jenisID = dataLoad[0].objectjenisprodukfk
                }

                medifirstService.getPart("sysadmin/master/get-data-combo-rekanan", true, true, 20).then(function(data) {
                    $scope.listrekanan = data.rekanan;
                })

                medifirstService.get("sysadmin/master/get-data-combo-master?kelompokProdukfk=" + kelompokId +
                    "&objectjenisprodukfk=" + jenisID, true).then(function(dat) {
                    var dataCombo = dat.data;
                    
                    $scope.listdetailjenis = dataCombo.kategori.detailjenis;
                    $scope.listgenerik = dataCombo.kategori.generik;
                    $scope.listgproduk = dataCombo.kategori.gproduk;
                    $scope.listkategory = dataCombo.kategori.kategori;
                    $scope.listlevel = dataCombo.kategori.level;
                    $scope.listKelompok = dataCombo.kelompokproduk;
                    $scope.ListKelompokProdukBpjs = dataCombo.kelompokprodukbpjs;
                    $scope.listdetailjenisproduk = dataCombo.detailjenisproduk;
                    $scope.listJenisProduk = dataCombo.jenisproduk;
                    // $scope.listdetailjenis = dataCombo.data;
                    $scope.listfungsiProduk = dataCombo.spesifikasi.fungsiproduk;
                    $scope.listbentukProduk = dataCombo.spesifikasi.bentukproduk;
                    $scope.listbahanproduk = dataCombo.spesifikasi.bahanproduk;
                    $scope.listtypeProduk = dataCombo.spesifikasi.typeproduk;
                    $scope.listwarnaProduk = dataCombo.spesifikasi.warnaproduk;
                    $scope.listmerkProduk = dataCombo.spesifikasi.merkproduk;
                    $scope.listdetailObat = dataCombo.spesifikasi.detailobat;
                    $scope.listGolonganProduk = dataCombo.spesifikasi.golonganproduk;
                    $scope.listdetailgolonganproduk = dataCombo.spesifikasi.detailgolonganproduk;
                    $scope.listSediaan = dataCombo.spesifikasi.reportdisplay;
                    $scope.listsatuanbesar = dataCombo.satuan.besar;
                    $scope.listsatuankecil = dataCombo.satuan.kecil;
                    $scope.listsatuanStandar = dataCombo.satuan.standar;                    
                    $scope.listsatuanstandar_asal = dataCombo.satuan.standar;            
                    $scope.listsatuanstandar_tujuan = dataCombo.satuan.standar;            
                    $scope.listbahansample = dataCombo.penunjang.bahansample;
                    $scope.listJenisPeriksa = dataCombo.penunjang.jenisperiksa;
                    $scope.listJenisPeriksaPenunjang = dataCombo.penunjang.jenisperiksapenunjang;
                    $scope.listgolongandarah = dataCombo.labdarah.golongandarah;
                    $scope.listrhesus = dataCombo.labdarah.rhesus;
                    $scope.listdepartemen = dataCombo.departemen;
                    $scope.listprodusenProduk = dataCombo.produsenproduk;
                    $scope.liststatusProduk = dataCombo.statusproduk;
                    $scope.listaccount = dataCombo.chartofaccount;
                    $scope.listSediaan = dataCombo.spesifikasi.sediaan;

                    if (dataLoad.length != undefined) {
                        $scope.item.kategoryProduk = { id: dataLoad[0].objectkategoryprodukfk, kategoryproduk: dataLoad[0].kategoryproduk };
                        $scope.item.generik = { id: dataLoad[0].objectgenerikfk, name: dataLoad[0].rm_generikname };
                        $scope.item.gProduk = { id: dataLoad[0].objectgprodukfk, namagproduk: dataLoad[0].namagproduk };
                        $scope.item.levelProduk = { id: dataLoad[0].objectlevelprodukfk, levelproduk: dataLoad[0].levelproduk };
                        // $scope.item.item.kelompokBPJS = { id: dataLoad[0].objectkelompokprodukbpjsfk, kelompokprodukbpjs: dataLoad[0].kelompokprodukbpjs };
                        $scope.item.kelompok = { id: dataLoad[0].objectkelompokprodukfk, kelompokproduk: dataLoad[0].kelompokproduk };
                        $scope.item.jenisProduk = { id: dataLoad[0].objectjenisprodukfk, jenisproduk: dataLoad[0].jenisproduk };
                        $scope.item.detailJenisProduk = { id: dataLoad[0].objectdetailjenisprodukfk, detailjenisproduk: dataLoad[0].detailjenisproduk };
                        $scope.item.satuanStandar = { id: dataLoad[0].objectsatuanstandarfk, satuanstandar: dataLoad[0].satuanstandar };
                        $scope.item.satuanBesar = { id: dataLoad[0].objectsatuanbesarfk, satuanbesar: dataLoad[0].satuanstandar };
                        $scope.item.satuanKecil = { id: dataLoad[0].objectsatuankecilfk, satuankecil: dataLoad[0].satuanstandar };
                        $scope.item.fungsiProduk = { id: dataLoad[0].objectfungsiprodukfk, fungsiproduk: dataLoad[0].fungsiproduk };
                        $scope.item.bentukProduk = { id: dataLoad[0].objectbentukprodukfk, namabentukproduk: dataLoad[0].namabentukproduk };
                        $scope.item.bahanProduk = { id: dataLoad[0].objectbahanprodukfk, namabahanproduk: dataLoad[0].namabahanproduk };
                        $scope.item.typeProduk = { id: dataLoad[0].objecttypeprodukfk, typeproduk: dataLoad[0].typeproduk };
                        $scope.item.warnaProduk = { id: dataLoad[0].objectwarnaprodukfk, warnaproduk: dataLoad[0].warnaproduk };
                        $scope.item.merkProduk = { id: dataLoad[0].objectmerkprodukfk, merkproduk: dataLoad[0].merkproduk };
                        $scope.item.detailObat = { id: dataLoad[0].objectdetailobatfk, name: dataLoad[0].detailobat };
                        $scope.item.golonganProduk = { id: dataLoad[0].objectgolonganprodukfk, golonganproduk: dataLoad[0].golonganproduk };
                        $scope.item.detailGolonganProduk = { id: dataLoad[0].objectdetailgolonganprodukfk, detailgolonganproduk: dataLoad[0].detailgolonganproduk };
                        $scope.item.sediaan = { id: dataLoad[0].objectsediaanfk, reportdisplay: dataLoad[0].reportdisplay };
                        $scope.item.departemen = { id: dataLoad[0].objectdepartemenfk, namadepartemen: dataLoad[0].namadepartemen };
                        if (dataLoad[0].statusenabled == true || dataLoad[0].statusenabled == 't') {
                            $scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
                        } else {
                            $scope.item.StatusEnabledT = { id: 0, status: "f", statusenabled: "False" }
                        }
                    } else {
                        $scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
                    }
                })

                medifirstService.get("sysadmin/master/get-data-combo-master", true).then(function(dat) {
                    $scope.listDepartement = dat.data.departemen;
                });
            }

            $scope.tmbhProduk = function() {
                if ($scope.item.kelompokBPJS == undefined) {
                    alert("Pilih Kelompok Produk!!")
                    return;
                }
                var tempData = [];
                if ($scope.selectedDataPlus.length > 0) {
                    for (var i = $scope.selectedDataPlus.length - 1; i >= 0; i--) {
                        var item = {
                            "produkId": $scope.selectedDataPlus[i].id,
                            "kelompokprodukbpjsfk": $scope.item.kelompokBPJS.id
                        }
                        $scope.saveLogging('Map Produk To Kelompok INA-CBG', 'IdPorduk',
                            $scope.selectedDataPlus[i].id, 'Penambahan Produk ' + $scope.selectedDataPlus[i].namaproduk + ' ke Kelompok INA-CBG ' + $scope.item.kelompokBPJS.kelompokprodukbpjs)
                        tempData.push(item);
                    }
                }
                if (tempData.length == 0) {
                    alert('Checklist yang akan di hapus!')
                    return;
                }
                var objSave = [{
                    data: tempData
                }]
                medifirstService.post('sysadmin/master/save-kelompok-produk-bpjs', objSave).then(function(e) {
                    // $scope.saveLogging('Map Produk To Kelompok INA-CBG', 'IdPorduk',
                    // $scope.selectedDataPlus[i].id, 'Penambahan Produk '+$scope.selectedDataPlus[i].namaproduk+' ke Kelompok INA-CBG '+$scope.item.kelompokBPJS.kdkelompokprodukbpjs)
                    loadData()
                })
            }

            $scope.CariBpjs = function() {
                $scope.selectedDataPlus = [];
                var kelompok = ''
                if ($scope.item.detailJenis != undefined) {
                    kelompok = '&detailjenisprodukfk= ' + $scope.item.detailJenis.id
                }
                // var kelompokBPJS2 = ''
                // if ($scope.item.kelompokBPJS != undefined) {
                //     kelompokBPJS2 = '&kelompokBPJS= ' + $scope.item.kelompokBPJS.id
                // }
                medifirstService.get("sysadmin/master/get-detail-produk-kelompok?namaproduk=" + $scope.item.namaProduk + kelompok
                    //  + kelompokBPJS2, true
                ).then(function(dat) {
                    for (var i = 0; i < dat.data.produk.length; i++) {
                        dat.data.produk[i].no = i + 1
                    }
                    $scope.dataGridProduk = dat.data.produk;
                });
            }

            $scope.LoadKelompok = function() {
                $scope.selectedDataMinus = [];
                loadData()
            }

            function loadData() {
                medifirstService.get("sysadmin/master/get-data-produk-kelompok?kelompokprodukbpjsfk=" + $scope.item.kelompokBPJS.id, true).then(function(dat) {
                    for (var i = 0; i < dat.data.produk.length; i++) {
                        dat.data.produk[i].no = i + 1
                    }
                    $scope.dataGridbpjs = dat.data.produk;
                });
            }

            $scope.columnGridProduk = [{
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick2($event)' />",
                    "width": 10
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "id",
                    "title": "Id Produk",
                    "width": "30px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "80px",
                }
            ];

            $scope.columnGrid = [{
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    "width": 10
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "id",
                    "title": "Id Produk",
                    "width": "30px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "80px",
                }
            ];

            $scope.selectedDataPlus = [];
            $scope.onClick2 = function(e) {
                var element2 = $(e.currentTarget);

                var checked2 = element2.is(':checked'),
                    rowplus = element2.closest('tr'),
                    grid = $("#kGridPlus").data("kendoGrid"),
                    dataItemPlus = grid.dataItem(rowplus);

                // $scope.selectedData[dataItemPlus.noRec] = checked;
                if (checked2) {
                    var result2 = $.grep($scope.selectedDataPlus, function(e) {
                        return e.id == dataItemPlus.id;
                    });
                    if (result2.length == 0) {
                        $scope.selectedDataPlus.push(dataItemPlus);
                    } else {
                        for (var i = 0; i < $scope.selectedDataPlus.length; i++)
                            if ($scope.selectedDataPlus[i].id === dataItemPlus.id) {
                                $scope.selectedDataPlus.splice(i, 1);
                                break;
                            }
                        $scope.selectedDataPlus.push(dataItemPlus);
                    }
                    rowplus.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedDataPlus.length; i++)
                        if ($scope.selectedDataPlus[i].norec === dataItemPlus.norec) {
                            $scope.selectedDataPlus.splice(i, 1);
                            break;
                        }
                    rowplus.removeClass("k-state-selected");
                }
            }

            $scope.selectedDataMinus = [];
            $scope.onClick = function(e) {
                // var dataItemMinus = {};
                
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    rowminus = element.closest('tr'),
                    grid = $("#kGridMinus").data("kendoGrid"),
                    dataItemMinus = grid.dataItem(rowminus);

                if (checked) {
                    var result = $.grep($scope.selectedDataMinus, function(e) {
                        return e.id == dataItemMinus.id;
                    });
                    if (result.length == 0) {
                        $scope.selectedDataMinus.push(dataItemMinus);
                    } else {
                        for (var i = 0; i < $scope.selectedDataMinus.length; i++)
                            if ($scope.selectedDataMinus[i].id === dataItemMinus.id) {
                                $scope.selectedDataMinus.splice(i, 1);
                                break;
                            }
                        $scope.selectedDataMinus.push(dataItemMinus);
                    }
                    rowminus.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedDataMinus.length; i++)
                        if ($scope.selectedDataMinus[i].id === dataItemMinus.id) {
                            $scope.selectedDataMinus.splice(i, 1);
                            break;
                        }
                    rowminus.removeClass("k-state-selected");
                }
            }

            $scope.kurangKelompok = function() {
                
                if ($scope.item.kelompokBPJS == undefined) {
                    alert("Pilih Kelompok Produk!!")
                    return;
                }
                var tempData = [];
                if ($scope.selectedDataMinus.length > 0) {
                    for (var i = $scope.selectedDataMinus.length - 1; i >= 0; i--) {
                        var item = {
                            "produkId": $scope.selectedDataMinus[i].id,
                            "kelompokprodukbpjsfk": null
                        }
                        $scope.saveLogging('Map Produk To Kelompok INA-CBG', 'IdPorduk',
                            $scope.selectedDataMinus[i].id, 'Pengurangan Produk ' + $scope.selectedDataMinus[i].namaproduk + ' dari Kelompok INA-CBG ' + $scope.item.kelompokBPJS.kelompokprodukbpjs)
                        tempData.push(item);
                    }
                }
                if (tempData.length == 0) {
                    alert('Checklist yang akan di hapus!')
                    return;
                }
                var objSave = [{
                    data: tempData
                }]
                medifirstService.post('sysadmin/master/save-kelompok-produk-bpjs', objSave).then(function(e) {
                    loadData()
                })
            }

            $scope.RuanganToDepartement = function() {
                
                $scope.listruangan = $scope.item.Departemen.ruangan
            }

            $scope.Save = function() {
                if ($scope.item.kelompok == undefined) {
                    alert("Kelompok Produk Kosong!!!")
                    return
                }

                if ($scope.item.jenisProduk == undefined) {
                    alert("Jenis Produk Kosong!!!")
                    return
                }

                if ($scope.item.detailJenisProduk == undefined) {
                    alert("Detail Jenis Produk Kosong!!!")
                    return
                }

                if ($scope.item.satuanStandar == undefined) {
                    alert("Satuan Standar Kosong!!!")
                    return
                }
                if ($scope.item.kelompokBPJS == undefined) {
                    alert("Kelompok Produk BPS Belum Dipilih!!!")
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan!')
                    .textContent('Apakah anda yakin akan menyimpan data ini?')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')

                $mdDialog.show(confirm).then(function() {
                    $scope.Simpan();
                })
            };

            $scope.jenis = function() {
                medifirstService.get("sysadmin/master/get-jenis-produk?kelompokProdukfk=" + $scope.item.kelompokproduk.id, true).then(function(dat) {
                    $scope.listjenisProduk = dat.data;
                })
            }
            $scope.detailjenis = function() {
                
                medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + $scope.item.jenis.id, true).then(function(dat) {
                    $scope.listdetailjenisProduk = dat.data;
                })
            }
            $scope.CariKodeProduk = function() {
                $scope.KondisiCariSimpan = true;
                var IdProduk;
                if ($scope.item.IdProduk === undefined) {
                    IdProduk = "";
                } else {
                    IdProduk = $scope.item.IdProduk
                } //produk/list-produk?nmProduk=
                medifirstService.get('sysadmin/master/list-produk?kdProduk=' + IdProduk).then(function(e) {
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].statCheckbox = false;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: e.data,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    kdproduk: { editable: false, type: "number" },
                                    kdbarcode: { editable: false, type: "number" },
                                    deskripsiproduk: { editable: false, type: "string" },
                                    namaproduk: { editable: false, type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                    });

                    if ($scope.item.Produk != undefined) {
                        $scope.active = false
                    } else {
                        $scope.active = true
                    }

                    if ($scope.item.ruangan != undefined) {
                        $scope.ruangan();
                    }
                })

            }
            $scope.CariNamaProduk = function() {
                
                $scope.KondisiCariSimpan = true;
                var NamaProduk;
                if ($scope.item.namaProduk === undefined) {
                    NamaProduk = "";
                } else {
                    NamaProduk = $scope.item.namaProduk
                } //produk/list-produk?nmProduk=
                medifirstService.get('sysadmin/master/list-produk?nmProduk=' + NamaProduk).then(function(e) {
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].statCheckbox = false;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: e.data,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    kdproduk: { editable: false, type: "number" },
                                    kdbarcode: { editable: false, type: "number" },
                                    deskripsiproduk: { editable: false, type: "string" },
                                    namaproduk: { editable: false, type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                    });

                    if ($scope.item.namaProduk != undefined) {
                        $scope.active = false
                    } else {
                        $scope.active = true
                    }

                    if ($scope.item.ruangan != undefined) {
                        $scope.ruangan();
                    }
                })
            }

            $scope.mainGridOptions = {
                editable: "popup",
                pageable: true,
                //scrollable: true,
                height: 300,
                selectable: "row",
                columns: $scope.columnProduk,
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startsWith: "Cari Produk",
                            // eq: "Is equal to",
                            // neq: "Is not equal to"
                        }
                    }
                },
            };

            $scope.columnProduk = [{
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                        "# } #",
                    width: "50px"
                },
                {
                    "field": "id",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Id Produk</center>",
                    "width": "85px"

                },
                {
                    "field": "namaproduk",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Nama Produk</center>",
                    "width": "350px"

                }
            ];

            $scope.selectRow = function(dataItem) {
                var dataSelect = _.find($scope.dataSource._data, function(data) {
                    return data.id == dataItem.id;
                });
                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                } else {
                    dataSelect.statCheckbox = true;
                }
                $scope.tempCheckbox = dataSelect.statCheckbox;
                UbahGrid($scope.dataSource._data);
            }

            var isCheckAll = false
            $scope.selectUnselectAllRow = function() {
                var tempData = $scope.dataSource._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }
                UbahGrid(tempData);
            }


            $scope.detailjenisToProduk = function() {
                
                $scope.KondisiCariSimpan = false;
                medifirstService.get("sysadmin/master/get-produkbyIdformap?iddjenis=" + $scope.item.detailjenis.id, true).then(function(dat) {
                    $scope.daftarProduk = dat.data;
                    var daftarProduk = dat.data;
                    for (var i = 0; i < daftarProduk.length; i++) {
                        daftarProduk[i].statCheckbox = false;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        pageSize: 50,
                        data: daftarProduk,
                        $scrollable: true,
                        total: daftarProduk.length
                    });
                    var grid = $('#kGrid').data("kendoGrid");
                    grid.setDataSource($scope.dataSource);
                    grid.refresh();
                    if ($scope.item.detailjenis.id != undefined) {
                        $scope.active = false
                    } else {
                        $scope.active = true
                    }
                    if ($scope.item.ruangan != undefined) {
                        $scope.ruangan();
                    }

                });
            }

            $scope.simpan = function() {
                

                if ($scope.item.kelompok.id == 24) {

                } else {
                    if ($scope.item.maxHari == undefined || $scope.item.maxHari == null || $scope.item.maxHari == '') {
                        alert("maxHari Produk Kosong!!!")
                        return
                    }
                    if ($scope.item.maxQty == undefined || $scope.item.maxQty == null || $scope.item.maxQty == '') {
                        alert("maxQty Produk Kosong!!!")
                        return
                    }
                }

                if ($scope.item.kelompok.id == 1 || $scope.item.kelompok.id == 2) {
                    if ($scope.item.minTime == undefined || $scope.item.minTime == null || $scope.item.minTime == '') {
                        alert("minTime Produk Kosong!!!")
                        return
                    }
                    if ($scope.item.maxTime == undefined || $scope.item.maxTime == null || $scope.item.maxTime == '') {
                        alert("maxTime Produk Kosong!!!")
                        return
                    }
                }

                if ($scope.item.kelompok == undefined) {
                    alert("Kelompok Produk Kosong!!!")
                    return
                }

                if ($scope.item.jenisProduk == undefined) {
                    alert("Jenis Produk Kosong!!!")
                    return
                }

                if ($scope.item.detailJenisProduk == undefined) {
                    alert("Detail Jenis Produk Kosong!!!")
                    return

                }

                if ($scope.item.kelompokBPJS == undefined) {
                    if ($scope.item.jenisProduk.id != 277) {
                        alert("Kelompok Produk BPJS Belum Dipilih !!!")
                        return
                    }
                }
                if ($scope.item.satuanStandar == undefined) {
                    alert("Satuan Standar Kosong!!!")
                    return
                }

                if ($scope.item.StatusEnabledT == undefined) {
                    alert("Status Enabled Kosong!!!")
                    return
                }
                if ($scope.item.minTime == undefined) {
                    $scope.item.minTime = 1;
                }
                if ($scope.item.maxTime == undefined) {
                    $scope.item.maxTime = 1;
                }
               
                var kdproduk = ''
                if ($scope.item.kdProduk != undefined) {
                    kdproduk = $scope.item.kdProduk
                }
                var kdproduk_intern = ''
                if ($scope.item.kdProdukIntern != undefined) {
                    kdproduk_intern = $scope.item.kdProdukIntern
                }
                var kdbarcode = ''
                if ($scope.item.kdBarcode != undefined) {
                    kdbarcode = $scope.item.kdBarcode
                }
                var kodebmn = ''
                if ($scope.item.kodeBmn != undefined) {
                    kodebmn = $scope.item.kodeBmn
                }
                var kodeexternal = ''
                if ($scope.item.kodeExternal != undefined) {
                    kodeexternal = $scope.item.kodeExternal
                }
                var namaproduk = ''
                if ($scope.item.namaProduk != undefined) {
                    namaproduk = $scope.item.namaProduk
                }
                var maxhari = ''
                if ($scope.item.maxHari != undefined) {
                    maxhari = $scope.item.maxHari
                }
                maxhari=1
                var maxqty = ''
                if ($scope.item.maxQty != undefined) {
                    maxqty = $scope.item.maxQty
                }
                maxqty =1;
                var mintime = ''
                if ($scope.item.minTime != undefined) {
                    mintime = $scope.item.minTime
                }
                mintime =1;
                var maxtime = ''
                if ($scope.item.maxTime != undefined) {
                    maxtime = $scope.item.maxTime
                }
                maxtime =1;
                var deskripsiproduk = ''
                if ($scope.item.deskripsiProduk != undefined) {
                    deskripsiproduk = $scope.item.deskripsiProduk
                }
                var keterangan = ''
                if ($scope.item.keterangan != undefined) {
                    keterangan = $scope.item.keterangan
                }
                var namaexternal = ''
                if ($scope.item.namaExternal != undefined) {
                    namaexternal = $scope.item.namaExternal
                }
                var reportdisplay = ''
                if ($scope.item.reportDisplay != undefined) {
                    reportdisplay = $scope.item.reportDisplay
                }
                // objectdetailjenisprodukfk = $scope.item.jenisProduk.id,
                var objectdetailjenisprodukfk = null
                if ($scope.item.detailJenisProduk != undefined) {
                    objectdetailjenisprodukfk = $scope.item.detailJenisProduk.id
                }
                var objectkategoryprodukfk = null
                if ($scope.item.kategoryProduk != undefined) {
                    objectkategoryprodukfk = $scope.item.kategoryProduk.id
                }
                var objectgenerikfk = null
                if ($scope.item.jenisProduk != undefined) {
                    objectgenerikfk = $scope.item.jenisProduk.id
                }
                var objectgprodukfk = null
                if ($scope.item.gProduk != undefined) {
                    objectgprodukfk = $scope.item.gProduk.id
                }
                var objectlevelprodukfk = null
                if ($scope.item.levelProduk != undefined) {
                    objectlevelprodukfk = $scope.item.levelProduk.id
                }
                var objectkelompokprodukbpjsfk = null
                if ($scope.item.kelompokBPJS != undefined) {
                    objectkelompokprodukbpjsfk = $scope.item.kelompokBPJS.id
                }
                var isprodukintern = 0
                if ($scope.item.isProdukIntern != undefined) {
                    isprodukintern = $scope.item.isProdukIntern
                }
                var objectdepartemenfk = null
                if ($scope.item.departemen != undefined) {
                    objectdepartemenfk = $scope.item.departemen.id
                }
                var objectfungsiprodukfk = null
                if ($scope.item.fungsiProduk != undefined) {
                    objectfungsiprodukfk = $scope.item.fungsiProduk.id
                }
                var objectbentukprodukfk = null
                if ($scope.item.bentukProduk != undefined) {
                    objectbentukprodukfk = $scope.item.bentukProduk.id
                }
                var objectbahanprodukfk = null
                if ($scope.item.bahanProduk != undefined) {
                    objectbahanprodukfk = $scope.item.bahanProduk.id
                }
                var objecttypeprodukfk = null
                if ($scope.item.typeProduk != undefined) {
                    objecttypeprodukfk = $scope.item.typeProduk.id
                }
                var objectwarnaprodukfk = null
                if ($scope.item.warnaProduk != undefined) {
                    objectwarnaprodukfk = $scope.item.warnaProduk.id
                }
                var kekuatan = ''
                if ($scope.item.kekuatan != undefined) {
                    kekuatan = $scope.item.kekuatan
                }
                var objectmerkprodukfk = null
                if ($scope.item.merkProduk != undefined) {
                    objectmerkprodukfk = $scope.item.merkProduk.id
                }
                var objectdetailobatfk = null
                if ($scope.item.detailObat != undefined) {
                    objectdetailobatfk = $scope.item.detailObat.id
                }
                var spesifikasi = ''
                if ($scope.item.spesifikasi != undefined) {
                    spesifikasi = $scope.item.spesifikasi
                }
                var objectgolonganprodukfk = null
                if ($scope.item.golonganProduk != undefined) {
                    objectgolonganprodukfk = $scope.item.golonganProduk.id
                }
                var objectdetailgolonganprodukfk = null
                if ($scope.item.detailGolonganProduk != undefined) {
                    objectdetailgolonganprodukfk = $scope.item.detailGolonganProduk.id
                }
                var objectsediaanfk = null
                if ($scope.item.sediaan != undefined) {
                    objectsediaanfk = $scope.item.sediaan.id
                }
                var objectsatuanstandarfk = null
                if ($scope.item.satuanStandar != undefined) {
                    objectsatuanstandarfk = $scope.item.satuanStandar.id
                }
                var objectsatuanbesarfk = null
                if ($scope.item.satuanBesar != undefined) {
                    objectsatuanbesarfk = $scope.item.satuanBesar.id
                }
                var objectsatuankecilfk = null
                if ($scope.item.satuanKecil != undefined) {
                    objectsatuankecilfk = $scope.item.satuanKecil.id
                }
                var qtykalori = 0
                if ($scope.item.qtyKalori != undefined) {
                    qtykalori = $scope.item.qtyKalori
                }
                var qtykarbohidrat = 0
                if ($scope.item.qtyKarbohidrat != undefined) {
                    qtykarbohidrat = $scope.item.qtyKarbohidrat
                }
                var qtylemak = 0
                if ($scope.item.qtyLemak != undefined) {
                    qtylemak = $scope.item.qtyLemak
                }
                var qtyporsi = 0
                if ($scope.item.qtyPorsi != undefined) {
                    qtyporsi = $scope.item.qtyPorsi
                }
                var qtyprotein = 0
                if ($scope.item.qtyProtein != undefined) {
                    qtyprotein = $scope.item.qtyProtein
                }
                var qtyterkecil = 0
                if ($scope.item.qtyterkecil != undefined) {
                    qtyterkecil = $scope.item.qtyterkecil
                }
                var qtysatukemasan = 0
                if ($scope.item.qtysatukemasan != undefined) {
                    qtysatukemasan = $scope.item.qtysatukemasan
                }
                var objectjenisperiksafk = null
                if ($scope.item.jenisperiksa != undefined) {
                    objectjenisperiksafk = $scope.item.jenisperiksa.id
                }
                var objectjenisperiksapenunjangfk = null
                if ($scope.item.jenisPeriksaPenunjang != undefined) {
                    objectjenisperiksapenunjangfk = $scope.item.jenisPeriksaPenunjang.id
                }
                var nilainormal = 0
                if ($scope.item.nilaiNormal != undefined) {
                    nilainormal = $scope.item.nilaiNormal
                }
                var bahansamplefk = null
                if ($scope.item.bahanSample != undefined) {
                    bahansamplefk = $scope.item.bahanSample.id
                }
                var golongandarahfk = null
                if ($scope.item.golonganDarah != undefined) {
                    golongandarahfk = $scope.item.golonganDarah.id
                }
                var rhesusfk = null
                if ($scope.item.rhesus != undefined) {
                    rhesusfk = $scope.item.rhesus.id
                }
                var objectaccountfk = null
                if ($scope.item.account != undefined) {
                    objectaccountfk = $scope.item.account.id
                }
                var verifikasianggaran = null
                if ($scope.item.verifikasiAnggaran != undefined) {
                    verifikasianggaran = $scope.item.verifikasiAnggaran.id
                }
                var objectstatusprodukfk = null
                if ($scope.item.statusProduk != undefined) {
                    objectstatusprodukfk = $scope.item.statusProduk.id
                }
                var isarvdonasi = null
                if ($scope.item.IsARVDonasi != undefined) {
                    if( $scope.item.IsARVDonasi.namaExternal == "f"){
                        isarvdonasi = "false"
                    }else{
                        isarvdonasi = "true"
                    }
                   
                }
                var isnarkotika = null
                if ($scope.item.IsNarkotika != undefined) {
                    isnarkotika = $scope.item.IsNarkotika.namaExternal
                }
                var ispsikotropika = null
                if ($scope.item.IsPsikotropika != undefined) {
                    ispsikotropika = $scope.item.IsPsikotropika.namaExternal
                }
                var isonkologi = null
                if ($scope.item.IsOnkologi != undefined) {
                    isonkologi = $scope.item.IsOnkologi.namaExternal
                }
                var isoot = null
                if ($scope.item.Oot != undefined) {
                    isoot = $scope.item.Oot.namaExternal
                }
                var isprekusor = null
                if ($scope.item.IsPrekusor != undefined) {
                    isprekusor = $scope.item.IsPrekusor.namaExternal
                }
                var isvaksindonasi = null
                if ($scope.item.IsVaksinDonasi != undefined) {
                    isvaksindonasi = $scope.item.IsVaksinDonasi.namaExternal
                }
                var objectprodusenprodukfk = null
                if ($scope.item.produsenProduk != undefined) {
                    objectprodusenprodukfk = $scope.item.produsenProduk.id
                }
                var objectrekananfk = null
                if ($scope.item.rekanan != undefined) {
                    objectrekananfk = $scope.item.rekanan.id
                }
                var idProduk = null
                if ($scope.item.id != undefined) {
                    idProduk = $scope.item.id
                }
                // if($scope.item.id !=undefined){
                var objSave = {
                    "id": idProduk,
                    "kdprofile": 0,
                    "statusenabled": $scope.item.StatusEnabledT != undefined ? $scope.item.StatusEnabledT.id : null, //true,
                    // "statusenabled": $scope.item.StatusEnabledT.status
                    "kdproduk": kdproduk != undefined ? kdproduk : null, //$scope.item.kdProduk,
                    "kdproduk_intern": kdproduk_intern != undefined ? kdproduk_intern : null, //$scope.item.kdProdukIntern,
                    "kdbarcode": kdbarcode != undefined ? kdbarcode : null, //$scope.item.kdBarcode,
                    "kodebmn": kodebmn != undefined ? kodebmn : null, //$scope.item.kodeBmn,
                    "kodeexternal": kodeexternal != undefined ? kodeexternal : null, //$scope.item.kodeExternal,
                    "namaproduk": namaproduk != undefined ? namaproduk : null, //$scope.item.namaProduk,
                    "maxhari": maxhari != undefined ? maxhari : null, //$scope.item.maxHari,
                    "maxqty": maxqty != undefined ? maxqty : null, //$scope.item.maxQty,
                    "mintime": mintime != undefined ? mintime : null, //$scope.item.minTime,
                    "maxtime": maxtime != undefined ? maxtime : null, //$scope.item.maxTime,
                    "deskripsiproduk": deskripsiproduk != undefined ? deskripsiproduk : null, //$scope.item.deskripsiProduk,
                    "keterangan": keterangan != undefined ? keterangan : null, //$scope.item.keterangan,
                    "namaexternal": namaexternal != undefined ? namaexternal : null, //$scope.item.namaExternal,
                    "reportdisplay": reportdisplay != undefined ? reportdisplay : null, //$scope.item.reportDisplay,
                    // "objectdetailjenisprodukfk" : $scope.item.jenisProduk.id,
                    "objectdetailjenisprodukfk": objectdetailjenisprodukfk != undefined ? objectdetailjenisprodukfk : null, //$scope.item.detailJenisProduk.id,
                    "objectkategoryprodukfk": objectkategoryprodukfk != undefined ? objectkategoryprodukfk : null, //$scope.item.kategoryProduk.id,
                    "objectgenerikfk": objectgenerikfk != undefined ? objectgenerikfk : null, //$scope.item.jenisProduk.id,
                    "objectgprodukfk": objectgprodukfk != undefined ? objectgprodukfk : null, //$scope.item.gProduk.id,
                    "objectlevelprodukfk": objectlevelprodukfk != undefined ? objectlevelprodukfk : null, //$scope.item.levelProduk.id,
                    "objectkelompokprodukbpjsfk": objectkelompokprodukbpjsfk != undefined ? objectkelompokprodukbpjsfk : null, //$scope.item.item.kelompokBPJS,
                    "isprodukintern": isprodukintern != undefined ? isprodukintern : null, //$scope.item.isProdukIntern,
                    "objectdepartemenfk": objectdepartemenfk != undefined ? objectdepartemenfk : null, //1,
                    "objectfungsiprodukfk": objectfungsiprodukfk != undefined ? objectfungsiprodukfk : null, //$scope.item.fungsiProduk.id,
                    "objectbentukprodukfk": objectbentukprodukfk != undefined ? objectbentukprodukfk : null, //$scope.item.bentukProduk.id,
                    "objectbahanprodukfk": objectbahanprodukfk != undefined ? objectbahanprodukfk : null, //$scope.item.bahanProduk.id,
                    "objecttypeprodukfk": objecttypeprodukfk != undefined ? objecttypeprodukfk : null, //$scope.item.typeProduk.id,
                    "objectwarnaprodukfk": objectwarnaprodukfk != undefined ? objectwarnaprodukfk : null, //$scope.item.warnaProduk.id,
                    "kekuatan": kekuatan != undefined ? kekuatan : null, //$scope.item.kekuatan,
                    "objectmerkprodukfk": objectmerkprodukfk != undefined ? objectmerkprodukfk : null, //$scope.item.merkProduk.id,
                    "objectdetailobatfk": objectdetailobatfk != undefined ? objectdetailobatfk : null, //$scope.item.detailObat.id,
                    "spesifikasi": spesifikasi != undefined ? spesifikasi : null, //$scope.item.spesifikasi,
                    "objectgolonganprodukfk": objectgolonganprodukfk != undefined ? objectgolonganprodukfk : null, //$scope.item.golonganProduk.id,
                    "objectdetailgolonganprodukfk": objectdetailgolonganprodukfk != undefined ? objectdetailgolonganprodukfk : null, //$scope.item.detailGolonganProduk.id,
                    "objectsediaanfk": objectsediaanfk != undefined ? objectsediaanfk : null, //$scope.item.objectsediaanfk.id,
                    "objectsatuanstandarfk": objectsatuanstandarfk != undefined ? objectsatuanstandarfk : null, //$scope.item.satuanStandar.id,
                    "objectsatuanbesarfk": objectsatuanbesarfk != undefined ? objectsatuanbesarfk : null, //$scope.item.satuanBesar.id,
                    "objectsatuankecilfk": objectsatuankecilfk != undefined ? objectsatuankecilfk : null, //$scope.item.satuanKecil.id,
                    "qtykalori": qtykalori != undefined ? qtykalori : 0, //$scope.item.qtyKalori,
                    "qtykarbohidrat": qtykarbohidrat != undefined ? qtykarbohidrat : 0, //$scope.item.qtyKarbohidrat,
                    "qtylemak": qtylemak != undefined ? qtylemak : 0, //$scope.item.qtyLemak,
                    "qtyporsi": qtyporsi != undefined ? qtyporsi : 0, //$scope.item.qtyPorsi,
                    "qtyprotein": qtyprotein != undefined ? qtyprotein : 0, //$scope.item.qtyProtein,
                    "qtysatukemasan": qtysatukemasan != undefined ? qtysatukemasan : 0, //$scope.item.qtysatukemasan,
                    "qtyterkecil": qtyterkecil != undefined ? qtyterkecil : 0, //$scope.item.qtyterkecil,
                    "objectjenisperiksafk": objectjenisperiksafk != undefined ? objectjenisperiksafk : null, //$scope.item.jenisperiksa.id,
                    "objectjenisperiksapenunjangfk": objectjenisperiksapenunjangfk != undefined ? objectjenisperiksapenunjangfk : null, //$scope.item.jenisPeriksaPenunjang.id,
                    "nilainormal": nilainormal != undefined ? nilainormal : null, //$scope.item.nilaiNormal,
                    "bahansamplefk": bahansamplefk != undefined ? bahansamplefk : null, //$scope.item.bahanSample.id,
                    "golongandarahfk": golongandarahfk != undefined ? golongandarahfk : null, //$scope.item.golonganDarah.id,
                    "rhesusfk": rhesusfk != undefined ? rhesusfk : null, //$scope.item.rhesus.id,
                    "objectaccountfk": objectaccountfk != undefined ? objectaccountfk : null, //$scope.item.account.id,
                    "verifikasianggaran": verifikasianggaran != undefined ? verifikasianggaran : null, //$scope.item.verifikasiAnggaran.id,
                    "objectstatusprodukfk": objectstatusprodukfk != undefined ? objectstatusprodukfk : null, //$scope.item.statusProduk.id,
                    "isarvdonasi": isarvdonasi != undefined ? isarvdonasi : null, //$scope.item.IsVaksinDonasi.namaExternal,
                    "isnarkotika": isnarkotika != undefined ? isnarkotika : null, //$scope.item.IsNarkotika.namaExternal,
                    "ispsikotropika": ispsikotropika != undefined ? ispsikotropika : null, //$scope.item.IsPsikotropika.namaExternal,
                    "isonkologi": isonkologi != undefined ? isonkologi : null, //$scope.item.IsOnkologi.namaExternal,
                    "isoot": isoot != undefined ? isoot : null, //$scope.item.Oot.namaExternal,
                    "isprekusor": isprekusor != undefined ? isprekusor : null, //$scope.item.IsPrekusor.namaExternal,
                    "isvaksindonasi": isvaksindonasi != undefined ? isvaksindonasi : null, //$scope.item.IsVaksinDonasi.namaExternal,
                    "objectprodusenprodukfk": objectprodusenprodukfk != undefined ? objectprodusenprodukfk : null, //1,
                    "objectrekananfk": objectrekananfk != undefined ? objectrekananfk : null, //$scope.item.rekanan.id,
                    "objectunitlaporanfk": 1,
                    "qproduk": null,
                    "qtyjualterkecil": null,
                    "qtysatukemasan": qtysatukemasan != undefined ? qtysatukemasan : null,
                    "qtyterkecil": qtyterkecil != undefined ? qtyterkecil : null,
                    "kdprodukintern": null,
                    "objectstatusbarangfk": 1,
                    "tglproduksi": "2017-07-12",
                    "status": null,
                    "objectjenisgenerikfk": null,
                    "poinmedis": null,
                    "persen_individu": $scope.item.persen_individu != undefined ? $scope.item.persen_individu : null,
                    "persen_kelompok": $scope.item.persen_kelompok != undefined ? $scope.item.persen_kelompok : null,
                    "persen_pengirim": $scope.item.persen_pengirim != undefined ? $scope.item.persen_pengirim : null,
                }

                if ($scope.item.id != undefined) {
                    medifirstService.post('sysadmin/master/save-data-produk', objSave).then(function(e) {
                        if (e.status === 201) {
                            // medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                            // 	+ "&referensi=" + referensi
                            // 	+ "&noreff=" + noreff
                            // 	+ "&keterangan=" + ket
                            // )
                            $scope.saveLogging('Produk', 'IdPorduk',
                                    idProduk, 'Penambahan Produk ' + namaproduk + ' dengan ' + maxhari + ' maxhari dan ' + maxqty + ' maxqty')
                                // medifirstService.post('sysadmin/logging/save-log-all', json).then(function (e) {
                                // 	})
                        }
                        console.log(JSON.stringify(e.data));
                        // $scope.item = {};
                        // $state.go("MasterProduk")
                    });
                } else if ($scope.item.id == undefined) {
                    medifirstService.post('sysadmin/master/save-data-produk', objSave).then(function(e) {
                        if (e.status === 201) {
                            // medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                            // 	+ "&referensi=" + referensi
                            // 	+ "&noreff=" + noreff
                            // 	+ "&keterangan=" + ket
                            // )
                            $scope.saveLogging('Produk', 'IdPorduk',
                                    idProduk, 'Penambahan Produk ' + namaproduk + ' dengan ' + maxhari + ' maxhari dan ' + maxqty + ' maxqty')
                                // medifirstService.post('sysadmin/logging/save-log-all', json).then(function (e) {
                                // 	})
                                // }
                                // medifirstService.post('sysadmin/logging/save-log-all', json).then(function (e) {
                                // 	})
                        }
                        console.log(JSON.stringify(e.data));
                        // $scope.item = {};
                        var confirm = $mdDialog.confirm()
                            .title('Caution')
                            .textContent('Apakah Anda Akan Menambah Data Lagi?')
                            .ariaLabel('Lucky day')
                            .cancel('Ya')
                            .ok('Tidak')
                        $mdDialog.show(confirm).then(function() {
                            $scope.item = {};
                            $state.go("MasterProdukFarmasi");
                        })
                    });
                }
            }

            $scope.saveLogging = function(jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function(data) {
                    console.log(JSON.stringify(e.data));
                    $scope.item = {};
                    var confirm = $mdDialog.confirm()
                        .title('Caution')
                        .textContent('Apakah Anda Akan Menambah Data Lagi?')
                        .ariaLabel('Lucky day')
                        .cancel('Ya')
                        .ok('Tidak')
                    $mdDialog.show(confirm).then(function() {
                        $state.go("MasterProdukFarmasi");
                    })
                })
            }

            $scope.batal = function() {
                $scope.showEdit = false;
                $scope.item = {};
            }

            $scope.reset = function() {
                var AllRowsToBeDel = $scope.dataSource._data == "";
                UbahGrid(AllRowsToBeDel);
                $scope.active = true;
                $scope.null();
            }


            $scope.SimpanMapRuanganToProduk = function() {
                    var data = [];
                    
                    for (var i = 0; i < $scope.dataSource._data.length; i++) {
                        
                        if ($scope.KondisiCariSimpan == true && $scope.TempValidasi != 0 && $scope.TempValidasi != undefined) {
                            for (var y = 0; y < $scope.TempValidasi.length; y++) {
                                ////
                                if ($scope.TempValidasi[y].idStatus == $scope.dataSource._data[i].id && $scope.dataSource._data[i].statCheckbox == false) {
                                    alert("Simpan Gagal, Tidak Boleh Uncheck yang sudah di mapping melalui pencarian!")
                                    $scope.item.kelompokproduk = "";
                                    $scope.item.jenis = "";
                                    $scope.item.detailjenis = "";
                                    return $scope.ruangan();
                                } else {
                                    if ($scope.dataSource._data[i].statCheckbox) {
                                        $scope.saveLogging('Map Ruangan To Produk Produk', 'IdPorduk',
                                            $scope.dataSource._data[i].id, 'Penambahan Produk ' + $scope.dataSource._data[i].namaproduk + ' ke ruangan ' + $scope.item.ruangan.ruangan)
                                        data.push({
                                            "idproduk": $scope.dataSource._data[i].id,
                                            "idruangan": $scope.item.ruangan.id,
                                            "kodeexternal": $scope.item.kodeExternal != undefined ? $scope.item.kodeExternal : ''
                                        })
                                    }
                                }
                            }
                        } else {
                            if ($scope.dataSource._data[i].statCheckbox) {
                                $scope.saveLogging('Map Ruangan To Produk Produk', 'IdPorduk',
                                    $scope.dataSource._data[i].id, 'Penambahan Produk ' + $scope.dataSource._data[i].namaproduk + ' ke ruangan ' + $scope.item.ruangan.ruangan)
                                data.push({
                                    "idproduk": $scope.dataSource._data[i].id,
                                    "idruangan": $scope.item.ruangan.id,
                                    "kodeexternal": $scope.item.kodeExternal != undefined ? $scope.item.kodeExternal : ''
                                })
                            }
                        }
                    }

                    if ($scope.KondisiCariSimpan == false) {
                        // manageLogistikPhp.saveDataProduk(data, "produk/add-produktoruangan").then(function (e) {
                        //     
                        // });
                        var objSave = {
                            'is_search': null,
                            'data': data
                        }

                        medifirstService.post('sysadmin/master/save-data-mapproduktoruangan', objSave).then(function(e) {
                            // if (e.status === 201) {
                            // 	$scope.saveLogging('Map Ruangan To Produk Produk', 'IdPorduk',
                            // 	idProduk, 'Penambahan Produk '+namaproduk+' ke ruangan '+maxhari+' maxhari dan '+maxqty+' maxqty')
                            // }
                            console.log(e.data);
                        })
                    } else {

                        var objSave = {
                            'is_search': 1,
                            'data': data
                        }

                        medifirstService.post('sysadmin/master/save-data-mapproduktoruangan', objSave).then(function(e) {
                                console.log(e.data);
                            })
                            // manageLogistikPhp.saveDataProduk(data, "produk/add-produktoruangan/1").then(function (e) {
                            //     console.log(e.data);
                            // });
                    }
                }
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
                $scope.formatRupiah = function (value, currency) {
                    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
                $scope.columnGridstok = {
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
                        "width": "25px",
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
                    // {
                    //     "field": "satuanStandar",
                    //     "title": "Satuan",
                    //     "width": "60px",
                    // },
                    // {
                    //     "field": "tglKadaluarsa",
                    //     "title": "Tgl Kadaluarsa",
                    //     "width": "80px",
                    // },
                    {
                        "field": "harga",
                        "title": "Harga",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
                    }, 
                    {
                        "field": "hargajual",
                        "title": "Harga Jual",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargajual #', '')}}</span>"
                    }
                   
                ]

            };
              $scope.columnGridkonversi = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "satuanstandar_asal",
                    "title": "Satuan Asal",
                    "width": "80px",
                },
                {
                    "field": "satuanstandar_tujuan",
                    "title": "Satuan Tujuan",
                    "width": "80px",
                },
                {
                    "field": "nilaikonversi",
                    "title": "Nilai Konversi",
                    "width": "40px",
                }
            ];
             $scope.klikGrid = function (dataSelected) {
                // $scope.item.satuanstandar_asal = {id:dataSelected.ssidasal,satuanstandar:dataSelected.satuanstandar_asal}
                $scope.item.satuanstandar_tujuan = { id: dataSelected.ssidtujuan, satuanstandar: dataSelected.satuanstandar_tujuan }
                $scope.item.nilaikonversi = dataSelected.nilaikonversi
                $scope.item.noreckonversi = dataSelected.norec
            }
             $scope.tambahData = function () {
                if ($scope.item.satuanstandar_asal == undefined) {
                    alert("Pilih satuan!!")
                    return;
                }
                if ($scope.item.satuanstandar_tujuan == undefined) {
                    alert("Pilih satuan!!")
                    return;
                }
                if ($scope.item.nilaikonversi == undefined) {
                    alert("Isi nilai konversi!!")
                    return;
                }
                if ( $scope.item.noreckonversi == undefined) {
                    alert("error, ulangi proses!")
                    return;
                }
                var objSave = [
                    {
                        norec:  $scope.item.noreckonversi,
                        nilaikonversi: parseFloat($scope.item.nilaikonversi),
                        objekprodukfk:  $scope.item.idx,
                        satuanstandar_asal: $scope.item.satuanstandar_asal.id,
                        satuanstandar_tujuan: $scope.item.satuanstandar_tujuan.id
                    }
                ]
                medifirstService.post('sysadmin/master/save-konversi-satuan',objSave).then(function (e) {
                    //$scope.item.resep = e.data.noresep
                    // KlikProduk()
                    load()

                })

            }
            $scope.hapusData = function () {
                if ($scope.item.satuanstandar_asal == undefined) {
                    alert("Pilih satuan!!")
                    return;
                }
                if ($scope.item.satuanstandar_tujuan == undefined) {
                    alert("Pilih satuan!!")
                    return;
                }
                if ($scope.item.nilaikonversi == undefined) {
                    alert("Isi nilai konversi!!")
                    return;
                }
                if ( $scope.item.noreckonversi == undefined) {
                    alert("error, ulangi proses!")
                    return;
                }
                var objSave = [
                    {
                        norec:  $scope.item.noreckonversi
                    }
                ]
                medifirstService.post('sysadmin/master/delete-konversi-satuan',objSave).then(function (e) {
                    //$scope.item.resep = e.data.noresep
                    // KlikProduk()
                    load()
                })
            }
              $scope.kosongkan = function () {
                kosong();
            }
            function kosong() {
                // $scope.item.satuanstandar_asal = ''
                $scope.item.satuanstandar_tujuan = ''
                $scope.item.nilaikonversi = ''
                $scope.item.noreckonversi = '-'
            }
            function initData() {
                $scope.isRouteLoading = true;
                // var kelBarang, jenBarang, ruanganId, barangId, noTerima, asalProdukId;
                // kelBarang = "";
                // if ($scope.item.kelompokBarang != undefined) {
                //     kelBarang = $scope.item.kelompokBarang.id
                // }
                // jenBarang = "";
                // if ($scope.item.jenisProduk != undefined) {
                //     jenBarang = $scope.item.jenisProduk.id
                // }
                // barangId = "";
                // if ($scope.item.namaBarang != undefined) {
                //     barangId = $scope.item.namaBarang.id
                // }
                // noTerima = "";
                // if ($scope.item.noTerima != undefined) {
                //     noTerima = $scope.item.noTerima
                // }
                // asalProdukId = "";
                // if ($scope.item.asalProduk != undefined) {
                //     asalProdukId = $scope.item.asalProduk.id
                // }
                // var jmlRows = "";
                // if ($scope.item.jmlRows != undefined) {
                //     jmlRows = $scope.item.jmlRows
                // }

                // if ($scope.enableNamaRuangan === true && $scope.item.ruanganAsal !== undefined) {
                //     ruanganId = $scope.item.ruanganAsal.id
                // } else {
                //     ruanganId = $scope.item.ruangan.id
                // }

                // var KdSirs1 = ""
                // if ($scope.item.KdSirs1 != undefined) {
                //     KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                // }
                // var KdSirs2 = ""
                // if ($scope.item.KdSirs2 != undefined) {
                //     KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                // }
                // var kelompokpasien = "&kelompokpasien=1"
                // if ($scope.item.kelompokpasien != undefined) {
                //     kelompokpasien = "&kelompokpasien=" + $scope.item.kelompokpasien.id
                // }
                
                medifirstService.get('logistik/get-stok-ruangan-detailmaster?' + 
                    'namaproduk=' + $scope.item.namaProduk + 
                    '&jmlRows=' + 50).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.detail;
                        var datasOrder = data.data.detailorder;
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
                    })
            }
                ///////////////////////////////////////////////////////////////////		END			//////////////////////////////////////////////////////////////			
        }
    ]);
});