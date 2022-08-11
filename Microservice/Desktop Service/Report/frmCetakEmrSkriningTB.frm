VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakEmrSkriningTB 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakEmrSkriningTB.frx":0000
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
Attribute VB_Name = "frmCetakEmrSkriningTB"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crEmrSkriningTB

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

    Set frmCetakEmrSkriningTB = Nothing
End Sub

Public Sub Cetak(noCm As String, emr As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCetakEmrSkriningTB = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String

Set Report = New crEmrSkriningTB

      
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
                " Where emrdp.statusenabled = 1 and emrd.statusenabled = 1" & _
                " AND emrp.nocm = '" & noCm & "' and emrp.norec='" & emr & "' " & _
                " AND emr.id in (225) and " & _
                " emrd.id  >= 15198 and emrd.id  <=102505  Order by emrdp.emrdfk ASC "

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
                
                If rs("type") = "checkbox" Then
                        .Section8.ReportObjects("Text" & rs!emrdfk).SetText "V"
                        
                ElseIf rs("type") = "combobox" Then
                   arraySplit = Split(rs!Value, "~")
                If rs("emrdfk") = 4265 Then
                .Section8.ReportObjects("Text83").SetText arraySplit(1)
                Else
                 .Section8.ReportObjects("Text" & rs!emrdfk).SetText arraySplit(1)
                
                End If
                
                 
                   
                ElseIf rs("type") = "datetime" Then
                  If rs("emrdfk") = 15224 Then
                 .Text15224.SetText Format(rs("value"), "dd-MM-yyyy")
                 .TextJamPeriksa.SetText Format(rs("value"), "HH:mm")
                 ElseIf rs("emrdfk") = 102505 Then
                 .Text102505.SetText Format(rs("value"), "dd-MM-yyyy")
                 .TextJamKedatangan.SetText Format(rs("value"), "HH:mm")
                    Else
                    .Section8.ReportObjects("Text" & rs!emrdfk).SetText Format(Left(rs!Value, 10), "dd-MM-yyyy")
                    End If
                ElseIf rs("type") = "time" Then
                    .Section8.ReportObjects("Text" & rs!emrdfk).SetText Format(Mid(rs!Value, 12, 8), "HH:mm")
                
                ElseIf rs("type") = "textarea" Then
                    .Section8.ReportObjects("Text" & rs!emrdfk).SetText rs!Value
                
                ElseIf rs("type") = "checkboxtextbox" Then
                    .Section8.ReportObjects("Text" & rs!emrdfk & "1").SetText "V"
                    .Section8.ReportObjects("Text" & rs!emrdfk).SetText rs!Value
                
                Else
                    .Section8.ReportObjects("Text" & rs!emrdfk).SetText rs!Value
                    
                End If
                
                rs.MoveNext
              Next i
            
        End If
   
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









