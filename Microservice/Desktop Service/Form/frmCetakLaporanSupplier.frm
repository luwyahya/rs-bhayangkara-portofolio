VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLaporanSuplier 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakLaporanSupplier.frx":0000
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
Attribute VB_Name = "frmCetakLaporanSuplier"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New cr_LaporanDetailPenrimaanSuplierNew

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
        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        Report.PrintOut False
    
    End If
End Sub

Private Sub CmdOption_Click()
    
    If bolStrukResep = True Then
        Report.PrinterSetup Me.hwnd
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

    Set frmCetakLaporanSuplier = Nothing

End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, objectProduk As String, jenis As String, view As String)
'On Error GoTo errLoad
Set frmCetakLaporanSuplier = Nothing
Dim strSQL As String
Dim pegawai1, pegawai2, pegawai3, pegawai4, pegawai5, nip1, nip2, nip3, nip4, nip5 As String

bolStrukResep = True
    
    
        With Report
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = " SELECT        sP.tglstruk, sP.nostruk, sP.nofaktur, sP.tglfaktur, pr.id AS kdproduk, pr.kdproduk AS kdsirs, pr.namaproduk, ss.satuanstandar, rkn.namarekanan, pg.namalengkap AS namapenerima, ru.namaruangan, spd.hargasatuan + CASE WHEN spd.hargappn <> 0 THEN (spd.qtyproduk * spd.hargasatuan - spd.qtyproduk * spd.hargadiscount) * 0.1 / spd.qtyproduk ELSE spd.hargappn END - spd.hargadiscount AS hargasatuan, sbk.nosbk,  " & _
                     "    spd.qtyproduk , spd.qtyprodukretur, sP.nosppb, asp.asalproduk, spd.hargadiscount, djs.detailjenisproduk,  " & _
                     " case when spd.hargappn <> 0 then (spd.qtyproduk * spd.hargasatuan - spd.qtyproduk * spd.hargadiscount) " & _
                     " + (spd.qtyproduk * spd.hargasatuan - spd.qtyproduk * spd.hargadiscount) * 0.1 else (spd.qtyproduk * spd.hargasatuan - spd.qtyproduk * spd.hargadiscount)  end  " & _
                     "                 AS total, case when spd.hargappn <> 0 then (spd.qtyproduk * spd.hargasatuan - spd.qtyproduk * spd.hargadiscount) * 0.1 else spd.hargappn end  AS hargappn, CONVERT(varchar, spd.tglkadaluarsa, 20)   " & _
                     "                AS tglkadaluarsa  " & _
                     "   FROM            strukpelayanan_t AS sP INNER JOIN  " & _
                     "    strukpelayanandetail_t AS spd ON spd.nostrukfk = sP.norec LEFT OUTER JOIN  " & _
                     "    rekanan_m AS rkn ON rkn.id = sP.objectrekananfk LEFT OUTER JOIN  " & _
                     "    pegawai_m AS pg ON pg.id = sP.objectpegawaipenerimafk LEFT OUTER JOIN  " & _
                     "    ruangan_m AS ru ON ru.id = sP.objectruanganfk LEFT OUTER JOIN  " & _
                     "    produk_m AS pr ON pr.id = spd.objectprodukfk LEFT OUTER JOIN  " & _
                     "    satuanstandar_m AS ss ON ss.id = spd.objectsatuanstandarfk LEFT OUTER JOIN  " & _
                     "    asalproduk_m AS asp ON asp.id = spd.objectasalprodukfk LEFT OUTER JOIN  " & _
                     "    strukbuktipengeluaran_t AS sbk ON sbk.norec = sP.nosbklastfk LEFT OUTER JOIN  " & _
                     "    detailjenisproduk_m AS djs ON djs.id = pr.objectdetailjenisprodukfk  " & _
                     "     WHERE        (sP.tglstruk >= '" & tglAwal & "') AND (sP.tglstruk <= '" & tglAkhir & "') AND (sP.statusenabled = 1) AND (sP.objectkelompoktransaksifk = 35)  " & _
                     "   ORDER BY sP.nofaktur "
'

             ReadRs strSQL
             

            
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport

             .txtPeriode.SetText tglAwal & " s/d " & tglAkhir
             .usNamaRekanan.SetUnboundFieldSource ("{Ado.namarekanan}")
             .usNoFaktur.SetUnboundFieldSource ("{Ado.nofaktur}")
'             .usKodeProduk.SetUnboundFieldSource ("{Ado.kdproduk}")
             .usNamaProduk.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usJenisProduk.SetUnboundFieldSource ("{Ado.detailjenisproduk}")
             .usTglFaktur.SetUnboundFieldSource ("{Ado.tglfaktur}")
             .usTglTerima.SetUnboundFieldSource ("{Ado.tglstruk}")
             .usNoPo.SetUnboundFieldSource ("{Ado.nosbk}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
             .uunQty.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .unHarga.SetUnboundFieldSource ("{Ado.hargasatuan}")
'             .unDiscount.SetUnboundFieldSource ("{Ado.hargadiscount}")
'             .unPPN.SetUnboundFieldSource ("{Ado.hargappn}")
             .unTotal.SetUnboundFieldSource ("{Ado.total}")
             
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "Logistik_A4")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = Report
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

