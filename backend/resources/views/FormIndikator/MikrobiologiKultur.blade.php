@extends("FormIndikator/bodyprint")
@section("content")

<div  align="center">
  <h2 >
  FORMULIR KETEPATAN WAKTU PELAYANAN KULTUR SELAIN DARAH ≤ 3 HARI

 </h2>
</div>

<table class="table1"  align="center">
  <thead>
    <tr>
      <th> No </th>
      <th>Tanggal</th>
      <th>No. RM</th>
      <th>Nama Pasien</th>
      <th>Tanggal Pemeriksaan</th>
      <th>HASIL ≤ 3 HARI / > 4 HARI </th>
      <th>Keterangan</th>
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
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->jenis_pemeriksaan }} </td>
      <td> {{ $datas->hasil }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection