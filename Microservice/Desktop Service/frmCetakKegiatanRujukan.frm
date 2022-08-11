VERSION 5.00
Begin VB.Form frmCetakKegiatanRujukan 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakKegiatanRujukan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakKegiatanRujukan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i As Integer
Dim j As Integer

Dim Cell7 As String
Dim Cell8 As String
Dim Cell9 As String
Dim Cell10 As String
Dim Cell11 As String
Dim Cell12 As String
Dim Cell13 As String
Dim Cell14 As String
Dim Cell15 As String

'Special Buat Excel

Private Sub cmdTutup_Click()
    Unload Me
End Sub



Public Sub Cetak(tglAwal As String)
On Error GoTo error
    Dim k As Integer
    Dim i As Integer
    Screen.MousePointer = vbHourglass
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
'    oXL.Visible = True
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.14.xlsx")
    Set oSheet = oWB.ActiveSheet
      
    strSQL = "select * from profile_m where id='" & 1 & "'"
    Set rs = Nothing
    
    ReadRs strSQL
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With



'=================================================================


   '###################################################---splakuk revision on 2013-09-05
'    oXL.Visible = True

    Set rs = Nothing
    strSQL = "select distinct kode,smf from masterrl_3_14_m order by kode"
'    Call msubRecFO(rs, strSQL)
'    ProgressBar1.Max = rs.RecordCount
    ReadRs strSQL
    k = 14
    For i = 1 To rs.RecordCount
'            ProgressBar1.Max = rs.RecordCount
            With oSheet

                strSQL = "Select isnull(sum(RujukanPuskesmas),0) as Puskesmas,isnull(sum(RujukanFaskesLain),0) as FaskesLain,isnull(sum(RujukanRS),0) as RujukanRS " & _
                "from V_RL_3_14 where Kode=" & rs(0).Value & " and Year(TglMasuk)='" & tglAwal & "'"
                
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 5) = RS2(0).Value
                .Cells(k, 6) = RS2(1).Value
                .Cells(k, 7) = RS2(2).Value
                
                
            End With
        k = k + 1
        rs.MoveNext
'        ProgressBar1.Value = ProgressBar1.Value + 1
'        lblPersen.Caption = Int(ProgressBar1.Value * 100 / ProgressBar1.Max) & " %"
    Next i
   
'######################################################
'    ProgressBar1.Value = 0
    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Sub
error:
'    MsgBox "Data Tidak Ada", vbInformation, "Validasi"
'Call msubPesanError
    MsgBox Err.Description
    Screen.MousePointer = vbDefault
    Resume 0
End Sub

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub


