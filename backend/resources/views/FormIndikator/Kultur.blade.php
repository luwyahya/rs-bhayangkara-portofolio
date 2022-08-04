@extends("FormIndikator/bodyprint")
@section("content")

<div align="center">

  <h2 align="center" style="margin-top: 5px">
    FORMULIR KETEPATAN WAKTU PELAYANAN KULTUR SELAIN DARAH ≤ 4 HARIM/ 5 HARI - 8 HARI
  </h2>
</div>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Tanggal Pemeriksaan</th>
      <th>Jenis Pemeriksaan</th>
      <th width="100">HASIL ≤ 4 HARI / > 5 HARI</th>
      <th width=400>Keterangan</th>

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

    ?>
    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->tglperiksa }} </td>
      <td> {{ $datas->jenis_pemeriksaan }} </td>
      <td> {{ $datas->hasil }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    
  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection