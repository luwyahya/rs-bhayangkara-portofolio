VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form FrmViewerLaporanNew2 
   ClientHeight    =   7050
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5850
   Icon            =   "FrmViewerLaporanNew2.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7050
   ScaleWidth      =   5850
   WindowState     =   2  'Maximized
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
      EnablePrintButton=   0   'False
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
End
Attribute VB_Name = "FrmViewerLaporanNew2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Dim Report As New crsuratpermohonan
Dim adocomd As New ADODB.Command
Dim tanggal As String
Dim p As Printer
Dim tempPrint1 As String
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim Posisi, z, Urutan As Integer
Public strFilter As String
Dim sPrinterLegal As String



Public Function cetak(namaPegawai As String)

    adocomd.CommandText = strSQL2
    adocomd.CommandType = adCmdText
    
    Set RS2 = Nothing
    ReadRs2 "select * from V_Profile where id=1"
    
    With Report
        .Text16.SetText RS2("namalengkap")
        .Text18.SetText RS2("alamatlengkap")
        .TxtJudul.SetText "SURAT PERMOHONAN/PERNYATAAN"
        .Text19.SetText RS2("namakotakabupaten") & " " & "Kode Pos " & " " & RS2("kodepos") & " " & "Telp." & " " & RS2("fixedphone")
        .database.AddADOCommand CN_String, adocomd
        .txtnamapenanggungjawab.SetUnboundFieldSource ("{ado.NAMAPENANGGUNGJAWAB}")
        .txtalamatpenanggungjawab.SetUnboundFieldSource ("{ado.alamatpenanggungjawab}")
        .txtumur.SetUnboundFieldSource ("{ado.umurpenanggungjawab}")
        .txtnotelponpenanggungjawab.SetUnboundFieldSource ("{ado.notelponpenanggungjawab}")
        .txthubungan.SetUnboundFieldSource ("{ado.hubunganpenanggungjawab}")
        
        .txtnamapasien.SetUnboundFieldSource ("{ado.namapasien}")
        .txtalamatpasien.SetUnboundFieldSource ("{ado.alamatlengkap}")
        .txtagamapasien.SetUnboundFieldSource ("{ado.agama}")
        .txtTglmeninggal.SetUnboundFieldSource ("{ado.tglmeninggal}")
        .txtjeniskelaminpasien.SetUnboundFieldSource ("{ado.jeniskelamin}")
'
        .txtPemohon.SetUnboundFieldSource ("{ado.NAMAPENANGGUNGJAWAB}")
        
        
        .txtPetugas.SetText namaPegawai
    End With
    
    

        Screen.MousePointer = vbHourglass
        With CRViewer1
        .ReportSource = Report
        .ViewReport
        .Zoom (100)

         Screen.MousePointer = vbDefault
        End With
        
     Me.Show
     
End Function

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
   
    Set FrmViewerLaporanNew2 = Nothing
End Sub

