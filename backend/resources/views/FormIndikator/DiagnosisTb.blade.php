@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">
  FORMULIR PENEGAKAN DIAGNOSIS TB MELALUI PEMERIKSAAN MIKROSKOPI
</h2>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Diagnosis</th>
      <th width="250" >DPJP</th>
      <th >Pemeriksaan</th>
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
      <td> {{ $datas->diagnosis }} </td>
      <td > {{ $datas->dpjp }} </td>
      <td> {{ $datas->pemeriksaan }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection