define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSensusHarianCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};            
            $scope.isRouteLoading = false;
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
			$scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
			var sensus = [];
			var details = [];

			$scope.CariSensus = function (){
				$scope.isRouteLoading = true;
				LoadData()
				// LoadDataRuangan()
			}
			// function LoadDataRuangan() {
			// 	var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            // 	var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');

			// 	medifirstService.get("registrasi/laporan/get-ruangan?"
			// 	+ "tglAwal=" + tglAwal
			// 	+ "&tglAkhir=" + tglAkhir).then(function(data){
			// 	$scope.dataRuangan = {
			// 		data: data.data,
			// 		pageSize: 70,
			// 		total: data.length,
			// 		serverPaging: false,
			// 		schema: {
			// 			model: {
			// 				fields: {
	
			// 				}
			// 			}
			// 		},
			// 			refresh: true,
			// 			selectable: true,
			// 			refresh: true,
			// 			groupable: true,
			// 			allowCopy: true,
			// 	}
			// 	})
			// }
			// $scope.columnRuangan = {
			// 	columns:
			// 	[
			// 		{
			// 			"field": "namaruangan",
			// 			"title": "Nama Ruangan",
			// 			"width": "20px"
			// 		},
			// 		{
			// 			"title": "KAPASITAS",
			// 			headerAttributes: { style: "text-align : center"},
			// 			columns:
			// 			[
			// 				{
			// 					"field": "vvip",
			// 					"title": "VVIP",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "vip",
			// 					"title": "VIP",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "kelas_1",
			// 					"title": "I",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "kelas_2",
			// 					"title": "II",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "kelas_3",
			// 					"title": "III",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "isolasi",
			// 					"title": "ISOLASI",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "intensive",
			// 					"title": "INTENSIVE",
			// 					"width": "10px"
			// 				},
			// 				{
			// 					"field": "jumlahkamar",
			// 					"title": "JUMLAH",
			// 					"width": "10px"
			// 				},
			// 			]
			// 		}
			// 	],
			// 	sortable: {
			// 		mode: "single",
			// 		allowUnsort: false,
			// 	},
			// 	pageable: {
			// 		messages: {
			// 			display: "Menampilkan {0} - {1} data dari {2} data"
			// 		},
			// 		refresh: true,
			// 		pageSizes: true,
			// 		buttonCount: 5
			// 	},
			// };
			
			function LoadData() {
				var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            	var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
			
			medifirstService.get("registrasi/laporan/get-sensus-harian?"
				+ "tglAwal=" + tglAwal
				+ "&tglAkhir=" + tglAkhir).then(function (data) {
				debugger;
				$scope.isRouteLoading = false;
				var sensus = data.data;
				var sensusreal = []
				var sensusrealbos = []
				var sensusrealbangetbos = []
				sensusreal.push(sensus[0])
				for (var x = 1; x < sensus.length; x++) {
					var sama = false
					var namaruangan = sensus[x].namaruangan
					var namaruanganreal = sensusreal[sensusreal.length - 1].namaruangan
					var kls3lainlaki = sensus[x].kls3lainlaki
					var kls3lainlakireal = sensusreal[sensusreal.length - 1].kls3lainlaki
					var kls3bpjspollaki = sensus[x].kls3bpjspollaki
					var kls3bpjspollakireal = sensusreal[sensusreal.length - 1].kls3bpjspollaki
					var kls3bpjsnonpollaki = sensus[x].kls3bpjsnonpollaki
					var kls3bpjsnonpollakireal = sensusreal[sensusreal.length - 1].kls3bpjsnonpollaki
					var kls2lainlaki = sensus[x].kls2lainlaki
					var kls2lainlakireal = sensusreal[sensusreal.length - 1].kls2lainlaki
					var kls2bpjspollaki = sensus[x].kls2bpjspollaki
					var kls2bpjspollakireal = sensusreal[sensusreal.length - 1].kls2bpjspollaki
					var kls2bpjsnonpollaki = sensus[x].kls2bpjsnonpollaki
					var kls2bpjsnonpollakireal = sensusreal[sensusreal.length - 1].kls2bpjsnonpollaki
					var kls1lainlaki = sensus[x].kls1lainlaki
					var kls1lainlakireal = sensusreal[sensusreal.length - 1].kls1lainlaki
					var kls1bpjspollaki = sensus[x].kls1bpjspollaki
					var kls1bpjspollakireal = sensusreal[sensusreal.length - 1].kls1bpjspollaki
					var kls1bpjsnonpollaki = sensus[x].kls1bpjsnonpollaki
					var kls1bpjsnonpollakireal = sensusreal[sensusreal.length - 1].kls1bpjsnonpollaki
					var klsviplainlaki = sensus[x].klsviplainlaki
					var klsviplainlakireal = sensusreal[sensusreal.length - 1].klsviplainlaki
					var klsvipbpjspollaki = sensus[x].klsvipbpjspollaki
					var klsvipbpjspollakireal = sensusreal[sensusreal.length - 1].klsvipbpjspollaki
					var klsvipbpjsnonpollaki = sensus[x].klsvipbpjsnonpollaki
					var klsvipbpjsnonpollakireal = sensusreal[sensusreal.length - 1].klsvipbpjsnonpollaki
					var klsisolainlaki = sensus[x].klsisolainlaki
					var klsisolainlakireal = sensusreal[sensusreal.length - 1].klsisolainlaki
					var klsisobpjspollaki = sensus[x].klsisobpjspollaki
					var klsisobpjspollakireal = sensusreal[sensusreal.length - 1].klsisobpjspollaki
					var klsisobpjsnonpollaki = sensus[x].klsisobpjsnonpollaki
					var klsisobpjsnonpollakireal = sensusreal[sensusreal.length - 1].klsisobpjsnonpollaki
					var klsvviplainlaki = sensus[x].klsvviplainlaki
					var klsvviplainlakireal = sensusreal[sensusreal.length - 1].klsvviplainlaki
					var klsvvipbpjspollaki = sensus[x].klsvvipbpjspollaki
					var klsvvipbpjspollakireal = sensusreal[sensusreal.length - 1].klsvvipbpjspollaki
					var klsvvipbpjsnonpollaki = sensus[x].klsvvipbpjsnonpollaki
					var klsvvipbpjsnonpollakireal = sensusreal[sensusreal.length - 1].klsvvipbpjsnonpollaki
					var klsintlainlaki = sensus[x].klsintlainlaki
					var klsintlainlakireal = sensusreal[sensusreal.length - 1].klsintlainlaki
					var klsintbpjspollaki = sensus[x].klsintbpjspollaki
					var klsintbpjspollakireal = sensusreal[sensusreal.length - 1].klsintbpjspollaki
					var klsintbpjsnonpollaki = sensus[x].klsintbpjsnonpollaki
					var klsintbpjsnonpollakireal = sensusreal[sensusreal.length - 1].klsintbpjsnonpollaki
					var jumlahL = sensus[x].jumlahL
					var jumlahLreal = sensusreal[sensusreal.length - 1].jumlahL
					var kls3lainwanita = sensus[x].kls3lainwanita
					var kls3lainwanitareal = sensusreal[sensusreal.length - 1].kls3lainwanita
					var kls3bpjspolwanita = sensus[x].kls3bpjspolwanita
					var kls3bpjspolwanitareal = sensusreal[sensusreal.length - 1].kls3bpjspolwanita
					var kls3bpjsnonpolwanita = sensus[x].kls3bpjsnonpolwanita
					var kls3bpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].kls3bpjsnonpolwanita
					var kls2lainwanita = sensus[x].kls2lainwanita
					var kls2lainwanitareal = sensusreal[sensusreal.length - 1].kls2lainwanita
					var kls2bpjspolwanita = sensus[x].kls2bpjspolwanita
					var kls2bpjspolwanitareal = sensusreal[sensusreal.length - 1].kls2bpjspolwanita
					var kls2bpjsnonpolwanita = sensus[x].kls2bpjsnonpolwanita
					var kls2bpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].kls2bpjsnonpolwanita
					var kls1lainwanita = sensus[x].kls1lainwanita
					var kls1lainwanitareal = sensusreal[sensusreal.length - 1].kls1lainwanita
					var kls1bpjspolwanita = sensus[x].kls1bpjspolwanita
					var kls1bpjspolwanitareal = sensusreal[sensusreal.length - 1].kls1bpjspolwanita
					var kls1bpjsnonpolwanita = sensus[x].kls1bpjsnonpolwanita
					var kls1bpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].kls1bpjsnonpolwanita
					var klsviplainwanita = sensus[x].klsviplainwanita
					var klsviplainwanitareal = sensusreal[sensusreal.length - 1].klsviplainwanita
					var klsvipbpjspolwanita = sensus[x].klsvipbpjspolwanita
					var klsvipbpjspolwanitareal = sensusreal[sensusreal.length - 1].klsvipbpjspolwanita
					var klsvipbpjsnonpolwanita = sensus[x].klsvipbpjsnonpolwanita
					var klsvipbpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].klsvipbpjsnonpolwanita
					var klsisolainwanita = sensus[x].klsisolainwanita
					var klsisolainwanitareal = sensusreal[sensusreal.length - 1].klsisolainwanita
					var klsisobpjspolwanita = sensus[x].klsisobpjspolwanita
					var klsisobpjspolwanitareal = sensusreal[sensusreal.length - 1].klsisobpjspolwanita
					var klsisobpjsnonpolwanita = sensus[x].klsisobpjsnonpolwanita
					var klsisobpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].klsisobpjsnonpolwanita
					var klsvviplainwanita = sensus[x].klsvviplainwanita
					var klsvviplainwanitareal = sensusreal[sensusreal.length - 1].klsvviplainwanita
					var klsvvipbpjspolwanita = sensus[x].klsvvipbpjspolwanita
					var klsvvipbpjspolwanitareal = sensusreal[sensusreal.length - 1].klsvvipbpjspolwanita
					var klsvvipbpjsnonpolwanita = sensus[x].klsvvipbpjsnonpolwanita
					var klsvvipbpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].klsvvipbpjsnonpolwanita
					var klsintlainwanita = sensus[x].klsintlainwanita
					var klsintlainwanitareal = sensusreal[sensusreal.length - 1].klsintlainwanita
					var klsintbpjspolwanita = sensus[x].klsintbpjspolwanita
					var klsintbpjspolwanitareal = sensusreal[sensusreal.length - 1].klsintbpjspolwanita
					var klsintbpjsnonpolwanita = sensus[x].klsintbpjsnonpolwanita
					var klsintbpjsnonpolwanitareal = sensusreal[sensusreal.length - 1].klsintbpjsnonpolwanita
					var jumlahwanita = sensus[x].jumlahwanita
					var jumlahwanitareal = sensusreal[sensusreal.length - 1].jumlahwanita
					var kelas_3 = sensus[x].kelas_3
					var kelas_3real = sensusreal[sensusreal.length - 1].kelas_3
					// var kelas_2 = sensus[x].kelas_2
					// var kelas_2real = sensusreal[sensusreal.length - 1].kelas_2
					// var kelas_1 = sensus[x].kelas_1
					// var kelas_1real = sensusreal[sensusreal.length - 1].kelas_1
					// var vip = sensus[x].vip
					// var vipreal = sensusreal[sensusreal.length - 1].vip
					// var isolasi = sensus[x].isolasi
					// var isolasireal = sensusreal[sensusreal.length - 1].isolasi
					// var vvip = sensus[x].vvip
					// var vvipreal = sensusreal[sensusreal.length - 1].vvip
					// var int = sensus[x].intensive
					// var intreal = sensusreal[sensusreal.length 0- 1].intensive
					var jumlahkamar = sensus[x].jumlahkamar
					var jumlahkamarreal = sensusreal[sensusreal.length - 1].jumlahkamar
					// var jumlahkamar1 = sensusreal[0].jumlahkamar
					// var jumlahkamar2 = sensusreal[1].jumlahkamar

					if( jumlahkamar == jumlahkamarreal &&
						kls3lainlaki == kls3lainlakireal && kls3bpjspollaki == kls3bpjspollakireal && kls3bpjsnonpollaki == kls3bpjsnonpollakireal && kls2lainlaki == kls2lainlakireal && kls2bpjspollaki == kls2bpjspollakireal && kls2bpjsnonpollaki == kls2bpjsnonpollakireal && kls1lainlaki == kls1lainlakireal && kls1bpjspollaki == kls1bpjspollakireal && kls1bpjsnonpollaki == kls1bpjsnonpollakireal && klsviplainlaki == klsviplainlakireal && klsvipbpjspollaki == klsvipbpjspollakireal && klsvipbpjsnonpollaki == klsvipbpjsnonpollakireal &&
						klsisolainlaki == klsisolainlakireal && klsisobpjspollaki == klsisobpjspollakireal && klsisobpjsnonpollaki == klsisobpjsnonpollakireal && klsvviplainlaki == klsvviplainlakireal && klsvvipbpjspollaki == klsvvipbpjspollakireal && klsvvipbpjsnonpollaki == klsvvipbpjsnonpollakireal && klsintlainlaki == klsintlainlakireal && klsintbpjspollaki == klsintbpjspollakireal && klsintbpjsnonpollaki == klsintbpjsnonpollakireal && jumlahL == jumlahLreal &&
						kls3lainwanita == kls3lainwanitareal && kls3bpjspolwanita == kls3bpjspolwanitareal && kls3bpjsnonpolwanita == kls3bpjsnonpolwanitareal && kls2lainwanita == kls2lainwanitareal && kls2bpjspolwanita == kls2bpjspolwanitareal && kls2bpjsnonpolwanita == kls2bpjsnonpolwanitareal && kls1lainwanita == kls1lainwanitareal && kls1bpjspolwanita == kls1bpjspolwanitareal && kls1bpjsnonpolwanita == kls1bpjsnonpolwanitareal && klsviplainwanita == klsviplainwanitareal && klsvipbpjspolwanita == klsvipbpjspolwanitareal && klsvipbpjsnonpolwanita == klsvipbpjsnonpolwanitareal && 
						klsisolainwanita == klsisolainwanitareal && klsisobpjspolwanita == klsisobpjspolwanitareal && klsisobpjsnonpolwanita == klsisobpjsnonpolwanitareal && klsvviplainwanita == klsvviplainwanitareal && klsvvipbpjspolwanita == klsvvipbpjspolwanitareal && klsvvipbpjsnonpolwanita == klsvvipbpjsnonpolwanitareal && klsintlainwanita == klsintlainwanitareal && klsintbpjspolwanita == klsintbpjspolwanitareal && klsintbpjsnonpolwanita == klsintbpjsnonpolwanitareal && jumlahwanita == jumlahwanitareal){
						sama = true	
					}
					// if(jumlahkamar1 == jumlahkamar || jumlahkamar2 == jumlahkamar){
					// 	sama == true
					// } else{
					// 	sama == false
					// }
					if ( sama == false ){
						sensusreal.push(sensus[x])
					}
				}
				debugger;
				// sensusrealbos.push(sensusreal[0])
				for (let i = 0; i < sensus.length; i++){
					var namaruanganrealbanget = sensus[i].namaruangan
					var namaruanganrealbanget2 = sensus[0].namaruangan
					var jumlahkamarrealbanget = sensus[i].jumlahkamar
					var jumlahkamarrealbanget2 = sensus[0].jumlahkamar
					var namaruanganrealbanget3 = sensus[1].namaruangan
					var jumlahkamarrealbanget3 = sensus[1].jumlahkamar
					var jumlahkamarrealbanget4 = sensus[2].jumlahkamar
					var kelas3 = sensus[i].kelas_3
					var kelas2 = sensus[i].kelas_2
					var kelas1 = sensus[i].kelas_1
					var iso = sensus[i].isolasi
					var int = sensus[i].intensive
					var id = sensus[i].idruangan
					
			// 		var namaruanganrealsangat = sensusrealbos[sensusrealbos.length - 1].namaruangan
			// 		var kelas_3realbanget = sensusreal[i].kelas_3
			// 		var kelas_3realsangat = sensusrealbos[sensusrealbos.length - 1].kelas_3
			// 		var kelas_2 = sensusreal[i].kelas_2
			// 		var kelas_2real = sensusrealbos[sensusrealbos.length - 1].kelas_2
			// 		var kelas_1 = sensusreal[i].kelas_1
			// 		var kelas_1real = sensusrealbos[sensusrealbos.length - 1].kelas_1
			// 		var vip = sensusreal[i].vip
			// 		var vipreal = sensusrealbos[sensusrealbos.length - 1].vip
			// 		var isolasi = sensusreal[i].isolasi
			// 		var isolasireal = sensusrealbos[sensusrealbos.length - 1].isolasi
			// 		var vvip = sensusreal[i].vvip
			// 		var vvipreal = sensusrealbos[sensusrealbos.length - 1].vvip
			// 		var int = sensusreal[i].intensive
			// 		var intreal = sensusrealbos[sensusrealbos.length - 1].intensive
			// 		var jumlahkamar = sensusreal[i].jumlahkamar
			// 		var jumlahkamarreal = sensusrealbos[sensusrealbos.length - 1].jumlahkamar
			// 		var jumlahlakireall = sensusreal[i].jumlahL
			// 		var jumlahlakirealll = sensusrealbos[sensusrealbos.length - 1].jumlahL
			// 		var jumlahwanitareall = sensusreal[i].jumlahwanita
			// 		var jumlahwanitarealll = sensusrealbos[sensusrealbos.length - 1].jumlahwanita
			// 	if (namaruanganrealbanget == namaruanganrealsangat || jumlahlakireall == jumlahlakirealll && jumlahwanitareall == jumlahwanitarealll && jumlahkamar == jumlahkamarreal){
			// 		sama = true
			// 	} 
			// 	 else{
			// 		sama = false
			// 	}
					if(namaruanganrealbanget == "CENDANA 2" && jumlahkamarrealbanget == 33 && kelas3 == 33 ){
						sama = 2
					} else if (namaruanganrealbanget == "ANGGREK 1" && jumlahkamarrealbanget == 20 && kelas3 == 19){
						sama = 2
					} else if (namaruanganrealbanget == "ANGGREK 2" && jumlahkamarrealbanget == 16){
						sama = 2
					} else if (namaruanganrealbanget == "ANTON 1" && jumlahkamarrealbanget == 28 && kelas3 == 4){
						sama = 2
					}else if (namaruanganrealbanget == "ANTON 2" && jumlahkamarrealbanget == 30){
						sama = 2
					} else if (namaruanganrealbanget == "ANTON 3" && jumlahkamarrealbanget == 15){
						sama = 2
					} else if (namaruanganrealbanget == "ANTON 4" && jumlahkamarrealbanget == 8){
						sama = 2
					} else if (namaruanganrealbanget == "ANTON 5" && jumlahkamarrealbanget == 8){
						sama = 2
					} else if (namaruanganrealbanget == "BOUGENVILE-NICU" && jumlahkamarrealbanget == 18){
						sama = 2
					} else if (namaruanganrealbanget == "CEMARA 1" && jumlahkamarrealbanget == 22 && kelas3 == 22){
						sama = 2
					} else if (namaruanganrealbanget == "CEMARA 2" && jumlahkamarrealbanget == 23){
						sama = 2
					} else if (namaruanganrealbanget == "CEMPAKA 1" && jumlahkamarrealbanget == 10 && kelas3 == 3){
						sama = 2
					} else if (namaruanganrealbanget == "CEMPAKA 2" && jumlahkamarrealbanget == 27){
						sama = 2
					} else if (namaruanganrealbanget == "CENDANA 1" && jumlahkamarrealbanget == 25 && kelas3 == 25){
						sama = 2
					} else if (namaruanganrealbanget == "CENDRAWASIH 1" && jumlahkamarrealbanget == 15 && kelas3 == 1 && kelas1 == 12){
						sama = 2
					} else if (id == 724 && jumlahkamarrealbanget == 15){
						sama = 2
					} else if (namaruanganrealbanget == "CENDRAWASIH 3" && jumlahkamarrealbanget == 15 && kelas3 == 1 && kelas1 == 12){
						sama = 2
					} else if (namaruanganrealbanget == "CENDRAWASIH 4" && jumlahkamarrealbanget == 20 && kelas3 == 1 && kelas2 == 19){
						sama = 2
					} else if (namaruanganrealbanget == "DAHLIA" && jumlahkamarrealbanget == 12 && kelas3 == 12){
						sama = 2
					} else if (namaruanganrealbanget == "dr. HARDJA SAMSURJA 1 A" && jumlahkamarrealbanget == 16 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "dr. HARDJA SAMSURJA 1 B" && jumlahkamarrealbanget == 16 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "dr. HARDJA SAMSURJA 2 A" && jumlahkamarrealbanget == 16 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "dr. HARDJA SAMSURJA 2 B" && jumlahkamarrealbanget == 16 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "dr. HARDJA SAMSURJA 3" && jumlahkamarrealbanget == 17){
						sama = 2
					} else if (namaruanganrealbanget == "ECU" && jumlahkamarrealbanget == 8 && int == 8){
						sama = 2
					} else if (namaruanganrealbanget == "EDELWEIS 1" && jumlahkamarrealbanget == 16 && kelas3 == 13){
						sama = 2
					} else if (namaruanganrealbanget == "EDELWEIS 2" && jumlahkamarrealbanget == 22 && kelas3 == 22){
						sama = 2
					} else if (namaruanganrealbanget == "FLAMBOYAN" && jumlahkamarrealbanget == 20 && kelas3 == 20){
						sama = 2
					} else if (namaruanganrealbanget == "GRIU 1" && jumlahkamarrealbanget == 25){
						sama = 2
					} else if (namaruanganrealbanget == "GRIU 2" && jumlahkamarrealbanget == 25 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "GRIU 3" && jumlahkamarrealbanget == 19){
						sama = 2
					} else if (namaruanganrealbanget == "GRIU 4" && jumlahkamarrealbanget == 19){
						sama = 2
					} else if (namaruanganrealbanget == "HCU 1" && jumlahkamarrealbanget == 5){
						sama = 2
					} else if (namaruanganrealbanget == "HCU 2" && jumlahkamarrealbanget == 8 && int == 8){
						sama = 2
					} else if (namaruanganrealbanget == "HCU 3  dr.GALIH" && jumlahkamarrealbanget == 6 && int == 6){
						sama = 2
					} else if (namaruanganrealbanget == "ICCU" && jumlahkamarrealbanget == 6 && int == 6){
						sama = 2
					} else if (namaruanganrealbanget == "ICU A 1" && jumlahkamarrealbanget == 8){
						sama = 2
					} else if (namaruanganrealbanget == "ICU A 2" && jumlahkamarrealbanget == 8){
						sama = 2
					} else if (namaruanganrealbanget == "ICU B" && jumlahkamarrealbanget == 25 && int == 25){
						sama = 2
					} else if (namaruanganrealbanget == "ICU B 1" && jumlahkamarrealbanget == 12 && int == 12){
						sama = 2
					} else if (namaruanganrealbanget == "ICU B 2" && jumlahkamarrealbanget == 8 && int == 8){
						sama = 2
					} else if (namaruanganrealbanget == "ICU B 3" && jumlahkamarrealbanget == 5){
						sama = 2
					} else if (namaruanganrealbanget == "ICU BEDAH JANTUNG" && jumlahkamarrealbanget == 4){
						sama = 2
					} else if (namaruanganrealbanget == "ICU KHUSUS" && jumlahkamarrealbanget == 8 && iso == 2){
						sama = 2
					} else if (namaruanganrealbanget == "ICU PROMOTER LT.6" && jumlahkamarrealbanget == 3){
						sama = 2
					} else if (namaruanganrealbanget == "MAHONI 1" && jumlahkamarrealbanget == 23){
						sama = 2
					} else if (namaruanganrealbanget == "MAHONI 2" && jumlahkamarrealbanget == 23){
						sama = 2
					} else if (namaruanganrealbanget == "MELATI 1" && jumlahkamarrealbanget == 7){
						sama = 2
					} else if (namaruanganrealbanget == "MELATI 2" && jumlahkamarrealbanget == 20 && kelas3 == 13){
						sama = 2
					} else if (namaruanganrealbanget == "NANGOY" && jumlahkamarrealbanget == 7 && kelas2 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "NICU B" && jumlahkamarrealbanget == 10 && int == 10){
						sama = 2
					} else if (namaruanganrealbanget == "NURI 1" && jumlahkamarrealbanget == 14){
						sama = 2
					} else if (namaruanganrealbanget == "NURI 2" && jumlahkamarrealbanget == 13){
						sama = 2
					} else if (namaruanganrealbanget == "PAMEN 3" && jumlahkamarrealbanget == 20 && kelas1 == 9){
						sama = 2
					} else if (namaruanganrealbanget == "PAMEN 4" && jumlahkamarrealbanget == 20){
						sama = 2
					} else if (namaruanganrealbanget == "PARKIT 1" && jumlahkamarrealbanget == 20 && kelas3 == 16){
						sama = 2
					} else if (namaruanganrealbanget == "PARKIT 2" && jumlahkamarrealbanget == 21){
						sama = 2
					} else if (namaruanganrealbanget == "PROMOTER 3" && jumlahkamarrealbanget == 28 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "PROMOTER 4" && jumlahkamarrealbanget == 30 && kelas3 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "PROMOTER 5" && jumlahkamarrealbanget == 14 && kelas2 == 2){
						sama = 2
					} else if (namaruanganrealbanget == "PROMOTER 6" && jumlahkamarrealbanget == 4){
						sama = 2
					} else if (namaruanganrealbanget == "SOEPARNO 1" && jumlahkamarrealbanget == 16 && kelas2 == 7){
						sama = 2
					} else if (namaruanganrealbanget == "SOEPARNO 2" && jumlahkamarrealbanget == 16 && kelas3 == 1){
						sama = 2
					} else if (namaruanganrealbanget == "SOEWARNO" && jumlahkamarrealbanget == 11){
						sama = 2
					} else if (namaruanganrealbanget == "TERATAI 1" && jumlahkamarrealbanget == 24){
						sama = 2
					} else if (namaruanganrealbanget == "TERATAI 2" && jumlahkamarrealbanget == 20 && kelas3 == 20){
						sama = 2
					} else if (namaruanganrealbanget == "TULIP" && jumlahkamarrealbanget == 20 && kelas3 == 20){
						sama = 2
					} else if (namaruanganrealbanget == "VIP MELATI" && jumlahkamarrealbanget == 1){
						sama = 2
					}
					  else {
						sama = 1
					}
					// else if (namaruanganrealbanget != namaruanganrealbanget2 && jumlahkamarrealbanget == jumlahkamarrealbanget4){ 
					// 	sama = false
					// } 
				
				if ( sama == 2 ){
					sensusrealbos.push(sensus[i])
				}
			}
			debugger;
			sensusrealbangetbos.push(sensusrealbos[0])
			for (var z = 0; z < sensusrealbos.length; z++){
				var sama = false
				var namaruangann = sensusrealbos[z].namaruangan
				var namaruangann2 = sensusrealbangetbos[sensusrealbangetbos.length - 1].namaruangan
				var jumlahkamarr = sensusrealbos[z].jumlahkamar
				var jumlahkamarr2 = sensusrealbangetbos[sensusrealbangetbos.length - 1].jumlahkamar
				if (namaruangann == namaruangann2 && jumlahkamarr == jumlahkamarr2){
					sama = true
				}
				if (sama == false){
					sensusrealbangetbos.push(sensusrealbos[z])
				}
			}
				// debugger;
				
				$scope.dataSensusHarian = {
					data: sensusrealbangetbos,
					pageSize: 70,
					total: sensusrealbangetbos.length,
					serverPaging: false,
					schema: {
						model: {
							fields: {

							}
						}
					}, aggregate: [
						{ field: 'klsvvipbpjspollaki', aggregate: 'sum'},
						{ field: 'klsvvipbpjsnonpollaki', aggregate: 'sum'},
						{ field: 'klsvviplainlaki', aggregate: 'sum'},
						{ field: 'klsvipbpjspollaki', aggregate: 'sum'},
						{ field: 'klsvipbpjsnonpollaki', aggregate: 'sum'},
						{ field: 'klsviplainlaki', aggregate: 'sum'},
						{ field: 'kls1bpjspollaki', aggregate: 'sum'},
						{ field: 'kls1bpjsnonpollaki', aggregate: 'sum'},
						{ field: 'kls1lainlaki', aggregate: 'sum'},
						{ field: 'kls2bpjspollaki', aggregate: 'sum'},
						{ field: 'kls2bpjsnonpollaki', aggregate: 'sum'},
						{ field: 'kls2lainlaki', aggregate: 'sum'},
						{ field: 'kls3bpjspollaki', aggregate: 'sum'},
						{ field: 'kls3bpjsnonpollaki', aggregate: 'sum'},
						{ field: 'kls3lainlaki', aggregate: 'sum'},
						{ field: 'klsisobpjspollaki', aggregate: 'sum'},
						{ field: 'klsisobpjsnonpollaki', aggregate: 'sum'},
						{ field: 'klsisolainlaki', aggregate: 'sum'},
						{ field: 'klsintbpjspollaki', aggregate: 'sum'},
						{ field: 'klsintbpjsnonpollaki', aggregate: 'sum'},
						{ field: 'klsintlainlaki', aggregate: 'sum'},
						{ field: 'jumlahL', aggregate: 'sum'},
						{ field: 'klsvvipbpjspolwanita', aggregate: 'sum'},
						{ field: 'klsvvipbpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'klsvviplainwanita', aggregate: 'sum'},
						{ field: 'klsvipbpjspolwanita', aggregate: 'sum'},
						{ field: 'klsvipbpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'klsviplainwanita', aggregate: 'sum'},
						{ field: 'kls1bpjspolwanita', aggregate: 'sum'},
						{ field: 'kls1bpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'kls1lainwanita', aggregate: 'sum'},
						{ field: 'kls2bpjspolwanita', aggregate: 'sum'},
						{ field: 'kls2bpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'kls2lainwanita', aggregate: 'sum'},
						{ field: 'kls3bpjspolwanita', aggregate: 'sum'},
						{ field: 'kls3bpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'kls3lainwanita', aggregate: 'sum'},
						{ field: 'klsisobpjspolwanita', aggregate: 'sum'},
						{ field: 'klsisobpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'klsisolainwanita', aggregate: 'sum'},
						{ field: 'klsintbpjspolwanita', aggregate: 'sum'},
						{ field: 'klsintbpjsnonpolwanita', aggregate: 'sum'},
						{ field: 'klsintlainwanita', aggregate: 'sum'},
						{ field: 'jumlahwanita', aggregate: 'sum'},
					],
					refresh: true,
					selectable: true,
					refresh: true,
					groupable: true,
					allowCopy: true,
				}
			})
			
		}

		$scope.columnSensusHarian = {
			toolbar: [
				"excel",
			],
			excel: {
				filename: "LaporanSensusHarian.xlsx",
				allPages: true,
			},
			excelExport: function (e) {
				var sheet = e.workbook.sheets[0];
				sheet.frozenRows = 2;
				sheet.mergedCells = ["A1:P1"];
				sheet.name = "LAPORAN";

				var myHeaders = [
					{
						value: "Laporan Sensus Harian",
						fontSize: 15,
						textAlign: "center",
						background: "#c1d2d2",
					}
				];
				sheet.rows.splice(0,0, { cells: myHeaders, type: "header", height: 50});
			},
			selectable: 'row',
			sortable: false,
            reorderable: true,
            filterable: false,
            pageable: true,
            columnMenu: false,
            resizable: true,
			columns:
			[
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "180px"
				},
				{
					"title": "KAPASITAS",
					headerAttributes: { style: "text-align : center"},
					columns:
					[
						{
							"field": "vvip",
							"title": "VVIP",
							"width": "100px"
						},
						{
							"field": "vip",
							"title": "VIP",
							"width": "100px"
						},
						{
							"field": "kelas_1",
							"title": "I",
							"width": "100px"
						},
						{
							"field": "kelas_2",
							"title": "II",
							"width": "100px"
						},
						{
							"field": "kelas_3",
							"title": "III",
							"width": "100px"
						},
						{
							"field": "isolasi",
							"title": "ISOLASI",
							"width": "100px"
						},
						{
							"field": "intensive",
							"title": "INTENSIVE",
							"width": "100px"
						},
						{
							"field": "jumlahkamar",
							"title": "JUMLAH",
							"width": "100px"
						},
					]
				},
				{
					"title": "Terisi Pria",
					headerAttributes: { style: "text-align : center" },
					columns:
					[
						{
							"title": "VVIP",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsvvipbpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvvipbpjspollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVvipBpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvvipbpjspollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvvipbpjspollaki.sum #"
								
								},
								{
									"field": "klsvvipbpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvvipbpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVvipBpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvvipbpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvvipbpjsnonpollaki.sum #"
								},
								{
									"field": "klsvviplainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsvviplainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVvipLainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvviplainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvviplainlaki.sum #"
								}
							]
						},
						{
							"title": "VIP",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsvipbpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvipbpjspollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVipBpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvipbpjspollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvipbpjspollaki.sum #"
								},
								{
									"field": "klsvipbpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvipbpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVipBpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvipbpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvipbpjsnonpollaki.sum #"
								},
								{
									"field": "klsviplainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsviplainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVipLainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsviplainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsviplainlaki.sum #"
								}
							]
						},
						{
							"title": "I",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "kls1bpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1PolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1bpjspollaki #</button>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1BpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1bpjspollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls1bpjspollaki.sum #"
								},
								{
									"field": "kls1bpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls1bpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1BpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1bpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls1bpjsnonpollaki.sum #"
								},
								{
									"field": "kls1lainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:kls1lainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1LainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1lainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls1lainlaki.sum #"
								}
							]
						},
						{
							"title": "II",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "kls2bpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls2bpjspollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls2BpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls2bpjspollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls2bpjspollaki.sum #"
								},
								{
									"field": "kls2bpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls2bpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls2BpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls2bpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls2bpjsnonpollaki.sum #"
								},
								{
									"field": "kls2lainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:kls2lainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls2LainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls2lainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls2lainlaki.sum #"
								}
							]
						},
						{
							"title": "III",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "kls3bpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls3bpjspollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls3BpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls3bpjspollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls3bpjspollaki.sum #"
								},
								{
									"field": "kls3bpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls2bpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls3BpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls3bpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls3bpjsnonpollaki.sum #"
								},
								{
									"field": "kls3lainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:kls3lainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls3LainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls3lainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls3lainlaki.sum #"
								}
							]
						},
						{
							"title": "ISOLASI",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsisobpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsisobpjspollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIsoBpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsisobpjspollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsisobpjspollaki.sum #"
								},
								{
									"field": "klsisobpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsisobpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIsoBpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsisobpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsisobpjsnonpollaki.sum #"
								},
								{
									"field": "klsisolainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsisolainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIsoLainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsisolainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsisolainlaki.sum #"
								}
							]
						},
						{
							"title": "INTENSIVE",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsintbpjspollaki",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsintbpjspollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIntBpjsPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsintbpjspollaki #</button>",		
									aggregates: ["sum"],
									footerTemplate: " #:data.klsintbpjspollaki.sum #"
								},
								{
									"field": "klsintbpjsnonpollaki",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsintbpjsnonpollaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIntBpjsNonPolLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsintbpjsnonpollaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsintbpjsnonpollaki.sum #"
								},
								{
									"field": "klsintlainlaki",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsintlainlaki #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIntLainLakiDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsintlainlaki #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsintlainlaki.sum #"
								}
							]
						},
						{
							"field": "jumlahL",
							"title": "Jumlah",
							"width": "120px",
							// "template": "<span class='center'>#:jumlahL #</span>",
							"template": "<button class=\"k-button custom-button\" ng-click=\"jmlLDetail(dataItem)\" style=\"margin:0 0 5px\">#: jumlahL #</button>",
							aggregates: ["sum"],
							footerTemplate: " #:data.jumlahL.sum #"
						}
					]
				},
				{
					"title": "TERISI WANITA",
					headerAttributes: { style: "text-align : center" },
					columns:
					[
						{
							"title": "VVIP",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsvvipbpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvvipbpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVvipBpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvvipbpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvvipbpjspolwanita.sum #"
								},
								{
									"field": "klsvvipbpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvvipbpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVvipBpjsNonPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvvipbpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvvipbpjsnonpolwanita.sum #"
								},
								{
									"field": "klsvviplainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsvviplainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVvipLainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvviplainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvviplainwanita.sum #"
								}
							]
						},
						{
							"title": "VIP",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsvipbpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvipbpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVipBpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvipbpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvipbpjspolwanita.sum #"
								},
								{
									"field": "klsvipbpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsvipbpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVipBpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsvipbpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsvipbpjsnonpolwanita.sum #"
								},
								{
									"field": "klsviplainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsviplainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsVipLainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsviplainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsviplainwanita.sum #"
								}
							]
						},
						{
							"title": "I",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "kls1bpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls1bpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1BpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1bpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls1bpjspolwanita.sum #"
								},
								{
									"field": "kls1bpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls1bpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1BpjsNonPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1bpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls1bpjsnonpolwanita.sum #"
								},
								{
									"field": "kls1lainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:kls1lainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls1LainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls1lainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls1lainwanita.sum #"
								}
							]
						},
						{
							"title": "II",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "kls2bpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls2bpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls2BpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls2bpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls2bpjspolwanita.sum #"
								},
								{
									"field": "kls2bpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls2bpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls2BpjsNonPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls2bpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls2bpjsnonpolwanita.sum #"
								},
								{
									"field": "kls2lainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:kls2lainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls2LainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls2lainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls2lainwanita.sum #"
								}
							]
						},
						{
							"title": "III",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "kls3bpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls3bpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls3BpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls3bpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls3bpjspolwanita.sum #"
								},
								{
									"field": "kls3bpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:kls3bpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls3BpjsNonPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls3bpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls3bpjsnonpolwanita.sum #"
								},
								{
									"field": "kls3lainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:kls3lainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKls3LainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: kls3lainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.kls3lainwanita.sum #"
								}
							]
						},
						{
							"title": "ISOLASI",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsisobpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsisobpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIsoBpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsisobpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsisobpjspolwanita.sum #"
								},
								{
									"field": "klsisobpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsisobpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlIsoBpjsNonPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsisobpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsisobpjsnonpolwanita.sum #"
								},
								{
									"field": "klsisolainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsisolainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIsoLainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsisolainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsisolainwanita.sum #"
								}
							]
						},
						{
							"title": "INTENSIVE",
							headerAttributes: { style: "text-align : center" },
							columns:
							[
								{
									"field": "klsintbpjspolwanita",
									"title": "BPJS POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsintbpjspolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIntBpjsPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsintbpjspolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsintbpjspolwanita.sum #"
								},
								{
									"field": "klsintbpjsnonpolwanita",
									"title": "BPJS NON POL",
									"width": "120px",
									// "template": "<span class='center'>#:klsintbpjsnonpolwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIntBpjsNonPolWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsintbpjsnonpolwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsintbpjsnonpolwanita.sum #"
								},
								{
									"field": "klsintlainwanita",
									"title": "LAIN - LAIN",
									"width": "120px",
									// "template": "<span class='center'>#:klsintlainwanita #</span>",
									"template": "<button class=\"k-button custom-button\" ng-click=\"jmlKlsIntLainWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: klsintlainwanita #</button>",
									aggregates: ["sum"],
									footerTemplate: " #:data.klsintlainwanita.sum #"
								}
							]
						},
						{
							"field": "jumlahwanita",
							"title": "Jumlah",
							"width": "120px",
							// "template": "<span class='center'>#:jumlahwanita #</span>",
							"template": "<button class=\"k-button custom-button\" ng-click=\"jmlWanitaDetail(dataItem)\" style=\"margin:0 0 5px\">#: jumlahwanita #</button>",
							aggregates: ["sum"],
							footerTemplate: " #:data.jumlahwanita.sum #"
						}
					]
				}
			],
			sortable: {
				mode: "single",
				allowUnsort: false,
			},
			pageable: {
				messages: {
					display: "Menampilkan {0} - {1} data dari {2} data"
				},
				refresh: true,
				pageSizes: true,
				buttonCount: 5
			},
		};
		$scope.columnPasienDetail =
                {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:P1"];
                        sheet.name = "Laporan";

                        var myHeaders = [
                            {
                                value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                            }
                        ];
                        sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
                    },
                    selectable: 'row',
                    sortable: false,
                    reorderable: true,
                    filterable: false,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,
                    columns:
                        [
                            {
                                "field": "namaruangan",
                                "title": "Nama Ruangan",
                                "width": "50px"
                            },
                            {
                                "field": "tglregistrasi",
                                "title": "Tanggal Registrasi",
                                "width": "50px"
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px"
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px"
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px"
                            },
							{
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px"
                            },
							{
                                "field": "namakamar",
                                "title": "Kamar",
                                "width": "50px"
                            },
							{
                                "field": "reportdisplay",
                                "title": "Bed",
                                "width": "50px"
                            },
							{
                                "field": "namakelas",
                                "title": "Kelas",
                                "width": "50px"
                            },
							{
                                "field": "namarekanan",
                                "title": "Jaminan",
                                "width": "50px"
                            }
                        ],
                        sortable: {
                            mode: "single",
                            allowUnsort: false,
                        },
                        pageable: {
                            messages: {
                                display: "Menampilkan {0} - {1} data dari {2} data"
                            },
                            refresh: true,
                            pageSizes: true,
                            buttonCount: 5
                        },
                };

				$scope.jmlKlsVvipBpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=1";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVvipBpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=2";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVvipLainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=3";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVipBpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=4";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVipBpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=5";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVipLainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=6";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls1BpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=7";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls1BpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=8";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls1LainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=9";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls2BpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=10";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls2BpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=11";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls2LainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=12";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls3BpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=13";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls3BpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=14";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls3LainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=15";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIsoBpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=16";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIsoBpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=17";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIsoLainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=18";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIntBpjsPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=19";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIntBpjsNonPolLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=20";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIntLainLakiDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=21";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: detailsreal.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlLDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=22";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVvipBpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=23";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVvipBpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=24";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVvipLainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=25";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVipBpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=26";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVipBpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=27";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsVipLainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=28";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls1BpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=29";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls1BpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=30";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls1LainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=31";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls2BpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=32";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls2BpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=33";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls2LainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=34";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls3BpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=35";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls3BpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=36";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKls3LainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=37";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIsoBpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=38";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIsoBpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=39";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIsoLainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=40";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIntBpjsPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=41";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIntBpjsNonPolWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=42";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlKlsIntLainWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=43";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}
				$scope.jmlWanitaDetail = function (dataPasienSelected) {
					var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
            		var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
					var link = "registrasi/laporan/get-sensus-harian-detail?"
					var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
					var setParam = "&setParam=44";
					$scope.isRouteLoading = true;
					medifirstService.get(link
						+ "tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ tempRuanganId
						+ setParam).then(function (data) {
							$scope.popUpDetail.center().open();
							$scope.isRouteLoading = false;
							// details = data.data.data;
							var details = data.data.data;
							var detailsreal = []
							detailsreal.push(details[0])
							for (var x = 1; x < details.length; x ++){
								var sama = false
								var noregistrasi = details[x].noregistrasi
								var noregistrasireal = detailsreal[detailsreal.length - 1].noregistrasi
								var namakamar = details[x].namakamar
								var namakamarreal = detailsreal[detailsreal.length - 1].namakamar
								if(noregistrasi == noregistrasireal){
									sama = true
								}
								if ( sama == false ){
									detailsreal.push(details[x])
								}
							}
							$scope.dataPasienDetail = {
								// data: data.data.data,
								data: detailsreal,
								pageSize: 10,
								// total: data.length,
								total: details.length,
								serverPaging: false,
								schema: {
									model: {
										fields: {

										}
									}
								}, aggregate : [
									
								],
								refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
							}
						})
				}

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
            
            $scope.cetakLap = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));				
				var stt = 'false'
				if (confirm('View Laporan Sensus Harian Rawat Inap? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-sensusharianranap=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
                });
            }
            //** BATAS SUCI */
        }
    ]);
}); 