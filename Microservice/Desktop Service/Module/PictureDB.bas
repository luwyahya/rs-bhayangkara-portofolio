Attribute VB_Name = "PictureDB"
'Load and Save Images to a Database
'
'The following code illustates how to save and load images to and from
'a database using AppendChunk and GetChunk methods of an ADO recordset. There
'are two sample routines at the bottom of this post showing how to
'use these generic routines.
'
'Notes:
'For Access Database's the field should be of the "OLE Object" type and for SQL server use the "image" type.
'You will need to add a reference to Microsoft ActiveX Data Objects X.X Library (Where X.X >= 2.1).
'You will need to add a PictureBox control to a form to run the test routines.

'Option Explicit
Dim fso As New FileSystemObject
Private Declare Function GetTempPath Lib "kernel32" Alias "GetTempPathA" (ByVal nBufferLength As Long, ByVal lpBuffer As String) As Long
Private Declare Function GetTempFileName Lib "kernel32" Alias "GetTempFileNameA" (ByVal lpszPath As String, ByVal lpPrefixString As String, ByVal wUnique As Long, ByVal lpTempFileName As String) As Long

Public Function ImageFromByteArray(btImage As Byte) As Image
      Dim msStream As New MemoryStream(btImage)
      Dim imgImage As Image = Image.FromStream(msStream)
      Return imgImage
End Function

'Purpose     :  Saves pictures in image boxes (or similiar) to a field in a recordset
'Inputs      :  oPictureControl                 A control containing an image
'               adoRS                           ADO recordset to add the image to
'               sFieldName                      The field name in adoRS, to add the image to
'Outputs     :  Returns True if succeeded in updating the recordset
'Notes       :  The field specified in sFieldName, must have a binary field type (ie. OLE Object in access)
'               Save the image at the currect cursor location in the recordset.
'Revisions   :

Public Function SaveDataPictureToDB(oPictureControl As Object, adoRS As ADODB.Recordset, sFieldName As String) As Boolean
    Dim oPict As StdPicture
    Dim sDir As String, sTempFile As String
    Dim iFileNum As Integer
    Dim lFileLength As Long
    Dim abBytes() As Byte
    Dim iCtr As Integer
    
'    On Error GoTo ErrHandler
    
    Set oPict = oPictureControl.Picture
    If oPict Is Nothing Then
        SavePictureToDB = False
        Exit Function
    End If

    'Save picture to temp file
    sTempFile = FileGetTempName
    SavePicture oPict, sTempFile
    
    'read file contents to byte array
    iFileNum = FreeFile
    Open sTempFile For Binary Access Read As #iFileNum
    lFileLength = LOF(iFileNum)
    ReDim abBytes(lFileLength)
    Get #iFileNum, , abBytes()
    'put byte array contents into db field
    adoRS.Fields(sFieldName).AppendChunk abBytes()
    Close #iFileNum
    
    'Don't return false if file can't be deleted
    On Error Resume Next
    Kill sTempFile
    SavePictureToDB = True
    Exit Function
    
ErrHandler:
    SavePictureToDB = False
'    Debug.Print Err.Description
End Function


'Purpose     :  Loads a Picture, saved as binary data in a database, from a recordset into a picture control.
'Inputs      :  oPictureControl                 A control to load the image into
'               adoRS                           ADO recordset to add the image to
'               sFieldName                      The field name in adoRS, to add the image to
'Outputs     :  Returns True if succeeded in loading the image
'Notes       :  Loads the image at the currect cursor location in the recordset.


Public Function LoadPictureFromDB(oPictureControl As Object, adoRS As ADODB.Recordset, sFieldName As String) As Boolean
    Dim oPict As StdPicture
    Dim sDir As String
    Dim sTempFile As String
    Dim iFileNum As Integer
    Dim lFileLength As Long
    Dim abBytes() As Byte
    Dim iCtr As Integer
    
'    On Error GoTo ErrHandler
    sTempFile = FileGetTempName
   
    iFileNum = FreeFile
    Open sTempFile For Binary As #iFileNum
    lFileLength = LenB(adoRS(sFieldName))
    
    abBytes = adoRS(sFieldName).GetChunk(lFileLength)
    Put #iFileNum, , abBytes()
    Close #iFileNum

    oPictureControl.Picture = LoadPicture(sTempFile)
    
    Kill sTempFile
    LoadPictureFromDB = True
    Exit Function
    
ErrHandler:
    LoadPictureFromDB = False
'    Debug.Print Err.Description
End Function



'Purpose     :  The FileGetTempName function returns a name of a temporary file.
'Inputs      :  [sFilePrefix]               The prefix of the file name.
'Outputs     :  Returns the name of the next free temporary file name (and path).
'Notes       :  The filename is the concatenation of specified path and prefix strings,
'               a hexadecimal string formed from a specified integer, and the .TMP extension

Function FileGetTempName(Optional sFilePrefix As String = "TMP") As String
    Dim sTemp As String * 260, lngLen As Long
    Static ssTempPath As String
    
    If LenB(ssTempPath) = 0 Then
        'Get the temporary path
        lngLen = GetTempPath(260, sTemp)
        'strip the rest of the buffer
        ssTempPath = Left$(sTemp, lngLen)
        If Right$(ssTempPath, 1) <> "\" Then
            ssTempPath = ssTempPath & "\"
        End If
    End If
    
    'Get a temporary filename
    lngLen = GetTempFileName(ssTempPath, sFilePrefix, 0, sTemp)
    'Remove all the unnecessary chr$(0)'s
    FileGetTempName = Left$(sTemp, InStr(1, sTemp, Chr$(0)) - 1)
End Function

Private Function EncodeBase64(ByRef arrData() As Byte) As String
    Dim objXML As MSXML2.DOMDocument
    Dim objNode As MSXML2.IXMLDOMElement
    ' help from MSXML
    Set objXML = New MSXML2.DOMDocument
    ' byte array to base64
    Set objNode = objXML.createElement("b64")
    objNode.DataType = "bin.base64"
    objNode.nodeTypedValue = arrData
    EncodeBase64 = objNode.Text
    ' thanks, bye
    Set objNode = Nothing
    Set objXML = Nothing
End Function

Private Function DecodeBase64(ByVal strData As String) As Byte()
    Dim objXML As MSXML2.DOMDocument
    Dim objNode As MSXML2.IXMLDOMElement
    ' help from MSXML
    Set objXML = New MSXML2.DOMDocument
    Set objNode = objXML.createElement("b64")
    objNode.DataType = "bin.base64"
    objNode.Text = strData
    DecodeBase64 = objNode.nodeTypedValue
    ' thanks, bye
    Set objNode = Nothing
    Set objXML = Nothing
End Function
To test the above functions, the following code decodes encoded data, its output should match the input. The StrConv function is used to convert strings into byte arrays and vice versa.
Public Sub Main()
    Dim strData As String
    strData = EncodeBase64(StrConv("Greetings and Salutations", vbFromUnicode))
    Debug.Print strData
    Debug.Print StrConv(DecodeBase64(strData), vbUnicode)
End Sub

Public Function GetImageFromBase64(ByVal Base64String)
    Dim fileBytes As Byte()
    Dim streamImage As BITMAP

    Try

     If String.Empty <> Base64String Then''Checking The Base64 string validity
  
         fileBytes = Convert.FromBase64String(Base64String) ''Converting Base64 string to Byte Array
        
         Using ms As New MemoryStream(fileBytes) ''Copying Byte Array to Memory Stream
            
             streamImage = Image.FromStream(ms) ''Constructing Image from Memory Stream

             If Not IsNothing(streamImage) Then

                 If Not Directory.Exists("c:\Base64ImageViwer") Then
                    Directory.CreateDirectory ("c:\Base64ImageViwer") ''Create a Temp Path for Saving
                 End If

               streamImage.Save("c:\Base64ImageViwer\TempImg.jpg",_ ''Save the Image file
               System.Drawing.Imaging.ImageFormat.Jpeg)
               txtfilename.Text = "c:\Base64ImageViwer\TempImg.jpg" '' Assiging Textbox saved location

             End If

         End Using

     End If

    Catch ex As Exception

        MsgBox(ex.Message, MsgBoxStyle.Critical, "Error")

    End Try

  Return streamImage ''Returning Image

End Function

Public Function ConvertImageToBase64(ImageInput As Image) As String

    Dim Base64Op As String = String.Empty
    Try
        Dim ms As MemoryStream = New MemoryStream()

        ImageInput.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg)''Saving Image to Memory stream

        Base64Op = Convert.ToBase64String(ms.ToArray()) ''Creating Base64 String from  memory stream

    Catch ex As Exception

        MsgBox(ex.Message, MsgBoxStyle.Critical, "Error")

    End Try

        Return Base64Op ''Returning Base64 Encoded String

End Function
''SAMPLE USAGE
''NOTE : Add a PictureBox control to a form before running this code
'Sub TestLoadPicture()
'    Dim sConn As String
'    Dim oConn As New ADODB.Connection
'    Dim oRs As New ADODB.Recordset
'
''    On Error GoTo ErrFailed
''    sConn = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:\MyDb.MDB;Persist Security Info=False"
''
''    oConn.Open sConn
'    Dim Server As String
'    Dim Database As String
'    Dim user As String
'    Dim Pass As String
'
'    Server = "localhost"
'    Database = "dbpicture"
'    user = "root"
'    Pass = "pegasus"
'
'    oConn.CursorLocation = adUseClient
'    oConn.Open "DRIVER={MySQL ODBC 3.51 Driver};SERVER=" & Server & ";PORT=3306;" & _
'            "DATABASE=" & Database & "; USER=" & user & ";PASSWORD=" & Pass & ";OPTION=3;"
'
'    oRs.Open "SELECT * FROM MYTABLE", oConn, adOpenKeyset, adLockOptimistic
'    If oRs.EOF = False Then
'        LoadPictureFromDB Picture2, oRs, "MYFIELD"
'    End If
'    oRs.Close
'    Exit Sub
'ErrFailed:
'    MsgBox "Error " & Err.Description
'End Sub
'
''SAMPLE USAGE
''NOTE : Add a PictureBox control to a form before running this code
'Sub TestSavePicture()
'    Dim sConn As String
'    Dim oConn As New ADODB.Connection
'    Dim oRs As New ADODB.Recordset
'
'    On Error GoTo ErrFailed
'    'sConn = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:\MyDb.MDB;Persist Security Info=False"
'
'    'oConn.Open sConn
'    Dim Server As String
'    Dim Database As String
'    Dim user As String
'    Dim Pass As String
'
'    Server = "localhost"
'    Database = "dbpicture"
'    user = "root"
'    Pass = "pegasus"
'
'    oConn.CursorLocation = adUseClient
'    oConn.Open "DRIVER={MySQL ODBC 3.51 Driver};SERVER=" & Server & ";PORT=3306;" & _
'            "DATABASE=" & Database & "; USER=" & user & ";PASSWORD=" & Pass & ";OPTION=3;"
'
'    oRs.Open "SELECT * FROM MYTABLE", oConn, adOpenKeyset, adLockOptimistic
''    If oRs.EOF = False Then
'        oRs.AddNew
'        SavePictureToDB Picture1, oRs, "MYFIELD"
'        oRs.Update
''    End If
'    oRs.Close
'    Exit Sub
'ErrFailed:
'    MsgBox "Error " & Err.Description
'End Sub

