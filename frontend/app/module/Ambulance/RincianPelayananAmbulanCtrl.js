define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RincianPelayananAmbulanCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', '$window', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, $window, medifirstService) {
            $scope.item = {};
            // RincianPelayananAmbulan            
            $scope.now = new Date();
            $scope.isLoading = false;
            var norec_apd = ''
            var norec_pd = ''
            var norec_so = ''
            var statusVerif = ''

            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var departemenfk = ''

            LoadCache();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('RincianPelayananAmbulanCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.kelompokPasien = chacePeriode[13]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    $scope.item.dokter = chacePeriode[14]
                    norec_apd = chacePeriode[8]
                    namaRuangan = chacePeriode[9]
                    namaRuanganFk = chacePeriode[10]
                    norec_pd = chacePeriode[11]
                    norec_so = chacePeriode[12]
                    departemenfk = chacePeriode[16]
                    $scope.item.jenisPenjamin = chacePeriode[17]

                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        }
                    })
                    $scope.item.ruanganAsal = namaRuangan;
                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });

                    init()

                } else {

                }

            }
            function init() {
                $scope.isLoading = true;
                medifirstService.get("ambulance/get-data-combo-labrad?objectkelasfk=" + $scope.item.kelas.id, true).then(function (dat) {
                    $scope.listRuanganTujuan = dat.data.ruangantujuan;
                    $scope.listLayanan = dat.data.produk;
                    $scope.listDokter = dat.data.dokter;
                })
                medifirstService.get("ambulance/get-data-rincian-ambulan?noregistrasifk=" + norec_apd                    
                    , true).then(function (dat) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1;
                            dat.data.data[i].statCheckbox = false;
                        }                      
                        $scope.isLoading = false;

                        $scope.dataGrid = {
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
                    });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                columns: [
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px"
                    },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },
                    // {
                    //     "field": "produkfk",
                    //     "title": "Kode",
                    //     "width" : "70px",
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "Petugas",
                        "title": "Dokter",
                        "width": "140px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Diskon",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                        // footerTemplate: "<span class='style-center'>Total</span>",
                    },
                    {
                        "field": "jasa",
                        "title": "Jasa Cito",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                        footerTemplate: "<span class='style-center'>Total</span>",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                        footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
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
                    }
                    //  {
                    //     "field": "statuscito",
                    //     "title": "Status Cito",
                    //     "width": "30px",
                    // }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }               
            }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataGrid._data, function (data) {
                    return data.norec_pp == dataItem.norec_pp;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.dataGrid._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    // pageSize: 10,
                    total: ds.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]

                });

                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }


            $scope.columnGridOrder = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
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
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {

            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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

            $scope.InputTindakan = function () {

                if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
                if ($scope.item) {
                    $state.go('InputTindakan', {
                        norecPD: norec_pd,
                        norecAPD: norec_apd,

                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.HapusTindakan = function () {
                if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
                var logData = []
                var dataDel = []
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        var data = {
                            "norec_pp": $scope.dataGrid._data[i].norec_pp,
                        }
                        dataDel.push(data)

                        logData.push({
                            "norec_apd": $scope.dataGrid._data[i].norec_apd,
                            "tglPelayanan": $scope.dataGrid._data[i].tglpelayanan,
                            "diskon": $scope.dataGrid._data[i].hargadiscount,
                            "harga": $scope.dataGrid._data[i].hargasatuan,
                            "jumlah": $scope.dataGrid._data[i].jumlah,
                            "klid": 6,
                            "prid": $scope.dataGrid._data[i].produkfk,
                            "jasa": 0,

                        })
                    }
                }

                var objDelete = {
                    "dataDel": dataDel,
                };
                if (dataDel.length > 0) {

                    medifirstService.post('ambulance/delete-pelayanan-pasien',objDelete).then(function (e) {
                        var objLog = {
                            "pelayananpasiendelete": logData
                        }
                        medifirstService.post('sysadmin/logging/save-log-hapus-tindakan',objLog).then(function (e) {

                        })
                        init()
                    })
                }
                else {
                    toastr.error('Ceklis yang mau di hapus')
                }
            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {

                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.simpanDokter = function (dokter) {
                if (dokter == undefined) {
                    toastr.error('Pilih dokter dulu')
                    return
                }
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        if ($scope.dataGrid._data[i].idbridging != null) {
                            toastr.error('Data Sudah Dikirim Ke LIS')
                            return
                        }
                        var parameter = $scope.dataGrid._data[i].ruangan;
                        if (parameter.indexOf('Radiologi') >= 0) {
                            toastr.error('Kirim Ke LIS hanya untuk Lab')
                            return
                        }

                        if ($scope.dataGrid._data[i].noorder == null) {
                            var data2 = [];
                            for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                if ($scope.dataGrid._data[i].statCheckbox) {
                                    var data = {
                                        "produkfk": $scope.dataGrid._data[i].produkfk,
                                        "namaproduk": $scope.dataGrid._data[i].namaproduk,
                                        "qtyproduk": parseFloat($scope.dataGrid._data[i].jumlah),
                                        "objectruanganfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectruangantujuanfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectkelasfk": $scope.item.kelas.id,
                                        "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                        "namadokter": $scope.dataGrid._data[i].dokter,
                                        "dokterid": $scope.dataGrid._data[i].dokterid,
                                        "iscito": $scope.dataGrid._data[i].iscito,
                                    }
                                    data2.push(data)
                                }
                            }

                            var objSave = {
                                status: "bridinglangsung",
                                norec_apd: norec_apd,
                                norec_pd: norec_pd,
                                norec_so: "",
                                qtyproduk: data2.length,
                                // norec_pp:$scope.dataGrid._data[0].norec_pp,
                                objectruanganfk: $scope.dataGrid._data[0].objectruanganfk,
                                objectruangantujuanfk: $scope.dataGrid._data[0].objectruanganfk,
                                departemenfk: $scope.dataGrid._data[0].objectdepartemenfk,
                                pegawaiorderfk: $scope.dataGrid._data[0].dokterid,
                                details: data2
                            }


                            medifirstService.post('ambulance/simpan-data-pelayanan-ambulan',objSave).then(function (e) {
                                var responeData = e

                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": e.data.strukorder.noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                    "iddokterorder": dokter.id,
                                    "namadokterorder": dokter.namalengkap,
                                }
                                // manageServicePhp.saveBridingSysmex(itemsave).then(function (e) {
                                //     init()
                                // })
                            })

                        } else {
                            if ($scope.dataGrid._data[i].idbridging == null) {
                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                            "noorder": $scope.dataGrid._data[i].noorder,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": dataPost[0].noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                    "iddokterorder": dokter.id,
                                    "namadokterorder": dokter.namalengkap,
                                }

                                // manageServicePhp.saveBridingSysmex(itemsave).then(function (e) {
                                //     init()
                                // })
                            }
                        }
                    }

                }
                $scope.popUpDokter.close();
            }


            $scope.LihatHasil = function () {
                if ($scope.dataSelected == undefined) {

                    toastr.error('Pilih No Order dulu')
                    return
                }
                $scope.noOrder = $scope.dataSelected.noorder;
                if ($scope.showRadiologi == true) {
                    // manageLogistikPhp.getDataTableTransaksi("dokter/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
                    //     .then(function (e) {
                    //         $scope.dataRisOrder = e.data.data[0];

                    //         if ($scope.dataRisOrder != undefined) {
                    //             $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.item.noMr + '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                    //         } else {
                    //             toastr.error('Pilih data dulu')
                    //         }
                    //     })
                } else {
                    if (norec_apd != null) {
                        var arrStr = {
                            0: $scope.dataSelected.nocm,
                            1: $scope.dataSelected.namapasien,
                            2: $scope.dataSelected.jeniskelamin,
                            3: $scope.item.noregistrasi,
                            4: $scope.item.umur,
                            5: $scope.item.kelompokPasien,
                            6: $scope.item.tglRegistrasi,
                            7: norec_apd,
                            8: norec_pd,
                            9: $scope.item.kelas.id,
                            10: $scope.item.kelas.namakelas,
                            11: namaRuanganFk,
                            12: namaRuangan
                        }
                        cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);

                        $state.go('HasilLaboratorium', {
                            norecPd: norec_pd,
                            noOrder: $scope.noOrder,
                            norecApd: norec_apd
                        })
                    } else {
                        toastr.info('Hasil Lab belum ada')
                    }
                }

            }
            $scope.cetakBuktiLayanan = function () {
                if ($scope.item.noregistrasi != undefined && norec_apd != null) {
                    //cetakan langsung service VB6 by grh
                    var stt = 'false'
                    if (confirm('View Bukti Layanan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();

                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec='
                        + $scope.item.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id +
                        '&strIdRuangan=ORDERRADIOLOGI' + norec_apd + '&view=' + stt, function (response) {
                            // do something with response
                        });

                }
            }
            $scope.CetakBuktiLayananPerTindakan = function () {
                var daftarCetak = [];
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                    }
                }

                var pegawai = medifirstService.getPegawaiLogin();
                var resultCetak = daftarCetak.map(a => a).join("|");                
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + pegawai.id + '&strIdRuangan=-&view=true', function (response) {

                    });
            }



            //***********************************

        }
    ]);
});

