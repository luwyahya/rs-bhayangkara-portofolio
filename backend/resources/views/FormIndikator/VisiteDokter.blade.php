@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


FORMULIR JAM VISITE DOKTER



</h2>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>Nama Dokter</th>
      <th width=100>Waktu Besuk</th>
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

    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td> {{ $datas->namalengkap }} </td>
      <td> {{ $datas->waktubesuk }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection