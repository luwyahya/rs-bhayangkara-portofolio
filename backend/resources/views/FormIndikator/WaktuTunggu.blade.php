@extends("FormIndikator/bodyprint")
@section("content")

<div align="center">
  <h2 align="center" style="margin-top: 5px">
    FORMULIR WAKTU TUNGGU RAWAT JALAN

  </h2>
</div>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width=300>Nama Dokter</th>
      <th width="80">Ruangan</th>
      <th width="100">Jam Tertera Di Karcis</th>
      <th width="100">Jam Di Layanani Oleh Dokter</th>
      <th width="150">Waktu Tunggu Rawat Jalan (Menit)</th>

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>

    @foreach($data as $datas )

    <?php
    $tanggal = strtotime($datas->tglregistrasi);
    $tanggal = date("d-m-Y",$tanggal); 

    


    $jam_karcis = strtotime($datas->tglregistrasi);
    $jam_karcis = date("H:i:s",$jam_karcis); 
    


    if ($datas->tgldipanggildokter == null) {
      $jam_dokter = "";
    }else{
      $jam_dokter1 = strtotime($datas->tgldipanggildokter);
      $jam_dokter = date("H:i:s",$jam_dokter1); 
    }

    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->nocm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->namalengkap }} </td>
      <td> {{ $datas->namaruangan }} </td>
      <td align="center"> {{ $jam_karcis }} </td>
      <td align="center"> {{ $jam_dokter }} </td>
      <td  align="center"> {{ $datas->menit }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection