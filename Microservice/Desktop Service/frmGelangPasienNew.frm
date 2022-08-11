VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmGelangPasienNew 
   Caption         =   "Laporan Cetak Stok Barang"
   ClientHeight    =   3195
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   4680
   Icon            =   "frmGelangPasienNew.frx":0000
   LinkTopic       =   "Form1"
   MDIChild        =   -1  'True
   ScaleHeight     =   3195
   ScaleWidth      =   4680
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
Attribute VB_Name = "frmGelangPasienNew"
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
Dim sPrinter2 As String
Dim tempPrint As String
Dim adoReport As New ADODB.Command
Dim Report As New crGelangPasien
Dim reportbayi As New crGelangPasienIbuAnak
'Dim Report1 As New crGelangPasienLaki
'Dim Report2 As New crGelangPasienBayi

Private Sub Form_Load()
'    Dim adocomd As New ADODB.Command
'    adocomd.ActiveConnection = dbConn
'    Screen.MousePointer = vbHourglass
'    Me.WindowState = 2
'
'    adocomd.CommandText = strSQL1
'    adocomd.CommandType = adCmdText
'    If mstrJK = "L" Then
'        Report1.database.AddADOCommand dbConn, adocomd
'
'        With Report1
'            .usNoRM.SetUnboundFieldSource ("{ado.No. Cm}")
'            .usNama.SetUnboundFieldSource ("{ado.Nama Lengkap}")
'            .udTglLahir.SetUnboundFieldSource ("{ado.TglLahir}")
'        End With
'
'        sPrinter2 = GetStringValue("HKEY_CURRENT_USER\Software\Medifirst2000\Standard", "GelangAyah")
'            Urutan = 0
''            For z = 1 To Len(sPrinter1)
''                If Mid(sPrinter1, z, 1) = ";" Then
'                    Urutan = Urutan + 1
'                    Posisi = Z
'                    ReDim Preserve arrPrinter(Urutan)
'                    arrPrinter(Urutan).intUrutan = Urutan
'                    arrPrinter(Urutan).intPosisi = Posisi
'                    'If urutan = 1 Then
''                        arrPrinter(urutan).strNamaPrinter = Mid(sPrinter1, 1, z - 1)
'                         arrPrinter(Urutan).strNamaPrinter = sPrinter2
'                    'Else
''                        arrPrinter(urutan).strNamaPrinter = Mid(sPrinter1, arrPrinter(urutan - 1).intPosisi + 1, z - arrPrinter(urutan - 1).intPosisi - 1)
'                    '    arrPrinter(urutan).strNamaPrinter = Mid(sPrinter1, arrPrinter(urutan - 1).intPosisi + 1, z - arrPrinter(urutan - 1).intPosisi - 1)
'                    'End If
'
'                        For Each p In Printers
'                            strDeviceName = arrPrinter(Urutan).strNamaPrinter
'                            strDriverName = p.DriverName
'                            strPort = p.Port
'
'                            Report1.SelectPrinter strDriverName, strDeviceName, strPort
'                            Report1.PrintOut False
'                            Screen.MousePointer = vbNormal
'
'                        Exit For
'                    Next
'    Else
'
'        Report.database.AddADOCommand dbConn, adocomd
'
'        With Report
'            .usNoRM.SetUnboundFieldSource ("{ado.No. Cm}")
'            .usNama.SetUnboundFieldSource ("{ado.Nama Lengkap}")
'            .udTglLahir.SetUnboundFieldSource ("{ado.TglLahir}")
'        End With
'
'
'        sPrinter2 = GetStringValue("HKEY_CURRENT_USER\Software\Medifirst2000\Standard", "GelangIbu")
'            Urutan = 0
''            For z = 1 To Len(sPrinter1)
''                If Mid(sPrinter1, z, 1) = ";" Then
'                    Urutan = Urutan + 1
'                    Posisi = Z
'                    ReDim Preserve arrPrinter(Urutan)
'                    arrPrinter(Urutan).intUrutan = Urutan
'                    arrPrinter(Urutan).intPosisi = Posisi
'                    'If urutan = 1 Then
''                        arrPrinter(urutan).strNamaPrinter = Mid(sPrinter1, 1, z - 1)
'                         arrPrinter(Urutan).strNamaPrinter = sPrinter2
'                    'Else
''                        arrPrinter(urutan).strNamaPrinter = Mid(sPrinter1, arrPrinter(urutan - 1).intPosisi + 1, z - arrPrinter(urutan - 1).intPosisi - 1)
'                    '    arrPrinter(urutan).strNamaPrinter = Mid(sPrinter1, arrPrinter(urutan - 1).intPosisi + 1, z - arrPrinter(urutan - 1).intPosisi - 1)
'                    'End If
'
'                        For Each p In Printers
'                            strDeviceName = arrPrinter(Urutan).strNamaPrinter
'                            strDriverName = p.DriverName
'                            strPort = p.Port
'
'                            Report.SelectPrinter strDriverName, strDeviceName, strPort
'                            Report.PrintOut False
'                            Screen.MousePointer = vbNormal
'
'                        Exit For
'                    Next
'    End If
'Exit Sub

End Sub


Public Sub CetakGelangPasienAll(strpasienID As String, kelamin As String)
On Error GoTo errLoad

Dim strKet As Boolean
Dim strPrinter As String
Dim strSQL As String

    
    Set frmGelangPasienNew = Nothing
    Set Report = New crGelangPasien
    strSQL = "select nocm,namapasien,tgllahir from pasien_m where nocm='" & strpasienID & "'"
'    view = "false"
    If kelamin = "dewasalaki" Then
        With Report
        
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            .usNoRm.SetUnboundFieldSource ("{ado.nocm}")
            .usNama.SetUnboundFieldSource ("{ado.Namapasien}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
'
'            If view = "false" Then
            strPrinter = GetTxt("Setting.ini", "Printer", "GelangLakiDewasa")
            'strPrinter = printer
            Report.SelectPrinter "winspool", strPrinter, "Ne00:"
            Report.PrintOut False
            Unload Me
'            Else
'                    With CRViewer1
'                        .ReportSource = Report
'                        .ViewReport
'                        .Zoom 1
'                    End With
'                    Me.Show
'            End If
        End With
    ElseIf kelamin = "bayilaki" Then
        With Report
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            .usNoRm.SetUnboundFieldSource ("{ado.nocm}")
            .usNama.SetUnboundFieldSource ("{ado.Namapasien}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
'
            strPrinter = GetTxt("Setting.ini", "Printer", "GelangLakiBayi")
            'strPrinter = printer
            Report.SelectPrinter "winspool", strPrinter, "Ne00:"
            Report.PrintOut False
            Unload Me

        End With
    ElseIf kelamin = "dewasaperempuan" Then
         With Report
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            .usNoRm.SetUnboundFieldSource ("{ado.nocm}")
            .usNama.SetUnboundFieldSource ("{ado.Namapasien}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
'
            strPrinter = GetTxt("Setting.ini", "Printer", "GelangPerempuanDewasa")
            'strPrinter = printer
            Report.SelectPrinter "winspool", strPrinter, "Ne00:"
            Report.PrintOut False
            Unload Me

        End With
    ElseIf kelamin = "bayiperempuan" Then
         With Report
           Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            .usNoRm.SetUnboundFieldSource ("{ado.nocm}")
            .usNama.SetUnboundFieldSource ("{ado.Namapasien}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
'
            strPrinter = GetTxt("Setting.ini", "Printer", "GelangPerempuanBayi")
            'strPrinter = printer
            Report.SelectPrinter "winspool", strPrinter, "Ne00:"
            Report.PrintOut False
            Unload Me

        End With
    End If
    
Exit Sub
errLoad:
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
    Set frmGelangPasienNew = Nothing
End Sub
