package com.jasamedika.medifirst2000.report.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenericReportDto {
	
	String namaFile;
	String extFile;
	Boolean excelOneSheet;
	
	Boolean download;
	
//	Integer kdProfile;
//	String kdDepartemen;
//	String kdPegawai;
	String gambarLogo;
	
	String[] paramKey;
	String[] paramType;
	Object[] paramValue;
	
	String[] paramImgKey;
	String[] paramImgValue;
	
}
