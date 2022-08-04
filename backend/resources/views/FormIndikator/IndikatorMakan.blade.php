@extends("FormIndikator/bodyprint")
@section("content")
<h2 align="center" style="margin-top: 5px">

 FORMULIR KETEPATAN WAKTU PEMBERIAN MAKANAN PASIEN

 <?php
  function ceklist($c){
    if ($c==1) {
      $s = "✔";
    }else{ $s="-"; }

    return $s;
  }
 ?>


</h2>
<table class="table1">
  <thead>
    <tr>
      <th rowspan="2"> No </th>
      <th rowspan="2"> Nama Distribusi </th>
      <th rowspan="2" width=300>Nama Pasien</th>
      <th colspan="5">Jam Makan Belum/Sudah</th>
      <th rowspan="2">Penilaian Waktu Pemberian</th>
      <th rowspan="2">Nama Auditor</th>
      <th  rowspan="2" width=400>Keterangan</th>
    </tr>

    <tr>
      <th>Pagi</th>
      <th>Snack Pagi</th>
      <th>Siang</th>
      <th>Snack Sore</th>
      <th>Malam</th>
    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $datas->namadistribusi }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td align="center"> {{ ceklist($datas->pagi) }} </td>
      <td align="center"> {{ ceklist($datas->snpagi) }} </td>
      <td align="center"> {{ ceklist($datas->siang) }} </td>
      <td align="center"> {{ceklist($datas->snsore)  }} </td>
      <td align="center"> {{ ceklist($datas->malam)  }} </td>
      <td> {{ $datas->penilaianwaktu }} </td>
      <td> {{ $datas->namalengkap }} </td>
      <td> {{ $datas->keterangan }} </td>
      
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection