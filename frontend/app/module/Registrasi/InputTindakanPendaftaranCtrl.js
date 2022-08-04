define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('InputTindakanPendaftaranCtrl', ['$scope', '$parse', '$state', 'ModelItem', 'MedifirstService',
        function ($scope, $parse, $state, ModelItem, medifirstService) {
            $scope.now = new Date();
            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.norecAPD;
            $scope.item = {};
            $scope.model = {};
            $scope.dataModelGrid = [];
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm",    //set drop down time format to 24 hours
            };
            $scope.model.hargaTindakan = "";
            var norec_pd = ''
            // $scope.item.tglPelayanan = $scope.now;
            $scope.isSelesaiPeriksa = false
            loadPertama();
            $scope.listCito = [
                { "id": 1, "nama": "Status Cito", "detail": [{ "id": 1, "nama": "Tidak" }, { "id": 2, "nama": "Ya" }] }
            ]

            $scope.getSkor = function (data, stat) {
                $scope.item.JasaCito = 0;
                if ($scope.item.Cito != undefined) {
                    if ($scope.item.Cito == "1") {
                        $scope.item.StatusCito = parseFloat($scope.item.Cito)
                    } else if ($scope.item.Cito == "2") {
                        $scope.item.StatusCito = parseFloat($scope.item.Cito)
                        $scope.item.JasaCito = parseFloat($scope.item.hargaTindakan) * $scope.item.nilaiStatusCito
                    }
                }
            }

            function loadPertama() {
                $scope.model.tglPelayanan = $scope.now;

                $scope.isRouteLoading = true;

                var jensiPelayananId = "";
                if ($scope.item.pasien != undefined) {
                    jensiPelayananId = "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk;
                }
                medifirstService.get("registrasi/get-pasien-bynorec/"
                    + $scope.currentNorecPD
                    + "/"
                    + $scope.currentNorecAPD)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data[0];
                        $scope.item.pasien.tglregistrasi = moment(new Date($scope.item.pasien.tglregistrasi)).format('YYYY-MM-DD HH:mm')
                        $scope.item.pasien.tgllahir = moment(new Date($scope.item.pasien.tgllahir)).format('YYYY-MM-DD')
                        norec_pd = $scope.item.pasien.norec_pd
                        $scope.item.idRuangan = $scope.item.pasien.objectruanganfk
                        $scope.item.idKelas = $scope.item.pasien.objectkelasfk
                        $scope.item.jenispelayanan = $scope.item.pasien.objectjenispelayananfk
                        //  ** cek status closing
                        medifirstService.get("registrasi/get-status-close/" + $scope.item.pasien.noregistrasi, false).then(function (rese) {
                            if (rese.data.status == true) {
                                toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                                $scope.isSelesaiPeriksa = true
                            }
                        })
                        //** */            
                        // medifirstService.get('registrasi/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                            medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-tindakan?idRuangan="
                                + $scope.item.idRuangan
                                + "&idKelas="
                                + $scope.item.idKelas
                                + "&idJenisPelayanan="
                                + $scope.item.jenispelayanan, true, 10, 10)
                                .then(function (x) {
                                    $scope.listProduk = x;
                                    $scope.isRouteLoading = false;
                                })
                        // })


                    });

                $scope.getHargaTindakan = function () {
              
                    getKomponenHarga();
                    // getJasaMedis();
                }

                function getJasaMedis() {
                    if ($scope.model.namaProduk != undefined) {
                        // medifirstService.get('tatarekening/tindakan/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                            medifirstService.get("tatarekening/tindakan/get-komponenharga-jasa-medis?idRuangan="
                                + $scope.item.idRuangan
                                + "&idKelas=" + $scope.item.idKelas
                                + "&idProduk=" + $scope.model.namaProduk.id
                                + "&idJenisPelayanan=" + $scope.item.jenispelayanan)
                                .then(function (dat) {
                                    if (dat.data.data.length > 0) {
                                        var datas = dat.data.data[0];
                                        $scope.item.komponenDis = datas.hargasatuan
                                        $scope.item.persenDiscount = 0
                                        $scope.item.diskonKomponen = 0
                                    }

                                })
                        // })
                    }
                }

                function getKomponenHarga() {
                    $scope.model.hargaTindakan = 0;// $scope.item.namaProduk.hargasatuan;
                    $scope.model.jumlah = 0;//1;
                    $scope.listKomponen ==[]
                    if ($scope.model.namaProduk != undefined) {
                        // medifirstService.get('tatarekening/tindakan/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                            medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan="
                                + $scope.item.idRuangan
                                + "&idKelas=" + $scope.item.idKelas
                                + "&idProduk=" + $scope.model.namaProduk.id
                                + "&idJenisPelayanan=" + $scope.item.jenispelayanan
                            )
                                .then(function (dat) {
                                    $scope.listKomponen = dat.data.data;

                                    $scope.model.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                                    $scope.model.jumlah = 1;

                                })
                        // })
                    }
                }

                $scope.formatRupiah = function (value, currency) {
                    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
                refreshDetilTagihan();
            }
            
            medifirstService.get("registrasi/tindakan/get-combo")
                .then(function (da) {
                    $scope.listJenisPelaksana = da.data.jenispelaksana;
                    $scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
                })

            //input tindakan di pendaftaran pasien
            var pegawai = JSON.parse(window.localStorage.getItem('pegawai'));

            $scope.listYaTidak = [
                {
                    "id": 1, "name": "Ya"
                },
                {
                    "id": 0, "name": "Tidak"
                }]
            $scope.hapusTransaksi = function (id) {
                var raw = $scope.dataTindakan.data();
                var length = raw.length;
                var item, i;
                for (i = length - 1; i >= 0; i--) {
                    item = raw[i];
                    if (item.no.toString() === id.toString()) {
                        raw.remove(item);
                        //TODO call remote service to delete item....
                    }
                }
                // var data = $scope.dataSelectedRow;
                // $scope.dataTindakan.remove(data);
            };
            $scope.hapusAll = function () {
                // debugger;
                $scope.dataTindakan = new kendo.data.DataSource({
                    data: []
                })
                $scope.item.StatusCito = undefined;
                $scope.item.JasaCito = 0;
                $scope.item.NilaiCito = 0;
            };

            $scope.dataSelectedRow = {};
            $scope.dataTindakan = new kendo.data.DataSource({
                data: []
            });
            $scope.columnDataTindakan = [{
                "field": "noRec",
                "title": "",
                "hidden": true
            }, {
                "field": "ruangan",
                "title": "",
                "hidden": true
            }, {
                "field": "pasienDaftar",
                "title": "",
                "hidden": true
            }, {
                "field": "no",
                "title": "<h3 align=center>No</h3>",
                "width": "80px"
            }, {
                "field": "tglPelayanan",
                "title": "<h3 align=center>Tanggal</h3>",
                "width": "100px"
            },
            {
                "field": "produk",
                "title": "<h3 align=center>Tindakan</h3>",
                "width": "400px",
                "template": '#= produk.namaProduk #'
            },
            {
                "field": "hargaNetto",
                "title": "<h3 align=center>Harga Netto</h3>",
                "width": "100px",
                "attributes": { align: "center" }
            },
            {
                "field": "qty",
                "title": "<h3 align=center>Jumlah</h3>",
                "width": "70px",
                "attributes": { align: "center" }
            }, {
                title: "<h5 align=center>Action</h5>",
                width: "70px",
                template: "<button class='btnTemplate1' style='width:50%' ng-click='hapusTransaksi(#=no#)'>Hapus</button>"
            }, {
                "field": "pelayananPasienPetugasSet",
                "title": "",
                "hidden": true
            }];
            $scope.opsiGridTindakan = {
                columns: $scope.columnDataTindakan,
                pageable: true,
                selectable: "row",
                pageSizes: true
            };
            var id = 0;


            $scope.tambahTindakan = function () {
                if ($scope.isSelesaiPeriksa == true) {
                    messageContainer.error("Data sudah di closing, tidak bisa input tindakan ")
                    return
                }
                if (  $scope.model.jumlah  == 0) {
                    messageContainer.error("Jumlah tidak boleh Nol")
                    return
                }
                var listRawRequired = [
                    "model.namaProduk|k-ng-model|Tindakan",
                    "model.jumlah|k-ng-model|Jumlah",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    // var tglPelayanan = dateHelper.getTanggalFormattedNew(new Date());
                    var grid = $('#grid').data("kendoGrid");
                    id += 1;
                    $scope.dataModelGrid[id] = {};

                    grid.dataSource.add({
                        "no": id,
                        "noRec": $scope.currentNorecPD,
                        "tglPelayanan": $scope.model.tglPelayanan,
                        "ruangan": $scope.item.pasien.namaruangan,
                        "produk": {
                            "id": $scope.model.namaProduk.id,
                            "namaProduk": $scope.model.namaProduk.namaproduk
                        },
                        "hargaNetto": $scope.model.hargaTindakan,
                        "qty": $scope.model.jumlah,
                        "kelas": $scope.item.pasien.namakelas,
                        "pasienDaftar": {
                            "noRec": $scope.currentNorecAPD
                        },
                        "pelayananPasienPetugasSet": [{
                            "objectJenisPetugasPe": {
                                "id": 2
                            },
                            "mapPelayananPasienPetugasToPegawaiSet": [{
                                "id": pegawai.id,
                                "namaLengkap": pegawai.namaLengkap,
                                "jenisPegawai": pegawai.jenisPegawai.id
                            }]
                        }],
                        "listKomponen": $scope.listKomponen
                    });
                    $scope.SaveTindakan();
                    // $scope.model.namaProduk = "";
                    // $scope.model.hargaTindakan = "";
                    // $scope.model.jumlah = "";
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };

            $scope.SaveTindakan = function () {
                var statuscito = 0;
                var nilaicito = 0;
                var nilaijasaCito = 0;
                if ($scope.item.Cito == "2") {
                    statuscito = 1;
                    $scope.item.JasaCito = parseFloat($scope.model.hargaTindakan) * $scope.item.nilaiStatusCito;
                    nilaicito = $scope.item.JasaCito;
                    nilaijasaCito = $scope.item.nilaiStatusCito;
                }


                var dataTindakanFix = [];
                if ($scope.listKomponen.length <= 0) {
                    window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
                    return
                }
                else {
                    if ($scope.model.namaProduk.namaproduk.indexOf('Konsul') >= 0)
                    // || $scope.model.namaProduk.namaproduk.indexOf('Karcis') >= 0)
                    {
                        var data = {
                            "noregistrasifk": $scope.currentNorecAPD,
                            "tglregistrasi": $scope.item.pasien.tglregistrasi,
                            "tglpelayanan": new moment($scope.model.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                            "ruangan": $scope.item.pasien.namaruangan,
                            "produkfk": $scope.model.namaProduk.id,
                            "hargasatuan": $scope.model.hargaTindakan,
                            "hargajual": $scope.model.hargaTindakan,
                            "harganetto": $scope.model.hargaTindakan,
                            "jumlah": $scope.model.jumlah,
                            "kelasfk": $scope.item.pasien.objectkelasfk,
                            "pelayananpetugas": [{
                                "objectjenispetugaspefk": 4,
                                "listpegawai": [{
                                    "objectjenispetugaspefk": 4,
                                    "id": $scope.item.pasien.objectpegawaifk
                                }]
                            }],
                            "komponenharga": $scope.listKomponen,
                            "iscito": statuscito,
                            "jasacito": nilaicito,
                            "nilaicito": nilaijasaCito,
                            "diskon": 0
                        }
                    }
                    else {
                        var data = {
                            "noregistrasifk": $scope.currentNorecAPD,
                            "tglregistrasi": $scope.item.pasien.tglregistrasi,
                            "tglpelayanan": new moment($scope.model.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                            "ruangan": $scope.item.pasien.namaruangan,
                            "produkfk": $scope.model.namaProduk.id,
                            "hargasatuan": $scope.model.hargaTindakan,
                            "hargajual": $scope.model.hargaTindakan,
                            "harganetto": $scope.model.hargaTindakan,
                            "jumlah": $scope.model.jumlah,
                            "kelasfk": $scope.item.pasien.objectkelasfk,
                            "pelayananpetugas": [{
                                "objectjenispetugaspefk": 4,
                                "listpegawai": []
                            }],
                            "komponenharga": $scope.listKomponen,
                            "iscito": statuscito,
                            "jasa": nilaicito,
                            "nilaicito": nilaijasaCito,
                            "diskon": 0
                        }
                    }

                    dataTindakanFix.push(data);
                    var objSave = {
                        pelayananpasien: dataTindakanFix
                    }
                    medifirstService.post('tatarekening/tindakan/save-tindakan',objSave).then(function (e) {
                        // $scope.showTindakan = false;
                        medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan',objSave).then(function (data) {
                        })
                        $scope.dataTindakan = new kendo.data.DataSource({
                            data: [],
                            pageSize: 5
                        });
                        $scope.model.namaProduk = "";
                        $scope.model.hargaTindakan = "";
                        $scope.model.jumlah = "";
                        $scope.item.Cito = undefined;
                        refreshDetilTagihan();

                    })
                }
            }

            $scope.Cancel = function () {
                window.history.back();
            }

            // controller untk data detil tagihan
            $scope.group = [
                {
                    field: "tglPelayanan",
                    groupHeaderTemplate: "Tanggal.  #= value #",
                    aggregates: [{
                        field: "namaProduk",
                        aggregate: "count"
                    }, {
                        field: "detailJenisProduk",
                        aggregate: "count"
                    }]
                }, {
                    field: "namaRuangan",
                    aggregates: [{
                        field: "tglPelayanan",
                        aggregate: "count"
                    }, {
                        field: "namaProduk",
                        aggregate: "count"
                    }, {
                        field: "namaRuangan",
                        aggregate: "count"
                    }]
                }, {
                    field: "detailJenisProduk",
                    groupHeaderTemplate: "Bagian #= value #",
                    aggregates: [{
                        field: "namaProduk",
                        aggregate: "count"
                    }, {
                        field: "detailJenisProduk",
                        aggregate: "count"
                    }]
                }
            ];

            $scope.gridOptions = {
                // dataSource: {
                //     data: data,
                //     group: $scope.group
                // },
                selectable: "row",
                sortable: true,
                columns: [
                    {
                        "field": "tglPelayanan",
                        "title": "Tgl Pelayanan",
                        width: 150
                    },
                    {
                        "field": "namaProduk",
                        "title": "Nama Pelayanan",
                    }, {
                        "field": "jumlah",
                        "title": "Jumlah",
                        width: 100
                    }, {
                        "field": "hargaSatuan",
                        "title": "Harga",
                        width: 180,
                        template: "<span style='text-align:right;display:block'>#=kendo.toString(hargaSatuan, 'n2')#</span>",

                    }, {
                        "field": "jumlah * hargaSatuan",
                        "title": "Total",
                        width: 180,
                        template: " <span style='text-align:right;display:block'> #=kendo.toString(jumlah*hargaSatuan, 'n2')# </span>  ",
                    }, {
                        hidden: true,
                        field: "namaRuangan",
                        title: "Nama Ruangan",
                        aggregates: ["count"],
                        groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                    },
                    {
                        hidden: true,
                        field: "detailJenisProduk",
                        title: "",
                        aggregates: ["count"],
                        groupHeaderTemplate: " #= value # Jumlah: #= count# "
                    },
                    {
                        command: {
                            text: "Hapus",
                            width: "50px",
                            align: "center",
                            attributes: { align: "center" },
                            click: removeRowTindakan
                        },
                        title: "",
                        width: "80px"
                    }]
            };
            function removeRowTindakan(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.tempDataTindakan = $scope.dataTindakan
                    .filter(function (el) {
                        return el.name !== grid[0].name;
                    });

                if (dataItem.noRecStruk != null) {
                    toastr.error('Data sudah diclosing, hubungi Tatarekening', 'Error')
                    return
                }
                var itemDelete = {
                    // "noRec": dataItem.noRec,
                    "norec_pp": dataItem.noRec,
                    // "noRecStruk": null
                }
                var tempData = [];
                tempData.push(itemDelete);
                //  managePasien.removekan(tempData).then(function(e){
                //     if(e.status === 201){
                //          refreshDetilTagihan();
                //             grid.removeRow(row);
                //     }
                // })
                var objDelete = {
                    "dataDel": tempData,
                };
                medifirstService.post('tatarekening/tindakan/hapus-pelayanan-pasien', objDelete).then(function (e) {
                    if (e.status === 201) {
                        refreshDetilTagihan();
                        grid.removeRow(row);
                    }
                })

            }

            function refreshDetilTagihan() {
                $scope.isRouteLoading = true
                medifirstService.get('registrasi/get-pelayanan-pasien?norec_pd=' + $scope.currentNorecPD)
                    .then(function (e) {
                        // findPasien.findDetailPelayanan( $scope.currentNorecPD).then(function(e) {
                        $scope.listData = e.data.data;
                        var data = e.data.data;
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                var element = data[key];
                                element.tglPelayanan = moment(element.tglPelayanan).format('DD-MMM-YYYY HH:mm');
                            }
                        }


                        $scope.total = _.reduce(data, function (memo, num) {
                            if (num.nilaiNormal === 0)
                                return memo + (num.jumlah * num.hargaSatuan * -1);
                            return memo + (num.jumlah * num.hargaSatuan);
                        }, 0);
                        $scope.isRouteLoading = false
                    });
            }
            $scope.Kembali = function(){
                window.history.back()
            }
            // ////////////////////////////////////////
        }
    ]);
});