@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


  FORMULIR ANGKA INSIDEN TERKAIT PEMBERIAN OBAT HIGH ALERT

</h2>
<table class="table1" align="center">
  <thead>
    <tr>
      <th align="center" width="20"> No </th>
      <th width=90>Tanggal</th>
      <th width="300">Ruangan</th>
      <th align="center" width=100>Jumlah Obat Hight Alert</th>
      <th align="center" width="100">Kejadian Obat High Alert</th>
      
    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <tr>
      <td  align="center"> {{ $no++ }} </td>
      <td> {{ $datas->tanggal }} </td>
      <td> {{ $datas->ruangan }} </td>
      <td  align="center"> {{ $datas->jumlah }} </td>
      <td  align="center"> {{ $datas->kejadian }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection