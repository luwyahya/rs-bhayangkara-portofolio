VERSION 5.00
Begin VB.Form frmCetakKegiatanPembedahan 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakKegiatanPembedahan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakKegiatanPembedahan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'made by mario 17/04/12
Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i, j, k, l As Integer
Dim w, x, Y, z As String
Dim Cell1, Cell2, Cell3, Cell4 As String

Private Sub cmdTutup_Click()
    Unload Me
End Sub


Public Function Cetak(tglAwal As String)
On Error GoTo error
    
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
'    oXL.Visible = True
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.6.xlsx")
    Set oSheet = oWB.ActiveSheet
    

    strSQL = "SELECT * From profile_m WHERE id='1'"
    
    ReadRs strSQL
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With
'###################################################---splakuk revision on 2013-07-09


Set rs = Nothing
    strSQL = "Select distinct NoUrut,NamaTindakan from masterrl_3_6_m order by NoUrut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 13
    For i = 1 To rs.RecordCount
        strSQL = "Select * from V_RL_3_6 where NoUrut=" & i & ""
'        Call msubRecFO(rs2, strSQLX)
        ReadRs2 strSQL
'        For j = 1 To rs2.RecordCount
            With oSheet
                
                .Cells(k, 1) = RS2.Fields("NoUrut")
'               .Cells(k, 1).Borders.LineStyle = 2
                .Cells(k, 2) = Trim(RS2.Fields("NamaTindakan"))
                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_6 where NoUrut=" & i & " and NamaTindakan='" & Trim(RS2.Fields("NamaTindakan")) & "' and Year(TglPelayanan)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs3 strSQL
                .Cells(k, 5) = RS3(0).Value
                
                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_6 where NoUrut=" & i & " and NamaTindakan='" & Trim(RS2.Fields("NamaTindakan")) & "' and Year(TglPelayanan)='" & tglAwal & "' AND LevelProduk='Khusus'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs3 strSQL
                .Cells(k, 6) = RS3(0).Value
                
                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_6 where NoUrut=" & i & " and NamaTindakan='" & Trim(RS2.Fields("NamaTindakan")) & "' and Year(TglPelayanan)='" & tglAwal & "' AND LevelProduk='Besar'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs3 strSQL
                .Cells(k, 7) = RS3(0).Value
                
                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_6 where NoUrut=" & i & " and NamaTindakan='" & Trim(RS2.Fields("NamaTindakan")) & "' and Year(TglPelayanan)='" & tglAwal & "' AND LevelProduk='Sedang'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs3 strSQL
                .Cells(k, 8) = RS3(0).Value
                
                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_6 where NoUrut=" & i & " and NamaTindakan='" & Trim(RS2.Fields("NamaTindakan")) & "' and Year(TglPelayanan)='" & tglAwal & "' AND LevelProduk='Kecil'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs3 strSQL
                .Cells(k, 9) = RS3(0).Value
                
            End With
'        Next j
        k = k + 1
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
End Function

Private Sub Form_Unload(Cancel As Integer)
    On Error Resume Next
    oXL.Quit
End Sub

