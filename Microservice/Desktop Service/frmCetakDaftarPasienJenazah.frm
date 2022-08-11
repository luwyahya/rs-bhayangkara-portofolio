VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakDaftarPasienJenazah 
   Caption         =   "Medifirst2000 - Cetak"
   ClientHeight    =   3195
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   4680
   Icon            =   "frmCetakDaftarPasienJenazah.frx":0000
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
Attribute VB_Name = "frmCetakDaftarPasienJenazah"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim adocomd As New ADODB.Command

Dim rptCetakDaftarPasienJenazah As crCetakDaftarPasienJenazah

Public Function cetak(namaPegawai As String, tglAwal As String, tglAkhir As String)
    
    
    Screen.MousePointer = vbHourglass
    
    
    Me.Caption = "Medifirst2000 - Cetak Laporan Daftar Pasein Jenazah"
    Set rptCetakDaftarPasienJenazah = New crCetakDaftarPasienJenazah
    
    adocomd.CommandText = strSQL2
    adocomd.CommandType = adCmdText
    
    Set RS = Nothing
    ReadRs "select * from V_Profile where id=1"
    
    With rptCetakDaftarPasienJenazah
        .database.AddADOCommand CN_String, adocomd

        .txtNamaRS.SetText RS("namalengkap")
        .txtAlamat.SetText RS("alamatlengkap")
        .txtAlamat2.SetText RS("namakotakabupaten") & " - " & RS("kodepos") & "  Telp. " & RS("fixedphone")

        .txtPeriode.SetText Format(tglAwal, "dd MMMM yyyy") & " s/d " & Format(tglAkhir, "dd MMMM yyyy")
        
       
        .txtPetugas.SetText namaPegawai
        
        
        .txtRuangan.SetText "Ruangan Pemulasaran Jenazah"

        .usNoPendaftaran.SetUnboundFieldSource ("{ado.noregistrasi}")
        .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
        .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
        .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
'        .usUmur.SetUnboundFieldSource ("{ado.umur}")
        .unUmur.SetUnboundFieldSource ("{ado.umur}")
        .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
        .udTglPendaftaran.SetUnboundFieldSource ("{ado.tglregistrasi}")
        .udTglMeninggal.SetUnboundFieldSource ("{ado.tglmeninggal}")
        .usPenyebab.SetUnboundFieldSource ("{ado.penyebabkematian}")
        .usTempatMeninggal.SetUnboundFieldSource ("{ado.ruanganmeninggal}")
'        .usDokterPemeriksa.SetUnboundFieldSource ("{ado.Dokter Pemeriksa}")
    End With
    CRViewer1.ReportSource = rptCetakDaftarPasienJenazah
    Me.Show
    
    With CRViewer1
        .EnableGroupTree = False
        .ViewReport
        .Zoom 1
    End With
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
    Set frmCetakDaftarPasienJenazah = Nothing
End Sub
