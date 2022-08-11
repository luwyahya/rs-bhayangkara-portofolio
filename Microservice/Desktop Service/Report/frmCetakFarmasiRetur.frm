VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakFarmasiRetur 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakFarmasiRetur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
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
      Height          =   7005
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   9045
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   0   'False
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
Attribute VB_Name = "frmCetakFarmasiRetur"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_RincianRetur

Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim bolStrukResep As Boolean


Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolStrukResep = True Then
        ReportResep.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportResep.PrintOut False
    
    End If
End Sub

Private Sub CmdOption_Click()
    
    If bolStrukResep = True Then
        ReportResep.PrinterSetup Me.hwnd
    End If
    
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    strPrinter = strPrinter1
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakFarmasiRetur = Nothing

End Sub

Public Sub cetakStrukRetur(strNores As String, view As String, strUser As String)
'On Error GoTo errLoad
Set frmCetakFarmasiRetur = Nothing
Dim strSQL As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
                strSQL = "select top 1 srt.norec,srt.tglretur,srt.noretur,pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,pg.namalengkap, " & _
                         "ru.namaruangan ,ru2.namaruangan as ruanganpasien ,srt.keteranganlainnya,ps.tgllahir,kp.kelompokpasien as penjamin, " & _
                         "pg2.namalengkap as dokter,pr.namaproduk,jkm.jeniskemasan,ppr.rke,ppr.jumlah,ppr.hargasatuan " & _
                         "from strukretur_t as srt " & _
                         "LEFT JOIN strukresep_t as sr on sr.norec=srt.strukresepfk " & _
                         "LEFT JOIN pelayananpasienretur_t as ppr on ppr.strukreturfk=srt.norec " & _
                         "LEFT JOIN produk_m as pr on pr.id=ppr.produkfk " & _
                         "LEFT JOIN jeniskemasan_m as jkm on jkm.id=ppr.jeniskemasanfk " & _
                         "LEFT JOIN antrianpasiendiperiksa_t as apd on apd.norec=sr.pasienfk " & _
                         "LEFT JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                         "LEFT JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
                         "LEFT JOIN pegawai_m as pg on pg.id=srt.objectpegawaifk " & _
                         "LEFT JOIN pegawai_m as pg2 on pg2.id=apd.objectpegawaifk " & _
                         "LEFT JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk " & _
                         "LEFT JOIN ruangan_m as ru on ru.id=srt.objectruanganfk " & _
                         "LEFT JOIN ruangan_m as ru2 on ru.id=apd.objectruanganfk " & _
                         "where srt.norec='" & strNores & "'"
         
             ReadRs strSQL '& " limit 1 "
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            
           
             .txtnopendaftaran.SetText IIf(IsNull(rs("noregistrasi")), "-", rs("noregistrasi")) 'RS("noregistrasi")
             .TxtNocm.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm"))
             .txtnmpasien.SetText IIf(IsNull(rs("namapasien")), "-", rs("namapasien")) 'RS("namapasienjk")
    '        .txtklpkpasien.SetText RS("kelompokpasien")
             '.txtPenjamin.SetText IIf(isnull(RS("NamaPenjamin")), "Sendiri", RS("NamaPenjamin"))
             .txtNamaRuangan.SetText IIf(IsNull(rs("ruanganpasien")), "-", rs("ruanganpasien")) 'RS("ruanganpasien")
             .txtNamaRuanganFarmasi.SetText IIf(IsNull(rs("namaruangan")), "-", rs("namaruangan")) 'RS("namaruangan")
            If IsNull(rs("penjamin")) = True Then
                .txtPenjamin.SetText "-"
            Else
                .txtPenjamin.SetText rs("penjamin")
            End If
'             If RS("umur") = "-" Then
'                .txtUmur.SetText "-"
'             Else
                .txtUmur.SetText hitungUmur(Format(rs("tgllahir"), "dd/mm/yyyy"), Format(rs("tglregistrasi"), "dd/mm/yyyy"))
'             End If
             .txtNamaDokter.SetText IIf(IsNull(rs("dokter")), "-", rs("dokter"))
             .txtUser.SetText strUser
             
'            If Left(RS("noresep"), 2) = "OB" Then
'                .txtTelp0.Suppress = False
'                .txtTelp1.Suppress = False
'                .txtTelp2.Suppress = False
''                .txtTelp2.SetText IIf(isnull(RS("noteleponfaks")), "-", RS("noteleponfaks")) 'RS!noteleponfaks
'
'                .txtAl0.Suppress = False
'                .txtAl1.Suppress = False
'                .txtAl2.Suppress = False
''                .txtAl2.SetText IIf(isnull(RS("namatempattujuan")), "-", RS("namatempattujuan")) 'RS!namatempattujuan
'            Else
                
                .txtTelp0.Suppress = True
                .txtTelp1.Suppress = True
                .txtTelp2.Suppress = True
                
                .txtAl0.Suppress = True
                .txtAl1.Suppress = True
                .txtAl2.Suppress = True
'            End If
             
             
           '  .usSatuan.SetUnboundFieldSource ("{ado.SatuanJmlK}")
          '   .udtanggal.SetUnboundFieldSource ("{Ado.tglpelayanan}")
             .usNoResep.SetUnboundFieldSource ("{Ado.noretur}")
             .ucbiayasatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
    '2         .ucHrgSatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .ustindakan.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usQtyHrg.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .unQtyTotal.SetUnboundFieldSource ("{Ado.jumlah}")
'             .ucGrandTotal.SetUnboundFieldSource ("{Ado.totalharga}")
'             .undis.SetUnboundFieldSource ("{Ado.totaldiscound}")
'             .unTotal.SetUnboundFieldSource ("{Ado.totalbiaya}")
             
             .unRacikanKe.SetUnboundFieldSource ("{ado.rke}")
             .usJenisObat.SetUnboundFieldSource ("{ado.jeniskemasan}")
             
             
             
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakResep")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = ReportResep
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
        End With
Exit Sub
errLoad:

End Sub

