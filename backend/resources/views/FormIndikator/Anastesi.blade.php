@extends("FormIndikator/bodyprint")
@section("content")
<h2 align="center" style="margin-top: 5px">

 FORMULIR ANASTESI (KEJADIAN DESATURASI 02 PADA SAAT DURANTE ANASTESI PASIEN DENGAN ANASTESI UMUM)

</h2>
<table class="table1">
  <thead>
    <tr>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Diagnosa Medik</th>
      <th>Lama Terjadinya Saturasi</th>
      <th>Tindakan yang dilakukan</th>
      <th width=400>Keterangan</th>

    </tr>
  </thead>
  <tbody>
    @foreach($data as $datas )
    <tr>
      <td> {{ $datas->tanggal }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->diagnosa }} </td>
      <td> {{ $datas->lama }} </td>
      <td> {{ $datas->tindakan }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection