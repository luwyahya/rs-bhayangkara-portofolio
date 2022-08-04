package com.jasamedika.medifirst2000.report.base;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.core.io.ResourceLoader;

// import ar.com.fdvs.dj.domain.DynamicReport;

@SuppressWarnings("rawtypes")
public interface ReportService  {
	
	boolean isJpa();

	void setInit(boolean init);
	
	boolean isInit();

	void setJRXMLFileName(String xmlFile);

	String getJRXMLFileName();

	Map getParameterAndValue();

	ReportManager getReportManager();

	ResourceLoader getResourceLoader();

	String getFolderClasspath();

	HttpServletResponse getResponse();
	
	String getReport() throws Exception;

	String getReport(List<Map<String,?>> data) throws Exception;

//	DynamicReport getDynamicReport() throws Exception;
	
	String getFastReporter() throws Exception;

	String getFastReporter(List<Map<String,?>> data) throws Exception;
	
	void downloadSimplePDF() throws Exception;
	
	void downloadSimpleXLS() throws Exception;
	
	void downloadSimpleXLSX() throws Exception;

}
