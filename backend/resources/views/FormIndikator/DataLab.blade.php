@extends("FormIndikator/bodyprint")
@section("content")

<div align="center">

  <h2 align="center" style="margin-top: 5px">

  FORMULIR BANTU PENGUMPULAN DATA DI LABORATURIUM


 </h2>
</div>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Jam Hasil Keluar</th>
      <th>JAM ANALIS LAPOR KERUANGAN</th>
      <th>TTD & NAMA TERANG ANALIS</th>
      <th>DITERIMA OLEH RUANG / NAMA PERAWAT</th>
     
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


    $jam_keluar = strtotime($datas->jam_keluar);
    $jam_keluar = date("H:m"); 

    $jam_analis = strtotime($datas->jam_analis);
    $jam_analis = date("H:m"); 

    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $jam_keluar }} </td>
      <td> {{ $jam_analis }} </td>
      <td> {{ $datas->ttd_nama }} </td>
      <td> {{ $datas->terima_oleh }} </td>
     
    </tr>
    @endforeach
    
  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection