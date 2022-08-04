package com.jasamedika.medifirst2000.report.service.impl;

import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import  com.jasamedika.medifirst2000.report.helper.HelperReportBase;
import com.jasamedika.medifirst2000.report.manager.Manager;
import com.jasamedika.medifirst2000.report.service.GenericReportService;

import lombok.Getter;
import lombok.Setter;
import net.sf.jasperreports.engine.JRParameter;

@Lazy @Service("GenericReportService")
@Getter
@Setter
public class GenericReportServiceImpl extends HelperReportBase implements GenericReportService {

	@Autowired HttpServletResponse response;
	@Autowired Manager reportManager;
	@Autowired ResourceLoader resourceLoader;
	private String jRXMLFileName;
			
	@SuppressWarnings("rawtypes")
	@Override
	public Map getParameterAndValue() {
		
		Locale locale = new Locale( "in", "ID" );
		m.put( JRParameter.REPORT_LOCALE, locale );
		
		m.put("gambarLogo","");
		try {
			m.put("gambarLogo", getImage(getGambarLogo()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return m;
	}

}
