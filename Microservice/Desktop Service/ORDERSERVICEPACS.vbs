'--------------------------------
' net eXtreme Connectivity
' VBScript to map a network drive  
' Version 1.1 - 5 January 2010

'--------------------------------

Option Explicit
Dim objNetwork, objShell
Dim strDriveLetter1, strDriveLetter2, strDriveLetter3, strDriveLetter4, strDriveLetter5, strDriveLetter6, strDriveLetter7, strDriveLetter8, strNewName1, strNewName2, strNewName3, strNewName4, strNewName5, strNewName6, strNewName7, strNewName8, strRemotePath1, strRemotePath2, strRemotePath3, strRemotePath4, strRemotePath5, strRemotePath6, strRemotePath7, strRemotePath8, strUser, strPassword, strProfile

strDriveLetter1 = "K:"
strDriveLetter2 = "L:"


strNewName1 = "ORDER"
strNewName2 = "REPORT"


strRemotePath1 = "\\10.10.100.9\SourceIn_"
strRemotePath2 = "\\10.10.100.9\SourceReportIn_"


strUser = "his_user"
strPassword = "H1$_user"
strProfile = "false"

Set objNetwork = WScript.CreateObject("WScript.Network") 
objNetwork.MapNetworkDrive strDriveLetter1, strRemotePath1, strProfile, strUser, strPassword 
objNetwork.MapNetworkDrive strDriveLetter2, strRemotePath2, strProfile, strUser, strPassword 


Set objShell = CreateObject("Shell.Application")
objShell.NameSpace(strDriveLetter1).Self.Name = strNewName1
objShell.NameSpace(strDriveLetter2).Self.Name = strNewName2


WScript.Quit