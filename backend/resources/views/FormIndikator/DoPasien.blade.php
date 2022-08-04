@extends("FormIndikator/bodyprint")
@section("content")

<div  align="center">
<h2 >
 FORMULIR KEJADIAN DROP OUT PASIEN TERHADAP PELAYANAN REHABILITASI MEDIK YANG DIRENCANAKAN


</h2>
</div>

<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width="100">Tgl Di Asessment dokter</th>
      <th width="100">Jadwal Terapi Dokter</th>
      <th width="250">Alasan</th>

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


    $tgl_assesment = strtotime($datas->tgl_assesment);
    $tgl_assesment = date("d-m-Y"); 


    $jadwal_terapi = strtotime($datas->jadwal_terapi);
    $jadwal_terapi = date("d-m-Y"); 


    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $tgl_assesment }} </td>
      <td> {{ $jadwal_terapi }} </td>
      <td> {{ $datas->alasan }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection