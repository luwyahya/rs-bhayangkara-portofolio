define(['initialize', 'Configuration'], function (initialize, configuration) {
  'use strict';
  initialize.controller('InputMenuGiziCtrl', ['$scope', '$parse', '$state', 'MedifirstService', 'CacheHelper',
    function ($scope, $parse, $state, medifirstService, cacheHelper) {
      $scope.now = new Date();
      $scope.currentNorecPD = $state.params.norecPD;
      $scope.currentNorecAPD = $state.params.norecAPD;
      $scope.item = {};
      $scope.item.tglPelayanan = $scope.now;
      $scope.isNext = true;
      $scope.isKembali = true;
      $scope.isBatal = true;
      $scope.item.pasiens = [];
      $scope.tglregistrasi = '';
      $scope.flag = '';
      $scope.pesan = '';
      $scope.temp='';
     


      
      var data2 = [];
      var data3 = [];
      var data4 = [];
      $scope.item.pasien = {
        objectruanganfk: null
      }
     
      loadPertama();

      $scope.listjammakan = [
        { "id": 1, "nama": "MAKAN SIANG JAM: 12.00-13.00 WIB"}, 
        {"id": 2, "nama": "MAKAN MALAM JAM: 18.00-19.00 WIB"} ,  
        {"id": 3, "nama": "MAKAN PAGI JAM: 06.00-07.00 WIB"}
      ]

    
 
      function loadPertama() {
         medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
          var tgltgltgltgl = dat.data.mindate[0].max
          var tglmax = dat.data.maxdate[0].max
          var tglkpnaja = dat.data.datedate
          $scope.minDate = new Date(tgltgltgltgl);
          $scope.maxDate = new Date(tglmax);//new Date($scope.now);
          $scope.startDateOptions = {
            disableDates: function (date) {
              var disabled = tglkpnaja;
              if (date && disabled.indexOf(date.getDate()) > -1) {
                return true;
              } else {
                return false;
              }
            }
          };
        })
        $scope.isRouteLoading = true;
            medifirstService.getDataDummyPHPV2("sysadmin/master/get-daftar-menu-gizi-transaksi"
              , true, 10, 10)
              .then(function (x) {
                debugger;
                $scope.listProduk = x;
              })
           $scope.isRouteLoading = false;
      }

      

      


     
      $scope.listYaTidak = [
        {
          "id": 1, "name": "Ya"
        },
        {
          "id": 0, "name": "Tidak"
        }]
    
      $scope.dataSelectedRow = {};
      $scope.dataTindakan = new kendo.data.DataSource({
        autoSync: false,
        aggregate: [
          { field: "subTotal", aggregate: "sum" }
        ],
        editable: true,
        schema: {
          model: {
            rowNumber: "id",
            fields: {
              rowNumber: { editable: false },
              tglPelayanan: { editable: false, defaultValue: $scope.now },
              produk: {
                validation: {
                  productnamevalidation: function (input) {
                    if (input.is("[name='produk']") && input.val() === "") {
                      return false;
                    }
                    return true;
                  }
                }
              },
              hargaSatuan: { type: "number", editable: false },
              qty: {
                type: "number", validation: {
                  productqtyvalidation: function (input) {
                    if (input.is("[name='qty']") && input.val() === "0") {
                      return false;
                    }
                    return true;
                  }
                }
              },
              subTotal: { type: "number", editable: false }
            }
          }
        }
      });

      $scope.dataTindakan2 = new kendo.data.DataSource({
        autoSync: false,
        aggregate: [
          { field: "subTotal", aggregate: "sum" }
        ],
        editable: true,
        schema: {
          model: {
            rowNumber: "id",
            fields: {
              rowNumber: { editable: false },
              tglPelayanan: { editable: false, defaultValue: $scope.now },
              produk: {
                validation: {
                  productnamevalidation: function (input) {
                    if (input.is("[name='produk']") && input.val() === "") {
                      return false;
                    }
                    return true;
                  }
                }
              },
              hargaSatuan: { type: "number", editable: false },
              qty: {
                type: "number", validation: {
                  productqtyvalidation: function (input) {
                    if (input.is("[name='qty']") && input.val() === "0") {
                      return false;
                    }
                    return true;
                  }
                }
              },
              subTotal: { type: "number", editable: false }
            }
          }
        }
      });

      $scope.dataTindakan3 = new kendo.data.DataSource({
        autoSync: false,
        aggregate: [
          { field: "subTotal", aggregate: "sum" }
        ],
        editable: true,
        schema: {
          model: {
            rowNumber: "id",
            fields: {
              rowNumber: { editable: false },
              tglPelayanan: { editable: false, defaultValue: $scope.now },
              produk: {
                validation: {
                  productnamevalidation: function (input) {
                    if (input.is("[name='produk']") && input.val() === "") {
                      return false;
                    }
                    return true;
                  }
                }
              },
              hargaSatuan: { type: "number", editable: false },
              qty: {
                type: "number", validation: {
                  productqtyvalidation: function (input) {
                    if (input.is("[name='qty']") && input.val() === "0") {
                      return false;
                    }
                    return true;
                  }
                }
              },
              subTotal: { type: "number", editable: false }
            }
          }
        }
      });


      $scope.tambahTindakans = function () {
        debugger
        if ($scope.item.namaProduk == undefined) {
          messageContainer.error("Tindakan harus di isi")
          return
        }
        if ($scope.item.jumlah == 0) {
          messageContainer.error("Jumlah tidak boleh nol")
          return
        }
        for (var i = data2.length - 1; i >= 0; i--) {
          if (data2[i].produk.idproduk == $scope.item.namaProduk.id && data2[i].jammakan == $scope.item.namajammakan.id ) {
            alert("Data sudah ditambahkan!!");
            return;
          }
        }
     
        var nomor = 0
        if ($scope.dataTindakan == undefined) {
          nomor = 1
        } else {
          nomor = data2.length + 1
        }

        var Keterangan='';
        var loop='';
         if($scope.item.Keterangan != undefined){
              Keterangan=$scope.item.Keterangan
         }
        debugger
        medifirstService.get('sysadmin/master/get-detailbahan?idprodukfk='
            + $scope.item.namaProduk.idproduk).then(function (e) {
          
          e.data.data.forEach(function (x) {
            debugger;
            var qty = $scope.item.jumlah;
              var data = {};
              data = {
                rowNumber: nomor,
                tglPelayanan: $scope.item.tglPelayanan,
                produk: $scope.item.namaProduk,
                namajammakan: $scope.item.namajammakan.nama,
                qty: qty,
                keterangan: Keterangan,
                jammakan: $scope.item.namajammakan.id,
                idbahan: x.produkdetailfk,
                namabahan: x.Bahan,
                berat: x.berat
              }
              data2.push(data)
          })
          $scope.dataTindakan = new kendo.data.DataSource({
            data: data2
          });
           kosongkan();
        })
         
        

       
        //  $scope.dataTindakan2 = new kendo.data.DataSource({
        //   data: data3
        // });
        //  $scope.dataTindakan3 = new kendo.data.DataSource({
        //   data: data4
        // });
      
        $scope.show = true;
       
      }
      $scope.gridPetugasPelaksana = new kendo.data.DataSource({
        data: []
      })

      var onChange = function (e) {
        var grid = $(this).data("mainGridOptions");

      }
      $scope.mainGridOptions = {
        sortable: true,
        
        change: onChange,
     
        columns: [
       
          {
            "field": "tglPelayanan",
            "title": "<h3 align=center>Tanggal</h3>",
            "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY') #",
            "width": "60px"
          },
       
          {
            "field": "produk.menu",
            "title": "<h3 align=center>Menu</h3>",
            "width": "300px"
          }, 
          {
            "field": "namajammakan",
            "title": "<h3 align=center>Jam Makan</h3>",
            "width": "300px"
          },
          {
            "field": "namabahan",
            "title": "<h3 align=center>Bahan</h3>",
            "width": "300px"
          },
          {
            "field": "qty",
            "title": "<h3 align=center>Qty</h3>",
            "width": "70px",
            "attributes": { align: "center" }
          },
          
          {
            "field": "keterangan",
            "title": "<h3 align=center>Keterangan</h3>",
            "width": "150px"
          },
          {
            "field": "berat",
            "title": "<h3 align=center>Standar Porsi</h3>",
            "width": "300px"
          },
        
          // { title: "<h3 align=center>Action<h3>",width : "100px",template : "<button class='btnHapus' ng-click='disableData()'>Disbled</button>"}
          {
            command: {
              text: "EDIT",
              width: "50px",
              align: "center",
              attributes: { align: "center" },
              // click: removeRowTindakan,
              click: ubah,
              imageClass: "k-icon k-update"
            },
            title: "",
            width: "80px",
            // template: "<a class='k-button k-grid-delete'><span class='glyphicon glyphicon-remove'></span></a>"
          }
        ],

      };$scope.mainGridOptions2 = {
        sortable: true,
        
        change: onChange,
     
        columns: [
       
          {
            "field": "tglPelayanan",
            "title": "<h3 align=center>Tanggal</h3>",
            "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY') #",
            "width": "60px"
          },
       
          {
            "field": "produk.menu",
            "title": "<h3 align=center>Tindakan</h3>",
            "width": "300px"
          },
         
          {
            "field": "qty",
            "title": "<h3 align=center>Qty</h3>",
            "width": "70px",
            "attributes": { align: "center" }
          },
        
          // { title: "<h3 align=center>Action<h3>",width : "100px",template : "<button class='btnHapus' ng-click='disableData()'>Disbled</button>"}
          {
            command: {
              text: "Hapus",
              width: "50px",
              align: "center",
              attributes: { align: "center" },
              click: removeRowTindakan2,
              imageClass: "k-icon k-delete"
            },
            title: "",
            width: "80px",
            // template: "<a class='k-button k-grid-delete'><span class='glyphicon glyphicon-remove'></span></a>"
          }
        ],

      };$scope.mainGridOptions3 = {
        sortable: true,
        
        change: onChange,
     
        columns: [
       
          {
            "field": "tglPelayanan",
            "title": "<h3 align=center>Tanggal</h3>",
            "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY') #",
            "width": "60px"
          },
       
          {
            "field": "produk.menu",
            "title": "<h3 align=center>Tindakan</h3>",
            "width": "300px"
          },
         
          {
            "field": "qty",
            "title": "<h3 align=center>Qty</h3>",
            "width": "70px",
            "attributes": { align: "center" }
          },
        
          // { title: "<h3 align=center>Action<h3>",width : "100px",template : "<button class='btnHapus' ng-click='disableData()'>Disbled</button>"}
          {
            command: {
              text: "Hapus",
              width: "50px",
              align: "center",
              attributes: { align: "center" },
              click: removeRowTindakan3,
              imageClass: "k-icon k-delete"
            },
            title: "",
            width: "80px",
            // template: "<a class='k-button k-grid-delete'><span class='glyphicon glyphicon-remove'></span></a>"
          }
        ],

      };
      function ubah(e) {
        e.preventDefault();
        var grid = this;
        var row = $(e.currentTarget).closest("tr");
        var tr = $(e.target).closest("tr");
        var dataItem = this.dataItem(tr);
        if (!dataItem) return
        $scope.temp= dataItem;
        $scope.item.namabahan =  $scope.temp.namabahan;
        $scope.item.namamenu =  $scope.temp.produk.menu;
        $scope.popupKomponen.center().open();
       
      }
      function removeRowTindakan(e) {
        e.preventDefault();
        var grid = this;
        var row = $(e.currentTarget).closest("tr");
        var tr = $(e.target).closest("tr");
        var dataItem = this.dataItem(tr);
        if (!dataItem) return

        // grid.removeRow(row);
        $scope.dataTindakan.remove(dataItem);
        for (var i = data2.length - 1; i >= 0; i--) {
          if (data2[i].rowNumber == dataItem.rowNumber) {

            data2.splice(i, 1);
            // var subTotal = 0;
            for (var j = data2.length - 1; j >= 0; j--) {
              // subTotal = subTotal + parseFloat(data2[j].subTotal)
              // data2[j].rowNumber = j + 1
            }
            // $scope.dataTindakan = new kendo.data.DataSource({
            //   data: data2
            // });

          }
        }
      }
       function removeRowTindakan2(e) {
        e.preventDefault();
        var grid = this;
        var row = $(e.currentTarget).closest("tr");
        var tr = $(e.target).closest("tr");
        var dataItem = this.dataItem(tr);
        if (!dataItem) return

        // grid.removeRow(row);
        $scope.dataTindakan2.remove(dataItem);
        for (var i = data3.length - 1; i >= 0; i--) {
          if (data2[i].rowNumber == dataItem.rowNumber) {

            data3.splice(i, 1);
            // var subTotal = 0;
            for (var j = data3.length - 1; j >= 0; j--) {
              // subTotal = subTotal + parseFloat(data2[j].subTotal)
              // data2[j].rowNumber = j + 1
            }
            // $scope.dataTindakan = new kendo.data.DataSource({
            //   data: data2
            // });

          }
        }
      }
       function removeRowTindakan3(e) {
        e.preventDefault();
        var grid = this;
        var row = $(e.currentTarget).closest("tr");
        var tr = $(e.target).closest("tr");
        var dataItem = this.dataItem(tr);
        if (!dataItem) return

        // grid.removeRow(row);
        $scope.dataTindakan3.remove(dataItem);
        for (var i = data4.length - 1; i >= 0; i--) {
          if (data4[i].rowNumber == dataItem.rowNumber) {

            data4.splice(i, 1);
            // var subTotal = 0;
            for (var j = data4.length - 1; j >= 0; j--) {
              // subTotal = subTotal + parseFloat(data2[j].subTotal)
              // data2[j].rowNumber = j + 1
            }
            // $scope.dataTindakan = new kendo.data.DataSource({
            //   data: data2
            // });

          }
        }
      }
      $scope.tutup = function(){
        $scope.popupKomponen.close();
      }
      $scope.UpdateQty = function(){
        debugger;
        var data = {};
         for (var i = data2.length - 1; i >= 0; i--) {
            if (data2[i].produk.idproduk == $scope.temp.produk.idproduk && data2[i].idbahan == $scope.temp.idbahan) {
                data.rowNumber = data2[i].rowNumber
                data.tglPelayanan =  data2[i].tglPelayanan
                data.produk =  data2[i].produk
                data.namajammakan = data2[i].namajammakan
                data.qty = $scope.item.qty
                data.keterangan = data2[i].keterangan
                data.jammakan = data2[i].jammakan
                data.idbahan = data2[i].idbahan
                data.namabahan = data2[i].namabahan
                data2[i] = data
                $scope.dataTindakan = new kendo.data.DataSource({
                  data: data2
                });
                $scope.popupKomponen.close();
                break;
            }
          }




        // data2.forEach(function (e) {
        //     if(e.idproduk.idproduk == $scope.temp.produk.idproduk && e.idbahan == $scope.temp.idbahan){
        //       e.qty = 1
        //        $scope.dataTindakan = new kendo.data.DataSource({
        //         data: data2
        //       });
        //       // break;
        //     }
        // })
        
      }
      $scope.hapusAll = function () {
        data2 = [];
        $scope.dataTindakan = new kendo.data.DataSource({
          data: data2
        });

        $scope.dataTindakan2 = new kendo.data.DataSource({
          data: data2
        });

        $scope.dataTindakan3 = new kendo.data.DataSource({
          data: data2
        });

      };
      $scope.detailGridOptions = function (dataItem) {
        return {
          dataSource: {
            data: $scope.gridPetugasPelaksana._data,
            filter: { field: "idParent", operator: "eq", value: dataItem.rowNumber }
          },
          columns: [
            {
              field: "jenisPetugas.jenisPelaksana",
              title: "Jenis Pelaksana",
              width: "100px",
              template: "#= jenisPetugas.jenisPelaksana #"
            },
            {
              field: "listPetugas[0].namalengkap",
              title: "Nama Pegawai",
              width: "200px",
              template: multiSelectArrayToString
            }
          ]
        };
      };

      function multiSelectArrayToString(item) {
        if (item.listPetugas !== "") {
          return item.listPetugas.map(function (elem) {
            return elem.namalengkap
          }).join(", ");
        }
      };
      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }


      $scope.isInArray = function (value, array) {
        return array.indexOf(value) > -1;
      }

      


      $scope.selectOptions = {
        placeholder: "Pilih Pegawai...",
        dataTextField: "namaLengkap",
        dataValueField: "id",
        filter: "contains"
      };



      function kosongkan() {
        $scope.item.namaProduk = undefined;
        $scope.item.hargaTindakan = "";
        $scope.item.jumlah = undefined;
     
      }

      $scope.simpanDokter = function(){
        $scope.popupDokter.close();
      }
      // function simpan tindakan
      $scope.Save = function () {
        debugger
        // if ($scope.dataTindakan._data.length == 0) {
        //   toastr.error('Tindakan belum di isi')
        //   return
        // }
        // var idpengirim ="";
        // if($scope.item.pasien.objectruanganfk == 575 && $scope.item.namaDokter==undefined){
        //   $scope.popupDokter.center().open();
        //   return
        // }else if($scope.item.pasien.objectruanganfk == 575 && $scope.item.namaDokter!=undefined){
        //   idpengirim=$scope.item.namaDokter.id
        // }
        var dataTindakanFix = [];
        $scope.dataTindakan._data.forEach(function (e) {

            dataTindakanFix.push({
              "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),            
              "produkfk": e.produk.idproduk,             
              "jumlah": e.qty,             
              "keterangan": e.keterangan,
              "jammakan": e.jammakan,
              "produkfkbahan": e.idbahan,
              "berat": e.berat
            });
            debugger
          
        })
        //  $scope.dataTindakan2._data.forEach(function (e) {

        //     dataTindakanFix.push({
        //       "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),            
        //       "produkfk": e.produk.idproduk,             
        //       "jumlah": e.qty,             
        //       "keterangan": e.keterangan,
        //       "jammakan": e.jammakan
        //     });

          
        // })
        //  $scope.dataTindakan3._data.forEach(function (e) {

        //     dataTindakanFix.push({
        //       "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),            
        //       "produkfk": e.produk.idproduk,             
        //       "jumlah": e.qty,             
        //       "keterangan": e.keterangan,
        //       "jammakan": e.jammakan
        //     });

          
        // })
        var objSave = {
          pelayananpasien: dataTindakanFix

        }
        $scope.hideSimpan = true
         medifirstService.post('sysadmin/master/save-menu', JSON.stringify(objSave)).then(function (e) {

         })
      }
     
      $scope.Back = function () {
        window.history.back();
      }
     
      $scope.paket = {}
      $scope.cekPaket = function (bool) {
        if (bool) {
          $scope.popUpPaket.center().open()
          medifirstService.get('sysadmin/general/get-paket-tindakan').then(function (e) {
            $scope.sourcePaket = new kendo.data.DataSource({
              data: e.data,
              pageSize: 10,
            });
          })

        } else {

        }

      }
      $scope.optionsPaket = {
        // dataBound: function () {
        //     this.expandRow(this.tbody.find("tr.k-master-row"));
        // },
        pageable: true,
        scrollable: true,
        columns: [
          { field: "namapaket", title: "Nama Paket", width: 120, },
          { field: "jml", title: "Jumlah Tindakan", width: 80 },
        ],
      };
      $scope.data2 = function (dataItem) {
        for (var i = 0; i < dataItem.details.length; i++) {
          dataItem.details[i].no = i + 1
        }
        return {
          dataSource: new kendo.data.DataSource({
            data: dataItem.details,

          }),
          columns: [
            { field: "namaproduk", title: "Nama Pelayanan", width: 120 }
          ]
        }
      };
      $scope.tutupPaket = function () {
        kosongkanPaket()
        $scope.item.paket = false
        $scope.popUpPaket.close()
      }

      var timeoutPromise;
      $scope.$watch('paket.namaPaket', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          applyFilter("namapaket", newVal)
        }
      })

      function applyFilter(filterField, filterValue) {
        var dataGrid = $("#gridPaket").data("kendoGrid");
        var currFilterObject = dataGrid.dataSource.filter();
        var currentFilters = currFilterObject ? currFilterObject.filters : [];

        if (currentFilters && currentFilters.length > 0) {
          for (var i = 0; i < currentFilters.length; i++) {
            if (currentFilters[i].field == filterField) {
              currentFilters.splice(i, 1);
              break;
            }
          }
        }

        if (filterValue.id) {
          currentFilters.push({
            field: filterField,
            operator: "eq",
            value: filterValue.id
          });
        } else {
          currentFilters.push({
            field: filterField,
            operator: "contains",
            value: filterValue
          })
        }

        dataGrid.dataSource.filter({
          logic: "and",
          filters: currentFilters
        })
      }
      $scope.resetFilterPaket = function () {
        var dataGrid = $("#gridPaket").data("kendoGrid");
        dataGrid.dataSource.filter({});
        $scope.paket = {};
      }
      $scope.klikPaket = function (select) {
        $scope.totalHargaDefault = 0
        var arr = select.details

        for (var i = 0; i < arr.length; i++) {
          const element = arr[i];
          $scope.listKomponen = []

          medifirstService.get("sysadmin/general/get-komponenharga-paket?idRuangan="
            + $scope.item.pasien.objectruanganfk
            + "&idKelas=" + $scope.item.pasien.objectkelasfk
            + "&idProduk=" + element.objectprodukfk
            + "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk
          ).then(function (dat) {
            if (dat.data.data.length == 0) {
              return
            }
            $scope.totalHargaDefault = $scope.totalHargaDefault + parseFloat(dat.data.data2[0].hargasatuan)

          })
        }
      }
      $scope.tambahPaket = function () {
        if ($scope.dataPaketSelect == undefined) {
          toastr.error('Pilih Paket dulu')
          return
        }
        if ($scope.paket.jenisPelaksana == undefined) {
          toastr.error("Jenis Pelaksana harus di isi")
          return
        }
        if ($scope.selectedPegawaiPaket.length == 0) {
          toastr.error('Petugas Pelaksana harus di isi')
          return
        }

        var arr = $scope.dataPaketSelect.details

        for (var i = 0; i < arr.length; i++) {
          const element = arr[i];
          $scope.listKomponen = []

          medifirstService.get("sysadmin/general/get-komponenharga-paket?idRuangan="
            + $scope.item.pasien.objectruanganfk
            + "&idKelas=" + $scope.item.pasien.objectkelasfk
            + "&idProduk=" + element.objectprodukfk
            + "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk
          ).then(function (dat) {
            if (dat.data.data.length == 0) {
              toastr.error('Mapping tindakan belum ada, Hubungi IT', 'Error')
              return
            }
            var hargasatuan = parseFloat(dat.data.data2[0].hargasatuan)
            if ($scope.dataPaketSelect.hargapaket != 0
              && $scope.dataPaketSelect.hargapaket < $scope.totalHargaDefault) { // ** mun paketna lebih murah */
              // debugger
              hargasatuan = $scope.dataPaketSelect.hargapaket / $scope.totalHargaDefault * hargasatuan

              //** Kompoonen */
              for (let j = 0; j < dat.data.data.length; j++) {
                const element = dat.data.data[j];
                element.hargasatuan = hargasatuan / parseFloat(dat.data.data2[0].hargasatuan) * parseFloat(element.hargasatuan)
                // debugger
                element.hargasatuan = element.hargasatuan.toFixed(2)
              }
            }

            // console.log( hargasatuan )
            // console.log( $scope.listKomponen )
            $scope.listKomponen = dat.data.data;
            // $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;

            var nomor = 0
            if ($scope.dataTindakan == undefined) {
              nomor = 1
            } else {
              nomor = data2.length + 1
            }
            var data = {};
            data = {
              rowNumber: nomor,
              tglPelayanan: $scope.item.tglPelayanan,
              produk: { id: element.objectprodukfk, namaproduk: element.namaproduk },//$scope.item.noRegistrasi,
              qty: 1,
              hargaSatuan: hargasatuan.toFixed(2),
              hargadiskon: 0,
              subTotal: (hargasatuan.toFixed(2)) * (1),
              listKomponen: $scope.listKomponen,
              statuscito: "",
              cito: "",
              jasacito: 0,
              // isparamedis: $scope.item.paramedis,
              jenispelayananfk: $scope.item.pasien.objectjenispelayananfk,
              nilaicito: 0,


            }
            data2.push(data)
            // $scope.dataGrid.add($scope.dataSelected)
            $scope.dataTindakan = new kendo.data.DataSource({
              data: data2
            });
            var subTotal = 0;
            for (var i = data2.length - 1; i >= 0; i--) {
              subTotal = subTotal + parseFloat(data2[i].subTotal)
            }
            $scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.')//parseFloat(subTotal).to
            var pushData = {
              "idParent": data.rowNumber,
              "jenisPetugas": {
                "id": $scope.paket.jenisPelaksana.id,
                "jenisPelaksana": $scope.paket.jenisPelaksana.jenispetugaspe
              },
              "listPetugas": $scope.selectedPegawaiPaket
            }
            $scope.gridPetugasPelaksana.add(pushData);
          })


        }
      }
      function kosongkanPaket() {
        $scope.selectedPegawaiPaket = []
        delete $scope.paket.jenisPelaksana
        delete $scope.paket.namaPaket
      }
      $scope.selectedPegawaiPaket = []
      $scope.getPegawaiByJenis = function () {
        var id = $scope.paket.jenisPelaksana.id;
        var model = 'dataSource';
        var listArray = 'selectedPegawaiPaket';
        var isInList = $scope.isInArray(id, $scope.listIdPetugas);
        if (isInList) {
          getGenericPegawai(model, listArray);
        } else {
          getPegawaiById(id, model, listArray);
        }
      };




    }
  ]);
});