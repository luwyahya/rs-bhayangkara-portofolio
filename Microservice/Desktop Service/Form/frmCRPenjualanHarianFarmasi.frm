VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRPenjualanHarianFarmasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7215
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5760
   Icon            =   "frmCRPenjualanHarianFarmasi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7215
   ScaleWidth      =   5760
   WindowState     =   2  'Maximized
   Begin VB.ComboBox cboPrinter 
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   960
      TabIndex        =   3
      Top             =   600
      Width           =   2775
   End
   Begin VB.CommandButton cmdCetak 
      Caption         =   "Cetak"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   3720
      TabIndex        =   2
      Top             =   600
      Width           =   975
   End
   Begin VB.CommandButton cmdOption 
      Caption         =   "Option"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   4680
      TabIndex        =   1
      Top             =   600
      Width           =   1095
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7215
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5775
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   -1  'True
      EnableNavigationControls=   -1  'True
      EnableStopButton=   -1  'True
      EnablePrintButton=   -1  'True
      EnableZoomControl=   -1  'True
      EnableCloseButton=   -1  'True
      EnableProgressControl=   -1  'True
      EnableSearchControl=   -1  'True
      EnableRefreshButton=   -1  'True
      EnableDrillDown =   -1  'True
      EnableAnimationControl=   -1  'True
      EnableSelectExpertButton=   0   'False
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmCRPenjualanHarianFarmasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crPenjualanHarianFarmasi
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub


Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRPenjualanHarianFarmasi = Nothing
End Sub

Public Sub CetakPenjualanHarianFarmasi(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPenjualanHarianFarmasi = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    
    If idPegawai <> "" Then
        str1 = "and sr.penulisresepfk=" & idPegawai & " "
    End If
    If idRuangan <> "" Then
        str2 = " and ru.id=" & idRuangan & " "
    End If
    If idKelompokPasien <> "" Then
        str3 = " and kp.id=" & idKelompokPasien & " "
    End If
    
Set Report = New crPenjualanHarianFarmasi
'    strSQL = "select sr.tglresep, sr.noresep, pd.noregistrasi, upper(ps.namapasien) as namapasien," & _
'            "case when jk.jeniskelamin = 'Laki-laki' then 'L' else 'P' end as jeniskelamin, " & _
'            "kp.kelompokpasien, pg.namalengkap, ru2.namaruangan,ru.namaruangan as ruanganapotik, pp.jumlah, pp.hargajual,sr.noresep  +  pp.rke as rke,  " & _
'            "(pp.jumlah)*(pp.hargajual) as subtotal," & _
'            "case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon, " & _
'            "case when pp.jasa is null then 0 else pp.jasa end as jasa, 0 as ppn, (pp.jumlah*pp.hargajual)-0-0-0 as total, " & _
'            "case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, case when pg2.namalengkap is null then pg3.namalengkap else pg2.namalengkap end  as kasir " & _
'            "from strukresep_t as sr " & _
'            "LEFT JOIN pelayananpasien_t as pp on pp.strukresepfk = sr.norec " & _
'            "LEFT JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk " & _
'            "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
'            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
'            "inner JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
'            "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner JOIN pegawai_m as pg on pg.id=sr.penulisresepfk " & _
'            "left join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec " & _
'            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk " & _
'            "left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk " & _
'            "inner JOIN ruangan_m as ru on ru.id=sr.ruanganfk " & _
'            "inner JOIN ruangan_m as ru2 on ru2.id=apd.objectruanganfk " & _
'            "inner join kelompokpasien_m kp on kp.id=pd.objectkelompokpasienlastfk " & _
'            "where sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            str1 & _
'            str2 & _
'            str3 & " order by sr.noresep"
' strSQL = "select sr.tglresep, sr.noresep, pd.noregistrasi, upper(ps.namapasien) as namapasien," & _
'            "case when jk.jeniskelamin = 'Laki-laki' then 'L' else 'P' end as jeniskelamin, " & _
'            "kp.kelompokpasien, pg.namalengkap, ru2.namaruangan,ru.namaruangan as ruanganapotik, pp.jumlah, pp.hargajual,sr.noresep  +  pp.rke as rke,  " & _
'            "(pp.jumlah)*(pp.hargajual) as subtotal," & _
'            "case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon, " & _
'            "case when pp.jasa is null then 0 else pp.jasa end as jasa, 0 as ppn, " & _
'            "case when pd.nosbmlastfk is null then 'N' else'P' end as statuspaid,case when pg2.namalengkap is null then pg3.namalengkap else pg2.namalengkap end  as kasir " & _
'            "from strukresep_t as sr " & _
'            "LEFT JOIN pelayananpasien_t as pp on pp.strukresepfk = sr.norec " & _
'            "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
'            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
'            "inner JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
'            "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner JOIN pegawai_m as pg on pg.id=sr.penulisresepfk " & _
'            "left join strukbuktipenerimaan_t as sbm on sbm.norec = pd.nosbmlastfk " & _
'            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk " & _
'            "left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk " & _
'            "inner JOIN ruangan_m as ru on ru.id=sr.ruanganfk " & _
'            "inner JOIN ruangan_m as ru2 on ru2.id=apd.objectruanganfk " & _
'            "inner join kelompokpasien_m kp on kp.id=pd.objectkelompokpasienlastfk " & _
'            "where sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            str1 & _
'            str2 & _
'            str3 & " and sr.statusenabled = 't' and pp.jumlah > 0 order by sr.noresep"
    strSQL = "select sr.norec,sr.tglresep,sr.noresep,pd.noregistrasi,upper(ps.namapasien) as namapasien,(case when jk.id = 1 then 'l' when jk.id = 2 then 'p' else '-' end) as jeniskelamin, " & _
             "kp.kelompokpasien,pg.namalengkap,ru2.namaruangan,ru.namaruangan as ruanganapotik,pp.jumlah,pp.hargajual as harga,pp.rke as rke,(pp.jumlah)*(pp.hargajual) as subtotal, " & _
             "case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon,case when pp.jasa is null then 0 else pp.jasa end as jasa,0 as ppn, " & _
             "case when pd.nosbmlastfk is null then 'n' else'p' end as statuspaid,pg3.namalengkap as namakasir,sr.noresep  +  pp.rke as rke,(pp.jumlah)*(pp.hargadiscount) as diskontotal " & _
             "from strukresep_t as sr " & _
             "left join pelayananpasien_t as pp on pp.strukresepfk = sr.norec " & _
             "left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
             "left join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
             "left join pasien_m as ps on ps.id=pd.nocmfk " & _
             "left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
             "left join pegawai_m as pg on pg.id=sr.penulisresepfk " & _
             "left join ruangan_m as ru on ru.id=sr.ruanganfk " & _
             "left join ruangan_m as ru2 on ru2.id=apd.objectruanganfk " & _
             "left JOIn kelompokpasien_m kp on kp.id=pd.objectkelompokpasienlastfk " & _
             "left join strukbuktipenerimaan_t as sbm on sbm.norec = pd.nosbmlastfk " & _
             "left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
             "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk " & _
             "where sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "" & str1 & " " & str2 & " " & str3 & ""
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usRuangan1.SetUnboundFieldSource ("{ado.namaruangan}")
            .usKelPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usJumlahResep.SetUnboundFieldSource ("{ado.jumlah}")
            .ucSubtotal.SetUnboundFieldSource ("{ado.subtotal}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskontotal}")
            .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
            .ucPpn.SetUnboundFieldSource ("{ado.ppn}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHargaBener.SetUnboundFieldSource ("{ado.harga}")
            .ucDiskonBener.SetUnboundFieldSource ("{ado.diskon}")
            .ucJasaBener.SetUnboundFieldSource ("{ado.jasa}")
            .ucPPNBener.SetUnboundFieldSource ("{ado.ppn}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usStatusPaid.SetUnboundFieldSource ("{ado.statuspaid}")
            .usKasir.SetUnboundFieldSource ("{ado.namakasir}")
            .usrke.SetUnboundFieldSource ("{ado.rke}")
            .usRuanganFarmasi.SetUnboundFieldSource ("{ado.ruanganapotik}")
            .usNorecResep.SetUnboundFieldSource ("{ado.norec}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenjualanHarianFarmasi")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakPenjualanHarianFarmasiBebas(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPenjualanHarianFarmasi = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    
    If idPegawai <> "" Then
        str1 = "and sp.objectpegawaipenanggungjawabfk=" & idPegawai & " "
    End If
    If idRuangan <> "" Then
        str2 = " and ru.id=" & idRuangan & " "
    End If
'    If idKelompokPasien <> "" Then
'        str3 = " and kp.id=" & idKelompokPasien & " "
'    End If
    
Set Report = New crPenjualanHarianFarmasi
'    strSQL = "select * from (select sp.tglstruk, sp.nostruk,  upper(sp.namapasien_klien) as namapasien, '-' as noregistrasi, " & _
'            "case when jk.jeniskelamin = 'Laki-laki' then 'L' else 'P' end as jeniskelamin, 'Umum/Sendiri' as kelompokpasien, pg.namalengkap, " & _
'            "'-' as namaruangan,ru.namaruangan as ruanganapotik, spd.qtyproduk as jumlah, spd.hargasatuan,spd.resepke,  (spd.qtyproduk)*(spd.hargasatuan) as subtotal, " & _
'            "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa, " & _
'            "0 as ppn, (spd.qtyproduk*spd.hargasatuan)-0-0-0 as total, case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
'            "case when pg3.namalengkap is null then '-' else pg3.namalengkap end  as kasir " & _
'            "from strukpelayanan_t as sp " & _
'            "LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
'            "left JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "left JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
'            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
'            "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk left JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
'            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern <> '-' and sp.namakurirpengirim in (null,'') " & _
'            str1 & _
'            str2 & _
'            str3 & "'"
'    strSQL = strSQL & "union all select sp.tglstruk, sp.nostruk,  upper(sp.namapasien_klien) as namapasien, '-' as noregistrasi, " & _
'            "'-' as jeniskelamin, 'Umum/Sendiri' as kelompokpasien, pg.namalengkap, " & _
'            "'-' as namaruangan,ru.namaruangan as ruanganapotik, spd.qtyproduk as jumlah, spd.hargasatuan,spd.resepke,  (spd.qtyproduk)*(spd.hargasatuan) as subtotal, " & _
'            "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa, " & _
'            "0 as ppn, (spd.qtyproduk*spd.hargasatuan)-0-0-0 as total, case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
'            "case when pg3.namalengkap is null then '-' else pg3.namalengkap end  as kasir " & _
'            "from strukpelayanan_t as sp " & _
'            "LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
'            "left JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
'            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
'            "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk inner JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
'            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern = '-' and sp.namakurirpengirim in (null,'') " & _
'            str1 & _
'            str2 & _
'            str3 & ")as x order by x.nostruk"
   strSQL = "select sp.norec,pg.namalengkap,ru.namaruangan as ruangan,'-' as namadepartemen,'-' as namaruangan,sp.tglstruk as tglresep,CONVERT (VARCHAR, sp.tglstruk, 8) AS jamresep,sp.nostruk as noresep, " & _
            "pr.kdproduk,pr.id as idproduk,pr.namaproduk,ss.satuanstandar,spd.qtyproduk as jumlah,spd.hargasatuan as hargajual,case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, " & _
            "case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa,0 as ppn,(spd.qtyproduk * spd.hargasatuan) as subtotal,case when jkm.jeniskemasan is null then '-' else jkm.jeniskemasan end as jeniskemasan,case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid," & _
            "'-' as jenisracikan,'-' as kodefarmatologi,upper(sp.namapasien_klien) as namapasien,sp.tglfaktur as tgllahir,'-' as nocm,'-' as noregistrasi,'-' as jeniskelamin,'umum/sendiri' as kelompokpasien,sp.namatempattujuan as alamatlengkap,'-' as namaibu,spd.resepke,pg3.namalengkap as namakasir,(spd.qtyproduk * spd.hargadiscount) as diskontotal  " & _
            "from strukpelayanan_t as sp inner join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec left join produk_m as pr on pr.id=spd.objectprodukfk left join satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk left join jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk " & _
            "left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk " & _
            "left join ruangan_m as ru on ru.id=sp.objectruanganfk " & _
            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            "" & str1 & " " & str2 & " " & _
            "and sp.nostruk_intern='-' and sp.objectkelompoktransaksifk=2 and SUBSTRING (sp.nostruk,1,2) = 'OB' "
    
    strSQL = strSQL & "UNION ALL " & _
            "select sp.norec,pg.namalengkap,ru.namaruangan as ruangan,'-' as namadepartemen,'-' as namaruangan,sp.tglstruk as tglresep,CONVERT (VARCHAR, sp.tglstruk, 8) AS jamresep,sp.nostruk as noresep, " & _
            "pr.kdproduk,pr.id as idproduk,pr.namaproduk,ss.satuanstandar,spd.qtyproduk as jumlah,spd.hargasatuan as hargajual,case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, " & _
            "case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa,0 as ppn,(spd.qtyproduk * spd.hargasatuan) as subtotal,case when jkm.jeniskemasan is null then '-' else jkm.jeniskemasan end as jeniskemasan,case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
            "'-' as jenisracikan,'-' as kodefarmatologi,upper(sp.namapasien_klien) as namapasien,sp.tglfaktur as tgllahir,ps.nocm as nocm,'-' as noregistrasi,'-' as jeniskelamin,'umum/sendiri' as kelompokpasien,al.alamatlengkap as alamatlengkap,ps.namaibu as namaibu,spd.resepke,pg3.namalengkap as namakasir,(spd.qtyproduk * spd.hargadiscount) as diskontotal " & _
            "from strukpelayanan_t as sp left join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec left join produk_m as pr on pr.id=spd.objectprodukfk left join satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk left join jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk " & _
            "inner join pasien_m as ps on ps.nocm=sp.nostruk_intern inner join alamat_m as al on al.nocmfk= ps.id inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk left join ruangan_m as ru on ru.id=sp.objectruanganfk " & _
            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            "" & str1 & " " & str2 & " " & _
            "AND sp.nostruk_intern not in ('-') and sp.objectkelompoktransaksifk=2 and SUBSTRING (sp.nostruk,1,2) = 'OB' " & _
            " order by tglresep"
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .Text4.SetText "LAPORAN PENJUALAN OBAT BEBAS"
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usRuangan1.SetUnboundFieldSource ("{ado.namaruangan}")
            .usKelPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usJumlahResep.SetUnboundFieldSource ("{ado.jumlah}")
            .ucSubtotal.SetUnboundFieldSource ("{ado.subtotal}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskontotal}")
            .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
            .ucPpn.SetUnboundFieldSource ("{ado.ppn}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHargaBener.SetUnboundFieldSource ("{ado.subtotal}")
            .ucDiskonBener.SetUnboundFieldSource ("{ado.diskontotal}")
            .ucJasaBener.SetUnboundFieldSource ("{ado.jasa}")
            .ucPPNBener.SetUnboundFieldSource ("{ado.ppn}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usStatusPaid.SetUnboundFieldSource ("{ado.statuspaid}")
            .usKasir.SetUnboundFieldSource ("{ado.namakasir}")
            .usrke.SetUnboundFieldSource ("{ado.resepke}")
            .usRuanganFarmasi.SetUnboundFieldSource ("{ado.ruangan}")
            .usNorecResep.SetUnboundFieldSource ("{ado.norec}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenjualanHarianFarmasi")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
