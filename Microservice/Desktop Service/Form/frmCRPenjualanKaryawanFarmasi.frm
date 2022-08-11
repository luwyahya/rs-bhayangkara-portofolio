VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRPenjualanKaryawanFarmasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7200
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5760
   Icon            =   "frmCRPenjualanKaryawanFarmasi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7200
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
Attribute VB_Name = "frmCRPenjualanKaryawanFarmasi"
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

    Set frmCRPenjualanKaryawanFarmasi = Nothing
End Sub

Public Sub Cetak(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, karyawan As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPenjualanKaryawanFarmasi = Nothing
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
        str3 = " and sp.namakurirpengirim='" & karyawan & "' "
    End If
    
Set Report = New crPenjualanHarianFarmasi
'    strSQL = "select sp.tglstruk, sp.nostruk,  upper(sp.namapasien_klien) as namapasien, '-' as noregistrasi, " & _
'            "case when jk.jeniskelamin = 'Laki-laki' then 'L' else 'P' end as jeniskelamin, 'Umum/Sendiri' as kelompokpasien, pg.namalengkap, " & _
'            "'-' as namaruangan,ru.namaruangan as ruanganapotik, spd.qtyproduk as jumlah, spd.hargasatuan,spd.resepke,  (spd.qtyproduk)*(spd.hargasatuan) as subtotal, " & _
'            "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa, " & _
'            "0 as ppn, (spd.qtyproduk*spd.hargasatuan)-0-0-0 as total, case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
'            "case when pg3.namalengkap is null then '-' else pg3.namalengkap end  as kasir " & _
'            "from strukpelayanan_t as sp " & _
'            "LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
'            "inner JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec " & _
'            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
'            "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk inner JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
'            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            str1 & _
'            str2 & _
'            str3 & " order by sp.nostruk"
    strSQL = "select * from (select sp.tglstruk, sp.nostruk,  upper(sp.namapasien_klien) as namapasien, '-' as noregistrasi, " & _
                "case when jk.jeniskelamin = 'Laki-laki' then 'L' else 'P' end as jeniskelamin, 'Umum/Sendiri' as kelompokpasien, pg.namalengkap, " & _
                "'-' as namaruangan,ru.namaruangan as ruanganapotik, spd.qtyproduk as jumlah, spd.hargasatuan,spd.resepke,  (spd.qtyproduk)*(spd.hargasatuan) as subtotal, " & _
                "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa, " & _
                "0 as ppn, (spd.qtyproduk*spd.hargasatuan)-0-0-0 as total, case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
                "case when pg3.namalengkap is null then '-' else pg3.namalengkap end  as kasir,(spd.qtyproduk * spd.hargadiscount) as diskontotal " & _
                "from strukpelayanan_t as sp " & _
                "LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
                "left JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
                "left JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
                "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
                "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk left JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
                "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern <> '-' " & _
                str1 & _
                str2 & _
                str3 & ""
    strSQL = strSQL & "union all select sp.tglstruk, sp.nostruk,  upper(sp.namapasien_klien) as namapasien, '-' as noregistrasi, " & _
            "'-' as jeniskelamin, 'Umum/Sendiri' as kelompokpasien, pg.namalengkap, " & _
            "'-' as namaruangan,ru.namaruangan as ruanganapotik, spd.qtyproduk as jumlah, spd.hargasatuan,spd.resepke,  (spd.qtyproduk)*(spd.hargasatuan) as subtotal, " & _
            "case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon, case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa, " & _
            "0 as ppn, (spd.qtyproduk*spd.hargasatuan)-0-0-0 as total, case when sp.nosbmlastfk is null then 'N' else'P' end as statuspaid, " & _
            "case when pg3.namalengkap is null then '-' else pg3.namalengkap end  as kasir,(spd.qtyproduk * spd.hargadiscount) as diskontotal " & _
            "from strukpelayanan_t as sp " & _
            "LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
            "left JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
            "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
            "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk inner JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk_intern = '-' " & _
            str1 & _
            str2 & _
            str3 & " )as x order by x.nostruk"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            If karyawan = "Karyawan" Then
                .Text4.SetText "LAPORAN PENJUALAN OBAT KARYAWAN"
            ElseIf karyawan = "Poli Karyawan" Then '
                .Text4.SetText "LAPORAN PENJUALAN OBAT POLI KARYAWAN"
            End If
            '.Text4.SetText "LAPORAN PENJUALAN OBAT BEBAS"
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .udtTglResep.SetUnboundFieldSource ("{ado.tglstruk}")
            .usNoResep.SetUnboundFieldSource ("{ado.nostruk}")
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
            .ucDiskonBener.SetUnboundFieldSource ("{ado.diskontotal}")
            .ucHargaBener.SetUnboundFieldSource ("{ado.subtotal}")
            .ucJasaBener.SetUnboundFieldSource ("{ado.jasa}")
            .ucPPNBener.SetUnboundFieldSource ("{ado.ppn}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usStatusPaid.SetUnboundFieldSource ("{ado.statuspaid}")
            .usKasir.SetUnboundFieldSource ("{ado.kasir}")
            .usrke.SetUnboundFieldSource ("{ado.resepke}")
            .usRuanganFarmasi.SetUnboundFieldSource ("{ado.ruanganapotik}")
            
            
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
