@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


 FORMULIR ANGKA KEJADIAN PLEBITIS



</h2>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Diagnosa</th>
      <th>Tanggal Pasang Infus</th>
      <th>Jumlah Hari Pakai Infus</th>
      <th width="100">Plebitis</th>
      <th width=400>Keterangan</th>

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $datas->tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->diagnosa }} </td>
      <td> {{ $datas->tgl_infus }} </td>
      <td> {{ $datas->jlh_hari }} </td>
      <td> {{ $datas->plebitis }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection