package com.jasamedika.medifirst2000.report.base;

import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.sql.DataSource;

// import ar.com.fdvs.dj.domain.DynamicReport;

/**
*
* @author Syamsu
*/
public interface ReportManager<E extends Exception> {
	
	public void setClasspathFolder(String classpathFolder);
	
	public EntityManager getEntityManager();
	
	public Connection getConnection();
	
	public DataSource getDataSource();

    public boolean isInit();

    public void reset();

    public void compileReport(InputStream xmljasper) throws E;
    
    
//    @SuppressWarnings("rawtypes")
//	public void compileReport(DynamicReport dynamicReport, Map param) throws E;

	public void generateReport(@SuppressWarnings("rawtypes") Map param) throws E;
    
	public void generateReport(@SuppressWarnings("rawtypes") Map param, List<Map<String,?>> data) throws E;

    public String showReport() throws E;

    public void firstPage();

    public void lastPage();

    public void nextPage();

    public void prevPage();
//    public InputStream getXLS() throws E;
//    public InputStream getXLS(boolean[] options) throws E;
//    public InputStream getPDF() throws E;
//    public InputStream getPDF(boolean[] options) throws E;

    public void showXLS(OutputStream out) throws E;

    public void showXLS(OutputStream out, boolean[] options) throws E;

    public void showXLSX(OutputStream out) throws E;

    public void showXLSX(OutputStream out, boolean[] options) throws E;

    public void showPDF(OutputStream out) throws E;

    public void showPDF(OutputStream out, boolean[] options) throws E;
}
