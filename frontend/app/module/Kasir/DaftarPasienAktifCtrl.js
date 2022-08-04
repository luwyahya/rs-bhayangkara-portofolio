define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPasienAktifCtrl', ['CacheHelper', '$state', '$q', '$scope', 'DateHelper', 'DataHelper', 'MedifirstService',
		function (cacheHelper, $state, $q, $scope, dateHelper, dataHelper, medifirstService) {
			$scope.isRouteLoading = false;
			$scope.now = new Date();
			$scope.item = {};
			$scope.dataPasienSelected = {};
			showButton();
			FormLoad();

			function FormLoad(){
				// today
				var chacePeriode = cacheHelper.get('DaftarPasienAktif');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split(':');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
				}else {
					$scope.item.periodeAwal = $scope.now;
					$scope.item.periodeAkhir = $scope.now;
				}			
				loadCombo()
			}
			
			function showButton() {
				$scope.showBtnPerbaharui = true;
				$scope.showBtnBayarDeposit = true;
				$scope.showBtnDetail = true;
			}
									
			function loadCombo() {	
				medifirstService.get('kasir/get-data-combo-kasir').then(function (dat) {                               
                    $scope.listRuangan = dat.data.ruanganri
                });							
			}		

			$scope.formatTanggal = function (tanggal) {
				if (tanggal != "null") {
					return moment(tanggal).format('DD-MMM-YYYY');
				}
				else {
					return "-";
				}

			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasienPulang = [
				{
					"field": "tanggalMasuk",
					"title": "Tanggal Masuk",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tanggalMasuk #')}}</span>"
				},
				{
					"field": "tanggalPulang",
					"title": "Tanggal Pulang",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tanggalPulang #')}}</span>"
				},
				{
					"field": "noCm",
					"title": "No RM",
					"width": "150px",
					"template": "<span class='style-center'>#: noCm #</span>"
				},
				{
					"field": "noRegistrasi",
					"title": "No Reg",
					"width": "150px",
					"template": "<span class='style-center'>#: noRegistrasi #</span>"
				},
				{
					"field": "namaPasien",
					"title": "Nama Pasien",
					"width": "200px",
					"template": "<span class='style-left'>#: namaPasien #</span>"
				},
				{
					"field": "namaRuangan",
					"title": "Ruangan",
					"width": "250px",
					"template": "<span class='style-left'>#: namaRuangan #</span>"
				},
				{
					"field": "jenisAsuransi",
					"title": "Jenis Asuransi",
					"width": "150px",
					"template": "<span class='style-center'>#: jenisAsuransi #</span>"
				},
				{
					"field": "status",
					"title": "Status",
					"width": "150px",
					"template": "<span class='style-center'>#: status #</span>"
				}
			];

			$scope.BayarDeposit = function () {
				$scope.changePage("PenyetoranDepositKasir");
			}


			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}

			$scope.changePage = function (stateName) {
				debugger;
				if ($scope.dataPasienSelected.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noRegistrasi
					}

					$state.go(stateName, {
						dataPasien: JSON.stringify(obj)
					});
				}
				else {
					alert("Silahkan pilih data pasien terlebih dahulu");
				}
			}			

			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;
				$scope.item.ruangan = { namaExternal: "" };
				$scope.SearchData();
			}
			$scope.SearchData = function() {
				loadData()
			}

			//fungsi search data
			loadData()
			$scope.SearchEnter = function () {
				loadData()
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
				if ($scope.item.ruangan == undefined) {
					var rg = ""
				} else {
					var rg = "&ruanganId=" + $scope.item.ruangan.id
				}
				if ($scope.item.noReg == undefined) {
					var reg = ""
				} else {
					var reg = "&noReg=" + $scope.item.noReg
				}
				if ($scope.item.nama == undefined) {
					var nm = ""
				} else {
					var nm = "namaPasien=" + $scope.item.nama
				}				
				$q.all([
					medifirstService.get("kasir/daftar-pasien-aktif?"
						+ nm + reg + rg
						+ "&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir),					
				]).then(function (data) {
					if (data[0].statResponse) {
						$scope.isRouteLoading = false;
						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							data: data[0].data,
							pageSize: 20,
							total: data[0].data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										tanggalMasuk: { type: "date" },
										tanggalPulang: { type: "date" }
									}
								}
							}
						});
					}
				});
				var chacePeriode = tglAwal + ":" + tglAkhir;
				cacheHelper.set('DaftarPasienAktif', chacePeriode);
			}

			/*function prosesSearch(kriteriaFilter){
				debugger;
				 var arrFilter = [];
				  for(var i=0; i<kriteriaFilter.length; i++){
				  	if(kriteriaFilter[i].value != "")
				  	{
				  		var obj = {
				  			field: kriteriaFilter[i].text, 
				  			operator: kriteriaFilter[i].operator, 
				  			value: kriteriaFilter[i].value
				  		};

				  		arrFilter.push(obj);
				  	}
				  }

			      var grid = $("#kGrid").data("kendoGrid");
			      grid.dataSource.query({
			      	page:1,
			        pageSize: 10,
			        filter:{
			          logic: "and",
			          filters: arrFilter
			         }
			      });
			  }*/
			$scope.Detail = function () {
				$scope.changePage("RincianTagihan");
			}

			$scope.changePage = function (stateName) {				
				if ($scope.dataPasienSelected.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noRegistrasi
					}

					$state.go(stateName, {
						dataPasien: JSON.stringify(obj)
					});
				}
				else {
					alert("Silahkan pilih data pasien terlebih dahulu");
				}
			}
			////////////////////// -TAMAT- /////////////////////////
		}
	]);
});