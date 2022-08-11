VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRBeritaAcaraKasBank 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRBeritaAcaraKasBank.frx":0000
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
Attribute VB_Name = "frmCRBeritaAcaraKasBank"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New cr_BeritaAcaraKasBank
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRBeritaAcaraKasBank = Nothing
End Sub

'Public Sub Cetak(hari As String, tgl As String, jam As String, tglAwal As String, tglAkhir As String, yM As String, view As String)

Public Sub Cetak(hari As String, Tgl As String, jam As String, idTemp As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRBeritaAcaraKasBank = Nothing
Dim adocmd As New ADODB.Command
Set Report = New cr_BeritaAcaraKasBank

  strSQL = "select idtempberita,jenis,penerimaan,pengeluaran,jumlah,saldoawal,saldoakhir from temp_ba_kasbank_t " & _
            "where idtempberita = '" & idTemp & "'  and jenis='kas' "
            
  ReadRs "select idtempberita,jenis,penerimaan,pengeluaran,jumlah,saldoawal,saldoakhir from temp_ba_kasbank_t " & _
            "where idtempberita = '" & idTemp & "'  and jenis='bank' "
           
'            'Kas Bendahara Penerimaan coa = 1754
        
'    strSQL = "select case when sum(pjd.hargasatuand) is null then 0 else sum(pjd.hargasatuand) end as kaspenerimaan, " & _
'            "case when sum(pjd.hargasatuank) is null then 0 else sum(pjd.hargasatuank) end as kaspengeluaran " & _
'            "from postingjurnal_t as pj " & _
'            "INNER JOIN postingjurnald_t as pjd on pjd.norecrelated = pj.norec   " & _
'            "where pj.tglbuktitransaksi BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            "and pjd.objectaccountfk=1754 "
'            'Kas Bendahara Penerimaan coa = 1754
            
'    ReadRs "select * from postingsaldoawal_t where objectaccountfk=1754 and ym= '" & yM & "'"
'
'    ReadRs2 "select  case when sum(pjd.hargasatuand) is null then 0 else sum(pjd.hargasatuand) end as bankpenerimaan, " & _
'            "case when sum(pjd.hargasatuank) is null then 0 else sum(pjd.hargasatuank) end as bankpengeluaran " & _
'            "from postingjurnal_t as pj " & _
'            "INNER JOIN postingjurnald_t as pjd on pjd.norecrelated = pj.norec   " & _
'            "where pj.tglbuktitransaksi BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            "and pjd.objectaccountfk=1760 "
'            'Bank Bendahara Penerimaan = 1760
'
'    ReadRs3 "select * from postingsaldoawal_t where objectaccountfk=1760 and ym= '" & yM & "'"
'
'    Dim subString As String, thnBlnAwal As String, Ymm As String, thn As String
'    subString = Mid$(yM, 5, 3)
'    thn = Mid$(yM, 1, 4)
'    thnBlnAwal = subString - 1
'    If Len(thnBlnAwal) = 1 Then
'      Ymm = thnBlnAwal
'      thnBlnAwal = thn + "0" + Ymm
'    End If
'
'    'saldoAwal = - bulan
'    ReadRs4 "select * from postingsaldoawal_t where objectaccountfk=1754 and ym= '" & thnBlnAwal & "'"
'    ReadRs5 "select * from postingsaldoawal_t where objectaccountfk=1760 and ym= '" & thnBlnAwal & "'"
'
'    Dim BankD, BankK, saldoAkhirKas, saldoAkhirBank, saldoAwalKas, saldoAwalBank, jumlahBank
'
'    If RS2.EOF Then
'      BankD = 0
'      BankK = 0
'    Else
'      BankD = RS2!bankpenerimaan
'      BankK = RS2!bankpengeluaran
'      jumlahBank = BankD - BankK
'    End If
'
'    If RS.EOF Then
'      saldoAkhirKas = 0
'    Else
'      saldoAkhirKas = RS!hargasatuand
'    End If
'
'    If RS3.EOF Then
'      saldoAkhirBank = 0
'    Else
'      saldoAkhirBank = RS3!hargasatuand
'    End If
'
'    If RS4.EOF Then
'      saldoAwalKas = 0
'    Else
'      saldoAwalKas = RS4!hargasatuand
'    End If
'
'    If RS5.EOF Then
'      saldoAwalBank = 0
'    Else
'      saldoAwalBank = RS5!hargasatuand
'    End If
    Dim BankD, BankK, saldoAwalBank, saldoAkhirBank, jumlahBank
    If rs.EOF Then
        BankD = 0
        BankD = 0
        saldoAwalBank = 0
        saldoAkhirBank = 0
        jumlahBank = 0
    Else
        BankD = rs!penerimaan
        BankK = rs!pengeluaran
        jumlahBank = rs!jumlah
        saldoAwalBank = rs!saldoawal
        saldoAkhirBank = rs!saldoakhir
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtHari.SetText hari
            .txtTanggal.SetText Tgl
            .TxtJam.SetText jam
            .ucDebitKas.SetUnboundFieldSource ("{ado.penerimaan}")
            .ucKreditKas.SetUnboundFieldSource ("{ado.pengeluaran}")
            .ucJumlahKas.SetUnboundFieldSource ("{ado.jumlah}")
            .ucSaldoAwalKas.SetUnboundFieldSource ("{ado.saldoawal}")
            .ucSaldoAkhirKas.SetUnboundFieldSource ("{ado.saldoakhir}")
            .txtBankD.SetText Format(BankD, "##,##0.00")
            .txtBankK.SetText Format(BankK, "##,##0.00")
            '.txtSaldoAkhirKas.SetText Format(saldoAkhirKas, "##,##0.00")
            .txtSaldoAkhirBank.SetText Format(saldoAkhirBank, "##,##0.00")
            '.txtSaldoAwalKas.SetText Format(saldoAwalKas, "##,##0.00")
            .txtSaldoAwalBank.SetText Format(saldoAwalBank, "##,##0.00")
            .txtJumlahBank.SetText Format(jumlahBank, "##,##0.00")
            
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
