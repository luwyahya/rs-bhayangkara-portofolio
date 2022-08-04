@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">

  FORMULIR KELENGKAPAN KEJADIAN PULANG PAKSA

</h2>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Diagnosa</th>
      <th width=400>Alasan Pulang Paksa</th>

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
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->diagnosa }} </td>
      <td> {{ $datas->alasan }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection