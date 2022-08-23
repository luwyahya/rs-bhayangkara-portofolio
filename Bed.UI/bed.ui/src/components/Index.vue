<template>
  <div class="bgimg">
    <div class="col-lg-1 col-md-1 col-sm-1">
      <div class="topbar">
        <img
          class="img-responsive img-logo-top"
          src="../assets/images/logo.png"
        />
      </div>
    </div>
    <div class="col-lg-7 col-md-7 col-sm-7">
      <div class="topbar">
        <h4 class="nama-rumah-sakit">Rumah Sakit Universitas Andalas</h4>
        <h4 class="alamat-rumah-sakit">
         Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 2517
        </h4>
      </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-4">
      <div class="topbar">
        <h4 class="informasi">Ketersediaan Tempat Tidur</h4>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="divider"></div>

    <div class="col-lg-6 col-md-6 col-sm-6">
      <div v-for="item in items" :key="item.namaKelas">
        <div class="col-md-4">
          <div class="info-kamar">
            <h2>{{ item.namaKelas }}</h2>
            <h1>{{ item.jumlah }}</h1>
            <h3>Tersedia</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
      <div class="table-antrian">
        <div class="table-responsive">          
          <div class="scrollable" id="tablebed">
            <table class="table">
              <thead>
              <tr>
                <th>Ruangan</th>
                <th>Kelas</th>
                <th>Kapasitas</th>
                <th>Rusak</th>
                <th>Dibersihkan</th>
                <th>Terpakai</th>
                <th>Kosong</th>
              </tr>
            </thead>
              <tbody>
                <tr v-for="kasur in kasurs" :key="kasur.id">
                  <td class="ruangan">{{ kasur.namaRuangan }}</td>
                  <td class="kelas">{{ kasur.namaKelas }}</td>
                  <td class="kapasitas">{{ kasur.kapasitas }}</td>
                  <td class="rusak">{{ kasur.rusak }}</td>
                  <td class="dibersihkan">{{ kasur.dibersihkan }}</td>
                  <td class="terpakai">{{ kasur.isiLp }}</td>
                  <td class="kosong">{{ kasur.kosongLp }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="clearfix"></div>
  </div>

</template>

<script>
import api from "@/ApiService";

export default {
  data() {
    return {
      items: [],
      kasurs: [],
    };
  },
  async created() {
    this.getAllKelas();
    this.getAllBed();
    setInterval(autoScroll, 100);
  },
  methods: {
    async getAllKelas() {
      try {
        this.items = await api.get("kelas");
      } finally {
      }
    },
    async getAllBed() {
      try {
        this.kasurs = await api.get("bed");
      } finally {
      }
    },
  },
};

function autoScroll() {
  var top = Math.ceil(document.getElementById("tablebed").scrollTop);
  var hei = document.getElementById("tablebed").scrollHeight;
  var ofh = document.getElementById("tablebed").offsetHeight;
  if (top < hei - ofh) {
    -1;
    document.getElementById("tablebed").scrollTop =
      document.getElementById("tablebed").scrollTop + 1;
  } else {
    document.getElementById("tablebed").scrollTop = 0;
  }
}
</script>

<style>
.scrollable {
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 70vh;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
}
</style>
