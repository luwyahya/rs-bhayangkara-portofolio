VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRPenjualanObatBebas 
   Caption         =   "Transmedic"
   ClientHeight    =   7260
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5805
   Icon            =   "frmCRPenjualanObatBebas.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7260
   ScaleWidth      =   5805
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
Attribute VB_Name = "frmCRPenjualanObatBebas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
'Dim Report As New crDetailPengeluaranObatBebas
Dim Report As New crDetailPengeluaranObatBebas2
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

    Set frmCRPenjualanObatBebas = Nothing
End Sub


Public Sub Cetak(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, karyawan As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPenjualanObatBebas = Nothing
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
    If karyawan <> "" Then
        If karyawan = "Karyawan" Then
            str3 = " and sp.namakurirpengirim='Karyawan' "
        Else
            str3 = " and sp.namakurirpengirim='Poli Karyawan' "
        End If
'   Else
'        str3 = " and sp.namakurirpengirim in (null,'')"
    End If
'    If idKelompokPasien <> "" Then
'        str3 = " and kp.id=" & idKelompokPasien & " "
'    End If
    
'Set Report = New crDetailPengeluaranObatBebas
Set Report = New crDetailPengeluaranObatBebas2
'    strSQL = "select * from (select sp.nostruk as noresep,pr.id as idproduk, pr.kdproduk,pr.namaproduk,ss.satuanstandar,spd.qtyproduk as jumlah,spd.hargasatuan as hargajual," & _
'            "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as hargadiscount, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa," & _
'            "(spd.qtyproduk * spd.hargasatuan)+ spd.hargatambahan - spd.hargadiscount as subtotal,sp.tglstruk as tglresep,case when jkm.jeniskemasan is null then '-' else jkm.jeniskemasan end as jeniskemasan," & _
'            "'-' as jenisracikan,'-' as noregistrasi,case when ps.nocm is null then '-' else ps.nocm end as nocm,upper(sp.namapasien_klien) as namapasien," & _
'            "case when jk.jeniskelamin = 'laki-laki' then 'l' else 'p' end as jeniskelamin,al.alamatlengkap,ps.namaibu,pg.namalengkap," & _
'            "'-' as namaruangan,'umum/sendiri' as kelompokpasien,ru.namaruangan as ruangan, '-' as namadepartemen " & _
'            "from strukpelayanan_t as sp " & _
'            "left join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec left join produk_m as pr on pr.id=spd.objectprodukfk " & _
'            "left join satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk left join jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk " & _
'            "left join pasien_m as ps on ps.nocm=sp.nostruk_intern left join alamat_m as al on al.nocmfk= ps.id left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
'            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern <> '-' " & _
'            str1 & str2 & str3 & _
'            "union all select sp.nostruk as noresep,pr.id as idproduk, pr.kdproduk,pr.namaproduk,ss.satuanstandar,spd.qtyproduk as jumlah,spd.hargasatuan as hargajual," & _
'            "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as hargadiscount, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa," & _
'            "(spd.qtyproduk * spd.hargasatuan)+ spd.hargatambahan - spd.hargadiscount as subtotal,sp.tglstruk as tglresep,case when jkm.jeniskemasan is null then '-' else jkm.jeniskemasan end as jeniskemasan," & _
'            "'-' as jenisracikan,'-' as noregistrasi,'-' as nocm,upper(sp.namapasien_klien) as namapasien, " & _
'            "'-' as jeniskelamin,sp.alamattempattujuan as alamatlengkap,'-' as namaibu,pg.namalengkap, " & _
'            "'-' as namaruangan,'umum/sendiri' as kelompokpasien,ru.namaruangan as ruangan, '-' as namadepartemen " & _
'            "from strukpelayanan_t as sp " & _
'            "left JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec left join produk_m as pr on pr.id=spd.objectprodukfk " & _
'            "left join satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk left join jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk " & _
'            "left JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
'            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern = '-' " & _
'            str1 & str2 & str3 & ") as x order by x.noresep"

    strSQL = "select sp.norec,pg.namalengkap,ru.namaruangan as ruangan,'-' as namadepartemen,'-' as namaruangan,sp.tglstruk as tglresep,CONVERT (VARCHAR, sp.tglstruk, 8) AS jamresep,sp.nostruk as noresep, " & _
            "pr.kdproduk,pr.id as idproduk,pr.namaproduk,ss.satuanstandar,spd.qtyproduk as jumlah,spd.hargasatuan as hargajual,case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon,(spd.qtyproduk * spd.hargadiscount) as diskontotal, " & _
            "case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa,0 as ppn,(spd.qtyproduk * spd.hargasatuan) as subtotal,case when jkm.jeniskemasan is null then '-' else jkm.jeniskemasan end as jeniskemasan,case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid," & _
            "'-' as jenisracikan,'-' as kodefarmatologi,upper(sp.namapasien_klien) as namapasien,sp.tglfaktur as tgllahir,'-' as nocm,'-' as noregistrasi,'-' as jeniskelamin,'umum/sendiri' as kelompokpasien,sp.namatempattujuan as alamatlengkap,'-' as namaibu,spd.resepke,pg3.namalengkap as namakasir,(spd.qtyproduk * spd.hargadiscount) as diskontotal  " & _
            "from strukpelayanan_t as sp inner join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec left join produk_m as pr on pr.id=spd.objectprodukfk left join satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk left join jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk " & _
            "left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk " & _
            "left join ruangan_m as ru on ru.id=sp.objectruanganfk " & _
            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern='-' and SUBSTRING (sp.nostruk,1,2) = 'OB' " & _
            str1 & str2 & str3
    strSQL = strSQL & "UNION ALL " & _
            "select sp.norec,pg.namalengkap,ru.namaruangan as ruangan,'-' as namadepartemen,'-' as namaruangan,sp.tglstruk as tglresep,CONVERT (VARCHAR, sp.tglstruk, 8) AS jamresep,sp.nostruk as noresep, " & _
            "pr.kdproduk,pr.id as idproduk,pr.namaproduk,ss.satuanstandar,spd.qtyproduk as jumlah,spd.hargasatuan as hargajual,case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon,(spd.qtyproduk * spd.hargadiscount) as diskontotal, " & _
            "case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa,0 as ppn,(spd.qtyproduk * spd.hargasatuan) as subtotal,case when jkm.jeniskemasan is null then '-' else jkm.jeniskemasan end as jeniskemasan,case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
            "'-' as jenisracikan,'-' as kodefarmatologi,upper(sp.namapasien_klien) as namapasien,sp.tglfaktur as tgllahir,ps.nocm as nocm,'-' as noregistrasi,'-' as jeniskelamin,'umum/sendiri' as kelompokpasien,al.alamatlengkap as alamatlengkap,ps.namaibu as namaibu,spd.resepke,pg3.namalengkap as namakasir,(spd.qtyproduk * spd.hargadiscount) as diskontotal " & _
            "from strukpelayanan_t as sp left join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec left join produk_m as pr on pr.id=spd.objectprodukfk left join satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk left join jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk " & _
            "inner join pasien_m as ps on ps.nocm=sp.nostruk_intern inner join alamat_m as al on al.nocmfk= ps.id inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk left join ruangan_m as ru on ru.id=sp.objectruanganfk " & _
            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' AND sp.nostruk_intern not in ('-') and SUBSTRING (sp.nostruk,1,2) = 'OB' " & _
            str1 & str2 & str3 & _
            " order by tglresep"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        If karyawan = "Karyawan" Then
            .Text4.SetText "LAPORAN PENJUALAN OBAT KARYAWAN"
        ElseIf karyawan = "Poli Karyawan" Then '
            .Text4.SetText "LAPORAN PENJUALAN OBAT POLI KARYAWAN"
        End If
'            .txtPrinted.SetText namaPrinted
'            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
'            .udtTglResep.SetUnboundFieldSource ("{ado.tglstruk}")
'            .usNoResep.SetUnboundFieldSource ("{ado.nostruk}")
'            .usRuangan1.SetUnboundFieldSource ("{ado.namaruangan}")
'            .usKelPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
'            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
'            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
'            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
'            .usJumlahResep.SetUnboundFieldSource ("{ado.jumlah}")
'            .ucSubTotal.SetUnboundFieldSource ("{ado.subtotal}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
'            .ucPpn.SetUnboundFieldSource ("{ado.ppn}")
''            .ucTotal.SetUnboundFieldSource ("{ado.total}")
'            .usStatusPaid.SetUnboundFieldSource ("{ado.statuspaid}")
'            .usKasir.SetUnboundFieldSource ("{ado.kasir}")
'            .usrke.SetUnboundFieldSource ("{ado.resepke}")
'            .usRuanganFarmasi.SetUnboundFieldSource ("{ado.ruanganapotik}")
'
            'sample
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtNamaUser.SetText namaPrinted
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaUnit.SetUnboundFieldSource ("{ado.namaruangan}")
            .usUnit.SetUnboundFieldSource ("{ado.ruangan}")
            .udtTanggal.SetUnboundFieldSource ("{ado.tglresep}")
'            .udtJam.SetUnboundFieldSource ("{ado.tglresep}")
            .usDepart.SetUnboundFieldSource ("{ado.namadepartemen}")
            .unIDProduk.SetUnboundFieldSource ("{ado.idproduk}")
            .unKdProduk.SetUnboundFieldSource ("{ado.kdproduk}")
            .usNamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
            .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
            .ucQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .ucTotalDiskon.SetUnboundFieldSource ("{ado.diskontotal}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
            .ucSubtotal.SetUnboundFieldSource ("{ado.subtotal}")
            .usKdFarma.SetUnboundFieldSource ("{ado.noresep}")
            .usJenisKemasan.SetUnboundFieldSource ("{ado.jeniskemasan}")
            .usJenisRacikan.SetUnboundFieldSource ("{ado.jenisracikan}")
            '.usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usKelTransaksi.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNamaIbu.SetUnboundFieldSource ("{ado.namaibu}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
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
