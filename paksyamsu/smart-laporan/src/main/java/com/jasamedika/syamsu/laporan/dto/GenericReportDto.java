package com.jasamedika.syamsu.laporan.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenericReportDto {
	
	Boolean outProfile;
	Integer kdProfile;
	
	Boolean outDepartemen;
	String kdDepartemen;
	
	String namaFile;
	String extFile;
	Boolean excelOneSheet;
	
	Boolean download;
	
	String gambarLogo;
	
	String[] paramKey;
	String[] paramType;
	Object[] paramValue;
	
	String[] paramImgKey;
	String[] paramImgValue;
	
}