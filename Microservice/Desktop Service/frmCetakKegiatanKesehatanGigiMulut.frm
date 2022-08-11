VERSION 5.00
Begin VB.Form frmCetakKegiatanKesehatanGigiMulut 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakKegiatanKesehatanGigiMulut.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakKegiatanKesehatanGigiMulut"
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
Dim k As Integer

'Dim i, j, k, l As Integer
'Dim w, X, y, z As String

Private Sub cmdTutup_Click()
    Unload Me
End Sub

Public Function Cetak(tglAwal As String)
On Error GoTo error
    
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.3.xlsx")
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
    
'###################################################---splakuk revision on 2013-07-09


Set rs = Nothing
    strSQL = "Select distinct NoUrut,JenisKegiatan from masterrl_3_8_m order by NoUrut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    k = 13
    For i = 1 To rs.RecordCount
        strSQL = "Select * from V_RL_3_3 where NoUrut=" & i & ""
'        Call msubRecFO(rs2, strSQLX)
        ReadRs2 strSQL
'        For j = 1 To rs2.RecordCount
            With oSheet
                
                .Cells(k, 1) = RS2.Fields("NoUrut")
'               .Cells(k, 1).Borders.LineStyle = 2
                .Cells(k, 2) = Trim(RS2.Fields("JenisKegiatan"))
                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_3 where NoUrut=" & i & " and JenisKegiatan='" & Trim(RS2.Fields("JenisKegiatan")) & "' and Year(TglPelayanan)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs3 strSQL
                .Cells(k, 7) = RS3(0).Value
                
            End With
'        Next j
        k = k + 1
        
    Next i
   
'######################################################
    
    
'
    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    MsgBox "Data Tidak Ada", vbInformation, "Validasi"
'    Call msubPesanError
'    Resume 0
    MsgBox Err.Description
    Screen.MousePointer = vbDefault
End Function

Private Sub Form_Unload(Cancel As Integer)
    On Error Resume Next
    oXL.Quit
End Sub


