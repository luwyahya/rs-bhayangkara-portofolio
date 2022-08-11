VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRSuratTagihanDeposit 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRSuratTagihanDeposit.frx":0000
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
Attribute VB_Name = "frmCRSuratTagihanDeposit"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New cr_SuratTagihanDeposit
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
    Report.PrinterSetup Me.hWnd
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRSuratTagihanDeposit = Nothing
End Sub

Public Sub Cetak(noregistrasi As String, total As String, deposit As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRSuratTagihanDeposit = Nothing
Dim adocmd As New ADODB.Command
Set Report = New cr_SuratTagihanDeposit
        
    strSQL = "select CURRENT_DATE as dates, " & _
            "to_char(pd.tglregistrasi, 'yyyy/MM/dd') as tglregistrasi, ps.nocm, ps.namapasien, ru.namaruangan " & _
            "from pasiendaftar_t as pd " & _
            "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
            "INNER JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
            "where pd.noregistrasi='" & noregistrasi & "'"
    
'    ReadRs "select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - " & _
'            "case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + " & _
'            "case when pp.jasa is null then 0 else pp.jasa end) as totaltagihan " & _
'            "from pasiendaftar_t as pd " & _
'            "INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "where pd.noregistrasi='" & noregistrasi & "' and pp.produkfk not in (402611)"
'
'    ReadRs2 "SELECT case when pp.hargajual is null then 0 else pp.hargajual end as deposit " & _
'            "from pasiendaftar_t as pd " & _
'            "INNER join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec " & _
'            "INNER join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "where pd.noregistrasi='" & noregistrasi & "' and pp.produkfk=402611"
            
    Dim tsisa, tdeposit, ttagihan As Double
    Dim totals As String
    
'    Dim i As Integer
'
'    For i = 0 To RS.RecordCount - 1
'        ttagihan = ttagihan + CDbl(IIf(IsNull(RS!totaltagihan), 0, RS!totaltagihan))
'        RS.MoveNext
'
'    Next
'    For i = 0 To RS2.RecordCount - 1
'        tdeposit = tdeposit + CDbl(IIf(IsNull(RS2!deposit), 0, RS2!deposit))
'        RS2.MoveNext
'
'    Next
    totals = total ' Replace(total, ".", ",")
    ttagihan = totals
    tdeposit = deposit
    tsisa = ttagihan - tdeposit
    If tsisa < 0 Then
        tsisa = 0
    End If
    
    ReadRs3 strSQL
    
    Dim dayPrint, datePrint, monthPrint, yearPrint, days, dates, months, years, tglCetak, Tgl As String
    Dim strPasien, strNoMR, strRuangRawat As String
    Dim strTgl, strDate As String
    
    If RS3.EOF Then
       strPasien = "-"
       strNoMR = "-"
       strRuangRawat = "-"
    Else
        strDate = RS3!dates
        dayPrint = getHari(Format(strDate, "yyyy/MM/dd"))
        monthPrint = getBulan(Format(strDate, "yyyy/MM/dd"))
        datePrint = Format(strDate, "dd")
        yearPrint = Format(strDate, "yyyy")
        tglCetak = dayPrint + " " + datePrint + " " + monthPrint + " " + yearPrint
        
        strTgl = RS3!tglregistrasi
        days = getHari(Format(strTgl, "yyyy/MM/dd"))
        months = getBulan(Format(strTgl, "yyyy/MM/dd"))
        dates = Format(strTgl, "dd")
        years = Format(strTgl, "yyyy")
        Tgl = days + ", " + dates + " " + months + " " + years
        
        strPasien = UCase(IIf(IsNull(RS3("namapasien")), "-", RS3("namapasien")))
        strNoMR = UCase(IIf(IsNull(RS3("nocm")), "-", RS3("nocm")))
        strRuangRawat = UCase(IIf(IsNull(RS3("namaruangan")), "-", RS3("namaruangan")))
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtCetak.SetText "Jakarta, " & tglCetak
            .txtTglRegis.SetText Tgl
            .txtNoMR.SetText strNoMR
            .txtPasienHead.SetText strPasien
            .txtPasien.SetText strPasien
            .txtRuangRawat.SetText strRuangRawat
            .txtTotalTagihan.SetText Format(ttagihan, "##,##0.00")
            .txtTotalDeposit.SetText Format(tdeposit, "##,##0.00")
            .txtTotalSisa.SetText Format(tsisa, "##,##0.00")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
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
