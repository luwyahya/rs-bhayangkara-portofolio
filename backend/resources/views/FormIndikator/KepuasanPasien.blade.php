@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">

  FORMULIR KEPUASAN PASIEN


</h2>
<table class="table1" id="incidents">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Tanggal Lahir</th>
      <th>Gelang (Y/T)</th>
      <th width=400>Keterangan</th>

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <?php
      $tgl = strtotime($datas->tgllahir);
      $tgl = Date('d/m/Y',$tgl);

    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $datas->tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $tgl }} </td>
      <td> {{ $datas->gelang }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach


  </tbody>
  <tfoot>


  </tfoot>

</table>

@endsection