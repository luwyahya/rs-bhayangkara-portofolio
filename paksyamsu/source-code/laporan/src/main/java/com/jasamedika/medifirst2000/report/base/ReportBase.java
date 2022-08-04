package com.jasamedika.medifirst2000.report.base;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Syamsu
 */
@SuppressWarnings("rawtypes")
@Setter
@Getter
public abstract class ReportBase implements ReportService {
	
	
	protected boolean init = false;
	
	public void isInit(boolean init) {
		this.init = init;
	}
	
	public boolean isInit() {
		return init;
	}
	
	//@Value("${app.report.classpath}")
	String classpath="";

	@Override
	public String getReport() throws Exception {

		ReportManager reportLaporan = getReportManager();
		Map param = getParameterAndValue();
		
		String report = "";
		String folder;
		String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		folder = new File(classpathFolderLocal).getAbsolutePath() + File.separator; 
		reportLaporan.setClasspathFolder(classpathFolderLocal);	
		
		if (!isInit()) {
			String fileJasper = folder + getJRXMLFileName();
			reportLaporan.compileReport(new BufferedInputStream(new FileInputStream(fileJasper)));				
		}
		
		reportLaporan.generateReport(param);
		report = reportLaporan.showReport();

		return report;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public String getReport(List<Map<String,?>> dataMap) throws Exception {

		ReportManager reportLaporan = getReportManager();
		Map param = getParameterAndValue();
		
		String report = "";
		String folder;
		String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		folder = new File(classpathFolderLocal).getAbsolutePath() + File.separator; 
		reportLaporan.setClasspathFolder(classpathFolderLocal);	
		
		if (!isInit()) {
			String fileJasper = folder + getJRXMLFileName();
			reportLaporan.compileReport(new BufferedInputStream(new FileInputStream(fileJasper)));				
		}
		
		reportLaporan.generateReport(param, dataMap);
		report = reportLaporan.showReport();

		return report;
	}
	
	@Override
	public String getFastReporter() throws Exception {
		ReportManager reportLaporan = getReportManager();
		Map param = getParameterAndValue();
		
		//String report = "";
		String folder;
		String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		folder = new File(classpathFolderLocal).getAbsolutePath() + File.separator; 
		reportLaporan.setClasspathFolder(classpathFolderLocal);	
		
		if (!isInit()) {
			String fileJasper = folder + getJRXMLFileName();
			reportLaporan.compileReport(new BufferedInputStream(new FileInputStream(fileJasper)));				
		}
		
		reportLaporan.generateReport(param);
		
		return "Selesai";
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public String getFastReporter(List<Map<String,?>> dataMap) throws Exception {
		ReportManager reportLaporan = getReportManager();
		Map param = getParameterAndValue();
		
		//String report = "";
		String folder;
		String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		folder = new File(classpathFolderLocal).getAbsolutePath() + File.separator; 
		reportLaporan.setClasspathFolder(classpathFolderLocal);	
		
		if (!isInit()) {
			String fileJasper = folder + getJRXMLFileName();
			reportLaporan.compileReport(new BufferedInputStream(new FileInputStream(fileJasper)));				
		}
		
		reportLaporan.generateReport(param, dataMap);
		
		return "Selesai";
	}
	
//	@Override
//	public String getDynmicReporter() throws Exception {
//		ReportManager reportLaporan = getReportManager();		
//		Map param = getParameterAndValue();
//		reportLaporan.compileReport(getDynamicReport(),param);
//		
//		return "Selesai";
//	}
	
	
	@Override
	public void downloadSimplePDF() throws Exception {
		ReportManager reportLaporan = getReportManager();

		HttpServletResponse response = getResponse();
		String nmdownload = "filedownload-" + System.currentTimeMillis() + ".pdf";

		response.reset();

		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "must-revalidate, no-transform");
		response.setDateHeader("Expires", 0L);

		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + nmdownload + "\"");

		//String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		//reportLaporan.setClasspathFolder(classpathFolderLocal);
		reportLaporan.showPDF(response.getOutputStream());
		response.flushBuffer();
	}

	@Override
	public void downloadSimpleXLS() throws Exception {

		ReportManager reportLaporan = getReportManager();

		HttpServletResponse response = getResponse();
		String nmdownload = "filedownload-" + System.currentTimeMillis() + ".xlsx";

		response.reset();

		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "must-revalidate, no-transform");
		response.setDateHeader("Expires", 0L);

		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + nmdownload + "\"");

		//String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		//reportLaporan.setClasspathFolder(classpathFolderLocal);
		reportLaporan.showXLS(response.getOutputStream());
		response.flushBuffer();

	}
	
	@Override
	public void downloadSimpleXLSX() throws Exception {

		ReportManager reportLaporan = getReportManager();

		HttpServletResponse response = getResponse();
		String nmdownload = "filedownload-" + System.currentTimeMillis() + ".xlsx";

		response.reset();

		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "must-revalidate, no-transform");
		response.setDateHeader("Expires", 0L);

		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + nmdownload + "\"");

		//String classpathFolderLocal = classpath + getFolderClasspath().replaceAll("classpath:/", "");
		//reportLaporan.setClasspathFolder(classpathFolderLocal);
		reportLaporan.showXLSX(response.getOutputStream());
		response.flushBuffer();

	}
}
