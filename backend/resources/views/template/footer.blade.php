@if (isset($footer)  )
  <tr >
  		<td>
  			<table style="margin-top:15px;">
  				<tr>
  					<td width="600">
  						@php
  							$tgl=date("d-m-Y");
  						@endphp
  						<p style="margin-left:30px"><font face="Arial"><font style="font-size: 9pt">Waktu Pengambilan Spesimen :</font> <b><font style="font-size: 8pt">{{$tgl}}</font></b></font></p>
  					</td>
  				</tr>
  				<tr>
  					<td >
  						<p style="margin-left:30px"><font face="Arial"><font style="font-size: 9pt">EDTA - </font></p>
						<p style="margin-left:30px"><font face="Arial"><font style="font-size: 9pt">SERUM / PLASMA - </font></p>
						<p style="margin-left:30px"><font face="Arial"><font style="font-size: 9pt;">Catatan :
            <b>{!! isset($order_lab) && !empty($order_lab) ? $order_lab->catatan : '-' !!}</b>
            </font></p>
  					</td>
  					<td style="text-align: center">
  						<font style="font-size: 9pt" face="Arial">Cibinong, {{ date ('Y-m-d H:i:s') }}</font>
                        <br>
                        <font style="font-size: 9pt" face="Arial"> Pemeriksa</font>
  					</td>
  				</tr>
  				<tr>
  					<td height="200">
                        <span style="margin-left:30px">	<font face="Arial" style="font-size: 9pt">
                                Verifikasi : <b>{{  date ('Y-m-d H:i:s')  .' ('.$r['nama'].')' }}</b> </font>
                        </span>
						<br>
                        <span style="margin-left:30px">
						<font face="Arial" style="font-size: 9pt"> Cetak : <b>{{  date ('Y-m-d H:i:s') .' ('.$r['nama'].')' }}</b> </font>
                        </span>
						<br>
                        <span style="margin-left:30px">
						<font face="Arial" style="font-size: 9pt"> ** : <b> Nilai Kritis</b> </font>
                        </span>
  					</td>
                    <td style="text-align: center">
  						<font face="Arial" style="font-size: 9pt"><b>{{ $raw->djp }}</b></font>
  					</td>
  				</tr>
  			</table>
  		</td>
  </tr>
@endif
