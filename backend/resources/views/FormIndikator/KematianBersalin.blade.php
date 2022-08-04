@extends("FormIndikator/bodyprint")
@section("content")

<div  align="center">
  <h2 >
   FORMULIR KEJADIAN KEMATIAN IBU BERSALIN YANG DISEBABKAN OLEH PENDARAHAN, PREEKLAMSI DAN SEPSIS

 </h2>
</div>

<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width="100">Tgl/Jam Meninggal</th>
      <th>Tempat Meninggal</th>
      <th width="140">Penyebab Kematian</th>
      <th width="250">Keterangan</th>

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


    $tgl_meninggal = strtotime($datas->tgl_meninggal);
    $tgl_meninggal = date("d-m-Y"); 


    

    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $tgl_meninggal }} </td>
      <td> {{ $datas->tempat_meninggal }} </td>
      <td> {{ $datas->penyebab }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection