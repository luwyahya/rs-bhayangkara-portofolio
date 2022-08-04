define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('UbahPasswordCtrl', ['$scope', 'ModelItem', 'MedifirstService',
		function ($scope, modelItem, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			init();
			$scope.pegawai = medifirstService.getPegawaiLogin();
			$scope.datauserlogin = medifirstService.getUserLogin();
			$scope.item.namaPegawai = $scope.pegawai.namaLengkap;
			getUserLoginData();

			function getUserLoginData() {
				medifirstService.get("sysadmin/menu/svc-modul?get=loginuser&id=" + $scope.datauserlogin.id).then(function (data) {
					$scope.item.idlogin = data.data.loginuser[0].luid;
					$scope.item.namaUser = data.data.loginuser[0].namauser;					
					$scope.item.kelompokUserHakAkses = { id: data.data.loginuser[0].kuid, kelompokuser: data.data.loginuser[0].kelompokuser };
					$scope.dataGrid = data.data.loginuser[0].data;
				})
			}
			init();

			function init() {
				medifirstService.get("sysadmin/menu/svc-modul?get=kelompokuser").then(function (datapegawai) {
					$scope.listKelompokuser = datapegawai.data;
				});
			}

			$scope.simpan = function () {
				if ($scope.item.idlogin == undefined) {
					alert('Pilih dahullu pegawai!')
					return
				}
				if ($scope.item.kataKunciPass != $scope.item.kataKunciConfirm) {
					alert('Kata kunci tidak sama')
					return
				}

				var objSave = {
					id: $scope.item.idlogin,
					kelompokUser: {
						id: $scope.item.kelompokUserHakAkses.id
					},
					statusLogin: 0,
					kataSandi: $scope.item.kataKunciPass,
					namaUser: $scope.item.namaUser,
					pegawai: {
						id: $scope.pegawai.id
					}
				}

				medifirstService.post('auth/ubah-password', objSave).then(function (e) {
					// manageSarpras.saveLoginUser(objSave).then(function(e) {
				})
			}

			$scope.batal2 = function () {
				window.history.back();
			}



		}
	]
	);
});