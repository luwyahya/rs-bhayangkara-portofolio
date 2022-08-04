@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">

 FORMULIR KEPATUHAN PELAKSANAAN PROSEDUR SITE MARKING PADA PASIEN YANG AKAN DILAKUKAN TINDAKAN OPERASI RAWAT INAP 


</h2>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Tindakan</th>
      <th> Site Marking Ada (Ya/Tidak) Saat Serah Terima </th>

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
      <td> {{ $datas->tindakan_operasi }} </td>
      <td> {{ $datas->site_marking}} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection