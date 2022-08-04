define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('FormulirDataAntemortemCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window', '$state',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window, $state) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.model = {};
        $scope.button = true;
        var foto = [];
        var foto2 = [];
        var foto3 = [];
        var foto4 = [];
        var foto5 = [];
        var foto6 = [];
        var jenisbencana = '';
        var tglbencana = '';
        $scope.block = false;
        $scope.now = new Date();
        var pegawai = medifirstService.getPegawaiLogin()
        // $scope.blabla = false
        // $scope.blabla2 = true
        
        // $scope.now = new Date();

        // $scope.item.tgllahir = moment($scope.now).format('YYYY-MM-DD HH:mm')
        $scope.isi = true;
        $scope.petugasdalam = true;
        $scope.petugasluar = false;
        loadCombo()

        
        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisKelamin = dat.data.jeniskelamin
                $scope.listSidikJari = dat.data.sidikjari
                $scope.listGigi = dat.data.gigi
                $scope.listDNA = dat.data.dna
                $scope.listHubunganKeluarga = dat.data.hubunganKeluarga
                $scope.listSuku = dat.data.suku
                $scope.listJenisBencana = dat.data.jenisbencana
                $scope.item.jenisbencana = {id: dat.data.jenisbencana[0].id, jenisbencana: dat.data.jenisbencana[0].jenisbencana}
                $scope.listPetugas = dat.data.petugas
                $scope.item.petugasinputdata = {id: pegawai.id, namalengkap: pegawai.namaLengkap}
                debugger
            })
        }
        function loadComboSuku() {
            medifirstService.get('jenazah/dvi/get-suku').then(function(dat) {
                $scope.listSuku = dat.data.suku
            })
        }
        $scope.welcome = true;
        $scope.isi = false;
        $scope.welcome = function () {
            $scope.popUpJenisBencana.center().open();
            // $scope.welcome = false;
            // $scope.isi = true;
        }
        $scope.simpanBencana = function () {
            toastr.success('Mapping Jenis Bencana Sukses !');
            $scope.welcome = false;
            $scope.isi = true;
            $scope.popUpJenisBencana.close();
        }
        $scope.$watch('model.cekpilihManual', function(value) {
            if (value == true) {
                $scope.petugasdalam = false;
                $scope.petugasluar = true;
            } else {
                $scope.petugasdalam = true;
                $scope.petugasluar = false;
            }
        })
        $scope.$watch('item.warganegara', function(value) {
            debugger
            if (value == 2) {
                $scope.item.suku = {id: "0", suku: "-"}
                $scope.block = true;
            } else {
                $scope.block = false;
            }
         });
         $scope.$watch('item.pelapor', function(value) {
             var pelapor = $scope.item.pelapor.toUpperCase()
             $scope.item.pelapor = pelapor
         })
         $scope.$watch('item.dilapor', function(value) {
             var dilapor = $scope.item.dilapor.toUpperCase()
             $scope.item.dilapor = dilapor
         })
        $scope.item.ciricirifisik = "TB/BB:  cm /   kg \n\nGol Darah: \n\nBentuk Wajah: \n\nRambut: \n\nMata: \n\nHidung: \n\nMulut: \n\nTelinga: \n\nBagian Tubuh Yang Khas:"
        $scope.item.barangkepemilikan = "Baju/Atasan: (Warna, motif, jenis bahan, model, dll) \n\nCelana/Bawahan: (Warna, motif, jenis bahan, model, dll) \n\nAsesoris: (Topi, Kalung, Tas, Dompet, Gelang, Jam, Sabuk, Alas Kaki, dll) \n\nLainnya: "
        
        // medifirstService.get('jenazah/dvi/get-mapping-jenis-bencana-to-formulir-antemortem?').then(function(dat) {
        //     debugger;
        //     jenisbencana = dat.data[0].idjenisbencana
        // })
        $scope.uploadFileDNA = function () {
            $scope.popupUploadFile.center().open();
            $scope.item.jenisfaskes = "resumse_medis"
            $scope.item.pesanerror = "TES !"
        }
        $scope.upload = function () {
            debugger
            var tes = [];
            // for (var i = 0; i < tampungan.length; i++) {
            //     tes.push(document.getElementById("base64textarea").name)
            // }
            console.log(document.getElementById("base64textarea").value)
            var a = document.getElementById("base64textarea").value
            var b = document.getElementById("base64textarea").name
            var dt1 = {}
            var dt2 = []
            // for (var i = dataSave.length - 1; i >= 0; i--) {

            dt1 = {
                "method": "file_upload",
                "noregistrasi": $scope.item.noregistrasi,
                "file_name": b,
                "data":  a,
            }
            // dt2.push(dt1)
            // }

            // var objData = {
            // 	"data": dt1
            // }
            // medifirstService.post('radiologi/save-file-dna', dt1).then(function (e) {
            //     responData = e.data.dataresponse[0].dataresponse.metadata.message;
                // toastr.info(responData, 'file_upload');
                // document.getElementById("base64textarea").value = responData
            // })
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
          var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker2').files;
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
              getBase642(files[i]);
              }
            }
        };
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker2').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
          function getBase642(file) {
              debugger
             
             var reader2 = new FileReader();
             reader2.readAsDataURL(file);
             reader2.onload = function () {
            //    tes.push(reader)
               console.log(reader2.result);
               foto2.push({ foto:(reader2.result), id: 1 })
             };
             reader2.onerror = function (error) {
               console.log('Error: ', error);
             };
          }
          var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker3').files;
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
              getBase643(files[i]);
              }
            }
        };
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker3').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
          function getBase643(file) {
              debugger
             
             var reader3 = new FileReader();
             reader3.readAsDataURL(file);
             reader3.onload = function () {
            //    tes.push(reader)
               console.log(reader3.result);
               foto3.push({ foto:(reader3.result), id: 2 })
             };
             reader3.onerror = function (error) {
               console.log('Error: ', error);
             };
          }
          var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker4').files;
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
              getBase644(files[i]);
              }
            }
        };
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker4').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
          function getBase644(file) {
              debugger
             
             var reader4 = new FileReader();
             reader4.readAsDataURL(file);
             reader4.onload = function () {
            //    tes.push(reader)
               console.log(reader4.result);
               foto4.push({ foto:(reader4.result), id: 3 })
             };
             reader4.onerror = function (error) {
               console.log('Error: ', error);
             };
          }//
          var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker5').files;
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
              getBase645(files[i]);
              }
            }
        };
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker5').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
          function getBase645(file) {
              debugger
             
             var reader5 = new FileReader();
             reader5.readAsDataURL(file);
             reader5.onload = function () {
            //    tes.push(reader)
               console.log(reader5.result);
               foto5.push({ foto:(reader5.result), id: 4 })
             };
             reader5.onerror = function (error) {
               console.log('Error: ', error);
             };
          }//
          var handleFileSelect = function (file) {
            var files = document.getElementById('filePicker6').files;
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
              getBase646(files[i]);
              }
            }
        };
        
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker6').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
          function getBase646(file) {
              debugger
             
             var reader6 = new FileReader();
             reader6.readAsDataURL(file);
             reader6.onload = function () {
            //    tes.push(reader)
               console.log(reader6.result);
               foto6.push({ foto:(reader6.result), id: 5 })
             };
             reader6.onerror = function (error) {
               console.log('Error: ', error);
             };
          }
          $scope.save = function() {
              debugger
            if ($scope.model.cekpilihManual != true) {
                if ($scope.item.petugaswawancara == undefined || $scope.item.teleponwawancara == undefined || $scope.item.tglwawancara == undefined || $scope.item.teleponinputdata == undefined) {
                    if ($scope.item.petugaswawancara == undefined) {
                        toastr.error('Petugas Wawancara Belum Diinput !')
                    };
                    
                    if ($scope.item.teleponwawancara == undefined) {
                        toastr.error('No Telepon Petugas Wawancara Belum Diinput !')
                        
                    };
                    if ($scope.item.tglwawancara == undefined) {
                        toastr.error('Tanggal Wawancara Belum Diinput !')
                        
                    };
                    if ($scope.item.teleponinputdata == undefined) {
                        toastr.error('No Telepon Petugas Input Data Harus Diisi !')
                        
                    };
                    return
                } else {

                }
            } else {
                if ($scope.item.petugaswawancaraluar == undefined || $scope.item.teleponwawancara == undefined || $scope.item.tglwawancara == undefined || $scope.item.teleponinputdata == undefined) {
                    if ($scope.item.petugaswawancaraluar == undefined) {
                        toastr.error('Petugas Wawancara Belum Diinput !')
                    };
                    
                    if ($scope.item.teleponwawancara == undefined) {
                        toastr.error('No Telepon Petugas Wawancara Belum Diinput !')
                        
                    };
                    if ($scope.item.tglwawancara == undefined) {
                        toastr.error('Tanggal Wawancara Belum Diinput !')
                        
                    };
                    if ($scope.item.teleponinputdata == undefined) {
                        toastr.error('No Telepon Petugas Input Data Harus Diisi !')
                        
                    };
                    return
                } else {

                }
            }
            if ($scope.item.petugaswawancara == undefined) {
                $scope.item.petugaswawancara = {
                    id: null
                }
            }
            
            var tanggal = $scope.now;
            var tanggalLahir = new Date($scope.item.tgllahir);
            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
            umurs = umurs.year + ' Tahun ' + umurs.month + ' Bulan ' + umurs.day + ' Hari'
            debugger
              var save = {
                  foto: foto,
                  foto2: foto2,
                  foto3: foto3,
                  foto4: foto4,
                  foto5: foto5,
                  foto6: foto6,
                  namapelapor: $scope.item.pelapor,
                  namadilaporkan: $scope.item.dilapor,
                  namapanggilan: $scope.item.panggilan,
                  jeniskelamin: $scope.item.jeniskelamin.id,
                  hubungankeluarga: $scope.item.hubungan.id,
                  tanggallahir: moment($scope.item.tgllahir).format('YYYY-MM-DD HH:mm:ss'),
                  usia: umurs,
                  suku: $scope.item.suku.id,
                  notelepon: $scope.item.telphp,
                  alamat: $scope.item.alamat,
                  sumbersidikjari: $scope.item.sumbersidikjari.id,
                  uraiansidikjari: $scope.item.uraiansidikjari,
                  keterangansidikjari: $scope.item.keterangansidikjari,
                  sumbergigi: $scope.item.sumbergigi.id,
                  uraiangigi: $scope.item.uraiangigi,
                  keterangangigi: $scope.item.keterangangigi,
                  sumberdna: $scope.item.sumberdna.id,
                  uraiandna: $scope.item.uraiandna,
                  keterangandna: $scope.item.keterangandna,
                  ciricirifisik: $scope.item.ciricirifisik,
                  keteranganfisik: $scope.item.keteranganfisik,
                  barangkepemilikan: $scope.item.barangkepemilikan,
                  keteranganbarang: $scope.item.keteranganbarang,
                  jenisbencana: $scope.item.jenisbencana.id,
                  kebangsaan: $scope.item.warganegara,
                  petugaswawancara: $scope.item.petugaswawancara.id,
                  petugaswawancaraluar: $scope.item.petugaswawancaraluar,
                  notelpwawancara: $scope.item.teleponwawancara,
                  tglwawancara: moment($scope.item.tglwawancara).format('YYYY-MM-DD HH:mm:ss'),
                  petugasinput: $scope.item.petugasinputdata.id,
                  notelpinput: $scope.item.teleponinputdata
              }
              medifirstService.post('jenazah/dvi/save-formulir-antemortem', save).then(function(dat) {

              })
          }
    }
])
})