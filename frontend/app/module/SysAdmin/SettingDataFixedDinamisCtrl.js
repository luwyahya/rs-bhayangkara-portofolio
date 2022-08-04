define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SettingDataFixedDinamisCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.isList = false
            loadData()

            $scope.listType = [{ id: 'combobox', name: 'List / Combobox' }, { id: 'textbox', name: 'String' },
            { id: 'datetime', name: 'Datetime' }, { id: 'time', name: 'Time' }, { id: 'date', name: 'Date' },
            { id: 'textbox', name: 'Varchar' }, { id: 'textbox', name: 'Integer' }, { id: 'textbox', name: 'Float' }]

            medifirstService.getPart("sysadmin/settingdatafixed/get-table", true, true, 20).then(function (data) {            
                $scope.listTable = data
            })

            $scope.getField = function (e) {
                medifirstService.get("sysadmin/settingdatafixed/get-field-table?tablename=" + e.table_name
                ).then(function (e) {
                    $scope.listFieldName = e.data
                })
            }

            $scope.setTextCombo = function (e) {
                if (e.id == 'combobox') {
                    $scope.isList = true
                    delete $scope.item.nilaiField
                    delete $scope.item.reportDisplay
                }
                else {
                    $scope.isList = false
                    delete $scope.item.nilaiField
                    delete $scope.item.reportDisplay
                }

            }

            $scope.setSourceNilaiFiled = function () {
                if ($scope.item.tabelRelasi && $scope.item.fieldKeyTable) {
                    medifirstService.get("sysadmin/settingdatafixed/get-data-from-table?table_name=" + $scope.item.tabelRelasi.table_name
                        + "&column_name=" + $scope.item.fieldKeyTable.COLUMN_NAME
                    ).then(function (e) {
                        $scope.listIdField = e.data
                    })
                }
            }
            $scope.setSourceReportDisplay = function () {
                if ($scope.item.tabelRelasi && $scope.item.fieldReportDisplay) {
                    medifirstService.get("sysadmin/settingdatafixed/get-data-from-table?table_name=" + $scope.item.tabelRelasi.table_name
                        + "&column_name=" + $scope.item.fieldReportDisplay.COLUMN_NAME
                    ).then(function (e) {
                        $scope.listReportDisplay = e.data
                    })
                }
            }
            function loadData() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/settingdatafixed/get-kelompok-setting"
                ).then(function (e) {
                    let array = e.data.data
                    $scope.isRouteLoading = false;
                    $scope.treeSource = [];                    
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: array,
                        schema: {
                            model: {
                                children: "child",
                                expanded: true
                            }
                        }
                    });
                    $scope.treeSource = inlineDefault
                    $scope.mainTreeViewOption = {
                        dataTextField: ["kelompok"],                        
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: false
                    }
                }, function (error) {
                    $scope.isRouteLoading = false;
                })
            }
            function onSelect(z) {
                var data3 = z.sender.dataSource._data
                var uid_select = z.node.dataset.uid
                $scope.item.title = ''
                $scope.item.title = z.node.innerText
                $scope.item.statusenabled = false
                medifirstService.get("sysadmin/settingdatafixed/get-setting-detail?kelompok=" + z.node.innerText).then(function (e) {
                    $scope.listData = e.data
                    $scope.item.objcbo = []
                    for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                        // if (e.data.kolom1[i].cbotable != null) {
                        medifirstService.getPart3(e.data.kolom1[i].id, 'sysadmin/settingdatafixed/get-setting-combo', true, true, 20).then(function (data) {
                            $scope.item.objcbo[data.options.idididid] = data
                        })
                        // }
                    }


                    for (let z = 0; z <  e.data.kolom1.length; z++) {
                        const element =  e.data.kolom1[z];
                        $scope.item.statusenabled = false
                        if(element.statusenabled == true){
                            $scope.item.statusenabled = true
                            break
                        }                           
                    }
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    var dataLoad = e.data.kolom1
                    for (var i = 0; i <= dataLoad.length - 1; i++) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].id] = chekedd
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].id] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].id] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].id] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].id] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            $scope.item.obj[dataLoad[i].id] = { value: dataLoad[i].value, text: dataLoad[i].text }

                        }

                    }

                })

            }

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                var jsonSave = {
                    data: arrSave,
                    head: $scope.item.statusenabled
                }
                medifirstService.post('sysadmin/settingdatafixed/update-setting', jsonSave).then(function (e) {

                });
            }
            $scope.simpanNew = function () {
                if ($scope.item.namaField == undefined) {
                    toastr.error("Nama Field harus di isi!")
                    return
                }
                if ($scope.item.typeField == undefined) {
                    toastr.error("Type Field harus di isi!")
                    return
                }
                if ($scope.item.nilaiField == undefined) {
                    toastr.error("Nilai Field harus di isi!")
                    return
                }
                if ($scope.item.keteranganFungsi == undefined) {
                    toastr.error("Keterangan Fungsi harus di isi!")
                    return
                }

                var id = "";
                if ($scope.item.id != undefined) {
                    id = $scope.item.id
                }
                var tabelRelasi = null;
                if ($scope.item.tabelRelasi != undefined)
                    tabelRelasi = $scope.item.tabelRelasi.table_name

                var fieldKeyTable = null
                if ($scope.item.fieldKeyTable != undefined)
                    fieldKeyTable = $scope.item.fieldKeyTable.COLUMN_NAME

                var fieldReportDisplay = null
                if ($scope.item.fieldReportDisplay != undefined)
                    fieldReportDisplay = $scope.item.fieldReportDisplay.COLUMN_NAME

                var reportDisplay = null
                if ($scope.item.reportDisplay != undefined && $scope.isList == true)
                    reportDisplay = $scope.item.reportDisplay.name
                else if ($scope.item.reportDisplay != undefined && $scope.isList == false)
                    reportDisplay = $scope.item.reportDisplay

                var nilaiField = null
                if ($scope.isList == true)
                    nilaiField = $scope.item.nilaiField.name
                else if ($scope.isList == false)
                    nilaiField = $scope.item.nilaiField

                var data = {
                    "iddatafixed": id,
                    "namafield": $scope.item.namaField,
                    "nilai": nilaiField,
                    "tabelrelasi": tabelRelasi,
                    "kodeexternal": null,
                    "namaexternal": null,
                    "reportdisplay": reportDisplay,
                    "fieldkeytabelrelasi": fieldKeyTable,
                    "fieldreportdisplaytabelrelasi": fieldReportDisplay,
                    "keteranganfungsi": $scope.item.keteranganFungsi,
                    "typefield": $scope.item.typeField.id,
                    "kelompok": $scope.item.kelompok != undefined ?$scope.item.kelompok : null ,
                }

                var objSave =
                {
                    datafixed: data
                }

                medifirstService.post('sysadmin/settingdatafixed/post-settingdatafixe', objSave).then(function (e) {
                    loadData()
                    $scope.item = {};

                });
            }
            $scope.Batal = function(){
                loadData()
            }
        }
    ]);
});
