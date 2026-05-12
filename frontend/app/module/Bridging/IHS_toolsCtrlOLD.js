define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('IHS_toolsCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
        function ($rootScope, $scope, medifirstService, $window, $timeout) {
            $scope.item = {};
            $scope.isRouteLoading = false
            $scope.now = new Date()
            $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
            $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
            $scope.search = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Encounter'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        element.practice = ''
                        if (element.participant != undefined && element.participant[0].individual.reference) {
                            element.practice = element.participant[0].individual.display
                        }
                        if (element.period.start) {
                            element.period.start = moment(new Date(element.period.start)).format('YYYY-MM-DD HH:mm:ss')
                        }
                        if (element.period.end) {
                            element.period.end = moment(new Date(element.period.end)).format('YYYY-MM-DD HH:mm:ss')
                        } else {
                            element.period.end = ''
                        }
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.columnGrid = {
                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Encounter" />'
                            + '</div></div > '
                    }

                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Encounter",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "id",
                    "title": "ID",
                    "width": "100px"
                },
                {
                    "field": "period.start",
                    "title": "Period Start",
                    "width": "100px"
                },
                {
                    "field": "period.end",
                    "title": "Period End",
                    "width": "100px"
                },
                {
                    "field": "subject.display",
                    "title": "Subject Display",
                    "width": "200px"
                },
                {
                    "field": "subject.reference",
                    "title": "Subject Reff",
                    "width": "150px"
                },
                {
                    "field": "location[0].location.display",
                    "title": "Location",
                    "width": "150px"
                },
                {
                    "field": "practice",
                    "title": "Practitioner ",
                    "width": "150px"
                },
                {
                    "field": "class.display",
                    "title": "Class",
                    "width": "80px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },

                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHS,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };
            $scope.tutupJson = function () {
                $scope.popUpJson.close();
            }
            $scope.toolsIHSNakes = function (e) {
                $scope.isRouteLoading = true;
                if (e.ihs_id == null) return
                let data = {
                    "url": "Encounter/" + e.id,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            function hapusData(e) {

            }
            function editData(e) {

            }
            function sendIHS(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Encounter/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.search2 = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Condition'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                    }
                    $scope.dataSource2 = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.columnGrid2 = {
                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Condition" />'
                            + '</div></div > '
                    }


                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Condition",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                // {
                //     "field": "resourceType",
                //     "title": "Resource Type",
                //     "width": "100px"
                // },
                {
                    "field": "id",
                    "title": "ID",
                    "width": "100px"
                },
                {
                    "field": "subject.display",
                    "title": "Subject Display",
                    "width": "200px"
                },
                {
                    "field": "subject.reference",
                    "title": "Subject Reff",
                    "width": "150px"
                },
                {
                    "field": "encounter.reference",
                    "title": "Encounter",
                    "width": "100px"
                },

                {
                    "field": "code.coding[0].code",
                    "title": "Condition Code",
                    "width": "80px"
                },
                {
                    "field": "code.coding[0].display",
                    "title": "Condition Display",
                    "width": "80px"
                },
                {
                    "field": "category[0].coding[0].display",
                    "title": "Category",
                    "width": "80px"
                },

                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHS2,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };
            function sendIHS2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Condition/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.dataCheckbox = [{
                "id": 1, "name": "ID IHS"
            }, {
                "id": 2, "name": "NIK"
            }];
            $scope.item.tipe = $scope.dataCheckbox[1]
            $scope.findDataNakes = function () {
                $scope.isRouteLoading = true;
                let data = {}
                if ($scope.item.tipe.id == 1) {
                    data = {
                        "url": "Practitioner/" + $scope.item.data,
                        "method": "GET",
                        "data": null
                    }
                } else {
                    data = {
                        "url": "Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|" + $scope.item.data,
                        "method": "GET",
                        "data": null
                    }
                }

                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.findDataPasien = function () {
                $scope.isRouteLoading = true;
                let data = {}
                if ($scope.item.tipe.id == 1) {
                    data = {
                        "url": "Patient/" + $scope.item.data,
                        "method": "GET",
                        "data": null
                    }
                } else {
                    data = {
                        "url": "Patient?identifier=https://fhir.kemkes.go.id/id/nik|" + $scope.item.data,
                        "method": "GET",
                        "data": null
                    }
                }

                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("json2").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.searchMedication = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Medication'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        element.ingredient_text = ''
                        for (let u = 0; u < element.ingredient.length; u++) {
                            const element2 = element.ingredient[u];
                            element.ingredient_text = element.ingredient_text + ',' + (element2.itemCodeableConcept.coding[0].display + ' ' + element2.strength.numerator.value
                                + ' ' + element2.strength.numerator.code)
                        }
                        element.ingredient_text = element.ingredient_text.substring(1)
                    }
                    $scope.dataSourceMedication = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.columnGridMedication = {
                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Medication" />'
                            + '</div></div > '
                    }

                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Medication",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "id",
                    "title": "ID",
                    "width": "100px"
                },
                {
                    "field": "code.coding[0].display",
                    "title": "Display",
                    "width": "200px"
                },
                {
                    "field": "code.coding[0].code",
                    "title": "Kf+a Code",
                    "width": "200px"
                },
                {
                    "field": "form.coding[0].display",
                    "title": "Medication Form",
                    "width": "150px"
                },
                {
                    "field": "ingredient_text",
                    "title": "Ingredients",
                    "width": "100px"
                },

                {
                    "field": "batch.expirationDate",
                    "title": "Expire Date",
                    "width": "80px"
                },

                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSMedication,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSMedication(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Medication/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }


            $scope.searchMedicationRequest = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=MedicationRequest'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        // element.ingredient_text = ''
                        // for (let u = 0; u < element.ingredient.length; u++) {
                        //     const element2 = element.ingredient[u];
                        //     element.ingredient_text =  element.ingredient_text +','+ (element2.itemCodeableConcept.coding[0].display + ' ' +element2.strength.numerator.value
                        //     + ' ' +element2.strength.numerator.code)
                        // }
                        // element.ingredient_text =  element.ingredient_text.substring(1)
                    }
                    $scope.dataSourceMedicationRequest = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.columnGridMedicationRequest = {
                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.MedicationRequest" />'
                            + '</div></div > '
                    }

                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "MedicationRequest",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "id",
                    "title": "ID",
                    "width": "100px"
                },
                {
                    "field": "identifier[1].value",
                    "title": "Identifier",
                    "width": "100px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "statusReason.coding[0].display",
                    "title": "Status Reason",
                    "width": "150px"
                },
                {
                    "field": "medicationReference.display",
                    "title": "Medication Reference",
                    "width": "150px"
                },
                {
                    "field": "dosageInstruction[0].text",
                    "title": "Dosage Instruction",
                    "width": "150px"
                },
                {
                    "field": "dispenseRequest.quantity.value",
                    "title": "Qty Dispense",
                    "width": "100px"
                },
                {
                    "field": "dispenseRequest.quantity.unit",
                    "title": "Unit Dispense",
                    "width": "100px"
                },

                {
                    "field": "subject.display",
                    "title": "Patient",
                    "width": "150px"
                },
                {
                    "field": "requester.display",
                    "title": "Requester",
                    "width": "150px"
                },
                {
                    "field": "encounter.reference",
                    "title": "Encounter",
                    "width": "150px"
                },

                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSMedicationRequest,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSMedicationRequest(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "MedicationRequest/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }


            $scope.searchMedicationDispense = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=MedicationDispense'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        element.whenPrepared = moment(new Date(element.whenPrepared)).format("YYYY-MM-DD HH:mm")
                        element.whenHandedOver = moment(new Date(element.whenHandedOver)).format("YYYY-MM-DD HH:mm")

                        // element.ingredient_text = ''
                        // for (let u = 0; u < element.ingredient.length; u++) {
                        //     const element2 = element.ingredient[u];
                        //     element.ingredient_text =  element.ingredient_text +','+ (element2.itemCodeableConcept.coding[0].display + ' ' +element2.strength.numerator.value
                        //     + ' ' +element2.strength.numerator.code)
                        // }
                        // element.ingredient_text =  element.ingredient_text.substring(1)
                    }
                    $scope.dataSourceMedicationDispense = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.MedicationDispenseBebas', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "medicationReference.display"
                            , "performer[0].actor.display"
                            , "subject.display"
                        ]
                        , newValue, 'kGridMedicationDispense')
                }
            });
            $scope.$watch('item.MedicationRequest', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "medicationReference.display"
                            , "performer[0].actor.display"
                            , "subject.display"
                            , "identifier[1].value"
                        ]
                        , newValue, 'kGridMedicationRequest')
                }
            });
            $scope.$watch('item.Medication', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "code.coding[0].display"
                            , "code.coding[0].code"
                            , "form.coding[0].display"
                            , "ingredient_text"
                            , "batch.expirationDate"
                        ]
                        , newValue, 'kGridMedication')
                }
            });

            $scope.$watch('item.Condition', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "subject.display"
                            , "code.coding[0].display"
                            , "category[0].coding[0].display"
                        ]
                        , newValue, 'kGridCondition')
                }
            });


            $scope.$watch('item.Encounter', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "subject.display"
                            , "location[0].location.display"
                            , "class.display"
                            , "status",
                            , "practice"
                        ]
                        , newValue, 'kGridEncounter')
                }
            });

            $scope.columnGridMedicationDispense = {
                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.MedicationDispense" />'
                            + '</div></div > '
                    }

                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "MedicationDispense",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "id",
                    "title": "ID",
                    "width": "100px"
                },
                {
                    "field": "identifier[1].value",
                    "title": "Identifier",
                    "width": "100px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "medicationReference.display",
                    "title": "Medication Reference",
                    "width": "150px"
                },
                {
                    "field": "dosageInstruction[0].text",
                    "title": "Dosage Instruction",
                    "width": "150px"
                },
                {
                    "field": "quantity.value",
                    "title": "Qty ",
                    "width": "100px"
                },
                {
                    "field": "quantity.code",
                    "title": "Unit ",
                    "width": "100px"
                },
                {
                    "field": "whenPrepared",
                    "title": "Prepared ",
                    "width": "100px"
                },
                {
                    "field": "whenHandedOver",
                    "title": "Handed Over ",
                    "width": "100px"
                },
                {
                    "field": "subject.display",
                    "title": "Patient",
                    "width": "150px"
                },
                {
                    "field": "performer[0].actor.display",
                    "title": "Performer",
                    "width": "150px"
                },
                {
                    "field": "authorizingPrescription[0].reference",
                    "title": "Authorizing Prescription",
                    "width": "150px"
                },

                {
                    "field": "context.reference",
                    "title": "Encounter",
                    "width": "150px"
                },

                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSMedicationDispense,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSMedicationDispense(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "MedicationDispense/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.searchMedicationDispenseBebas = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Bundle'
                ).then(function (z) {
                    var datagrid = []
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const elementx = z.data[x];
                        for (let y = 0; y < elementx.request.entry.length; y++) {
                            const element = elementx.request.entry[y];
                            if (element.request.url == 'MedicationDispense') {

                                element.resource.no = datagrid.length + 1
                                element.resource.whenPrepared = moment(new Date(element.resource.whenPrepared)).format("YYYY-MM-DD HH:mm")
                                element.resource.whenHandedOver = moment(new Date(element.resource.whenHandedOver)).format("YYYY-MM-DD HH:mm")
                                element.resource.fullUrl = element.fullUrl
                                datagrid.push(element.resource)
                            }

                        }
                    }
                    $scope.dataSourceMedicationDispenseBebas = new kendo.data.DataSource({
                        data: datagrid,
                        pageSize: 10,
                        total: datagrid.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.MedicationDispenseBebas', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "medicationReference.display"
                            , "performer[0].actor.display"
                            , "subject.display"
                        ]
                        , newValue, 'kGridMedicationDispenseBebas')

                    // var data = []
                    // for (let index = 0; index < $scope.dataSourceMedicationDispenseBebas._data.length; index++) {
                    //     let element = $scope.dataSourceMedicationDispenseBebas._data[index];
                    //     if (element.medicationReference.display.match(newValue)) {
                    //         data.push(element)
                    //     } else if (element.performer[0].actor.display.match(newValue)) {
                    //         data.push(element)
                    //     } else if (element.subject.display.match(newValue)) {
                    //         data.push(element)
                    //     }
                    // }
                    // $scope.dataSourceMedicationDispenseBebas = new kendo.data.DataSource({
                    //     data: data,
                    //     pageSize: 10,
                    //     total: data.length,
                    //     serverPaging: false,
                    //     schema: {
                    //         model: {
                    //             fields: {
                    //             }
                    //         }
                    //     }

                    // });
                }
            });
            $scope.columnGridMedicationDispenseBebas = {

                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.MedicationDispenseBebas" />'
                            + '</div></div > '
                    }
                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "MedicationDispenseObatBebas",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "fullUrl",
                    "title": "fullUrl",
                    "width": "100px"
                },
                {
                    "field": "identifier[1].value",
                    "title": "Identifier",
                    "width": "140px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "medicationReference.display",
                    "title": "Medication ",
                    "width": "150px"
                },
                {
                    "field": "dosageInstruction[0].text",
                    "title": "Dosage Instruction",
                    "width": "150px"
                },
                {
                    "field": "quantity.value",
                    "title": "Qty ",
                    "width": "100px"
                },
                {
                    "field": "quantity.code",
                    "title": "Unit ",
                    "width": "100px"
                },
                {
                    "field": "whenPrepared",
                    "title": "Prepared ",
                    "width": "100px"
                },
                {
                    "field": "whenHandedOver",
                    "title": "Handed Over ",
                    "width": "100px"
                },
                {
                    "field": "subject.display",
                    "title": "Subject",
                    "width": "150px"
                },
                {
                    "field": "subject.reference",
                    "title": "Subject Reff",
                    "width": "150px"
                },
                {
                    "field": "performer[0].actor.display",
                    "title": "Performer",
                    "width": "150px"
                },
                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSMedicationDispenseBebas,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSMedicationDispenseBebas(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Bundle/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            function applyFilter(filterField, filterValue, gridID) {
                var dataGrid = $("#" + gridID).data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];
                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        for (let index = 0; index < filterField.length; index++) {
                            if (currentFilters[i].field == filterField[index]) {
                                currentFilters.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                for (let index = 0; index < filterField.length; index++) {
                    const element = filterField[index];
                    currentFilters.push({
                        field: element,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "or",
                    filters: currentFilters
                })
            }

            $scope.searchObservation = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Observation'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    var dataxx = []
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        element.value = element.valueQuantity.value + ' ' +element.valueQuantity.unit
                      
                        for (let x = 0; x < z.data.length; x++) {
                            const element = z.data[x];
                            element.no = x + 1
                            element.value = element.valueQuantity.value + ' ' +element.valueQuantity.unit

                            if(element.category[0].coding[0].code != 'laboratory'){
                                dataxx.push(element) 
                            }
                        }
                    }
                    $scope.dataSourceObservation = new kendo.data.DataSource({
                        data: dataxx,
                        pageSize: 10,
                        total: dataxx.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.Observation', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "category[0].coding[0].display"
                            , "value"
                            , "code.coding[0].display"
                            , "subject.display"
                        ]
                        , newValue
                        , 'kGridObservation')


                }
            });
            $scope.columnGridObservation = {

                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Observation" />'
                            + '</div></div > '
                    }
                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Observation",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "category[0].coding[0].display",
                    "title": "Category",
                    "width": "100px"
                },
                {
                    "field": "code.coding[0].code",
                    "title": "Coding Code",
                    "width": "140px"
                },
                {
                    "field": "code.coding[0].display",
                    "title": "Coding display",
                    "width": "140px"
                },
                {
                    "field": "code.coding[0].system",
                    "title": "Coding System",
                    "width": "140px"
                },
                {
                    "field": "value",
                    "title": "Value",
                    "width": "140px"
                },

                {
                    "field": "effectiveDateTime",
                    "title": "Effective Date Time",
                    "width": "100px"
                },
                {
                    "field": "subject.display",
                    "title": "Patient ",
                    "width": "150px"
                },
                {
                    "field": "encounter.display",
                    "title": "Encounter",
                    "width": "250px"
                },
                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSObservation,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSObservation(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Observation/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.searchProcedure = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Procedure'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        element.performedPeriod.start = moment(new Date(element.performedPeriod.start)).format('YYYY-MM-DD HH:mm')
                        element.performedPeriod.end = moment(new Date(element.performedPeriod.end)).format('YYYY-MM-DD HH:mm')
                    }
                    $scope.dataSourceProcedure = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.Procedure', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "note[0].display"
                            , "code.coding[0].display"
                            , "subject.display"
                            , "category.category"
                        ]
                        , newValue
                        , 'kGridProcedure')


                }
            });
            $scope.columnGridProcedure = {

                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Procedure" />'
                            + '</div></div > '
                    }
                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Procedure",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                {
                    "field": "category.category",
                    "title": "Category",
                    "width": "100px"
                },
                {
                    "field": "code.coding[0].code",
                    "title": "Coding Code",
                    "width": "140px"
                },
                {
                    "field": "code.coding[0].display",
                    "title": "Coding display",
                    "width": "140px"
                },
                {
                    "field": "code.coding[0].system",
                    "title": "Coding System",
                    "width": "140px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },

                {
                    "field": "performedPeriod.start",
                    "title": "Performed Period Start ",
                    "width": "100px"
                },
                {
                    "field": "performedPeriod.start",
                    "title": "Performed Period End ",
                    "width": "100px"
                },
                {
                    "field": "note[0].text",
                    "title": "Note ",
                    "width": "200px"
                },
                {
                    "field": "subject.display",
                    "title": "Patient ",
                    "width": "150px"
                },
                {
                    "field": "encounter.display",
                    "title": "Encounter",
                    "width": "250px"
                },
                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSProcedure,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSProcedure(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Procedure/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.searchComposition = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Composition'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        // element.performedPeriod.start = moment(new Date(element.performedPeriod.start)).format('YYYY-MM-DD HH:mm')
                        // element.performedPeriod.end = moment(new Date(element.performedPeriod.end)).format('YYYY-MM-DD HH:mm')
                    }
                    $scope.dataSourceComposition = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.Composition', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "section[0].text.div"
                            , "subject.display"
                            , "encounter.display"
                        ]
                        , newValue
                        , 'kGridComposition')


                }
            });
            $scope.columnGridComposition = {

                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Composition" />'
                            + '</div></div > '
                    }
                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Composition",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },
                
               
                {
                    "field": "date",
                    "title": "Date",
                    "width": "100px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },

               
                {
                    "field": "subject.display",
                    "title": "Patient ",
                    "width": "150px"
                },
                {
                    "field": "encounter.display",
                    "title": "Encounter",
                    "width": "250px"
                },
              
                {
                    "field": "section[0].code.coding[0].code",
                    "title": "Coding Code",
                    "width": "140px"
                },
                {
                    "field": "section[0].code.coding[0].display",
                    "title": "Coding display",
                    "width": "140px"
                },
                {
                    "field": "section[0].text.div",
                    "title": "Text Description",
                    "width": "250px"
                },
                {
                    "field": "author[0].display",
                    "title": "Author ",
                    "width": "150px"
                },
                {
                    "command": [
                        //     {
                        //     text: "Hapus",
                        //     click: hapusData,
                        //     imageClass: "k-icon k-delete"
                        // }, {
                        //     text: "Edit",
                        //     click: editData,
                        //     imageClass: "k-icon k-i-pencil"
                        // },
                        {
                            text: "IHS",
                            click: sendIHSComposition,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSComposition(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Composition/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            //servicerequest
            $scope.searchServiceRequest = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=ServiceRequest'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        // element.performedPeriod.start = moment(new Date(element.performedPeriod.start)).format('YYYY-MM-DD HH:mm')
                        // element.performedPeriod.end = moment(new Date(element.performedPeriod.end)).format('YYYY-MM-DD HH:mm')
                    }
                    $scope.dataSourceServiceRequest = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.ServiceRequest', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "encounter.display"
                            , "subject.display"
                          
                        ]
                        , newValue
                        , 'kGridServiceRequest')


                }
            });
            $scope.columnGridServiceRequest = {

                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.ServiceRequest" />'
                            + '</div></div > '
                    }
                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "ServiceRequest",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },
                
               
                {
                    "field": "authoredOn",
                    "title": "Authored On",
                    "width": "100px"
                },
                {
                    "field": "intent",
                    "title": "Intent",
                    "width": "100px"
                },

               
                {
                    "field": "subject.display",
                    "title": "Patient ",
                    "width": "150px"
                },
                {
                    "field": "encounter.display",
                    "title": "Encounter",
                    "width": "250px"
                },
              
                {
                    "field": "code.coding[0].code",
                    "title": "Coding Code",
                    "width": "140px"
                },
                {
                    "field": "code.coding[0].display",
                    "title": "Coding display",
                    "width": "140px"
                },
                {
                    "field": "requester.display",
                    "title": "Requester",
                    "width": "250px"
                },
                
                {
                    "command": [
                      
                        {
                            text: "IHS",
                            click: sendIHSServiceRequest,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSServiceRequest(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "ServiceRequest/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            //ed

               //Specimen
               $scope.searchSpecimen = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/ihs/get-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                    + '&resourcetype=Specimen'
                ).then(function (z) {
                    $scope.isRouteLoading = false
                    for (let x = 0; x < z.data.length; x++) {
                        const element = z.data[x];
                        element.no = x + 1
                        // element.performedPeriod.start = moment(new Date(element.performedPeriod.start)).format('YYYY-MM-DD HH:mm')
                        // element.performedPeriod.end = moment(new Date(element.performedPeriod.end)).format('YYYY-MM-DD HH:mm')
                    }
                    $scope.dataSourceSpecimen = new kendo.data.DataSource({
                        data: z.data,
                        pageSize: 10,
                        total: z.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })


            }
            $scope.$watch('item.Specimen', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    applyFilter(
                        [
                            "encounter.display"
                            , "subject.display"
                          
                        ]
                        , newValue
                        , 'kGridSpecimen')


                }
            });
            $scope.columnGridSpecimen = {

                toolbar: [
                    // "excel",
                    {
                        name: "ads",
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src",
                        text: "src",
                        template: '<div class="grid_4" '
                            + 'style="margin-top: -8px;">'
                            + '<div class= "grid_2" style="margin-top: 10px;" >'
                            + '<label c-label item="item" c-label-text="Search">'
                            + '</label></div> <div class="grid_10">'
                            + '<input c-text-box type="input"'
                            + 'class="k-textbox" ng-model="item.Specimen" />'
                            + '</div></div > '
                    }
                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Specimen",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },
                
               
                {
                    "field": "receivedTime",
                    "title": "Received Time",
                    "width": "100px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },

               
                {
                    "field": "subject.display",
                    "title": "Patient ",
                    "width": "150px"
                },
               
                {
                    "field": "type.coding[0].code",
                    "title": "Coding Code",
                    "width": "140px"
                },
                {
                    "field": "type.coding[0].display",
                    "title": "Coding display",
                    "width": "140px"
                },
               
                
                {
                    "command": [
                      
                        {
                            text: "IHS",
                            click: sendIHSSpecimen,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };

            function sendIHSSpecimen(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Specimen/" + dataItem.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            //ed


                  //Specimen
                  $scope.searchObservationLab = function () {
                    $scope.isRouteLoading = true
                    medifirstService.get('bridging/ihs/get-list?dari=' +
                        moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                        + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                        + '&resourcetype=Observation'
                    ).then(function (z) {
                        $scope.isRouteLoading = false
                        var dataxx = []
                        for (let x = 0; x < z.data.length; x++) {
                            const element = z.data[x];
                            element.no = x + 1
                            element.value = element.valueQuantity.value + ' ' +element.valueQuantity.unit

                            if(element.category[0].coding[0].code == 'laboratory'){
                                dataxx.push(element) 
                            }
                        }
                        $scope.dataSourceObservationLab = new kendo.data.DataSource({
                            data: dataxx,
                            pageSize: 10,
                            total: dataxx.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
    
                        });
                    })
    
    
                }
                $scope.$watch('item.ObservationLab', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        applyFilter(
                            [
                                "category[0].coding[0].display"
                            , "value"
                            , "code.coding[0].display"
                            , "subject.display"
                              
                            ]
                            , newValue
                            , 'kGridObservationLab')
    
    
                    }
                });
                $scope.columnGridObservationLab = {
    
                    toolbar: [
                        // "excel",
                        {
                            name: "ads",
                            text: "asd",
                            template: '<div class="grid_8"></div>'
                        },
                        {
                            name: "src",
                            text: "src",
                            template: '<div class="grid_4" '
                                + 'style="margin-top: -8px;">'
                                + '<div class= "grid_2" style="margin-top: 10px;" >'
                                + '<label c-label item="item" c-label-text="Search">'
                                + '</label></div> <div class="grid_10">'
                                + '<input c-text-box type="input"'
                                + 'class="k-textbox" ng-model="item.ObservationLab" />'
                                + '</div></div > '
                        }
                    ],
                    excel: {
                        fileName: "List.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:K1"];
                        sheet.name = "List";
    
                        var myHeaders = [{
                            value: "ObservationLab",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
    
                        }];
    
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    },
                    pageable: true,
                    sortable: true,
                    resizable: true,
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "23px",
                        "attributes": { align: "center" }
    
                    },
    
                    {
                        "field": "category[0].coding[0].display",
                        "title": "Category",
                        "width": "100px"
                    },
                    {
                        "field": "code.coding[0].code",
                        "title": "Coding Code",
                        "width": "140px"
                    },
                    {
                        "field": "code.coding[0].display",
                        "title": "Coding display",
                        "width": "140px"
                    },
                    {
                        "field": "code.coding[0].system",
                        "title": "Coding System",
                        "width": "140px"
                    },
                    {
                        "field": "value",
                        "title": "Value",
                        "width": "140px"
                    },
    
                    {
                        "field": "effectiveDateTime",
                        "title": "Effective Date Time",
                        "width": "100px"
                    },
                    {
                        "field": "subject.display",
                        "title": "Patient ",
                        "width": "150px"
                    },
                    {
                        "field": "encounter.display",
                        "title": "Encounter",
                        "width": "250px"
                    },
                   
                    
                    {
                        "command": [
                          
                            {
                                text: "IHS",
                                click: sendIHSObservationLab,
                                imageClass: " fa fa-check"
                            }],
                        title: "",
                        width: "80px",
                    }
    
                    ]
                };
    
                function sendIHSObservationLab(e) {
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    let data = {
                        "url": "Observation/" + dataItem.id,
                        "method": "GET",
                        "data": null
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                        document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                        $scope.isRouteLoading = false;
                        $scope.popUpJson.center().open().maximize();
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
                }


                 //Specimen
                 $scope.searchDiagnosticReport = function () {
                    $scope.isRouteLoading = true
                    medifirstService.get('bridging/ihs/get-list?dari=' +
                        moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                        + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')
                        + '&resourcetype=DiagnosticReport'
                    ).then(function (z) {
                        $scope.isRouteLoading = false
                        var dataxx = []
                        for (let x = 0; x < z.data.length; x++) {
                            const element = z.data[x];
                            element.no = x + 1
                           
                        }
                        $scope.dataSourceDiagnosticReport = new kendo.data.DataSource({
                            data: z.data,
                            pageSize: 10,
                            total: z.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
    
                        });
                    })
    
    
                }
                $scope.$watch('item.DiagnosticReport', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        applyFilter(
                            [
                                "category[0].coding[0].display"
                            , "value"
                            , "code.coding[0].display"
                            , "subject.display"
                              
                            ]
                            , newValue
                            , 'kGridDiagnosticReport')
    
    
                    }
                });
                $scope.columnGridDiagnosticReport = {
    
                    toolbar: [
                        // "excel",
                        {
                            name: "ads",
                            text: "asd",
                            template: '<div class="grid_8"></div>'
                        },
                        {
                            name: "src",
                            text: "src",
                            template: '<div class="grid_4" '
                                + 'style="margin-top: -8px;">'
                                + '<div class= "grid_2" style="margin-top: 10px;" >'
                                + '<label c-label item="item" c-label-text="Search">'
                                + '</label></div> <div class="grid_10">'
                                + '<input c-text-box type="input"'
                                + 'class="k-textbox" ng-model="item.DiagnosticReport" />'
                                + '</div></div > '
                        }
                    ],
                    excel: {
                        fileName: "List.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:K1"];
                        sheet.name = "List";
    
                        var myHeaders = [{
                            value: "DiagnosticReport",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
    
                        }];
    
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    },
                    pageable: true,
                    sortable: true,
                    resizable: true,
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "23px",
                        "attributes": { align: "center" }
    
                    },
                    {
                        "field": "resourceType",
                        "title": "Type",
                        "width": "100px"
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "100px"
                    },
                    {
                        "field": "code.coding[0].code",
                        "title": "Coding Code",
                        "width": "140px"
                    },
                    {
                        "field": "code.coding[0].display",
                        "title": "Coding display",
                        "width": "140px"
                    },
                    {
                        "field": "subject.display",
                        "title": "Patient",
                        "width": "200px"
                    },
                  
    
                    {
                        "field": "issued",
                        "title": "Issued",
                        "width": "100px"
                    },
                    {
                        "field": "conclusionCode[0].coding[0].display",
                        "title": "Conclusion ",
                        "width": "150px"
                    },
                   
                    {
                        "field": "basedOn[0].reference",
                        "title": "Based On ",
                        "width": "150px"
                    },
                   
                    
                    {
                        "command": [
                          
                            {
                                text: "IHS",
                                click: sendIHSDiagnosticReport,
                                imageClass: " fa fa-check"
                            }],
                        title: "",
                        width: "80px",
                    }
    
                    ]
                };
    
                function sendIHSDiagnosticReport(e) {
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    let data = {
                        "url": "DiagnosticReport/" + dataItem.id,
                        "method": "GET",
                        "data": null
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                        document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                        $scope.isRouteLoading = false;
                        $scope.popUpJson.center().open().maximize();
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
                }
                $scope.post = function (resourceType) {
                  
                    sendata(resourceType)
                }
                async function sendata(resourceType){
                    var data = {}
                    if(resourceType == 'Encounter'){
                        data = {
                            "noregistrasi": "2302000805"
                        }
                    }
                    $scope.isRouteLoading = true;
                    await medifirstService.get('bridging/ihs/'+resourceType+'-list?dari=' +
                    moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                    + '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')).then(async function (x) {
                      $scope.isRouteLoading = false;
                     for (let d = 0; d < x.data.length; d++) {
                        const element =  x.data[d]
                        var json = {
                            'noregistrasi' :element.noregistrasi
                        }
                        await sendSATUSEHAT(resourceType,json)
                     }
                    })
                }
                async function sendSATUSEHAT(resourceType, data) {
                    $scope.isRouteLoading = true;
                    await medifirstService.postNonMessage("bridging/ihs/"+resourceType, data).then(function (e) {
                        document.getElementById("json_post").innerHTML = JSON.stringify(e.data, undefined, 4);
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
                }
                //ed
        }
    ]);
});

