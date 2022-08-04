define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('SlottingLiburCtrl', ['$scope', 'MedifirstService','DateHelper',
		function ($scope, medifirstService,DateHelper) {
			$scope.item = {};
			$scope.popUp = {}
			$scope.isRouteLoading = false;
			FormLoad()
			loadData();
			
			function FormLoad(){
				medifirstService.get("sysadmin/master/get-data-combo-master").then(function (dat) {
					$scope.listRuangan = dat.data.ruanganrajal
				})
			}

			$scope.Search = function () {
				loadData()
			}

			$scope.Clear = function () {
				$scope.item = {}
				$scope.popUp = {}			
				loadData()				
			}			
			
			function loadData() {
				$scope.isRouteLoading = true;
				var tgllibur = ""
				if ($scope.item.tgllibur != undefined) {
					tgllibur = "tgllibur=" +moment($scope.item.tgllibur).format('YYYY-MM-DD')
				}
	
				medifirstService.get("reservasionline/get-libur?"
					+ tgllibur
					
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.libur.length; i++) {
						data.data.libur[i].no = i + 1
					}
					// $scope.listDiagnosaKep = data.data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: data.data.libur,
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,


					});
				})
			}

			$scope.columnGrid = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],
				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "id",
					"title": "ID",
					"width": "20%"
				}, {
					"field": "tgllibur",
					"title": "Tgl Libur ",
					"width": "60%"
				},
				{
					"command": [
                    //     {
					// 	text: "Edit",
					// 	click: editData,
					// 	imageClass: "k-icon k-i-pencil"
					// },
					{
						text: "Hapus",
						click: hapusData,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "15%",
				}

				]
            };
            $scope.tanggalPermohonanBersama = [{
                id: 1,
                tgl: "",
                isDuplicate: false
            }]
            $scope.datePickerOptions2 = {
                format: 'dd-MM-yyyy',
                change: onChangeDate2
                // min: twoDaysAfter($scope.now)
            }
            $scope.batalLibur = function(){
                $scope.tanggalPermohonanBersama = [{
                    id: 1,
                    tgl: "",
                    isDuplicate: false
                }]
                $scope.windowsPop.close()
            }
            $scope.saveLibur = function () {
          
                    var listDate = []

                    for (var i = 0; i < $scope.tanggalPermohonanBersama.length; i++) {
                        var element = $scope.tanggalPermohonanBersama[i];
                        for (var key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (key === "tgl") {
                                    if (element[key] instanceof Date)
                                        listDate.push({
                                            tgl: DateHelper.getTanggalFormattedNew(element[key])
                                        });
                                }
                            }
                        }
                    }

                    var dataSend = {
                        "listtanggal": listDate,
                    
                    }
                    medifirstService.post('reservasionline/save-libur', dataSend).then(function (e) {
                        $scope.item = {}
                        $scope.tanggalPermohonanBersama = []
                        loadData()
                    })
             
            }
            $scope.addNewTglBersama = function () {
                // debugger

                var lastDate = $scope.tanggalPermohonanBersama.length - 1;
                if ($scope.tanggalPermohonanBersama[lastDate].tgl instanceof Date) {

                    var newItemNo = $scope.tanggalPermohonanBersama.length + 1;
                    $scope.tanggalPermohonanBersama.push({
                        id: newItemNo,
                        tgl: "dd/MM/yyyy"
                    })


                } else {

                    messageContainer.error('Tanggal  belum dipilih.')
                }

            }
            $scope.showAddTgl2 = function (current) {
                return current.id === $scope.tanggalPermohonanBersama[$scope.tanggalPermohonanBersama.length - 1].id;
            }
            $scope.removeNewTglBersama = function (id) {
                if (id == 1) return;
                if ($scope.tanggalPermohonanBersama.length > 1) {
                    for (var i = 0; i < $scope.tanggalPermohonanBersama.length; i++) {
                        if (id == $scope.tanggalPermohonanBersama[i].id) {
                            $scope.tanggalPermohonanBersama.splice(i, 1);
                            break;
                        }
                    }
                }

            }
            function onChangeDate2(e) {
                if ($scope.tanggalPermohonanBersama.length > 1) {
                    var lastModel = $scope.tanggalPermohonanBersama.length - 1;
                    for (var i = 0; i < $scope.tanggalPermohonanBersama.length; i++) {
                        if (i < lastModel && kendo.toString($scope.tanggalPermohonanBersama[i].tgl, "MM/dd/yyyy") === kendo.toString(this.value(), "MM/dd/yyyy")) {

                            toastr.error("Tanggal " + kendo.toString(this.value(), "dd/MM/yyyy") + " sudah ada", "Peringatan");
                            $scope.tanggalPermohonanBersama[lastModel].tgl = "";
                            $(this.element).closest('span').addClass("duplicateDate");
                            $(this.element).parent('span').addClass("duplicateDate");
                            this.value("");

                        } else {
                            $(this.element).closest('span').removeClass("duplicateDate");
                            $(this.element).parent('span').removeClass("duplicateDate");
                        }
                    }
                }
            }
			$scope.Tambah = function () {
				$scope.windowsPop.center().open();
			}
			$scope.save = function () {
				var id = ""
				if ($scope.popUp.id != undefined)
					id = $scope.popUp.id


				if ($scope.popUp.ruangan == undefined) {
					toastr.error('Ruangan harus di isi')
					return
				}
					if ($scope.popUp.quota == undefined) {
					toastr.error('Quota harus di isi')
					return
				}
					if ($scope.popUp.jamBuka == undefined) {
					toastr.error('Jam Buka harus di isi')
					return
				}
					if ($scope.popUp.jamTutup == undefined) {
					toastr.error('Jam Tutup harus di isi')
					return
				}


				var objSave = {
					"id": id,
					"objectruanganfk": $scope.popUp.ruangan.id,
					"jambuka": moment($scope.popUp.jamBuka).format('HH:mm') ,
					"jamtutup": moment($scope.popUp.jamTutup).format('HH:mm') ,
					"quota": $scope.popUp.quota ,

				}
				medifirstService.post('reservasionline/save-slotting',objSave).then(function (e) {
					loadData();
					$scope.Clear();
				})

			}



			function hapusData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post( 'reservasionline/delete-libur',itemDelete).then(function (e) {
					if (e.status === 201) {
						loadData();
						grid.removeRow(row);
					}
				})

			}
			function editData(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.post("reservasionline/get-daftar-slotting?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUp.id = dataItem.id
				$scope.nows= new Date()

				$scope.popUp.ruangan = {id:dataItem.idruangan,namaruangan: dataItem.namaruangan}
				$scope.popUp.jamBuka = new Date( moment(	$scope.nows).format('YYYY-MM-DD') +' '+ dataItem.jambuka)
				$scope.popUp.jamTutup = new Date(  moment(	$scope.nows).format('YYYY-MM-DD') +' '+dataItem.jamtutup)
				$scope.popUp.quota =parseInt( dataItem.quota)
				$scope.popUps.center().open();

			}

			$scope.tutup = function () {
				$scope.popUps.close();
		
			}
			// intervensi
			

			//ennd evaluaso

		}
	]);
});

