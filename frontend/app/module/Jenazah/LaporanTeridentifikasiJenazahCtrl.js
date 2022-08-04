define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanTeridentifikasiJenazahCtrl', ['$mdDialog','CacheHelper', '$scope', '$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, $state, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.dataSelectedIdentifikasi = {};
        $scope.isRouteLoading = true;
        loadCombo();

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana
                $scope.item.jenisbencana = { id: dat.data.jenisbencana[0].id, jenisbencana: dat.data.jenisbencana[0].jenisbencana }
                loadData()
            })
        }
        $scope.cari = function() {
            loadData()
        }
        function loadData() {
            var jenisbencana = '';
            if ($scope.item.jenisbencana != undefined) {
                jenisbencana = "jenisbencana=" + $scope.item.jenisbencana.id
            } else {
                jenisbencana = ''
            }

            medifirstService.get('jenazah/dvi/get-laporan-teridentifikasi-jenazah?' + jenisbencana).then(function(dat) {
                $scope.isRouteLoading = false;
                var laporan = dat.data
                $scope.sourceLaporanIdentifikasi = new kendo.data.DataSource({
                    data: laporan,
                    pageSize: 50,
                    total: laporan.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {

                            }
                        }
                    }
                });
            })
            $scope.formatTanggal = function(tanggal){
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.columnLaporanIdentifikasi = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanPenerimaanJenazah.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:U1"];
                    sheet.name = "Laporan";

                    var myHeaders = [
                        {
                            value: "LAPORAN PENERIMAAN JENAZAH",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                        }
                    ];
                    sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
                },
                // scrollable: true,
                // selectable: "row",
                // pageable: true,
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [
                    {
                        "field": "jenisbencana",
                        "title": "Jenis Bencana",
                        "width": "170px",
                        attributes: {
                            class: "biru"
                        },
                    },
                    {
                        title: "Data Antemortem",
                        // width: "400px",
                        headerAttributes: { style: "text-align: center"},
                        columns: [
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "170px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "namadilaporkan",
                                "title": "Nama Korban",
                                "width": "170px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "170px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                title: "Sumber Sidik Jari",
                                // width: "150px",
                                headerAttributes: { style: "text-align: center"},
                                columns: [
                                    {
                                        "field": "sumbersidikjari",
                                        "title": "Sumber",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "uraiansidikjari",
                                        "title": "Uraian",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "keterangansidikjari",
                                        "title": "Keterangan",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "title": "Foto",
                                        "width": "170px",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"fotoSidikJariAm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                ]
                            },
                            {
                                title: "Sumber Gigi",
                                // width: "150px",
                                headerAttributes: { style: "text-align: center"},
                                columns: [
                                    {
                                        "field": "sumbergigi",
                                        "title": "Sumber",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "uraiangigi",
                                        "title": "Uraian",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "keterangangigi",
                                        "title": "Keterangan",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "title": "Foto",
                                        "width": "170px",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"fotoGigiAm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                ]
                            },
                            {
                                title: "Sumber Dna",
                                // width: "150px",
                                headerAttributes: { style: "text-align: center"},
                                columns: [
                                    {
                                        "field": "sumberdna",
                                        "title": "Sumber",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "uraiandna",
                                        "title": "Uraian",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "field": "keterangandna",
                                        "title": "Keterangan",
                                        "width": "170px",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                    {
                                        "title": "Foto",
                                        "width": "170px",
                                        "template": "<button class=\"k-button custom-button\" ng-click=\"fotoDnaAm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                        attributes: {
                                            class: "spongebob"
                                        },
                                    },
                                ]
                            },
                            {
                                "field": "ciricirifisik",
                                "title": "Ciri Ciri Fisik",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "keteranganfisik",
                                "title": "Keterangan Fisik",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "barangkepemilikan",
                                "title": "Barang Kepemilikan",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                            {
                                "field": "keteranganbarang",
                                "title": "Keterangan Barang",
                                "width": "470px",
                                attributes: {
                                    class: "spongebob"
                                },
                            },
                        ]
                    },
                    {
                        title: "Data Postmortem",
                        // width: "400px",
                        headerAttributes: { style: "text-align: center"},
                        columns: [
                            {
                                "field": "labeldvi",
                                "title": "Label DVI",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "field": "sidikjari",
                                "title": "Sidik Jari",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "title": "Foto Sidik Jari",
                                "width": "170px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"fotoSidikJariPm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "field": "gigi",
                                "title": "Gigi",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "title": "Foto Gigi",
                                "width": "170px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"fotoGigiPm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "field": "dna",
                                "title": "DNA",
                                "width": "170px",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                            {
                                "title": "Foto DNA",
                                "width": "170px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"fotoDnaPm(dataItem)\" style=\"margin:0 0 5px\">Lihat Foto</button>",
                                attributes: {
                                    class: "shrek"
                                },
                            },
                        ]
                    }
                ]
            }
        }
        $scope.release = function() {
            if ($scope.dataSelectedIdentifikasi.noregistrasi == undefined) {
                toastr.error('Data Belum Dipilih !')
                return
            }
            medifirstService.get('jenazah/dvi/cek-sudah-release?noregistrasi=' + $scope.dataSelectedIdentifikasi.noregistrasi).then(function(dat) {
                if (dat.data.length > 0) {
                    toastr.error('Data Sudah di Release !')
                    return
                } else {
                  var arrStr = {
                      0: $scope.dataSelectedIdentifikasi.noregistrasi,
                      1: $scope.dataSelectedIdentifikasi.namadilaporkan,
                      2: $scope.dataSelectedIdentifikasi.tgllahir,
                      3: $scope.dataSelectedIdentifikasi.namapelapor,
                      4: $scope.dataSelectedIdentifikasi.notelepon,
                      5: $scope.dataSelectedIdentifikasi.alamat,
                      6: $scope.dataSelectedIdentifikasi.hubungankeluarga,
                      7: $scope.dataSelectedIdentifikasi.idhubungankeluarga,
                      8: $scope.dataSelectedIdentifikasi.idjenisbencana
                  }
                  cacheHelper.set('ReleaseDvi', arrStr);
                  $state.go('ReleaseDvi')
              }
            })
        }
        $scope.fotoSidikJariAm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-antemortem-new?noregistrasi=' + dataItem.noregistrasi).then(function (dat) {
                debugger
                if (dat.data.fotoSidikJari.length > 0) {
                    $scope.images1 = [];
                    var fotoSidikJari = dat.data.fotoSidikJari
                    for (let i = 0; i < fotoSidikJari.length; i++) {
                        $scope.images1.push({
                            dataURL1: fotoSidikJari[i].foto
                        });
                    }
                    $scope.popUpFotoSidikJariAm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoGigiAm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-antemortem-new?noregistrasi=' + dataItem.noregistrasi).then(function (dat) {
                debugger
                if (dat.data.fotoGigi.length > 0) {
                    $scope.images2 = [];
                    var fotoGigi = dat.data.fotoGigi
                    for (let i = 0; i < fotoGigi.length; i++) {
                        $scope.images2.push({
                            dataURL2: fotoGigi[i].foto
                        });
                    }
                    $scope.popUpFotoGigiAm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoDnaAm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-antemortem-new?noregistrasi=' + dataItem.noregistrasi).then(function (dat) {
                debugger
                if (dat.data.fotoDna.length > 0) {
                    $scope.images3 = [];
                    var fotoDna = dat.data.fotoDna
                    for (let i = 0; i < fotoDna.length; i++) {
                        $scope.images3.push({
                            dataURL3: fotoDna[i].foto
                        });
                    }
                    $scope.popUpFotoDnaAm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoSidikJariPm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-postmortem-new?postmortemfk=' + dataItem.postmortemfk).then(function (dat) {
                debugger;
                if (dat.data.fotoSidikJari.length > 0) {
                    $scope.images4 = [];
                    var fotoSidikJari = dat.data.fotoSidikJari
                    for (let i = 0; i < fotoSidikJari.length; i++) {
                        $scope.images4.push({
                            dataURL4: fotoSidikJari[i].foto
                        });
                    }
                    $scope.popUpFotoSidikJariPm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoGigiPm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-postmortem-new?postmortemfk=' + dataItem.postmortemfk).then(function (dat) {
                debugger;
                if (dat.data.fotoGigi.length > 0) {
                    $scope.images5 = [];
                    var fotoGigi = dat.data.fotoGigi
                    for (let i = 0; i < fotoGigi.length; i++) {
                        $scope.images5.push({
                            dataURL5: fotoGigi[i].foto
                        });
                    }
                    $scope.popUpFotoGigiPm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            })
        }
        $scope.fotoDnaPm = function (dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('jenazah/dvi/get-foto-postmortem-new?postmortemfk=' + dataItem.postmortemfk).then(function (dat) {
                debugger;
                if (dat.data.fotoDna.length > 0) {
                    $scope.images6 = [];
                    var fotoDna = dat.data.fotoDna
                    for (let i = 0; i < fotoDna.length; i++) {
                        $scope.images6.push({
                            dataURL6: fotoDna[i].foto
                        });
                    }
                    $scope.popUpFotoDnaPm.center().open();
                    $scope.isRouteLoading = false;
                } else {
                    toastr.error('Foto Tidak Ada !')
                    $scope.isRouteLoading = false;
                    return;
                }
            }) 
        }
    }
])
})