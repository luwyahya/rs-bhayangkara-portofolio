VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmSuratTugas 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmSuratTugas.frx":0000
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
Attribute VB_Name = "frmSuratTugas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSuratTugas

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmSuratTugas = Nothing
End Sub

Public Sub Cetak(view As String, noPlanning As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmSuratTugas = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1, hari, bulan, strDate, bulan1, tglPelatihan As String
strDate = Format(Now, "dd/MMM/yyyy")
bulan = getBulan(Format(strDate, "yyyy/MM/dd"))
Set Report = New crSuratTugas
      
    strSQL = "SELECT sp.tglpengajuan,UPPER(sp.namaplanning) as namaplanning,sp.deskripsiplanning as penyelenggara,sp.tempat, " & _
             "sp.keteranganlainnya,convert(varchar, sp.tglsiklusawal, 105) as tglsiklusawal,convert(varchar, sp.tglsiklusakhir, 105) as tglsiklusakhir, " & _
             "spd.pegawaifk,pg.nippns,pg.namalengkap,mp.objectjabatanfk,jb.namajabatan,spd.asalprodukfk,ap.asalproduk,pd.pendidikan " & _
             "FROM strukplanning_t as sp " & _
             "INNER JOIN strukplanningdetail_t as spd on spd.noplanningfk = sp.norec " & _
             "LEFT JOIN  pegawai_m as pg on pg.id = spd.pegawaifk " & _
             "LEFT JOIN mappegawaijabatantounitkerja_m as mp on mp.objectpegawaifk = pg.id " & _
             "LEFT JOIN jabatan_m as jb on jb.id = mp.objectjabatanfk " & _
             "LEFT JOIN asalproduk_m as ap on ap.id = spd.asalprodukfk " & _
             "LEFT JOIN pendidikan_m as pd on pd.id = pg.objectpendidikanterakhirfk " & _
             "where sp.statusenabled = 1 and sp.noplanning='" & noPlanning & "' "
    ReadRs strSQL
    If Not rs.EOF Then
        hari = getHari(Format(rs!tglsiklusawal, "yyyy/MM/dd"))
        bulan1 = getBulan(Format(rs!tglsiklusawal, "yyyy/MM/dd"))
        If Format(rs!tglsiklusawal, "dd ") = Format(rs!tglsiklusakhir, "dd ") Then
            tglPelatihan = Format(rs!tglsiklusawal, "dd ") & bulan1 & Format(rs!tglsiklusawal, " yyyy")
        Else
            tglPelatihan = Format(rs!tglsiklusawal, "dd ") & " s.d. " & Format(rs!tglsiklusakhir, "dd ") & bulan1 & Format(rs!tglsiklusawal, " yyyy")
        End If
        
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    
    
    With Report
        .database.AddADOCommand CN_String, adocmd
        If Not rs.EOF Then
'            .txtTglPrint.SetText Format(RS!tglsiklusawal, "dd ") & " s.d. " & Format(RS!tglsiklusawal, "dd") & bulan1 & Format(RS!tglsiklusawal, " yyyy")
            .txtTglPrint2.SetText Format(strDate, "dd ") & bulan & Format(strDate, " yyyy")
'            .txtHar.SetText hari & ","
            .usNamaPelatihan.SetUnboundFieldSource ("{ado.namaplanning}")
            .txtTanggalPelatihan.SetText tglPelatihan
            .udtJamAwal.SetUnboundFieldSource ("{ado.tglsiklusawal}")
            .udtJamAwal.SetUnboundFieldSource ("{ado.tglsiklusakhir}")
            .usRuangPelatihan.SetUnboundFieldSource ("{ado.tempat}")
            .txtJudulPelatihan.SetText rs!namaplanning
            .txtTglPelaksanaan.SetText tglPelatihan
            .unIdPegawai.SetUnboundFieldSource ("{ado.pegawaifk}")
            .usNamaUndangan.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaJabatan.SetUnboundFieldSource ("{ado.pendidikan}")
'            .txtJabatanDirek1.SetText rs!jabatandirek
'            .txtJabatanDirek2.SetText rs!jabatandirek
'            .txtNamaDirek1.SetText rs!namadirek
'            .txtNamaDirek2.SetText rs!namadirek
'            .txtNip1.SetText "NIP. " & rs!nipdirek
'            .txtNip2.SetText "NIP. " & rs!nipdirek

            .txtNmrPelatihan1.SetText "  "
            .txtNmrPelatihan2.SetText "  "
            
          
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "PasienDaftar")
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
        End If
    End With
Exit Sub
errLoad:
End Sub
