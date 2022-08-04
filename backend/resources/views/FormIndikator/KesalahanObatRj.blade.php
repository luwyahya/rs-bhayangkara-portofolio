@extends("FormIndikator/bodyprint")
@section("content")

<div  align="center">
  <h2 >
  FORMULIR ANGKA INSIDEN KESALAHAN PEMBERIAN OBAT DI RAWAT JALAN

 </h2>
</div>

<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th width="250">DPJP</th>
      <th width="140">Nama Obat yang Harus Diberi</th>
      <th width="140">Nama Obat Yang Salah Diberi</th>
      <th width="250">Ket/Alasan</th>

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
      <td> {{ $datas->dpjp }} </td>
      <td> {{ $datas->obat_harus }} </td>
      <td> {{ $datas->obat_salah }} </td>
      <td> {{ $datas->ket }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection