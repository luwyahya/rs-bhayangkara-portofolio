define(["initialize"], function (initialize) {
  "use strict";
  initialize.controller("AsesmenRisikoJatuhHumptyDumptyCtrl", [
    "$mdDialog",
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    function ($mdDialog, $q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
      $scope.item = {};
      $scope.item.obj = [];
      $scope.cc = {};
      $scope.cc.emrfk = 2154;
      $scope.item.obj[98] = new Date();
      $scope.item.totalSkor = 0;
      $scope.item.kesimpulan = "";

      var paramSearch = "";
      $scope.isSave = true;

      LoadCacheHelper();
      function LoadCacheHelper() {
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
          $scope.cc.norec_emr = "-";
          $scope.cc.jenisemr = "asesmenrisikojatuhhumptydumpty";
          paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;

          init();
        }
      }

      $scope.listPegawai = [];
      medifirstService.get("emr/get-combo").then(function (data) {
        $scope.listPegawai = data.data.pegawai;
      });

      function init() {
        $scope.isLoading = true;
        medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=" + $scope.cc.jenisemr, true).then(function (dat) {
          $scope.isRouteLoading = false;
          if (dat.data.data.length > 0) {
            $scope.isSave = false;
            $scope.cc.noemr = dat.data.data[0].noemr;
            $scope.cc.norec_emr = dat.data.data[0].noemr;
            setobjectToModel($scope.cc.noemr, $scope.cc.emrfk);
          } else {
            $scope.isLoading = false;
          }
        });
      }

      function setobjectToModel(nomorEMRSS, emrfk) {
        medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
          $scope.isLoading = false;
          var dataLoad = dat.data.data;
          for (var i = 0; i <= dataLoad.length - 1; i++) {
            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
              if (dataLoad[i].type == "checkbox") {
                var chekedd = false;
                if (dataLoad[i].value == "1" || dataLoad[i].value == "true") {
                  chekedd = true;
                }
                $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
              } else if (dataLoad[i].type == "combobox") {
                var str = dataLoad[i].value;
                if (str != null) {
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] !== undefined ? res[1] : res[0] };
                }
              } else if (dataLoad[i].type == "datetime") {
                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).toDate();
              } else {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              }
            }
          }
          // Hitung ulang total skor berdasarkan checkbox yang di-load
          $scope.hitungSkor(0, []);
        });
      }

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
        var skorMap = {
          1: 4, 2: 3, 3: 2, 4: 1,
          5: 2, 6: 1,
          7: 4, 8: 3, 9: 2, 10: 1,
          11: 3, 12: 2, 13: 1,
          14: 4, 15: 3, 16: 2, 17: 1,
          18: 3, 19: 2, 20: 1,
          21: 3, 22: 2, 23: 1
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

      $scope.Save = function () {
        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan menyimpan data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.Saveok();
        });
      };

      $scope.Saveok = function () {
        $scope.isLoading = true;
        var arrSave = [];

        if ($scope.item.obj[98]) {
          $scope.item.obj[98] = moment($scope.item.obj[98]).format("YYYY-MM-DD HH:mm");
        }

        var arrobj = Object.keys($scope.item.obj);
        for (let i = arrobj.length - 1; i >= 0; i--) {
          var currentId = arrobj[i];
          var currentObj = $scope.item.obj[parseInt(currentId)];

          if (currentObj != undefined && currentObj !== "" && currentObj !== false) {
            if (currentId == 99 && typeof currentObj === 'object') {
              arrSave.push({ id: currentId, values: currentObj ? { value: currentObj.id, text: currentObj.namalengkap } : null });
            } else {
              arrSave.push({ id: currentId, values: currentObj });
            }
          }
        }

        $scope.cc.jenisemr = "asesmenrisikojatuhhumptydumpty";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave
        };

        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
          $scope.noemr = e.data.data.noemr;
          medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Skala Risiko Jatuh Humpty Dumpty dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
            var arrStr = {
              0: $scope.noemr,
            };
            cacheHelper.set("cacheNomorEMR", arrStr);
            $scope.isLoading = false;
            window.history.back(); // kembali setelah simpan
          });
        });
      };

    }
  ]);
});
