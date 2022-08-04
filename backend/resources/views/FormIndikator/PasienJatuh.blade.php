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
      <th>Tanggal/Jam Pasien Jatuh</th>
      <th>Tindakan Lanjut</th>

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

    $waktu = strtotime($datas->waktu_jatuh);
    $waktu = date('d-m-Y',$waktu);

    
    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $tanggal}} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $waktu }} </td>
      <td> {{ $datas->tindakan }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection