define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarPasienVerifikasiJasaCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function($mdDialog, $timeout, $parse, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
            // define(['initialize'], function (initialize) {
            //     'use strict';
            //     initialize.controller('DaftarPasienVerifikasiJasaCtrl', ['DateHelper', '$q','$rootScope', '$scope', 'ModelItem', 'MedifirstService', '$state', '$window', 'CetakHelper', 'CacheHelper',
            //         function (dateHelper,$q, $rootScope, $scope, ModelItem, medifirstService, $state, $window, cetakHelper, cacheHelper) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.model = {};
            $scope.tampil = true;
            var norec_ppd = '';
            var norec_pp = '';
            var strukfk = '';
            var tarif = '';

            var tempnoregis = '';



            $scope.tampil = true;
            var dataMasuk = [];
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 50
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0
            var dataDel = [];
            loadCombo();
            var data2 = [];
            $scope.selectedData2 = [];

            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

            $scope.dataLoginuser = JSON.parse(window.localStorage.getItem('datauserlogin'));
            // getSisrute()
            // postKunjunganYankes()
            // postRujukanYankes()

            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienCtrl');
                var tgltgltgltgl = new Date();
                var tglmax = new Date();
                var tglkpnaja = new Date();
                $scope.minDate = new Date();
                $scope.maxDate = new Date(); //new Date($scope.now);
                $scope.startDateOptions = {
                    disableDates: function(date) {
                        var disabled = tglkpnaja;
                        if (date && disabled.indexOf(date.getDate()) > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
                if (chacePeriode != undefined) {
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);;
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        $scope.item.noReg = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.item.noRm = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        $scope.item.nama = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.listDepartemen = [chacePeriode[5]]
                        $scope.item.instalasi = chacePeriode[5]
                    }

                    if (chacePeriode[6] != undefined) {
                        $scope.listRuangan = [chacePeriode[6]]
                        $scope.item.ruangan = chacePeriode[6]
                    }

                    if (chacePeriode[7] != undefined) {
                        $scope.item.listKelompokPasien = [chacePeriode[7]]
                        $scope.item.kelompokpasien = chacePeriode[7]
                    }

                    if (chacePeriode[8] != undefined) {
                        $scope.item.dokter = chacePeriode[8]
                        $scope.item.listDokter2 = chacePeriode[8]
                    }

                    if (chacePeriode[9] != undefined) {
                        $scope.item.jmlRows = chacePeriode[9]
                    }

                    // var arrPeriode = chacePeriode.split('~');
                    // $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    // $scope.item.periodeAkhir = new Date(arrPeriode[1]);	
                    // $scope.item.instalasi = {id:arrPeriode[2],departemen:arrPeriode[3]}
                    // $scope.item.ruangan = {id:arrPeriode[4],ruangan:arrPeriode[5]}
                    // $scope.item.tglpulang = new Date(arrPeriode[2]);				
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
                        $scope.listDepartemen = data.data.departemen;
                        $scope.listKelompokPasien = data.data.kelompokpasien;
                        $scope.listDokter = data.data.dokter;
                        $scope.listDokter2 = data.data.dokter;
                    })
                    // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function() {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function(tanggal) {
                if (tanggal == "") {
                    return "";

                } else {

                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                }
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            var onDataBound = function() {
                $('td').each(function() {
                    if ($(this).text() == 'belum') { $(this).addClass('red') }
                    if ($(this).text() == 'verif') { $(this).addClass('green') }
                    if ($(this).text() == 'Sudah') { $(this).addClass('koneng') }
                    if ($(this).text() == 'BERKASRS') { $(this).addClass('koneng') }
                    if ($(this).text() == 'ATENSI') { $(this).addClass('koneng') }

                })
            }
            $scope.getHargaTindakan = function() {
                getKomponenHarga()
            }
            $scope.isInArray = function(value, array) {
                return array.indexOf(value) > -1;
            }
            $scope.selectedPegawai10 = [];
            $scope.showTambah1 = true;
            $scope.show = true;
            $scope.tambah = function() {
                $scope.showJenisPelaksana2 = true;
                $scope.show = false;
                $scope.show2 = true;
            };
            $scope.hapus = function() {
                $scope.show = true;
                $scope.show2 = false;
                $scope.showJenisPelaksana2 = false;
                $scope.item.jenisPelaksana2 = "";
                $scope.selectedPegawai2 = [];
            };

            $scope.tambah2 = function() {
                $scope.showJenisPelaksana3 = true;
                $scope.show3 = true;
                $scope.show2 = false;
            }
            $scope.hapus2 = function() {
                $scope.showJenisPelaksana3 = false;
                $scope.show2 = true;
                $scope.show3 = false;
                $scope.item.jenisPelaksana3 = "";
                $scope.selectedPegawai3 = [];
            };

            $scope.tambah3 = function() {
                $scope.showJenisPelaksana4 = true;
                $scope.show3 = false;
                $scope.show4 = true;
            }
            $scope.hapus3 = function() {
                $scope.showJenisPelaksana4 = false;
                $scope.show3 = true;
                $scope.show4 = false;
                $scope.item.jenisPelaksana4 = "";
                $scope.selectedPegawai4 = [];
            };

            $scope.tambah4 = function() {
                $scope.showJenisPelaksana5 = true;
                $scope.show4 = false;
                $scope.show5 = true;
            }
            $scope.hapus4 = function() {
                $scope.showJenisPelaksana5 = false;
                $scope.show4 = true;
                $scope.show5 = false;
                $scope.item.jenisPelaksana5 = "";
                $scope.selectedPegawai5 = [];
            };

            $scope.tambah5 = function() {
                $scope.showJenisPelaksana6 = true;
                $scope.show5 = false;
                $scope.show6 = true;
            }
            $scope.hapus5 = function() {
                $scope.showJenisPelaksana6 = false;
                $scope.show5 = true;
                $scope.show6 = false;
                $scope.item.jenisPelaksana5 = "";
                $scope.selectedPegawai5 = [];
            };

            $scope.tambah6 = function() {
                $scope.showJenisPelaksana7 = true;
                $scope.show6 = false;
                $scope.show7 = true;
            }
            $scope.hapus6 = function() {
                $scope.showJenisPelaksana7 = false;
                $scope.show6 = true;
                $scope.show7 = false;
                $scope.item.jenisPelaksana6 = "";
                $scope.selectedPegawai6 = [];
            };

            $scope.tambah7 = function() {
                $scope.showJenisPelaksana8 = true;
                $scope.show7 = false;
                $scope.show8 = true;
            }
            $scope.hapus7 = function() {
                $scope.showJenisPelaksana8 = false;
                $scope.show7 = true;
                $scope.show8 = false;
                $scope.item.jenisPelaksana7 = "";
                $scope.selectedPegawai7 = [];
            };

            $scope.tambah8 = function() {
                $scope.showJenisPelaksana9 = true;
                $scope.show8 = false;
                $scope.show9 = true;
            }
            $scope.hapus8 = function() {
                $scope.showJenisPelaksana9 = false;
                $scope.show8 = true;
                $scope.item.jenisPelaksana8 = "";
                $scope.selectedPegawai8 = [];
            };

            $scope.tambah9 = function() {
                $scope.showJenisPelaksana10 = true;
                $scope.show9 = false;
                $scope.show10 = true;
            }
            $scope.hapus9 = function() {
                $scope.showJenisPelaksana10 = false;
                $scope.show9 = true;
                $scope.show10 = false;
                $scope.item.jenisPelaksana9 = "";
                $scope.selectedPegawai9 = [];
            };

            $scope.listIdPetugas = [13827, 176873]
            $scope.init = function() {
                var id = $scope.item.jenisPelaksana.id;
                var model = 'dataSource';
                var listArray = 'selectedPegawai';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai = [];
            $scope.init2 = function() {
                var id = $scope.item.jenisPelaksana2.id;
                var model = 'dataSource2';
                var listArray = 'selectedPegawai2';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai2 = [];
            $scope.init3 = function() {
                var id = $scope.item.jenisPelaksana3.id;
                var model = 'dataSource3';
                var listArray = 'selectedPegawai3';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai3 = [];
            $scope.init4 = function() {
                var id = $scope.item.jenisPelaksana4.id;
                var model = 'dataSource4';
                var listArray = 'selectedPegawai4';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai4 = [];
            $scope.init5 = function() {
                var id = $scope.item.jenisPelaksana5.id;
                var model = 'dataSource5';
                var listArray = 'selectedPegawai5';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai5 = [];
            $scope.init6 = function() {
                var id = $scope.item.jenisPelaksana6.id;
                var model = 'dataSource6';
                var listArray = 'selectedPegawai6';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai6 = [];
            $scope.init7 = function() {
                var id = $scope.item.jenisPelaksana7.id;
                var model = 'dataSource7';
                var listArray = 'selectedPegawai7';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai7 = [];
            $scope.init8 = function() {
                var id = $scope.item.jenisPelaksana8.id;
                var model = 'dataSource8';
                var listArray = 'selectedPegawai8';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai8 = [];
            $scope.init9 = function() {
                var id = $scope.item.jenisPelaksana9.id;
                var model = 'dataSource9';
                var listArray = 'selectedPegawai9';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai9 = [];
            $scope.init10 = function() {
                var id = $scope.item.jenisPelaksana10.id;
                var model = 'dataSource10';
                var listArray = 'selectedPegawai10';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };

            function getPegawaiById(id, input, output) {
                var selectedData = $parse(output);
                selectedData.assign($scope, []);
                var model = $parse(input);
                medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas?idJenisPetugas=" + id, true).then(function(dat) {
                    if ($scope.dataPelayananSelected.ruanganfk == 575) {
                        $scope.listPegawai = new kendo.data.DataSource({
                            data: [{
                                    id: "25009",
                                    jenispegawai: "DOKTER",
                                    jenispetugaspe: "Dokter Pemeriksa",
                                    namalengkap: "dr. EDY PURNOMO, M.K.K.K",
                                    objectjenispegawaifk: "1",
                                    objectjenispetugaspefk: "4"
                                },
                                {
                                    id: "25720",
                                    jenispegawai: "DOKTER",
                                    jenispetugaspe: "Dokter Pemeriksa",
                                    namalengkap: "dr. UFI DEWINTERA, Sp. M.K.",
                                    objectjenispegawaifk: "1",
                                    objectjenispetugaspefk: "4"
                                },
                                {
                                    id: "25179",
                                    jenispegawai: "DOKTER",
                                    jenispetugaspe: "Dokter Pemeriksa",
                                    namalengkap: "dr. EIRENE JAQUELENE K. TOMATALA, SpPK",
                                    objectjenispegawaifk: "1",
                                    objectjenispetugaspefk: "4"
                                }
                            ]
                        });
                    } else {
                        $scope.listPegawai = new kendo.data.DataSource({
                            data: dat.data.jenispelaksana
                        });
                    }
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    model.assign($scope, $scope.listPegawai);

                    var cookie = document.cookie.split(';');
                    cookie = cookie[0].split('=');
                    if (cookie[1] == 'dokter')
                        $scope.selectedPegawai = [({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]

                });
            }
            $scope.onClickSatu = function(e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid2").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function(e) {
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].norec === dataItem.norec) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].norec === dataItem.norec) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }

            function getKomponenHarga() {;
                $scope.item.hargaTindakan = 0
                $scope.item.jumlah = 0
                var kelastindakan = ""
                kelastindakan = $scope.dataPelayananSelected.kelasfk;
                // if ($scope.dataPelayananSelected.kelasfk == "9") {
                //   kelastindakan = $scope.dataPelayananSelected.kelasfk
                // } else if ($scope.item.pasien.objectkelompokpasienlastfk == "2" && $scope.item.pasien.israwatinap=="true") {
                //   kelastindakan = $scope.item.pasien.kelastanggunganfk
                // } else {
                //   kelastindakan = $scope.dataPelayananSelected.kelasfk
                // }
                // $scope.item.Kelas = $scope.dataPelayananSelected.kelasfk
                $scope.listKomponen = []

                if ($scope.item.namaProduk != undefined) {
                    medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan=" +
                        $scope.dataPelayananSelected.ruanganfk +
                        "&idKelas=" + kelastindakan +
                        "&idProduk=" + $scope.item.namaProduk.id +
                        "&idJenisPelayanan=" + 1

                        // medifirstService.get("tatarekening/tindakan/get-komponenharga-pelayanan?norec_pp="
                        //  + $scope.dataPelayananSelected.norec
                        //  + "&idKelas=" + kelastindakan
                        //  + "&idProduk=" + $scope.item.namaProduk.id
                        //  + "&idJenisPelayanan=" + 1	            // +"&idKelas="
                        // +$scope.dataPelayananSelected.kelasfk
                        // +"&idJenisPelayanan="
                        // + $scope.item.pasien.objectjenispelayananfk
                    ).then(function(dat) {
                        $scope.listKomponen = dat.data.data;
                        $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                        $scope.item.jumlah = 0;
                    })
                }
            }

            $scope.selectOptions = {
                placeholder: "Pilih Pegawai...",
                dataTextField: "namaLengkap",
                dataValueField: "id",
                filter: "contains"
            };

            medifirstService.get("tatarekening/tindakan/get-combo")
                .then(function(da) {
                    $scope.listJenisPelaksana = da.data.jenispelaksana;
                    $scope.listDokter = da.data.pegawai;
                    // for (var i = da.data.jenispelaksana.length - 1; i >= 0; i--) {
                    //  var elem= da.data.jenispelaksana[i]
                    //  if(elem.jenispetugaspe.indexOf('Dokter Pemeriksa') > -1){
                    //    $scope.item.jenisPelaksana= elem
                    //    $scope.init()
                    //    break
                    //  }
                    // }

                    $scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
                })

            $scope.columnDaftarPasienPulang = {

                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
                    allPages: true,
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                columns: [{
                        "field": "status",
                        "title": "status",
                        "width": "80px"
                    },
                    {
                        "field": "status",
                        "title": "Verifikasi",
                        "width": "90px",

                        "template": "<button ng-show=\"tampil\" class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  status #</button> ",
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "tglverif",
                        "title": "Tgl Verif",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglverif #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "NoReg",
                        "width": "80px"
                    },
                    {
                        "field": "nocm",
                        "title": "NoRM",
                        "width": "80px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namapasien #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Kelompok Pasien",
                        "width": "100px",
                        "template": "<span class='style-left'>#: kelompokpasien #</span>"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "rekanan",
                        "title": "Rekanan",
                        "width": "80px",
                        "template": "<span class='style-center'>#: rekanan #</span>"
                    },
                    // {
                    // 	"field": "nostruk",
                    // 	"title": "NoStrukVerif",
                    // 	"width":"100px",
                    // 	"template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
                    // },
                    // {
                    // 	"field": "nosbm",
                    // 	"title": "NoSBM",
                    // 	"width":"100px",
                    // 	"template": '# if( nosbm==null) {# - # } else {# #= nosbm # #} #'
                    // },
                    // {
                    // 	"field": "kasir",
                    // 	"title": "Kasir",
                    // 	"width":"100px",
                    // 	"template": '# if( kasir==null) {# - # } else {# #= kasir # #} #'
                    // },
                    {
                        "field": "totalharusdibayar",
                        "title": "Total",
                        "width": "150px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",

                    }
                ]
            };
            $scope.columnDaftarPelayanan = {

                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
                    allPages: true,
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,

                dataBound: onDataBound,
                columns: [

                    {
                        "template": "<input type='checkbox' ng-click='onClickSatu($event)' />",
                        "width": 40
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "80px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tanggal Pelayanan",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "namaproduk",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaproduk #</span>"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Penindak",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namalengkap  #</span>"
                    },

                    {
                        "field": "hargajual",
                        "title": "Harga",
                        "width": "150px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargajual #', 'Rp.')}}</span>",

                    },
                    {
                        "field": "hargadiscount",
                        "title": "Harga Diskon",
                        "width": "100px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', 'Rp.')}}</span>",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "50px",
                    },

                    {
                        "field": "tglverif",
                        "title": "Tanggal Verif",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "berkasrs",
                        "title": "berkasrs",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                ]
            };
            $scope.columnDaftarPelayanan2 = {

                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
                    allPages: true,
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: true,
                dataBound: onDataBound,
                columns: [

                    {
                        "template": "<input type='checkbox'  style='width:30px; height:30px'  ng-click='onClickSatu($event)' />",
                        "width": 40
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "80px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tanggal Pelayanan",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "namaproduk",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaproduk #</span>"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Penindak",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namalengkap  #</span>"
                    },

                    {
                        "field": "hargajual",
                        "title": "Harga",
                        "width": "150px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargajual #', 'Rp.')}}</span>",

                    },
                    {
                        "field": "hargadiscount",
                        "title": "Harga Diskon",
                        "width": "100px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', 'Rp.')}}</span>",

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "50px",
                    },
                    {
                        "field": "",
                        "title": "Jumlah Edit",
                        "width": "70px",
                        "template": "<button ng-show=\"tampil\" class=\"k-button custom-button\" ng-click=\"simpanjumlah(dataItem)\"  style=\"margin:0 0 5px\" >  Simpan </button> ",
                    },
                    {
                        "field": "tglverif",
                        "title": "Tanggal Verif",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "berkasrs",
                        "title": "berkasrs",
                        "width": "40px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "jasamedis",
                        "title": "Jasa Medis",
                        "width": "100px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: jasamedis #', 'Rp.')}}</span>",

                    }, {
                        "field": "jasaperawat",
                        "title": "Jasa Perawat",
                        "width": "100px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: jasaperawat #', 'Rp.')}}</span>",

                    },
                    {
                        "field": "jasaoperator",
                        "title": "Jasa Operator",
                        "width": "100px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: jasaoperator #', 'Rp.')}}</span>",

                    },
                    {
                        "field": "jasaanastesi",
                        "title": "Jasa Anastesi",
                        "width": "100px",
                        // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        //"template": "<span class='style-center'>#: totalharusdibayar #</span>"
                        "template": "<span class='style-right'>{{formatRupiah('#: jasaanastesi #', 'Rp.')}}</span>",

                    },
                ]
            };
            $scope.gridPetugasPelaksana = new kendo.data.DataSource({
                data: []
            })

            function simpandata() {

                var dataTindakanFix = [];
                $scope.dataTindakan.options.data.forEach(function(e) {
                    if (e.listKomponen.length <= 0) {
                        window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
                        return
                    } else {
                        var petugasLayanan = [];
                        $scope.gridPetugasPelaksana._data.forEach(function(a) {
                            if (e.rowNumber === a.idParent) {
                                petugasLayanan.push({
                                    "objectjenispetugaspefk": a.jenisPetugas.id,
                                    // "objectpegawaifk": a.jenisPetugas.id
                                    "listpegawai": a.listPetugas
                                });
                            }
                        })
                        dataTindakanFix.push({
                            "noregistrasifk": $scope.currentNorecAPD,
                            "tglregistrasi": new moment($scope.dataPasienSelected.tglpulang).format('YYYY-MM-DD HH:mm'),
                            "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                            "ruangan": e.ruangan,
                            "produkfk": e.produk.id,
                            "hargasatuan": e.hargaSatuan,
                            "diskon": e.hargadiskon,
                            "hargajual": e.hargaSatuan,
                            "harganetto": e.hargaSatuan,
                            "jumlah": e.qty,
                            "kelasfk": $scope.dataPelayananSelected.kelasfk,
                            "pelayananpetugas": petugasLayanan,
                            "komponenharga": e.listKomponen,
                            "keterangan": '-',
                            "iscito": 0,
                            "jasacito": 0,
                            "isparamedis": e.isparamedis,
                            "jenispelayananfk": e.jenispelayananfk,
                            "nilaicito": 0,
                            "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                            "noregistrasifk": $scope.dataPelayananSelected.norecapd,
                            "idpengirim": null
                        });
                        var objSave = {
                            pelayananpasien: dataTindakanFix

                        }
                        $scope.hideSimpan = true;
                        medifirstService.post('remunerasi/save-tindakan', JSON.stringify(objSave)).then(function(e) {
                            var nama = medifirstService.getPegawaiLogin().namaLengkap
                            var objDel = {
                                // "norec_pp": $scope.dataPasienSelected.norec,
                                "norec_pp": $scope.dataPelayananSelected.norec
                            }
                            dataDel.push(objDel)
                            var objDelete = {
                                "dataDel": dataDel,
                                "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                                "alasan": "Jasa Pelayanan",
                                "pegawai": nama
                            };
                            var objverif = {
                                "pegawaiverif": $scope.dataLogin.id,
                                // "tglclosing" : tglclosing,
                                "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                                "produkfk": $scope.item.namaProduk.id,
                                "tglpelayanan": new moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm')
                            };
                            medifirstService.post('remunerasi/save-jasapelayanandoktersatuan', objverif).then(function(e) {
                                if (dataDel.length != 0) {
                                    medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function(e) {
                                        var objverif = {
                                            "norec": $scope.dataPelayananSelected.norec
                                        }
                                        medifirstService.post('remunerasi/delete-jasadokterpernorec', objverif).then(function(e) {
                                            $q.all([
                                                medifirstService.get("remunerasi/detail-jasapelayanan?" +
                                                    "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                                            ]).then(function(data) {
                                                $scope.isRouteLoading = false;
                                                $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                                    data: data[0].data.data,

                                                    total: data[0].data,
                                                    serverPaging: false,
                                                    schema: {
                                                        model: {
                                                            fields: {}
                                                        }
                                                    }
                                                });
                                            });
                                        })

                                    })

                                }
                            })

                            dataTindakanFix = [];
                            $scope.item.jenisPelaksana = "";
                            $scope.selectedPegawai = "";
                            $scope.dataTindakan = "";
                            $scope.item.namaProduk = "";
                            $scope.harga = "";
                            $scope.jumlah = "";
                            // $scope.tampil = false;
                            data2 = [];
                            $scope.winDialogssx.center().close();
                            $scope.hideSimpan = true;
                            $scope.dataTindakan = [];
                        }, function(error) {
                            dataTindakanFix = [];
                            $scope.item.jenisPelaksana = "";
                            $scope.selectedPegawai = "";
                            $scope.dataTindakan = "";
                            $scope.item.namaProduk = "";
                            $scope.harga = "";
                            $scope.jumlah = "";
                            $scope.tampil = false;

                            $scope.hideSimpan = false
                        })

                    }
                })
            }
            $scope.savex = function() {
                if ($scope.item.jumlah == 0) {
                    messageContainer.error("Jumlah tidak boleh nol")
                    return
                }
                data2 = [];
                var nomor = 0;
                if ($scope.dataTindakan == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }

                var data = {};
                data = {
                    rowNumber: nomor,
                    tglPelayanan: $scope.item.tglPelayanan,
                    produk: $scope.item.namaProduk, //$scope.item.noRegistrasi,
                    qty: $scope.item.jumlah,
                    hargaSatuan: $scope.item.hargaTindakan,
                    hargadiskon: 0,
                    subTotal: ($scope.item.hargaTindakan) * ($scope.item.jumlah),
                    listKomponen: $scope.listKomponen,
                    jenispelayananfk: 1,

                }
                data2.push(data)
                $scope.dataTindakan = new kendo.data.DataSource({
                    data: data2
                });
                $scope.gridPetugasPelaksana = new kendo.data.DataSource({
                    data: []
                })
                if ($scope.item.jenisPelaksana && $scope.selectedPegawai) {
                    var pushData = {
                        "idParent": data.rowNumber,
                        "jenisPetugas": {
                            "id": $scope.item.jenisPelaksana[0].id,
                            "jenisPelaksana": $scope.item.jenisPelaksana[0].jenispetugaspe
                        },
                        "listPetugas": $scope.selectedPegawai
                    }
                    $scope.gridPetugasPelaksana.add(pushData);
                }

                simpandata();

            }
            $scope.batalsave = function() {

                $scope.winDialogssx.center().close();
            }
            $scope.Back = function() {
                window.history.back();
            }
            $scope.click = function(dataDokterSelected) {
                if (dataDokterSelected != undefined) {
                    // var id = $scope.dataDokterSelected.jpp_id;
                    // medifirstService.get("pelayananpetugas/get-pegawaibyjenispetugaspe?objectjenispetugaspefk="+id).then(function(data){
                    //         $scope.dataSource = data.data.pegawai;

                    //     });
                    medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
                        .then(function(data) {

                            $scope.listPegawaiPemeriksa.add(data.data[0])
                            $scope.model.pegawais = data.data[0];

                        })
                    $scope.model.jenisPelaksana = { id: dataDokterSelected.jpp_id, jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe }
                        // $scope.model.pegawais={
                        //  id:dataDokterSelected.pg_id,
                        //  namalengkap:dataDokterSelected.namalengkap,


                    // }
                }
            }
            $scope.ubahtindakan = function() {
                    $scope.tampil = true;

                    $scope.item.tglPelayanan = $scope.dataPelayananSelected.tglpelayanan;
                    $scope.item.namapasienasal = $scope.dataPelayananSelected.namaruangan;
                    $scope.item.tindakanasal = $scope.dataPelayananSelected.namaproduk;
                    $scope.item.dokterasal = $scope.dataPelayananSelected.namalengkap;
                    $scope.item.ruanganasal = $scope.dataPelayananSelected.namaruangan;
                    $scope.item.jenisPelaksana = [({ id: $scope.dataPelayananSelected.objectjenispetugaspefk, jenispetugaspe: $scope.dataPelayananSelected.jenispetugaspe })]
                    $scope.selectedPegawai = [({ id: $scope.dataPelayananSelected.id, namalengkap: $scope.dataPelayananSelected.namalengkap })]

                    $scope.winDialogssx.center().open();

                    // $scope.item.jenisPelaksana = "Dokter Pemeriksa";
                    medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-tindakan?idRuangan=" +
                            $scope.dataPelayananSelected.ruanganfk +
                            "&idKelas="
                            // + $scope.dataPelayananSelected.kelasfk
                            +
                            $scope.dataPelayananSelected.kelasfk

                            , true, 10, 10)
                        .then(function(x) {
                            $scope.listProduk = x;
                            $scope.item.namaProduk = ({ id: $scope.dataPelayananSelected.produkfk, namaproduk: $scope.dataPelayananSelected.namaproduk });
                            getKomponenHarga();
                        });
                }
                // $scope.ubahtindakan = function(){

            //   var arrStr = {
            //       0: $scope.dataPelayananSelected.namaruangan,
            //       1: $scope.dataPelayananSelected.namaproduk,
            //       2: $scope.dataPelayananSelected.namalengkap,
            //       3: $scope.dataPelayananSelected.namaruangan
            //   }
            //   cacheHelper.set('x', arrStr);
            //   $state.go('InputTindakanJasa', {
            //       norecPD: $scope.dataPelayananSelected.norecpd,
            //       norecAPD: $scope.dataPelayananSelected.norecapd,

            //     });
            // }

            $scope.tambahtindakan = function(item, data) {;
                if ($scope.dataPelayananSelected == undefined) {
                    window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }

                if ($scope.item) {
                    $state.go('InputTindakanJasa', {
                        norecPD: $scope.dataPelayananSelected.norecpd,
                        norecAPD: $scope.dataPelayananSelected.norecapd,

                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }

            }
            $scope.columnDokters = [{
                    field: "jenispetugaspe",
                    title: "Jenis Pelaksana",
                    width: "100px",
                    // template: "#= jenisPetugas.jenisPelaksana #"
                },
                {
                    field: "namalengkap",
                    title: "Nama Pegawai",
                    width: "200px",
                    // template: multiSelectArrayToString
                }
            ];

            function SeeDokterPelaksana() {
                medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function(data) {
                    $scope.listJenisPelaksana = data.data.jenispetugaspelaksana;
                    // $scope.listPegawaiPemeriksa = data.data.pegawai;

                });
                medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function(data) {
                    $scope.listPegawaiPemeriksa = data;

                });
                // $scope.isRouteLoading=true;
                medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataPelayananSelected.norec).
                then(function(data) {
                    $scope.sourceDokterPelaksana = data.data.data;
                    // $scope.isRouteLoading=false;

                });
            }
            $scope.inputDokterPelaksana = function() {
                if ($scope.dataPelayananSelected == undefined) {
                    messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }

                SeeDokterPelaksana();
                $scope.item.tglPelayanans = $scope.dataPelayananSelected.tglPelayanan;
                $scope.item.namaPelayanans = $scope.dataPelayananSelected.namaproduk;
                // if ($scope.dataSelected.isparamedis == true)
                //   $scope.item.paramedis = true
                // else
                $scope.item.paramedis = false
                $scope.popup_editor.center().open();

            }
            $scope.saveLogging = function(jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function(data) {

                })
            }
            $scope.simpanDokterPelaksana = function() {
                if ($scope.model.jenisPelaksana == undefined && $scope.item.paramedis == undefined) {
                    if ($scope.model.jenisPelaksana == undefined) {
                        messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
                        return
                    }
                    if ($scope.model.pegawais == undefined) {
                        messageContainer.error("Pegawai Tidak Boleh Kosong")
                        return
                    }
                }


                var norec_ppp = "";
                if ($scope.dataDokterSelected != undefined) {
                    norec_ppp = $scope.dataDokterSelected.norec_ppp
                }

                if (norec_ppp == "") {
                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
                        for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
                            if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.model.jenisPelaksana.jenisPetugasPelaksana
                                // && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
                            ) {
                                messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
                                return
                            }
                        }
                    }
                }


                var pelayananpasienpetugas = {
                    norec_ppp: norec_ppp,
                    norec_pp: $scope.dataPelayananSelected.norec,
                    norec_apd: $scope.dataPelayananSelected.norecapd,
                    objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
                    objectpegawaifk: $scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,
                    isparamedis: $scope.item.paramedis,
                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,
                    noregistrasi: $scope.dataPasienSelected.noregistrasi

                }

                medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function(e) {
                    var jenis = 'Input/Ubah Petugas Layanan';
                    var norec = e.data.data.norec
                    $scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, '')
                    SeeDokterPelaksana();
                    // LoadData();


                    var data = {};
                    if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana != undefined && $scope.model.jenisPelaksana.id == 4) {
                        if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
                            data.dokter = $scope.model.pegawais.namalengkap
                            $scope.dataSelected.dokter = data.dokter

                        }
                    }

                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
                        for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
                            if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.item.paramedis != true && $scope.model.pegawais == undefined) {
                                $scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
                                break
                            }

                        }
                    }
                    // if ($scope.item.paramedis == true) {
                    //   $scope.dataSelected.paramedis = "✔"

                    // } else {
                    //   $scope.dataSelected.paramedis = ""

                    // }
                    $scope.model.jenisPelaksana = undefined;
                    $scope.model.pegawais = undefined;
                    $scope.dataDokterSelected = undefined;;

                    medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function(e) {
                        $scope.popup_editor.center().close();
                        $q.all([
                            medifirstService.get("remunerasi/detail-jasapelayanan?" +
                                "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                        ]).then(function(data) {
                            $scope.isRouteLoading = false;
                            $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                data: data[0].data.data,

                                total: data[0].data,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                }
                            });
                        });
                    })
                })

            }
            $scope.hapusDokterPelaksana = function() {
                if ($scope.dataDokterSelected == undefined) {
                    messageContainer.error("Pilih data Pegawai dulu!!")
                    return
                }

                var pelayananpasienpetugas = {
                    norec_ppp: $scope.dataDokterSelected.norec_ppp,
                    norec_pp: $scope.dataDokterSelected.norec_pp,

                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,
                    noregistrasi: $scope.dataPasienSelected.noregistrasi

                }
                medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function(e) {
                    SeeDokterPelaksana();
                    // LoadData();
                    $scope.model.jenisPelaksana = "";
                    $scope.model.pegawais = "";
                    $scope.dataDokterSelected = undefined;
                    // medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {

                    // })
                })
                var data = {};
                if ($scope.dataDokterSelected != undefined && $scope.model.jenisPelaksana.id == 4) {
                    if ($scope.dataDokterSelected.namaPelayanan == $scope.item.namaPelayanans) {
                        $scope.dataDokterSelected.dokter = "-"

                    }
                }
                medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function(e) {
                    $scope.popup_editor.center().close();
                    $q.all([
                        medifirstService.get("remunerasi/detail-jasapelayanan?" +
                            "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                    ]).then(function(data) {
                        $scope.isRouteLoading = false;
                        $scope.dataJasaPelayanan = new kendo.data.DataSource({
                            data: data[0].data.data,

                            total: data[0].data,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
                })

            }
            $scope.SearchData = function() {
                loadData()
                $scope.tampil = true;
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var reg = ""
                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                    tempNoReg = $scope.item.noReg

                }
                var rm = ""
                var tempNoRm = "";
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                    tempNoRm = $scope.item.noRm;
                }
                var nm = ""
                var tempNamaOrReg = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                    tempNamaOrReg = $scope.item.nama;
                }
                var ins = ""
                var tempInstalasiIdArr = {};
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                    tempInstalasiIdArr = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }
                var rg = ""
                var tempRuanganIdArr = {};
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                    tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
                }
                var kp = ""
                var tempKelompokArr = {};
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                    tempKelompokArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompokpasien }
                }
                var dk = ""
                var tempDokterArr = {};
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                var rekanan = "";
                if ($scope.item.rekanan != undefined) {
                    var rekanan = "&rekanan=" + $scope.item.rekanan.id

                }


                $q.all([
                    medifirstService.get("tatarekening/get-daftar-registrasi-pasienjasapelayanan?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk + rekanan +
                        '&jmlRows=' + jmlRows),
                ]).then(function(data) {
                    $scope.isRouteLoading = false;
                    // $scope.dataDaftarPasienPulang = data[0].data;
                    var onDataBound = function() {
                        $('td').each(function() {
                            if ($(this).text() == 'belum') { $(this).addClass('red') }
                            if ($(this).text() == 'verif') { $(this).addClass('green') }
                            if ($(this).text() == 'Sudah') { $(this).addClass('koneng') }
                            if ($(this).text() == 'BERKASRS') { $(this).addClass('koneng') }
                            if ($(this).text() == 'ATENSI') { $(this).addClass('koneng') }

                        })
                    }

                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: data[0].data,
                        pageSize: 5,
                        // height:50 ,
                        total: data[0].data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: tempNoReg,
                        3: tempNoRm,
                        4: tempNamaOrReg,
                        5: tempInstalasiIdArr,
                        6: tempRuanganIdArr,
                        7: tempKelompokArr,
                        8: tempDokterArr,
                        9: jmlRows
                    }
                    cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
                });

            };
            $scope.UbahDokter = function() {
                $scope.cboDokter = true
                $scope.cboUbahDokter = false
            }
            $scope.batal = function() {
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
            }
            $scope.PasienPulang = function() {;
                if ($scope.dataPasienSelected.tglpulang != undefined) {
                    window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih Data Pasien dulu', 'Caution');
                } else {
                    medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.dataPasienSelected.noregistrasi +
                        '&ruangId=' + $scope.dataPasienSelected.ruanganid).then(function(e) {
                        if (e.data.length > 0) {
                            $state.go('PindahPulangPasien', {
                                norecPD: $scope.dataPasienSelected.norec,
                                norecAPD: e.data[0].norec_apd
                            });
                            var CachePindah = $scope.dataPasienSelected.ruanganid
                            cacheHelper.set('CachePindah', CachePindah);
                        }

                    })

                }
                // var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
                // $scope.cbopasienpulang = true
                // $scope.cboUbahDokter=false
                // if ($scope.dataPasienSelected.tglpulang != null){
                // 	$scope.item.tanggalPulang=$scope.dataPasienSelected.tglpulang
                // }else{
                // 	$scope.item.tanggalPulang=tglpulang
                // }				
            }

            $scope.batalsimpantglpulang = function() {
                $scope.cbopasienpulang = false
                $scope.cboUbahDokter = true
            }

            //
            $scope.simpantglpulang = function() {
                //
                var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
                var updateTanggal = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                    "tglpulang": tglpulang
                }
                medifirstService.saveupdatetglpulang(updateTanggal).then(function(e) {
                    LoadData();
                })
                $scope.cbopasienpulang = false;
                $scope.cboUbahDokter = true;
            }

            $scope.klikGrid = function(dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
                }
            }
            $scope.simpan = function() {;
                var objSave = {
                    norec: $scope.dataPasienSelected.norec,
                    objectpegawaifk: $scope.item.namaDokter.id
                }

                medifirstService.postSaveDokter(objSave).then(function(e) {
                    loadData();
                    $scope.cboDokter = false
                    $scope.cboUbahDokter = true
                })

                medifirstService.saveUpdateDokter(objSave).then(function(e) {
                    loadData();
                    $scope.cboDokter = false
                    $scope.cboUbahDokter = true
                })

                /* update dokter pelayanan pasien yang kosong dokternya */
                var objPost = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                    "objectpegawaifk": $scope.item.namaDokter.id
                }
                medifirstService.updateDokterPelPasien(objPost).then(function(e) {

                })
                medifirstService.updateDokterPelPasienNew(objPost).then(function(e) {

                })



            }
            $scope.berkasrs = function() {
                var objverif = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi
                };
                medifirstService.post('remunerasi/delete-jasapelayanandokter', objverif).then(function(e) {

                    for (var i = 0; i < $scope.selectedData2.length; i++) {
                        var pelayananpasienpetugas = {
                                "norec_pp": $scope.selectedData2[i].norec
                            }
                            // dataMasuk.push(masuk)

                        var objSave = {
                            pelayananpasienpetugas: pelayananpasienpetugas,
                            noregistrasi: $scope.dataPasienSelected.noregistrasi,
                            tipe: 1,
                            tglclosing: moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss')


                        }
                        medifirstService.post('remunerasi/berkasrs', objSave).then(function(e) {
                            $q.all([
                                medifirstService.get("remunerasi/detail-jasapelayanan?" +
                                    "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                            ]).then(function(data) {
                                $scope.isRouteLoading = false;
                                $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                    data: data[0].data.data,

                                    total: data[0].data,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    }
                                });
                            });
                        })
                    }
                    $scope.selectedData2 = [];


                })

            }
            $scope.atensi = function() {
                var objverif = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi
                };
                medifirstService.post('remunerasi/delete-jasapelayanandokter', objverif).then(function(e) {

                    for (var i = 0; i < $scope.selectedData2.length; i++) {
                        var pelayananpasienpetugas = {
                                "norec_pp": $scope.selectedData2[i].norec
                            }
                            // dataMasuk.push(masuk)

                        var objSave = {
                            pelayananpasienpetugas: pelayananpasienpetugas,
                            noregistrasi: $scope.dataPasienSelected.noregistrasi,
                            tglclosing: moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss'),
                            tipe: 2

                        }
                        medifirstService.post('remunerasi/berkasrs', objSave).then(function(e) {
                            $q.all([
                                medifirstService.get("remunerasi/detail-jasapelayanan?" +
                                    "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                            ]).then(function(data) {
                                $scope.isRouteLoading = false;
                                $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                    data: data[0].data.data,

                                    total: data[0].data,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    }
                                });
                            });
                        })
                    }
                    $scope.selectedData2 = [];


                })

            }
            $scope.simpanubahtanggal = function() {

                for (var i = 0; i < $scope.selectedData2.length; i++) {

                    var objSave = {
                        norecpp: $scope.selectedData2[i].norecpp,
                        noregistrasi: $scope.dataPasienSelected.noregistrasi,
                        tglverif: moment($scope.item.tglverif).format('YYYY-MM-DD HH:mm:ss')


                    }
                    medifirstService.post('remunerasi/updatetglverif', objSave).then(function(e) {

                    })
                }

                $scope.selectedData2 = [];
                $q.all([
                    medifirstService.get("remunerasi/detail-jasapelayanan?" +
                        "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                ]).then(function(data) {
                    $scope.isRouteLoading = false;
                    var onDataBound = function() {
                        $('td').each(function() {
                            if ($(this).text() == 'belum') { $(this).addClass('red') }
                            if ($(this).text() == 'verif') { $(this).addClass('green') }
                            if ($(this).text() == 'Sudah') { $(this).addClass('koneng') }

                        })
                    }
                    $scope.dataJasaPelayanan = new kendo.data.DataSource({
                        data: data[0].data.data,

                        total: data[0].data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });


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
            $scope.CetakPenagihan = function() {

                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                var tempnamadepartemen = "";
                if ($scope.item.instalasi != undefined) {
                    tempDepartemenId = $scope.item.instalasi.id;
                    tempnamadepartemen = $scope.item.instalasi.departemen;

                }
                //
                var tempRuanganId = "";
                var tempRuanganNama = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                    tempRuanganNama = $scope.item.ruangan.ruangan;
                }

                var tempDokter = "";
                var tempDokternama = "";
                if ($scope.item.dokter != undefined) {
                    tempDokter = $scope.item.dokter.id;
                    tempDokternama = $scope.item.dokter.nama;
                }


                var tempRekanan = "";
                var tempNamaRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    tempRekanan = $scope.item.rekanan.id;
                    tempNamaRekanan = $scope.item.rekanan.namarekanan;
                }

                var tempPenjamin = "";
                var tempNamapenjamin = "";
                if ($scope.item.kelompokpasien != undefined) {
                    tempPenjamin = $scope.item.kelompokpasien.id;
                    tempNamapenjamin = $scope.item.kelompokpasien.kelompokpasien;
                }

                var stt = 'false'
                if (confirm('View Laporan Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporanpenagihanpenjamin=1&tglawal=' + tglAwal + '&tglakhir=' + tglAkhir + '&departement=' + tempDepartemenId + '&ruangan=' + tempRuanganId + '&ruangannama=' + tempRuanganNama + '&idpenjamin=' + tempPenjamin + '&namapenjamin=' + tempNamapenjamin + '&namarekanan=' + tempNamaRekanan + '&view=' + stt, function(response) {
                    // do something with response
                });
            }

            $scope.simpandiskonptt = function() {
                var objSave = {
                    noregistrasi: $scope.dataPasienSelected.noregistrasi,
                    diskon: $scope.item.tarifdiskonptt
                        // tglverif : moment($scope.item.tglverif).format('YYYY-MM-DD HH:mm:ss')


                }
                medifirstService.post('remunerasi/updatediskonptt', objSave).then(function(e) {

                })
            }
            $scope.simpandiskon = function() {

                    // for (var i = 0; i < $scope.selectedData2.length; i++){

                    var objSave = {
                        noregistrasi: $scope.dataPasienSelected.noregistrasi,
                        diskon: $scope.item.tarifdiskonptt
                            // tglverif : moment($scope.item.tglverif).format('YYYY-MM-DD HH:mm:ss')


                    }
                    medifirstService.post('remunerasi/updatediskon', objSave).then(function(e) {

                        })
                        // }

                    // $scope.selectedData2 = [];
                    $q.all([
                        medifirstService.get("remunerasi/detail-jasapelayanan?" +
                            "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                    ]).then(function(data) {
                        $scope.isRouteLoading = false;
                        var onDataBound = function() {
                            $('td').each(function() {
                                if ($(this).text() == 'belum') { $(this).addClass('red') }
                                if ($(this).text() == 'verif') { $(this).addClass('green') }
                                if ($(this).text() == 'Sudah') { $(this).addClass('koneng') }

                            })
                        }
                        $scope.dataJasaPelayanan = new kendo.data.DataSource({
                            data: data[0].data.data,
                            // pageSize: 10,
                            total: data[0].data,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });


                }
                // $scope.atensi = function(){
                //   var objverif = {
                //                 "noregistrasi": $scope.dataPasienSelected.noregistrasi
                //         };
                //   medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
                //     //   medifirstService.post('remunerasi/berkasrs',dataMasuk).then(function(e){

            //     // })               
            //   }) 
            //   
            //   for (var i = 0; i < $scope.selectedData2.length; i++){
            //       var  pelayananpasienpetugas = {
            //         "norec_pp": $scope.selectedData2[i].norec
            //       }
            //       // dataMasuk.push(masuk)

            //       var objSave = {
            //         pelayananpasienpetugas:pelayananpasienpetugas,
            //         noregistrasi : $scope.dataPasienSelected.noregistrasi,
            //         tipe:2

            //       }
            //       medifirstService.post('remunerasi/berkasrs', objSave).then(function (e) {

            //       })
            //   }

            //   $scope.selectedData2 = [];
            //   $q.all([
            //           medifirstService.get("remunerasi/detail-jasapelayanan?"+
            //             "noregistrasi="+$scope.dataPasienSelected.noregistrasi),
            //           ]).then(function(data) {
            //             $scope.isRouteLoading=false;
            //             $scope.dataJasaPelayanan = new kendo.data.DataSource({
            //                           data: data[0].data.data,
            //                           // pageSize: 10,
            //                           total:data[0].data,
            //                           serverPaging: false,
            //                           schema: {
            //                               model: {
            //                                   fields: {
            //                                   }
            //                               }
            //                           }
            //                       });
            //           });


            // }
            $scope.hapustindakan = function() {
                $scope.isRouteLoading = true;
                if ($scope.selectedData2.length == 0) {
                    alert('Ceklis data yang akan dihapus')
                    return;
                }
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                dataDel = [];
                for (var i = 0; i < $scope.selectedData2.length; i++) {
                    var objDel = {
                        // "norec_pp": $scope.dataPasienSelected.norec,
                        "norec_pp": $scope.selectedData2[i].norec,
                    }
                    dataDel.push(objDel)
                }

                var objDelete = {
                    "dataDel": dataDel,
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                    "alasan": "Jasa Pelayanan",
                    "pegawai": nama
                };
                if (dataDel.length != 0) {
                    // medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
                    // var  objverif = {
                    //     "norec": $scope.dataPelayananSelected.norec        
                    // }
                    // medifirstService.post('remunerasi/delete-jasadokterpernorec',objverif).then(function(e){
                    // var  objverif = {
                    //     "norec": $scope.dataPelayananSelected.norec        
                    // }
                    medifirstService.post('remunerasi/delete-jasadokterbanyaknorec', objDelete).then(function(e) {
                        $scope.selectedData2 = [];
                        $q.all([
                            medifirstService.get("remunerasi/detail-jasapelayanan?" +
                                "noregistrasi=" + $scope.dataPasienSelected.noregistrasi),
                        ]).then(function(data) {
                            $scope.isRouteLoading = false;
                            $scope.dataJasaPelayanan = new kendo.data.DataSource({
                                data: data[0].data.data,
                                // pageSize: 10,
                                total: data[0].data,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                }
                            });
                        });

                    })

                    // })

                }

            }
            $scope.batalDokterPelaksana = function() {
                // LoadData();
                $scope.model.jenisPelaksana = "";
                $scope.model.pegawais = "";
                $scope.dataDokterSelected = undefined;
                $scope.popup_editor.center().close();


            }
            $scope.close = function() {
                $scope.winDialogss2.center().close();
            }
            $scope.Detail = function() {
                if ($scope.dataPasienSelected.status == 'verif') {
                    alert('Sudah diverifikasi')
                    return;
                }
                if ($scope.item.tglclosing != "" && $scope.item.tglclosing != undefined) {
                    var tglclosing = moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    alert('Isi Tanggal Closing')
                    return
                }

                var tglnk = moment($scope.item.tglnk).format('YYYY-MM-DD HH:mm:ss');


                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    // var objSave ={
                    // 	noregistrasi:$scope.dataPasienSelected.noregistrasi
                    // }
                    // // medifirstService.postJurnalAkuntansi(objSave).then(function(data){

                    // //             });
                    // var namakelas='nonkelas'
                    // if($scope.dataPasienSelected.namakelas=='Kelas I'){
                    // 	namakelas=1
                    // }else if($scope.dataPasienSelected.namakelas=='Kelas II'){
                    // 	namakelas=2
                    // }else if($scope.dataPasienSelected.namakelas=='Kelas III'){
                    // 	namakelas=3
                    // }
                    //   	var obj = {
                    //   		// x:'x'
                    // 	noRegistrasi : $scope.dataPasienSelected.noregistrasi,
                    // 	nosep:$scope.dataPasienSelected.nosep,
                    // 	objectdepartemenfk: $scope.dataPasienSelected.objectdepartemenfk,
                    // 	kelasrawat: namakelas,
                    // 	noka:$scope.dataPasienSelected.nokepesertaan,
                    // 	tglregistrasi:moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
                    // 	kdpoli:$scope.dataPasienSelected.kdinternal
                    //  	}

                    //  	$state.go('RincianPasienVerifikasi', {
                    //    	dataPasien: JSON.stringify(obj)
                    //  	});
                    var objverif = {
                        // "data": $scope.selectedData,
                        "pegawaiverif": $scope.dataLogin.id,
                        "tglclosing": tglclosing,
                        "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                        "tglnk": tglnk
                    };
                    var json = {
                            'noregistrasi': $scope.dataPasienSelected.noregistrasi,
                            'close': true
                        }
                        // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
                        // loadData();
                    $scope.tampil = false;
                    medifirstService.post('remunerasi/save-jasapelayanandokter', objverif).then(function(e) {
                            // loadData();
                            $scope.tampil = true;
                            medifirstService.post('tatarekening/save-log-closing', json).then(function(e) {
                                LoadData();
                                Detail3lihat($scope.dataPasienSelected.noregistrasi, $scope.dataPasienSelected.nocm);
                            })
                        })
                        // })	


                }
            }
            $scope.Detail2 = function() {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    // var objSave ={
                    // 	noregistrasi:$scope.dataPasienSelected.noregistrasi
                    // }
                    // // medifirstService.postJurnalAkuntansi(objSave).then(function(data){

                    // //             });
                    // var namakelas='nonkelas'
                    // if($scope.dataPasienSelected.namakelas=='Kelas I'){
                    // 	namakelas=1
                    // }else if($scope.dataPasienSelected.namakelas=='Kelas II'){
                    // 	namakelas=2
                    // }else if($scope.dataPasienSelected.namakelas=='Kelas III'){
                    // 	namakelas=3
                    // }
                    //   	var obj = {
                    //   		// x:'x'
                    // 	noRegistrasi : $scope.dataPasienSelected.noregistrasi,
                    // 	nosep:$scope.dataPasienSelected.nosep,
                    // 	objectdepartemenfk: $scope.dataPasienSelected.objectdepartemenfk,
                    // 	kelasrawat: namakelas,
                    // 	noka:$scope.dataPasienSelected.nokepesertaan,
                    // 	tglregistrasi:moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
                    // 	kdpoli:$scope.dataPasienSelected.kdinternal
                    //  	}

                    //  	$state.go('RincianPasienVerifikasi', {
                    //    	dataPasien: JSON.stringify(obj)
                    //  	});
                    var objverif = {
                        // "data": $scope.selectedData,
                        "pegawaiverif": $scope.dataLogin.id,
                        // "penjamin" : $scope.item.namaPenjamin,
                        "noregistrasi": $scope.dataPasienSelected.noregistrasi
                    };
                    medifirstService.post('remunerasi/delete-jasapelayanandokter', objverif).then(function(e) {
                        loadData();
                        $scope.winDialogss2.center().close();
                        var json = {
                            'alasanbatalclosing': "Unverifikasi",
                            'noregistrasi': $scope.dataPasienSelected.noregistrasi,
                            'close': false
                        }
                        medifirstService.post('tatarekening/save-log-unclosing', json).then(function(e) {

                        })
                    })
                }
            }
            $scope.ubahrekanan = function() {
                $scope.popup_editor2.center().open();
            }
            $scope.simpanrekanan = function() {
                var objverif = {
                    "rekanan": $scope.item.rekanan2.id,
                    "kelompokpasien": $scope.item.kelompokpasien2.id,
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi
                };
                medifirstService.post('remunerasi/ubahrekanan-jasapelayanandokter', objverif).then(function(e) {
                    loadData();
                })

            }
            $scope.ubahtanggal = function() {
                $scope.popup_tanggal.center().open();
            }

            $scope.kembalitanggal = function() {
                $scope.popup_tanggal.center().close();
            }
            $scope.kembalirekanan = function() {
                $scope.popup_editor2.center().close();
            }
            $scope.diskontagihan = function() {
                $scope.popup_diskon.center().open();
                $scope.item.tarifdiskon = parseFloat($scope.dataPelayananSelected.hargadiscount)
            }
            $scope.kembalidiskon = function() {
                $scope.popup_editor2.center().close();
            }
            $scope.diskonptt = function() {
                $scope.popup_diskonptt.center().open();
                // $scope.item.tarifdiskonptt = parseFloat($scope.dataPelayananSelected.hargadiscount)
            }
            $scope.kembalidiskonptt = function() {
                $scope.popup_diskonptt.center().close();
            }

            function loadKomponen() {
                medifirstService.get("remunerasi/get-komponenharga-pelayanan?norec_pp=" + $scope.dataPelayananSelected.norec).
                then(function(data) {
                    $scope.sourceKomponens = new kendo.data.DataSource({
                        data: data.data.data,
                        serverPaging: false,
                        pageSize: 10,
                        schema: {
                            model: {
                                fields: {
                                    komponenharga: { type: "string" },
                                    jumlah: { type: "number" },
                                    tarif: { type: "number" },
                                    hargadiscount: { type: "number" },
                                    jasa: { type: "number" },
                                    bruto: { type: "bruto" },
                                    pph: { type: "pph" },
                                    netto: { type: "netto" },

                                }
                            }
                        },
                        aggregate: [
                            { field: 'tarif', aggregate: 'sum' },
                            { field: 'hargadiscount', aggregate: 'sum' },
                            { field: 'jasa', aggregate: 'sum' },
                            { field: 'bruto', aggregate: 'sum' },
                            { field: 'pph', aggregate: 'sum' },
                            { field: 'netto', aggregate: 'sum' },
                        ]


                    });
                    // $scope.sourceKomponens = data.data.data;

                });
            }
            $scope.ubahkomponen = function() {
                if ($scope.dataPelayananSelected == undefined) {
                    messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }
                // 
                loadKomponen();
                $scope.item.tglPelayanans = moment(new Date($scope.dataPelayananSelected.tglPelayanan)).format('DD-MM-YYYY HH:mm')
                $scope.item.namaPelayanans = $scope.dataPelayananSelected.namaPelayanan;
                $scope.popupKomponen.center().open();
                // Get current actions
                var actions = $scope.popupKomponen.options.actions;
                // Remove "Close" button
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.popupKomponen.setOptions({ actions: actions });

            }
            $scope.klikKomponen = function(dataSelectedKomponen) {
                // if (dataSelectedKomponen.komponenharga != "Jasa Sarana") {
                // $scope.button = false;
                // $scope.billing = false;
                // $scope.cetak = false;
                // $scope.dtTanggal = false;
                // $scope.FilterData = false;

                $scope.DiskonKM = true;
                $scope.label = dataSelectedKomponen.komponenharga;
                $scope.item.komponenDis = parseFloat(dataSelectedKomponen.tarif);
                $scope.item.discount = parseFloat(dataSelectedKomponen.tarif);
                $scope.item.diskonKomponen = parseFloat(dataSelectedKomponen.bruto);
                $scope.item.persenDiscount = "";
                // $scope.item.diskonKomponen = "";
                $scope.item.JasaKomponen = dataSelectedKomponen.jasa;
                norec_ppd = dataSelectedKomponen.norecppd
                norec_pp = dataSelectedKomponen.norec_pp
                    // strukfk = $scope.dataSelected.strukfk
                tarif = dataSelectedKomponen.tarif
                    // } else {
                    //   $scope.DiskonKM = false;
                    // }
            }
            $scope.columnKomponens = {
                sortable: true,
                // pageable: true,
                selectable: "row",
                columns: [{
                        "field": "komponenharga",
                        "title": "Komponen",
                        "width": "100px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "50px"
                    },
                    {
                        "field": "tarif",
                        "title": "Harga Satuan",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: tarif #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.tarif.sum  #', '')}}</span>"
                    },
                    {
                        "field": "bruto",
                        "title": "bruto",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: bruto #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "{{formatRupiah('#:data.bruto.sum  #', '')}}"
                    },

                    {
                        "field": "pph",
                        "title": "pph",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: pph #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "{{formatRupiah('#:data.pph.sum  #', '')}}"
                    },
                    {
                        "field": "netto",
                        "title": "netto",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: netto #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "{{formatRupiah('#:data.netto.sum  #', '')}}"
                    },
                    // {
                    //   "field": "jasa",
                    //   "title": "Jasa Cito",
                    //   "width": "80px",
                    //   "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    //   aggregates: ["sum"],
                    //   footerTemplate: "<span class='style-right'>{{formatRupiah('#:data.jasa.sum  #', '')}}</span>"
                    // },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
            };
            $scope.Detail3 = function() {
                Detail3lihat($scope.dataPasienSelected.noregistrasi, $scope.dataPasienSelected.nocm);

                // if($scope.dataPasienSelected.noregistrasi!= undefined){
                // $scope.winDialogss.center().open();
                // $q.all([
                // 	medifirstService.get("remunerasi/detail-jasapelayanan?"+
                // 		"noregistrasi="+$scope.dataPasienSelected.noregistrasi),
                // 	]).then(function(data) {
                //     $scope.item.nocm = $scope.dataPasienSelected.nocm;
                // 		$scope.isRouteLoading=false;
                // 		$scope.dataJasaPelayanan = new kendo.data.DataSource({
                //                   data: data[0].data.data,
                //                   // pageSize: 10,
                //                   total:data[0].data,
                //                   serverPaging: false,
                //                   schema: {
                //                       model: {
                //                           fields: {
                //                           }
                //                       }
                //                   }
                //               });
                // 	});
                // }
            }

            function Detail3lihat(noregis, nocm) {
                if (noregis != undefined) {
                    $scope.winDialogss2.center().open();
                    $q.all([
                        medifirstService.get("remunerasi/detail-jasapelayanan?" +
                            "noregistrasi=" + noregis),
                    ]).then(function(data) {
                        $scope.item.nocm = nocm;
                        $scope.isRouteLoading = false;
                        $scope.dataJasaPelayanan = new kendo.data.DataSource({
                            data: data[0].data.data,

                            total: data[0].data,

                            schema: {
                                model: {
                                    fields: {
                                        jumlah: { editable: true, type: "number", validation: { min: 0, max: 100 } },
                                        namaruangan: { editable: false, type: "string" },
                                        tglpelayanan: { editable: false, type: "string" },
                                        namaproduk: { editable: false, type: "string" },
                                        namalengkap: { editable: false, type: "string" },
                                        hargajual: { editable: false, type: "string" },
                                        hargadiscount: { editable: false, type: "string" },
                                        tglverif: { editable: false, type: "string" },
                                        berkasrs: { editable: false, type: "string" },
                                        jasamedis: { editable: false, type: "string" },
                                        jasaperawat: { editable: false, type: "string" },
                                        jasaoperator: { editable: false, type: "string" },
                                        jasaanastesi: { editable: false, type: "string" }
                                    }
                                }
                            }

                        });
                    });
                }
            }
            $scope.verifikasigrid = function(dataPasienSelected) {
                tempnoregis = dataPasienSelected.noregistrasi;
                if ($scope.item.tglclosing != "" && $scope.item.tglclosing != undefined) {
                    var tglclosing = moment($scope.item.tglclosing).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    alert('Isi Tanggal Closing')
                    return
                }

                var tglnk = moment($scope.item.tglnk).format('YYYY-MM-DD HH:mm:ss');
                var objverif = {
                    "tglclosing": tglclosing,
                    "tglnk": tglnk,
                    "pegawaiverif": $scope.dataLogin.id,
                    "noregistrasi": dataPasienSelected.noregistrasi
                };
                //sementara
                $scope.tampil = false;
                // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
                // loadData();  
                medifirstService.post('remunerasi/save-jasapelayanandokter', objverif).then(function(e) {
                    //sementara
                    $scope.dataPasienSelected = dataPasienSelected;
                    Detail3lihat(dataPasienSelected.noregistrasi, dataPasienSelected.nocm);
                    loadData();
                    $scope.tampil = true;

                })


            }
            $scope.simpanjumlah = function(dataPasienSelected) {
                debugger;
                var tempnorec = dataPasienSelected.norec;
                var tempjumlah = dataPasienSelected.jumlah;
                var objverif = {
                    "norec": tempnorec,
                    "jumlah": tempjumlah,
                };
                //sementara
                $scope.tampil = false;
                medifirstService.post('remunerasi/update-jumlah', objverif).then(function(e) {
                    $scope.dataPasienSelected = dataPasienSelected;
                    Detail3lihat(dataPasienSelected.noregistrasi, dataPasienSelected.nocm);
                    loadData();
                    $scope.tampil = true;

                })


            }
            $scope.DaftarRuangan = function() {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }


                    cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
                    // cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
                    $state.go('AntrianPasienDiperiksa', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
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
            $scope.cetakKartu = function() {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.tglpulang == undefined) {
                    window.messageContainer.error("Pasien Belum Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noReg = "";
                else
                    var noReg = $scope.dataPasienSelected.noregistrasi;
                var stt = 'false'
                if (confirm('View Kartu Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function(response) {
                    // do something with response
                });
            }
            $scope.SuratKontrol = function() {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    $state.go('RincianTagihanTataRekening', {
                        dataPasien: JSON.stringify(obj)
                    });
                }

                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noregistrasi = "";
                else

                    var obj = {
                    noRegistrasi: $scope.dataPasienSelected.noregistrasi
                }

                $state.go('PerjanjianPasien', {
                    dataPasien: JSON.stringify(obj)
                });
                // var stt = 'false'
                // if (confirm('View Surat Kontrol? ')){
                //     // Save it!
                //     stt='true';
                // }else {
                //     // Do nothing!
                //     stt='false'
                // }
                // var client = new HttpClient();        
                // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-suratPerjanjianbynocm=1&nocm='+nocm+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
                //     // do something with response
                // });
            }
            $scope.EditSEP = function() {
                $scope.item.noPeserta = "";
                $scope.item.noSep = "";

                if ($scope.dataPasienSelected.norec == null) {
                    messageContainer.error("Pasien Belum Dipilih!!")
                    return;
                }
                if ($scope.dataPasienSelected.kelompokpasien != "BPJS") {
                    messageContainer.error("Input SEP hanya untuk pasien BPJS")
                    return;
                }
                // if($scope.dataPasienSelected.norec_pa ==null){
                // 	messageContainer.error("Pemakaian Asuransi tidak ada")
                // 	return;
                // }

                if ($scope.dataPasienSelected.nokepesertaan != undefined) {
                    $scope.item.noPeserta = $scope.dataPasienSelected.nokepesertaan;
                }

                if ($scope.dataPasienSelected.nokepesertaan != undefined) {
                    $scope.item.noSep = $scope.dataPasienSelected.nosep;
                }


                $scope.cboSep = true
                $scope.cboUbahSEP = false
                $scope.cboDokter = false
                $scope.cboUbahDokter = false
            }
            $scope.simpanSep = function() {
                var norec_pa = ""
                if ($scope.dataPasienSelected.norec_pa != undefined)
                    norec_pa = $scope.dataPasienSelected.norec_pa
                var updateSep = {
                    "norec": $scope.dataPasienSelected.norec,
                    "nokepesertaan": $scope.item.noPeserta,
                    "nosep": $scope.item.noSep,
                    "norec_pa": norec_pa,
                    "nocm": $scope.dataPasienSelected.nocm,
                }

                medifirstService.postSaveSepTarek(updateSep).then(function(e) {
                    loadData();
                    $scope.saveLogInputSep()
                })

                $scope.cboSep = false
                $scope.cboUbahSEP = true
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
            }
            $scope.saveLogInputSep = function() {
                    var jenisLog = 'Input SEP'
                    var referensi = 'Norec Pemakaian Asuransi'
                    var keterangan = 'Input Sep - ' + $scope.item.noSep + ' No Registrasi ' + $scope.dataPasienSelected.noregistrasi
                    medifirstService.get("logging/save-log-all?jenislog=" +
                        jenisLog + "&referensi=" + referensi +
                        "&noreff=" + $scope.dataPasienSelected.norec_pa +
                        "&keterangan=" + keterangan
                    ).then(function(data) {
                        $scope.item.noPeserta = "";
                        $scope.item.noSep = "";
                    })
                }
                //end log
            $scope.batalSep = function() {
                $scope.item.noPeserta = "";
                $scope.item.noSep = "";
                $scope.cboSep = false
                $scope.cboUbahSEP = true
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
            }

            $scope.resumeMedis = function() {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.get('registrasipasien/get-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi +
                    '&objectruanganlastfk=' + $scope.dataPasienSelected.ruanganid).then(function(e) {
                    if (e.data.data.length > 0) {

                        var arrrStr = {
                            0: $scope.dataPasienSelected.nocm,
                            1: $scope.dataPasienSelected.namapasien,
                            2: $scope.dataPasienSelected.jeniskelamin,
                            3: $scope.dataPasienSelected.noregistrasi,
                            // 4: $scope.dataPasienSelected.umur,
                            5: $scope.dataPasienSelected.kelompokpasien,
                            6: $scope.dataPasienSelected.tglregistrasi,
                            7: e.data.data[0].norec_apd,
                            8: $scope.dataPasienSelected.norec,
                            // 9: $scope.dataPasienSelected.objectkelasfk,
                            // 10: $scope.dataPasienSelected.namakelas,
                            11: $scope.dataPasienSelected.ruanganid,
                            12: $scope.dataPasienSelected.namaruangan
                        }
                        cacheHelper.set('cacheRekamMedis', arrrStr);
                        $state.go('ResumeMedisRI', {
                            noRec: e.data.data[0].norec_apd
                        })
                    }
                })

            }

            function postKunjunganYankes() {
                let status = false
                var tanggal = moment(new Date()).format('YYYY-MM-DD')
                medifirstService.get('yankes/get-kunjungan?tgl=' + tanggal)
                    .then(function(a) {
                        var result = a
                        if (result.data.list != undefined && result.data.list.length > 0) {
                            for (var i = 0; i < result.data.list.length; i++) {
                                if (moment(new Date()).format('YYYY-MM-DD') == result.data.list[i].tanggal) {
                                    status = true
                                    medifirstService.get('yankes/count-kunjungan-pasien')
                                        .then(function(d) {
                                            let datt = d.data
                                            var jsonSave = {
                                                "data": {
                                                    "kode_kirim": result.data.list[i].kode,
                                                    "tanggal": moment(new Date()).format('YYYY-MM-DD'),
                                                    "kunjungan_rj": datt.data.rawat_jalan,
                                                    "kunjungan_igd": datt.data.igd,
                                                    "pasien_ri": datt.masihDirawat // result.data.rawat_inap,
                                                }
                                            }

                                            medifirstService.post('yankes/update-kunjungan', jsonSave)
                                                .then(function(c) {
                                                    var resp = c.data
                                                    if (resp.kode == 200) {
                                                        toastr.success('Post Bridging Yankes')
                                                    }

                                                }, error => {
                                                    toastr.error('Post Bridging Yankes Gagal')
                                                });
                                        })
                                    break
                                }
                            }
                        }
                        if (status == false) {
                            medifirstService.get('yankes/count-kunjungan-pasien')
                                .then(function(b) {
                                    let result = b.data
                                    var jsonSave = {
                                        "data": {
                                            "kode_kirim": null,
                                            "tanggal": moment(new Date()).format('YYYY-MM-DD'),
                                            "kunjungan_rj": result.data.rawat_jalan,
                                            "kunjungan_igd": result.data.igd,
                                            "pasien_ri": result.masihDirawat // result.data.rawat_inap,
                                        }
                                    }

                                    medifirstService.post('yankes/insert-kunjungan', jsonSave)
                                        .then(function(c) {
                                            var resp = c.data
                                            if (resp.kode == 200) {
                                                toastr.success('Post Bridging Yankes')
                                            }

                                        }, error => {
                                            toastr.error('Post Bridging Yankes Gagal')
                                        });
                                })
                        }
                    })

            }

            function getSisrute() {
                // 
                var now = moment(new Date()).format('YYYY-MM-DD')
                medifirstService.get('sisrute/rujukan/get?tanggal=' + now).then(function(response) {
                    $scope.jmlRujukanMasuk = response.data.total
                    console.log('rujukan masuk : ' + response.data.total)
                })
                medifirstService.get('sisrute/rujukan/get?tanggal=' + now + '&create=true').then(function(response) {
                    $scope.jmlRujukanKeluar = response.data.total
                    console.log('rujukan masuk : ' + response.data.total)
                })
            }
            $scope.$watch('item.kelompokpasien', function(e) {;
                if (e === undefined) return;
                if ($scope.isLoadEdit == true) {
                    $scope.nonUmum = true;
                    $scope.isLoadEdit = false;
                    return;
                }
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function(z) {;
                        $scope.listRekanan = z.data.rekanan;
                    })
            });
            $scope.$watch('item.kelompokpasien2', function(e) {;
                if (e === undefined) return;
                if ($scope.isLoadEdit == true) {
                    $scope.nonUmum = true;
                    $scope.isLoadEdit = false;
                    return;
                }
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function(z) {;
                        $scope.listRekanan2 = z.data.rekanan;
                    })
            });

            function postRujukanYankes() {
                // 
                let status = false
                medifirstService.get('yankes/get-rujukan?tgl=' + moment(new Date()).format('YYYY-MM-DD')).then(function(res) {
                    var resultData = res.data.list
                    if (resultData != undefined && resultData.length > 0) {
                        for (var i = 0; i < resultData.length; i++) {
                            if (moment(new Date()).format('YYYY-MM-DD') == resultData[i].tanggal) {
                                status = true
                                var jsonSave = {
                                    "data": {
                                        "kode_kirim": resultData[i].kode,
                                        "tanggal": resultData[i].tanggal,
                                        "jumlah_rujukan": $scope.jmlRujukanMasuk,
                                        "jumlah_rujuk_balik": $scope.jmlRujukanKeluar,
                                    }
                                }
                                medifirstService.post('yankes/update-rujukan', jsonSave)
                                    .then(function(response) {
                                        console.log('Update Yankes Rujukan')
                                    }, error => {});
                                break
                            }
                        }
                    }

                    if (status == false) {
                        var da = {
                            "data": {
                                "kode_kirim": null,
                                "tanggal": moment(new Date()).format('YYYY-MM-DD'),
                                "jumlah_rujukan": $scope.jmlRujukanMasuk,
                                "jumlah_rujuk_balik": $scope.jmlRujukanKeluar,

                            }
                        }

                        medifirstService.post('yankes/insert-rujukan', da)
                            .then(function(response) {
                                console.log('Insert Yankes Rujukan')
                            }, error => {});
                    }
                })




            }
            $scope.UpdateDiskon = function() {

                var objSave = {
                    norec: norec_ppd,
                    norecpp: norec_pp,
                    tarifrs: $scope.item.discount,
                    bruto: $scope.item.diskonKomponen
                        // hargakomponen: $scope.item.komponenDis,
                }
                medifirstService.post('remunerasi/updatekomponen', objSave).then(function(data) {
                    loadKomponen();
                });


            }

            $scope.inputtarifincbg = function() {
                // LoadData()
                $scope.popupinacbg.center().open();
                $scope.item.tarifrs = $scope.dataPasienSelected.totalharusdibayar
            }
            $scope.kembaliinacbg = function() {
                // LoadData()
                $scope.popupinacbg.center().close();
            }
            $scope.BatalDiskon = function() {
                    // LoadData()
                    $scope.popupKomponen.center().close();
                }
                //  $scope.$watch('item.discount', function (newValue, oldValue) {
                //   if (newValue != oldValue) {

            //     $scope.item.diskonKomponen = (parseFloat($scope.item.komponenDis)) - parseFloat($scope.item.discount)
            //   }
            // })

            // END ################

        }
    ]);
});