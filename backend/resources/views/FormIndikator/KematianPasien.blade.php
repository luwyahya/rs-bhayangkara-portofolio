@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


FORMULIR ANGKA KEMATIAN PASIEN ≥ 48 JAM




</h2>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width=90>Tanggal Masuk Rawat Inap</th>
      <th>Diagnosa</th>
      <th>Dpjp</th>
      <th>Meninggal Tanggal/Jam</th>
      <th width=400>Keterangan</th>

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <?php
      $tglmeninggal = strtotime($datas->tglmeninggal);
      $tglmeninggal = date("d-m-Y h:m");

    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->waktu }} </td>
      <td> {{ $datas->diagnosa }} </td>
      <td> {{ $datas->dpjp }} </td>
      <td> {{ $tglmeninggal }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection