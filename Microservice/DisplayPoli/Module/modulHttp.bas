Attribute VB_Name = "modulHttp"
Public result As String
Public url As String
    
Public Function WebRequest(url As String) As String
    Dim http As MSXML2.XMLHTTP
    Set http = CreateObject("MSXML2.ServerXMLHTTP")

    http.Open "GET", url, False
    http.Send

    WebRequest = http.responseText
    Set http = Nothing
End Function
