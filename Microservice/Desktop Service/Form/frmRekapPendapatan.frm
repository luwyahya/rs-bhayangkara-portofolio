VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmRekapPendapatan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmRekapPendapatan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5820
   WindowState     =   2  'Maximized
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
      Left            =   4920
      TabIndex        =   4
      Top             =   480
      Width           =   975
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
      Left            =   3960
      TabIndex        =   3
      Top             =   480
      Width           =   975
   End
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
      TabIndex        =   2
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7000
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5800
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
      EnableSelectExpertButton=   -1  'True
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   -1  'True
      EnableHelpButton=   -1  'True
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmRekapPendapatan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRekapPendapatan
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "RekapPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmRekapPendapatan = Nothing
End Sub

Public Sub CetakRekapPendapatan(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, idDokter As String, PrintBy As String, idKelompok As String, NamaKasir As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmRekapPendapatan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2, str3, str4, str5, str6 As String
    Dim NamaDirut, nippns1, Namakeuangan, nippns2, NamaKplInst, nippns3, view As String
    
    
    
    view = "true"
    If idDokter <> "" Then
        str1 = "and apd.objectpegawaifk=" & idDokter & " "
    End If
    If idDepartemen <> "" Then
        If idDepartemen = 16 Then
            str4 = " and ru.objectdepartemenfk in (16,17,26)"
'            str5 = " pg.id = 641"
        Else
            If idDepartemen <> "" Then
                str4 = " and ru.objectdepartemenfk =" & idDepartemen & " "
'                str5 = " pg.id = 192"
            End If
        End If
    End If
    If idRuangan <> "" Then
        str2 = " and apd.objectruanganfk=" & idRuangan & " "
    End If
    If idKelompok <> "" Then
        If idKelompok = 153 Then
            str3 = " and kps.id in (1,3,5) "
        Else
            If idKelompok <> "" Then
                str3 = " and kps.id =" & idKelompok & " "
            End If
        End If
    End If
Set Report = New crRekapPendapatan

    strSQL = "select * from (select apd.objectruanganfk, ru.namaruangan, apd.objectpegawaifk, pg.namalengkap, pd.noregistrasi, kps.id as kpsid, " & _
            "(case when pd.objectkelompokpasienlastfk = 1 then pd.noregistrasi else null end) as nonpj, " & _
            "(case when  pd.objectkelompokpasienlastfk > 1 then pd.noregistrasi else null end) as jm, " & _
            "pp.hargajual as hargapp, pp.jumlah as jumlahpp, case when pp.hargadiscount is null then 0 else pp.hargadiscount  end as diskonpp,kp.id as kpid, ppd.komponenhargafk as khid, " & _
            "ppd.hargajual as hargappd, ppd.jumlah as jumlahppd, case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end as diskonppd " & _
            "from pasiendaftar_t as pd " & _
            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec " & _
            "left join pegawai_m as pg on pg.id=apd.objectpegawaifk " & _
            "left join ruangan_m as ru on ru.id=apd.objectruanganfk " & _
            "left join departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
            "left join produk_m as pr on pr.id=pp.produkfk " & _
            "left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
            "left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
            "left join kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "left join pasien_m as ps on ps.id=pd.nocmfk " & _
            "left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
            "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 " & _
            " " & str1 & " " & str2 & " " & str3 & " " & str4 & " " & _
            ") as x order by x.namalengkap"

'strSQL = "select distinct * from (select sp.statusenabled, apd.objectruanganfk, ru.namaruangan, apd.objectpegawaifk, pg.namalengkap, pd.noregistrasi, kps.id as kpsid, " & _
'            "(case when pd.objectkelompokpasienlastfk = 1 then pd.noregistrasi else null end) as nonpj, " & _
'            "(case when  pd.objectkelompokpasienlastfk > 1 then pd.noregistrasi else null end) as jm, " & _
'            "pp.hargajual as hargapp, pp.jumlah as jumlahpp, case when pp.hargadiscount is null then 0 else pp.hargadiscount  end as diskonpp,kp.id as kpid, ppd.komponenhargafk as khid, " & _
'            "ppd.hargajual as hargappd, ppd.jumlah as jumlahppd, case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end as diskonppd " & _
'            "from pasiendaftar_t as pd " & _
'            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec " & _
'            "left join pegawai_m as pg on pg.id=apd.objectpegawaifk " & _
'            "left join ruangan_m as ru on ru.id=apd.objectruanganfk " & _
'            "left join departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
'            "left join produk_m as pr on pr.id=pp.produkfk " & _
'            "left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
'            "left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
'            "left join kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
'            "left join pasien_m as ps on ps.id=pd.nocmfk " & _
'            "left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
'            "left join strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec " & _
'            "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 " & _
'            " " & str1 & " " & str2 & " " & str3 & " " & str4 & " " & _
'            "order by pg.namalengkap) as x where x.statusenabled is null "
   
   
    ReadRs2 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
            "from pegawai_m as pg " & _
            "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
            "where pg.objectjabatanstrukturalfk = 82"
            
    ReadRs3 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
            "from pegawai_m as pg " & _
            "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
            "where pg.objectjabatanstrukturalfk = 155"
    If PrintBy = "1" Then
        
        ReadRs4 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
            "from pegawai_m as pg " & _
            "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
            "where pg.objectjabatanstrukturalfk = 436 "
        str6 = "Ka. Instalasi Rawat Jalan"
      
        
    Else
          ReadRs4 "select pg.namalengkap,pg.nippns " & _
                "from pegawai_m as pg " & _
                "where pg.id = 255 "
        str6 = "Ka.Instalasi Eksekutif Edelweis"
    
    End If
    
    
    
            
   If RS2.EOF = False Then
        NamaDirut = RS2!namalengkap
        nippns1 = "NIP. " & RS2!nippns
    Else
        NamaDirut = "-"
        nippns1 = "NIP. -"
    End If
    
    If RS3.EOF = False Then
        Namakeuangan = RS3!namalengkap
        nippns2 = "NIP. " & RS3!nippns
    Else
        Namakeuangan = "-"
        nippns2 = "NIP. -"
    End If
    
    If RS4.EOF = False Then
        NamaKplInst = RS4!namalengkap
        nippns3 = "NIP. " & RS4!nippns
    Else
        NamaKplInst = "-"
        nippns3 = "NIP. -"
    End If
    
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText NamaKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
'            .usNamaKasir.SetUnboundFieldSource ("{ado.kasir}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .namaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .jCH.SetUnboundFieldSource ("{ado.nonpj}")
            .jJM.SetUnboundFieldSource ("{ado.jm}")
            .usKP.SetUnboundFieldSource ("{ado.kpid}")
            .usKPS.SetUnboundFieldSource ("{ado.kpsid}")
            .usKH.SetUnboundFieldSource ("{ado.khid}")
            .ucHargaPP.SetUnboundFieldSource ("{ado.hargapp}")
            .ucJumlahPP.SetUnboundFieldSource ("{ado.jumlahpp}")
            .ucDiskonPP.SetUnboundFieldSource ("{ado.diskonpp}")
            .ucHargaPPD.SetUnboundFieldSource ("{ado.hargappd}")
            .ucJumlahPPD.SetUnboundFieldSource ("{ado.jumlahppd}")
            .ucDiskonPPD.SetUnboundFieldSource ("{ado.diskonppd}")
            .txtPegawai2.SetText NamaDirut
            .txtNip2.SetText nippns1
            .txtPegawai1.SetText Namakeuangan
            .txtNip1.SetText nippns2
            .txtPegawai3.SetText NamaKplInst
            .txtNIP3.SetText nippns3
            .txtJabatan3.SetText str6
'        ReadRs2 "SELECT pg.namalengkap, jb.namajabatan, pg.nippns FROM pegawai_m as pg " & _
'                "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
'                "where pg.id=776"
'
'        If RS2.BOF Then
'            .txtJabatan1.SetText "-"
'            .txtPegawai1.SetText "-"
'            .txtnip1.SetText "-"
'        Else
'            .txtJabatan1.SetText UCase(IIf(isnull(RS2("namajabatan")), "-", RS2("namajabatan")))
'            .txtPegawai1.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            .txtnip1.SetText UCase(IIf(isnull(RS2("nippns")), "-", "NIP. " & RS2("nippns")))
'        End If
'
'        ReadRs2 "SELECT pg.namalengkap, jb.namajabatan, pg.nippns FROM pegawai_m as pg " & _
'                "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
'                "where pg.id=143"
'
'        If RS2.BOF Then
'            .txtJabatan2.SetText "-"
'            .txtPegawai2.SetText "-"
'            .txtnip2.SetText "-"
'        Else
'            .txtJabatan2.SetText UCase(IIf(isnull(RS2("namajabatan")), "-", RS2("namajabatan")))
'            .txtPegawai2.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            .txtnip2.SetText UCase(IIf(isnull(RS2("nippns")), "-", "NIP. " & RS2("nippns")))
'        End If
'
'        ReadRs2 "SELECT pg.namalengkap, jb.namajabatan, pg.nippns FROM pegawai_m as pg " & _
'                "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
'                "where " & str5 & ""
'
'        If RS2.BOF Then
'            .txtJabatan3.SetText "-"
'            .txtPegawai3.SetText "-"
'            .txtnip3.SetText "-"
'        Else
'            .txtJabatan3.SetText UCase(IIf(isnull(RS2("namajabatan")), "-", RS2("namajabatan")))
'            .txtPegawai3.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            .txtnip3.SetText UCase(IIf(isnull(RS2("nippns")), "-", "NIP. " & RS2("nippns")))
'        End If
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RekapPenerimaan")
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
