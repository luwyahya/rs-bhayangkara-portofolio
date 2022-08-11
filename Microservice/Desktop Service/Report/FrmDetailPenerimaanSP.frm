VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmDetailPenerimaanSP 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "FrmDetailPenerimaanSP.frx":0000
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
Attribute VB_Name = "frmDetailPenerimaanSP"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakDetailPenerimaanSP

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "EMR-SuratPernyataanPenolakan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmDetailPenerimaanSP = Nothing
End Sub

Public Sub Cetak(f_tglAwal As String, f_tglAkhir As String, f_detailjenisproduk As String, f_namaBrg As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmDetailPenerimaanSP = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String

Set Report = New crCetakDetailPenerimaanSP

      
'    strSQL = "SELECT  SUM(total) AS total, SUM(jmlTerkecil) AS qtyproduk, satuanstandarSS, hargasatuan, namaproduk,cast(kdproduk as int) as kdproduk , HNA   " & _
'             "   From V_LaporanPenerimaanSupplier  " & _
'             "   where  tglstruk between  '" & Format(f_tglAwal, "yyyy-mm-dd hh:mm:dd") & "' and  '" & Format(f_tglAkhir, "yyyy-mm-dd hh:mm:dd") & "' and detailjenisproduk like '%" & f_detailjenisproduk & "%'   " & _
'             "    and namaproduk like '%" & f_namaBrg & "%'   " & _
'             "   GROUP BY satuanstandarSS, hargasatuan, namaproduk, kdproduk, HNA "
    strSQL = "SELECT namabentukproduk, SUM(total) AS total, SUM(jmlTerkecil) AS qtyproduk, satuanstandarSS, hargasatuan, namaproduk,cast(kdproduk as int) as kdproduk , HNA   " & _
             "   From V_LaporanPenerimaanSupplier  " & _
             "   where (tglstruk >= '" & f_tglAwal & "') AND (tglstruk <= '" & f_tglAkhir & "')  and detailjenisproduk like '%" & f_detailjenisproduk & "%'   " & _
             "    and namaproduk like '%" & f_namaBrg & "%'   " & _
             "   GROUP BY satuanstandarSS, hargasatuan, namaproduk, kdproduk, HNA,namabentukproduk order by namabentukproduk desc, namaproduk"
    ReadRs strSQL
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        .tAwal.SetText Format(f_tglAwal, "YYYY-MM-DD hh:mm:dd")
        .tAkhir.SetText Format(f_tglAkhir, "YYYY-MM-DD hh:mm:dd")
        .usKdBrg.SetUnboundFieldSource ("{ado.kdproduk}")
        .usNamaBrg.SetUnboundFieldSource ("{ado.namaproduk}")
        .usSatuan.SetUnboundFieldSource ("{ado.satuanstandarSS}")
        .usTotal.SetUnboundFieldSource ("{ado.total}")
        .unJml.SetUnboundFieldSource ("{ado.qtyproduk}")
        .unHrgSatuan.SetUnboundFieldSource ("{ado.hargasatuan}")
        .unHNA.SetUnboundFieldSource ("{ado.HNA}")
        .unjenis.SetUnboundFieldSource ("{ado.namabentukproduk}")
   
           If view = "false" Then
                Dim strPrinter As String
                
                strPrinter = GetTxt("Setting.ini", "Printer", "EMR-SuratPernyataanPenolakan")
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
         
    End With
    
Exit Sub
errLoad:
End Sub









