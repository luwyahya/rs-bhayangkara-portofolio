@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


 FORMULIR KETEPATAN PEMBERIAN INJEKSI ANTIBIOTIK ½ JAM SEBELUM TINDAKAN OPERASI




</h2>
<table align="center" class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Diagnosa</th>
      <th>DPJP</th>
      <th>Antibiotik yang diberikan</th>
      <th>Waktu Pemberian Antibiotik</th>
      

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
      <td> {{ $datas->dpjp }} </td>
      <td> {{ $datas->antibiotik }} </td>
      <td> {{ $datas->waktu }} </td>
     
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection