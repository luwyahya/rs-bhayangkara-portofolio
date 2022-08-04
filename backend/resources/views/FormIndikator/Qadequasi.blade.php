@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


  FORMULIR JUMLAH ADEQUASI PASIEN HD REGULER BERDASARKAN URR ≥ 70 %



</h2>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width="50">≤ 70 %</th>
      <th width="50">≥ 70 %</th>
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
      <td> {{ $datas->urr_b_70 }} </td>
      <td> {{ $datas->urr_a_70 }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection