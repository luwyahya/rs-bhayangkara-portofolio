define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarHasilTriaseCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$http',
		function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $http) {
			$scope.item = {};
			$scope.dataVOloaded = true;
			$scope.now = new Date();

			var init = function () {
				loadData();
			}


			init();

			function loadData() {

				var carinocm = "";

				var carinamapasien = "";
				var tglMasukAwal = "";
				var tglMasukAkhir = "";



				if ($scope.item.carinocm != undefined) {
					carinocm = "&nocm=" + $scope.item.carinocm;
				}



				if ($scope.item.carinamapasien != undefined) {
					carinamapasien = "&namaPasien=" + $scope.item.carinamapasien;
				}


				if ($scope.item.tglMasukAwal != undefined) {
					if ($scope.item.tglMasukAkhir != undefined) {
						tglMasukAwal = "&tglMasukAwal=" + new moment($scope.item.tglMasukAwal).format('YYYY-MM-DD');
						tglMasukAkhir = "&tglMasukAkhir=" + new moment($scope.item.tglMasukAkhir).format('YYYY-MM-DD');
					}


				}


				medifirstService.get("igd/get-hasil-triase?" + carinocm + carinamapasien + tglMasukAwal + tglMasukAkhir).then(
					function (dat) {
						// debugger
						$scope.listDataMaster = dat.data.hasilTriase;

						$scope.dataSource = new kendo.data.DataSource(

							{
								pageSize: 10,
								data: $scope.listDataMaster,
								autoSync: true

							}

						);

					}
				);
			}


			$scope.cari = function () {

				loadData()
			}

			

			$scope.columnAsuransiPasien = [
				{
					"field": "no",
					"title": "No"
				},
				{
					"field": "norec",
					"title": "NoRec"
				},
				{
					"field": "tanggalmasuk",
					"title": "Tanggal Masuk"
				},
				{
					"field": "namapasien",
					"title": "Nama Pasien"
				},
				{
					"field": "statuspasien",
					"title": "Status Pasien"
				},
				{
					"field": "beratbadan",
					"title": "Berat Badan"
				},
				{
					"field": "tekanandarah",
					"title": "Tekanan Darah"
				},
				{
					"field": "suhu",
					"title": "Suhu"
				},
				{
					"field": "nadi",
					"title": "Nadi"
				},
				{
					"field": "pernapasan",
					"title": "Pernapasan"
				},
				// 			{
				// 					"command":
				// 						[
				// 							{
				// 								text: "Enabled", 
				// 								click: enableData, 
				// 								// imageClass: "k-icon k-floppy"
				// 							},

				// 							{
				// 								text: "Disable", 
				// 								click: disableData, 
				// 								// imageClass: "k-icon k-delete"	
				// 							}
				// 						],

				// 					title: "",
				// 					width: "200px",
				// }
			];

			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.columnAsuransiPasien,
				editable: "popup",
				selectable: "row",
				scrollable: false
			};

			////fungsi klik untuk edit
			$scope.klik = function (current) {
				$scope.showEdit = true;
				$scope.current = current;
				// $scope.item.alamatlengkap = current.alamatlengkap;
				// $scope.item.golonganasuransi = current.golonganasuransi;
				// $scope.item.golonganasuransiId = current.golonganasuransiId;
				// $scope.item.hubunganpeserta = current.hubunganpeserta;
				// $scope.item.hubunganpesertaid = current.hubunganpesertaid;
				// $scope.item.kdinstitusiAsal = current.kdinstitusiasal;
				// $scope.item.jeniskelamin = current.jeniskelamin;
				// $scope.item.jeniskelaminid = current.jeniskelaminid;
				// $scope.item.kelasdijamin = current.kelasdijamin;
				// $scope.item.kelasdijaminid = current.kelasdijaminid;
				// $scope.item.kdLastunitbagian = current.kdLastunitbagian;
				// $scope.item.pegawai = current.pegawai;
				// $scope.item.pegawaiid = current.pegawaiid;
				// $scope.item.kdpenjaminpasien = current.kdpenjaminpasien;
				// $scope.item.lastunitbagian = current.lastunitbagian;
				// $scope.item.namapeserta = current.namapeserta;
				// $scope.item.nikinstitusissal = current.nikinstitusiasal;
				// $scope.item.nippns = current.nippns;
				// $scope.item.noasuransi = current.noasuransi;
				// $scope.item.noasuransihead = current.noasuransihead;
				// $scope.item.nocm = current.nocm;
				// $scope.item.nocmid = current.nocmid;
				// $scope.item.noidentitas = current.noidentitas;
				// $scope.item.notelpfixed = current.notelpfixed;
				// $scope.item.notelpmobile = current.notelpmobile;
				// $scope.item.qasuransi = current.qasuransi;
				// $scope.item.tglakhirberlakulast = current.tglakhirberlakulast;
				// $scope.item.tgllahir = current.tgllahir;
				// $scope.item.tglmulaiberlakulast = current.tglmulaiberlakulast;
				$scope.item.id = current.id;
				// $scope.item.noRec = current.norec;
				// $scope.item.reportdisplay = current.reportdisplay;
				// $scope.item.kodeexternal = current.kodeexternal;
				// $scope.item.namaexternal = current.namaexternal;
				// $scope.item.statusenabled = current.statusenabled;
			};


			// function enableData(e) {
			// 		e.preventDefault();
			// 		var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

			// 		if(!dataItem){
			// 			toastr.error("Data Tidak Ditemukan");
			// 			return;
			// 		}


			// 		ManagePhp.getData("asuransi-pasien/update-status-enabled-asuransi-pasien?id="+dataItem.id+"&statusenabled=true").then(function(dat){

			// 				toastr.success(dat.data.message);
			// 				init();
			// 		 });
			// 	}

			// function disableData(e) {
			// 		e.preventDefault();
			// 		var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

			// 		if(!dataItem){
			// 			toastr.error("Data Tidak Ditemukan");
			// 			return;
			// 		}
			// 		var itemDelete = {
			// 			"id": dataItem.id
			// 		}

			// 		ManagePhp.getData("asuransi-pasien/update-status-enabled-asuransi-pasien?id="+dataItem.id+"&statusenabled=false").then(function(dat){
			// 		 toastr.success(dat.data.message);
			// 		 init();
			// 		 });
			// } 



			// $scope.editTambah = function () {
			// 	cacheHelper.set('CacheFormAsuransiPasien',$scope.current)
			// 	$state.go("AsuransiPasienEdit")

			// }

			// $scope.batal = function () {
			// 	$scope.showEdit = false;
			// 	$scope.item = {};
			// }

			// $scope.hapus = function () {
			// 	debugger
			// 	ManagePhp.getData("asuransi-pasien/hapus-asuransi-pasien?id="+$scope.item.id).then(
			// 		function (e) {

			// 			debugger
			// 			if (e.data.status==201){
			// 				$scope.item = {};
			// 				toastr.success(e.data.message);
			// 				init();
			// 			}else{
			// 				toastr.error(e.data.message);


			// 			}


			// 		}
			// 	);
			// }

			var HttpClient = function () {
				this.get = function (aUrl, aCallback) {
					var anHttpRequest = new XMLHttpRequest();
					anHttpRequest.onreadystatechange = function () {
						if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
							aCallback(anHttpRequest.responseText);
					}

					anHttpRequest.open("GET", aUrl, true);
					anHttpRequest.send(null);
				}
			}

			$scope.CetakHasilTriase = function () {



				var tglAwal = moment($scope.item.tglMasukAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tglMasukAkhir).format('YYYY-MM-DD HH:mm:ss');;
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/gawatdarurat?cetak-hasil-triase=1' +
					'&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&view=true', function (response) {

					});
			}


		}
	]);
});
