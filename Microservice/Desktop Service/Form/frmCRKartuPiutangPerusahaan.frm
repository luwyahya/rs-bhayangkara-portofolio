VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRKartuPiutangPerusahaan 
   Caption         =   "Transmedic"
   ClientHeight    =   6705
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6330
   Icon            =   "frmCRKartuPiutangPerusahaan.frx":0000
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
Attribute VB_Name = "frmCRKartuPiutangPerusahaan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crKartuPiutangPerusahaan
Dim Reports As New crRekapSaldoPiutangPerusahaan
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

    Set frmCRKartuPiutangPerusahaan = Nothing
End Sub

Public Sub cetakTgl(tglAwal As String, tglAkhir As String, idPerusahaan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRKartuPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    
    If idPerusahaan <> "" Then
        str1 = " and p.id=" & idPerusahaan & " "
    End If
                
    Set Report = New crKartuPiutangPerusahaan
    
    strSQL = "select sp.norec, sp.tglposting, php.noposting,kp.kelompokpasien,rkn.id as idrekanan,rkn.namarekanan, " & _
            "php.statusenabled,p.namalengkap,spp.totalppenjamin,spp.totalsudahdibayar, " & _
            "(spp.totalppenjamin-spp.totalsudahdibayar) as saldo " & _
            "FROM postinghutangpiutang_t as php " & _
            "left JOIN strukpelayananpenjamin_t as spp on spp.norec=php.nostrukfk " & _
            "left JOIN strukpelayanan_t as spy on spy.norec=spp.nostrukfk " & _
            "left JOIN pasiendaftar_t as pd on pd.norec=spy.noregistrasifk " & _
            "left JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk " & _
            "left JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk " & _
            "left JOIN strukposting_t as sp on sp.noposting=php.noposting " & _
            "left JOIN loginuser_s as lu on lu.id=sp.kdhistorylogins " & _
            "left JOIN pegawai_m as p on p.id=lu.objectpegawaifk " & _
            "where sp.tglposting between '" & tglAwal & "' and '" & tglAkhir & "' " & _
            str1 & _
            "order by sp.tglposting"
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd

            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanTagihanPenjamin")
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

Public Sub cetakDetailPeriode(tglAwal As String, tglAkhir As String, idPerusahaan As String, noPosting As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRKartuPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2 As String
    
    If idPerusahaan <> "" Then
        str1 = " and rkn.id=" & idPerusahaan & " "
    End If
    If noPosting <> "" Then
        str2 = " and sp.noposting=" & noPosting & " "
    End If
                
    Set Report = New crKartuPiutangPerusahaan
    
    strSQL = "SELECT x.tglposting,x.keteranganlainnya,x.noposting,x.idrekanan,x.namarekanan,x.kps,x.adm,x.totalpenjamin,x.totalsudahdibayar,x.saldo FROM " & _
            "(select sp.tglposting,sbm.keteranganlainnya,php.noposting,rkn.id as idrekanan, rkn.namarekanan,'KPS-' +  rkn.id  + ' '  +  rkn.namarekanan as kps, " & _
            "0 as adm,sum(spp.totalppenjamin) as totalpenjamin,sum(spp.totalsudahdibayar) as totalsudahdibayar,sum(spp.totalppenjamin)-sum(spp.totalsudahdibayar) as saldo " & _
            "from postinghutangpiutang_t as php " & _
            "inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk " & _
            "inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk " & _
            "inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spy.norec " & _
            "inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk " & _
            "inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk " & _
            "inner join strukposting_t as sp on sp.noposting = php.noposting " & _
            "where sp.tglposting between '" & tglAwal & "' and '" & tglAkhir & "' and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk=76 " & _
            str1 & str2 & _
            "group by sp.tglposting,sbm.keteranganlainnya,php.noposting,rkn.id,rkn.namarekanan,php.statusenabled " & _
            "union all " & _
            "select sp.tglposting,sp.keteranganlainnya,php.noposting,rkn.id as idrekanan,rkn.namarekanan,'KPS-' +  rkn.id  + ' '  +  rkn.namarekanan as kps, " & _
            "0 as adm,sum(spp.totalppenjamin) as totalpenjamin,sum(spp.totalsudahdibayar) as totalsudahdibayar,sum(spp.totalppenjamin)-sum(spp.totalsudahdibayar) as saldo " & _
            "from postinghutangpiutang_t as php " & _
            "inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk " & _
            "inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk " & _
            "inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk " & _
            "inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk " & _
            "inner join strukposting_t as sp on sp.noposting = php.noposting " & _
            "where sp.tglposting between '" & tglAwal & "' and '" & tglAkhir & "' and sp.statusenabled = 1 " & _
            str1 & str2 & _
            "group by sp.tglposting,sp.keteranganlainnya,php.noposting,rkn.id,rkn.namarekanan,php.statusenabled)x order by x.tglposting,x.noposting,x.keteranganlainnya"
    
    ReadRs strSQL
    
    Dim tSaldo As Double
    Dim i As Integer
    Dim x As Double
    
    For i = 0 To rs.RecordCount - 1
        tSaldo = tSaldo + CDbl(IIf(IsNull(rs!saldo), 0, rs!saldo))
        
        rs.MoveNext
    Next i
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinter.SetText namaPrinted
            '.txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usKode.SetUnboundFieldSource ("{ado.idrekanan}")
            .usNamaPerusahaan.SetUnboundFieldSource ("{ado.namarekanan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noposting}")
            .udTglKeluar.SetUnboundFieldSource ("{ado.tglposting}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keteranganlainnya}")
            .unPiutang.SetUnboundFieldSource ("{ado.totalpenjamin}")
            .unBayar.SetUnboundFieldSource ("{ado.totalsudahdibayar}")
            .unSaldo.SetUnboundFieldSource ("{ado.saldo}")
            
            x = Round(tSaldo)
            .txtTerbilang.SetText "# " & TERBILANG(x) & " #"
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanTagihanPenjamin")
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

Public Sub Cetak(idPerusahaan As String, noPosting As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRKartuPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2 As String
    
    If idPerusahaan <> "" Then
        str1 = " rkn.id=" & idPerusahaan & " "
    End If
     If noPosting <> "" Then
        str2 = " and sp.noposting='" & noPosting & "' "
    End If
                
    Set Report = New crKartuPiutangPerusahaan
    
    strSQL = "select sp.norec, sbm.tglsbm,sbm.keteranganlainnya, php.noposting,'KPS - '  +  rkn.id as idrekanan,rkn.namarekanan, " & _
            "php.statusenabled,p.namalengkap,SUM(spp.totalppenjamin) as totalpenjamin,sum(spp.totalsudahdibayar) as totalsudahdibayar, " & _
            "SUM(spp.totalppenjamin)-SUM(spp.totalsudahdibayar) as saldo " & _
            "FROM postinghutangpiutang_t as php " & _
            "left JOIN strukpelayananpenjamin_t as spp on spp.norec=php.nostrukfk " & _
            "left JOIN strukpelayanan_t as spy on spy.norec=spp.nostrukfk " & _
            "left join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk " & _
            "left JOIN pasiendaftar_t as pd on pd.norec=spy.noregistrasifk " & _
            "left JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk " & _
            "left JOIN strukposting_t as sp on sp.noposting=php.noposting " & _
            "left JOIN loginuser_s as lu on lu.id=sp.kdhistorylogins " & _
            "left JOIN pegawai_m as p on p.id=lu.objectpegawaifk " & _
            "where " & _
            str1 & _
            str2 & _
            "group by sp.norec,sbm.tglsbm,sbm.keteranganlainnya, php.noposting,rkn.id,rkn.namarekanan,php.statusenabled,p.namalengkap " & _
            "order by php.noposting"
    
    ReadRs strSQL
    
    Dim tSaldo As Double
    Dim i As Integer
    Dim x As Double
    
    For i = 0 To rs.RecordCount - 1
        tSaldo = tSaldo + CDbl(IIf(IsNull(rs!saldo), 0, rs!saldo))
        
        rs.MoveNext
    Next i
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinter.SetText namaPrinted
            '.txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usKode.SetUnboundFieldSource ("{ado.idrekanan}")
            .usNamaPerusahaan.SetUnboundFieldSource ("{ado.namarekanan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noposting}")
            .udTglKeluar.SetUnboundFieldSource ("{ado.tglsbm}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keteranganlainnya}")
            .unPiutang.SetUnboundFieldSource ("{ado.totalpenjamin}")
            .unBayar.SetUnboundFieldSource ("{ado.totalsudahdibayar}")
            .unSaldo.SetUnboundFieldSource ("{ado.saldo}")
            
            x = Round(tSaldo)
            .txtTerbilang.SetText "# " & TERBILANG(x) & " #"
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanKartuPiutangPerusahaan")
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
Public Sub cetakRekapSaldo(tglAwal As String, tglAkhir As String, idPerusahaan As String, noPosting As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRKartuPiutangPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2, monthPrint As String
    
    monthPrint = getBulan(Format(tglAwal, "yyyy/MM/dd"))
    
    If idPerusahaan <> "" Then
        str1 = "and rkn.id=" & idPerusahaan & " "
    End If
    If noPosting <> "" Then
        str2 = " and sp.noposting=" & noPosting & " "
    End If
                
    Set Reports = New crRekapSaldoPiutangPerusahaan
    
    strSQL = "select 'KPS - '  +  rkn.id as idrekanan,rkn.namarekanan, " & _
            "SUM(spp.totalppenjamin)-SUM(spp.totalsudahdibayar) as saldo " & _
            "FROM postinghutangpiutang_t as php " & _
            "left JOIN strukpelayananpenjamin_t as spp on spp.norec=php.nostrukfk " & _
            "left JOIN strukpelayanan_t as spy on spy.norec=spp.nostrukfk " & _
            "left JOIN pasiendaftar_t as pd on pd.norec=spy.noregistrasifk " & _
            "left JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk " & _
            "left JOIN strukposting_t as sp on sp.noposting=php.noposting " & _
            "left JOIN loginuser_s as lu on lu.id=sp.kdhistorylogins " & _
            "left JOIN pegawai_m as p on p.id=lu.objectpegawaifk " & _
            "where sp.tglposting between '" & tglAwal & "' and '" & tglAkhir & "'" & _
            str1 & str2 & _
            "group by rkn.id,rkn.namarekanan " & _
            "order by rkn.id"
    
    ReadRs strSQL
    
    Dim tSaldo As Double
    Dim i As Integer
    Dim x As Double
    
    For i = 0 To rs.RecordCount - 1
        tSaldo = tSaldo + CDbl(IIf(IsNull(rs!saldo), 0, rs!saldo))
        
        rs.MoveNext
    Next i
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reports
        .database.AddADOCommand CN_String, adocmd
            .txtPrinter.SetText namaPrinted
'            .txtPeriode.SetText "Periode : " & Format(tglAwal, "mmmm yyyy") & ""monthPrint
            .txtPeriode.SetText "Periode : " & monthPrint
            .usKode.SetUnboundFieldSource ("{ado.idrekanan}")
            .usNamaPerusahaan.SetUnboundFieldSource ("{ado.namarekanan}")
            .unSaldo.SetUnboundFieldSource ("{ado.saldo}")
            
            x = Round(tSaldo)
            .txtTerbilang.SetText "# " & TERBILANG(x) & " #"
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanRekapSaldoPiutangPerusahaan")
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


