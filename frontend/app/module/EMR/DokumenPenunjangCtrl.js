define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DokumenPenunjangCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
    function ($mdDialog, $timeout, $parse, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
        $scope.item = {}
        $scope.cc = {}
        $scope.now = new Date();
        let pdf = []
        let namaFile = '';
        let typeFIle = '';

        SetCacheHelper()

        function SetCacheHelper() {
            medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function(e) {
                var result = e.data.result 
                $scope.header = result
                var arrStr = {
                        0: $scope.header.nocm,
                        1: $scope.header.namapasien,
                        2: $scope.header.jeniskelamin,
                        3: $scope.header.noregistrasi,
                        4: $scope.header.umur,
                        5: $scope.header.kelompokpasien,
                        6: $scope.header.tglregistrasi,
                        7: $scope.header.norec,
                        8: $scope.header.norec_pd,
                        9: $scope.header.objectkelasfk,
                        10: $scope.header.namakelas,
                        11: $scope.header.objectruanganfk,
                        12: $scope.header.namaruangan,
                        13: $scope.checkNoregis,
                        14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                        15: $scope.header.alamatlengkap,
                        16: $scope.header.dokterdpjp,
                        17: $scope.header.iddpjp,
                        18: $scope.header.tgllahir,
                        19: $scope.header.objectkelompokpasienlastfk,
                        20: $scope.header.golongandarah,
                        21: $scope.header.namarekanan,
                        22: $scope.header.objectrekananfk,
                        23: $scope.header.objectdepartemenfk,
                        24: $scope.header.ruanganterakhir,
                        25: $scope.header.nocmfk,
                        26: $scope.header.objectagamafk,
                        27: $scope.header.agama,
                        28: $scope.header.objectpendidikanfk,
                        29: $scope.header.pendidikan,
                        30: $scope.header.objectpekerjaanfk,
                        31: $scope.header.pekerjaan
                    }
                    cacheHelper.set('cacheRMelektronik', arrStr); 
                    LoadCacheHelper();
            })
        }
        function LoadCacheHelper() {
            var chacePeriode = cacheHelper.get('cacheRMelektronik');
            if (chacePeriode != undefined) {
                //var arrPeriode = chacePeriode.split(':');
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[13]
                $scope.cc.tglLahir = chacePeriode[14]
                $scope.cc.nocmfk = chacePeriode[25]
                $scope.item.ruanganAsal = $scope.cc.namaruangan
                LoadData()
            }
        }
        var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker').files;
            
            for (var i = 0; i < files.length; i++) {
                //cek filenya
                
                if (files[i].size > 3145728) {
                    alert('Ukuran foto tidak boleh lebih dari 3 MB!')
                    return
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
            if(pdf.length > 0) {
                pdf.splice(pdf, 1)
            }
               console.log(reader.result);
               pdf.push(reader.result);
               namaFile = file.name
               typeFIle = file.type
             };
             reader.onerror = function (error) {
               console.log('Error: ', error);
             };
          }
          function LoadData() {
            medifirstService.get('registrasi/get-dokumen-penunjang?nocmfk=' + $scope.cc.nocmfk + '&jenisdokumen=68').then(function(dat) {
                for (let i = 0; i < dat.data.length; i ++) {
                    dat.data[i].no = i + 1;
                }
                $scope.sourceEkg = new kendo.data.DataSource({
                    data: dat.data,
                    length: dat.data.length,
                    pageSize: 20
                });
            })
          }
          $scope.gridEkg = {
              pageable: true,
              scrollable: true,
              columns: [
                  { field: "no", title: "No", width: 40 },
                  { field: "nocm", title: "No RM", width: 120 },
                  { field: "noregistrasi", title: "No Registrasi", width: 120 },
                  { field: "namapasien", title: "Nama Pasien", width: 150 },
                  { field: "namaruangan", title: "Ruangan", width: 120 },
                  { field: "namalengkap", title: "User Upload", width: 120 },
                  { field: "tglupload", title: "Tgl Upload", width: 150 },
                  { field: "namapemeriksaan", title: "Nama Pemeriksaan", width: 150 },
                  { field: "keterangan", title: "Keterangan", width: 150 },
                  { "title": "Hasil","width": "100px","template": "<button class=\"k-button custom-button\" ng-click=\"lihatHasil(dataItem)\" style=\"margin:0 0 5px\">Lihat Hasil</button>", },
                  { "title": "Hapus","width": "100px","template": "<button class=\"k-button custom-button\" ng-click=\"hapusGrid(dataItem)\" style=\"margin:0 0 5px\">Hapus</button>", },
              ],
          };
          $scope.lihatHasil = function (dataItem) {
            const win = window.open("", "_blank");
            
            win.document.write("<html><body><h3>Loading dokumen...</h3></body></html>");

            medifirstService.get('registrasi/ambil-dokumen?norec=' + dataItem.norec_doc).then(function(dat) {
                let dokumen = dat.data[0].dokumen;
                let type = dat.data[0].type;
                let html = '';

                html += '<html>';
                html += '<head><title>Lihat Hasil</title></head>';
                html += '<body style="margin:0!important; display:flex; justify-content:center; height:100vh; background-color:#333;">';
                
                if (type.includes('image')) {
                    html += '<img style="max-width:100%; max-height:100%; object-fit:contain;" src="' + dokumen + '" />';
                } else {
                    html += '<embed width="100%" height="100%" src="' + dokumen + '" type="' + type + '" />';
                }
                
                html += '</body>';
                html += '</html>';

                win.document.open();
                win.document.write(html);
                win.document.close(); // Ini kunci utama agar tidak blank

            }).catch(function(err) {
                win.document.open();
                win.document.write("<html><body><h3>Gagal memuat dokumen.</h3></body></html>");
                win.document.close();
            });
        }
          $scope.simpan = function () {
            let objSave = {
                objectruanganfk: $scope.cc.objectruanganfk,
                norec_pd: $scope.cc.norec_pd,
                norec_apd: $scope.cc.norec,
                dokumen: pdf[0],
                nocmfk: $scope.cc.nocmfk,
                namafile: namaFile,
                namapemeriksaan: $scope.item.namaPemeriksaan,
                keterangan: $scope.item.keterangan,
                jenisdokumenfk: 68,
                type: typeFIle
            }
            medifirstService.post('registrasi/save-dokumen-penunjang', objSave).then(function(e) {
                pdf = [];
                namaFile = '';
                $scope.item.namaPemeriksaan = '';
                $scope.item.keterangan = '';
                LoadData()
            })
        }
        $scope.hapusGrid = function(dataItem) {
            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Peringatan, Anda yakin akan menghapus pengkajian yang dipilih?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                medifirstService.post('registrasi/delete-ekg-pasien?norec=' + dataItem.norec_doc).then(function(e) {
                                    debugger
                                    LoadData()
                                });
                            })

        }
    } //BATAS SUCI
])
})