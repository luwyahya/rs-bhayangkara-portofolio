define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SensusKeselamatanPasienCtrl', ['$q', '$scope', 'MedifirstService',
        function ($q, $scope, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.cari = {};
            $scope.now = new Date();
            var cookie = document.cookie.split(';');
            cookie = cookie[0].split('=');
            GetDataCombo();

            function GetDataCombo() {
                $scope.cari.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.cari.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    $scope.listJenisKeselamatan = e.data.jeniskeselamatan;
                    var dataDept = medifirstService.getMapLoginUserToRuangan();
                    $scope.listDepartemen = dataDept;
                    $scope.cari.Departemen = {objectdepartemenfk:dataDept[0].objectdepartemenfk, departemen:dataDept[0].departemen}
                    $scope.listKeselamatanInput = e.data.insidenkeselamtanpasien;
                    init();
                })
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.getCombojenisKeselamatan = function () {
                $scope.listKeselamatan = $scope.cari.jenisKeselamatan.keselamatan
            }

            $scope.getCombojenisKeselamatanIsi = function(){
                $scope.listKeselamatan = $scope.item.jenisKeselamatan.keselamatan
            }

            $scope.optionGridMaster = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarInsideKeselamatanPasien.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Inside KeselamatanP asien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tanggal", title: "Tgl Insiden", width: 95, "template": "<span class='style-right'>{{formatTanggal('#: tanggal #', '')}}</span>" },
                    { field: "jeniskeselamatan", title: "Jenis Keselamatan", width: 150 },
                    { field: "keselamatan", title: "Keselamatan", width: 200 },
                    { field: "departemen", title: "Departemen/Unit", width: 120 },
                    { field: "jumlah", title: "Jml Insiden", width: 100 },
                ]
            }

            $scope.cariFilter = function () {
                init()
            }

            function init() {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.cari.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.cari.tglAkhir).format('YYYY-MM-DD HH:mm');;

                var tempJenisKeselamatan = "";
                if ($scope.cari.jenisKeselamatan != undefined) {
                    tempJenisKeselamatan = "&idJenisKeselamatan=" + $scope.cari.jenisKeselamatan.id;
                }                
                var tempKeselamatanId = "";
                if ($scope.cari.Keselamatan != undefined) {
                    tempKeselamatanId = "&idKeselamatan=" + $scope.cari.Keselamatan.id;
                }

                var departemenId = "";
                if ($scope.cari.Departemen != undefined) {
                    departemenId = "&idDept=" + $scope.cari.Departemen.objectdepartemenfk;
                }
                          
                medifirstService.get("pmkp/get-data-insiden-keselamatan-pasien?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempJenisKeselamatan
                    + tempKeselamatanId + departemenId).then(function (data) {
                        $scope.isLoadingData = false;
                        var gridData = data.data.data;
                        for (var i = 0; i < gridData.length; i++) {
                            gridData[i].no = i + 1;
                        }                        
                        $scope.dataSource = new kendo.data.DataSource({
                            data: gridData,
                            pageSize: 10,
                            total: gridData.length,
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

            $scope.Tambah = function () {
                $scope.norec = undefined
                $scope.item = {}
                $scope.item.TglKejadian = moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.item.JmlInsiden = 1;
                $scope.dialogPopup.center().open()
            }

            $scope.clickedPopup = function () {
                $scope.dialogPopup.close();
            }

            $scope.Batal = function () {
                $scope.dialogPopup.close();
            }    
            
            $scope.klikGrid = function(dataSelect){
                if (dataSelect != undefined) {                    
                    $scope.dataSelect = dataSelect;
                }
            }

            $scope.Save = function () {
                var listRawRequired = [
                    "item.KeselamatanInput|k-ng-model|Jenis Keselamatan",
                    "item.KeselamatanInput|k-ng-model|Keselamatan",
                    "item.Departemen|k-ng-model|Departemen",
                    "item.TglKejadian|k-ng-model|Denumerator",
                    "item.JmlInsiden|ng-model|Jumlah Insiden",                    
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {                   
                    var data = {
                        "norec": $scope.norec != undefined ? $scope.norec : '',                        
                        "tanggal": moment($scope.item.TglKejadian).format('YYYY-MM-DD HH:mm'),
                        "departemenfk": $scope.item.Departemen.objectdepartemenfk,
                        "keselamatanfk": $scope.item.KeselamatanInput.id,                        
                        "jumlah": $scope.item.JmlInsiden,
                        "tgl": moment($scope.item.TglKejadian).format('YYYY-MM-DD'),                                                
                    }
                    medifirstService.post("pmkp/save-insiden-keselamatan-pasien", data).then(function (e) {
                        init();
                        $scope.item = {}
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }

            $scope.resetFilter = function () {
                $scope.cari = {};
                init()
            }

            $scope.hapus = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var data = {
                    "norec": $scope.dataSelect.norec,
                }

                medifirstService.post("pmkp/delete-insiden-keselamatan-pasien", data).then(function (e) {
                    init()
                    $scope.item = {}
                })
            }

            $scope.edit = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }     
                $scope.item = {};  
                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    $scope.listKeselamatan = e.data.datakeselamatan;
                    $scope.norec = $scope.dataSelect.norec
                    $scope.item.jenisKeselamatan = { id: $scope.dataSelect.jeniskesalamatanfk, jeniskeselamatan: $scope.dataSelect.jeniskeselamatan }
                    $scope.item.Keselamatan = { id: $scope.dataSelect.keselamatanfk, keselamatan: $scope.dataSelect.keselamatan }
                    $scope.item.Departemen =  { objectdepartemenfk: $scope.dataSelect.departemenfk, departemen: $scope.dataSelect.departemen }
                    $scope.item.TglKejadian = new Date($scope.dataSelect.tanggal)
                    $scope.item.JmlInsiden = parseFloat($scope.dataSelect.jumlah)
                    $scope.dialogPopup.center().open()
                })
            }

            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var data = {
                    "norec": dataItem.norec,
                }

                medifirstService.post("pmkp/delete-insiden-keselamatan-pasien", data).then(function (e) {
                    init()
                    $scope.item = {}
                })
            }

            function editRow(e) {
                e.preventDefault();
                $scope.item = {}
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.norec = dataItem.norec
                $scope.item.jenisKeselamatan = { id: dataItem.jeniskeselamatanfk, jeniskeselamatan: dataItem.jeniskeselamatan }
                $scope.item.Keselamatan = { id: dataItem.idkeselamatan, keselamatan: dataItem.keselamatan }
                $scope.item.Departemen =  { id: dataItem.departemenfk, namadepartemen: dataItem.namadepartemen }
                $scope.item.TglKejadian = new Date(dataItem.tanggal)
                $scope.item.jumlah = parseFloat(dataItem.jumlah)                
                $scope.dialogPopup.center().open()
            }

            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            //** BATAS SUCI */
        }
    ])
})