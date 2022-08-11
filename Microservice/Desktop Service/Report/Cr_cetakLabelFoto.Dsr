VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} Cr_cetakLabelFoto 
   ClientHeight    =   9360
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   16065
   OleObjectBlob   =   "Cr_cetakLabelFoto.dsx":0000
End
Attribute VB_Name = "Cr_cetakLabelFoto"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Section10_Format(ByVal pFormattingInfo As Object)
    Dim bmp As StdPicture
'    Dim img As StdPicture
     With Section10.ReportObjects
       Set bmp = LoadPicture("c:\tmp_epics.jpg")
'       Set img = LoadPicture("c:\barcode.jpg")
        Set .Item("Picture4").FormattedPicture = bmp
        Set .Item("Picture2").FormattedPicture = bmp
        Set .Item("Picture3").FormattedPicture = bmp
'       Set .Item("Picture2").FormattedPicture = img
     End With
End Sub
