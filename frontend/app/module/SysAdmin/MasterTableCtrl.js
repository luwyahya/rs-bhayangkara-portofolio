define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterTableCtrl', ['$scope', '$mdDialog', 'MedifirstService',
        function ($scope, $mdDialog, medifirstService) {

            $scope.item = {};
            $scope.isList = false
            var kolom1 = []
            var dataSelected =[]
            var comboboxorigin = []

            loadData()

            function loadData() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/master/get-list_table"
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

                LoadData('-','-')
            }
            $scope.CariFilterData = function(e){
                LoadData($scope.item.field.column_name,$scope.item.filter)
            }
            function LoadData(filterfield,filter){
                var a = ''
                if (filterfield != undefined) {
                    a = "&filterfield=" + filterfield
                }
                var b = ''
                if (filter != undefined) {
                    b = "&filter=" + filter
                }
                medifirstService.get("sysadmin/master/get-table-detail?kelompok=" + $scope.item.title + a + b).then(function (e) {
                    $scope.listData = e.data
                    $scope.item.objcbo = []
                    kolom1 = e.data.kolom1
                    $scope.listField = e.data.kolom1
                    comboboxorigin = e.data.comboboxorigin
                    for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                        if (e.data.kolom1[i].type == 'combobox') {
                            medifirstService.getPart4(e.data.kolom1[i].id,e.data.kolom1[i].column_name, 'sysadmin/master/get-setting-combo', true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                    }

                    $("#kGrid").kendoGrid({
                        dataSource: e.data.data,
                        columns: e.data.kolomsetting
                    });
                     var dataItem = []
                    $("#kGrid").data("kendoGrid").setOptions({
                        columns: e.data.kolomsetting,
                        selectable: true,
                        change: function() {
                          var dataItem = this.dataItem(this.select());
                          
                          dataSelected = dataItem;
                        }
                    }, 100);
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    var dataLoad = e.data.kolom1
                    for (var i = 0; i <= dataLoad.length - 1; i++) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "nchar") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "int") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "nvarchar") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "bit") {
                            $scope.item.obj[dataLoad[i].id] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "smallint") {
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
            $scope.CariTabel = function(){
                 $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/master/get-list_table?namatable=" + $scope.item.cariSubSistem
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
            $scope.clearSubSistem = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/master/get-list_table"
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
                        // datakKeyField: ["id"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: false
                    }
                }, function (error) {
                    $scope.isRouteLoading = false;
                })
                delete $scope.item.cariSubSistem 
            }
            $scope.klikGrid1 = function(data){
                for (var i = 0; i < kolom1.length; i++) {
                    if (kolom1[i].type == 'bit') {
                        if (dataSelected[kolom1[i].column_name] == '1') {
                            $scope.item.obj[kolom1[i].id] = true
                        }else{
                            $scope.item.obj[kolom1[i].id] = false
                        }
                    }else if (kolom1[i].type == 'combobox') {
                        for (var ii = 0; ii < comboboxorigin.length; ii++) {
                            if (dataSelected[kolom1[i].column_name] != null) {
                                if (comboboxorigin[ii].namafield == kolom1[i].column_name) {
                                    medifirstService.get("sysadmin/master/get-table-row-detail?id=" + dataSelected[kolom1[i].column_name] + 
                                        "&table=" + comboboxorigin[ii].tabelrelasi  +
                                        "&value=" + comboboxorigin[ii].fieldkeytabelrelasi  +
                                        "&text="  + comboboxorigin[ii].fieldreportdisplaytabelrelasi +
                                        "&idid="  + kolom1[i].id
                                        ).then(function (e) {
                                            $scope.item.obj[e.data[0].idid] =  {value:e.data[0].value,text:e.data[0].text}
                                    })
                                }
                            }
                        }
                        
                    }else{
                        $scope.item.obj[kolom1[i].id] = dataSelected[kolom1[i].column_name]
                    }
                }
            }

            $scope.detail = function(data){
                $scope.popupEntry.center().open();
                
            }

            $scope.addNew = function(data){
                $scope.popupEntry.center().open();
                for (var i = 0; i < kolom1.length; i++) {
                    $scope.item.obj[kolom1[i].id] = ''
                }                                
            }

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: kolom1[parseInt(arrobj[i])-1].column_name, values: $scope.item.obj[parseInt(arrobj[i])],data_type:kolom1[parseInt(arrobj[i])-1].data_type })
                }
                var jsonSave = {
                    data: arrSave,
                    table: kolom1[0].table_name,
                    id : $scope.item.obj[1]
                }
                medifirstService.post('sysadmin/master/save-table-row', jsonSave).then(function (e) {
                    LoadData('-','-')
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
                    fieldKeyTable = $scope.item.fieldKeyTable.column_name

                var fieldReportDisplay = null
                if ($scope.item.fieldReportDisplay != undefined)
                    fieldReportDisplay = $scope.item.fieldReportDisplay.column_name

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
