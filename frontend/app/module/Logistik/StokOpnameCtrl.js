define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('StokOpnameCtrl', ['$rootScope', '$scope', '$state', 'ModelItem', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, ModelItem, dateHelper, medifirstService) {
            $scope.DataTakSedia = false;
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.now = new Date();
            $scope.btnTombol = true;
            $scope.isRouteLoading = false;
            $scope.item.passwordSo = undefined;
            $scope.isSelected = false;
            $scope.selectedJenisProduk = [];
            $scope.selectedDetailJenis = [];
            $scope.item.ruangan = '';
            var judul = 'v';
            // $scope.item.ruangan.namaruangan = '';

            $scope.istempatLaporan = true;
            FormLoad();
            // LoadData();

            function FormLoad() {
                $scope.listJenisPemeriksaan = [{ name: "Kelompok Produk", id: 1 }, { name: "Jenis Produk", id: 2 }];
                $scope.selectOptionsDetailJenis = {
                    // placeholder: "Pilih Detail Jenis Produk...",
                    dataTextField: "detailjenisproduk",
                    dataValueField: "id",
                    filter: "contains"
                };
                $scope.selectOptJenisProduk = {
                    // placeholder: "Pilih Jenis Produk...",
                    dataTextField: "jenisproduk",
                    dataValueField: "id",
                    filter: "contains"
                };
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listJenisProduk = dataCombo.jenisproduk
                    $scope.listDetailJenis = dataCombo.detailjenisproduk
                    $scope.listRuangan = dataCombo.ruangan
                    $scope.item.passwordSo = dataCombo.passwordstokopname
                });
            }


            $scope.cari = function () {
                judul = "SO_" + moment($scope.now).format('DD') + '_' + $scope.item.ruangan.id + '_' + $scope.item.ruangan.namaruangan;
                $scope.optionsDataStokOpname = {
                    toolbar: ["excel"],
                    excel: {
                        // fileName: "Data Stok Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
                        fileName: judul,
                        allPages: true,
                    },
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contains",
                                startswith: "Starts with"
                            }
                        }
                    },
                    selectable: 'row',
                    pageable: true,
                    editable: true,
                    columns: [{
                        "field": "kodeProduk",
                        "title": "Kode Barang",
                        "width": 150,
                    },
                    {
                        "field": "namaProduk",
                        "title": "Nama Barang",
                    }, {
                        "field": "qtyProduk",
                        "title": "Sistem",
                        "format": "{0:n2}",
                        "attributes": {
                            "style": "text-align:right"
                        },
                        "width": 100,
                        filterable: false
                    }, {
                        "field": "stokReal",
                        "title": "Real",
                        "format": "{0:n2}",
                        "attributes": {
                            "style": "text-align:right"
                        },
                        "width": 100,
                        filterable: false
                    }, {
                        "field": "selisih",
                        "title": "Selisih",
                        "format": "{0:n2}",
                        "attributes": {
                            "style": "text-align:right"
                        },
                        "width": 100,
                        filterable: false
                    }, {
                        "field": "satuanStandar",
                        "title": "Satuan",
                        width: 150,
                        filterable: false
                    }, {
                        "field": "adjustmen",
                        "title": "KeteranganAdjustmen",
                        width: 150,
                        filterable: false
                    },
                    ]
                };
                $scope.dataStokOpname = new kendo.data.DataSource({
                    data: []
                })
                $scope.isRouteLoading = true;
                var kelBarang, jenBarang, barangId, ruanganId;
                if ($scope.item.kelompokBarang === undefined) {
                    kelBarang = "";
                } else {
                    kelBarang = $scope.item.kelompokBarang.id
                }

                if ($scope.item.jenisProduk === undefined) {
                    jenBarang = "";
                } else {
                    jenBarang = $scope.item.jenisProduk.id
                }

                if ($scope.item.namaproduk === undefined) {
                    barangId = "";
                } else {
                    barangId = $scope.item.namaproduk
                }
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                } else {
                    ruanganId = ""
                }
                var listJenisProd = ""
                if ($scope.selectedJenisProduk.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedJenisProduk.length - 1; i >= 0; i--) {
                        var c = $scope.selectedJenisProduk[i].id
                        b = "," + c
                        a = a + b
                    }
                    listJenisProd = a.slice(1, a.length)
                }
                var listDetailJenis = ""
                if ($scope.selectedDetailJenis.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDetailJenis.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDetailJenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDetailJenis = a.slice(1, a.length)

                }
                $scope.isRouteLoading = false;
                medifirstService.get('logistik/get-stok-ruangan-so?' +
                    'kelompokprodukid=' + kelBarang +
                    '&jeniskprodukid=' + listJenisProd +
                    '&ruanganfk=' + ruanganId +
                    '&namaproduk=' + barangId +
                    "&detailjenisprodukfk=" + listDetailJenis
                ).then(function (data) {
                    // $scope.isReport = true;
                    $scope.isEdit = true;

                    data.data.detail.forEach(function (x) {
                        x.stokReal = x.qtyProduk;
                    })

                    $scope.tempDataSource = data.data.detail
                    $scope.dataStokOpname = new kendo.data.DataSource({
                        data: data.data.detail,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    kodeProduk: { editable: false },
                                    namaProduk: { editable: false, type: "string" },
                                    qtyProduk: { editable: false, type: "number" },
                                    stokReal: { type: "number" },
                                    selisih: { editable: false, type: "number" },
                                    satuanStandar: { editable: false, type: "string" }
                                }
                            }
                        },
                        // pageSize: 20,
                        change: function (e) {
                            console.log("change :" + e.action);
                            if (e.field && e.action === "itemchange") {
                                //debugger;
                                $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                if (e.field == "stokReal") {
                                    $scope.current.adjustmen = "-"

                                }
                                // if ($scope.current.selisih<0)
                                //     $scope.current.selisih = $scope.current.selisih*=-1;
                                $scope.dataStokOpname.fetch();
                            }
                        }
                    });
                })
            }
            $scope.fk = function (current) {
                debugger;
                $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                $scope.current.adjustmen = "-"
                $scope.dataStokOpname.fetch();
            }
            $scope.kl = function (current) {
                $scope.current = current;
                $scope.current.adjustmen = "-"
                console.log(current);
            };


            $scope.$watch('item.kelompokBarang', function (e) {
                if (e === undefined) return;
                if (e.id === undefined) return;
                $rootScope.addData = { content: 'ada data baru ' + e.kelompokProduk };
                $scope.listJenisBarang = ModelItem.kendoHttpSource('product/find-jenis-produk?idKelompokProduk=' + e.id, true);
            })
            $scope.$watch('item.jenisProduk', function (e) {
                if (e === undefined) return;
                if (e.id === undefined) return;
                $scope.listNamaBarang = ModelItem.kendoHttpSource('product/find-produk-by-jenis-produk-and-nama-produk?idDetailJenisProduk=' + e.id, true);
            })
            $scope.listKelompokBarang = ModelItem.kendoHttpSource('/product/kelompok-produk-have-stok', true);

            $scope.BatalStokOpname = function () {
                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();
            }

            $scope.lanjutStokOpname = function () {
                $scope.isRouteLoading = true;
                // debugger
                if ($scope.item.ruangan == undefined) {
                    alert("Pilih ruangan!!")
                    $scope.isRouteLoading = false;
                    return
                }

                // if ($scope.item.kataKunciPass != $scope.item.passwordSo) {
                //     alert('Kata kunci / password salah')
                //     $scope.isRouteLoading = false;
                //     $scope.popUp.close();
                //     return
                // }

                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();
                var dataArray = [];
                for (var i = $scope.dataStokOpname._data.length - 1; i >= 0; i--) {
                    if ($scope.dataStokOpname._data[i].selisih != undefined)
                        dataArray.push({
                            "produkfk": $scope.dataStokOpname._data[i].kodeProduk,
                            "stokSistem": $scope.dataStokOpname._data[i].qtyProduk,
                            "stokReal": $scope.dataStokOpname._data[i].stokReal,
                            "selisih": $scope.dataStokOpname._data[i].selisih,

                            "adjustmen": $scope.dataStokOpname._data[i].adjustmen
                        });
                }

                if (dataArray.length !== 0) {
                    var objSave = {
                        "ruanganId": $scope.item.ruangan.id,
                        "namaRuangan": $scope.item.ruangan.namaruangan,
                        "tglClosing": moment($scope.now).format('YYYY-MM-DD HH:mm'), //DateHelper.getPeriodeFormatted($scope.item.tanggal),
                        "stokProduk": dataArray
                    }
                    medifirstService.post('logistik/save-data-stock-opname', objSave).then(function (e) {
                        // $scope.item.resep = e.data.noresep.noorder
                        //hitung sesuai jam di UI karena apotik blok F So tanpa berhenti pelayanan
                        for (var i = dataArray.length - 1; i >= 0; i--) {
                            var objSavex = {
                                "ruanganfk": $scope.item.ruangan.id,
                                "produkfk": dataArray[i].produkfk,
                                "tglawal": moment($scope.item.tglhitung).format('YYYY-MM-DD hh:mm:ss')
                            }
                            debugger;
                            //  medifirstService.postNonMessage('logistik/save-perbaiki-kartu-stok',objSavex).then(function (e) {
                            //     // alert('yoyoyyy');
                            // })
                        }

                        $scope.isRouteLoading = false;
                        var norecSC = e.data.noSO
                        if (norecSC != undefined)
                            $scope.saveLogging('Stok Opname', 'norec Struk Closing', norecSC.norec, 'Stok Opname dengan No Closing ' + norecSC.noclosing + ' di ruangan ' + $scope.item.ruangan.namaruangan)

                        var datas = e.data.databarangtaktersave;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            datas[i].no = i + 1
                        }
                        if (datas != undefined) {
                            $scope.DataTakSedia = true;
                        } else {
                            $scope.DataTakSedia = false;
                        }
                        $scope.DataTakTersedia = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });

                        $scope.dataExcel = datas;
                        $scope.cari()
                        // refreshSelisih()                          
                    })
                } else {
                    window.messageContainer.error('Saldo Real barang belum di isi');
                }
            }

            function refreshSelisih() {
                if ($scope.tempDataSource != undefined && $scope.tempDataSource.length > 0) {
                    for (var i = 0; i < $scope.tempDataSource.length; i++) {
                        $scope.tempDataSource[i].selisih = undefined
                    }

                    $scope.dataStokOpname = new kendo.data.DataSource({
                        data: $scope.tempDataSource,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    kodeProduk: { editable: false },
                                    namaProduk: { editable: false, type: "string" },
                                    qtyProduk: { editable: false, type: "number" },
                                    stokReal: { type: "number" },
                                    selisih: { editable: false, type: "number" },
                                    satuanStandar: { editable: false, type: "string" }
                                }
                            }
                        },
                        // pageSize: 20,
                        change: function (e) {
                            console.log("change :" + e.action);
                            if (e.field && e.action === "itemchange") {
                                //debugger;
                                $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                // if ($scope.current.selisih<0)
                                //     $scope.current.selisih = $scope.current.selisih*=-1;
                                $scope.dataStokOpname.fetch();
                            }
                        }
                    });
                }
            }
            $scope.Save = function () {
                $scope.lanjutStokOpname()
                // $scope.popUp.center().open();
            }
            // $scope.uploadFile = function(){
            //     var client = new HttpClient();
            //     client.get('http://127.0.0.1:1237/printvb/logistik?upload-file-so=1', function(response) {
            //         // aadc=response;
            //     });
            // }
            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "DataSOGagal.xlsx",
                    allPages: true,
                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                columns: [{
                    field: "no",
                    title: "No",
                    Template: "<span class='style-center'>#: no #</span>",
                    width: "80px"
                },
                {
                    field: "kdproduk",
                    title: "Kode Produk",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>",
                    width: "100px"
                },
                {
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "100px",
                    template: "<span class='style-center'>#: namaproduk #</span>",
                    headerAttributes: { style: "text-align : center" },
                },
                {
                    field: "stokSistem",
                    title: "Stok Sistem",
                    width: "100px",
                    template: "<span class='style-center'>#: stokSistem #</span>",
                    headerAttributes: { style: "text-align : center" },
                },
                {
                    field: "stokReal",
                    title: "Stok Real",
                    width: "100px",
                    template: "<span class='style-center'>#: stokReal #</span>",
                    headerAttributes: { style: "text-align : center" },
                },
                {
                    field: "selisih",
                    title: "selisih",
                    width: "100px",
                    template: "<span class='style-center'>#: selisih #</span>",
                    headerAttributes: { style: "text-align : center" },
                }
                ]

            });

            $scope.cetak = function () {
                window.messageContainer.error('Fitur belum tersedia');
                //http://127.0.0.1:1237/printvb/logistik?cetak-stokopname=1&tgl=2017-12-29&idRuangan=50&view=true&id=admin
            }
            $scope.batal = function () {
                $scope.item = {};
            }
            $scope.daftar = function () {
                $state.go('DaftarStokOpname')
            }
            /**upload txt lama */

            // function readSingleFile(e) {
            //   var file = e.target.files[0];
            //   var stringFile = e.target.files[0].name
            //   var strFile = stringFile.split('.')
            //   var nmFileArr = strFile[0].split('_')
            //   if(nmFileArr[1] != undefined && nmFileArr[2] != undefined && nmFileArr[3] != undefined){
            //     $scope.item.tanggal =new Date(moment(nmFileArr[1]).format('YYYY-MM-DD HH:mm')) ;
            //     $scope.item.ruangan = {id:nmFileArr[2],namaruangan:nmFileArr[3]}
            //   }else{
            //     toastr.error('Nama File Tidak Sesuai','Info');
            //     return;
            //   }

            //   if (!file) {
            //     return;
            //   }
            //   var reader = new FileReader();
            //   var contents = "";
            //   reader.onload = function(e) {
            //         contents = e.target.result;

            //       var objSave = 
            //             {
            //                 data:contents,
            //                 ruanganfk:$scope.item.ruangan.id
            //             }

            //       manageLogistikPhp.postsofromfile(objSave).then(function(data){
            //             $scope.isEdit = true;
            //             // data.data.detail.forEach(function(x){
            //             //     x.stokReal = x.qtyProduk;
            //             // })
            //             $scope.btnTombol = data.data.save_cmd
            //             $scope.dataStokOpname = new kendo.data.DataSource({
            //                 data: data.data.detail,
            //                 schema: {
            //                     model: {
            //                         id: "id",
            //                         fields: {
            //                             kodeProduk: {editable: false},
            //                             namaProduk: {editable: false, type: "string"},
            //                             qtyProduk: {editable: false, type: "number"},
            //                             stokReal: {type: "number"},
            //                             selisih: {editable: false, type: "number"},
            //                             satuanStandar: {editable: false, type: "string"}
            //                         }
            //                     }
            //                 },
            //                 // pageSize: 20,
            //                 change: function (e) {
            //                     console.log("change :" + e.action);
            //                     if (e.field && e.action === "itemchange") {
            //                         //debugger;
            //                         $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
            //                         // if ($scope.current.selisih<0)
            //                         //     $scope.current.selisih = $scope.current.selisih*=-1;
            //                         $scope.dataStokOpname.fetch();
            //                     }
            //                 }
            //             });
            //         })
            //   };
            //   reader.readAsText(file);
            // }



            // document.getElementById('file-input')
            //   .addEventListener('change', readSingleFile, false);

            /** END upload txt lama */


            /***Upload Excel */
            $("#upload").kendoUpload({
                localization: {
                    "select": "Pilih File Excel..."
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".xlsx"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Excel (.xls)')
                        e.preventDefault();
                        // return
                    }
                    var file = e.files[0];
                    var stringFile = e.files[0].name
                    var strFile = stringFile.split('.')
                    var nmFileArr = strFile[0].split('_')
                    if (nmFileArr[1] != undefined && nmFileArr[2] != undefined && nmFileArr[3] != undefined) {
                        $scope.item.tanggal = new Date(moment(nmFileArr[1]).format('YYYY-MM-DD HH:mm'));
                        $scope.item.ruangan = { id: nmFileArr[2], namaruangan: nmFileArr[3] }
                    } else {
                        toastr.info('SO_Tgl_KodeRuangan_NamaRuangan.xls', 'Contoh Nama File');
                        toastr.error('Nama File Tidak Sesuai', 'Info');

                        return;
                    }

                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;

                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                workbook.SheetNames.forEach(function (sheetName) {
                                    // Here is your object
                                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    var json_object = JSON.stringify(XL_row_object);
                                    console.log(XL_row_object);
                                    var objSave = {
                                        data: XL_row_object,
                                        ruanganfk: $scope.item.ruangan.id
                                    }

                                    medifirstService.post('logistik/get-stok-ruangan-so-from-fileexcel', objSave).then(function (data) {
                                        $scope.isEdit = true;
                                        // data.data.detail.forEach(function(x){
                                        //     x.stokReal = x.qtyProduk;
                                        // })
                                        debugger;
                                        $scope.btnTombol = data.data.save_cmd
                                        $scope.dataStokOpname = new kendo.data.DataSource({
                                            data: data.data.detail,
                                            schema: {
                                                model: {
                                                    id: "id",
                                                    fields: {
                                                        kodeProduk: { editable: false },
                                                        namaProduk: { editable: false, type: "string" },
                                                        qtyProduk: { editable: false, type: "number" },
                                                        stokReal: { type: "number" },
                                                        selisih: { editable: false, type: "number" },
                                                        satuanStandar: { editable: false, type: "string" }
                                                    }
                                                }
                                            },
                                            // pageSize: 20,
                                            change: function (e) {
                                                console.log("change :" + e.action);
                                                if (e.field && e.action === "itemchange") {
                                                    //debugger;
                                                    $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                                    // if ($scope.current.selisih<0)
                                                    //     $scope.current.selisih = $scope.current.selisih*=-1;
                                                    $scope.dataStokOpname.fetch();
                                                }
                                            }
                                        });
                                    })
                                })

                            };

                            reader.onerror = function (ex) {
                                console.log(ex);
                            };

                            reader.readAsBinaryString(file);
                        }
                    }
                },

            })
            /***END Upload Excel */

            /***Upload TXT */
            $("#file-input").kendoUpload({
                localization: {
                    "select": "Pilih File TXT..."
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".txt"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File TXT ')
                        e.preventDefault();
                        // break
                        // return
                    }
                    var file = e.files[0];
                    var stringFile = e.files[0].name
                    var strFile = stringFile.split('.')
                    var nmFileArr = strFile[0].split('_')
                    if (nmFileArr[1] != undefined && nmFileArr[2] != undefined && nmFileArr[3] != undefined) {
                        $scope.item.tanggal = new Date(moment(nmFileArr[1]).format('YYYY-MM-DD HH:mm'));
                        $scope.item.ruangan = { id: nmFileArr[2], namaruangan: nmFileArr[3] }
                    } else {
                        toastr.error('Nama File Tidak Sesuai', 'Info');
                        return;
                    }

                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;
                        // var extension = e.files[i].extension.toLowerCase();
                        if (ALLOWED_EXTENSIONS.indexOf(e.files[i].extension.toLowerCase()) == -1) {
                            break
                        }
                        if (file) {
                            var reader = new FileReader();
                            var contents = "";
                            reader.onload = function (e) {
                                contents = e.target.result;

                                var objSave = {
                                    data: contents,
                                    ruanganfk: $scope.item.ruangan.id
                                }

                                medifirstService.post('logistik/get-stok-ruangan-so-from-file', objSave).then(function (data) {
                                    $scope.isEdit = true;
                                    // data.data.detail.forEach(function(x){
                                    //     x.stokReal = x.qtyProduk;
                                    // })
                                    $scope.btnTombol = data.data.save_cmd
                                    $scope.dataStokOpname = new kendo.data.DataSource({
                                        data: data.data.detail,
                                        schema: {
                                            model: {
                                                id: "id",
                                                fields: {
                                                    kodeProduk: { editable: false },
                                                    namaProduk: { editable: false, type: "string" },
                                                    qtyProduk: { editable: false, type: "number" },
                                                    stokReal: { type: "number" },
                                                    selisih: { editable: false, type: "number" },
                                                    satuanStandar: { editable: false, type: "string" }
                                                }
                                            }
                                        },
                                        // pageSize: 20,
                                        change: function (e) {
                                            console.log("change :" + e.action);
                                            if (e.field && e.action === "itemchange") {
                                                //debugger;
                                                $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                                // if ($scope.current.selisih<0)
                                                //     $scope.current.selisih = $scope.current.selisih*=-1;
                                                $scope.dataStokOpname.fetch();
                                            }
                                        }
                                    });
                                })
                            };
                            // reader.readAsText(file);
                            reader.onerror = function (ex) {
                                console.log(ex);
                            };
                            reader.readAsText(file);
                        }
                    }
                },

            })
            /***END Upload TXT */
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            $scope.CetakRegJasper = function () {
                if ($scope.item.ruangan != undefined) {
                    var ruanganId = $scope.item.ruangan.id
                } else {
                    var ruanganId = ""
                }

                $scope.isRouteLoading = false;
                debugger;
                var data = {
                    "gambarLogo": "logo_rs.jpg",
                    "paramKey": ["namaRS", "alamatRS", "objectruanganfk"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176",
                        ruanganId
                    ],
                    "paramType": ["", "", "", ""]
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }

                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakanso.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakanso.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakanso.pdf');
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakanso.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakanso.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1002/generic/report/cetakanso.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakanso.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;



            }
        }
    ]);
});