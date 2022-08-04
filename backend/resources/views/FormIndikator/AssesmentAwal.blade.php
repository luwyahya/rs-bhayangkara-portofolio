@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


 FORMULIR KELENGKAPAN ASSESMENT AWAL MEDIS ≤ 24 JAM DAN ASSESMENT AWAL KEPERAWATAN ≤ 12 JAM SETELAH PASIEN MASUK RAWAT INAP

<style type="text/css">
  table{
    font-size: 14px;
  }
</style>

</h2>
<table class="table1">
  <thead>
    <tr>
      <th rowspan="3" width="20"> No </th>
      <th rowspan="3" width=90>Tanggal</th>
      <th rowspan="3">No. RM</th>
      <th rowspan="3" width=100>Tanggal Lahir</th>
      <th rowspan="3" width=300>Nama Pasien</th>
      <th colspan="2" rowspan="2" width=100>Masuk Rawat</th>
      <th  colspan="4" width=300>Assesment Awal Keperawatan</th>
      <th   colspan="4" width=300>Assesmen Awal Medis </th>
      
    </tr>
    <tr>
      <th colspan="2">Assesment Awal Keperawatan</th>
      <th rowspan="2">Lama Waktu Assesment Awal Keperawatan</th>
      <th>Kategori</th> 
      <th colspan="2">Assesment Awal Keperawatan</th>
      <th rowspan="2">Lama Waktu Assesment Awal Keperawatan</th>
      <th>Kategori</th>
    </tr>
    <tr>
      <th width=100>Tanggal</th>
      <th>Jam</th>
      <th width=100>Tanggal</th>
      <th>Jam</th>
      <th>≤ 12 Jam, > 12 Jam</th>  
      <th width=100>Tanggal</th>
      <th>Jam</th>
      <th>≤ 12 Jam, > 12 Jam</th>
      
    </tr>
    
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )
    <?php
    $tgllahir = strtotime($datas->tgllahir);
    $tgllahir = date("d-m-Y",$tgllahir);

    $masuk_rawat = strtotime($datas->masuk_rawat);
    $jam_rawat = date("H:m",$masuk_rawat);    
    $masuk_rawat = date("d-m-Y",$masuk_rawat);    

    $assesment_awal_perawat = strtotime($datas->assesment_awal_perawat);
    $jam_assesmentperawat = date("H:m",$assesment_awal_perawat);    
    $assesment_awal_perawat = date("d-m-Y",$assesment_awal_perawat);     


    $assesment_awal_medis = strtotime($datas->assesment_awal_medis);
    $jam_assesmentmedis = date("H:m",$assesment_awal_medis);    
    $assesment_awal_medis = date("d-m-Y",$assesment_awal_medis); 



    ?>

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $datas->tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $tgllahir }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $masuk_rawat }} </td>
      <td> {{ $jam_rawat }} </td>
      <td> {{ $assesment_awal_perawat }} </td>
      <td> {{ $jam_assesmentperawat }} </td>
      <td> 0 Jam </td>
      <td> {{ $datas->kategori_perawat }} </td>
      <td> {{ $assesment_awal_medis }} </td>
      <td> {{ $jam_assesmentmedis }} </td>
      <td> 4 </td>
      <td> {{ $datas->kategori_medis }} </td>
    </tr> 
    @endforeach
    
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection