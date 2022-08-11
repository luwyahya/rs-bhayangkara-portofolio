VERSION 5.00
Begin VB.Form frmCetakKegiatanKesehatanJiwa 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakKegiatanKesehatanJiwa.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakKegiatanKesehatanJiwa"
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
Dim i As Integer
Dim k As Integer
Dim Cell1 As String

'Special Buat Excel
Private Sub cmdTutup_Click()
    Unload Me
End Sub

Public Function Cetak(tglAwal As String)
On Error GoTo error
    
    
    Screen.MousePointer = vbHourglass
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")

    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.11.xlsx")
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
    
'###################################################---splakuk revision on 2013-07-09
'    oXL.Visible = True

    Set rs = Nothing
    strSQL = "Select distinct NoUrut,JenisPelayanan from masterrl_3_11_m order by NoUrut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 13
    For i = 1 To rs.RecordCount

            With oSheet

                strSQL = "Select isnull(count(NoCM),0) from V_RL_3_11 where NoUrut=" & i & " and Year(TglPelayanan)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 8) = RS2(0).Value
                
            End With

        k = k + 1
        
    Next i
   
'######################################################

    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    MsgBox "Data Tidak Ada", vbInformation, "Validasi"
    Screen.MousePointer = vbDefault
'    Call msubPesanError
    MsgBox Err.Description
    
End Function

Private Sub Form_Unload(Cancel As Integer)
    On Error Resume Next
    oXL.Quit
End Sub


