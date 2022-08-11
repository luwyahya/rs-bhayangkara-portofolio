VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakDaftarPasienMeninggal 
   Caption         =   "Transmedic"
   ClientHeight    =   3195
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   4680
   Icon            =   "frmCetakDaftarPasienMeninggal.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3195
   ScaleWidth      =   4680
   WindowState     =   2  'Maximized
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7000
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5800
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
      EnableRefreshButton=   0   'False
      EnableDrillDown =   -1  'True
      EnableAnimationControl=   0   'False
      EnableSelectExpertButton=   0   'False
      EnableToolbar   =   -1  'True
      DisplayBorder   =   0   'False
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   0   'False
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmCetakDaftarPasienMeninggal"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim rptPmeninggal As New crSuratKeteranganMeninggal

Public Function Cetak()
    
    Screen.MousePointer = vbHourglass
    
    
    Set rs = Nothing
    ReadRs "select * from V_Profile where id=1"
    
    
    Set RS2 = Nothing
    ReadRs2 strSQL2
   
    With rptPmeninggal
        
        '.Text1.SetText "PEMERINTAH " & UCase(strNKotaRS)
        .Text1.SetText rs("namalengkap")
        '.Text2.SetText "RSUD KELAS " & strkelasRS & " " & strketkelasRS
        .Text3.SetText rs("alamatlengkap")
        .Text18.SetText rs("namakotakabupaten") & " - " & rs("kodepos") & "  Telp. " & rs("fixedphone")
        .Text2.SetText rs("website") & ", " & rs("alamatemail")
        .Text6.SetText "Yang bertanda tangan di bawah ini, dokter " & LCase(rs("namalengkap")) & ", menerangkan dengan sesungguhnya, bahwa:"
        .Text25.SetText rs("namakotakabupaten") & ", " & Format(Date, "dd mmmm yyyy")
        '.Text26.SetText "Dokter RSUD " & strNKotaRS
        .Text26.SetText "Dokter " & LCase(rs("namalengkap"))
        
        .TxtNocm.SetText RS2("nocm")
        .TxtNama.SetText RS2("namapasien")
        .txtUmur.SetText RS2("umurtahun") & " " & RS2("umurbulan") & " " & RS2("umurhari")
        .TxtJK.SetText IIf(RS2("jeniskelamin") = "L", "Laki-Laki", "Perempuan")
        .TxtPekerjaan.SetText "-"
        .Txtalamat.SetText IIf(IsNull(RS2("alamatlengkap")), "-", RS2("alamatlengkap"))
        .TxtJam.SetText Format(RS2("tglmeninggal"), "HH : MM : SS")
        .TxtTgl.SetText Format(RS2("tglmeninggal"), "DD - MMMM - YYYY")
        .txtDokter.SetText RS2("dokterpemeriksa")
    End With

    With CRViewer1
        .EnableGroupTree = False
        .ReportSource = rptPmeninggal
        .ViewReport
        .Zoom 1
    End With
    
   
    Me.Show
                
    Screen.MousePointer = vbDefault
End Function

Private Sub Form_Resize()
    With CRViewer1
        .Top = 0
        .Left = 0
        .Height = ScaleHeight
        .Width = ScaleWidth
    End With
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmCetakDaftarPasienMeninggal = Nothing
End Sub
