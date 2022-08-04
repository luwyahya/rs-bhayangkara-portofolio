@extends("FormIndikator/bodyprint")
@section("content")


<h2 align="center" style="margin-top: 5px">

 FORMULIR ANGKA KEJADIAN PLEBITIS

</h2>
<table class="table1" align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Gelang</th>
      <th width="400">Keterangan</th>

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <?php
    $time = strtotime($datas->tanggal);
    $tanggal = date('d-m-Y',$time);



    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $tanggal}} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->gelang }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach


  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection