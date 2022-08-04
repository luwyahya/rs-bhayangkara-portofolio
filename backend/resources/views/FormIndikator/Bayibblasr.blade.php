@extends("FormIndikator/bodyprint")
@section("content")

<h2 align="center" style="margin-top: 5px">


 FORMULIR KEMAMPUAN MENANGANI BAYI BBLASR ≤ 1000 GR

</h2>
<table class="table1">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=90>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien/Bayi</th>
      <th>BB / 1000 gr</th>
      <th>Tanggal Lahir</th>
      <th>Tanggal Pulang</th>
      <th width=400>Keterangan</th>

    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )


    <?php
    $tgl = strtotime($datas->tanggal);
    $tgl = Date('d/m/Y',$tgl);

    $tgllahir = strtotime($datas->tgllahir);
    $tgllahir = Date('d/m/Y',$tgllahir);

    $tglpulang = strtotime($datas->tglpulang);
    $tglpulang = Date('d/m/Y',$tglpulang);



    ?>


    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $tgl }} </td>
      <td> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->bb100gr }} </td>
      <td> {{ $tgllahir }} </td>
      <td> {{ $tglpulang }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection