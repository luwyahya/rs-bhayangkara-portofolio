define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterIndikatorCtrl', ['$q', '$scope', '$timeout', 'MedifirstService',
        function ($q, $scope, $timeout, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.cari = {}
            var bln = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September',
                'Oktober', 'November', 'Desember']
            LoadCombo();

            function LoadCombo() {
                medifirstService.get('sysadmin/general/rensar/get-jenis-indikator').then(function (e) {
                    $scope.listJenis = e.data.data
                })

                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listDepartemen = data;
                });

                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listDimensiMutu = dataCombo.dimensimutu;
                    $scope.listFrekuensiData = dataCombo.frekuensidata;
                    $scope.listJangkaWaktu = dataCombo.waktulaporan;
                    $scope.listPeriodeAnalis = dataCombo.periodeanalis;
                    $scope.listMetologi = dataCombo.metologi;
                    $scope.listMetodologiAnalisis = dataCombo.metologiana;
                    $scope.listCakupanData = dataCombo.cakupandata;
                    $scope.listPublikasiData = dataCombo.publikasidata;
                    $scope.listKategoryIndokator = dataCombo.kategory;
                    $scope.listJenisMaster = [{ id: 1, master: 'PPI' },
                    { id: 2, master: 'PMKP' }]
                    $scope.listJenisMap = dataCombo.datamapbeckend;
                });
            }

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.optionGridMaster = {
                pageable: true,
                columns: [
                    { field: "no", title: "No", width: 35 },
                    { field: "nourut", title: "No Urut", width: 100 },
                    { field: "indikator", title: "Indikator", width: 200 },// template: "#= pegawai.namaLengkap #"},                
                    { field: "pic", title: "PIC", width: 100 },
                    { field: "namadepartemen", title: "Departemen", width: 100 },
                    { field: "jenisindikator", title: "Jenis", width: 100 },

                ],
            }

            function textareaNameEditor(container, options) {
                $('<textarea required name="' + options.field + '" cols="20" row="4" style="line-height: 6em;"></textarea>')
                    .appendTo(container)
            }

            $scope.cariFilter = function () {
                init()
            }

            function init() {
                $scope.isRouteLoading = true;
                $q.all([
                    medifirstService.get("sysadmin/general/rensar/get-indikator-rensar-m"),
                ]).then(function (res) {
                    $scope.isRouteLoading = false;
                    if (res[0].statResponse) {
                        var data = res[0].data.data
                        if (data.length > 0) {
                            for (let index = 0; index < data.length; index++) {
                                data[index].no = index + 1;
                            }
                        }
                        $scope.dataSource = new kendo.data.DataSource({
                            data: data,
                            pageSize: 20,


                        })
                    }
                }, function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }
            $scope.Tambah = function () {
                $scope.item = {}
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup.center().open()
            }
            $scope.clickedPopup = function () {
                $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal = function () {
                $scope.item = {}
                $scope.dialogPopup.close();
            }

            $scope.SaveBaru = function () {
                var listRawRequired = [
                    "item.indikator|k-ng-model|Indikator",
                    "item.jenisIndikator|k-ng-model|Jenis Indikator",
                    "item.Departemen|k-ng-model|Departemen",
                    "item.jenisMap|k-ng-model|jenisMap"
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var simpan = [];
                    var idDepartemen = '';
                    if ($scope.item.Departemen.id == undefined) {
                        idDepartemen = $scope.item.Departemen.value;
                    }
                    else {
                        idDepartemen = $scope.item.Departemen.id
                    }
                    var data = {
                        "id": '',
                        "statusenabled": true,
                        "definisioperasional": $scope.item.do != undefined ? $scope.item.do : '',
                        "formula": $scope.item.formula != undefined ? $scope.item.formula : '',
                        "indikator": $scope.item.indikator,
                        "pic": $scope.item.pic != undefined ? $scope.item.pic : '',
                        "jenisindikatorfk": $scope.item.jenisIndikator.id,
                        "numerator": $scope.item.numerator != undefined ? $scope.item.numerator : '',
                        "denominator": $scope.item.denominator != undefined ? $scope.item.denominator : '',
                        "dasarpemikiran": $scope.item.dasarPemikiran != undefined ? $scope.item.dasarPemikiran : '',
                        "dimensimutu": $scope.item.DimensiMutu != undefined ? $scope.item.DimensiMutu.id : null,
                        "tujuan": $scope.item.tujuan != undefined ? $scope.item.tujuan : '',
                        "targetpencapaian": $scope.item.TargetPencapaian != undefined ? $scope.item.TargetPencapaian : '',
                        "inklusi": $scope.item.Inklusi != undefined ? $scope.item.Inklusi : '',
                        "eksklusi": $scope.item.eksklusi != undefined ? $scope.item.eksklusi : '',
                        "sumberdata": $scope.item.SumberData != undefined ? $scope.item.SumberData : '',
                        "pengumpulandata": $scope.item.FrekuensiData != undefined ? $scope.item.FrekuensiData.id : null,
                        "jangkalaporan": $scope.item.JangkaWaktu != undefined ? $scope.item.JangkaWaktu.id : null,
                        "periodeanalis": $scope.item.PeriodeAnalis != undefined ? $scope.item.PeriodeAnalis.id : null,
                        "metodologipengumpulandata": $scope.item.Metologi != undefined ? $scope.item.Metologi.id : null,
                        "cakupandata": $scope.item.CakupanData != undefined ? $scope.item.CakupanData.id : null,
                        "sampel": $scope.item.Sampel != undefined ? $scope.item.Sampel : '',
                        "metodologianalisisdata": $scope.item.MetodologiAnalisis != undefined ? $scope.item.MetodologiAnalisis.id : null,
                        "instrumenpengambilandata": $scope.item.InstrumenData != undefined ? $scope.item.InstrumenData : '',
                        "penanggungjawab": $scope.item.PenanggungJawab != undefined ? $scope.item.PenanggungJawab : '',
                        "publikasidata": $scope.item.PublikasiData != undefined ? $scope.item.PublikasiData.id : null,
                        "objectdepartemenfk": idDepartemen,
                        "kategoryindikatorfk": $scope.item.KategoryIndokator != undefined ? $scope.item.KategoryIndokator.id : null,
                        "ketaranganinput": $scope.item.keteranganInput,
                        "ketaranganmaster": $scope.item.jenisMaster != undefined ? $scope.item.jenisMaster.id : 1,
                        "nourut": $scope.item.noUrut,
                        "lamatemuan": $scope.item.lamaTemuan != undefined ? $scope.item.lamaTemuan : null,
                        "jenismap": $scope.item.jenisMap != undefined ? $scope.item.jenisMap.id : null,



                    }
                    var dataRuangan = [];
                    for (var i = 0; i < $scope.dataSourceRuangan._data.length; i++) {
                        if ($scope.dataSourceRuangan._data[i].statCheckbox == true) {
                            dataRuangan.push({
                                "objectruanganfk": $scope.dataSourceRuangan._data[i].id,
                            })
                        }

                    }
                    simpan.push({
                        data,
                        dataRuangan
                    })
                    medifirstService.post("sysadmin/general/rensar/save-master-indikator", simpan).then(function (e) {
                        init();
                        $scope.item = {}
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }
            $scope.Save = function () {
                var listRawRequired = [
                    "item.indikator|k-ng-model|Indikator",
                    "item.jenisIndikator|k-ng-model|Jenis Indikator",
                    "item.Departemen|k-ng-model|Departemen",
                    "item.jenisMap|k-ng-model|jenisMap"
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var simpan = [];
                    var idDepartemen = '';
                    if ($scope.item.Departemen.id == undefined) {
                        idDepartemen = $scope.item.Departemen.value;
                    }
                    else {
                        idDepartemen = $scope.item.Departemen.id
                    }
                    var data = {
                        "id": $scope.item.id != undefined ? $scope.item.id : '',
                        "statusenabled": true,
                        "definisioperasional": $scope.item.do != undefined ? $scope.item.do : '',
                        "formula": $scope.item.formula != undefined ? $scope.item.formula : '',
                        "indikator": $scope.item.indikator,
                        "pic": $scope.item.pic != undefined ? $scope.item.pic : '',
                        "jenisindikatorfk": $scope.item.jenisIndikator.id,
                        "numerator": $scope.item.numerator != undefined ? $scope.item.numerator : '',
                        "denominator": $scope.item.denominator != undefined ? $scope.item.denominator : '',
                        "dasarpemikiran": $scope.item.dasarPemikiran != undefined ? $scope.item.dasarPemikiran : '',
                        "dimensimutu": $scope.item.DimensiMutu != undefined ? $scope.item.DimensiMutu.id : null,
                        "tujuan": $scope.item.tujuan != undefined ? $scope.item.tujuan : '',
                        "targetpencapaian": $scope.item.TargetPencapaian != undefined ? $scope.item.TargetPencapaian : '',
                        "inklusi": $scope.item.Inklusi != undefined ? $scope.item.Inklusi : '',
                        "eksklusi": $scope.item.eksklusi != undefined ? $scope.item.eksklusi : '',
                        "sumberdata": $scope.item.SumberData != undefined ? $scope.item.SumberData : '',
                        "pengumpulandata": $scope.item.FrekuensiData != undefined ? $scope.item.FrekuensiData.id : null,
                        "jangkalaporan": $scope.item.JangkaWaktu != undefined ? $scope.item.JangkaWaktu.id : null,
                        "periodeanalis": $scope.item.PeriodeAnalis != undefined ? $scope.item.PeriodeAnalis.id : null,
                        "metodologipengumpulandata": $scope.item.Metologi != undefined ? $scope.item.Metologi.id : null,
                        "cakupandata": $scope.item.CakupanData != undefined ? $scope.item.CakupanData.id : null,
                        "sampel": $scope.item.Sampel != undefined ? $scope.item.Sampel : '',
                        "metodologianalisisdata": $scope.item.MetodologiAnalisis != undefined ? $scope.item.MetodologiAnalisis.id : null,
                        "instrumenpengambilandata": $scope.item.InstrumenData != undefined ? $scope.item.InstrumenData : '',
                        "penanggungjawab": $scope.item.PenanggungJawab != undefined ? $scope.item.PenanggungJawab : '',
                        "publikasidata": $scope.item.PublikasiData != undefined ? $scope.item.PublikasiData.id : null,
                        "objectdepartemenfk": idDepartemen,
                        "kategoryindikatorfk": $scope.item.KategoryIndokator != undefined ? $scope.item.KategoryIndokator.id : null,
                        "ketaranganinput": $scope.item.keteranganInput,
                        "ketaranganmaster": $scope.item.jenisMaster != undefined ? $scope.item.jenisMaster.id : 1,
                        "nourut": $scope.item.noUrut,
                        "lamatemuan": $scope.item.lamaTemuan != undefined ? $scope.item.lamaTemuan : null,
                        "jenismap": $scope.item.jenisMap != undefined ? $scope.item.jenisMap.id : null,



                    }
                    var dataRuangan = [];
                    for (var i = 0; i < $scope.dataSourceRuangan._data.length; i++) {
                        if ($scope.dataSourceRuangan._data[i].statCheckbox == true) {
                            dataRuangan.push({
                                "objectruanganfk": $scope.dataSourceRuangan._data[i].id,
                            })
                        }

                    }
                    simpan.push({
                        data,
                        dataRuangan
                    })
                    medifirstService.post("sysadmin/general/rensar/save-master-indikator", simpan).then(function (e) {
                        init();
                        $scope.item = {}
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }
            function UbahGrid(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 0,
                    total: ds.length,
                    serverPaging: false,
                });

                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
                $scope.dataVOloaded = true;
            }
            $scope.resetFilter = function () {
                $scope.cari = {};
                init()
            }
            $scope.edit = function (bool) {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.item.id = $scope.dataSelect.id;
                $scope.item.indikator = $scope.dataSelect.indikator;
                $scope.item.pic = $scope.dataSelect.pic;
                $scope.item.jenisIndikator = { id: $scope.dataSelect.jenisindikatorfk, jenisindikator: $scope.dataSelect.jenisindikator };
                $scope.item.KategoryIndokator = { id: $scope.dataSelect.kategoryindikatorfk, kategoryindikator: $scope.dataSelect.kategoryindikator }
                $scope.item.Departemen = { id: $scope.dataSelect.objectdepartemenfk, namadepartemen: $scope.dataSelect.namadepartemen }
                $scope.item.DimensiMutu = { id: $scope.dataSelect.demensimutufk, demensimutu: $scope.dataSelect.demensimutu }
                $scope.item.dasarPemikiran = $scope.dataSelect.dasarpemikiran
                $scope.item.tujuan = $scope.dataSelect.tujuan
                $scope.item.formula = $scope.dataSelect.formula
                $scope.item.denominator = $scope.dataSelect.denominator
                $scope.item.numerator = $scope.dataSelect.numerator
                $scope.item.do = $scope.dataSelect.definisioperasional
                $scope.item.TargetPencapaian = $scope.dataSelect.targetpencapaian
                $scope.item.Inklusi = $scope.dataSelect.inklusi
                $scope.item.eksklusi = $scope.dataSelect.eksklusi
                $scope.item.SumberData = $scope.dataSelect.sumberdata
                $scope.item.Sampel = $scope.dataSelect.sampel
                $scope.item.InstrumenData = $scope.dataSelect.instrumenpengambilandata
                $scope.item.PenanggungJawab = $scope.dataSelect.penanggungjawab
                $scope.item.FrekuensiData = { id: $scope.dataSelect.frekuensifk, frekuensi: $scope.dataSelect.frekuensi };
                $scope.item.JangkaWaktu = { id: $scope.dataSelect.waktulaporanfk, waktulaporan: $scope.dataSelect.waktulaporan }
                $scope.item.PeriodeAnalis = { id: $scope.dataSelect.periodefk, periode: $scope.dataSelect.periodepelaporan }
                $scope.item.Metologi = { id: $scope.dataSelect.metologifk, metologi: $scope.dataSelect.metologi }
                $scope.item.PublikasiData = { id: $scope.dataSelect.publikasidatafk, publikasidata: $scope.dataSelect.publikasidata }
                $scope.item.MetodologiAnalisis = { id: $scope.dataSelect.analisisdatafk, analisisdata: $scope.dataSelect.analisisdata }
                $scope.item.CakupanData = { id: $scope.dataSelect.cakupandatafk, cakupandata: $scope.dataSelect.cakupandata }
                $scope.item.PublikasiData = { id: $scope.dataSelect.publikasidatafk, publikasidata: $scope.dataSelect.publikasidata }
                $scope.item.keteranganInput = $scope.dataSelect.keteranganinput
                $scope.item.jenisMaster = { id: $scope.dataSelect.keteranganmaster, master: $scope.dataSelect.namaketeranganmaster }
                $scope.item.noUrut = $scope.dataSelect.nourut
                $scope.item.lamaTemuan = $scope.dataSelect.lamatemuan
                $scope.item.jenisMap = { id: $scope.dataSelect.objectjenisbeckendindikatorfk, namaexternal: $scope.dataSelect.jenisbeckendindikator }

                // medifirstService.get('sysadmin/general/rensar/get-data-ruangan-cari?objectdepartemenfk=' + 16).then(function (f) {                 

                medifirstService.get('sysadmin/general/rensar/get-ruangan-indikator?indikatorrensarfk=' + $scope.dataSelect.id + '&objectdepartemanfk=' + $scope.dataSelect.objectdepartemenfk).then(function (e) {
                    for (var i = 0; i < e.data.data.length; i++) {
                        if (e.data.data[i].statCheckbox == 1) {

                            e.data.data[i].statCheckbox = true;
                        } else {
                            e.data.data[i].statCheckbox = false;

                        }

                    }
                    $scope.dataSourceRuangan = new kendo.data.DataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { editable: false, type: "number" },
                                    namaruangan: { editable: false, type: "string" }
                                }
                            },

                            pageSize: 20
                        }
                    });
                });
                // });

                $scope.dialogPopup.center().open()
                if (bool) {
                    $scope.isEdit = true
                    $scope.disabledText = true
                } else {
                    $scope.isEdit = false
                    $scope.disabledText = false
                }
            }
            $scope.selectRow = function (dataItem) {

                debugger;
                var dataSelect = _.find($scope.dataSourceRuangan._data, function (data) {
                    return data.id == dataItem.id;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                UbahGrid($scope.dataSourceRuangan._data);

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
                            startsWith: "Cari Ruangan",
                            // eq: "Is equal to",
                            // neq: "Is not equal to"
                        }
                    }
                },
            };

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataSourceRuangan._data;
                debugger;
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
                UbahGrid($scope.dataSourceRuangan._data);
            }

            $scope.columnProduk = [
                {
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
                    "title": "<center style='font-size: 14px; font-weight: bold'>Id</center>",
                    "width": "85px"

                },
                {
                    "field": "namaruangan",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Nama Ruangan</center>",
                    "width": "350px"

                }
            ];
            $scope.hapus = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var data = {
                    "id": $scope.dataSelect.id,
                    "statusenabled": false,
                    "definisioperasional": $scope.dataSelect.definisioperasional,
                    "formula": $scope.dataSelect.formula,
                    "indikator": $scope.dataSelect.indikator,
                    "pic": $scope.dataSelect.pic,
                    "jenisindikatorfk": $scope.dataSelect.jenisindikatorfk,
                    "numerator": $scope.dataSelect.numerator,
                    "denominator": $scope.dataSelect.denominator,

                }
                medifirstService.post("sysadmin/general/rensar/delete-master-indikator-new", data).then(function (e) {
                    init();
                    $scope.item = {}
                });
            }
            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var data = {
                    "id": dataItem.id,
                    "statusenabled": false,
                    "definisioperasional": dataItem.definisioperasional,
                    "formula": dataItem.formula,
                    "indikator": dataItem.indikator,
                    "pic": dataItem.pic,
                    "jenisindikatorfk": dataItem.jenisindikatorfk,
                    "numerator": dataItem.numerator,
                    "denominator": dataItem.denominator,

                }
                medifirstService.post("sysadmin/general/rensar/save-master-indikator", data).then(function (e) {
                    init();
                    $scope.item = {}
                });
            }
            function editRow(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem) {
                    $scope.item.id = dataItem.id
                    $scope.item.indikator = dataItem.indikator
                    $scope.item.pic = dataItem.pic
                    $scope.item.jenisIndikator = { id: dataItem.jenisindikatorfk, jenisindikator: dataItem.jenisindikator }
                    $scope.item.formula = dataItem.formula
                    $scope.item.denominator = dataItem.denominator
                    $scope.item.numerator = dataItem.numerator
                    $scope.item.do = dataItem.definisioperasional
                    $scope.dialogPopup.center().open()
                }

            }
            init();

            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            var timeoutPromise;
            $scope.$watch('cari.indikator', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("indikator", newVal)
                    }
                }, 500)
            })
            $scope.$watch('cari.pic', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pic", newVal)
                    }
                }, 500)
            })

            $scope.$watch('cari.jenisIndikator', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    applyFilter("jenisindikator", newVal.jenisindikator)
                }
            })

            $scope.$watch('cari.departemen', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    applyFilter("namadepartemen", newVal.namadepartemen)
                }
            })

            $scope.getIsiComboRuangan = function () {
                debugger;
                medifirstService.get('sysadmin/general/rensar/get-ruangan-indikator?indikatorrensarfk=' + '' + '&objectdepartemanfk=' + $scope.item.Departemen.value).then(function (e) {

                    for (var i = 0; i < e.data.data.length; i++) {


                        e.data.data[i].statCheckbox = false;


                    }


                    $scope.dataSourceRuangan = new kendo.data.DataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { editable: false, type: "number" },
                                    namaruangan: { editable: false, type: "string" }
                                }
                            },

                            pageSize: 20
                        }
                    });
                });
            }

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridMaster").data("kendoGrid");
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

            $scope.resetFilter = function () {
                var dataGrid = $("#gridMaster").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.cari = {};
            }

            $scope.$watch('item.numerator', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var text = '';
                    var num = '';
                    var denom = '';
                    if ($scope.item.numerator == undefined) {
                        text = num + ' / ' + $scope.item.denominator + ' ' + ' x 100%'
                    } else if ($scope.item.denominator == undefined) {
                        text = $scope.item.numerator + ' / ' + denom + ' ' + ' x 100%'
                    } else {
                        text = $scope.item.numerator + ' / ' + $scope.item.denominator + ' ' + ' x 100%'
                    }
                    $scope.item.formula = text
                }
            });

            $scope.$watch('item.denominator', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var text = $scope.item.numerator + ' / ' + $scope.item.denominator + 'x 100%'
                    $scope.item.formula = text
                }
            });


            $scope.cetak = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (dato) {
                    var dataCombo = dato.data;
                    $scope.analisisdata = dataCombo.metologiana[$scope.dataSelect.analisisdatafk - 1].analisisdata
                    $scope.periodepelaporan = dataCombo.periodeanalis[$scope.dataSelect.periodefk - 1].periode

                    var data = [
                        {
                            "judul": "Dasar Pemikiran",
                            "nama": $scope.dataSelect.dasarpemikiran
                        },
                        {
                            "judul": "Dimensi Mutu",
                            "nama": $scope.dataSelect.demensimutu
                        },
                        {
                            "judul": "Tujuan",
                            "nama": $scope.dataSelect.tujuan
                        },
                        {
                            "judul": "Definisi Operasional",
                            "nama": $scope.dataSelect.definisioperasional
                        },
                        {
                            "judul": "Jenis Indikator",
                            "nama": $scope.dataSelect.kategoryindikator
                        },
                        {
                            "judul": "Numerator (pembilang)",
                            "nama": $scope.dataSelect.numerator
                        },
                        {
                            "judul": "Denominator (penyebut)",
                            "nama": $scope.dataSelect.denominator
                        },
                        {
                            "judul": "Target Pencapaian",
                            "nama": $scope.dataSelect.targetpencapaian
                        },
                        {
                            "judul": "Inklusi",
                            "nama": $scope.dataSelect.inklusi
                        },
                        {
                            "judul": "Eksklusi",
                            "nama": $scope.dataSelect.eksklusi
                        },
                        {
                            "judul": "Formula",
                            "nama": $scope.dataSelect.formula
                        },
                        {
                            "judul": "Sumber data",
                            "nama": $scope.dataSelect.sumberdata
                        },
                        {
                            "judul": "Frekuensi pengumpulan data",
                            "nama": $scope.dataSelect.frekuensi
                        },
                        {
                            "judul": "Jangka Waktu Laporan",
                            "nama": $scope.dataSelect.waktulaporan
                        },
                        {
                            "judul": "Periode analisis",
                            "nama": $scope.periodepelaporan
                        },
                        {
                            "judul": "Metodologi Pengumpulan Data",
                            "nama": $scope.dataSelect.metologi
                        },
                        {
                            "judul": "Cakupan Data",
                            "nama": $scope.dataSelect.cakupandata
                        },
                        {
                            "judul": "Sampel",
                            "nama": $scope.dataSelect.sampel
                        },
                        {
                            "judul": "Metodologi Analisis Data",
                            "nama": $scope.analisisdata
                        },
                        {
                            "judul": "Instrumen Pengambilan Data",
                            "nama": $scope.dataSelect.instrumenpengambilandata
                        },
                        {
                            "judul": "Penanggung Jawab",
                            "nama": $scope.dataSelect.penanggungjawab
                        },
                        {
                            "judul": "Publikasi Data",
                            "nama": $scope.dataSelect.publikasidata
                        }
                    ]

                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data,
                        pageSize: 100,
                        total: data.length,
                        serverPaging: false,
                        model: {
                            schema: {
                                fields: {
                                }
                            }
                        }
                    });
                });

                $scope.item.id = $scope.dataSelect.id;
                $scope.item.indikator = $scope.dataSelect.indikator;
                $scope.item.pic = $scope.dataSelect.pic;
                $scope.item.jenisIndikator = { id: $scope.dataSelect.jenisindikatorfk, jenisindikator: $scope.dataSelect.jenisindikator };
                $scope.item.KategoryIndokator = { id: $scope.dataSelect.kategoryindikatorfk, kategoryindikator: $scope.dataSelect.kategoryindikator }
                $scope.item.Departemen = { id: $scope.dataSelect.objectdepartemenfk, namadepartemen: $scope.dataSelect.namadepartemen }
                $scope.item.DimensiMutu = { id: $scope.dataSelect.demensimutufk, demensimutu: $scope.dataSelect.demensimutu }
                $scope.item.dasarPemikiran = $scope.dataSelect.dasarpemikiran
                $scope.item.tujuan = $scope.dataSelect.tujuan
                $scope.item.formula = $scope.dataSelect.formula
                $scope.item.denominator = $scope.dataSelect.denominator
                $scope.item.numerator = $scope.dataSelect.numerator
                $scope.item.do = $scope.dataSelect.definisioperasional
                $scope.item.TargetPencapaian = $scope.dataSelect.targetpencapaian
                $scope.item.Inklusi = $scope.dataSelect.inklusi
                $scope.item.eksklusi = $scope.dataSelect.eksklusi
                $scope.item.SumberData = $scope.dataSelect.sumberdata
                $scope.item.Sampel = $scope.dataSelect.sampel
                $scope.item.InstrumenData = $scope.dataSelect.instrumenpengambilandata
                $scope.item.PenanggungJawab = $scope.dataSelect.penanggungjawab
                $scope.item.FrekuensiData = { id: $scope.dataSelect.frekuensifk, frekuensi: $scope.dataSelect.frekuensi };
                $scope.item.JangkaWaktu = { id: $scope.dataSelect.waktulaporanfk, waktulaporan: $scope.dataSelect.waktulaporan }
                $scope.item.PeriodeAnalis = { id: $scope.dataSelect.periodefk, periode: $scope.dataSelect.periodepelaporan }
                $scope.item.Metologi = { id: $scope.dataSelect.metologifk, metologi: $scope.dataSelect.metologi }
                $scope.item.PublikasiData = { id: $scope.dataSelect.publikasidatafk, publikasidata: $scope.dataSelect.publikasidata }
                $scope.item.MetodologiAnalisis = { id: $scope.dataSelect.analisisdatafk, analisisdata: $scope.dataSelect.analisisdata }
                $scope.item.CakupanData = { id: $scope.dataSelect.cakupandatafk, cakupandata: $scope.dataSelect.cakupandata }
                $scope.item.PublikasiData = { id: $scope.dataSelect.publikasidatafk, publikasidata: $scope.dataSelect.publikasidata }
                $scope.popUpCetak.center().open()


                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    // , "pdf"],

                    excel: {
                        fileName: "KamusIndikatorMutu.xlsx",
                        allPages: true,

                    },
                    // pdf: {
                    //     fileName: "LaporanPasienMasuk.pdf",
                    //     allPages: true,
                    // },

                    dataSource: $scope.dataExcel,
                    sortable: true,
                    // reorderable: true,
                    // filterable: true,
                    pageable: true,
                    // groupable: true,
                    // columnMenu: true,
                    resizable: true,
                    excelExport: function (e) {
                        var rows = e.workbook.sheets[0].rows;
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            // also delete the width if it is set
                            delete column.width;
                            column.autoWidth = true;
                        });
                        rows.unshift({
                            cells: [{ value: "Kamus Indikator Mutu", background: "#fffff" }]
                        });
                    },
                    columns: [
                        {
                            "field": "judul",
                            "title": "Judul Indikator",
                            "width": "50px"
                            //"template": "<span class='style-center'>#: tglregistrasi #</span>"
                        },
                        {
                            "field": "nama",
                            "title": "Nama Indikator",
                            "width": "150px"
                            //"template": "<span class='style-center'>#: tglmasuk #</span>"
                        }
                    ]
                });
            }

            $scope.tutupCetak = function () {
                $scope.item = {}
                $scope.popUpCetak.close();
            }
            //** BATAS SUCI */
        }
    ])
})