@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">

 FORMULIR RATA – RATA PASIEN YANG KEMBALI KE PERAWATAN INTENSIF DENGAN KASUS YANG SAMA < 72 JAM

</h2>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Diagnosa</th>
      <th>DPJP</th>
      <th width="200">Kembali Ke Perawatan Intensif dg Kasus yg Sama < 72 Jam</th>
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
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->diagnosa }} </td>
      <td> {{ $datas->dpjp }} </td>
      <td> {{ $datas->perawatan_intensif }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection