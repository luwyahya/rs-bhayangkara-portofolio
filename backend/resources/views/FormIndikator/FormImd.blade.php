@extends("FormIndikator/bodyprint")
@section("content")

<div align="center">

  <h2 align="center" style="margin-top: 5px">

   FORMULIR IMD (INISIASI MENYUSUI DINI)
 </h2>
</div>
<table class="table1" align="center" >
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Tanggal Lahir Bayi</th>
      <th>IMD</th>
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


    $tgllahir = strtotime($datas->tgllahir);
    $tgllahir = date("d-m-Y H:m"); 

    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $tgllahir }} </td>
      <td> {{ $datas->imd }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    
  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection