define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarPegawaiPensiunMeninggalCtrl', ['$scope', 'MedifirstService', 'DateHelper','$timeout', 
        function($scope, medifirstService, dateHelper, $timeout) {
            $scope.showTombol = true;
            $scope.loadInit = function() {
                $scope.item = {};
                loadData2();
                $scope.itemPensiun={};
                // $scope.loadData();
            };
            FormLoad();
            function FormLoad() {
                 $scope.isRouteLoading = true;
                 medifirstService.get("sdm/get-data-combo-sdm?", true).then(function(dat){                 
                    var dataCombo = dat.data                                      
                    $scope.ListGolonganPegawai=dataCombo.golonganpegawai;
                    $scope.ListUnitKerja = dataCombo.dataunitkerja;
                }); 

            }

            $scope.loadInit();

            function loadData2 (){
                $scope.isRouteLoading = true;
                medifirstService.get("sdm/data-pegawai-sudah-pensiun").then(function(res){
                        $scope.dataPensiun = new kendo.data.DataSource({
                            data: res.data.data,
                            pageSize: 10,
                            schema:{
                                model:{
                                    fields:{
                                        "tglpensiun":{type: "date"},
                                        "namalengkap":{type:"string"}

                                    }
                                }
                            },
                    });
                    $scope.isRouteLoading = false;
                }, (err) => {
                    $scope.isRouteLoading = false;
                });
            };

            var timeoutPromise;
            $scope.$watch('item.periodeAwal', function(newVal, oldVal){
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function(){
                    if (newVal && newVal !== oldVal){
                        applyFilterDate("#gridPensiun", "tglpensiun", "gte", newVal)
                        // applyFiterKu(newVal,$scope.datagridStr, "str", "awal")
                    }
                }, 500);
            });
            $scope.$watch('item.periodeAkhir', function(newVal, oldVal){
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function(){
                    if (newVal && newVal !== oldVal){
                        applyFilterDate("#gridPensiun", "tglpensiun", "lte", newVal)
                        // applyFiterKu(newVal,$scope.datagridStr, "str", "akhir")
                    }
                }, 500);
            });

            $scope.$watch('item.namaPegawai', function(newVal, oldVal){
                if(!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function(){
                    if(newVal && newVal !== oldVal){
                        applyFilterSS("#gridPensiun","namalengkap", newVal);
                    }
                }, 500)
            });

            function applyFilterDate(gridId, filterField, filterOperator, filterValue){
                var gridData = $(gridId).data("kendoGrid");
                var currFilterObj = gridData.dataSource.filter();
                // var currFilterObj = gridData.data.filter();
                var currentFilters = currFilterObj ? currFilterObj.filters : [];
                
                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField && currentFilters[i].operator == filterOperator) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue !== "") {
                    var tgl;
                    if(filterOperator === "gte") {
                        tgl = dateHelper.setJamAwal(new Date(filterValue));
                    } else if(filterOperator === "lte"){
                        tgl = dateHelper.setJamAkhir(new Date(filterValue));
                    }
                    currentFilters.push({
                        field: filterField,
                        operator: filterOperator,
                        value: tgl
                    });

                }

                gridData.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });
            };

            function applyFilterSS(gridId,filterField, filterValue){
                var dataGrid = $(gridId).data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if(currentFilters && currentFilters.length > 0){
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterField === "namalengkap") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                } 

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });

            }

            $scope.resetFilter = function(gridId){
                var gridData = $(gridId).data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
            };

            $scope.loadData = function(){
                $scope.isRouteLoading = true;
                var tglAwal = null;
                if ($scope.item.periodeAwal != undefined) {
                    tglAwal ="tglAwal="+ moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                }
                var tglAkhir = null;
                if ($scope.item.periodeAkhir != undefined) {
                    tglAkhir = "&tglAkhir="+moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');
                }
                var namaPeg ="";
                if ($scope.item.namaPegawai != undefined) {
                    namaPeg = "&namaPeg="+$scope.item.namaPegawai;
                }

                medifirstService.get("sdm/get-data-pensiun?"+
                        tglAwal+
                        tglAkhir+namaPeg).then(function(res){
                        $scope.dataPensiun = new kendo.data.DataSource({
                            data: res.data.data,
                            pageSize: 10,
                            // schema:{
                            //     model:{
                            //         fields:{
                            //             "tglberakhir":{type: "date"},
                            //             "namapegawai":{type:"string"}

                            //         }
                            //     }
                            // },
                    });
                    $scope.isRouteLoading = false;
                }, (err) => {
                    $scope.isRouteLoading = false;
                });
            };

            // $scope.loadData();
            $scope.opsiDataPensiun = {
                toolbar: ["excel",
                ],
                excel: {
                    fileName: kendo.toString(new Date, "dd/MM/yyyy HH:mm")+"Daftar Pegawai Sudah Pensiun.xlsx",
                    allPages: true,
                },
                // excelExport: function(e) {
                // e.workbook.fileName = kendo.toString(new Date, "dd/MM/yyyy HH:mm") + " DaftarPegawaiPensiun.xlsx";
                // },
                excelExport: function(e){
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value:"Daftar Pensiun Pegawai",
                        fontSize: 20,
                        textAlign: "center",
                        background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },

                pageable: true,
                scrollable: false,
                selectable: "row",
                columns: [
                    {field: "namalengkap", title: "Nama Pegawai"},
                    {field: "nippns", title: "NIP"},
                    {field: "golonganpegawai", title: "Golongan",template: "# if (golonganpegawai == null){ # #: '-' # # }else{# #= golonganpegawai # #}#"},
                    // {field: "golongan", title: "Golongan",template: "# if (golonganpegawai == null){ # #: '-' # # }else{# #= golonganpegawai # #}#"},
                    {field: "unitkerja", title: "Unit Kerja", template: "# if (unitkerja == null){ # #: '-' # # }else{# #= unitkerja # #}#"},
                    {field: "subunit", title: "Sub Unit Kerja", template: "# if (subunit == null){ # #: '-' # # }else{# #= subunit # #}#"},
                    {field: "tgllahir", title: "Tgl Lahir", template: "# if (tgllahir == null){ # #: '-' # # }else{# #= kendo.toString(new Date(tgllahir), \"dd/MM/yyyy\") # #}#"},
                    {field: "pensiun", title: "Umur Pensiun",template: "# if (pensiun == null){ # #: '-' # # }else{# #= pensiun # #}#"},
                    {field: "tglpensiun", title: "Tgl Pensiun", 
                            template: "# if (tglpensiun == null){ # #: '-' # # }else{# #= kendo.toString(new Date(tglpensiun), \"dd/MM/yyyy\") # #}#"},
                            // template: "#= kendo.toString(new Date(tglpensiun), \"dd/MM/yyyy\") #"},
                    {
                        "command": [
                        // {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "Batal Pensiun",
                            click: batalPensiun,
                            imageClass: "k-icon k-i-pencil"
                        },
                        ],
                        title: "",
                        width: "12%",
                    },

                ],

                sortable: true
            }

            $scope.yearSelected = { 
                format: "dd MMMM yyyy",
                start: "year", 
                depth: "month" 
            };

            $scope.$watch('itemPensiun.unitKerja', function(newValue, oldValue) {
                if (newValue != oldValue  ) {
                    $scope.ListSubUnitKerja = newValue.subunit;
                    }
                });

            function editData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));               
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                // $scope.popUpPensiun.center().open();  
                $scope.item.idPegawai = dataItem.id;
                $scope.itemPensiun.namaLengkap = dataItem.namalengkap;
                $scope.itemPensiun.nipPns = dataItem.nippns;
                
                var unitKerja = [];
                for (var i = 0; i < $scope.ListUnitKerja.length; i++) {
                    if($scope.ListUnitKerja[i].id == dataItem.objectunitkerjafk){
                        unitKerja = $scope.ListUnitKerja[i]
                        break
                    }

                }
                
                

                var golonganPeg =[];
                for (var i = 0; i < $scope.ListGolonganPegawai.length; i++) {
                    if($scope.ListGolonganPegawai[i].id == dataItem.objectgolonganpegawaifk){
                        golonganPeg = $scope.ListGolonganPegawai[i]
                        break
                    }

                }

                $scope.itemPensiun.unitKerja=unitKerja//{id:dataItem.unitkerjafk,name:dataItem.unitkerja};
                $scope.itemPensiun.subUnitKerja={id:dataItem.objectsubunitkerjapegawaifk,name:dataItem.subunit};
                $scope.itemPensiun.golonganPeg=golonganPeg;
                $scope.itemPensiun.pensiun=parseInt(dataItem.pensiun);
                $scope.itemPensiun.tglLahir=moment(dataItem.tgllahir).format('YYYY-MM-DD HH:mm');
                $scope.itemPensiun.tglPensiun=moment(dataItem.tglpensiun).format('YYYY-MM-DD HH:mm');
                $scope.popUpPensiun.center().open();                         
            }

            $scope.batal = function(){
                $scope.itemPensiun={};
                $scope.popUpPensiun.close();
            }

            $scope.saveData = function () {

                if ($scope.item.idPegawai != undefined){
                    var id = $scope.item.idPegawai
                }else{
                    toastr.error('Anda Belum memilih pegawai')
                    return
                }

                var objSave = {
                    "id":id,
                    "objectgolonganfk": $scope.itemPensiun.golonganPeg.id,
                    "objectgolonganpegawaifk": $scope.itemPensiun.golonganPeg.id,
                    "nip_pns":$scope.itemPensiun.nipPns,
                    "nippns":$scope.itemPensiun.nipPns,
                    "objectunitkerjapegawaifk":$scope.itemPensiun.unitKerja.id,
                    "objectunitkerjafk":$scope.itemPensiun.unitKerja.id,
                    "objectsubunitkerjapegawaifk":$scope.itemPensiun.subUnitKerja.id,
                    "pensiun": $scope.itemPensiun.pensiun,
                    "tglpensiun":moment($scope.itemPensiun.tglPensiun).format('YYYY-MM-DD HH:mm'),
                    "tgllahir":moment($scope.itemPensiun.tglLahir).format('YYYY-MM-DD HH:mm'),

                }
                medifirstService.post('sdm/update-data-pegawai-form-pensiun',objSave).then(function (e) {
                    loadData2();
                    $scope.clearPensiun();
                })

            }

            function batalPensiun(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));               
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                if (dataItem.id != undefined){
                    var id =dataItem.id;
                }else{
                    toastr.error('Anda Belum memilih pegawai')
                    return
                }

                var objSave = {
                    "id":id,
                    "statusenabled": 1,
                }
                medifirstService.post('sdm/save-data-pensiun-pegawai',objSave).then(function (e) {
                    loadData2();
                    $scope.clearPensiun();
                })

            }

            $scope.clearPensiun = function () {
                $scope.item = {};
                $scope.itemPensiun = {};
                $scope.popUpPensiun.close();
            }
            // * BATAS SUCI *//
        }
    ]);
});