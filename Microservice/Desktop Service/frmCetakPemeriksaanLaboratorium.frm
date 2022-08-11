VERSION 5.00
Begin VB.Form frmCetakPemeriksaanLaboratorium 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakPemeriksaanLaboratorium.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakPemeriksaanLaboratorium"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'made by mario 18/04/12
Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i, j, k, l As Integer
Dim w, x, Y, z As String
'Special Buat Excel

Private Sub cmdTutup_Click()
    Unload Me
End Sub

Public Function Cetak(tglAwal As String)
On Error GoTo error

    
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
'    oXL.Visible = True
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.8.xlsx")
    Set oSheet = oWB.ActiveSheet
    
    strSQL = "SELECT * From profile_m WHERE id='1'"
'    Set rsb = Nothing
'    rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
    
    ReadRs strSQL
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With
    
    '###################################################---splakuk revision on 2013-08-29
'    oXL.Visible = True

    Set rs = Nothing
    strSQL = "Select distinct nourut,jeniskegiatan from masterrl_3_8_m order by nourut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 16
    For i = 1 To rs.RecordCount

            With oSheet
                If k = 24 Then k = k + 1
                If k = 31 Then k = k + 1
                If k = 35 Then k = k + 1
                If k = 40 Then k = k + 1
                If k = 50 Then k = k + 3
                If k = 66 Then k = k + 1
                If k = 75 Then k = k + 2
                If k = 98 Then k = k + 5
                If k = 108 Then k = k + 1
                If k = 118 Then k = k + 1
                If k = 135 Then k = k + 1
                If k = 148 Then k = k + 4
                If k = 161 Then k = k + 1
                If k = 168 Then k = k + 1
                If k = 178 Then k = k + 1
                If k = 199 Then k = k + 3
                If k = 214 Then k = k + 1

                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_8 where nourut=" & i & " and Year(TglPelayanan)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 9) = RS2(0).Value
                
            End With
'        Next j
        k = k + 1
        
    Next i
   
'######################################################
    
    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    Call msubPesanError
    MsgBox Err.Description
    Screen.MousePointer = vbDefault
    Resume 0
End Function

Private Sub Form_Unload(Cancel As Integer)
    On Error Resume Next
    oXL.Quit
End Sub


