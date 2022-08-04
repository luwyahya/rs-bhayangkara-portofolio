define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('UjiSWABCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', '$state','ManageLogistikPhp','$mdDialog',
		function($rootScope, $scope, ModelItem, DateHelper, $state, manageLogistikPhp, $mdDialog) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.waktuMulai =  $scope.now;
			$scope.item.waktuSelesai =  $scope.now;
			$scope.dataVOloaded = true;
			var init = function () {
				manageLogistikPhp.getDataTableTransaksi("cssd-uji-swap/detail-uji-swap/?strukPelayananId="+$state.params.strukPelayananId).then(function(dat){				
					$scope.dataHeader = dat.data.header;
					$scope.dataGrid = dat.data.detail;
					$scope.item.noOrder = $scope.dataHeader.noorder;
					$scope.item.ruanganAsal = $scope.dataHeader.namaruangan;
					$scope.item.ruanganTujuan = $scope.dataHeader.ruangantujuan;
					$scope.item.petugas = $scope.dataHeader.objectpegawaiorderfk;
					var tanggal = new Date($scope.now);
					var jamMulai = new Date($scope.item.waktuMulai);
					var jamSelesai = new Date($scope.item.waktuSelesai);
					if ($scope.dataHeader.jammasukujiswab == "" || $scope.dataHeader.jammasukujiswab == "-") {
						$scope.item.jamMulai = $scope.dataHeader.jammasukujiswab;
						$scope.item.jamSelesai = $scope.dataHeader.jamkeluarujiswab;
					} else {
						$scope.item.waktuMulai = jamMulai;
						$scope.item.waktuSelesai = jamSelesai;
					}

					if ($scope.dataHeader.tanggalujiswab == "" || $scope.dataHeader.tanggalujiswab == "-") {
						$scope.item.tanggal = new Date();
					} else {
						$scope.item.tanggal = tanggal;
					}
					var produkUjiSwab = [];
					$scope.dataGrid.forEach(function(data){
	                    if (data.kualitashasil == "-" || data.kualitashasil == "" || data.kualitashasil == undefined){
	                        var listData = {
	                            "kualitashasil":{
	                                "name":"",
	                                "id":""
	                            },
	                            "namaproduk": data.namaproduk,
	                            "qty": data.qty,
	                            "jumlahbakteri": data.jumlahbakteri,
	                            // "status": data.status,
	                            "produkid": data.produkid,
	                            "norec": data.norec
	                        }  
	                        produkUjiSwab.push(listData);
	                    } else {
	                        var listData = {
	                            "kualitashasil":{
	                                "name":data.kualitashasil,
	                                "id":""
	                            },
	                            "namaproduk": data.namaproduk,
	                            "qty": data.qty,
	                            "jumlahbakteri": data.jumlahbakteri,
	                            // "status": data.status,
	                            "produkid": data.produkid,
	                            "norec": data.norec
	                        }  
	                        produkUjiSwab.push(listData);
	                    }
	                });
	          
					$scope.dataSource = new kendo.data.DataSource({
						pageSize: 10,
						data: produkUjiSwab,
						batch: true,
						schema: {
							model: {
								id: "produkid",
								fields: {
									produkid: { editable: false, nullable: true },
									namaproduk: { editable: false },
									qty: { editable: false },
									kualitashasil: {editable: true},
									jumlahbakteri: { type: "number", validation: { min: 0, required: true } },
									status: { type: "boolean", editable: false},

								}
							}
						}
					});
				});
			};
			init();
			$scope.dataUjiSWAB = [];
			$scope.item.tanggal = new Date();
			$scope.status = [
			{"status":"TRUE"},
			{"status":"FALSE"}
			]
			$scope.kualitashasil = [
            {"id":1, "name":"PASS"},
            {"id":2, "name":"FAIL"}
            ]

            $scope.dropDownHasil = function(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: false,
                        dataTextField: "name",
                        dataValueField: "id",
                        dataSource: $scope.kualitashasil
                    });
            }
			$scope.gridUjiSWAB = { 
				pageable: true,
				toolbar: ["cancel"],
				columns: [
				{ field:"namaproduk", title:"<center>Nama Alat", width: 120},
				{ field:"qty",title:"<center>Quantity", width: 120},
				{ field:"kualitashasil",title:"<center>Hasil", width: 120, editor: $scope.dropDownHasil, template: "#=kualitashasil.name#"},
				{ field:"jumlahbakteri",title:"<center>Jumlah Bakteri", width: 100}
				],
				editable: true
			};

			$scope.batal = function(){
				$state.go('DaftarPenerimaanSterilisasiAlat');
			}
			
			$scope.simpan = function () {
				var dataGridNew = [];
				for (var i=0;i<$scope.dataGrid.length;i++) {
					var dataTemp =
					{
						"produk":$scope.dataSource._data[i].produkid,
						"kualitashasil":$scope.dataSource._data[i].kualitashasil.name,
						"qty":$scope.dataSource._data[i].qty,
						// "status":false,
						"norec":$scope.dataSource._data[i].norec,
						"jumlahbakteri":$scope.dataSource._data[i].jumlahbakteri
					}
					var dataTemp_2 =
					{
						"produk":$scope.dataSource._data[i].produkid,
						"kualitashasil":$scope.dataSource._data[i].kualitashasil.name,
						"qty":$scope.dataSource._data[i].qty,
						// "status":true,
						"norec":$scope.dataSource._data[i].norec,
						"jumlahbakteri":$scope.dataSource._data[i].jumlahbakteri
					}
					if ($scope.dataSource._data[i].kualitashasil == "-" || $scope.dataSource._data[i].kualitashasil == "") {
						dataGridNew.push(dataTemp);
					} else {
						dataGridNew.push(dataTemp_2);
					}
					
				}
				var tanggalFormat = new Date($scope.item.tanggal);
				var jamMulaiFormat = new Date($scope.item.waktuMulai)
				var jamSelesaiFormat = new Date($scope.item.waktuSelesai)
				var tanggal = tanggalFormat;
				var jamMulai = jamMulaiFormat;
				var jamSelesai = jamSelesaiFormat;
				var data =
				{
					"noorder": $state.params.strukPelayananId,
					"tanggal": $scope.item.tanggal,
					"jamMulai": moment($scope.item.waktuMulai).format('HH:mm'),
					"jamSelesai": moment($scope.item.waktuSelesai).format('HH:mm'),
					"norec": $scope.dataHeader.norec,
					"petugas": $scope.item.petugas,
					"cssdUjiSwapDetail": dataGridNew
				}

				manageLogistikPhp.postpost("cssd-uji-swap/save-uji-swap/",data).then(function(e) {
					init();
				var confirm = $mdDialog.confirm()
                      .title('Peringatan!')
                      .textContent('Kembali ke Daftar Penerimaan Sterilisasi?')
                      .ariaLabel('Lucky day')
                      .ok('Ya')
                      .cancel('Tidak')

                $mdDialog.show(confirm).then(function() {
                    $state.go("DaftarPenerimaanSterilisasiAlat");
                })
				});
			}
			function customBoolEditor(container, options) {
				$('<input class="k-checkbox" type="checkbox" name="status" data-type="boolean" data-bind="checked:status">').appendTo(container);
				$('<label class="k-checkbox-label">&#8203;</label>').appendTo(container);
			}
		}
		]);
});