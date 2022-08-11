VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakDaftarPengeluaranBarang 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakDaftarPengeluaranBarang.frx":0000
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
Attribute VB_Name = "frmCetakDaftarPengeluaranBarang"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_DaftarPengeluaranBarang

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

    Set frmCetakDaftarPengeluaranBarang = Nothing

End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, idRuanganAsal As String, idRuanganTuj As String, jenisPengiriman As String, view As String, strUser As String)
'On Error GoTo errLoad
Set frmCetakDaftarPengeluaranBarang = Nothing
Dim strSQL As String
Dim RuanganTujuan As String
Dim ruanganAsal As String
Dim strFilter As String
bolStrukResep = True

If idRuanganAsal <> "" Then
   strFilter = " AND ru.id = '" & idRuanganAsal & "' "
Else
    strFilter = " "
End If

If idRuanganTuj <> "" Then
   strFilter = strFilter & " AND ru2.id = '" & idRuanganTuj & "' "
Else
   strFilter = strFilter & " "
End If

If jenisPengiriman <> "" Then
   strFilter = strFilter & " AND sp.jenispermintaanfk = '" & jenisPengiriman & "' "
Else
   strFilter = strFilter & " "
End If

        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = " SELECT sp.norec,pr.id AS kodebarang,pr.kdproduk AS kdsirs,pr.namaproduk,sp.nokirim,sp.jenispermintaanfk, " & _
                     " CONVERT(VARCHAR, sp.tglkirim, 105) AS tglkirim,ss.satuanstandar,kp.qtyproduk,kp.hargasatuan,ru.namaruangan AS ruanganasal, " & _
                     " ru2.namaruangan AS ruangantujuan,(kp.qtyproduk * kp.hargasatuan) AS total,pr.objectdetailjenisprodukfk, " & _
                     " djp.detailjenisproduk,djp.objectjenisprodukfk,jp.jenisproduk,jp.jenisproduk,jp.objectkelompokprodukfk, " & _
                     " kps.kelompokproduk,kp.objectasalprodukfk,ap.asalproduk, " & _
                     " CASE WHEN so.tglorder IS NOT NULL THEN CONVERT(VARCHAR, so.tglorder, 105) " & _
                     " ELSE CONVERT(VARCHAR, sp.tglkirim, 105) END AS tglorder " & _
                     " FROM strukkirim_t AS sp " & _
                     " LEFT JOIN kirimproduk_t AS kp ON kp.nokirimfk = sp.norec " & _
                     " LEFT JOIN strukorder_t as so on so.norec = sp.noorderfk " & _
                     " LEFT JOIN pegawai_m AS pg ON pg.id = sp.objectpegawaipengirimfk " & _
                     " LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganasalfk " & _
                     " LEFT JOIN ruangan_m AS ru2 ON ru2.id = sp.objectruangantujuanfk " & _
                     " LEFT JOIN produk_m AS pr ON pr.id = kp.objectprodukfk " & _
                     " LEFT JOIN detailjenisproduk_m AS djp ON djp.id = pr.objectdetailjenisprodukfk " & _
                     " LEFT JOIN jenisproduk_m AS jp ON jp.id = djp.objectjenisprodukfk " & _
                     " LEFT JOIN kelompokproduk_m AS kps ON kps.id = jp.objectkelompokprodukfk " & _
                     " LEFT JOIN asalproduk_m AS ap ON ap.id = kp.objectasalprodukfk " & _
                     " LEFT JOIN satuanstandar_m AS ss ON ss.id = kp.objectsatuanstandarfk " & _
                     " where sp.tglkirim BETWEEN '" & tglAwal & "' AND '" & tglAkhir & "' " & _
                     strFilter & " AND kp.qtyproduk > 0 AND sp.objectkelompoktransaksifk = 34 ORDER BY sp.nokirim ASC "

             ReadRs strSQL
             
              adoReport.CommandText = strSQL
              adoReport.CommandType = adCmdUnknown
             .database.AddADOCommand CN_String, adoReport

             .txtuser.SetText strUser
             .txtPeriode.SetText Format(tglAwal, "dd-MM-yyyy") & "  s.d  " & Format(tglAkhir, "dd-MM-yyyy")
             .usRuangTujuan.SetUnboundFieldSource ("{Ado.ruanganasal}") ' ("{Ado.ruangantujuan}")
             .usRuanganAsal.SetUnboundFieldSource ("{Ado.ruangantujuan}") ' ("{Ado.ruanganasal}")
             .usTglOrder.SetUnboundFieldSource ("{Ado.tglorder}")
             .usTglTerima.SetUnboundFieldSource ("{Ado.tglkirim}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
             .unKodeBarang.SetUnboundFieldSource ("{Ado.kodebarang}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usNomor.SetUnboundFieldSource ("{Ado.nokirim}")
             .unQty.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .ucHargaSatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "Logistik_A4")
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

