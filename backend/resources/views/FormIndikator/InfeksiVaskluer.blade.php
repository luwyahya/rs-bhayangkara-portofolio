@extends("FormIndikator/bodyprint")
@section("content")


<div align="center">
  <h2 style="margin-top: 5px">
   FORMULIR KETEPATAN PEMBERIAN INJEKSI ANTIBIOTIK ½ JAM SEBELUM TINDAKAN OPERASI

 </h2>

</div>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=250>Nama Pasien</th>
      <th width=250>DPJP</th>
      <th width="20">Infeksi Vaskuler (Y/T)</th>
      <th width="200">Keterangan</th>

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
      <td> {{ $datas->dpjp }} </td>
      <td> {{ $datas->infeksi }} </td>
      <td> {{ $datas->ket }} </td>
      
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection