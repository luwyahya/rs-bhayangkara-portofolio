VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmKartuPasienNew 
   Caption         =   "Laporan Cetak Stok Barang"
   ClientHeight    =   6285
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   7020
   Icon            =   "frmKartuPasienNew.frx":0000
   LinkTopic       =   "Form1"
   MDIChild        =   -1  'True
   ScaleHeight     =   6285
   ScaleWidth      =   7020
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
End
Attribute VB_Name = "frmKartuPasienNew"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim Posisi, z, Urutan As Integer
Dim p As Printer
Dim sPrinter1 As String
Dim adoReport As New ADODB.Command
Public dtTglMskLbl As Date

'Dim Report As New crKartuPasien
Dim Report As New crKartuPasienNew

Public Sub Cetakkartu(strNocm As String)
Dim strKet As Boolean
Dim strPrinter As String
Dim strSQL As String
    strSQL = "SELECT ps.namapasien as namapasien ,jk.jeniskelamin,ps.nocm, cast (ps.tgllahir as date) as tgllahir," & _
            "ps.namaayah,ps.noidentitas, case when ps.namakeluarga is null then '-' else ps.namakeluarga end as namakeluarga,ps.namasuamiistri ,ps.objectjeniskelaminfk,ps.objectstatusperkawinanfk ,cast(ps.tgldaftar as date) as tgldaftar" & _
            " from pasien_m ps INNER JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
            " where ps.id='" & strNocm & "' "
    Set frmKartuPasienNew = Nothing
    With Report
        Set adoReport = New ADODB.Command
        adoReport.ActiveConnection = CN_String
        
        ReadRs strSQL
            
        adoReport.CommandText = strSQL
        adoReport.CommandType = adCmdUnknown
        
        .database.AddADOCommand CN_String, adoReport
        .usNoRM.SetUnboundFieldSource ("{ado.NoCM}")
        .usNama.SetUnboundFieldSource ("{ado.namapasien}")
        .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
        .unNIK.SetUnboundFieldSource ("{ado.noidentitas}")
        .unTglDaftar.SetUnboundFieldSource ("{ado.tgldaftar}")
'        .usUmur.SetUnboundFieldSource ("{ado.Umur}")
        .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
'        .usAlamat.SetUnboundFieldSource ("{ado.Alamat}")
'        .txtTglMasuk.SetText Format(dtTglMskLbl, "dd/MM/yyyy HH:mm")
        
        .usNoRM2.SetUnboundFieldSource ("{ado.NoCM}")
        .usNama2.SetUnboundFieldSource ("{ado.namapasien}")
        .usJK2.SetUnboundFieldSource ("{ado.jeniskelamin}")
'        .usUmur2.SetUnboundFieldSource ("{ado.Umur}")
        .udTglLahir2.SetUnboundFieldSource ("{ado.tgllahir}")
'        .usAlamat2.SetUnboundFieldSource ("{ado.Alamat}")
'        .txtTglMasuk2.SetText Format(dtTglMskLbl, "dd/MM/yyyy HH:mm")
        
    End With
    strPrinter = GetTxt("Setting.ini", "Printer", "KartuPasien")
'    strPrinter = printer
    Report.SelectPrinter "winspool", strPrinter, "Ne00:"
    Report.PrintOut False
    Unload Me

'   strPrinter = GetTxt("Setting.ini", "Printer", "KartuPasien")
'    If Printers.count > 0 Then
'        For Each prn In Printers
'            If prn.DeviceName = strPrinter Then
'                Set Printer = prn
'                Exit For
'            End If
'        Next prn
'    End If


Exit Sub
End Sub

Public Sub Form_Load()
    



End Sub

Public Sub tutup()
    Unload Me
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmKartuPasienNew = Nothing
End Sub
