define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KepatuhanCuciTanganCtrl', ['$q', '$scope', '$timeout', 'MedifirstService',
        function ($q, $scope, $timeout, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.cari = {};
            $scope.now = new Date();
            var norec = '';
            LoadCombo();
            init();

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }     


            function LoadCombo() {
                 medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuang = data;
                });
                
                $scope.item.bulan =$scope.now;
                $scope.item.tanggal = moment(new Date()).format('YYYY-MM-DD HH:mm');    
                // init();    
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
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));
                var bln = ''
                if ($scope.item.bulan != undefined) {
                    bln = moment($scope.item.bulan).format('YYYY-MM')
                }               
                medifirstService.get('emr/get-data-kepatuhan-handhygiene-ipcn?bln='+ bln).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        var month = new Array();
                          month[1] = "Januari";
                          month[2] = "Februari";
                          month[3] = "Maret";
                          month[4] = "April";
                          month[5] = "Mei";
                          month[6] = "Juni";
                          month[7] = "Juli";
                          month[8] = "Agustus";
                          month[9] = "September";
                          month[10] = "Oktober";
                          month[11] = "November";
                          month[12] = "Desember";
                        for (var i = 0; i < datas.length; i++) {
                                datas[i].no = i + 1;
                                datas[i].bulantahun = month[datas[i].bulan] + ' ' + datas[i].tahun
                            }
                        $scope.dataSource = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 100,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        namaruangan: {type: "string"}
                                    }
                                }
                            },
                            group:{
                                field: "namaruangan"
                            }
                        });
                    },function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }

            $scope.optionGridMaster = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Surveilans Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                pageable: true,
                columns: 
                [
                    { 
                       "field": "bulantahun", 
                       "title": "Bulan",
                       "width": "200px"
                    },
                    { 
                       "field": "namaruangan", 
                       "title": "Nama Ruangan",
                       "width": "200px"
                    },                
                    { 
                       "field": "jenispegawai", 
                       "title": "Profesi",
                       "width": "200px"
                    },
                    { 
                       "field": "patuh", 
                       "title": "Patuh",
                       "width": "200px"
                    },
                    { 
                       "field": "tidakpatuh", 
                       "title": "Tidak Patuh",
                       "width": "200px"
                    }
                ],
            }

            function loadData() {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));               
                medifirstService.get('emr/get-data-kepatuhan-cuci-tanganload?&bulan=' + tanggal
                    ).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                            }
                        $scope.bambang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    },function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
                    
            }
            $scope.Tambah = function () {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup.center().open()
            }
            $scope.Edit = function () {
                // $scope.item = {}
                $scope.isRouteLoading = true;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));               
                medifirstService.get('emr/get-data-kepatuhan-cuci-tanganload?&bulan=' + tanggal
                    ).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                            }
                        $scope.bambang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
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
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup2.center().open()
            }
            $scope.clickedPopup = function () {
                $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal = function () {
                $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal2 = function () {
                $scope.item = {}
                $scope.dialogPopup2.close();
            }

            $scope.Save = function () {
                var listRawRequired = [
                    // "item.indikator|k-ng-model|Indikator",
                    // "item.jenisIndikator|k-ng-model|Jenis Indikator",
                    // "item.Departemen|k-ng-model|Departemen"
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {

                    var data = {
                        "norec" : norec,
                        "tanggal" :moment($scope.item.tanggal).format('YYYY-MM-DD HH:mm'),                        
                        "doktersp_p" :$scope.item.doktersp_p != undefined ? $scope.item.doktersp_p : 0,
                        "doktersp_t" :$scope.item.doktersp_t != undefined ? $scope.item.doktersp_t : 0,
                        "dokteru_p" :$scope.item.dokteru_p != undefined ? $scope.item.dokteru_p : 0,
                        "dokteru_t" :$scope.item.dokteru_t != undefined ? $scope.item.dokteru_t : 0,
                        "perawat_p" :$scope.item.perawat_p != undefined ? $scope.item.perawat_p : 0,
                        "perawat_t" :$scope.item.perawat_t != undefined ? $scope.item.perawat_t : 0,
                        "penunjang_p" :$scope.item.penunjang_p != undefined ? $scope.item.penunjang_p : 0,
                        "penunjang_t" :$scope.item.penunjang_t != undefined ? $scope.item.penunjang_t : 0,
                        "administrasi_p" :$scope.item.administrasi_p != undefined ? $scope.item.administrasi_p : 0,
                        "administrasi_t" :$scope.item.administrasi_t != undefined ? $scope.item.administrasi_t : 0,
                        "coas_p" :$scope.item.coas_p != undefined ? $scope.item.coas_p : 0,
                        "coas_t" :$scope.item.coas_t != undefined ? $scope.item.coas_t : 0,
                        "siswa_p" :$scope.item.siswa_p != undefined ? $scope.item.siswa_p : 0,
                        "siswa_t" :$scope.item.siswa_t != undefined ? $scope.item.siswa_t : 0,
                        "lain_p" :$scope.item.lain_p != undefined ? $scope.item.lain_p : 0,
                        "noruanganfk" :$scope.item.noruanganfk != undefined ? $scope.item.noruanganfk.value : null,
                        "lain_t" :$scope.item.lain_t != undefined ? $scope.item.lain_t : 0,

                        
                    }
                    medifirstService.post("emr/save-kepatuhancuci", data).then(function (e) {
                        init();
                        loadData();
                        $scope.item = {}
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
                i$scope.isRouteLoading = false;
                
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
                norec = $scope.dataSelect.norec;
                $scope.item.tanggal = new Date($scope.dataSelect.tanggal);
                $scope.item.doktersp_p = $scope.dataSelect.doktersp_p;
                $scope.item.doktersp_t = $scope.dataSelect.doktersp_t;
                $scope.item.dokteru_p = $scope.dataSelect.dokteru_p;
                $scope.item.dokteru_t = $scope.dataSelect.dokteru_t;
                $scope.item.perawat_p = $scope.dataSelect.perawat_p;
                $scope.item.perawat_t = $scope.dataSelect.perawat_t;
                $scope.item.penunjang_p = $scope.dataSelect.penunjang_p;
                $scope.item.penunjang_t = $scope.dataSelect.penunjang_t;
                $scope.item.administrasi_p = $scope.dataSelect.administrasi_p;
                $scope.item.administrasi_t = $scope.dataSelect.administrasi_t;
                $scope.item.coas_p = $scope.dataSelect.coas_p;
                $scope.item.coas_t = $scope.dataSelect.coas_t;
                $scope.item.siswa_p = $scope.dataSelect.siswa_p;
                $scope.item.siswa_t = $scope.dataSelect.siswa_t;
                $scope.item.lain_p = $scope.dataSelect.lain_p;
                $scope.item.lain_t = $scope.dataSelect.lain_t;
                $scope.item.noruanganfk = { value: $scope.dataSelect.noruanganfk, text: $scope.dataSelect.namaruangan };
                
                $scope.dialogPopup.center().open()
                if (bool) {
                    $scope.isEdit = true
                    $scope.disabledText = true
                } else {
                    $scope.isEdit = false
                    $scope.disabledText = false
                }
            }
            $scope.klikGrid = function (current) {
                toastr.info(current.tanggal + " Terpilih");
                $scope.current = current;
                console.log(JSON.stringify($scope.current));
            }
            $scope.hapus = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var data = {
                    "norec":$scope.dataSelect.norec,
                }
                medifirstService.post('emr/batal-kepatuhan-cuci-tangan',data).then(function (e) {
                    loadData();
                    $scope.item = {}
                });
                 // medifirstService.post("emr/batal-kepatuhan-cuci-tangan", data).then(function (e) {
                 //        init();
                 //        $scope.item = {}
                 //    });
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
                    loadData();
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

            $scope.$watch('item.numerator', function(newValue, oldValue) {
                if (newValue != oldValue  ) {
                    var text = '';
                    var num = '';
                    var denom = '';
                    if ($scope.item.numerator == undefined ) {
                        text =  num + ' / '  + $scope.item.denominator + ' ' + ' x 100%' 
                    }else if($scope.item.denominator == undefined ) {
                        text =  $scope.item.numerator + ' / '  + denom + ' '  + ' x 100%' 
                    }else{
                        text =  $scope.item.numerator + ' / '  + $scope.item.denominator + ' '  + ' x 100%' 
                    }                    
                    $scope.item.formula = text
                }
            });

            $scope.$watch('item.denominator', function(newValue, oldValue) {
                if (newValue != oldValue  ) {
                    var text = $scope.item.numerator + ' / '  + $scope.item.denominator + 'x 100%'
                    $scope.item.formula = text
                }
            });

            //** BATAS SUCI */
        }
    ])
})