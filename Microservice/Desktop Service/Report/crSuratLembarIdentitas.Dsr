VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} crSuratLembarIdentitas 
   ClientHeight    =   9360
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   16065
   OleObjectBlob   =   "crSuratLembarIdentitas.dsx":0000
End
Attribute VB_Name = "crSuratLembarIdentitas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub Section8_Format(ByVal pFormattingInfo As Object)
    Dim bmp As StdPicture
     With Section8.ReportObjects
       Set bmp = LoadPicture("c:\tmp_epics.jpg")
       Set .Item("Picture2").FormattedPicture = bmp
     End With
End Sub

