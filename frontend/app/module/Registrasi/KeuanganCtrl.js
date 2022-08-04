define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KeuanganCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService',
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
                        var objSave = {
                            "tglawal": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00'),
                            "tglakhir": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 23:59:59'),
                            "tgltransaksi": new moment($scope.item.tgltransaksi).format('YYYY/MM/DD'),
                            "token": token,
                            "kode": $scope.item.akun.kode,
                            "uraian": $scope.item.akun.uraian,
                            "jumlah": $scope.item.jumlah,                      
                        }
        
                        medifirstService.post('bridging/bios/post-penerimaan',objSave).then(function (e) {
                         
                            if(status == false){
                                $scope.cekPasienBios();
                            }
                            status = true               
                            $scope.isRouteLoading=false;                      
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        });                    
            }
            $scope.kirimpengeluaran = function () {
                var tempdata='';
                var status= false;
                $scope.isRouteLoading=true;
                        var objSave = {
                            "tglawal": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00'),
                            "tglakhir": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 23:59:59'),
                            "tgltransaksi": new moment($scope.item.tgltransaksi).format('YYYY/MM/DD'),
                            "token": token,
                            "kode": $scope.item.akun.kode,
                            "uraian": $scope.item.akun.uraian,
                            "jumlah": $scope.item.jumlah,                      
                        }
        
                        medifirstService.post('bridging/bios/post-pengeluaran',objSave).then(function (e) {
                         
                            if(status == false){
                                $scope.cekPasienBios();
                            }
                            status = true               
                            $scope.isRouteLoading=false;                      
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        });                    
            }

            $scope.kirimsaldo = function () {
                var tempdata='';
                var status= false;
                $scope.isRouteLoading=true;
                        var objSave = {
                            "tglawal": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 00:00:00'),
                            "tglakhir": new moment($scope.item.tgltransaksi).format('YYYY-MM-DD 23:59:59'),
                            "tgltransaksi": new moment($scope.item.tgltransaksi).format('YYYY/MM/DD'),
                            "token": token,
                            "kd_bank": $scope.item.bank.kode,
                            "kd_rekening": $scope.item.rekening.kode,
                            "norek": $scope.item.norek,
                            // "uraian": $scope.item.akun.uraian,
                            "saldo": $scope.item.saldo,   
                            "namabank": $scope.item.bank.uraian,
                            "rekening": $scope.item.rekening.uraian,

                        }
        
                        medifirstService.post('bridging/bios/post-saldo',objSave).then(function (e) {
                         
                            if(status == false){
                                $scope.cekPasienBios();
                            }
                            status = true               
                            $scope.isRouteLoading=false;                      
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        });                    
            }

            function init() {
                var objSave = {
                    "ruanganfz": "z",
                }        
                medifirstService.post('bridging/bios/get-token',objSave).then(function (e) {
                    token = e.data.token;
                    medifirstService.get("bridging/bios/get-listakun?token="+token, true).then(function (dat) {
                        $scope.listAkun = dat.data.data;
                     });
                     medifirstService.get("bridging/bios/get-listbank?token="+token, true).then(function (dat) {
                        $scope.listBank = dat.data.data;
                     });
                     medifirstService.get("bridging/bios/get-listrekening?token="+token, true).then(function (dat) {
                        $scope.listRekening = dat.data.data;
                     });
                    $scope.isRouteLoading=false;                                      
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
                // medifirstService.get("bridging/bios/get-listpenerimaan?token=".token, true).then(function (dat) {
                //     $scope.listAkun = dat.data.akun;
                //  });
            }
            init();
            $scope.formatTanggal = function(tanggal){
				return moment(tanggal).format('DD-MMM-YYYY');
			}
            $scope.cekPasienBios = function () {
                $scope.isRouteLoading = true;
                // token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZHNhdGtlciI6IjY0ODI2MSIsImlhdCI6MTYyNzU0OTczOCwiZXhwIjoxNjI3NjM2MTM4fQ.vPgSrkrynzbB1p2xAryvjSNuguw7BAEYiWKfFa9fgDA'
                medifirstService.get("bridging/bios/get-penerimaan?token=" + token + "&tgltransaksi=" + new moment($scope.item.tglpencarian).format('YYYY/MM/DD')).then(function (e) {
                    var x =0;
                    for (var i = 0; i < e.data.data.length; i++) {
                       x = x + parseFloat(e.data.data[i].jumlah)

                    }
                    $scope.item.totalpenerimaan = x;
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

                medifirstService.get("bridging/bios/get-pengeluaran?token=" + token + "&tgltransaksi=" + new moment($scope.item.tglpencarian).format('YYYY/MM/DD')).then(function (e) {
                      var x =0;
                    for (var i = 0; i < e.data.data.length; i++) {
                       x = x + parseFloat(e.data.data[i].jumlah)

                    }
                    $scope.item.totalpengeluaran = x;
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    $scope.dataDaftarPasienPulang2 = new kendo.data.DataSource({
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
                medifirstService.get("bridging/bios/get-saldo?token=" + token + "&tgltransaksi=" + new moment($scope.item.tglpencarian).format('YYYY/MM/DD')).then(function (e) {
                    debugger;
                      var x =0;
                    for (var i = 0; i < e.data.data.length; i++) {
                       x = x + parseFloat(e.data.data[i].saldo)

                    }
                    $scope.item.totalsaldo = x;
                    // document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading=false;
                    $scope.dataDaftarPasienPulang3 = new kendo.data.DataSource({
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
            $scope.formatRupiah = function (value, currency) {
                return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
					"field": "nm_akun",
					"title": "Kelas",
					"width":"80px",
					"template": "<span class='style-left'>#: nm_akun #</span>"
				},
				{
					"field": "jumlah",
					"title": "Jumlah",
					"width":"150px",
					// "template": "<span class='style-center'>#: jml_pasien #</span>"
                    "template": "<span class='style-right'>{{formatRupiah('#: jumlah #', '')}}</span>"

				},
				// {
				// 	"field": "jml_hari",
				// 	"title": "Jumlah Hari",
				// 	"width":"150px",
				// 	"template": "<span class='style-left'>#: jml_hari #</span>"
				// },

			]};
            $scope.columnDaftarPasienPulang3= {
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
					"field": "nm_bank",
					"title": "Bank",
					"width":"80px",
					"template": "<span class='style-left'>#: nm_bank #</span>"
				},
				{
					"field": "nm_rek",
					"title": "Nama Rekening",
					"width":"150px",
					"template": "<span class='style-center'>#: nm_rek #</span>"
				},
				{
					"field": "norek",
					"title": "No.Rekening",
					"width":"150px",
					"template": "<span class='style-left'>#: norek #</span>"
				},
				{
					"field": "saldo",
					"title": "Saldo",
					"width":"150px",
                    "template": "<span class='style-right'>{{formatRupiah('#: saldo #', '')}}</span>"
				},

			]
		};
        }
    ]);
});