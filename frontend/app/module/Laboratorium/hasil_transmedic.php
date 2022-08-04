<html>
 <?php
// Connection
require_once 'connect.php'; 
$role='MANAGER_HR';
$dbh = ibase_pconnect($db, $user, $password, '', 0, 3, $role, 0)
 or die(ibase_errmsg());

 session_start();
$tg='-';
$tno=$_GET['tno'];
$user='IT';
$ip='192.168.1.240'; 

//echo "ip=".$ip;

$sql="Insert into eventlog (el_tno,el_ev_code,el_comment,el_userid,el_datetime)
      values (?,?,?,?,current_timestamp) ";

$query = ibase_prepare($dbh,$sql );

ibase_execute($query, $tno,'View',$ip, $user);

$sql="select oh_tno,oh_last_name,oh_age_yy,oh_trx_dt,oh_pid,oh_pcmt,oh_diag1,clinic_desc,OH_DNAME from ord_hdr left join hfclinic on oh_clinic_code=clinic_code where OH_SNO='$tno'";
$sth = ibase_query($dbh, $sql);


$row1 = ibase_fetch_assoc($sth);

$noLAB= $row1['OH_TNO'];
$sql = "select x.od_tno,x.od_testcode,x.od_test_grp,x.od_item_type, tg_name,
   case when od_testcode=od_order_ti then n1*10000
       when od_item_parent<>od_order_ti then n1*10000+n2*100+x.od_seq_no+1
       else n1*10000+(x.od_seq_no+1)*100 end SeqNo,
   case when od_testcode=od_order_ti then ti_name
       when od_item_parent<>od_order_ti then '. . . '||ti_name
       else '. .'||ti_name  end tname,
   case when x.od_data_type='W' then (select of_text from ord_ftr where of_testcode=x.od_testcode and of_tno=x.od_tno rows 1)
        when (tv_code is null)and(x.od_tr_comment is not null) then x.od_tr_val|| ' '||x.od_tr_comment
        when (tv_code is null)and(x.od_tr_comment is null) then x.od_tr_val
        when (tv_code is not null)and(x.od_tr_comment is not null) then tv_desc|| ' '||x.od_tr_comment
        else tv_desc end valu,
   case when x.od_tr_range='MRR' then (select tr_mrr_desc from tr_range where tr_ti_code=x.od_testcode and tr_range_desc='MRR' rows 1)
        else x.od_tr_range end range,
   x.od_tr_flag, x.od_tr_unit,x.od_tr_range,x.od_action_flag,sg_desc,x.od_data_type

  from ord_dtl x left join (select a.od_seq_no+1+(cast(tg_ls_code as integer))*10 n1,a.od_testcode tc1 from ord_dtl a left join test_group on od_test_grp=tg_code 
  where a.od_tno='$noLAB'  and a.od_testcode=a.od_order_ti)
    on x.od_order_ti=tc1
    left join (select b.od_seq_no+1 n2,b.od_testcode tc2 from ord_dtl b where b.od_tno ='$noLAB'   and b.od_item_type='P')
    on x.od_item_parent=tc2 left join textvalue on x.od_tr_val=tv_code
    ,test_item left join sub_group on ti_code=sg_code ,Test_group
  where x.od_tno ='$noLAB'  and
   x.od_testcode=ti_code and
   x.od_test_grp=tg_code
order by seqno ";


//file_get_contents('view.sql');

$sth = ibase_query($dbh, $sql);

$count = 0;
while ($row[$count] = ibase_fetch_assoc($sth))
    $count++;





?> 

<head>

<title>Hasil LAB Transmedic</title>
</head>
<body>
  <style type="text/css">
    #customers {
        /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; */
        border-collapse: collapse;
        width: 100%;
    }

    #customers td,
    #customers th {
        border: 1px solid #ddd;
        /*padding: 8px;*/
    }

table {
border-collapse: collapse;
}
#border-none 
td,
#border-none  th {
        border:none
        /*padding: 8px;*/
    }
  table td,
  table th {
        border: 1px solid #ddd;
        /*padding: 8px;*/
    }
    #customers tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    #customers tr:hover {
        background-color: #ddd;
    }

    #customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #41abf2;
        color: white;
    }
  </style>
<form name="f2" action="kumulatif.php" method="GET">
<table id="border-none">   
   <font face=arial size=3> 
   <tr><td width=250> No.Lab : <? echo $row1['OH_TNO']?></td><td width=290 align=left> Asal : <? echo $row1['CLINIC_DESC']?></td>
   <tr><td width=250><b> No.MR  : <? echo $row1['OH_PID']?></td> <td width=290 align=left>Nama Pasien  : <font color=Blue><b>  <? echo $row1["OH_LAST_NAME"].". ".$row1["OH_AGE_YY"]." Th."?></td>
   <td width=90><a href="kumulatif.php?tno=<?echo $row1['OH_TNO']?>&pid=<?echo $row1['OH_PID']?>&name=<?echo $row1['OH_LAST_NAME']?>"</a>[Kumulatif] </td>
   </td>
      <tr><td width=250><b> No.Order  : <? echo $tno ?></td><td width=290 align=left> Dokter : <? echo $row1['OH_DNAME']?></td>
  </tr>
   <? if ($row1["OH_DIAG1"]<>'') { echo "<tr><td colspan=3><b> Ket.Klinis : ".$row1["OH_DIAG1"]."</b> </td></tr>";};?> 
</table>
</form>

<table >

  <tr bgcolor=#10AA10 align=center> <b>
    <td width="190"><font size=2 color=yellow><b>Pemeriksaan</td>
    <td width="10"><font size=2 color=yellow><b>Flag</td>
    <td width="100"><font size=2 color=yellow><b>Hasil</td>
    <td width="100"><font size=2 color=yellow><b>Unit</td>			
    <td width="270"><font size=2 color=yellow><b>Nilai Rujukan</td>	</b>		
  </tr>
</font>

<?php


for ($i = 0; $i < $count; $i++){
 

   if (($i % 2)==1) echo "<tr bgcolor=#CCDDFF>";
     else echo "<tr bgcolor=#FFFFFF>";
 
    if ($tg<>$row[$i]["TG_NAME"]) if (substr($row[$i]['TNAME'],1,1)<>' ')  {echo "<td><font face=arial size=3 color=#1122DD><b>".$row[$i]['TG_NAME']."</b></td></tr><tr>";
     $tg=$row[$i]["TG_NAME"];}
     
   
   if (($row[$i]["OD_ITEM_TYPE"]=='P')or($row[$i]['OD_DATA_TYPE']=='W')) echo "<td><font face=arial size=2 color=#108801><b>".$row[$i]['TNAME']."</b></td>";
     else echo "<td><font face=arial size=2>".$row[$i]['TNAME']."</td>";

    echo "<td align=center><font face=arial size=2>".$row[$i]['OD_TR_FLAG']."</td>";
   $hasil=$row[$i]['VALU'];    
   $hasil=str_replace(' ', '&nbsp;', $hasil);
   $hasil=nl2br($hasil);
   $range=$row[$i]["RANGE"];
   //$range=str_replace(' ', '&nbsp;', $range);
   
 if ($row[$i]['OD_DATA_TYPE']=='W') {
 if ($row[$i]['OD_TEST_GRP']<>'MB') 
    {echo "<td></td><td></td><td></td></table><table><tr><td><font face=courier size=2>".$hasil."</td></tr>"; 
?> 
</table><table>
  <tr> <b>
    <td width="190"></td>
    <td width="10"></td>
    <td width="100"></td>
    <td width="100"></td>			
    <td width="270"></td>	</b>		
  </tr>
<? 
  } else{
$sql="select preparat,sucept,ms_desc,mh_spl_site from mbr_hdr,mbr_sample where mh_tno='$tno' and mh_testcode='".$row[$i]['OD_TESTCODE']."' and ms_code=mh_spl_type ";
$sth2 = ibase_query($dbh, $sql);
$row2 = ibase_fetch_assoc($sth2);

echo "<td></td><td></td><td></td></table><table><tr><td><font face=courier size=2> Sample : ".$row2['MS_DESC']."</td></tr>";

IF ($row2['PREPARAT'] =='Y') {  
$sql="select * from mbr_pcd where mp_tno='$tno' and mp_testcode='".$row[$i]['OD_TESTCODE']."'";
$sth3 = ibase_query($dbh, $sql);
$row3 = ibase_fetch_assoc($sth3);
echo "<tr><td><font face=courier size=2>".nl2br($row3['MP_TEXT'])."</td></tr><tr></tr>"; 
}  
IF ($row2['SUCEPT'] =='Y') {  
$sql="select mo_org_num,mo_org_code,og_ab_group,og_name,mo_org_qty from mbr_org,organism where 
      mo_org_code=og_code and mo_tno='$tno' and mo_testcode='".$row[$i]['OD_TESTCODE']."' order by og_code";
$sth3 = ibase_query($dbh, $sql);
  while ($row3 = ibase_fetch_object($sth3)) {
	echo "<tr><td> Ditemukan Kuman : ".$row3->OG_NAME."</td></tr><tr><td></td></tr>"; 
	echo "<tr><td> RESISTENSI </td></tr></tabble>"; 
?> <table> <tr bgcolor=#505050 align=center> <b>
    <td width="240"><font size=2 color=white><b>Organisma</td>
    <td width="70"><font size=2 color=white><b>MIN</td>
    <td width="70"><font size=2 color=white><b>MAX</td>
    <td width="100"><font size=2 color=white><b>MIC</td>
    <td width="60"><font size=2 color=white><b>Hasil</td>	</b>		
  </tr>
<?	
$sql="select ab_name,ms_mic,ms_ss_code,ms_orgcode,ab_code from mbr_scp,antibiotic 
     where ms_abcode=ab_code and ms_tno='$tno' and ms_testcode='".$row[$i]['OD_TESTCODE']."' and ms_orgcode='".$row3->MO_ORG_CODE."' order by ab_seqno, ab_name";
$sth2 = ibase_query($dbh, $sql);
  while ($row2 = ibase_fetch_object($sth2)) {
	echo "<tr><td>".$row2->AB_NAME."</td><td></td><td></td><td align=center>".$row2->MS_MIC."</td><td align=center>".$row2->MS_SS_CODE."</td></tr>";
  }

  }
 }

 } } 
 ELSE {

   if (($row[$i]["OD_ACTION_FLAG"]<>'R')and($row[$i]["OD_ITEM_TYPE"]=='U'))    
   if ($hasil<>'') $hasil="Menyusul*"; else $hasil="Menyusul";
   if ($row[$i]["OD_TR_FLAG"]<>'') echo "<td><font face=arial size=2 color=red><b>".$hasil."</b></td>";
     else echo "<td><font face=arial size=2>".$hasil."</td>";


?>
    <td><font face=arial size=2><?php echo $row[$i]["OD_TR_UNIT"];?></td>
    <td align=center><font face=arial size=2><?php echo nl2br($range);?></td>
  </tr>
<?php 
 }	 
 

 }
 ?>

   <? if ($row1["OH_PCMT"]<>'') { echo "<tr><td colspan=6 height=35><font face=arial size=2> <b>  Catatan : ".$row1["OH_PCMT"]."</b> </td></tr>";};?> 

</table>
</body>
</html>