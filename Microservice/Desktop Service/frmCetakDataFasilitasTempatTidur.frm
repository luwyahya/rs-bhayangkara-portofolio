VERSION 5.00
Begin VB.Form frmCetakDataFasilitasTempatTidur 
   Caption         =   "Transmedic"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakDataFasilitasTempatTidur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakDataFasilitasTempatTidur"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'Project/reference/microsoft excel 12.0 object library
'Selalu gunakan format file excel 2003  .xls sebagai standar agar pengguna excel 2003 atau diatasnya dpt menggunakan report laporannya
'Catatan: Format excel 2000 tidak dpt mengoperasikan beberapa fungsi yg ada pada excell 2003 atau diatasnya

Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i As Integer
Dim j As Integer
'Special Buat Excel
Dim k As Integer
Dim Cell12 As String
Dim Cell15 As String
Dim Cell18 As String
Dim Cell21 As String
Dim Cell24 As String


Public Sub Cetak()
On Error GoTo hell

'###################################################---splakuk revision on 2013-07-09
'Buka Excel
      Set oXL = CreateObject("Excel.Application")
     ' oXL.Visible = True
'Buat Buka Template
      Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 1.3.xlsx")
      Set oSheet = oWB.ActiveSheet
      
    Set rs = Nothing
    strSQL = "select * from profile_m"
    ReadRs strSQL
    
    With oSheet
'        .Cells(6, 4) = Trim(IIf(IsNull(rs!KdRs), 0, (rs!KdRs)))
        .Cells(7, 4) = Trim(IIf(IsNull(rs!namalengkap), 0, (rs!namalengkap)))
        .Cells(8, 4) = Format(Now, "yyyy")
    End With
    
    Set rs = Nothing
    strSQL = "select     masterrl_1_3_m.nourut, jenisproduk_m.jenisproduk AS jenispelayanan" & _
             " from         masterrl_1_3_m inner join " & _
             " jenisproduk_m on masterrl_1_3_m.objectjenisproduk = jenisproduk_m.id " & _
             " order by nourut "
             
    ReadRs strSQL

    
    k = 14
    For i = 1 To rs.RecordCount
        strSQL = "Select * from V_RL_1_3 where NoUrut=" & i & ""
        ReadRs2 strSQL
        
            With oSheet
                If k = 36 Then
'                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where DeskKelas='ISOLASI' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where DeskKelas='ISOLASI' and StatusEnabled=1"
                    ReadRs3 strSQL
                    .Cells(k, 11) = RS3(0).Value
                Else
                
                    If k = 43 Then k = k + 1
                    .Cells(k, 1) = RS2.Fields("NoUrut")
    
                    .Cells(k, 2) = Trim(RS2.Fields("JenisPelayanan"))
    
'                    strSQL1 = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='VVIP' and JenisPelayanan='" & Trim(rs2.Fields("JenisPelayanan")) & "' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='VVIP' and JenisPelayanan='" & Trim(RS2.Fields("JenisPelayanan")) & "' "
'                    Call msubRecFO(rs3, strSQL1)
                    ReadRs3 strSQL
                    .Cells(k, 6) = RS3(0).Value
                    
'                    strSQL1 = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='VIP' and JenisPelayanan='" & Trim(rs2.Fields("JenisPelayanan")) & "' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='VIP' and JenisPelayanan='" & Trim(RS2.Fields("JenisPelayanan")) & "' "
'                    Call msubRecFO(rs3, strSQL1)
                    ReadRs3 strSQL
                    .Cells(k, 7) = RS3(0).Value
                    
'                    strSQL1 = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='I' and JenisPelayanan='" & Trim(rs2.Fields("JenisPelayanan")) & "' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='I' and JenisPelayanan='" & Trim(RS2.Fields("JenisPelayanan")) & "' "
'                    Call msubRecFO(rs3, strSQL1)
                    ReadRs3 strSQL
                    .Cells(k, 8) = RS3(0).Value
                    
'                    strSQL1 = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='II' and JenisPelayanan='" & Trim(rs2.Fields("JenisPelayanan")) & "' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='II' and JenisPelayanan='" & Trim(RS2.Fields("JenisPelayanan")) & "' "
'                    Call msubRecFO(rs3, strSQL1)
                    ReadRs3 strSQL
                    .Cells(k, 9) = RS3(0).Value
                    
'                    strSQL1 = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='III'and JenisPelayanan='" & Trim(rs2.Fields("JenisPelayanan")) & "' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='III'and JenisPelayanan='" & Trim(RS2.Fields("JenisPelayanan")) & "' "
'                    Call msubRecFO(rs3, strSQL1)
                    ReadRs3 strSQL
                    .Cells(k, 10) = RS3(0).Value
                    
'                    strSQL1 = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='Kelas Khusus' and JenisPelayanan='" & Trim(rs2.Fields("JenisPelayanan")) & "' and (Year(TglAkhirSK)>='" & Format(dtpAwal.Value, "yyyy") & "' or TglAkhirSK is null) and StatusEnabled=1"
                    strSQL = "Select isnull(sum(JmlTT),0) from V_RL_1_3 where NoUrut=" & i & " and Singkatan='Kelas Khusus' and JenisPelayanan='" & Trim(RS2.Fields("JenisPelayanan")) & "' "
'                    Call msubRecFO(rs3, strSQL1)
                    ReadRs3 strSQL
                    .Cells(k, 11) = RS3(0).Value
                    
                End If
            End With
        k = k + 1
        
    Next i
   

oXL.Visible = True
Screen.MousePointer = vbDefault
Exit Sub
 
hell:
    Screen.MousePointer = vbDefault
    MsgBox Err.Description
'    Resume 0
'    msubPesanError
End Sub


Private Sub Form_Load()
    

'    dtpAwal.Value = Now
End Sub

Private Sub setcellVVIP()
    With oSheet
    .Cells(j, 6) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub setcellVIP()
    With oSheet
    .Cells(j, 7) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub setcellI()
    With oSheet
    .Cells(j, 8) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub setcellII()
    With oSheet
    .Cells(j, 9) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub setcellIII()
    With oSheet
    .Cells(j, 10) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub setcellKelasKhusus()
    With oSheet
    .Cells(j, 11) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
    oXL.Quit
End Sub

