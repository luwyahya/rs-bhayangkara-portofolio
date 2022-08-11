VERSION 5.00
Begin VB.Form frmCetakDataKetenagaan 
   Caption         =   "Transmedic"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakDataKetenagaan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakDataKetenagaan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'made by mario 12/04/12
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

Private Sub Form_Load()
'    Call PlayFlashMovie(Me)
'    Call centerForm(Me, MDIUtama)
'    DTPickerAwal.Value = Now

End Sub
' tenaga medis
Public Sub Cetak()
On Error GoTo error
    
'    ProgressBar1.Value = ProgressBar1.Min
'    lblPersen.Caption = "0 %"
'    Screen.MousePointer = vbHourglass
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
'    oXL.Visible = True
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 2.xlsx")
    Set oSheet = oWB.ActiveSheet
    

    strSQL = "select * from profile_m where id='" & 1 & "'"
             'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'    Set rsb = Nothing
'    rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
    
    Set rs = Nothing
    ReadRs strSQL
    With oSheet
            .Cells(7, 3) = rs("kdprofile").Value
            .Cells(8, 3) = rs("namalengkap").Value
'            .Cells(9, 3) = Format(DTPickerAwal.Value, "yyyy")
    End With
    
    
'###################################################---splakuk revision on 2013-07-25

    Set rs = Nothing
'    strSQL = "Select KdKualifikasiJurusan from V_RL2_TenagaKesehatanMedis"
    strSQL = "Select id from V_TenagaKesehatanMedis"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 15
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaKesehatanKeperawatan"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 57
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select KdKualifikasiJurusan from V_TenagaKesehatanFarmasi"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 71
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaKesehatanMasyarakat"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 83
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaKesehatanGizi"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 98
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaKesehatanTerapiFisik"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 110
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
   
    Set rs = Nothing
    strSQL = "Select id from V_TenagaKesehatanTeknisi"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 119
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaNonKesehatanDoktoral"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 145
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaNonKesehatanPascaSarjana"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 163
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaNonKesehatanSarjana"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    k = 177
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaNonKesehatanSarjanaMuda"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    k = 190
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
    Next i
    
    Set rs = Nothing
    strSQL = "Select id from V_TenagaNonKesehatanSMU"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
'    ProgressBar1.Max = rs.RecordCount
    k = 203
    For i = 1 To rs.RecordCount
            With oSheet
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 1) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 6) = RS2(0).Value
                
                strSQL = "Select isnull(count(dbo.pegawai_m.id),0) from dbo.pegawai_m " & _
                          " where(objectjeniskelaminfk = 2) and (objectstatuspegawaifk = 3) AND (objectkualifikasijurusanfk = '" & rs(0).Value & "')"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 7) = RS2(0).Value
            
            End With
'        Next j
'        k = k + 1
        rs.MoveNext
'        ProgressBar1.Value = ProgressBar1.Value + 1
'        lblPersen.Caption = Int(ProgressBar1.Value * 100 / ProgressBar1.Max) & " %"
    Next i
'######################################################
    oXL.Visible = True
Screen.MousePointer = vbDefault

Exit Sub
error:
'    Call msubPesanError
    Screen.MousePointer = vbDefault
    Resume 0
End Sub

Sub tenaga_keperawatan()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 12
            If k = 1 Then
                l = 57
'                X = "0005"
                x = "A9B1"
            ElseIf k = 2 Then
                l = 58
'                X = "0006"
                x = "A9B6"
            ElseIf k = 3 Then
                l = 59
'                X = "0007"
                x = "A9C2"
            ElseIf k = 4 Then
                l = 60
'                X = "0146"
                x = "258"
            ElseIf k = 5 Then
                l = 61
'                X = "0210"
                x = "227"
            ElseIf k = 6 Then
                l = 62
'                X = "0211"
                x = "230"
            ElseIf k = 7 Then
                l = 63
'                X = "0212"
                x = "217"
            ElseIf k = 8 Then
                l = 64
'                X = "0187"
                x = "0187"
            ElseIf k = 9 Then
                l = 65
                x = "0188"
            ElseIf k = 10 Then
                l = 66
                x = "0189"
            ElseIf k = 11 Then
                l = 67
'                X = "0147"
                x = "A6B8"
            ElseIf k = 12 Then
                l = 68
'                X = "0178"
                x = "AACA"
            End If
            
            strSQL = "select sum (id) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " where objectjeniskelaminfk = '" & w & "' and kdKualifikasijurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub kefarmasian()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 10
            If k = 1 Then
                l = 71
                x = "0008"
            ElseIf k = 2 Then
                l = 72
                x = "0009"
            ElseIf k = 3 Then
                l = 73
                x = "0153"
            ElseIf k = 4 Then
                l = 74
                x = "0154"
            ElseIf k = 5 Then
                l = 75
                x = "0155"
            ElseIf k = 6 Then
                l = 76
                x = "0190"
            ElseIf k = 7 Then
                l = 77
                x = "0156"
            ElseIf k = 8 Then
                l = 78
                x = "0157"
            ElseIf k = 9 Then
                l = 79
                x = "0158"
            ElseIf k = 10 Then
                l = 80
                x = "0159"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub kesehatan_masyarakat()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 13
            If k = 1 Then
                l = 83
                x = "0016"
            ElseIf k = 2 Then
                l = 84
                x = "0017"
            ElseIf k = 3 Then
                l = 85
                x = "0191"
            ElseIf k = 4 Then
                l = 86
                x = "0018"
            ElseIf k = 5 Then
                l = 87
                x = "0019"
            ElseIf k = 6 Then
                l = 88
                x = "0192"
            ElseIf k = 7 Then
                l = 89
                x = "0193"
            ElseIf k = 8 Then
                l = 90
                x = "0020"
            ElseIf k = 9 Then
                l = 91
                x = "0194"
            ElseIf k = 10 Then
                l = 92
                x = "0021"
            ElseIf k = 11 Then
                l = 93
                x = "0022"
            ElseIf k = 12 Then
                l = 94
                x = "0023"
            ElseIf k = 13 Then
                l = 95
                x = "0180"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub gizi()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 7
            If k = 1 Then
                l = 98
                x = "0024"
            ElseIf k = 2 Then
                l = 99
                x = "0025"
            ElseIf k = 3 Then
                l = 100
                x = "0026"
            ElseIf k = 4 Then
                l = 101
                x = "0027"
            ElseIf k = 5 Then
                l = 102
                x = "0029"
            ElseIf k = 6 Then
                l = 103
                x = "0030"
            ElseIf k = 7 Then
                l = 104
                x = "0181"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub keterapian_fisik()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 7
            If k = 1 Then
                l = 110
                x = "0195"
            ElseIf k = 2 Then
                l = 111
                x = "0031"
            ElseIf k = 3 Then
                l = 112
                x = "0032"
            ElseIf k = 4 Then
                l = 113
                x = "0033"
            ElseIf k = 5 Then
                l = 114
                x = "0196"
            ElseIf k = 6 Then
                l = 115
                x = "0197"
            ElseIf k = 7 Then
                l = 116
                x = "0182"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub keteknisian_medis()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 23
            If k = 1 Then
                l = 119
                x = "0095"
            ElseIf k = 2 Then
                l = 120
                x = "0096"
            ElseIf k = 3 Then
                l = 121
                x = "0098"
            ElseIf k = 4 Then
                l = 122
                x = "0100"
            ElseIf k = 5 Then
                l = 123
                x = "0198"
            ElseIf k = 6 Then
                l = 124
                x = "0102"
            ElseIf k = 7 Then
                l = 125
                x = "0103"
            ElseIf k = 8 Then
                l = 126
                x = "0105"
            ElseIf k = 9 Then
                l = 127
                x = "0107"
            ElseIf k = 10 Then
                l = 128
                x = "0109"
            ElseIf k = 11 Then
                l = 129
                x = "0110"
            ElseIf k = 12 Then
                l = 130
                x = "0112"
            ElseIf k = 13 Then
                l = 131
                x = "0113"
            ElseIf k = 14 Then
                l = 132
                x = "0114"
            ElseIf k = 15 Then
                l = 133
                x = "0116"
            ElseIf k = 16 Then
                l = 134
                x = "0183"
            ElseIf k = 17 Then
                l = 135
                x = "0199"
            ElseIf k = 18 Then
                l = 136
                x = "0200"
            ElseIf k = 19 Then
                l = 137
                x = "0201"
            ElseIf k = 20 Then
                l = 138
                x = "0184"
            ElseIf k = 21 Then
                l = 139
                x = "0202"
            ElseIf k = 22 Then
                l = 140
                x = "0203"
            ElseIf k = 23 Then
                l = 141
                x = "0182"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub doktoral()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 11
            If k = 1 Then
                l = 145
                x = "0115"
            ElseIf k = 2 Then
                l = 146
                x = "0117"
            ElseIf k = 3 Then
                l = 147
                x = "0119"
            ElseIf k = 4 Then
                l = 148
                x = "0120"
            ElseIf k = 5 Then
                l = 149
                x = "0121"
            ElseIf k = 6 Then
                l = 150
                x = "0122"
            ElseIf k = 7 Then
                l = 151
                x = "0123"
            ElseIf k = 8 Then
                l = 152
                x = "0124"
            ElseIf k = 9 Then
                l = 153
                x = "0125"
            ElseIf k = 10 Then
                l = 154
                x = "0126"
            ElseIf k = 11 Then
                l = 155
                x = "0127"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub pasca_sarjana()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 12
            If k = 1 Then
                l = 163
                x = "0128"
            ElseIf k = 2 Then
                l = 164
                x = "0129"
            ElseIf k = 3 Then
                l = 165
                x = "0131"
            ElseIf k = 4 Then
                l = 166
                x = "0132"
            ElseIf k = 5 Then
                l = 167
                x = "0133"
            ElseIf k = 6 Then
                l = 168
                x = "0134"
            ElseIf k = 7 Then
                l = 169
                x = "0135"
            ElseIf k = 8 Then
                l = 170
                x = "0136"
            ElseIf k = 9 Then
                l = 171
                x = "0137"
            ElseIf k = 10 Then
                l = 172
                x = "0138"
            ElseIf k = 11 Then
                l = 173
                x = "0139"
            ElseIf k = 12 Then
                l = 174
                x = "0140"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub sarjana()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 11
            If k = 1 Then
                l = 177
                x = "0062"
            ElseIf k = 2 Then
                l = 178
                x = "0063"
            ElseIf k = 3 Then
                l = 179
                x = "0068"
            ElseIf k = 4 Then
                l = 180
                x = "0070"
            ElseIf k = 5 Then
                l = 181
                x = "0072"
            ElseIf k = 6 Then
                l = 182
                x = "0073"
            ElseIf k = 7 Then
                l = 183
                x = "0075"
            ElseIf k = 8 Then
                l = 184
                x = "0077"
            ElseIf k = 9 Then
                l = 185
                x = "0079"
            ElseIf k = 10 Then
                l = 186
                x = "0080"
            ElseIf k = 11 Then
                l = 187
                x = "0082"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub sarjana_muda()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 11
            If k = 1 Then
                l = 190
                x = "0087"
            ElseIf k = 2 Then
                l = 191
                x = "0088"
            ElseIf k = 3 Then
                l = 192
                x = "0093"
            ElseIf k = 4 Then
                l = 193
                x = "0097"
            ElseIf k = 5 Then
                l = 194
                x = "0094"
            ElseIf k = 6 Then
                l = 195
                x = "0204"
            ElseIf k = 7 Then
                l = 196
                x = "0101"
            ElseIf k = 8 Then
                l = 197
                x = "0104"
            ElseIf k = 9 Then
                l = 198
                x = "0106"
            ElseIf k = 10 Then
                l = 199
                x = "0108"
            ElseIf k = 11 Then
                l = 200
                x = "0111"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Sub smuSederajatdanDibawahnya()
    i = 0
    k = 0
    For i = 1 To 2
        If i = 1 Then
            j = 6
            w = "1"
        Else
            j = 7
            w = "2"
        End If
            
        For k = 1 To 8
            If k = 1 Then
                l = 203
                x = "0013"
            ElseIf k = 2 Then
                l = 204
                x = "0047"
            ElseIf k = 3 Then
                l = 205
                x = "0048"
            ElseIf k = 4 Then
                l = 206
                x = "0050"
            ElseIf k = 5 Then
                l = 207
                x = "0051"
            ElseIf k = 6 Then
                l = 208
                x = "0057"
            ElseIf k = 7 Then
                l = 209
                x = "0059"
            ElseIf k = 8 Then
                l = 210
                x = "0052"
            End If
            
            strSQL = "SELECT sum (Jml) as jmlpasien From V_DaftarPegawaiByKualifikasiJurusan " & _
                     " WHERE objectjeniskelaminfk = '" & w & "' and KdKualifikasiJurusan = '" & x & "' "
                     'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'            Set rsb = Nothing
'            rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
            ReadRs strSQL
            With oSheet
                If rs("jmlpasien").Value <> "" Then
                    .Cells(l, j) = rs("jmlpasien").Value
                Else
                    .Cells(l, j) = "0"
                End If
            End With
        Next k
    Next i
'    ProgressBar1.Value = Int(ProgressBar1.Value) + 10
'    lblPersen.Caption = Int(ProgressBar1.Value / 120 * 100) & " %"
End Sub

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub


