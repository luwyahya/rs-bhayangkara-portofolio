define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PostmortemCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
        function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.now = new Date();
            loadCombo();
            loadData();
            $scope.grid = true;
            $scope.isian = false;
            $scope.dataSelectedPostmortem = {};
            $scope.buttontambah = false;
            $scope.buttonedit = false;
            $scope.gambaredit = false;
            var foto = [];
            var foto2 = [];
            var foto3 = [];
            var foto4 = [];
            var fotogrid = [];
            var temp = '';
            var tempnorec = '';
            $scope.model = {};
            $scope.istempatLaporan = true;

            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.dokter2 = true
                } else {
                    $scope.dokter2 = false
                    $scope.item.dokter2 = undefined
                }
            }
            $scope.ceklispilihManual2 = function (bool) {
                if (bool) {
                    $scope.dokter3 = true
                } else {
                    $scope.dokter3 = false
                    $scope.item.dokter3 = undefined
                }
            }
            $scope.ceklispilihManual3 = function (bool) {
                if (bool) {
                    $scope.dokter4 = true
                } else {
                    $scope.dokter4 = false
                    $scope.item.dokter4 = undefined
                }
            }
            $scope.ceklispilihManual4 = function (bool) {
                if (bool) {
                    $scope.dokter5 = true
                } else {
                    $scope.dokter5 = false
                    $scope.item.dokter5 = undefined
                }
            }

            function loadCombo() {
                medifirstService.get('jenazah/get-data-for-combo').then(function (dat) {
                    $scope.listJenisKelamin = dat.data.jenisKelaminPostmortem
                    $scope.listGolonganDarah = dat.data.golongandarah
                    $scope.listDokter = dat.data.dokter
                    $scope.listJenisBencana = dat.data.jenisbencana
                    $scope.item.jenisbencana = { id: dat.data.jenisbencana[0].id, jenisbencana: dat.data.jenisbencana[0].jenisbencana }
                    $scope.listPemeriksaan = dat.data.pemeriksaan
                })
            }
            $scope.search = function () {
                loadData()
            }

            function loadData() {
                var jenisbencana = "";
                if ($scope.item.jenisbencana2 != undefined) {
                    jenisbencana = "jenisbencana=" + $scope.item.jenisbencana2.id
                } else {
                    jenisbencana = ""
                }
                medifirstService.get("jenazah/dvi/get-postmortem?" + jenisbencana).then(function (data) {
                    // debugger;
                    $scope.isRouteLoading = false;
                    var postmortem = data.data
                    $scope.sourcePostmortem = new kendo.data.DataSource({
                        data: postmortem,
                        pageSize: 50,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                })
                $scope.columnPostmortem = {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "Postmortem.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:R1"];
                        sheet.name = "Laporan";

                        var myHeaders = [{
                            value: "LAPORAN POSTMORTEM",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                        }];
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    // $("#kGrid").kendoGrid({
                    //     toolbar: ["excel"],

                    //     excel: {
                    //         fileName: "PostMortem.xlsx",
                    //         allPages: true,

                    //     },

                    //     dataSource: $scope.dataExcel,
                    //     // sortable: true,
                    //     reorderable: true,
                    //     filterable: true,
                    //     pageable: true,
                    //     groupable: true,
                    //     columnMenu: true,
                    //     resizable: true,
                    //     selectable: true,
                    //     excelExport: function (e) {
                    //         var sheet = e.workbook.sheets[0];
                    //             sheet.frozenRows = 2;
                    //             sheet.mergedCells = ["A1:R1"];
                    //             sheet.name = "POSTMORTEM";

                    //             var myHeaders = [

                    //                 {
                    //                     value: "POSTMORTEM ",
                    //                     fontSize: 15,
                    //                     textAlign: "center",
                    //                     background: "#c1d2d2",
                    //                 }];

                    //             sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    //     },
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "50px",
                        "template": "<span class='style-center'>#: no #</span>"
                    },
                    {
                        "field": "labeldvi",
                        "title": "No Label DVI",
                        "width": "50px",
                        "template": "<span class='style-center'>#: labeldvi #</span>"
                    },
                    {
                        "field": "tglperiksa",
                        "title": "Tgl Periksa",
                        "width": "50px",
                        "template": "<span class='style-center'>#: tglperiksa #</span>"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "50px",
                        "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "perkiraanusia",
                        "title": "Usia",
                        "width": "50px",
                        "template": "<span class='style-center'>#: perkiraanusia #</span>"
                    },
                    {
                        "field": "perkiraantinggibadan",
                        "title": "Tinggi Badan (CM)",
                        "width": "50px",
                        "template": "<span class='style-center'>#: perkiraantinggibadan #</span>"
                    },
                    {
                        "field": "cirikhusus",
                        "title": "Ciri Khusus",
                        "width": "50px",
                        "template": "<span class='style-center'>#: cirikhusus #</span>"
                    },
                    {
                        "field": "barangbukti",
                        "title": "Barang Bukti",
                        "width": "50px",
                        "template": "<span class='style-center'>#: barangbukti #</span>"
                    },
                    {
                        "field": "dna",
                        "title": "DNA",
                        "width": "50px",
                        "template": "<span class='style-center'>#: dna #</span>"
                    },
                    {
                        "field": "golongandarah",
                        "title": "Gol Dar",
                        "width": "50px",
                        "template": "<span class='style-center'>#: golongandarah #</span>"
                    },
                    {
                        "field": "inavis",
                        "title": "Inavis",
                        "width": "50px",
                        "template": "<span class='style-center'>#: inavis #</span>"
                    },
                    {
                        "field": "tim",
                        "title": "Tim",
                        "width": "50px",
                        "template": "<span class='style-center'>#: tim #</span>"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "50px",
                        "template": "<span class='style-center'>#: dokter #</span>"
                    },
                    {
                        "field": "labeltkp",
                        "title": "No Label TKP",
                        "width": "50px",
                        "template": "<span class='style-center'>#: labeltkp #</span>"
                    },
                    {
                        "field": "gigi",
                        "title": "Gigi",
                        "width": "50px",
                        "template": "<span class='style-center'>#: gigi #</span>"
                    },
                    {
                        "field": "odontologi",
                        "title": "Obs Odontologi",
                        "width": "50px",
                        "template": "<span class='style-center'>#: odontologi #</span>"
                    },
                    {
                        "field": "hasillab",
                        "title": "Hasil Lab",
                        "width": "50px",
                        "template": "<span class='style-center'>#: hasillab #</span>"
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "50px",
                        "template": "<span class='style-center'>#: keterangan #</span>"
                        // "template": "<button class=\"k-button custom-button\" ng-click=\"keterangan(dataItem)\" style=\"margin:0 0 5px\"> Heleh</button>",
                    },
                    {
                        "title": "Foto",
                        "width": "50px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"lihatfoto(dataItem)\" style=\"margin:0 0 5px\"> Lihat Foto</button>",
                    }
                    ]
                }
                // })
            }
            $scope.save = function () {
                if ($scope.item.jenisbencana == undefined) {
                    toastr.error('Jenis Bencana Belum Dipilih !', 'Peringatan')
                    return
                }
                if ($scope.item.golongandarah == undefined) {
                    $scope.item.golongandarah = {
                        id: ""
                    }
                }
                if ($scope.item.jeniskelamin == undefined) {
                    $scope.item.jeniskelamin = {
                        id: ""
                    }
                }
                debugger;
                var save = {
                    labeldvi: $scope.item.nolabeldvi,
                    tglperiksa: moment($scope.item.tglperiksa).format('YYYY-MM-DD HH:mm'),
                    jeniskelaminfk: $scope.item.jeniskelamin.id,
                    perkiraanusia: $scope.item.perkiraanusia,
                    perkiraantinggibadan: $scope.item.tinggibadan,
                    cirikhusus: $scope.item.cirikhusus,
                    barangbukti: $scope.item.barangbukti,
                    keteranganbarang: $scope.item.keteranganbarang,
                    pemeriksaandna: $scope.item.pemeriksaandna.pemeriksaan,
                    // dna: $scope.item.dna,
                    uraiandna: $scope.item.uraiandna,
                    keterangandna: $scope.item.keterangandna,
                    golongandarahfk: $scope.item.golongandarah.id,
                    pemeriksaaninavis: $scope.item.pemeriksaaninafis.pemeriksaan,
                    uraianinavis: $scope.item.uraianinafis,
                    keteranganinavis: $scope.item.keteranganinafis,
                    // inavis: $scope.item.inavis,
                    tim: $scope.item.tim,
                    dokter: $scope.item.dokter,
                    dokter2: $scope.item.dokter2,
                    dokter3: $scope.item.dokter3,
                    dokter4: $scope.item.dokter4,
                    dokter5: $scope.item.dokter5,
                    labeltkp: $scope.item.nolabeltkp,
                    pemeriksaangigi: $scope.item.pemeriksaangigi.pemeriksaan,
                    uraiangigi: $scope.item.uraiangigi,
                    keterangangigi: $scope.item.keterangangigi,
                    // gigi: $scope.item.gigi,
                    odontologi: $scope.item.obs,
                    hasillab: $scope.item.hasillab,
                    keterangan: $scope.item.keterangan,
                    idjenisbencanafk: $scope.item.jenisbencana.id,
                    sidikjari: $scope.item.sidikjari,
                    hasilpemeriksaan: $scope.item.hasilpemeriksaan,
                    keteranganpemeriksaan: $scope.item.keteranganpemeriksaan,
                    foto: foto,
                    foto2: foto2,
                    foto3: foto3,
                    foto4: foto4
                }
                medifirstService.post('jenazah/dvi/save-postmortem', save).then(function (e) {
                    $scope.item.jenisbencana = undefined
                    $scope.item.nolabeldvi = undefined
                    $scope.item.tglperiksa = undefined
                    $scope.item.jeniskelamin = undefined
                    $scope.item.perkiraanusia = undefined
                    $scope.item.tinggibadan = undefined
                    $scope.item.cirikhusus = undefined
                    $scope.item.barangbukti = undefined
                    $scope.item.dna = undefined
                    $scope.item.golongandarah = undefined
                    $scope.item.inavis = undefined
                    $scope.item.tim = undefined
                    $scope.item.dokter = undefined
                    $scope.item.dokter2 = undefined
                    $scope.item.dokter3 = undefined
                    $scope.item.dokter4 = undefined
                    $scope.item.dokter5 = undefined
                    $scope.item.nolabeltkp = undefined
                    $scope.item.gigi = undefined
                    $scope.item.obs = undefined
                    $scope.item.hasillab = undefined
                    $scope.item.keterangan = undefined
                    $scope.item.sidikjari = undefined
                    $scope.item.keteranganbarang = undefined
                    $scope.item.pemeriksaandna = undefined
                    $scope.item.uraiandna = undefined
                    $scope.item.keterangandna = undefined
                    $scope.item.pemeriksaaninavis = undefined
                    $scope.item.uraianinavis = undefined
                    $scope.item.keteranganinavis = undefined
                    $scope.item.hasilpemeriksaan = undefined
                    $scope.item.keteranganpemeriksaan = undefined
                    $scope.item.pemeriksaangigi = undefined
                    $scope.item.uraiangigi = undefined
                    $scope.item.keterangangigi = undefined
                    foto = []
                    foto2 = []
                    foto3 = []
                    foto4 = []
                    $scope.dokter2 = false
                    $scope.dokter3 = false
                    $scope.dokter4 = false
                })
            }
            $scope.tambah = function () {
                $scope.grid = false;
                $scope.isian = true;
                $scope.buttontambah = true;
                $scope.buttonedit = false;
                $scope.gambaredit = false;
            }
            $scope.kembali = function () {
                loadData();
                $scope.grid = true;
                $scope.isian = false;
                $scope.buttontambah = false;
                $scope.buttonedit = false;
                $scope.gambaredit = false;
            }
            $scope.keterangan = function (dataItem) {
                debugger;
            }
            $scope.lihatam = function () {
                debugger;
                medifirstService.get('jenazah/dvi/get-daftar-formulir-antemortem').then(function (data) {
                    var antemortem = data.data
                    $scope.dataAntemortem = new kendo.data.DataSource({
                        data: antemortem,
                        pageSize: 50,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                })
                $scope.columnAntemortem = {
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [{
                        "field": "tglinput",
                        "title": "Tgl Input",
                        "width": "50px",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "50px",
                    },
                    {
                        "field": "namapelapor",
                        "title": "Nama Pelapor",
                        "width": "50px",
                    },
                    {
                        "field": "namadilaporkan",
                        "title": "Nama Dilaporkan",
                        "width": "50px",
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "50px",
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "50px",
                    },
                    {
                        "field": "alamat",
                        "title": "Alamat",
                        "width": "50px",
                    },
                    {
                        "title": " ",
                        "width": "50px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"foto(dataItem)\" style=\"margin:0 0 5px\"> Lihat Foto</button>",
                    }
                    ]
                }
                $scope.popUpAntemortem.center().open();
            }
            $scope.lihatfoto = function (dataItem) {
                medifirstService.get('jenazah/dvi/get-foto-postmortem?norec=' + dataItem.norec).then(function (dat) {
                    debugger
                    if (dat.data.length > 0) {
                        $scope.images3 = [];
                        var fotopostmortem = dat.data
                        for (let i = 0; i < fotopostmortem.length; i++) {
                            $scope.images3.push({
                                dataURL3: fotopostmortem[i].foto
                            });
                        }
                    } else {
                        toastr.error('Foto tidak ada !')
                        return
                    }
                })
                $scope.popUpFotoPostmortem.center().open();
            }
            $scope.foto = function (dataItem) {
                debugger
                medifirstService.get('jenazah/dvi/get-foto-antemortem?noreg=' + dataItem.noregistrasi).then(function (data) {
                    debugger;
                    $scope.images2 = [];
                    var fotoantemortem = data.data
                    for (let i = 0; i < fotoantemortem.length; i++) {
                        $scope.images2.push({
                            dataURL: fotoantemortem[i].foto
                        });
                    }
                })
                $scope.popUpFotoAntemortem.center().open();

            }
            $scope.closeAntemortem = function () {
                $scope.popUpAntemortem.close();
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase64(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase64(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto.push({ foto: (reader.result), jenisgambar: "gigi" })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker2').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase642(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker2').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase642(file) {
                debugger

                var reader2 = new FileReader();
                reader2.readAsDataURL(file);
                reader2.onload = function () {
                    //    tes.push(reader)
                    console.log(reader2.result);
                    foto2.push({ foto: (reader2.result), jenisgambar: "dna" })
                };
                reader2.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker3').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase643(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker3').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase643(file) {
                debugger

                var reader3 = new FileReader();
                reader3.readAsDataURL(file);
                reader3.onload = function () {
                    //    tes.push(reader)
                    console.log(reader3.result);
                    foto3.push({ foto: (reader3.result), jenisgambar: "sidikjari" })
                };
                reader3.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker4').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase644(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker4').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase644(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result);
                    foto4.push({ foto: (reader.result), jenisgambar: "lampiran" })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            $scope.lihatdata = function () {
                if ($scope.dataSelectedPostmortem.labeldvi == undefined) {
                    toastr.error('Data Belum Dipilih !')
                    return
                }
                loadEdit();
            }

            function loadEdit() {
                medifirstService.get('jenazah/dvi/get-lihat-data-postmortem?label=' + $scope.dataSelectedPostmortem.labeldvi).then(function (dat) {
                    debugger;
                    temp = dat.data.datapostmortem[0].labeldvi
                    tempnorec = dat.data.datapostmortem[0].norec
                    $scope.grid = false;
                    $scope.isian = true;
                    $scope.gambaredit = true;
                    $scope.buttontambah = false;
                    $scope.buttonedit = true;
                    $scope.item.jenisbencana = { id: dat.data.datapostmortem[0].jenisbencanafk, jenisbencana: dat.data.datapostmortem[0].jenisbencana }
                    $scope.item.nolabeldvi = dat.data.datapostmortem[0].labeldvi
                    $scope.item.tglperiksa = dat.data.datapostmortem[0].tglperiksa
                    $scope.item.jeniskelamin = { id: dat.data.datapostmortem[0].jeniskelaminfk, jeniskelamin: dat.data.datapostmortem[0].jeniskelamin }
                    $scope.item.perkiraanusia = dat.data.datapostmortem[0].perkiraanusia
                    $scope.item.tinggibadan = dat.data.datapostmortem[0].perkiraantinggibadan
                    $scope.item.cirikhusus = dat.data.datapostmortem[0].cirikhusus
                    $scope.item.barangbukti = dat.data.datapostmortem[0].barangbukti
                    // $scope.item.dna = dat.data.datapostmortem[0].dna
                    $scope.item.golongandarah = { id: dat.data.datapostmortem[0].golongandarahfk, golongandarah: dat.data.datapostmortem[0].golongandarah }
                    // $scope.item.inavis = dat.data.datapostmortem[0].inavis }
                    $scope.item.tim = dat.data.datapostmortem[0].tim
                    $scope.item.dokter = dat.data.datapostmortem[0].dokter
                    if (dat.data.datapostmortem[0].dokter2 != null) {
                        $scope.model.cekpilihManual = true;
                        $scope.dokter2 = true;
                        $scope.item.dokter2 = dat.data.datapostmortem[0].dokter2
                    }
                    if (dat.data.datapostmortem[0].dokter3 != null) {
                        $scope.model.cekpilihManual2 = true;
                        $scope.dokter3 = true;
                        $scope.item.dokter3 = dat.data.datapostmortem[0].dokter3
                    }
                    if (dat.data.datapostmortem[0].dokter4 != null) {
                        $scope.model.cekpilihManual3 = true;
                        $scope.dokter4 = true;
                        $scope.item.dokter4 = dat.data.datapostmortem[0].dokter4
                    }
                    if (dat.data.datapostmortem[0].dokter5 != null) {
                        $scope.model.cekpilihManual4 = true;
                        $scope.dokter5 = true;
                        $scope.item.dokter5 = dat.data.datapostmortem[0].dokter5
                    }
                    $scope.item.nolabeltkp = dat.data.datapostmortem[0].labeltkp
                    $scope.item.gigi = dat.data.datapostmortem[0].gigi
                    $scope.item.obs = dat.data.datapostmortem[0].odontologi
                    $scope.item.hasillab = dat.data.datapostmortem[0].hasillab
                    $scope.item.keterangan = dat.data.datapostmortem[0].keterangan
                    $scope.item.sidikjari = dat.data.datapostmortem[0].sidikjari
                    $scope.item.keteranganbarang = dat.data.datapostmortem[0].keteranganbarang
                    $scope.item.pemeriksaaninafis = { pemeriksaan: dat.data.datapostmortem[0].pemeriksaaninafis }
                    $scope.item.uraianinafis = dat.data.datapostmortem[0].uraianinavis
                    $scope.item.keteranganinafis = dat.data.datapostmortem[0].keteranganinavis
                    $scope.item.pemeriksaangigi = { pemeriksaan: dat.data.datapostmortem[0].pemeriksaangigi }
                    $scope.item.uraiangigi = dat.data.datapostmortem[0].uraiangigi
                    $scope.item.keterangangigi = dat.data.datapostmortem[0].keterangangigi
                    $scope.item.pemeriksaandna = { pemeriksaan: dat.data.datapostmortem[0].pemeriksaandna }
                    $scope.item.uraiandna = dat.data.datapostmortem[0].uraiandna
                    $scope.item.keterangandna = dat.data.datapostmortem[0].keterangandna
                    $scope.item.hasilpemeriksaan = dat.data.datapostmortem[0].hasilpemeriksaan
                    $scope.item.keteranganpemeriksaan = dat.data.datapostmortem[0].keteranganpemeriksaan
                    debugger
                    // if (dat.data.length > 0) {
                    $scope.images = [];
                    var fotopostmortem = dat.data.fotogigi
                    for (let i = 0; i < fotopostmortem.length; i++) {
                        $scope.images.push({
                            dataURL: fotopostmortem[i].foto,
                            norec: fotopostmortem[i].norec_foto
                        });
                    }
                    $scope.images2 = [];
                    var fotopostmortem = dat.data.fotodna
                    for (let i = 0; i < fotopostmortem.length; i++) {
                        $scope.images2.push({
                            dataURL2: fotopostmortem[i].foto,
                            norec: fotopostmortem[i].norec_foto
                        });
                    }
                    $scope.images3 = [];
                    var fotopostmortem = dat.data.fotosidikjari
                    for (let i = 0; i < fotopostmortem.length; i++) {
                        $scope.images3.push({
                            dataURL3: fotopostmortem[i].foto,
                            norec: fotopostmortem[i].norec_foto
                        });
                    }
                    $scope.images4 = [];
                    var fotopostmortem = dat.data.fotolampiran
                    for (let i = 0; i < fotopostmortem.length; i++) {
                        $scope.images4.push({
                            dataURL4: fotopostmortem[i].foto,
                            norec: fotopostmortem[i].norec_foto
                        });
                    }
                    // }
                })
            }

            $scope.deletefoto = function (image) {
                debugger
                var save = {
                    norec: image.norec
                }
                medifirstService.post('jenazah/dvi/delete-foto-postmortem', save).then(function (e) {
                    $scope.dataSelectedPostmortem.labeldvi = temp
                    loadEdit()
                })
            }
            $scope.edit = function () {
                debugger
                var save = {
                    norec: tempnorec,
                    labeldvi: $scope.item.nolabeldvi,
                    tglperiksa: moment($scope.item.tglperiksa).format('YYYY-MM-DD HH:mm'),
                    jeniskelaminfk: $scope.item.jeniskelamin.id,
                    perkiraanusia: $scope.item.perkiraanusia,
                    perkiraantinggibadan: $scope.item.tinggibadan,
                    cirikhusus: $scope.item.cirikhusus,
                    barangbukti: $scope.item.barangbukti,
                    // dna: $scope.item.dna,
                    pemeriksaandna: $scope.item.pemeriksaandna.pemeriksaan,
                    uraiandna: $scope.item.uraiandna,
                    keterangandna: $scope.item.keterangandna,
                    golongandarahfk: $scope.item.golongandarah.id,
                    // inavis: $scope.item.inavis,
                    pemeriksaaninavis: $scope.item.pemeriksaaninafis.pemeriksaan,
                    uraianinavis: $scope.item.uraianinafis,
                    keteranganinavis: $scope.item.keteranganinafis,
                    tim: $scope.item.tim,
                    dokter: $scope.item.dokter,
                    dokter2: $scope.item.dokter2,
                    dokter3: $scope.item.dokter3,
                    dokter4: $scope.item.dokter4,
                    dokter5: $scope.item.dokter5,
                    // dokterfk: $scope.item.dokter.id,
                    labeltkp: $scope.item.nolabeltkp,
                    // gigi: $scope.item.gigi,
                    pemeriksaangigi: $scope.item.pemeriksaangigi.pemeriksaan,
                    uraiangigi: $scope.item.uraiangigi,
                    keterangangigi: $scope.item.keterangangigi,
                    odontologi: $scope.item.obs,
                    hasillab: $scope.item.hasillab,
                    keterangan: $scope.item.keterangan,
                    idjenisbencanafk: $scope.item.jenisbencana.id,
                    sidikjari: $scope.item.sidikjari,
                    foto: foto,
                    foto2: foto2,
                    foto3: foto3,
                    foto4: foto4
                }
                medifirstService.post('jenazah/dvi/edit-postmortem', save).then(function (e) {
                    $scope.dataSelectedPostmortem.labeldvi = temp
                    loadEdit()
                    foto = []
                    foto2 = []
                    foto3 = []
                    foto4 = []
                })
            }
            $scope.cetak = function () {
                debugger
                $scope.isRouteLoading = true;
                if ($scope.dataSelectedPostmortem.norec == undefined) {
                    toastr.error('Data Belum Dipilih !')
                    $scope.isRouteLoading = false;
                    return;
                }


                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norec"],
                    "paramValue": [$scope.dataSelectedPostmortem.norec],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/postmortem.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/postmortem.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/postmortem.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/postmortem.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1002/generic/report/postmortem.pdf');
                } else if (window.location.hostname.indexOf('172.10.3.68') > -1) {
                    xhr.open('POST', 'http://172.10.3.68:8797/generic/report/postmortem.pdf');
                } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                    xhr.open('POST', 'http://103.93.237.70:1002/generic/report/postmortem.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/postmortem.pdf');
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
    ])
})