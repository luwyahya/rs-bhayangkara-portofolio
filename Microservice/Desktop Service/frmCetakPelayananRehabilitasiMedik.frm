VERSION 5.00
Begin VB.Form frmCetakPelayananRehabilitasiMedik 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakPelayananRehabilitasiMedik.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakPelayananRehabilitasiMedik"
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
Dim j As Integer
Dim Cell6 As String
Dim Cell11 As String


'Special Buat Excel

Private Sub cmdTutup_Click()
    Unload Me
End Sub

Public Function Cetak(tglAwal As String)
On Error GoTo error
    Dim k As Integer
    Dim i As Integer
    Dim iL As Integer
    
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
'    oXL.Visible = True
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.9.xlsx")
    Set oSheet = oWB.ActiveSheet
      
    strSQL = "SELECT * From profile_m WHERE id='1'"
'    Set rsb = Nothing
'    rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
    Set rs = Nothing
    ReadRs strSQL
    
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With
    

    Set rs = Nothing
    strSQL = "Select distinct nourut,NamaTindakan from masterrl_3_9_m where nourut between 1 and 21 order by nourut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 13
    For i = 1 To rs.RecordCount

            With oSheet
                If k = 23 Then k = k + 1
                If k = 30 Then k = k + 1

                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_9 where nourut=" & i & " and Year(TglPelayanan)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
            End With

        k = k + 1

    Next i
   
'######################################################
'###################################################---splakuk revision on 2013-08-29
'    oXL.Visible = True

    Set rs = Nothing
    strSQL = "Select distinct nourut,NamaTindakan from masterrl_3_9_m where nourut > 21 order by nourut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 12
    iL = 22
    For i = 1 To rs.RecordCount

            With oSheet
                If k = 16 Then k = k + 1
                If k = 21 Then k = k + 1
                If k = 25 Then k = k + 1
                If k = 30 Then k = k + 1

                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_9 where nourut=" & iL & " and Year(TglPelayanan)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 11) = RS2(0).Value
                
            End With

        k = k + 1
        iL = iL + 1
        
    Next i
   
'######################################################

    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    MsgBox "Data Tidak Ada", vbInformation, "Validasi"
'    Call msubPesanError
    MsgBox Err.Description
    Screen.MousePointer = vbDefault
    Resume 0
End Function

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub

