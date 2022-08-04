define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KesehatanCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $state, DateHelper, medifirstService) {
            $scope.isRouteLoading = true;
            $scope.clear = function () {
                $scope.item = {};
                $scope.item.identitas = $scope.dataCheckbox[0];
                $scope.isRouteLoading = false;
            };
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            var token = '';
            $scope.dataCheckbox = [{
                "id": 1, "name": "No Kartu"
            }, {
                "id": 2, "name": "NIK"
            }];
            $scope.clear();
            $scope.findData = function () {
                $scope.cekPasienBios();
            }
            
            $scope.kirim = function () {
                var tempdata='';
                var status= false;
                $scope.isRouteLoading=true;
                medifirstService.get("bridging/bios/get-kesehatanrskirim?tglawal=" + new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00') + "&tglakhir=" + new moment($scope.item.tgltransaksi2).format('YYYY-MM-DD 23:59:59')).then(function (e) {
                    // debugger;
                    tempdata =  e.data;
                    for (var i = tempdata.length - 1; i >= 0; i--) {
                        var objSave = {
                            "tglawal": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00'),
                            "tglakhir": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 23:59:59'),
                            "tgltransaksi": new moment($scope.item.tgltransaksi).format('YYYY/MM/DD'),
                            "token": token,
                            "kelas": tempdata[i].kode,
                            "jmlpasien": tempdata[i].jml_pasien,                      
                        }
        
                        medifirstService.post('bridging/bios/post-ranap',objSave).then(function (e) {
                        debugger; 
                            if(status == false){
                                panggildata();
                            }
                            status = true               
                            $scope.isRouteLoading=false;                      
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        });
                    }
                    
                })
                
                
                
    
            }
            function panggildata(){
                medifirstService.get("bridging/bios/get-kesehatan?token=" + token + "&tgltransaksi=" + new moment($scope.item.tgltransaksi2).format('YYYY/MM/DD')).then(function (e) {
                    debugger;
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                                  data: e.data.data,
                                  // pageSize: 10,
                                  total:e.data,
                                  serverPaging: false,
                                  schema: {
                                      model: {
                                          fields: {
                                          }
                                      }
                                  }
                    });
                  
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            function init() {
                var objSave = {
                    "ruanganfk": "z",
                }
                
                medifirstService.post('bridging/bios/get-token',objSave).then(function (e) {

                debugger;
                    token = e.data.token;
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    
                  
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            init();
            $scope.formatTanggal = function(tanggal){
				return moment(tanggal).format('DD-MMM-YYYY');
			}
            $scope.cekPasienBios = function () {
                $scope.isRouteLoading = true;
                // token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZHNhdGtlciI6IjY0ODI2MSIsImlhdCI6MTYyNzU0OTczOCwiZXhwIjoxNjI3NjM2MTM4fQ.vPgSrkrynzbB1p2xAryvjSNuguw7BAEYiWKfFa9fgDA'
                medifirstService.get("bridging/bios/get-kesehatan?token=" + token + "&tgltransaksi=" + new moment($scope.item.tgltransaksi2).format('YYYY/MM/DD')).then(function (e) {
                    
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                                  data: e.data.data,
                                  // pageSize: 10,
                                  total:e.data,
                                  serverPaging: false,
                                  schema: {
                                      model: {
                                          fields: {
                                          }
                                      }
                                  }
                    });
                  
                }).then(function () {
                    $scope.isRouteLoading = false;
                });

                medifirstService.get("bridging/bios/get-kesehatanrs?tglawal=" + new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00') + "&tglakhir=" + new moment($scope.item.tgltransaksi2).format('YYYY-MM-DD 23:59:59')).then(function (e) {
                    debugger;
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    $scope.dataDaftarPasienPulang2 = new kendo.data.DataSource({
                                  data: e.data,
                                  // pageSize: 10,
                                  total:e.data,
                                  serverPaging: false,
                                  schema: {
                                      model: {
                                          fields: {
                                          }
                                      }
                                  }
                    });
                  
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.columnDaftarPasienPulang = {
				toolbar: [
					"excel",
					
					],
					excel: {
						fileName: "DataBios.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:M1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Data Bios",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				pageable: true,
				// dataBound: onDataBound,
	            columns:
	            [

				{
					"field": "tgl_transaksi",
					"title": "Tgl Transaksi",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tgl_transaksi #')}}</span>"
				},
				{
					"field": "nm_kelas",
					"title": "Kelas",
					"width":"80px",
					"template": "<span class='style-left'>#: nm_kelas #</span>"
				},
				{
					"field": "jml_pasien",
					"title": "Jumlah Pasien",
					"width":"150px",
					"template": "<span class='style-center'>#: jml_pasien #</span>"
				},
				{
					"field": "jml_hari",
					"title": "Jumlah Hari",
					"width":"150px",
					"template": "<span class='style-left'>#: jml_hari #</span>"
				},

			]};
            $scope.verifikasigrid = function (dataPasienSelected) {
                var namakelas =  dataPasienSelected.namakelas;
                medifirstService.get("bridging/bios/get-kesehatanrsdetail?tglawal=" + new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00') + "&tglakhir=" + new moment($scope.item.tgltransaksi2).format('YYYY-MM-DD 23:59:59')+"&namakelas="+namakelas).then(function (e) {
                    debugger;
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    $scope.dataDaftarPasienPulangdetail = new kendo.data.DataSource({
                                  data: e.data,
                                  // pageSize: 10,
                                  total:e.data,
                                  serverPaging: false,
                                  schema: {
                                      model: {
                                          fields: {
                                          }
                                      }
                                  }
                    });
                  
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            
                $scope.popupinacbg.center().open();
         

            }
            $scope.columnDaftarPasienPulang2= {
				toolbar: [
					"excel",
					
					],
					excel: {
						fileName: "DataBios.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:M1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Data Bios",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				pageable: true,
				// dataBound: onDataBound,
	            columns:
	            [

				{
					"field": "tgl_transaksi",
					"title": "Tgl Transaksi",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tgl_transaksi #')}}</span>"
				},
				{
					"field": "namakelas",
					"title": "Kelas",
					"width":"80px",
					"template": "<span class='style-left'>#: namakelas #</span>"
				},
				{
					"field": "jml_pasien",
					"title": "Jumlah Pasien",
					"width":"150px",
					// "template": "<span class='style-center'>#: jml_pasien #</span>",
                    "template": "<button  class=\"button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  jml_pasien #</button> ",

				},
				{
					"field": "jml_hari",
					"title": "Jumlah Hari",
					"width":"150px",
					"template": "<span class='style-left'>#: jml_hari #</span>"
				},

			]
		};
        $scope.columnDaftarPasienPulangdetail= {
				toolbar: [
					"excel",
					
					],
					excel: {
						fileName: "DataBios.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:M1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Data Bios",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				pageable: true,
				// dataBound: onDataBound,
	            columns:
	            [

				{
					"field": "namakelas",
					"title": "Kelas",
					"width":"80px",
					"template": "<span class='style-left'>#: namakelas #</span>"
				},
				{
					"field": "tglinsertsensus",
					"title": "Tgl Sensus",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglinsertsensus #')}}</span>"
				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width":"150px",
					"template": "<span class='style-left'>#: namaruangan #</span>"
				},
				{
					"field": "nocm",
					"title": "No CM",
					"width":"150px",
					"template": "<span class='style-left'>#: nocm #</span>"
				},
				{
					"field": "namapasien",
					"title": "Nama Pasien",
					"width":"150px",
					"template": "<span class='style-left'>#: namapasien #</span>"
				},
				{
					"field": "noregistrasi",
					"title": "No.Registrasi",
					"width":"150px",
					"template": "<span class='style-left'>#: noregistrasi #</span>"
				},

			]
		};
        }
    ]);
});