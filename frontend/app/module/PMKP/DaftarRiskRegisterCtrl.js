define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRiskRegisterCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.tglMeninggal = '';
            var norecInsiden = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }            
            loadCombo();
            loadFirst();
            loadData();

            function loadCombo() {   
                var dataDept = medifirstService.getMapLoginUserToRuangan();
                $scope.listDepartemen = dataDept;            
            }
            
            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarRiskRegisterCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }                        
            
            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');                   
                var idDept = ''
                if ($scope.item.UnitKerja != undefined) {
                    idDept = "&idDept=" + $scope.item.UnitKerja.id
                }
                medifirstService.get("pmkp/get-data-risk-register?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    idDept).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i+1                    
                        }                       
                        $scope.dataSourceGrid = new kendo.data.DataSource({
							data: doto,
							// group: $scope.group,
							pageSize: 50,
							total: doto.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										// jumlah: { type: "number" }
									}
								}
							},
							aggregate: [
								// { field: 'jumlah', aggregate: 'sum' },
							]
						})                        
                    });
            };

            $scope.SearchData = function(){
                loadData();
            }
            
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarIdentifikasiRisiko.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Laporan Identifikasi Risiko",
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
                    {
                        "field": "no",
                        "title": "No",
                        "width": "60px",
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                    },
                    {
                        "field": "kategoryrisiko",
                        "title": "Kategory Risiko",
                        "width": "220px",
                    },
                    {
                        "field": "jenisrisiko",
                        "title": "Jenis Risiko",
                        "width": "220px",
                    },                            
                    {
                        "field": "deskripsirisiko",
                        "title": "Deskripsi Risiko",
                        "width": "120px",
                    },
                    {
                        "field": "kemungkinan",
                        "title": "Kemungkinan",
                        "width": "120px",
                    },
                    {
                        "field": "penyebab",
                        "title": "Penyebab",
                        "width": "120px",
                    },
                ]
            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                  $scope.dataPasienSelected = dataPasienSelected;
                }
            }            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            
            $scope.editData = function(){
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'EditRisk',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('RiskRegisterCtrl', chacePeriode);
                $state.go('RiskRegister', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'EditRisk'
                });
            }

            $scope.hapusData = function () {                
                if ($scope.dataPasienSelected.lk_norec != undefined) {
                    messageContainer.error("Insiden Telah Ditindaklanjuti Tidak Bisa Dihapus!")
                    return
                }

                if ($scope.dataPasienSelected != undefined) {
                    var item = {
                        norec: $scope.dataPasienSelected.norec
                    }

                    medifirstService.post('pmkp/hapus-data-risk-register', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.Lanjut = function(){
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'TindakLanjut',
                    2: $scope.dataPasienSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('RiskRegisterCtrl', chacePeriode);
                $state.go('RiskRegister', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.tambahData = function(){
                $state.go('IdentifikasiRisiko', {});
            }
            //** BATAS SUCI */                    
        }
    ]);
});