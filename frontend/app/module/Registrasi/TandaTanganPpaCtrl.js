define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('TandaTanganPpaCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window', '$state',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window, $state) {
        $scope.item = {}
        $scope.dataSelected = {}
        let foto = []

        loadCombo()
        loadData()

        function loadCombo() {
            medifirstService.getPart("registrasi/get-pegawai-part-2", true, true, 10).then(function(data) {
                $scope.listPegawai = data;
            });
        }
        function loadData() {
            let idPegawai = ""
            if ($scope.item.pegawaiSearch != undefined) {
                idPegawai = $scope.item.pegawaiSearch.id 
            }
            medifirstService.get('registrasi/get-ttd-ppa-all?idPegawai=' + idPegawai).then(function(dat) {
                for(let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1;
                }
                $scope.sourceTtd = new kendo.data.DataSource({
                    data: dat.data,
                    length: dat.data.length,
                    pageSize: 20
                });
            })
			$scope.gridTtd = {
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "no", title: "No", width: 40 },
					{ field: "namapegawai", title: "Nama Pegawai", width: 120 },
					{ field: "tglupload", title: "Tgl Upload", width: 120 },
					{ field: "petugasupload", title: "Petugas Upload", width: 150 },
					{ title: "", width: 150, "template": "<button class=\"k-button custom-button\" ng-click=\"klikaku(dataItem)\" style=\"margin:0 0 5px\">Lihat TTD</button>", },
					{ title: "", width: 150, "template": "<button class=\"k-button custom-button\" ng-click=\"DownloadAku(dataItem)\" style=\"margin:0 0 5px\">Download TTD</button>", },

				],
			};
        }
        
        var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker').files;
            debugger
            for (var i = 0; i < files.length; i++) {
                //cek filenya
                if (files[i].size > 4194304) {
                    alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                    $scope.button = false;
                    return
                } else {
                    $scope.button = true;
                }
            }
            if (files.length > 0) {
              for (var i = 0; i < files.length; i++) {
              getBase64(files[i]);
              }
            }
        };
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
          function getBase64(file) {
              debugger
             
             var reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = function () {
            //    tes.push(reader)
               console.log(reader.result);
               foto.push({ foto:(reader.result), id:null })
             };
             reader.onerror = function (error) {
               console.log('Error: ', error);
             };
          }
        
          $scope.simpanBeneran = function() {
              if ($scope.item.pegawai == undefined) {
                  toastr.error('Pegawai belum dipilih !', 'Peringatan !')
                  return
              }
              debugger
              let objSave = {
                  idPegawai: $scope.item.pegawai.id,
                  ttd: foto
              }
              medifirstService.post('registrasi/save-ttd-ppa', objSave).then(function(e) {
                if (e.status == 201) {
                    loadData()
                    foto = []
                }
              })
          }
          $scope.search = function() {
            loadData()
          }
          $scope.tambahData = function() {
            $scope.popUpTambahTandaTangan.center().open()
          }
          $scope.hapusData = function() {
            if ($scope.dataSelected.norec == undefined) {
                toastr.error('Data Belum Dipilih !')
                return
            }
            let objSave = {
                norec: $scope.dataSelected.norec
            }
            medifirstService.post('registrasi/delete-ttd-ppa', objSave).then(function(e) {
                if (e.status == 201) {
                    loadData()
                }
            })
        }
        $scope.klikaku = function (dataItem) {
            medifirstService.get('registrasi/get-ttd-ppa-1?norec=' + dataItem.norec).then(function(dat) {
                const win = window.open("","_blank");
                let html = '';
    
                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="'+dat.data[0].tandatangan+'" type="image/jpeg" />';
                html += '</body>';
                html += '</html>';
    
                setTimeout(() => {
                win.document.write(html);
                }, 0);
            })
        }
        $scope.DownloadAku = function (dataItem) {
            medifirstService.get('registrasi/get-ttd-ppa-1?norec=' + dataItem.norec).then(function(dat) {
                // const win = window.open("","_blank");
                // let html = '';
    
                // html += '<html>';
                // html += '<body style="margin:0!important">';
                // html += '<embed width="100%" height="100%" src="'+dat.data[0].tandatangan+'" type="image/jpeg" />';
                // html += '</body>';
                // html += '</html>';
    
                // setTimeout(() => {
                // win.document.write(html);
                // }, 0);

                let a = document.createElement("a");
                a.href =dat.data[0].tandatangan;
                a.download = "tandatangan"
                a.click();


            })
        }
    }
])
})