define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarLembarKerjaInvestigasiCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }            
            loadCombo();
            loadFirst();
            loadData();

            function loadCombo() {
                medifirstService.get("pmkp/get-data-combo-pmkp")
                    .then(function (data) {                        
                        $scope.KelompokUser = medifirstService.getKelompokUser();
                        $scope.PegawaiLogin = medifirstService.getPegawaiLogin();
                        var datas = data.data;    //get-datacombo-ruangan                    
                        if (datas.kdUser == $scope.KelompokUser) {
                            $scope.showFilter = true;                            
                            medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                                $scope.listRuangan = data;
                            });
                        } else {
                            $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                        }
                    })
            }
            
            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarLembarKerjaInvestigasiCtrl');
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

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.item.ruangan.id
                }

                // var UsrPelapor = ""
                // if ($scope.PegawaiLogin != undefined) {
                //     UsrPelapor = "&idPelapor=" + $scope.PegawaiLogin.id
                // }
               
                medifirstService.get("pmkp/get-lembar-kerja-investigasi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + namaruangan).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i+1 

                            if (doto[i].investigasilengkap != ""){
                                doto[i].statusinvestigasi = 'Terverifikasi'
                            }else {
                                doto[i].statusinvestigasi = '-'
                            }                   
                        }                       
                        $scope.dataSourceGrid = new kendo.data.DataSource({
							data: doto,
							group: $scope.group,
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
            
            $scope.group = {
                field: "jeniskeselamatan",
                aggregates: [{
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }, {
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }]
            };
            $scope.aggregate = [{
                field: "jeniskeselamatan",
                aggregate: "count"
            }, {
                field: "jeniskeselamatan",
                aggregate: "count"
            }]
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == 'Terverifikasi') { $(this).addClass('green') }
                    if ($(this).text() == '-') { $(this).addClass('koneng') }
                })
            }
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarLembarInvestigasiSederhana.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Lembar Investigasi Sederhana",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                columns: [   
                    {
                        "field": "no",
                        "title": "No",
                        "width": "40px",
                    },
                    {
                        "field": "tanggalmulai",
                        "title": "Tgl Mulai",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggalmulai #')}}</span>"
                    },
                    {
                        "field": "tanggalakhir",
                        "title": "Tgl Selesai",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggalakhir #')}}</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "125px"
                    },
                    {
                        "field": "pembuatlaporan",
                        "title": "Pelapor",
                        "width": "125px"
                    },              
                    {
                        "field": "penyebabinsidenlangsung",
                        "title": "Penyebab Insiden",
                        "width": "220px",
                    },
                    {
                        "field": "latarbelakanginsiden",
                        "title": "Latar Belakang Insiden",
                        "width": "220px",
                    }, 
                    {
                        "field": "statusinvestigasi",
                        "title": "Status Investigasi",
                        "width": "80px",
                    },                    
                    {
                        hidden: true,
                        field: "jeniskeselamatan",
                        title: "Jenis Keselamatan",
                        aggregates: ["count"],
                        // groupHeaderTemplate: "Tindakan #= value # (Jumlah: #= count#)"
                    }
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
                    1: 'EditLembar',
                    2: $scope.dataPasienSelected.noreclki,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('LembarKerjaInvestigasiSederhanaCtrl', chacePeriode);
                $state.go('LembarKerjaInvestigasiSederhana', {
                    kpid: $scope.dataPasienSelected.norec,
                    noreclki: $scope.dataPasienSelected.noreclki,
                    noOrder: 'EditLembar'
                });
            }

            $scope.hapusData = function () {
                if ($scope.dataPasienSelected != undefined) {
                    var item = {
                        norec: $scope.dataPasienSelected.noreclki
                    }

                    medifirstService.post('pmkp/delete-data-lembar-investigasi', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.cetakHasil = function(){

            }

            $scope.tambahData = function(){
                $state.go('LembarKerjaInvestigasiSederhana', {});
            }
            //** BATAS SUCI */                    
        }
    ]);
});