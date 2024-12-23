define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OrderLaboratoriumCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$window',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $window) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglPelayanan = $scope.now;
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            $scope.header.DataNoregis = true
            var produkDef = []
            var temphasil = [];
            $scope.pilihLayanan = 0
            $scope.statusstruk = false;
            var detail = ''


            var jenisPelayananId = ''
            var namaRuanganFk = ''
            var namaRuangan = ''
            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    namaRuanganFk = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    // if ($scope.header.DataNoregis == undefined) {
                    //     $scope.header.DataNoregis = false;
                    // }
                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                    medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                             $scope.statusstruk = true;
                        }
                    })
                    medifirstService.get('sysadmin/general/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                        jenisPelayananId = e.data.jenispelayanan
                        init()
                    })
                    //** */
                }
            }
            var urlHasilVansLab = ''
            medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                urlHasilVansLab = dat.data

            })
            var data2 = [];
            // $scope.PegawaiLogin2 = {};
            // var namaRuangan = ''
            // var namaRuanganFk = ''
            $scope.listProdukCek = []
            $scope.getProduk = function (ruangan) {
                $scope.listProdukCek = []
                $scope.item.layanan = []
                produkDef = []
                medifirstService.get("sysadmin/general/get-tindakan-with-details?idRuangan="
                    + ruangan.id
                    + "&idKelas="
                    + $scope.item.idKelas

                    + "&idJenisPelayanan="
                    + jenisPelayananId
                    + "&isLabRad=true")
                    .then(function (x) {
                        $scope.listProdukCek = x.data.details
                        produkDef = x.data.details
                        // $scope.listLayanan = x;
                        // $scope.item.layanan = '';
                        // $scope.item.hargaTindakan = '';
                        //    $scope.isRouteLoading = false;

                    })
            }
            // $scope.$watch('item.ruangantujuan', function (newValue, oldValue) {
            //     if ( newValue!= undefined && jenisPelayananId != '' && $scope.item.namaRuangan!= undefined) {
            //         var RuangRanap = "&Ruangan=" + $scope.item.namaRuangan;
            //         medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
            //             + newValue.id
            //             + "&idKelas="
            //             + 6
            //             + RuangRanap
            //             + "&idJenisPelayanan="
            //             + jenisPelayananId
            //             , true, 10, 10)
            //             .then(function (x) {
            //                 $scope.listLayanan = x;
            //                 //    $scope.isRouteLoading = false;
            //             })


            //         // modelItemAkuntansi.getDataDummyPHPV2('pelayanan/get-produk-penunjang-part?idRuangan='+newValue.id,true,10,10).then(function(e){
            //         //     $scope.listLayanan = e
            //         // })
            //     }

            // })

            function init() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                })
                medifirstService.get("emr/get-combo-penunjang?departemenfk=3", true).then(function (dat) {

                    $scope.item.ruanganAsal = $scope.item.namaRuangan
                    $scope.listRuanganTujuan = dat.data.ruangantujuan;
                    $scope.item.ruangantujuan = {
                        id: dat.data.ruangantujuan[0].id,
                        namaruangan: dat.data.ruangantujuan[0].namaruangan,
                        ipaddress: dat.data.ruangantujuan[0].ipaddress != undefined ? dat.data.ruangantujuan[0].ipaddress : null
                    }
                    $scope.getProduk($scope.item.ruangantujuan)
                    // // $scope.listLayanan = dat.data.produk;
                    // namaRuanganFk = dat.data.data[0].objectruanganfk
                    // norec_pd = dat.data.data[0].noregistrasifk
                });
                // medifirstService.get("get-detail-login", true).then(function (dat) {
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                // });

                if ($scope.header.DataNoregis == true) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)

                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)

                }
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                    // });
                    //tanda trisno
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm2hasil?nocm=" +  $scope.item.noMr + "&ruid=" + 575, true).then(function(dat) {
                    temphasil = dat.data;

                    medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm2?nocm=" +  $scope.item.noMr + "&ruid=" + 575
                        // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                        , true).then(function(dat) {
                            if (dat.data.data.length > 0) {
                                $scope.item.tgllahir = dat.data.data[0].tgllahir
                                $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                            }
                            for (var i = 0; i < dat.data.data.length; i++) {
                                dat.data.data[i].no = i + 1
                                dat.data.data[i].statCheckbox = false;
                                //tanda trisno
                                for (var j = 0; j < temphasil.data.length; j++) {
                                    if (dat.data.data[i].norec_pp == temphasil.data[j].norec) {
                                        dat.data.data[i].flaglab = temphasil.data[j].flag;
                                        dat.data.data[i].tglcetak = temphasil.data[j].tglcetak;
                                        dat.data.data[i].tglhasil = temphasil.data[j].tglhasil;
                                        // dat.data.data[i].pp.data.tglcetak = temphasil.data[j].tglcetak;
                                        // dat.data.data[i].pp.data[0].tglcetak = temphasil.data[j].tglcetak;
                                    }
                                }

                                if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                    dat.data.data[i].statusbridging = "✔";
                                    // ✅
                                    // ✔
                                } else {
                                    dat.data.data[i].statusbridging = "✘";
                                    // ✘
                                    // ❎
                                }
                                if (dat.data.data[i].iscito == "1") {
                                    dat.data.data[i].statuscito = "✔";
                                    // ✅
                                    // ✔
                                } else {
                                    dat.data.data[i].statuscito = "✘";
                                    // ✘
                                    // ❎
                                }
                                if (dat.data.data[i].statusperiksa == 1) {
                                    dat.data.data[i].statusperiksa = "✔";
                                } else {
                                    dat.data.data[i].statusperiksa = "✘";
                                }

                            }
                            if (dat.data.data.length > 0) {
                                if (dat.data.data[0].objectdepartemenfk == 3)
                                    $scope.disableRad = true
                                if (dat.data.data[0].objectdepartemenfk == 27)
                                    $scope.disableLab = true
                            }
                            $scope.isLoading = false;

                            
                            $scope.dataGridLab = {
                                data: dat.data.data,
                                _data: dat.data.data,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: dat.data.data.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };

                            // $scope.popUpPelayanan.center().open();

                        },
                        function(error) {
                            $scope.isLoading = false;
                        });
                })
                // if ($scope.header.DataNoregis == true) {
                //     loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)

                // } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)

                // }
            
            }

            function loadRiwayat(params) {
                medifirstService.get('emr/get-riwayat-order-penunjang?' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }

            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)
                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }
            }
            $scope.LihatHasil = function (data) {
                //;
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                cacheHelper.set('hideHasilLab', undefined);

                if (norec_apd != null) {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.item.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelompokPasien,
                        6: $scope.item.tglRegistrasi,
                        7: norec_apd,
                        8: norec_pd,
                        9: $scope.item.idKelas,
                        10: $scope.item.kelas,
                        11: namaRuanganFk,
                        12: $scope.item.namaRuangan,
                        13: '',
                        14: null,
                        15: [],
                        // 16: $scope.dataGrid._data[i].tglpelayanan ,
                    }
                    cacheHelper.set('hideHasilLab', true);
                    cacheHelper.set('chaceHasilLab2', arrStr);

                    // $state.go('HasilLaboratoriumRev', {
                    //     norecPd: norec_pd,
                    //     norecApd: norec_apd,
                    //     norecPP: dataCetakFix

                    // })
                    window.open("/app/#/SGFzaWxMYWJvcmF0b3JpdW0=/"+ $scope.dataSelectedRiwayat.noorder)
                    // $state.go('HasilLaboratorium', {
                    //     noOrder: $scope.dataSelectedRiwayat.noorder,
                    //     // norecApd: norec_apd,
                    //     // norecPP: dataCetakFix
                    // })
                    // if(urlHasilVansLab ==''){
                    //     toastr.error('Periksa Setting Data Fixed VANS LAB ')
                    //     return
                    // }
                    // $window.open(urlHasilVansLab +  $scope.dataSelectedRiwayat.noorder, "_blank");
                    // var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                    // cacheHelper.set('chaceHasilLab', arrStr);
                    // $state.go('HasilLaboratorium', {
                    //     norecPd: $scope.dataSelectedRiwayat.norecpd,
                    //     noOrder: $scope.dataSelectedRiwayat.noorder,
                    //     norecApd: norec_apd,
                    // })
                }

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGridLab = {
                scrollable: true,
                selectable: false,
                pageable: true,
                columns: [{
                        "title": "",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px",
                        // attributes: {
                        //     // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        // },
                    },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        // attributes: {
                        //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        // attributes: {
                        //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        // attributes: {
                        //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        // attributes: {
                        //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        // "template": "<button class=\"k-button custom-button #=resumemedis != 'Belum diisi' ? 'dark-green' : 'dark-red' # \" ng-click=\"ResumeRI(dataItem)\" style=\"margin:0 5px 5px\">#:  resumemedis #</button>",

                        "template": "<button class=\"k-button custom-button #=flaglab != 'N' ? 'dark-red' : 'dark-green' # \" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        //     attributes: {
                        //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        //    },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        // attributes: {
                        //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        // attributes: {
                        //     class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // },
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    {
                        "field": "noorder",
                        "title": "No Order",
                        "width": "100px",
                    },
                    {
                        "field": "nostruk",
                        "title": "No Struk",
                        "width": "80px"
                    },
                    {
                        "field": "statusbridging",
                        "title": "Status Kirim",
                        "width": "50px",
                    },
                    {
                        "field": "statusperiksa",
                        "title": "Status Periksa",
                        "width": "100px",

                    },
                    {
                        "field": "statuscito",
                        "title": "Status Cito",
                        "width": "100px",
                    },
                    {
                        "field": "nofoto",
                        "title": "No Foto",
                        "width": "100px",
                    },
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "10px",
                    // },
                    // {
                    //     "field": "tglorder",
                    //     "title": "Tgl Order",
                    //     "width": "90px",
                    // },
                    // {
                    //     "field": "ruangan",
                    //     "title": "Nama Ruangan",
                    //     "width": "140px"
                    // },
                    // {
                    //     "field": "produkfk",
                    //     "title": "Kode",
                    //     "width": "40px",
                    // },
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    // },
                    // {
                    //     "field": "jumlah",
                    //     "title": "Qty",
                    //     "width": "40px",
                    // },
                    // {
                    //     "field": "hargasatuan",
                    //     "title": "Harga Satuan",
                    //     "width": "80px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    // },
                    // {
                    //     "field": "hargadiscount",
                    //     "title": "Diskon",
                    //     "width": "80px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                    // },
                    // {
                    //     "field": "total",
                    //     "title": "Total",
                    //     "width": "80px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                    // },
                    // {
                    //     "field": "nostruk",
                    //     "title": "No Struk",
                    //     "width": "80px"
                    // }
                ]
            };
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "90px",
                },
                {
                    "field": "ruangan",
                    "title": "Nama Ruangan",
                    "width": "140px"
                },
                {
                    "field": "produkfk",
                    "title": "Kode",
                    "width": "40px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "80px"
                }
            ];

            $scope.columnGridOrder = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty",
                    "width": "40px",
                }
            ];
            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                // {
                //     "field": "keteranganlainnya",
                //     "title": "Keterangan",
                //     "width": "100px",
                // },

                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width": "70px",
                // },
                // {
                //     "field": "cito",
                //     "title": "Cito",
                //     "template": '# if( cito==true) {# ✔ # } else {# ✘ #} #',
                //     "width": "70px",
                // }
            ];
            // key 24-11-2023
            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataGridLab._data, function (data) {
                    // aaa = {
                    //         'produkfk' : dataItem.produkfk
                    // }
                    // return data.produkfk == dataItem.produkfk;
                    return data.norec_pp == dataItem.norec_pp;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                } else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.dataGridLab._data);
            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                
                var tempData = $scope.dataGridLab._data;

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

                reloadDataGrid(tempData);
            }
            // key 25-11-2023
            $scope.hasilLab = function () {
                var user = medifirstService.getPegawaiLogin();
                var daftarCetak = [];
                var daftarSimpan = [];
                var produkfk = [];
                if ($scope.dataSelected == undefined) {
                    alert('Klik Grid Yang Dipilih');
                    return;
                }
                
                for (var i = 0; i < $scope.dataGridLab._data.length; i++) {
                    if ($scope.dataGridLab._data[i].statCheckbox) {
                        // daftarCetak.push($scope.dataGridLab._data[i].norec_pp)
                        daftarCetak.push({
                            "norec_pp": $scope.dataGridLab._data[i].norec_pp,
                            "tglPelayanan": $scope.dataGridLab._data[i].tglpelayanan,
                            "produkfk": $scope.dataGridLab._data[i].produkfk,
                        })
                    }
                }
                for (var i = 0; i < $scope.dataGridLab._data.length; i++) {
                    if ($scope.dataGridLab._data[i].statCheckbox) {
                        // daftarCetak.push($scope.dataGridLab._data[i].norec_pp)
                        daftarSimpan.push({
                            "norec_pp": $scope.dataGridLab._data[i].norec_pp,
                        })
                    }
                }
                var dataCetakFix = '';
                var result = ''
                for (let i = 0; i < daftarCetak.length; i++) {
                    const element = daftarCetak[i];
                    if (daftarCetak.length == 1) {
                        dataCetakFix = "'" + element.norec_pp + "'"
                    } else if (daftarCetak.length == i + 1) {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""
                    } else {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ","
                    }

                }

                if (daftarCetak.length == 0) {
                    toastr.error('Ceklis data yang mau di cetak')
                    return
                }

                if (norec_apd != null) {
                    var dokterP = "";
                    var idDokterP = "";
                    if ($scope.dataSelected != undefined) {
                        dokterP = $scope.dataSelected.dokter;
                        idDokterP = $scope.dataSelected.dokterid;

                    }
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.item.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelompokPasien,
                        6: $scope.item.tglRegistrasi,
                        7: norec_apd,
                        8: norec_pd,
                        9: $scope.item.kelas.id,
                        10: $scope.item.kelas.namakelas,
                        11: namaRuanganFk,
                        12: namaRuangan,
                        13: $scope.item.tgllahir,
                        14: $scope.item.objectjeniskelaminfk,
                        15: dataCetakFix,
                        // 16: $scope.dataGridLab._data[i].tglpelayanan ,
                        17: dokterP,
                        16: idDokterP,
                        18: daftarSimpan,
                        19: daftarCetak,
                        20: $scope.dataSelected.NamaAnalisLab

                    }
                    cacheHelper.set('chaceHasilLab2', arrStr);

                    
                    $state.go('HasilLaboratoriumRev', {
                        norecPd: norec_pd,
                        norecApd: norec_apd,
                        norecPP: dataCetakFix,
                        pforukfk: daftarCetak

                    })
                }

            }
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {
                $scope.batal();
            }

            $scope.add = function () {
                //    if ($scope.item.statusVerif == true) {
                //           toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                //           return;
                //       }
                if ($scope.isSelesaiPeriksa == true) {
                    toastr.error("Data Sudah Diclosing!");
                    return;
                }
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGridOrder == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.produkfk = $scope.item.layanan.id
                            data.namaproduk = $scope.item.layanan.namaproduk
                            data.qtyproduk = parseFloat($scope.item.qty)
                            data.objectruanganfk = namaRuanganFk
                            data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                            data.pemeriksaanluar = $scope.item.pemeriksaanKeluar === true ? 1 : 0
                            data.iscito = $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false
                            data.objectkelasfk = $scope.item.idKelas
                            data.nourut = null
                            data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.layanan.id,
                        namaproduk: $scope.item.layanan.namaproduk,
                        qtyproduk: parseFloat($scope.item.qty),
                        objectruanganfk: namaRuanganFk,
                        objectruangantujuanfk: $scope.item.ruangantujuan.id,
                        pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                        iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                        objectkelasfk: $scope.item.idKelas,
                        nourut: null,
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.batal();
            }
            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                    if ($scope.listLayanan[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listLayanan[i]
                        break;
                    }
                }
                $scope.item.layanan = dataProduk;

                $scope.item.qty = dataSelected.qtyproduk
                $scope.item.pemeriksaanKeluar = dataSelected.pemeriksaanluar == 1 ? true : false
            }
            $scope.hapus = function () {
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }

                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            // data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                }
                $scope.batal();
            }
            $scope.batal = function () {
                $scope.item.layanan = []
                $scope.item.hargaTindakan = ''
                $scope.item.qty = 1
                $scope.item.no = undefined
            }
            $scope.BatalOrder = function () {
                data2 = []
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
                $scope.item.layanan = []
                delete $scope.item.keterangan
                $scope.CmdOrderPelayanan = true;
                $scope.OrderPelayanan = false;
            }
            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.inputOrder = false;
            }
            $scope.newOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
            }
            $scope.Simpan = function () {
                // if( $scope.statusstruk = true){
                //      alert("Data sudah di closing!!")
                //     return
                // }
                   if ($scope.item.statusVerif == true) {
                          toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                          return;
                      }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }
                if ($scope.item.tglPelayanan == undefined) {
                    alert("Pilih Tgl Order  terlebih dahulu!!")
                    return
                }
                if ($scope.item.layanan == undefined || $scope.item.layanan.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }
                var arrobj = Object.keys($scope.item.layanan)
                var data2 = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.layanan[parseInt(arrobj[i])] == true) {
                        var data = {
                            no: i + 1,
                            produkfk: arrobj[i],
                            namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: namaRuanganFk,
                            objectruangantujuanfk: $scope.item.ruangantujuan.id,
                            pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                            objectkelasfk: $scope.item.idKelas,
                            nourut: null,
                        }
                        data2.push(data)
                    }
                }

                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: norec_apd,
                    norec_pd: norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: namaRuanganFk,
                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    departemenfk: 3,
                    pegawaiorderfk: $scope.PegawaiLogin2.id,
                    keterangan: $scope.item.keterangan != undefined ? $scope.item.keterangan : null,
                    iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                    details: data2,
                }

                $scope.isSimpan = true
                medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                    $scope.item.layanan = []
                    $scope.isSimpan = false
                    medifirstService.postLogging('Order Laboratorium', 'Norec strukorder_t', e.data.strukorder.norec, 'Order Laboratorium No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                    })
                    /*
                    call notif ds
                    */
                    var noorder = e.data.strukorder.noorder
                    var tglorder = e.data.strukorder.tglorder
                    tglorder = tglorder.replace(' ', '%20');
                    var namaPasien = $scope.item.namaPasien
                    namaPasien = namaPasien.replace(' ', '%20');

                    // if ($scope.item.ruangantujuan != undefined) {
                    //     if ($scope.item.ruangantujuan.ipaddress) {
                    //         var ip = $scope.item.ruangantujuan.ipaddress.split(',')
                    //         if (ip.length > 0) {
                    //             for (var i = 0; i < ip.length; i++) {
                    //                 const ips = ip[i]
                    //                 if (ips == null) return

                    //                 var client = new HttpClient();
                    //                 client.get('http://' + ips + ':3385/epicnotif/bewara?add-notif=1&noorder=' +
                    //                     noorder + '&tglorder=' + tglorder + '&noregistrasi=' + $scope.item.noregistrasi
                    //                     + '&nocm=' + $scope.item.noMr + '&namapasien=' + namaPasien
                    //                     + '&namaruangan=' + $scope.item.ruangantujuan.namaruangan
                    //                     , function (s) { });

                    //             }
                    //         }
                    //     }
                    // }

                    init();
                    $scope.BatalOrder();


                })
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

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
 $scope.CetakLabKlinikLangsung = function(dataItem) {
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function(data) {
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }
                    }
                });

                if (dataItem.tglhasil == null) {
                    alert("Hasil Tidak Ditersedia.");
                    return;
                } else {
                    var umurDay = dataItem.umur
                    var tglpelayanan = dataItem.tglpelayanan
                    var tglhasil = dataItem.tglhasil
                    var tglcetak = dataItem.tglcetak
                    var norecPP = "'" + dataItem.norec_pp + "'"
                    var norecAPD = dataItem.norec_apd
                    var ruangan = dataItem.ruangan
                    var ruanganasal = dataItem.namaruanganasal
                    var dokterpemeriksa = dataItem.dokterpemeriksa
                    var dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    norec_pp = "'" + dataItem.norec_pp + "'"

                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }
                    umurDay = parseInt(umurDay);
                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noReg
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "tglpengambilan", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["RS BHAYANGKARA CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Moh. Toha No.369, Ciseureuh, Kec. Regol, Kota Bandung, Jawa Barat 40256", user.namaLengkap,
                            x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, tglpelayanan, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log(this.response, typeof this.response);
                            ;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    if (window.location.hostname.indexOf('localhost') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else  {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    }  
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
            }
            $scope.cetakResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
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
            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }
            $scope.resep = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }
            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }
            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }
            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }
            $scope.hapusOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data yang mau dihapus')
                    return
                }
                if ($scope.dataSelectedRiwayat.statusorder != 'PENDING') {
                    toastr.error('Tidak bisa dihapus')
                    return
                }
                var data = {
                    norec_order: $scope.dataSelectedRiwayat.norec
                }
                medifirstService.post('emr/delete-order-pelayanan', data)
                    .then(function (e) {
                        init()

                    })
            }
            // $scope.getHargaTindakan = function () {
            //     $scope.item.hargaTindakan = $scope.item.layanan.hargasatuan;

            //   }

            $scope.getHargaTindakan = function () {
                delete $scope.item.hargaTindakan
                // $scope.item.qty = 1
                getKomponenHarga()
            }

            function getKomponenHarga() {

                if ($scope.item.layanan != undefined) {
                    $scope.listKomponen = []
                    medifirstService.get("sysadmin/general/get-komponenharga?idRuangan="
                        + $scope.item.ruangantujuan.id
                        + "&idKelas=" + $scope.item.idKelas
                        + "&idProduk=" + $scope.item.layanan.id
                        + "&idJenisPelayanan=" + jenisPelayananId
                        // +"&idKelas="
                        // +$scope.item.pasien.objectkelasfk
                        // +"&idJenisPelayanan="
                        // + $scope.item.pasien.objectjenispelayananfk
                    ).then(function (dat) {
                        $scope.listKomponen = dat.data.data;
                        $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                        $scope.item.jumlah = 1;
                    })

                }
            }
            $scope.paket = {}
            $scope.cekPaket = function (bool) {

                if (bool) {
                    if ($scope.item.ruangantujuan == undefined) {
                        toastr.error('Pilih ruangan dulu')
                        return
                    }
                    $scope.popUpPaket.center().open()
                    medifirstService.get('sysadmin/general/get-paket-tindakan').then(function (e) {
                        $scope.sourcePaket = new kendo.data.DataSource({
                            data: e.data,
                            pageSize: 10,
                        });
                    })

                } else {

                }

            }
            $scope.optionsPaket = {
                // dataBound: function () {
                //     this.expandRow(this.tbody.find("tr.k-master-row"));
                // },
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "namapaket", title: "Nama Paket", width: 120, },
                    { field: "jml", title: "Jumlah Tindakan", width: 80 },
                ],
            };
            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        { field: "namaproduk", title: "Nama Pelayanan", width: 120 }
                    ]
                }
            };
            $scope.tutupPaket = function () {
                kosongkanPaket()
                $scope.item.paket = false
                $scope.popUpPaket.close()
            }

            var timeoutPromise;
            $scope.$watch('paket.namaPaket', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    applyFilter("namapaket", newVal)
                }
            })

            // $scope.$watch('item.layanan', function (newVal, oldVal) {
            //     var arrobj = Object.keys(newVal)
            //     for (let x = 0; x < arrobj.length; x++) {
            //         const element = arrobj[x];
            //         if ($scope.item.layanan[element] == true) {
            //             $scope.pilihLayanan = $scope.pilihLayanan + 1
            //         }
            //     }
            // })
            $scope.$watch('item.filterLayanan', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal == "") {
                        $scope.listProdukCek = produkDef
                        return
                    }
                    if (newVal == undefined) return

                    $scope.listTempProduk = []
                    var name = newVal.toLowerCase()
                    for (var i = produkDef.length - 1; i >= 0; i--) {
                        const elem = produkDef[i]
                        $scope.listTempProduk.push({
                            id: elem.id,
                            detailjenisproduk: elem.detailjenisproduk,
                            details: []
                        })
                        for (var x = elem.details.length - 1; x >= 0; x--) {
                            const element = elem.details[x];
                            var arr = element.namaproduk.toLowerCase()
                            if ((arr.indexOf(name) > -1)) {
                                for (let y = 0; y < $scope.listTempProduk.length; y++) {
                                    const element2 = $scope.listTempProduk[y];
                                    if (element2.id == elem.id)
                                        element2.details.push(element)
                                }
                            }
                            // if ($scope.item.layanan != undefined) {
                            //     var arrobj = Object.keys($scope.item.layanan)
                            //     for (let x = 0; x < arrobj.length; x++) {
                            //         const element3 = arrobj[x];
                            //         for (let y = 0; y < $scope.listTempProduk.length; y++) {
                            //             const element2 = $scope.listTempProduk[y];
                            //             if ($scope.item.layanan[element3] == true && element.id != element3) {
                            //                 element2.details.push(element)
                            //             }
                            //         }
                            //     }
                            // }
                        }

                    }
                    $scope.listProdukCek = []
                    $scope.listProdukCek = $scope.listTempProduk
                    if ($scope.item.layanan != undefined && $scope.item.layanan != '') {
                        for (let i = 0; i < $scope.listProdukCek.length; i++) {
                            const element1 = $scope.listProdukCek[i];
                            var arrobj = Object.keys($scope.item.layanan)
                            for (let x = 0; x < element1.details.length; x++) {
                                const element2 = element1.details[x];
                                for (let x = 0; x < arrobj.length; x++) {
                                    const element3 = arrobj[x];
                                    if (element2.id == element3) {
                                        $scope.item.layanan[element3] = true
                                        // element.isChecked = true
                                    }
                                }
                            }
                        }
                    }
                }
            })
            $scope.resetFilter = function () {
                delete $scope.item.filterLayanan
                $scope.listProdukCek = []
                $scope.listProdukCek = produkDef
                if ($scope.item.layanan != undefined) {
                    for (let i = 0; i < $scope.listProdukCek.length; i++) {
                        const element1 = $scope.listProdukCek[i];
                        var arrobj = Object.keys($scope.item.layanan)
                        for (let x = 0; x < element1.details.length; x++) {
                            const element2 = element1.details[x];
                            for (let x = 0; x < arrobj.length; x++) {
                                const element3 = arrobj[x];
                                if (element2.id == element3) {
                                    $scope.item.layanan[element3] = true
                                    // element.isChecked = true
                                }
                            }
                        }
                    }
                }
            }

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridPaket").data("kendoGrid");
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
            $scope.resetFilterPaket = function () {
                var dataGrid = $("#gridPaket").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.paket = {};
            }
            $scope.klikPaket = function (select) {
                $scope.totalHargaDefault = 0
                // var arr = select.details

                // for (var i = 0; i < arr.length; i++) {
                //     const element = arr[i];
                //     $scope.listKomponen = []

                //     medifirstService.get("sysadmin/general/get-komponenharga-paket?idRuangan="
                //         + $scope.item.ruangantujuan.id
                //         + "&idKelas=" + 6
                //         + "&idProduk=" + element.objectprodukfk
                //         + "&idJenisPelayanan=" + jenisPelayananId
                //     ).then(function (dat) {
                //         if (dat.data.data.length == 0) {
                //             return
                //         }
                //         $scope.totalHargaDefault = $scope.totalHargaDefault + parseFloat(dat.data.data2[0].hargasatuan)

                //     })
                // }
            }
            $scope.tambahPaket = function () {
                if ($scope.dataPaketSelect == undefined) {
                    toastr.error('Pilih Paket dulu')
                    return
                }

                var arr = $scope.dataPaketSelect.details
                $scope.loading = true
                var arrobj = Object.keys($scope.item.layanan)
                for (var i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (arrobj.length > 0) {
                        for (let x = 0; x < arrobj.length; x++) {
                            const element = arrobj[x];
                            if (element != element.objectprodukf)
                                $scope.item.layanan[element.objectprodukfk] = true
                        }
                    } else {
                        $scope.item.layanan[element.objectprodukfk] = true
                    }

                    // $scope.listKomponen = []
                    /**
                     * PROPORSI dari komponen
                     */
                    // medifirstService.get("sysadmin/general/get-komponenharga-paket?idRuangan="
                    //     +$scope.item.ruangantujuan.id
                    //     + "&idKelas=" + 6
                    //     + "&idProduk=" + element.objectprodukfk
                    //     + "&idJenisPelayanan=" + jenisPelayananId
                    // ).then(function (dat) {
                    //     if (dat.data.data.length == 0) {
                    //         toastr.error('Mapping tindakan belum ada, Hubungi IT', 'Error')
                    //         return
                    //     }
                    //     var hargasatuan = parseFloat(dat.data.data2[0].hargasatuan)
                    //     if ($scope.dataPaketSelect.hargapaket != 0
                    //         && $scope.dataPaketSelect.hargapaket < $scope.totalHargaDefault) { // ** mun paketna lebih murah */
                    //         // 
                    //         hargasatuan = $scope.dataPaketSelect.hargapaket / $scope.totalHargaDefault * hargasatuan

                    //         //** Kompoonen */
                    //         for (let j = 0; j < dat.data.data.length; j++) {
                    //             const element = dat.data.data[j];
                    //             element.hargasatuan = hargasatuan / parseFloat(dat.data.data2[0].hargasatuan) * parseFloat(element.hargasatuan)
                    //             // 
                    //             element.hargasatuan = element.hargasatuan.toFixed(2)
                    //         }
                    //     }

                    //     $scope.listKomponen = dat.data.data;
                    // var nomor = 0
                    // if ($scope.dataGridOrder == undefined) {
                    //     nomor = 1
                    // } else {
                    //     nomor = data2.length + 1
                    // }
                    // var data = {
                    //     no: nomor,
                    //     produkfk: element.objectprodukfk,
                    //     namaproduk: element.namaproduk,
                    //     qtyproduk: 1,
                    //     objectruanganfk: namaRuanganFk,
                    //     objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    //     pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                    //     objectkelasfk: $scope.item.idKelas,
                    //     nourut: null,
                    // }
                    // data2.push(data)

                    // $scope.dataGridOrder = new kendo.data.DataSource({
                    //     data: data2
                    // });
                    // })


                }
                $scope.loading = false
                // $scope.batal()
            }
            function kosongkanPaket() {
                $scope.selectedPegawaiPaket = []
                delete $scope.paket.jenisPelaksana
                delete $scope.paket.namaPaket
            }
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1