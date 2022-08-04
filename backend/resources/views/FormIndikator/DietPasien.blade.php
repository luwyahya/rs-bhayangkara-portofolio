@extends("FormIndikator/bodyprint")
@section("content")

 

<div  align="center">
<h2 >
 FORMULIR KETEPATAN DIET PASIEN

</h2>
</div>

<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width="100">Tempat Lahir</th>
      <th width="150">Tgl Lahir</th>
      <th width=300>Nama Pasien</th>
      <th width="100">Diagnosa</th>
      <th >Jenis Diet</th>
      <th width="50">Ketepatan</th>
      <th width="140">Keterangan</th>

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

      $tgllahir = strtotime($datas->tgllahir);
    $tgllahir = date("d-m-Y"); 

    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->tempatlahir }} </td>
      <td> {{ $tgllahir }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->diagnosa }} </td>
      <td> {{ $datas->jenis }} </td>
      <td> {{ $datas->ketepatan }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection