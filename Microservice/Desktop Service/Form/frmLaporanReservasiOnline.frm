VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanReservasiOnline 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5790
   Icon            =   "frmLaporanReservasiOnline.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   ScaleHeight     =   7005
   ScaleWidth      =   5790
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
      Height          =   6975
      Left            =   0
      TabIndex        =   4
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
      EnableExportButton=   0   'False
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
Attribute VB_Name = "frmLaporanReservasiOnline"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanReservasiOnline
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

    Set frmLaporanReservasiOnline = Nothing
End Sub

Public Sub CetakLaporanPendapatan(tglAwal As String, tglAkhir As String, statusId As String, namaPrinted As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanReservasiOnline = Nothing
Dim adocmd As New ADODB.Command

    Dim str1, str2, str3, str4 As String

    If statusId <> "" Then
        If statusId = 1 Then
            str1 = "and apr.isconfirm= 't' "
        ElseIf statusId = 2 Then
            str1 = "and apr.isconfirm is null "
        End If
    End If
    
'    If idRuangan <> "" Then
'        str2 = " and ru2.id=" & idRuangan & " "
'    End If
'
'    If idKelompok <> "" Then
'        str3 = " and kps.id=" & idKelompok & " "
'    End If
'
'    If idKsm <> "" Then
'        str4 = " and ksm.id=" & idKsm & " "
'    End If
    
Set Report = New crLaporanReservasiOnline
    strSQL = "SELECT pm.nocm, (case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien " & _
             ",apr.namapasien,apr.noreservasi, " & _
             "apr.tanggalreservasi,ru.namaruangan,apr.isconfirm, " & _
             "(case when isconfirm='t' then 'Confirm' else 'Reservasi' end) as status, " & _
             "count(apr.isconfirm) as total " & _
             "FROM antrianpasienregistrasi_t as apr " & _
             "left join pasien_m as pm on pm.id = apr.nocmfk " & _
             "left join ruangan_m as ru on ru.id = apr.objectruanganfk " & _
             "where apr.tanggalreservasi between '" & tglAwal & "' and '" & tglAkhir & "' and apr.noreservasi is not null and apr.noreservasi <> '-' " & _
             str1 & _
             "GROUP BY pm.nocm,pm.namapasien,apr.namapasien,apr.noreservasi, apr.tanggalreservasi, ru.namaruangan, apr.isconfirm " & _
             "order by apr.tanggalreservasi"
    
    ReadRs strSQL
    Dim tconfirm, treservasi As Integer
    
    Dim i As Integer
    
    tconfirm = 0
    treservasi = 0
    For i = 0 To rs.RecordCount - 1
        If rs!Status = "Confirm" Then
            tconfirm = tconfirm + 1
        ElseIf rs!Status = "Reservasi" Then
            treservasi = treservasi + 1
        End If
        rs.MoveNext
        
    Next
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    
        
    With Report
        .database.AddADOCommand CN_String, adocmd
             .txtNamaKasir.SetText namaPrinted
            '.txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNorm.SetUnboundFieldSource ("{ado.nocm}")
            '.usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .udTglReservasi.SetUnboundFieldSource ("{ado.tanggalreservasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNoReservasi.SetUnboundFieldSource ("{ado.noreservasi}")
            .usStatus.SetUnboundFieldSource ("{ado.status}")
            .unConfirm.SetUnboundFieldSource tconfirm
            .unReservasi.SetUnboundFieldSource treservasi
            '.ucTotal.SetUnboundFieldSource ("{ado.total}")
'            .usJenisProduk.SetUnboundFieldSource ("{ado.jenisproduk}")
'            .usKsm.SetUnboundFieldSource ("{ado.ksm}")
'            .usKelompok.SetUnboundFieldSource ("{ado.kelompokpasien}")
            
            .txtPeriode.SetText "Periode : " & Format(tglAwal, "dd-MM-yyyy") & "  s/d  " & Format(tglAkhir, "dd-MM-yyyy")

            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPedapatan")
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
'errLoad:
'    MsgBox Err.Number & " " & Err.Description
End Sub
