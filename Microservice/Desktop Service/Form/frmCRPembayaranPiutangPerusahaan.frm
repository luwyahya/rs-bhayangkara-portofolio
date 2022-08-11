VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRPembayaranPiutangPerusahaan 
   Caption         =   "Transmedic"
   ClientHeight    =   6705
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6330
   Icon            =   "frmCRPembayaranPiutangPerusahaan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   6705
   ScaleWidth      =   6330
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
      TabIndex        =   3
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
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   6735
      Left            =   0
      TabIndex        =   4
      Top             =   0
      Width           =   6255
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
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   0
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCRPembayaranPiutangPerusahaan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crPembayaranPiutangPerusahaan
Dim Reports As New crRekapPembayaranPiutangPerusahaan
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
    Reports.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
    Reports.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    Reports.PrinterSetup Me.hwnd
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

    Set frmCRPembayaranPiutangPerusahaan = Nothing
End Sub

Public Sub cetakTgl(tglAwal As String, tglAkhir As String, idPerusahaan As String, noCollecting As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRPembayaranPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2 As String
    
    If idPerusahaan <> "" Then
        str1 = " and rkn.id=" & idPerusahaan & " "
    End If
    If noCollecting <> "" Then
        str2 = " and  php.noposting='" & noCollecting & "' "
    End If
                
    Set Report = New crPembayaranPiutangPerusahaan
    
    strSQL = "select sbm.tglsbm, php.noposting,rkn.id as idrekanan,rkn.namarekanan,php.statusenabled, " & _
            "sbm.keteranganlainnya, sum(sbm.totaldibayar) as totaldibayar " & _
            "FROM postinghutangpiutang_t as php " & _
            "left JOIN strukpelayananpenjamin_t as spp on spp.norec=php.nostrukfk " & _
            "inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk " & _
            "left JOIN strukpelayanan_t as spy on spy.norec=spp.nostrukfk " & _
            "left JOIN pasiendaftar_t as pd on pd.norec=spy.noregistrasifk " & _
            "left JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk " & _
            "left JOIN strukposting_t as sp on sp.noposting=php.noposting " & _
            "left JOIN loginuser_s as lu on lu.id=sp.kdhistorylogins " & _
            "where sbm.tglsbm between '" & tglAwal & "' and '" & tglAkhir & "' and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76 " & _
            str1 & _
            str2 & _
            "group by sbm.tglsbm, php.noposting,rkn.id,rkn.namarekanan,php.statusenabled,sbm.keteranganlainnya " & _
            "order by sbm.tglsbm"
    
    ReadRs strSQL
    
    Dim tBayar As Double
    Dim i As Integer
    Dim x As Double
    
    For i = 0 To rs.RecordCount - 1
        tBayar = tBayar + CDbl(IIf(IsNull(rs!totaldibayar), 0, rs!totaldibayar))
        
        rs.MoveNext
    Next i
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinter.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaPerusahaan.SetUnboundFieldSource ("{ado.namarekanan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noposting}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keteranganlainnya}")
            .udTglKeluar.SetUnboundFieldSource ("{ado.tglsbm}")
            .unSubtotal.SetUnboundFieldSource ("{ado.totaldibayar}")
            
            x = Round(tBayar)
            .txtTerbilang.SetText "# " & TERBILANG(x) & " #"
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPembayaranPiutangPerusahaan")
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
    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub Cetak(noPosting As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRPembayaranPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    
    If noPosting <> "" Then
        str1 = " and php.noposting= '" & noPosting & "' "
    End If
                
    Set Report = New crPembayaranPiutangPerusahaan
    
    strSQL = "select sbm.tglsbm, php.noposting,rkn.id as idrekanan,rkn.namarekanan,php.statusenabled, " & _
            "sbm.keteranganlainnya, sum(sbm.totaldibayar)as totaldibayar " & _
            "FROM postinghutangpiutang_t as php " & _
            "left JOIN strukpelayananpenjamin_t as spp on spp.norec=php.nostrukfk " & _
            "inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk " & _
            "left JOIN strukpelayanan_t as spy on spy.norec=spp.nostrukfk " & _
            "left JOIN pasiendaftar_t as pd on pd.norec=spy.noregistrasifk " & _
            "left JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk " & _
            "left JOIN strukposting_t as sp on sp.noposting=php.noposting " & _
            "left JOIN loginuser_s as lu on lu.id=sp.kdhistorylogins " & _
            "where sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76 " & _
            str1 & _
            "group by sbm.tglsbm, php.noposting,rkn.id,rkn.namarekanan,php.statusenabled,sbm.keteranganlainnya " & _
            "order by sbm.tglsbm"
    
    ReadRs strSQL
    
    Dim tBayar As Double
    Dim i As Integer
    Dim x As Double
    
    For i = 0 To rs.RecordCount - 1
        tBayar = tBayar + CDbl(IIf(IsNull(rs!totaldibayar), 0, rs!totaldibayar))
        
        rs.MoveNext
    Next i
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinter.SetText namaPrinted
            '.txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaPerusahaan.SetUnboundFieldSource ("{ado.namarekanan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noposting}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keteranganlainnya}")
            .udTglKeluar.SetUnboundFieldSource ("{ado.tglsbm}")
            .unSubtotal.SetUnboundFieldSource ("{ado.totaldibayar}")
            
            x = Round(tBayar)
            .txtTerbilang.SetText "# " & TERBILANG(x) & " #"
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPembayaranPiutangPerusahaan")
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
    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakRekap(tglAwal As String, tglAkhir As String, idPerusahaan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRPembayaranPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2 As String
    
    If idPerusahaan <> "" Then
        str1 = " and rkn.id=" & idPerusahaan & " "
    End If
    
    str2 = getBulan(Format(tglAwal, "yyyy/MM/dd"))
                
    Set Reports = New crRekapPembayaranPiutangPerusahaan
    
    strSQL = "SELECT x.tglbayar, x.adm, sum(x.totaldibayar)as totaldibayar from " & _
             "(select to_char(sbm.tglsbm,'dd-MM-yyyy') as tglbayar,  0 as adm, " & _
             "sbm.totaldibayar " & _
             "from postinghutangpiutang_t as php " & _
             "inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk " & _
             "inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk " & _
             "inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk " & _
             "inner join strukposting_t as sp on sp.noposting = php.noposting " & _
             "inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk " & _
             "inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk " & _
             "where sbm.tglsbm between '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76)as x " & _
             str1 & _
             "group by x.tglbayar,x.adm " & _
             "order by x.tglbayar"
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reports
        .database.AddADOCommand CN_String, adocmd
            
            .txtPrinter.SetText namaPrinted
            .txtPeriode.SetText "Periode " & str2 & " " & Format(tglAwal, "yyyy") & ""
            .udTglBayar.SetUnboundFieldSource ("{ado.tglbayar}")
            .unAdm.SetUnboundFieldSource ("{ado.adm}")
            .unTotalBayar.SetUnboundFieldSource ("{ado.totaldibayar}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPembayaranPiutangPerusahaan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reports
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub


