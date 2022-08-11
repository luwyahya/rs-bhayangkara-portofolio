VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRPenjualanObatPerDokter 
   Caption         =   "Transmedic"
   ClientHeight    =   6855
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   5775
   Icon            =   "frmCRPenjualanObatPerDokter.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   6855
   ScaleWidth      =   5775
   StartUpPosition =   3  'Windows Default
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
      Left            =   4680
      TabIndex        =   3
      Top             =   480
      Width           =   1095
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
      TabIndex        =   1
      Top             =   480
      Width           =   2775
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   6855
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
Attribute VB_Name = "frmCRPenjualanObatPerDokter"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim reportPenjualanPerDokter As New crPenjualanObatPerDokter
Dim adoReport As New ADODB.Command
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    reportPenjualanPerDokter.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    reportPenjualanPerDokter.PrintOut False
End Sub

Private Sub CmdOption_Click()
    reportPenjualanPerDokter.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub


Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenjualan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRPenjualanObatPerDokter = Nothing
End Sub

Public Sub CetakPenjualanObatPerDokter(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPenjualanObatPerDokter = Nothing
Dim adocmd As New ADODB.Command
Dim strSQL As String
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
    
    With reportPenjualanPerDokter
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
             strSQL = "select pg.namalengkap, ru2.namaruangan,sr.tglresep, sr.noresep, pr.id as idproduk, pr.namaproduk, " & _
                     "pp.jumlah, pp.hargajual, pp.jumlah*pp.hargajual as subtotal, " & _
                     "'-' as kodefarmatologi, ps.namapasien, ps.tgllahir," & _
                     "kp.kelompokpasien , ps.namaibu, al.alamatlengkap,(pp.jumlah)*(pp.hargadiscount) as diskontotal " & _
                     "from strukresep_t as sr " & _
                     "LEFT JOIN pelayananpasien_t as pp on pp.strukresepfk = sr.norec " & _
                     "LEFT JOIN strukpelayanan_t as sp on sp.norec=pp.strukterimafk " & _
                     "LEFT JOIN produk_m as pr on pr.id=pp.produkfk " & _
                     "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
                     "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                     "inner JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
                     "inner join alamat_m as al on al.nocmfk= ps.id " & _
                     "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
                     "inner JOIN pegawai_m as pg on pg.id=sr.penulisresepfk " & _
                     "left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbklastfk " & _
                     "left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk " & _
                     "inner JOIN ruangan_m as ru on ru.id=sr.ruanganfk " & _
                     "inner JOIN ruangan_m as ru2 on ru2.id=apd.objectruanganfk " & _
                     "inner join departemen_m as dp on dp.id=ru2.objectdepartemenfk " & _
                     "inner join kelompokpasien_m kp on kp.id=pd.objectkelompokpasienlastfk " & _
                     "where sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
                     str1 & _
                     str2 & _
                     str3
                     ''and dp.id=16 "
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtUmur.SetText "-"
            Else
                .txtUmur.SetText hitungUmur(Format(rs!tgllahir, "dd/mm/yyyy"), Format(Now, "dd/mm/yyyy"))
            End If
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaUnit.SetUnboundFieldSource ("{ado.namaruangan}")
            .udtTanggal.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .unKdProduk.SetUnboundFieldSource ("{ado.idproduk}")
            .usnamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotal.SetUnboundFieldSource ("{ado.subtotal}")
            .usKdFarma.SetUnboundFieldSource ("{ado.noresep}")
            '.usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usKelTransaksi.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNamaIbu.SetUnboundFieldSource ("{ado.namaibu}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenjualanObatPerDokter")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = reportPenjualanPerDokter
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


