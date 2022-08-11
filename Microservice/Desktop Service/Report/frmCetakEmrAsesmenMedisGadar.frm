VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakEmrAsesmenMedisGadar 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakEmrAsesmenMedisGadar.frx":0000
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
Attribute VB_Name = "frmCetakEmrAsesmenMedisGadar"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crEmrAsesmenMedisGadar

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

    Set frmCetakEmrAsesmenMedisGadar = Nothing
End Sub

Public Sub Cetak(noCm As String, emr As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCetakEmrAsesmenMedisGadar = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
'Set Report = New crLaporanPasienDaftar
Set Report = New crEmrAsesmenMedisGadar

      
    strSQL = "select top 1 ps.nocm,ps.namapasien,format(ps.tgllahir,'dd - MM - yyyy') as tgllahir,CASE WHEN ps.objectjeniskelaminfk=1 then 'L' else 'P' END as jk, " & _
            " al.alamatlengkap, al.kecamatan,al.kotakabupaten " & _
            " from pasien_m as ps  " & _
            " inner JOIN alamat_m as al on al.nocmfk=ps.id  " & _
            "where ps.statusenabled = 1 and ps.nocm = '" & noCm & "' "

    strSQL2 = " SELECT emrp.nocm,emrdp.emrpasienfk ,emrdp.[value] ,emrdp.emrdfk," & _
                " emrd.caption,emrd.type, emrd.nourut,emrd.reportdisplay,  emrd.kodeexternal AS kodeex, " & _
                " emrd.satuan,emr.caption as namaform " & _
                " From emrpasiend_t As emrdp " & _
                " INNER JOIN emrpasien_t AS emrp ON emrp.noemr = emrdp.emrpasienfk " & _
                " INNER JOIN emrd_t AS emrd ON emrd.id = emrdp.emrdfk " & _
                " INNER JOIN emr_t AS emr ON emr.id = emrdp.emrfk " & _
                " Where emrdp.statusenabled = 1" & _
                " AND emrp.nocm = '" & noCm & "' and emrp.norec='" & emr & "' " & _
                " AND emr.id in (146,160) Order by emrdp.emrdfk ASC "

    ReadRs strSQL2
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
           
        .usNoCm.SetUnboundFieldSource ("{Ado.nocm}")
        .usNamaPasien.SetUnboundFieldSource ("{Ado.namapasien}")
        .usJenisKelamin.SetUnboundFieldSource ("{Ado.jk}")
        .udTglLahir.SetUnboundFieldSource ("{Ado.tgllahir}")
        
        If rs.RecordCount <> 0 Then
          Dim i As Integer
          Dim arraySplit() As String
          
          For i = 0 To rs.RecordCount - 1
            If rs("emrdfk") = 4189 Then
                .txtSkorCtrs.SetText rs("value")
            ElseIf rs("emrdfk") = 4190 Then
                If rs("value") = 1 Then .txtKurangDari.Suppress = False Else .txtKurangDari.Suppress = True
                
            ElseIf rs("emrdfk") = 4191 Then
                If rs("value") = 1 Then .txtLebihDari.Suppress = False Else .txtLebihDari.Suppress = True
            
            ElseIf rs("emrdfk") = 4192 Then
                .txtTglKedatangan.SetText Format(rs("value"), "dd - MM - yyyy")
                .txtJamKedatangan.SetText Format(rs("value"), "HH:mm:ss")
            
            ElseIf rs("emrdfk") = 4193 Then
                .txtKeluhanUtama.SetText rs("value")
                
            ElseIf rs("emrdfk") = 4194 Then
                .txtRiwPenyakitSekarang.SetText rs("value")
                
            ElseIf rs("emrdfk") = 4195 Then
                .txtRiwPenyakitSebelum.SetText rs("value")
                              
                
            ElseIf rs("emrdfk") = 4197 Then
                If rs("value") = 1 Then .txtRATidak.Suppress = False Else .txtRATidak.Suppress = True
                
            ElseIf rs("emrdfk") = 4198 Then
                .txtRAYaObat.Suppress = False
                .txtAlergiObat.SetText rs("value")
            
            ElseIf rs("emrdfk") = 4199 Then
                .txtRaYaMakan.Suppress = False
                .txtRAMakan.SetText rs("value")
                
            ElseIf rs("emrdfk") = 4201 Then
                 If rs("value") = 1 Then .txtRkKTidak.Suppress = False Else .txtRkKTidak.Suppress = True
            
            ElseIf rs("emrdfk") = 4202 Then
                .txtRkYa.Suppress = False
                .txtKejangTerakhir.SetText rs("value")
                
            ElseIf rs("emrdfk") = 4203 Then
                 .txtFrek.SetText rs("value")
           
            ElseIf rs("emrdfk") = 4204 Then
                .txtJenisKejang.SetText rs("value")
            
                
            ElseIf rs("emrdfk") = 4206 Then
                If rs("value") = 1 Then .txtPfTidak.Suppress = False Else .txtPfTidak.Suppress = True
                
            ElseIf rs("emrdfk") = 4207 Then
                .txtPfYa.Suppress = False
                .txtPfSebutkan.SetText rs("value")
                            
                            
            ElseIf rs("emrdfk") = 4209 Then
                If rs("value") = 1 Then .txtRepsTidak.Suppress = False Else .txtRepsTidak.Suppress = True

            ElseIf rs("emrdfk") = 4210 Then
                .txtRepsYa.Suppress = False
                .txtRepsSebutkan.SetText rs("value")
            
            ElseIf rs("emrdfk") = 4212 Then
                If rs("value") = 1 Then .txtCkPNAmphe.Suppress = False Else .txtCkPNAmphe.Suppress = True
                
            ElseIf rs("emrdfk") = 4213 Then
                If rs("value") = 1 Then .txtCkPNCanabis.Suppress = False Else .txtCkPNCanabis.Suppress = True
                
             ElseIf rs("emrdfk") = 4214 Then
                If rs("value") = 1 Then .txtCkPNAlkohol.Suppress = False Else .txtCkPNAlkohol.Suppress = True
                
             ElseIf rs("emrdfk") = 4215 Then
                If rs("value") = 1 Then .txtCkPNBenzo.Suppress = False Else .txtCkPNBenzo.Suppress = True
                
              ElseIf rs("emrdfk") = 90000 Then
                If rs("value") = 1 Then .txtCkPNOpiate.Suppress = False Else .txtCkPNOpiate.Suppress = True
            
             ElseIf rs("emrdfk") = 4216 Then
                .txtCkPNLain.Suppress = False
                .txtLainnya.SetText rs("value")
                
             ElseIf rs("emrdfk") = 90002 Then
                If rs("value") = 1 Then .txtCekRPTidak.Suppress = False Else .txtCekRPTidak.Suppress = True
                
             ElseIf rs("emrdfk") = 90003 Then
                .txtCekRPYa.Suppress = False
                .txtNamaObat.SetText rs("value")

             ElseIf rs("emrdfk") = 4219 Then
                If rs("value") = 1 Then .txtCekKUBaik.Suppress = False Else .txtCekKUBaik.Suppress = True
                
             ElseIf rs("emrdfk") = 4220 Then
                If rs("value") = 1 Then .txtCekKUSedang.Suppress = False Else .txtCekKUSedang.Suppress = True
                
             ElseIf rs("emrdfk") = 4221 Then
                If rs("value") = 1 Then .txtCekKULemah.Suppress = False Else .txtCekKULemah.Suppress = True
                
             ElseIf rs("emrdfk") = 4222 Then
                .txtCekKULain.Suppress = False
                .txtKULainnya.SetText rs("value")
                
             
             ElseIf rs("emrdfk") = 4224 Then
                .txtE.SetText rs("value")
             
             ElseIf rs("emrdfk") = 4225 Then
                .txtV.SetText rs("value")
                
             ElseIf rs("emrdfk") = 4226 Then
                .txtM.SetText rs("value")
                
             ElseIf rs("emrdfk") = 4228 Then
                .txtTD.SetText rs("value")
             
             ElseIf rs("emrdfk") = 4229 Then
                .txtS.SetText rs("value")
                
             ElseIf rs("emrdfk") = 4230 Then
                .txtNadi.SetText rs("value")
                
             ElseIf rs("emrdfk") = 4231 Then
                .txtRR.SetText rs("value")
             
             ElseIf rs("emrdfk") = 4234 Then
                .txtKepala.SetText rs("value")
             
             ElseIf rs("emrdfk") = 4235 Then
                .txtLeher.SetText rs("value")
                
             ElseIf rs("emrdfk") = 4237 Then
                 .txtJantung.SetText rs("value")
            
             ElseIf rs("emrdfk") = 4238 Then
                 .txtParu.SetText rs("value")
                 
             ElseIf rs("emrdfk") = 4239 Then
                  .txtPerut.SetText rs("value")
                  
             ElseIf rs("emrdfk") = 4240 Then
                .txtAnggotaGerak.SetText rs("value")
            
             ElseIf rs("emrdfk") = 9044 Then
                If rs("value") = 1 Then .txtMerah.Suppress = False Else .txtMerah.Suppress = True
            
             ElseIf rs("emrdfk") = 9050 Then
                If rs("value") = 1 Then .txtKuning.Suppress = False Else .txtKuning.Suppress = True
             
             ElseIf rs("emrdfk") = 9052 Then
                If rs("value") = 1 Then .txtHijau.Suppress = False Else .txtHijau.Suppress = True
                
             ElseIf rs("emrdfk") = 9055 Then
                If rs("value") = 1 Then .txtHitam.Suppress = False Else .txtHitam.Suppress = True

            

             ElseIf rs("emrdfk") > 4823 And rs("emrdfk") < 4859 Then
             
                If rs("type") = "checkbox" Then
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText "V"
                ElseIf rs("type") = "combobox" Then
                    arraySplit = Split(rs!Value, "~")
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText arraySplit(1)
                
                ElseIf rs("type") = "datetime" Then
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText Format(Left(rs!Value, 10), "dd-MM-yyyy")
                ElseIf rs("type") = "time" Then
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText Format(Mid(rs!Value, 12, 8), "HH:mm:ss")
                
                ElseIf rs("type") = "textarea" Then
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText rs!Value
                ElseIf rs("type") = "checkboxtextbox" Then
                    .Section8.ReportObjects("txt" & rs!emrdfk & "1").SetText "V"
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText rs!Value
                
                Else
                    .Section8.ReportObjects("txt" & rs!emrdfk).SetText rs!Value
                End If
            
            End If
            
            rs.MoveNext
            
          Next i
        
        End If
        
        
        
        
        
        
           
           If view = "false" Then
                Dim strPrinter As String
'
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
        'End If
    End With
Exit Sub
errLoad:
End Sub






