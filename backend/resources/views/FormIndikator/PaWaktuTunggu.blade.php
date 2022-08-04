@extends("FormIndikator/bodyprint")
@section("content")

<div  align="center">
  <h2 >
   FORMULIR WAKTU TUNGGU HASIL PELAYANAN LABORATORIUM PATOLOGI ANATOMI

 </h2>
</div>

<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width="100">Tanggal Pemeriksaan</th>
      <th>Jenis Pemeriksaan</th>
      <th width="100">Tanggal Jadwal</th>
      <th width="100">Tanggal Keluar</th>
      <th width="100">Tanggal Ambil</th>
      

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <?php
    $tanggal = strtotime($datas->tanggal);
    $tanggal = date("d-m-Y"); 

    $tgl_pemeriksaan = strtotime($datas->tgl_pemeriksaan);
    $tgl_pemeriksaan = date("d-m-Y"); 

    $tgl_jadwal = strtotime($datas->tgl_jadwal);
    $tgl_jadwal = date("d-m-Y"); 


    $tgl_keluar = strtotime($datas->tgl_keluar);
    $tgl_keluar = date("d-m-Y"); 

    $tgl_ambil = strtotime($datas->tgl_ambil);
    $tgl_ambil = date("d-m-Y"); 
    
    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $tgl_pemeriksaan }} </td>
      <td> {{ $datas->jenis_pemeriksaan }} </td>
      <td> {{ $tgl_jadwal }} </td>
      <td> {{ $tgl_keluar }} </td>
      <td> {{ $tgl_ambil }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection