package com.jasamedika.medifirst2000.report.service;

import com.jasamedika.medifirst2000.report.base.ReportService;

public interface GenericReportService extends ReportService {

//	void setKdProfile(Integer kdProfile);
//	void setKdDepartemen(String kdDepartemen);
//	void setKdPegawai(String kdPegawai);
	void setGambarLogo(String gambarLogo);
	void setValue(String[] key, Object[] val, String[] tipe);	
	void setImageValue(String[] key, String[] val);	
}
