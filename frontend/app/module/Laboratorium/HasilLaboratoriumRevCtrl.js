define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('HasilLaboratoriumRevCtrl', ['$scope', '$state', 'MedifirstService', 'CacheHelper',
        function($scope, $state, medifirstService, cacheHelper) {

            $scope.isRouteLoading = false;
            $scope.norecPD = $state.params.norecPd
            $scope.norecAPD = $state.params.norecApd
            $scope.norecPP = $state.params.norecPP
            $scope.now = new Date();
            $scope.istempatLaporan = true;
            var editkenNorecPP = []
            var produkfk = []
            var tglhasils = null
            var tglpelayanans = null
            $scope.datahasilawal = '';
            // $scope.shows = 0;
            $scope.item = {
                tglpelayanan: new Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss')),
                tglhasil: new Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss')),
            };
            loadCombo();
            LoadCacheHelper();

            function LoadCacheHelper() {
                $scope.KelompokUser = medifirstService.getKelompokUser();
                if ($scope.KelompokUser != "laborat") {
                    $scope.IsSave = false;
                } else {
                    $scope.IsSave = true;
                }
                var chacePeriode = cacheHelper.get('chaceHasilLab2');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.item.tgllahir = chacePeriode[13]
                    $scope.item.objectjeniskelaminfk = chacePeriode[14]
                    $scope.item.norecPP = chacePeriode[15]

                    editkenNorecPP = chacePeriode[18]
                    produkfk = chacePeriode[19]
                    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    const firstDate = new Date($scope.item.tgllahir);
                    const secondDate = new Date($scope.item.tglRegistrasi);
                    $scope.item.DataPegawaiPemeriksa = {
                        namalengkap: chacePeriode[17],
                        id: chacePeriode[16]
                    };
                    $scope.item.umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                }
                // init()
            }
            $scope.noRegistrasi = $state.params.noRegistrasi;
            $scope.noOrder = $state.params.noOrder;

            $scope.norecPP = $scope.item.norecPP;
            // var  onDataBound = function() {
            //     var gridId ="gridId"
            //     var colTitle ="Nama Pemeriksaan"

            // $('#' + gridId + '>.k-grid-content>table').each(function (index, item) {

            //     var dimension_col = 1;
            //     // First, scan first row of headers for the "Dimensions" column.
            //     $('#' + gridId + '>.k-grid-header>.k-grid-header-wrap>table').find('th').each(function () {
            //         if ($(this).text() == colTitle) {

            //             // first_instance holds the first instance of identical td
            //             var first_instance = null;

            //             $(item).find('tr').each(function () {

            //                 // find the td of the correct column (determined by the colTitle)
            //                 var dimension_td = $(this).find('td:nth-child(' + dimension_col + ')');

            //                 if (first_instance == null) {
            //                     first_instance = dimension_td;
            //                 } else if (dimension_td.text() == first_instance.text() ) {
            //                     // if current td is identical to the previous
            //                     // then remove the current td
            //                     // debugger
            //                     dimension_td.remove();
            //                     // increment the rowspan attribute of the first instance
            //                     first_instance.attr('rowspan', typeof first_instance.attr('rowspan') == "undefined" ? 2 : first_instance.attr('rowspan') + 1);
            //                 } else {
            //                     // this cell is different from the last
            //                     first_instance = dimension_td;
            //                 }
            //             });
            //             return;
            //         }
            //         dimension_col++;
            //     });

            // });
            // }
            function loadCombo() {
                medifirstService.get('laboratorium/get-combo-map-lab').then(function(e) {

                    $scope.listSatuan = e.data.satuanstandar

                })
                medifirstService.get("tatarekening/tindakan/get-combo")
                    .then(function(da) {
                        $scope.ListAnalis = da.data.pegawai;
                    })
            }

            $scope.result = function() {
                $scope.resultGrids = new kendo.data.DataSource({
                        data: []
                    })
                    // $scope.group = {
                    //     field: "detailjenisproduk"
                    // };

                $scope.ColumnResult = {
                    toolbar: [
                        "excel",

                    ],
                    excel: {
                        fileName: "HasilLab.xlsx",
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    editable: true,

                    // dataBound: onDataBound,
                    excelExport: function(e) {

                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:H1"];
                        sheet.name = "Hasil";

                        var myHeaders = [

                            {
                                value: "Hasil Laboratorium",
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }
                        ];

                        sheet.rows.splice(0, 0, {
                            cells: myHeaders,
                            type: "header",
                            height: 50
                        });
                    },
                    columns: [{
                            field: "namaproduk",
                            title: "Nama Pemeriksaan",
                            width: "20%"
                        },
                        {
                            field: "detailpemeriksaan",
                            title: "Detail Pemeriksaan",
                            width: "20%"
                        }, {
                            field: "hasil",
                            title: "Hasil Pemeriksaan",
                            width: "15%",
                            attributes: {
                                class: "#=flag != 'N' ? 'red' : 'green' #"
                            },
                            editor: dynamicEditor
                        }, {
                            field: "nilaitext",
                            title: "Nilai Normal",
                            width: "15%"
                        },
                        {
                            field: "hasilpemeriksaanterakhir",
                            title: "Hasil Pemeriksaan Terakhir",
                            width: "15%"

                        },
                        {
                            field: "satuanstandar",
                            title: "Satuan Hasil",
                            width: "20%"
                        },
                        {
                            field: "Metode",
                            title: "Metode",
                            width: "20%"
                        },
                        {
                            field: "hasil_s",
                            title: "S",
                            width: "5%"
                        },
                        {
                            field: "hasil_i",
                            title: "I",
                            width: "5%"
                        },
                        {
                            field: "catatan",
                            title: "Catatan",
                            width: "5%"
                        },
                        {
                            field: "skor",
                            title: "Skor",
                            width: "5%"
                        },
                        {
                            hidden: true,
                            field: "detailjenisproduk",
                            title: "Jenis Pemeriksaan"
                        },

                        {
                            hidden: true,
                            field: "nourutdetail"

                        }
                    ]
                };
                $scope.isRouteLoading = true

                medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + $state.params.norecApd +
                    '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay + '&norec=' + $scope.item.norecPP + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss')) + '&tglP=' + moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss')).then(function(data) {
                    // var sourceGrid = []

                    $scope.isRouteLoading = false;

                    if (data.statResponse == true && data.data.data.length > 0) {
                        $scope.item.tglpelayanan = new Date(moment(data.data.data[0].tglpelayanan).format('YYYY-MM-DD HH:mm'));
                        $scope.item.tglhasil = new Date(moment(data.data.data[0].tglhasil).format('YYYY-MM-DD HH:mm'));

                        // untuk penjagaan lab
                        // var bingung =  moment(data.data.data[0].tglpelayanan).format('YYYY-MM-DD HH:mm');
                        $scope.item.tglhasils = moment(data.data.data[0].tglhasil).format('YYYY-MM-DD HH:mm');
                        $scope.item.mintime = data.data.data[0].mintime * 60000;
                        $scope.item.maxtime = data.data.data[0].maxtime * 60000;
                        // tglpelayanans = Date.parse(bingung);
                        // $scope.item.tglhasilminsec = tglpelayanans + $scope.item.mintime;
                        // $scope.item.tglhasilmaxsec = tglpelayanans + $scope.item.maxtime;

                        $scope.item.DataPegawai = {
                            namalengkap: data.data.data[0].namalengkap,
                            id: data.data.data[0].namalengkap
                        };
                        $scope.item.catatan = data.data.data[0].catatancetak;
                        for (let i = 0; i < data.data.data.length; i++) {
                            const element = data.data.data[i];
                            $scope.item.catatan = data.data.data[i].catatancetak;
                            if (data.data.data[i].tglcetak != null) {
                                $scope.item.tglcetak = new Date(moment(data.data.data[i].tglcetak).format('YYYY-MM-DD HH:mm'));
                            } else {
                                $scope.item.tglcetak = new Date(moment(data.data.data[i].tglhasil).format('YYYY-MM-DD HH:mm'));
                            }


                        }
                        $scope.datahasilawal = data.data.data;
                        medifirstService.get("laboratorium/get-hasil-lab-manuallast?nocm=" + $scope.item.noMr + "&tglpelayanan=" + data.data.data[0].tglpelayanan).then(function(datax) {
                            // $scope.isRouteLoading = false
                            for (let i = 0; i < $scope.datahasilawal.length; i++) {
                                for (let j = 0; j < datax.data.data.length; j++) {
                                    if ($scope.datahasilawal[i].detailpemeriksaan == datax.data.data[j].detailpemeriksaan) {
                                        $scope.datahasilawal[i].hasilpemeriksaanterakhir = datax.data.data[j].hasil + ' / ' + datax.data.data[j].tglpelayanan;
                                    }
                                }



                            }
                            $scope.resultGrids = new kendo.data.DataSource({
                                data: $scope.datahasilawal,
                                group: [{
                                        field: "detailjenisproduk"
                                    },
                                    // { field: "namaproduk" }
                                ],
                                sort: {
                                    field: "nourutdetail",
                                    dir: "asc"
                                },
                                schema: {
                                    model: {
                                        id: "id",
                                        fields: {
                                            detailjenisproduk: {
                                                editable: false,
                                                type: "string"
                                            },
                                            detailpemeriksaan: {
                                                editable: false,
                                                type: "string"
                                            },
                                            memohasil: {
                                                editable: false,
                                                type: "string"
                                            },
                                            namaproduk: {
                                                editable: false,
                                                type: "string"
                                            },
                                            satuanstandar: {
                                                editable: false,
                                                type: "string"
                                            },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: {
                                                editable: false,
                                                type: "string"
                                            },
                                            nilaimin: {
                                                editable: false,
                                                type: "string"
                                            },
                                            hasil: {
                                                editable: (dynamicEditor)
                                            },
                                            skor: {
                                                editable: (dynamicEditor)
                                            },
                                            nourutdetail: {
                                                editable: false,
                                                type: "number"
                                            },
                                            nilaitext: {
                                                editable: false,
                                                type: "string"
                                            }
                                        }
                                    }
                                },
                                change: function(e) {
                                    debugger
                                    console.log("change :" + e.action);
                                    if (e.field && e.action === "itemchange") {
                                        if (e.items[0].hasil) {
                                            // $scope.item.nilaistr = e.items[0].nilaimin + '-' + e.items[0].nilaimax
                                            let HasilInput = e.items[0].hasil
                                            if (HasilInput.indexOf("+/") >= 0) {
                                                let hssl = "positif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("-/") >= 0) {
                                                let hssl = "negatif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("<") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("<");
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf(">") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split(">");
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("-") >= 0 && e.items[0].nilaimin != "") {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("-");
                                                let hssl0 = parseFloat(hsslARr[0])
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl0 >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (e.items[0].nilaimin == null) {
                                                let hssl = e.items[0].hasil
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();

                                                e.items[0].flag = "N"

                                            } else if (e.items[0].nilaimin == "") {
                                                let hssl = e.items[0].hasil
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();

                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }


                                            } else {
                                                if (e.items[0].nilaimin != null) {
                                                    if (e.items[0].tipedata == 2) {
                                                        if (e.items[0].nilaiminkritis != null) {
                                                            let a = (e.items[0].nilaimin).toUpperCase()
                                                            let b = (e.items[0].nilaimax).toUpperCase()
                                                            let c = parseFloat(e.items[0].nilaiminkritis)
                                                            let d = parseFloat(e.items[0].nilaimaxkritis)
                                                            let hssl = ((e.items[0].hasil).trim()).toUpperCase()
                                                            if (hssl >= a && hssl <= b) {
                                                                e.items[0].flag = "N"
                                                            } else if (hssl <= c && c != 0) {
                                                                e.items[0].flag = "K"
                                                            } else if (hssl >= d && d != 0) {
                                                                e.items[0].flag = "K"
                                                            } else {
                                                                e.items[0].flag = "Y"
                                                            }
                                                        } else {
                                                            let a = (e.items[0].nilaimin).toUpperCase()
                                                            let b = (e.items[0].nilaimax).toUpperCase()
                                                            let hssl = ((e.items[0].hasil).trim()).toUpperCase()
                                                            if (hssl >= a && hssl <= b) {
                                                                e.items[0].flag = "N"
                                                            } else {
                                                                e.items[0].flag = "Y"
                                                            }
                                                        }
                                                    } else {
                                                        if (e.items[0].nilaiminkritis != null) {
                                                            let a = parseFloat(e.items[0].nilaimin)
                                                            let b = parseFloat(e.items[0].nilaimax)
                                                            let c = parseFloat(e.items[0].nilaiminkritis)
                                                            let d = parseFloat(e.items[0].nilaimaxkritis)
                                                            let hssl = parseFloat(e.items[0].hasil)
                                                            if (hssl >= a && hssl <= b) {
                                                                e.items[0].flag = "N"
                                                            } else if (hssl <= c && c != 0) {
                                                                e.items[0].flag = "K"
                                                            } else if (hssl >= d && d != 0) {
                                                                e.items[0].flag = "K"
                                                            } else {
                                                                e.items[0].flag = "Y"
                                                            }
                                                        } else {
                                                            let a = parseFloat(e.items[0].nilaimin)
                                                            let b = parseFloat(e.items[0].nilaimax)
                                                            let hssl = parseFloat(e.items[0].hasil)
                                                            if (hssl >= a && hssl <= b) {
                                                                e.items[0].flag = "N"
                                                            } else {
                                                                e.items[0].flag = "Y"
                                                            }
                                                        }
                                                    }

                                                } else {
                                                    let hssl = (e.items[0].hasil).trim()
                                                    let nilaistring = e.items[0].nilaitext
                                                    nilaistring = nilaistring.toUpperCase();
                                                    hssl = hssl.toUpperCase();
                                                    if (hssl == nilaistring) {
                                                        e.items[0].flag = "N"
                                                    } else {
                                                        e.items[0].flag = "Y"
                                                    }
                                                }
                                            }
                                            //                                             alert('hasilna :'+e.items[0].hasil)
                                            e.items.state = "edit"
                                                //                                         } else {
                                                //                                             e.items.state = "add"
                                        } else if (e.items[0].hasil_s || e.items[0].hasil_i) {
                                            e.items[0].flag = "N"
                                        }
                                        // $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                        $scope.resultGrids.fetch();
                                    }
                                }
                            });
                        })


                    } else {
                        toastr.info('Data Hasil tidak ada', 'Info')
                    }
                });
            }

            $scope.result();
            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };

            function loadEditor() {

            }






            $scope.simpanNilaiNormal = function() {
                if ($scope.item.objectprodukfk == undefined) {
                    return
                }
                $scope.popupEntry.center().open();
                //laboratorium/get-for-update-nilainormal
                medifirstService.get("laboratorium/get-for-update-nilainormal?produkfk=" + $scope.item.objectprodukfk +
                        '&mpid=' + $scope.item.mpid).then(function(data) {
                        $scope.item.kelompokUmur = data.data.data[0].kelompokumur
                        for (var i = data.data.data.length - 1; i >= 0; i--) {
                            if (data.data.data[i].jkid == 1) {
                                $scope.item.idL = data.data.data[i].nnid
                                $scope.item.nilaiminL = data.data.data[i].nilaimin
                                $scope.item.nilaimaxL = data.data.data[i].nilaimax
                                $scope.item.nilaimaxL = data.data.data[i].nilaimax
                                $scope.item.nilaiTextL = data.data.data[i].nilaitext
                            } else if (data.data.data[i].jkid == 2) {
                                $scope.item.idP = data.data.data[i].nnid
                                $scope.item.nilaiminP = data.data.data[i].nilaimin
                                $scope.item.nilaimaxP = data.data.data[i].nilaimax
                                $scope.item.nilaimaxP = data.data.data[i].nilaimax
                                $scope.item.nilaiTextP = data.data.data[i].nilaitext
                            }
                        }

                    })
                    //laboratorium/save-update-nilainormal
            }
            $scope.simpanUpdateNilaiNormal = function() {
                if ($scope.item2 != undefined) {
                    let json = {
                        id: $scope.item.mpid,
                        satuanstandarfk: $scope.item2.satuanstandar.id,
                    }
                    medifirstService.post('laboratorium/save-update-map-hasil-lab', json).then(function(e) {
                        $scope.dataSelected.satuanstandar = $scope.item2.satuanstandar.satuanstandar;
                    })

                } else {
                    var objSave = {
                        "l": {
                            id: $scope.item.idL,
                            nilaimax: $scope.item.nilaimaxL,
                            nilaimin: $scope.item.nilaiminL,
                            nilaitext: $scope.item.nilaiTextL,

                        },
                        "p": {
                            id: $scope.item.idP,
                            nilaimax: $scope.item.nilaimaxP,
                            nilaimin: $scope.item.nilaiminP,
                            nilaitext: $scope.item.nilaiTextP,

                        }
                    }
                    if ($scope.item.idP == undefined || $scope.item.idP == "") {
                        alert("Mapping Di Menu (Map Hasil Laboratorium)")
                        return;

                    }
                    if ($scope.item.idL == undefined || $scope.item.idL == "") {
                        alert("Mapping Di Menu (Map Hasil Laboratorium)")
                        return;
                    }
                    medifirstService.post('laboratorium/save-update-nilainormal', objSave).then(function(e) {
                        $scope.popupEntry.center().close();
                        if ($scope.dataSelected.jeniskelaminfk == 1) {
                            $scope.dataSelected.nilaimin = $scope.item.nilaiminL
                            $scope.dataSelected.nilaimax = $scope.item.nilaimaxL
                            $scope.dataSelected.nilaitext = $scope.item.nilaiTextL

                            $scope.item.nilaimin = $scope.item.nilaiminL
                            $scope.item.nilaimax = $scope.item.nilaimaxL
                        }
                        if ($scope.dataSelected.jeniskelaminfk == 2) {
                            $scope.dataSelected.nilaimin = $scope.item.nilaiminP
                            $scope.dataSelected.nilaimax = $scope.item.nilaimaxP
                            $scope.dataSelected.nilaitext = $scope.item.nilaiTextP

                            $scope.item.nilaimin = $scope.item.nilaiminP
                            $scope.item.nilaimax = $scope.item.nilaimaxP
                        }
                        let HasilInput = $scope.dataSelected.hasil
                        if (HasilInput != "") {
                            if (HasilInput.indexOf("+/") >= 0) {
                                let hssl = "positif"
                                let nilaistring = $scope.dataSelected.nilaitext
                                nilaistring = nilaistring.toUpperCase();
                                hssl = hssl.toUpperCase();
                                if (hssl == nilaistring) {
                                    $scope.dataSelected.flag = "N"
                                } else {
                                    $scope.dataSelected.flag = "Y"
                                }
                            } else if (HasilInput.indexOf("-/") >= 0) {
                                let hssl = "negatif"
                                let nilaistring = $scope.dataSelected.nilaitext
                                nilaistring = nilaistring.toUpperCase();
                                hssl = hssl.toUpperCase();
                                if (hssl == nilaistring) {
                                    $scope.dataSelected.flag = "N"
                                } else {
                                    $scope.dataSelected.flag = "Y"
                                }
                            } else if (HasilInput.indexOf("<") >= 0) {
                                let a = parseFloat($scope.dataSelected.nilaimin)
                                let b = parseFloat($scope.dataSelected.nilaimax)
                                let hsslARr = HasilInput.split("<");
                                let hssl = parseFloat(hsslARr[1])

                                if (hssl >= a && hssl <= b) {
                                    $scope.dataSelected.flag = "N"
                                } else {
                                    $scope.dataSelected.flag = "Y"
                                }
                            } else if (HasilInput.indexOf(">") >= 0) {
                                let a = parseFloat($scope.dataSelected.nilaimin)
                                let b = parseFloat($scope.dataSelected.nilaimax)
                                let hsslARr = HasilInput.split(">");
                                let hssl = parseFloat(hsslARr[1])

                                if (hssl >= a && hssl <= b) {
                                    $scope.dataSelected.flag = "N"
                                } else {
                                    $scope.dataSelected.flag = "Y"
                                }
                            } else if (HasilInput.indexOf("-") >= 0) {
                                let a = parseFloat($scope.dataSelected.nilaimin)
                                let b = parseFloat($scope.dataSelected.nilaimax)
                                let hsslARr = HasilInput.split("-");
                                let hssl0 = parseFloat(hsslARr[0])
                                let hssl = parseFloat(hsslARr[1])

                                if (hssl0 >= a && hssl <= b) {
                                    $scope.dataSelected.flag = "N"
                                } else {
                                    $scope.dataSelected.flag = "Y"
                                }
                            } else {
                                if ($scope.dataSelected.nilaimin != null) {
                                    let a = parseFloat($scope.dataSelected.nilaimin)
                                    let b = parseFloat($scope.dataSelected.nilaimax)
                                    let hssl = parseFloat($scope.dataSelected.hasil)

                                    if (hssl >= a && hssl <= b) {
                                        $scope.dataSelected.flag = "N"
                                    } else {
                                        $scope.dataSelected.flag = "Y"
                                    }
                                } else {
                                    let hssl = $scope.dataSelected.hasil
                                    let nilaistring = $scope.dataSelected.nilaitext
                                    nilaistring = nilaistring.toUpperCase();
                                    hssl = hssl.toUpperCase();
                                    if (hssl == nilaistring) {
                                        $scope.dataSelected.flag = "N"
                                    } else {
                                        $scope.dataSelected.flag = "Y"
                                    }
                                }
                            }
                        }
                    })
                }

            }

            function dynamicEditor(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="hasil" data-bind="value:hasil">');
                input.appendTo(container);
                // }
            };
            $scope.kl = function(ttm) {
                $scope.item.nilaimin = $scope.dataSelected.nilaimin
                $scope.item.nilaimax = $scope.dataSelected.nilaimax
                $scope.item.objectprodukfk = $scope.dataSelected.produkfk
                $scope.item.mpid = $scope.dataSelected.map_id
                $scope.item.nmPemeriksaan = $scope.dataSelected.namaproduk
                $scope.item.detPemeriksaan = $scope.dataSelected.detailpemeriksaan
                    // alert("ASDASD")
            }



            $scope.simpan = function() {
                var r = confirm("Yakin Simpan?");
                if (r == false) {
                    return;
                }
                var catatan = "";
                if ($scope.item.catatan != undefined) {
                    catatan = $scope.item.catatan;
                }
                $scope.IsSave = false;
                var dataArray = [];
                for (var i = $scope.resultGrids._data.length - 1; i >= 0; i--) {
                    if ($scope.resultGrids._data[i].hasil != null || $scope.resultGrids._data[i].hasil != '')
                        dataArray.push({
                            "produkfk": $scope.resultGrids._data[i].produkfk,
                            "hasil": $scope.resultGrids._data[i].hasil,
                            "noregistrasifk": $state.params.norecApd,
                            "flag": $scope.resultGrids._data[i].flag,
                            "detailpemeriksaan": $scope.resultGrids._data[i].detailpemeriksaan,
                            "norecpelayanan": $scope.resultGrids._data[i].norecpp,
                            "norec_hasil": $scope.resultGrids._data[i].norec_hasil,
                            "maphasilfk": $scope.resultGrids._data[i].map_id,
                            "hasil_s": $scope.resultGrids._data[i].hasil_s,
                            "hasil_i": $scope.resultGrids._data[i].hasil_i,
                            "catatan": $scope.resultGrids._data[i].catatan,
                            "skor": $scope.resultGrids._data[i].skor,
                            "catatancetak": catatan,
                        });
                }

                if (dataArray.length !== 0) {
                    var objSave = {
                        "hasil": dataArray
                    }
                    medifirstService.post('laboratorium/save-hasil-lab-manual', objSave).then(function(e) {
                        $scope.result();
                        $scope.IsSave = true;
                    })
                }
            }
            $scope.simpanTAT = function() {

                let json = {
                    id: '',
                    noregistrasifk: $state.params.norecApd,
                    TglAwal: '',
                    TglAkhir: '',
                    statusenabled: 1,

                }
                medifirstService.post('laboratorium/save-tat', json).then(function(e) {

                })
            }

            $scope.ubahAT = function() {
                let json = {
                    id: '',
                    noregistrasifk: $state.params.norecApd,
                    TglAwal: '',
                    TglAkhir: '',
                    statusenabled: 1,

                }
                medifirstService.post('laboratorium/update-tat', json).then(function(e) {

                })
            }


            $scope.kembali = function() {
                window.history.back()
            }
            $scope.kembaliAh = function() {
                $scope.popUpDokter.close();
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
            $scope.showPopUp = function() {
                $scope.popUpDokter.center().open();
            }
            $scope.cetak = function() {
                // debugger
                // $scope.item.tglpengambilan = '18-04-2022 12:04';
                // ?noReg=" +

                medifirstService.get('laboratorium/get-tanggal-pengambilan?norecpelayanan=' + editkenNorecPP[0].norec_pp).then(function(a) {

                    if (a.data.b[0].tglpengambilan != undefined || a.data.b[0].tglpengambilan != null || a.data.b[0].tglpengambilan != '') {
                        // alert(a.data.b[0].tglpengambilan);
                        $scope.item.tglpengambilan = a.data.b[0].tglpengambilan;
                    }
                })
                var dokter = "";
                if ($scope.item.DataPegawai == undefined || $scope.item.DataPegawai.id == null || $scope.item.DataPegawai == "") {
                    alert("Pilih terlebih dahulu dookter nya!!")
                    return;
                } else {
                    dokter = $scope.item.DataPegawai
                }
                var ruangan = "";
                if ($scope.item.Ruangan == undefined || $scope.item.Ruangan.id == null) {
                    alert("Pilih terlebih dahulu Ruangan Pengirim nya!!")
                    return;
                } else {
                    ruangan = $scope.item.Ruangan
                }
                var dokterPeriksa = "";
                if ($scope.item.DataPegawaiPemeriksa != undefined || $scope.item.DataPegawaiPemeriksa != null) {
                    dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap
                } else {
                    alert("Pilih terlebih dahulu Dokter Pemeriksa nya!!")
                    return;
                }


                $scope.item.cekUpdate = true;
                $scope.popUpCetak.center().open(); //buka html kendo-window/modal di html 

            }

            medifirstService.get("tatarekening/get-combo-penjamin").then(function(dat) {
                $scope.listUbahPenjamin = dat.data.penjamin;
                $scope.listUbahRekanan = dat.data.rekanan;
            })

            $scope.UbahPenjamin = function() {
                $scope.popupUbahPenjamin.center().open();
            }

            $scope.SaveUbahPenjamin = function() {
                debugger;
                if ($scope.item.ubahpenjamin == undefined) {
                    toastr.error('Penjamin belum dipilih !', 'Warning !')
                    return;
                }
                if ($scope.item.password2 != "ubahpenjamin") {
                    toastr.error("Password Salah !")
                    return;
                }
                // var 
                var dataJson = {
                    noregistrasi: $scope.item.noregistrasi,
                    penjamin: $scope.item.ubahpenjamin.id,
                }
                medifirstService.post('tatarekening/save-update-penjamin-lab', dataJson).then(function(e) {



                    $scope.popupUbahPenjamin.close();
                })
            }

            $scope.cetakPolri = function() {
                var dokter = "";
                if ($scope.item.DataPegawai == undefined) {
                    alert("Pilih terlebih dahulu dookter nya!!")
                    return;
                } else {
                    dokter = $scope.item.DataPegawai
                }
                var ruangan = "";
                if ($scope.item.Ruangan == undefined || $scope.item.Ruangan.id == null) {
                    alert("Pilih terlebih dahulu Ruangan Pengirim nya!!")
                    return;
                } else {
                    ruangan = $scope.item.Ruangan
                }
                // medifirstService.get("laboratorium/get-riwayat-bayar?norec=" + $scope.norecAPD ).then(function (data) {
                //     if(data.data.data[0].nostruklastfk == null )
                //     {
                //          alert("Passien Umum Wajib Bayar Terlebih Dahulu!!")
                //          return;
                //     }
                //  });
                $scope.popUpCetakPolri.center().open();
                // var client = new HttpClient();
                //  client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-polri=1&norec=' + $scope.norecAPD 
                //             + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //             + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view='+ stt + '&doketr=' + dokter.namalengkap +'&catatan=' + $scope.item.catatan, function (response) {

                // }); 

            }
            $scope.cetakMicro = function() {
                var dokter = "";
                if ($scope.item.DataPegawai == undefined) {
                    alert("Pilih terlebih dahulu dookter nya!!")
                    return;
                } else {
                    dokter = $scope.item.DataPegawai
                }
                var ruangan = "";
                if ($scope.item.Ruangan == undefined || $scope.item.Ruangan.id == null) {
                    alert("Pilih terlebih dahulu Ruangan Pengirim nya!!")
                    return;
                } else {
                    ruangan = $scope.item.Ruangan
                }
                var dokterPeriksa = "";
                if ($scope.item.DataPegawaiPemeriksa != undefined || $scope.item.DataPegawaiPemeriksa != null) {
                    dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap
                } else {
                    alert("Pilih terlebih dahulu dokter pemeriksa nya!!")
                    return;
                }

                $scope.popUpMicro.center().open();
            }
            $scope.PopUpCetakFormatPolri = function() {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-polri=1&norec=' + $scope.norecAPD +
                    '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay +
                    '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan +
                    '&tglpelayanan=' + tgl + '&tglhasil=' + tglhasil + '&ruangan=' + ruangan,
                    function(response) {

                    });
            }
            $scope.PopUpCetakFormat = function() {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD +
                    '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay +
                    '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan +
                    '&tglpelayanan=' + tgl + '&tglhasil=' + tglhasil + '&ruangan=' + ruangan + '&dokterperiksa=' + dokterPeriksa,
                    function(response) {

                    });

                var statusUpdate = 1;
                if ($scope.item.cekUpdate == true) {
                    statusUpdate = 2
                }

                var objSave = {
                    norec_pp: editkenNorecPP,
                    tanggalPelayanan: tgl,
                    tglcetak: tglcetak,
                    tglhasil: tglhasil,
                    status: statusUpdate
                }

                medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function(data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    LoadData()
                });


            }

            $scope.PopUpCetakMicro = function() {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function(data) {
                    debugger
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

                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;


                var x = "WHERE (pp.noregistrasifk = '" + $scope.norecAPD + "')and (pp.norec in (" + $scope.item.norecPP + '))'
                var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "analis", "linkqr", "diagnosa", "dokterPeriksa"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap,
                        x, $scope.item.umurDay, $scope.item.objectjeniskelaminfk, tgl, tglhasil, dokter.namalengkap, ruangan, $scope.item.analis.namalengkap, y, diagnosa.toString(), dokterPeriksa.toString()
                    ],
                    "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/hasillabmikrobiologi2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1004/generic/report/hasillabmikrobiologi2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1004/generic/report/hasillabmikrobiologi2.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabmikrobiologi2.pdf');
                } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                    xhr.open('POST', 'http://103.93.237.70:1003/generic/report/hasillabmikrobiologi2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabmikrobiologi2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
            }

            $scope.PopUpCetakKlinik = function() {
                debugger



                var tgl_new = null;
                if ($scope.item.tglpengambilan != undefined || $scope.item.tglpengambilan != null || $scope.item.tglpengambilan != '') {
                    tgl_new = moment($scope.item.tglpengambilan).format('YYYY-MM-DD HH:mm:ss')
                }



                var objSave = {
                    // primary
                    // var depan dikirimkan ke backend || var belakang dikirim dari backend  
                    norecpelayanan: editkenNorecPP[0].norec_pp,
                    tglpengambilan: tgl_new,
                }

                medifirstService.post('laboratorium/update-tgl-pengambilan-hasil-lab', objSave).then(function(data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    LoadData()
                });

                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi + "&ruangan=" + $scope.item.Ruangan.namaruangan).then(function(data) {
                    debugger
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }

                    }

                    // get data from html
                    var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    var tglpengambilan = moment($scope.item.tglpengambilan).format('YYYY-MM-DD HH:mm:ss')
                    var dokter = $scope.item.DataPegawai
                    var ruangan = $scope.item.Ruangan.namaruangan;
                    var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        // var txt = document.createElement("textarea");
                        // txt.innerHTML = $scope.item.catatan;
                        // catatan = txt.value.replace('<sup>','');
                        // catatan = catatan .replace('</sup>','');
                        catatan = $scope.item.catatan;

                    }

                    var x = "WHERE (pp.noregistrasifk = '" + $scope.norecAPD + "')and (pp.norec in (" + $scope.item.norecPP + '))'
                    var y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "tglpengambilan", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap,
                            x, $scope.item.umurDay, $scope.item.objectjeniskelaminfk, tgl, tglhasil, tglpengambilan, dokter.namalengkap, ruangan, y, diagnosa, dokterPeriksa.toString(), catatan
                        ],
                        "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
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
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:1004/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:1004/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:1003/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                        xhr.open('POST', 'http://103.93.237.70:1003/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('simrs') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                    //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                    //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                    //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                    //     });
                    tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                    tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    var statusUpdate = 1;
                    if ($scope.item.cekUpdate == true) {
                        statusUpdate = 2
                    }
                });


                var objSave = {
                    norec_pp: editkenNorecPP,
                    tanggalPelayanan: tgl,
                    // tglpengambilan: tglpengambilan ,
                    tglcetak: tglcetak,
                    tglhasil: tglhasil,
                    dokterkirim: dokter.id,
                    status: statusUpdate
                }

                medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function(data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    LoadData()
                });
            }
            $scope.PopUpCetakKlinikSkor = function() {
                debugger


                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function(data) {
                    debugger
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

                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD')
                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;
                var catatan = "-";
                if ($scope.item.catatan != undefined) {
                    // var txt = document.createElement("textarea");
                    // txt.innerHTML = $scope.item.catatan;
                    // catatan = txt.value.replace('<sup>','');
                    // catatan = catatan .replace('</sup>','');
                    catatan = $scope.item.catatan;

                }

                var x = "WHERE (pp.noregistrasifk = '" + $scope.norecAPD + "')and (pp.norec in (" + $scope.item.norecPP + '))'
                var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap,
                        x, $scope.item.umurDay, $scope.item.objectjeniskelaminfk, tgl, tglhasil, dokter.namalengkap, ruangan, y, diagnosa.toString(), dokterPeriksa.toString(), catatan
                    ],
                    "paramType": ["", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
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
                if (window.location.hostname.indexOf('172.10.3.68') > -1) {
                    xhr.open('POST', 'http://172.10.3.68:1004/generic/report/hasillabKlinikskor.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1004/generic/report/hasillabKlinikskor.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1004/generic/report/hasillabKlinikskor.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabKlinikskor.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1003/generic/report/hasillabKlinikskor.pdf');
                } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                    xhr.open('POST', 'http://103.93.237.70:1003/generic/report/hasillabKlinikskor.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/hasillabKlinikskor.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinikskor.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var statusUpdate = 1;
                if ($scope.item.cekUpdate == true) {
                    statusUpdate = 2
                }

                var objSave = {
                    norec_pp: editkenNorecPP,
                    tanggalPelayanan: tgl,
                    tglcetak: tglcetak,
                    tglhasil: tglhasil,
                    dokterkirim: dokter.id,
                    status: statusUpdate
                }

                medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function(data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    LoadData()
                });
            }

            $scope.PopUpCetakKlinik1 = function() {
                debugger
                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD  HH:mm')
                tglpelayanans = Date.parse(tgl);
                $scope.item.tglhasilminsec = tglpelayanans + $scope.item.mintime;
                $scope.item.tglhasilmaxsec = tglpelayanans + $scope.item.maxtime;

                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD  HH:mm')
                tglhasils = Date.parse(tglhasil);
                var tglmin = new Date($scope.item.tglhasilminsec);
                var tglmax = new Date($scope.item.tglhasilmaxsec);
                tglmin = moment(tglmin).format('YYYY-MM-DD HH:mm');
                tglmax = moment(tglmax).format('YYYY-MM-DD HH:mm');

                // penjagaan hasil lab, tinggal diaktifin
                for (var i = 0; i < produkfk.length; i++) {
                    if (produkfk[i].produkfk == '4076285' || produkfk[i].produkfk == '4076286' || produkfk[i].produkfk == '4076297' || produkfk[i].produkfk == '4076288' || produkfk[i].produkfk == '4076298' || produkfk[i].produkfk == '4076295' || produkfk[i].produkfk == '4076294' || produkfk[i].produkfk == '4076292' || produkfk[i].produkfk == '4076290' || produkfk[i].produkfk == '4076291' || produkfk[i].produkfk == '4076293' || produkfk[i].produkfk == '4076287' || produkfk[i].produkfk == '4076445' || produkfk[i].produkfk == '4076446') {
                        if (tglhasils < $scope.item.tglhasilminsec || tglhasils > $scope.item.tglhasilmaxsec) {
                            alert("Tanggal Hasil Harus diAntara Waktu " + tglmin + " Sampai Dengan " + tglmax + ".")
                            return
                        }
                    } else {

                    }
                }

                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function(data) {
                    debugger
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

                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD  HH:mm')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD  HH:mm')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;
                var catatan = "-";
                if ($scope.item.catatan != undefined) {
                    // var txt = document.createElement("textarea");
                    // txt.innerHTML = $scope.item.catatan;
                    // catatan = txt.value.replace('<sup>','');
                    // catatan = catatan .replace('</sup>','');
                    catatan = $scope.item.catatan;

                }

                var x = "WHERE (pp.noregistrasifk = '" + $scope.norecAPD + "')and (pp.norec in (" + $scope.item.norecPP + '))'
                var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap,
                        x, $scope.item.umurDay, $scope.item.objectjeniskelaminfk, tgl, tglhasil, dokter.namalengkap, ruangan, y, diagnosa.toString(), dokterPeriksa.toString(), catatan
                    ],
                    "paramType": ["", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1004/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1004/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1003/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                    xhr.open('POST', 'http://103.93.237.70:1003/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/hasillabKlinik.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var statusUpdate = 1;
                if ($scope.item.cekUpdate == true) {
                    statusUpdate = 2
                }

                var objSave = {
                    norec_pp: editkenNorecPP,
                    tanggalPelayanan: tgl,
                    tglcetak: tglcetak,
                    tglhasil: tglhasil,
                    dokterkirim: dokter.id,
                    status: statusUpdate
                }

                medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function(data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    LoadData()
                });
            }


            $scope.cetakSurat = function() {
                var dokter = "";
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Surat Keterangan Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                if ($scope.item.catatan == undefined) {
                    alert("Isi Catatan Untuk mengisi tujuan suratnya!!")
                    return;
                }
                var client = new HttpClient();

                client.get('http://127.0.0.1:1237/printvb/bridging?cetak-suratketerangan-lab=1&norec=' + $scope.norecAPD +
                    '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay +
                    '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan,
                    function(response) {

                    });
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {                    

                $scope.popUpDokter.close();
                // });
            }

            medifirstService.getPart("laboratorium/get-combo-dokter-lab").then(function(data) {
                $scope.ListDataPegawai = data;
            });
            medifirstService.get("rawatinap/get-data-combo-dokter", false).then(function(data) {
                $scope.ListRuangan = data.data.ruanganall;
                medifirstService.get("tatarekening/get-detail_apd?noregistrasi=" + $scope.item.noregistrasi).then(function(data) {
                    // debugger
                    $scope.item.Ruangan = {
                        namaruangan: data.data[0].lastRuangan,
                        id: data.data[0].idlasrRuangan
                    }
                });
            });




        }
    ]);

});