define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DashboardPMKPCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {
			$scope.item = {}
			$scope.isRouteLoading = false
			$scope.dataSource = []
			$scope.imagePath = '../app/images/svg/washedout.png'
			var temp = []
			$scope.Save = function () {
				if ($scope.item.judul == undefined) return
				if ($scope.item.isi == undefined) return
				var data = {
					'norec': $scope.item.norec != undefined ? $scope.item.norec : '',
					'judul': $scope.item.judul,
					'isi': $scope.item.isi,
					'keterangan': $scope.item.sumber,
					'image': $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null
				}
				medifirstService.post('pmkp/save-data-pmkp', data).then(function (e) {
					load()
					$scope.myVar = 0
				})
			}
			load()
			function load() {
				var isi = ''
				var judul = ''
				$scope.isRouteLoading = true
				medifirstService.get('pmkp/get-riwayat?isi=' + isi + '&judul=' + judul).then(function (e) {
					if (e.data.length == 0)
						toastr.info('Data Tidak ada')
					$scope.dataSource = e.data
					temp = $scope.dataSource
					$scope.isRouteLoading = false
				})
			}
			$scope.showPopUp = function () {
				$scope.popUpUpload.center().open()
			}

			function DialogController($scope, $mdDialog, dataToPass) {
				// debugger
				// var mdDialogCtrl = function ($scope, dataToPass) { 
				$scope.mdDialogData = dataToPass
				// }
				$scope.hide = function () {
					$mdDialog.hide();
				};

				$scope.cancel = function () {
					$mdDialog.cancel();
				};

				$scope.answer = function (answer) {
					$mdDialog.hide(answer);
				};
			}
			$scope.show = function (data) {

				$mdDialog.show({
					locals: { dataToPass: data },
					controller: DialogController,
					templateUrl: 'module/PMKP/templatedialog.html',
					parent: angular.element(document.body),
					targetEvent: data,
					clickOutsideToClose: true
				})
				// $mdDialog.show(
				//   $mdDialog.alert()
				// 	.clickOutsideToClose(true)
				// 	.title(data.judul)
				// 	.textContent(data.isi)
				// 	.ariaLabel('Left to right demo')
				// 	.ok('Tutup!')
				// 	// You can specify either sting with query selector
				// 	.openFrom('#left')
				// 	// or an element
				// 	.closeTo(angular.element(document.querySelector('#right')))
				// );
			}
			$scope.UploadPhoto = function () {
				if ($scope.urlImage != undefined) {
					// saveImageToDirsaveImageToDir($scope.urlImage,'0182781')
					$scope.item.image = $scope.urlImage
					$scope.popUpUpload.close()
				} else {
					toastr.info('Gambar belum di pilih')
					return
				}
			}
			$scope.TutupPopUp = function () {

				if ($scope.urlImage != undefined)
					$scope.item.image = "../app/images/svg/no-image.svg"
				$scope.urlImage = undefined
				$scope.popUpUpload.close()
			}
			$scope.edit = function (select) {
				// load()
				$scope.item.norec = select.norec
				$scope.item.judul = select.judul
				$scope.item.isi = select.isi
				$scope.item.sumber = select.keterangan
				$scope.item.image = select.image
				$scope.myVar = 1
			}

			function filter(input) {
				var input, filter, ul, li, a, i, txtValue;

				filter = input.toUpperCase();

				var data2 = []
				for (i = 0; i < temp.length; i++) {
					a = temp[i].judul

					if (a.toUpperCase().indexOf(filter) > -1) {
						data2.push(temp[i])
					} else {
						data2.splice([i])
					}
				}
				$scope.dataSource = data2
			}
			$scope.$watch('item.cariJudul', function (newValue, oldValue) {
				if (newValue != oldValue) {
					filter(newValue)
				}
			});
			$scope.hapus = function (select) {
				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Apakah yakin mau menghapus data?')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					medifirstService.post('pmkp/delete-data-pmkp', { norec: select.norec }).then(function (e) {
						load()
					})
				})

			}
			$scope.add = function () {
				$scope.item = {}
				$scope.item.image = "../app/images/svg/no-image.svg"
				$scope.myVar = 1
			}
			$scope.Batal = function () {
				$scope.item = {}
				$scope.item.image = "../app/images/svg/no-image.svg"
				$scope.myVar = 0
				load()
			}
			$scope.item.image = '../app/images/svg/no-image.svg'
			$scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return ''
				else
					return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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

			$("#photo").kendoUpload({
				localization: {
					"select": "Pilih Photo..."
				},
				async: {
					saveUrl: "save",
					removeUrl: "remove",
					autoUpload: false
				},
				multiple: false,
				select: function (e) {
					var ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png"];
					var extension = e.files[0].extension.toLowerCase();
					if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
						toastr.error('Mohon Pilih File Gambar (.jpg, .jpeg, .png)')
						e.preventDefault();
						// return
					}



					var fileInfo = e.files[0];
					var wrapper = this.wrapper;
					// debugger
					$scope.ImageUrlData = wrapper.context.value;
					setTimeout(function () {
						addPreview(fileInfo, wrapper);
						compress(e);

					});
					// $scope.previewImage = compress(e);
					// imageToDataUri(e.files[0].rawFile,220,220)
					// console.log(resultPhotoKami)

				}
			});

			function addPreview(file, wrapper) {
				var raw = file.rawFile;
				var reader = new FileReader();

				if (raw) {

					reader.onloadend = function () {
						var preview = $("<img class='img-responsive'>").attr("src", this.result);

						wrapper.find(".k-file[data-uid='" + file.uid + "'] .k-file-extension-wrapper")
							.replaceWith(preview);
						// $scope.item.image = this.result
						// $scope.previewImage = this.result

					};

					reader.readAsDataURL(raw);
					// const img = new Image();
				}
			}


			function compress(e) {
				var width = 220;
				var height = 220;
				var fileName = e.files[0].name;
				var reader = new FileReader();
				var raw = e.files[0].rawFile;
				reader.readAsDataURL(raw);
				reader.onload = event => {
					var img = new Image();
					img.src = event.target.result;
					img.onload = () => {
						var elem = document.createElement('canvas');

						elem.width = width;
						elem.height = height;

						var ctx = elem.getContext('2d');
						// img.width and img.height will contain the original dimensions
						ctx.drawImage(img, 0, 0, width, height);
						// console.log(ctx.canvas.toDataURL('image/jpeg',1))
						$scope.urlImage = ctx.canvas.toDataURL('image/jpeg', 1);
						// var res = $scope.urlImage.replace("data:image/jpeg;base64,", "");
						// $scope.urlImage= base64toHEX(res)
						// $scope.resultDecode = Convert(res)
						// $scope.urlImage = 'data:image/jpeg;base64,' + $scope.resultDecode
						// ctx.canvas.toBlob((blob) => {
						//     // link.href = URL.createObjectURL(blob);
						//     console.log(blob);
						//     // console.log(link.href); // this lin
						//     var file = new File([blob], fileName, {
						//         type: 'image/jpeg',
						//         lastModified: Date.now()
						//     });

						// }, 'image/jpeg', 1);
					},
						reader.onerror = error => console.log(error);
				};
			}

			//emd
		}
	]);
});