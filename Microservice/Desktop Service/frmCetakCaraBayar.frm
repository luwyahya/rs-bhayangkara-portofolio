VERSION 5.00
Begin VB.Form frmCetakCaraBayar 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakCaraBayar.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakCaraBayar"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'Project/reference/microsoft excel 12.0 object library
'Selalu gunakan format file excel 2003  .xls sebagai standar agar pengguna excel 2003 atau diatasnya dpt menggunakan report laporannya
'Catatan: Format excel 2000 tidak dpt mengoperasikan beberapa fungsi yg ada pada excell 2003 atau diatasnya

Option Explicit
Dim awal As String
Dim akhir As String

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i As Integer
Dim j As String
'Special Buat Excel
Dim k As Integer
Dim Cell7 As String
Dim Cell8 As String
Dim Cell9 As String
Dim Cell10 As String
Dim Cell11 As String
Dim Cell12 As String
Dim tglAwal As String

Public Sub Cetak(tahun As String)
On Error GoTo errLoad
'Buka Excel
      Set oXL = CreateObject("Excel.Application")
      
'Buat Buka Template
      Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.15.xlsx")
      Set oSheet = oWB.ActiveSheet
      
    Set rs = Nothing
    strSQL = "select * from profile_m"
'    Call msubRecFO(rsb, strSQL)
    ReadRs strSQL
    
    With oSheet
      .Cells(7, 4) = Trim(IIf(IsNull(rs!kodeexternal), 0, (rs!kodeexternal)))
      .Cells(8, 4) = Trim(IIf(IsNull(rs!namalengkap), 0, (rs!namalengkap)))
'      .Cells(9, 4) = Format(tglAwal, "yyyy")
    End With
    
    Set rs = Nothing
    strSQL = "Select distinct NoUrut,CaraBayar from V_MasterRL_3_15 order by NoUrut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 15
    For i = 1 To rs.RecordCount
        With oSheet
        
            If k = 17 Then k = k + 1
            If k = 22 Then k = k + 1
        
'            strSQL1 = "Select isnull(count(NoCM),0),isnull(sum(LamaDirawat),0) from V_RL315_RI where NoUrut=" & i & " and Year(TglMasuk)='" & Format(tglAwal, "yyyy") & "' and Year(TglKeluar)='" & Format(tglAwal, "yyyy") & "'"
            strSQL = "Select isnull(count(nocmfk),0),isnull(sum(LamaDirawat),0) from V_RL_3_15_RI where NoUrut=" & i & " and Year(TglMasuk)='" & tahun & "' and Year(TglKeluar)='" & tahun & "'"
'            Call msubRecFO(rs1, strSQL1)
            ReadRs2 strSQL
            .Cells(k, 5) = RS2(0).Value
            .Cells(k, 6) = RS2(1).Value
            
            strSQL = "Select isnull(count(nocmfk),0) from V_RL_3_15_RJ where NoUrut=" & i & " and Year(TglMasuk)='" & tahun & "' "
'            Call msubRecFO(rs1, strSQL1)
            ReadRs2 strSQL
            .Cells(k, 7) = RS2(0).Value
            
            strSQL = "Select isnull(count(nocmfk),0) from V_RL_3_15_LAB where NoUrut=" & i & " and Year(TglMasuk)='" & tahun & "' "
'            Call msubRecFO(rs1, strSQL1)
            ReadRs2 strSQL
            .Cells(k, 8) = RS2(0).Value
            
             strSQL = "Select isnull(count(nocmfk),0) from V_RL_3_15_RAD where NoUrut=" & i & " and Year(TglMasuk)='" & tahun & "' "
'            Call msubRecFO(rs1, strSQL1)
            ReadRs2 strSQL
            .Cells(k, 9) = RS2(0).Value
            
            strSQL = "Select isnull(count(nocmfk),0) from V_RL_3_15_Lain2 where NoUrut=" & i & " and Year(TglMasuk)='" & tahun & "' "
'            Call msubRecFO(rs1, strSQL1)
            ReadRs2 strSQL
            .Cells(k, 10) = RS2(0).Value
                
        End With
'        Next j
    k = k + 1
        
    Next i
    
    
   

    oXL.Visible = True
    Screen.MousePointer = vbDefault
     
Exit Sub
errLoad:
    Screen.MousePointer = vbDefault
'    msubPesanError
    MsgBox Err.Description
    Resume 0
End Sub



Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub

