VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} crLaporanJurnalBalikInap 
   ClientHeight    =   9360
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   16065
   OleObjectBlob   =   "crLaporanJurnalBalikInap.dsx":0000
End
Attribute VB_Name = "crLaporanJurnalBalikInap"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False


Private Sub Section1_Format(ByVal pFormattingInfo As Object)
    If usDept.Value = "16" Then
        txtDeskripsi.SetText "Pendapatan R. Inap Non Tunai Tgl " + ustgl.Value
    Else
        txtDeskripsi.SetText "Pendapatan R. Jalan Non Tunai Tgl " + ustgl.Value
    End If
End Sub

