define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterProdukApotikCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.disload = false
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var idpegawai;
            var dataobatgen = []
            // update obat gen penambal dataobatgen undefined
            $scope.obatGen = dataobatgen
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');


            function loadCombo() {
                // medifirstService.getPart("sysadmin/master/get-combo-masterapotik", true, true, 20).then(function (data) {
                //     $scope.listDetailJenisProduk = data
                // });

                medifirstService.getPart("sysadmin/master/get-data-combo-rekanan", true, true, 20).then(function (data) {
                    $scope.listrekanan = data;
                });

                medifirstService.get("sysadmin/master/get-jenis-produk", true).then(function (dat) {
                    $scope.listJenisProduk = dat.data;
                    for (let i = 0; i < $scope.listJenisProduk.length; i++) {
                        const element = $scope.listJenisProduk[i];
                        if (element.id == 97) {
                            $scope.item.jenisProduk = element
                            break;
                        }
                    }
                })

                medifirstService.get("sysadmin/master/get-data-combo-master-rev?kelompokProdukfk=&objectjenisprodukfk=97", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listsatuanStandar = dataCombo.satuan.standar
                    $scope.listdetailjenis = dataCombo.kategori.detailjenis
                    $scope.listgenerik = dataCombo.kategori.generik
                    $scope.listsatuankekuatan = dataCombo.rm_sediaan
                    $scope.listmerkProduk = dataCombo.spesifikasi.merkproduk
                    $scope.liststatusProduk = dataCombo.statusproduk
                    $scope.listprodusenProduk = dataCombo.produsenproduk
                    $scope.listKFTemplate = dataCombo.ihs_kode_kf_a
                    $scope.listKFBrand = dataCombo.ihs_kode_kf_a_brand
                    $scope.listKFKemasan = dataCombo.ihs_kode_kf_a_kemasan
                    $scope.listBPOMSediaan = dataCombo.ihs_sediaan
                    $scope.listZatAktif = dataCombo.ihs_bahanzat
                    $scope.listDenom = dataCombo.ihs_denom_satuan
                    $scope.listNum = dataCombo.ihs_numerator_satuan
                });
            }

            $scope.getKFTemplate = async function () {
              let kf = $("#findKFa")[0].value
              $scope.disload = true
              let json = {
                "url": `products/all?page=1&size=50&product_type=farmasi&keyword=${encodeURI(kf)}`,
                "method": "GET",
                "data": null,
                "jenis": "kfa"
              }

              await medifirstService.post('bridging/ihs/tools', json).then(function (e) {
                $scope.listKFTemplateBridging = e.data.items.data
                $scope.disload = false
              });
            }

            $scope.setKFTemplate = function() {
              $scope.item.ihs_kfa_code = $scope.item.ihs_kfa.kfa_code
              $scope.item.ihs_kfa_code_brand = $scope.item.ihs_kfa.product_template?.kfa_code
              $scope.item.ihs_sediaan = $scope.item.ihs_kfa.dosage_form?.code
              $scope.item.ihs_kfa_code_kemasan = $scope.item.ihs_kfa.active_ingredients[0]?.kfa_code
            }

            $scope.getdataProduk = function () {
                // medifirstService.getPart("sysadmin/master/get-combo-barang-apotik/"+$scope.item.detailjenisproduk.id, true, true, 20).then(function (data) {
                //     $scope.listNamaBarang = data;
                // });
            }

            $scope.listverifikasiAnggaran = [
                { "id": 1, "namaExternal": "t", "namaAlias": "True" },
                { "id": 2, "namaExternal": "f", "namaAlias": "False" }
            ];

            $scope.listgenerikpaten = [
                { "id": 1, "name": "Generik" },
                { "id": 0, "name": "Paten" }
            ];

            $scope.listStatus = [
                { id: '1', status: 'Aktif' },
                { id: '2', status: 'Tidak aktif' },
            ]

            $scope.listStatusEnabled = [
                { "id": 1, "status": "Aktif" },
                { "id": 0, "status": "Tidak aktif" }
            ];

            $scope.item.status = $scope.listStatus[0]
            $scope.item.satuanEnabled = $scope.listStatusEnabled[0]

            loadData();
            loadCombo();
            $scope.cariFilter = function () {
                loadData();
            }

            $scope.JenisToDetail = function (e) {
                if (!e) return;

                var jenis = e.id
                medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + jenis, true).then(function (dat) {
                    $scope.listdetailjenis = dat.data;
                })
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var isLoinc = false
                if ($scope.item.isLoinc != undefined && $scope.item.isLoinc == true) {
                    isLoinc = "&isLoinc=" + $scope.item.isLoinc
                    delete $scope.item.jenisProduk
                }
                var jenisfk = ""
                if ($scope.item.jenisProduk != undefined) {
                    jenisfk = "&jenisfk=" + $scope.item.jenisProduk.id
                }
                var detailfk = ""
                if ($scope.item.detailjenisproduk != undefined) {
                    detailfk = "&detailfk=" + $scope.item.detailjenisproduk.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    produkfk = "&namaproduk=" + $scope.item.namaBarang
                }
                var statusfk = ""
                if ($scope.item.status != undefined) {
                    statusfk = "&statusfk=" + $scope.item.status.id
                }

                var kodeKF = ""
                if ($scope.item.kodeKF != undefined) {
                    kodeKF = "&kodeKF=" + $scope.item.kodeKF
                }


                medifirstService.get('sysadmin/master/get-data-produkapotik?q=q' + jenisfk + detailfk + produkfk + statusfk + kodeKF + isLoinc).then(function (e) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].no = i + 1
                        if (e.data[i].isgeneric != null) {
                            if (e.data[i].isgeneric) {
                                e.data[i].isgeneric = "GENERIK";
                            } else {
                                e.data[i].isgeneric = "PATEN";
                            }
                        }
                    }
                    var data2 = e.data;
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        group: [

                        ],
                        pageSize: 10,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        }
                    });
                });
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarProdukApotik.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Produk Apotik",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "template": "<span class='style-center'>#: no #</span>",
                        "width": "5%"
                    },
                    {
                        "field": "kdproduk",
                        "title": "Kode Produk",
                        "template": "<span class='style-center'>#: kdproduk #</span>",
                        "width": "8%"
                    },
                    // {
                    //     "field": "jenisproduk",
                    //     "title": "Jenis Produk",
                    //     "width": "15%"
                    // },
                    {
                        "field": "detailjenisproduk",
                        "title": "Detail Jenis Produk",
                        "width": "15%"
                    },
                    {
                        "field": "isgeneric",
                        "title": "Generik/Paten",
                        "width": "10%"
                    },
                    {
                        "field": "generik",
                        "title": "Nama Generik",
                        "width": "15%"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "25%"
                    },
                    {
                        "field": "kekuatan",
                        "title": "Kekuatan",
                        "width": "5%"
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan Kekuatan",
                        "width": "5%"
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan Peresepan",
                        "width": "7%"
                    },
                    {
                        "field": "ihs_kfa_code",
                        "title": "KF+a",
                        "width": "5%"
                    },
                    {
                        "field": "ihs_loinc_id",
                        "title": "Loinc Kode",
                        "width": "5%"
                    },
                    {
                        "field": "ihs_loinc_common_name",
                        "title": "Nama Loinc",
                        "width": "15%"
                    },
                    {
                        "field": "statusenabled",
                        "title": "Status",
                        "width": "5%",
                        "template": "# if(statusenabled) { # <span class='style-center'>Aktif</span> # } else { # <span class='style-center'>Tidak aktif</span> # } #",
                    },
                    {
                        "field": "iskonsinyasi",
                        "title": "Konsinyasi",
                        "width": "5%",
                        "template": "# if(iskonsinyasi == null || iskonsinyasi == false) { # <span class='style-center'>✘</span> # } else { # <span class='style-center'>✔</span> # } #",
                    },
                    {
                        "field": "ihs_id",
                        "title": "SATUSEHAT",
                        "width": "5%",
                        "template": "# if(ihs_id == null) { # <span class='style-center'>✘</span> # } else { # <span class='style-center'>✔</span> # } #",
                    }
                ]
            }

            $scope.klikgrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }

            $scope.KelBPJS = function () {
                $state.go('KelompokProdukBPJS')
            }

            $scope.TambahMasterApotik = function () {
                kosongkan()
                $scope.popUps.center().open();
            }

            $scope.UbahMasterApotik = async function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Pilih Produk Terlebih dahulu!")
                    return
                }
                $scope.isRouteLoading = true;
                dataobatgen = []
                var jenisProduk = $scope.item.jenisProduk
                $scope.item = {
                    status: $scope.listStatus[0],
                    satuanEnabled: $scope.listStatusEnabled[0],
                    jenisProduk: jenisProduk
                };
                await medifirstService.get("sysadmin/master/get-produkbyid?idProduk=" + $scope.dataSelected.id, true).then(function (e) {
                    $scope.isRouteLoading = false;
                    let json = {
                      "url": `products/all?page=1&size=100&product_type=farmasi&keyword=`,
                      "method": "GET",
                      "data": null,
                      "jenis": "kfa"
                    }
    
                    medifirstService.post('bridging/ihs/tools', json).then(function (e) {
                      $scope.listKFTemplateBridging = e.data.items.data
                    });

                    var data = e.data;
                    $scope.item.id = data[0].id;
                    $scope.item.kdproduk = data[0].kdproduk
                    $scope.item.produk = data[0].namaproduk
                    $scope.item.deskripsi = data[0].deskripsiproduk
                    $scope.item.keterangan = data[0].keterangan
                    $scope.item.satuanStandar = { id: data[0].objectsatuanstandarfk, satuanstandar: data[0].satuanstandar }
                    $scope.item.detailJenisProduk = { id: data[0].objectdetailjenisprodukfk, detailjenisproduk: data[0].detailjenisproduk }
                    if (data[0].isgeneric) {
                        $scope.item.generik = $scope.listgenerikpaten[0]
                    } else {
                        $scope.item.generik = $scope.listgenerikpaten[1]
                    }
                    $scope.item.gProduk = { id: data[0].objectgenerikfk, name: data[0].rm_generikname }
                    $scope.item.kekuatan = data[0].kekuatan
                    $scope.item.satuanKekuatan = { id: data[0].objectsediaanfk, name: data[0].rm_sediaan }
                    $scope.item.merkProduk = { id: data[0].objectmerkprodukfk, merkproduk: data[0].merkproduk }
                    $scope.item.statusProduk = { id: data[0].objectstatusprodukfk, statusproduk: "" }
                    $scope.item.IsARVDonasi = { id: data[0].isarvdonasi, namaExternal: "" }
                    $scope.item.IsNarkotika = { id: data[0].isnarkotika, namaExternal: "" }
                    $scope.item.IsPsikotropika = { id: data[0].ispsikotropika, namaExternal: "" }
                    $scope.item.IsOnkologi = { id: data[0].isonkologi, namaExternal: "" }
                    $scope.item.Oot = { id: data[0].isoot, namaExternal: "" }
                    $scope.item.IsPrekusor = { id: data[0].isprekusor, namaExternal: "" };
                    $scope.item.IsVaksinDonasi = { id: data[0].isvaksindonasi, namaExternal: "" };
                    $scope.item.produsenProduk = { id: data[0].objectprodusenprodukfk, namaprodusenproduk: "" };
                    $scope.item.rekanan = { id: data[0].objectrekananfk, namarekanan: "" };

                    $scope.item.ihs_kfa_code = data[0].ihs_kfa_code
                    $scope.item.ihs_kfa_code_brand = data[0].ihs_kfa_code_brand
                    $scope.item.ihs_kfa_code_kemasan = data[0].ihs_kfa_code_kemasan
                    $scope.item.ihs_sediaan = data[0].ihs_sediaan
                    
                    for (var i = data[0].ingredients.length - 1; i >= 0; i--) {
                      let dataObat = {
                        komposisizatfk: data[0].ingredients[i]?.ihs_bahanzat,
                        komposisizat: data[0].ingredients[i]?.nama_ihs_bahanzat,
                        numeratorvalue: data[0].ingredients[i]?.qtynum,
                        numeratorfk: data[0].ingredients[i]?.numerartorsatuanfk,
                        denominatorvalue: data[0].ingredients[i]?.qtydenom,
                        denominatorfk: data[0].ingredients[i]?.denomsatuanfk,
                        numerator: data[0].ingredients[i]?.nama_numerator_satuan,
                        denominator: data[0].ingredients[i]?.nama_denom_satuan,
                      }
                      dataobatgen.push(dataObat)
                    }

                    $scope.item.ihs_loinc_id = data[0].ihs_loinc_id
                    $scope.item.ihs_loinc_common_name = data[0].ihs_loinc_common_name
                    $scope.listGridObat = new kendo.data.DataSource({
                        data: dataobatgen
                    });
                    $scope.popUps.center().open();
                })
            }

            $scope.save = function () {
                if ($scope.item.produk == undefined) {
                    toastr.error("Nama Produk Kosong!")
                    return
                }

                if ($scope.item.satuanStandar == undefined) {
                    toastr.error("Satuan Standar Kosong!")
                    return
                }

                if ($scope.item.detailJenisProduk == undefined) {
                    toastr.error("Detail Jenis Produk Kosong!")
                    return
                }

                if ($scope.obatGen == undefined) {
                    toastr.error("Ingredient Produk kosong !")
                    return
                }

                var objSave = {
                    "id": $scope.item.id == undefined ? null : $scope.item.id,
                    "namaproduk": $scope.item.produk,
                    "deskripsiproduk": $scope.item.deskripsi == undefined ? null : $scope.item.deskripsi,
                    "keterangan": $scope.item.keterangan == undefined ? null : $scope.item.keterangan,
                    "objectsatuanstandarfk": $scope.item.satuanStandar.id,
                    "objectdetailjenisprodukfk": $scope.item.detailJenisProduk.id,
                    "isgeneric": $scope.item.generik == undefined ? null : $scope.item.generik.id,
                    "objectgenerikfk": $scope.item.gProduk == undefined ? null : $scope.item.gProduk.id,
                    "kekuatan": $scope.item.kekuatan == undefined ? null : $scope.item.kekuatan,
                    "objectsediaanfk": $scope.item.satuanKekuatan == undefined ? null : $scope.item.satuanKekuatan.id,
                    "objectmerkprodukfk": $scope.item.merkProduk == undefined ? null : $scope.item.merkProduk.id,
                    "objectstatusprodukfk": $scope.item.statusProduk == undefined ? null : $scope.item.statusProduk.id,
                    "isarvdonasi": $scope.item.IsARVDonasi == undefined ? null : $scope.item.IsARVDonasi.id,
                    "isnarkotika": $scope.item.IsNarkotika == undefined ? null : $scope.item.IsNarkotika.id,
                    "ispsikotropika": $scope.item.IsPsikotropika == undefined ? null : $scope.item.IsPsikotropika.id,
                    "isonkologi": $scope.item.IsOnkologi == undefined ? null : $scope.item.IsOnkologi.id,
                    "isoot": $scope.item.Oot == undefined ? null : $scope.item.Oot.id,
                    "isprekusor": $scope.item.IsPrekusor == undefined ? null : $scope.item.IsPrekusor.id,
                    "isvaksindonasi": $scope.item.IsVaksinDonasi == undefined ? null : $scope.item.IsVaksinDonasi.id,
                    "objectprodusenprodukfk": $scope.item.produsenProduk == undefined ? null : $scope.item.produsenProduk.id,
                    "objectrekananfk": $scope.item.rekanan == undefined ? null : $scope.item.rekanan.id,
                    "statusenabled": $scope.item.satuanEnabled == undefined ? 0 : $scope.item.satuanEnabled.id,
                    "kdproduk": $scope.item.kdproduk == undefined ? null : $scope.item.kdproduk,
                    "ihs_kfa_code": $scope.item.ihs_kfa_code ? $scope.item.ihs_kfa_code : null,
                    "ihs_kfa_code_brand": $scope.item.ihs_kfa_code_brand ? $scope.item.ihs_kfa_code_brand : null,
                    "ihs_kfa_code_kemasan": $scope.item.ihs_kfa_code_kemasan ? $scope.item.ihs_kfa_code_kemasan : null,
                    "ihs_loinc_id": $scope.item.ihs_loinc_id ? $scope.item.ihs_loinc_id : null,
                    "ihs_loinc_common_name": $scope.item.ihs_loinc_common_name ? $scope.item.ihs_loinc_common_name : null,
                    "ihs_sediaan": $scope.item.ihs_sediaan ? $scope.item.ihs_sediaan : null,
                    "ingredients": $scope.obatGen,
                }

                $scope.isRouteLoading = true;

                medifirstService.post('sysadmin/master/save-data-produk-apotik', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    kosongkan()
                    loadData()
                });
            }

            $scope.tutup = function () {
                $scope.popUps.close();
            }

            function kosongkan() {
                $scope.selectedTab = 0
                $scope.item.id = undefined
                $scope.item.produk = undefined
                $scope.item.deskripsi = undefined
                $scope.item.keterangan = undefined
                $scope.item.satuanStandar = undefined
                $scope.item.detailJenisProduk = undefined
                $scope.item.generik = undefined
                $scope.item.gProduk = undefined
                $scope.item.kekuatan = undefined
                $scope.item.satuanKekuatan = undefined
                $scope.item.merkProduk = undefined
                $scope.item.statusProduk = undefined
                $scope.item.IsARVDonasi = undefined
                $scope.item.IsNarkotika = undefined
                $scope.item.IsPsikotropika = undefined
                $scope.item.IsOnkologi = undefined
                $scope.item.Oot = undefined
                $scope.item.IsPrekusor = undefined
                $scope.item.IsVaksinDonasi = undefined
                $scope.item.produsenProduk = undefined
                $scope.item.rekanan = undefined
                $scope.item.kdproduk = undefined
                $scope.item.ihs_kfa_code = undefined
                $scope.item.ihs_kfa_code_brand = undefined
                $scope.item.ihs_kfa_code_kemasan = undefined
                $scope.item.ihs_loinc_id = undefined
                $scope.item.ihs_loinc_common_name = undefined
                $scope.item.ihs_sediaan = undefined
                dataobatgen = []
                $scope.listGridObat = new kendo.data.DataSource({
                    data: dataobatgen
                });
            }
            $scope.obat = {
                isactive: true
            };
            $scope.addObat = function () {
                $scope.obat = {
                    isactive: true
                };
                $scope.listObat = null;
                $scope.popUpObat.center().open();
            }

            $scope.gridObat = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="addObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],
                columns: [
                    {
                        "field": "komposisizat",
                        "title": "Komposisi Bahan Zat",
                    },
                    {
                        "field": "isactive",
                        "title": "Zat Aktif",
                    },
                    {
                        "field": "numeratorvalue",
                        "title": "Numerator Qty",
                    },
                    {
                        "field": "numerator",
                        "title": "Numerator Satuan",
                    },
                    {
                        "field": "denominatorvalue",
                        "title": "Denominator Qty",
                    },
                    {
                        "field": "denominator",
                        "title": "Denominator Satuan",
                    },

                    {
                        command: {
                            text: "Hapus",
                            align: "center",
                            attributes: { align: "center" },
                            click: removeData
                        },
                        title: "#",
                    }
                ]
            };
            function removeData(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                grid.removeRow(row);

                if (dataItem != undefined) {
                    for (var i = dataobatgen.length - 1; i >= 0; i--) {
                        if (dataobatgen[i].komposisizat == dataItem.komposisizat) {
                            dataobatgen.splice(i, 1);
                            $scope.listGridObat = new kendo.data.DataSource({
                                data: dataobatgen
                            });
                        }
                    }
                }
            }

            $scope.tutupObat = function () {
                $scope.obat = {
                    isactive: true
                };
                $scope.listObat = null;
                $scope.popUpObat.close();
            }
            $scope.saveObat = function () {
                if ($scope.obat.zataktif == undefined) {
                    messageContainer.error("Komposisi Obat Harus Di isi")
                    return
                }

                if ($scope.obat.numeratorvalue == undefined) {
                    messageContainer.error("numerator Qty Harus Di isi")
                    return
                }
                if ($scope.obat.numerator == undefined) {
                    messageContainer.error("numerator Satuan Harus Di isi")
                    return
                }
                if ($scope.obat.denominatorvalue == undefined) {
                    messageContainer.error("Denominator Qty Harus Di isi")
                    return
                }
                if ($scope.obat.denominator == undefined) {
                    messageContainer.error("Denominator Satuan Harus Di isi")
                    return
                }

                var dataObat = {};
                var dataobatgen = [];
                dataObat = {
                    komposisizatfk: $scope.obat.zataktif.id,
                    komposisizat: $scope.obat.zataktif.nama,
                    isactive: $scope.obat.isactive ? $scope.obat.isactive : false,
                    numeratorvalue: $scope.obat.numeratorvalue,
                    numerator: $scope.obat.numerator.nama,
                    numeratorfk: $scope.obat.numerator.id,
                    denominatorvalue: $scope.obat.denominatorvalue,
                    denominator: $scope.obat.denominator.nama,
                    denominatorfk: $scope.obat.denominator.id
                }
                dataobatgen.push(dataObat)
                $scope.obatGen = dataobatgen
                $scope.listGridObat = new kendo.data.DataSource({
                    data: dataobatgen
                });

                $scope.obat = {
                    isactive: true
                };
                $scope.listObat = null;
            }

            $scope.ClearForm = function () {

                dataobatgen = []
                $scope.listGridObat = new kendo.data.DataSource({
                    data: dataobatgen
                });
            }
            $scope.sendIHS = function () {
                // if ($scope.dataSelected.ihs_id != null) {
                //     toastr.error('Data Sudah di kirim ke Satu Sehat')
                //     return
                // }
                let json = {
                    "id": $scope.dataSelected.id
                }
                $scope.isRouteLoading = true
                medifirstService.postNonMessage('bridging/ihs/Medication', json).then(function (z) {
                    $scope.isRouteLoading = false
                    if (z.data.resourceType == 'OperationOutcome') {
                        for (let x = 0; x < z.data.issue.length; x++) {
                            const element = z.data.issue[x];
                            toastr.error(element.diagnostics + ' - ' + element.expression[0])
                        }

                    } else {
                        loadData();
                        toastr.success(z.data.resourceType)
                    }

                })
            }
            $scope.cekTel = function (e) {

                loadData();


            }

            $scope.Konsinyasi = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Pilih Produk Terlebih dahulu!")
                    return
                }

                $scope.isRouteLoading = true;
                var objSave = {
                    idproduk: $scope.dataSelected.id,
                }

                medifirstService.post('sysadmin/master/save-data-produk-konsinyasi', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    loadData();
                });
            }
        }
    ]);
});
