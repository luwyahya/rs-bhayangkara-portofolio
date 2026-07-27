define(["initialize"], function (initialize) {
  "use strict";
  initialize.controller("AsesmenRisikoJatuhHumptyDumptyCtrl", [
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
      $scope.item = {};
      $scope.item.obj = [];
      $scope.cc = {};
      $scope.cc.emrfk = 2154;
      $scope.item.tglAsesmen = new Date();
      $scope.item.totalSkor = 0;
      $scope.item.kesimpulan = "";

      var paramSearch = "";
      var chacePeriode = cacheHelper.get("cacheRMelektronik");
      if (chacePeriode != undefined) {
        $scope.cc.nocm = chacePeriode[0];
        $scope.cc.namapasien = chacePeriode[1];
        $scope.cc.jeniskelamin = chacePeriode[2];
        $scope.cc.noregistrasi = chacePeriode[3];
        $scope.cc.umur = chacePeriode[4];
        $scope.cc.kelompokpasien = chacePeriode[5];
        $scope.cc.tglregistrasi = chacePeriode[6];
        $scope.cc.norec = chacePeriode[7];
        $scope.cc.norec_pd = chacePeriode[8];
        $scope.cc.objectkelasfk = chacePeriode[9];
        $scope.cc.namakelas = chacePeriode[10];
        $scope.cc.objectruanganfk = chacePeriode[11];
        $scope.cc.namaruangan = chacePeriode[12];
        $scope.cc.DataNoregis = chacePeriode[13];
        paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
      }

      $scope.listPegawai = [];
      // Ambil data pegawai untuk combobox
      medifirstService.get("emr/get-pegawai-part").then(function (dat) {
        $scope.listPegawai = dat.data;
      });

      // Fungsi hitung skor dan exclusive checkbox (mirip radio button)
      $scope.hitungSkor = function (idChecked, arrGroup) {
        if ($scope.item.obj[idChecked]) {
          // Uncheck others in the same group
          for (var i = 0; i < arrGroup.length; i++) {
            if (arrGroup[i] !== idChecked) {
              $scope.item.obj[arrGroup[i]] = false;
            }
          }
        }

        var total = 0;
        // Mapping ID checkbox ke Nilai Skor 
        // (Ubah key ID di bawah ini jika ID item database sudah disesuaikan!)
        var skorMap = {
          1: 4, 2: 3, 3: 2, 4: 1, // Usia
          5: 2, 6: 1, // Jenis Kelamin
          7: 4, 8: 3, 9: 2, 10: 1, // Diagnosis
          11: 3, 12: 2, 13: 1, // Kognitif
          14: 4, 15: 3, 16: 2, 17: 1, // Lingkungan
          18: 3, 19: 2, 20: 1, // Pembedahan/Sedasi
          21: 3, 22: 2, 23: 1 // Medikamentosa
        };

        for (var key in skorMap) {
          if ($scope.item.obj[key]) {
            total += skorMap[key];
          }
        }

        $scope.item.totalSkor = total;

        if (total >= 7 && total <= 11) {
          $scope.item.kesimpulan = "Risiko Rendah";
        } else if (total >= 12) {
          $scope.item.kesimpulan = "Risiko Tinggi";
        } else {
          $scope.item.kesimpulan = "";
        }
      };

      $scope.Saveok = function () {
        var arrSave = [];

        for (var key in $scope.item.obj) {
          if ($scope.item.obj.hasOwnProperty(key)) {
            var value = $scope.item.obj[key];
            if (value !== undefined && value !== "" && value !== false) {
              // Handle combo box pegawai (menggunakan ID dummy 99)
              if (key == 99 && typeof value === 'object') {
                arrSave.push({ id: key, values: { value: value.id, text: value.namalengkap } });
              } else {
                arrSave.push({ id: key, values: value });
              }
            }
          }
        }

        // Push hasil total skor & kesimpulan jika butuh disimpan sebagai element
        // arrSave.push({ id: ID_TOTAL, values: $scope.item.totalSkor });

        var jsonSave = {
          head: {
            nocm: $scope.cc.nocm,
            noregistrasi: $scope.cc.noregistrasi,
            waktuevaluasi: dateHelper.formatDate($scope.item.tglAsesmen, "YYYY-MM-DD HH:mm:ss"),
            idpegawai: $scope.item.obj[99] ? $scope.item.obj[99].id : "",
            objectpegawaifk: $scope.item.obj[99] ? $scope.item.obj[99].id : "",
            objectruanganfk: $scope.cc.objectruanganfk,
            objectkelasfk: $scope.cc.objectkelasfk,
            keterangankeluar: ""
          },
          data: arrSave
        };

        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
          // Handling success
        });
      };

    }
  ]);
});
