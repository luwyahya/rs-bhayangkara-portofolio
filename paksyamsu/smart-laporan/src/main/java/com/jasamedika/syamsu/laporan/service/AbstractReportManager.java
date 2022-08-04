package com.jasamedika.syamsu.laporan.service;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.jasamedika.syamsu.laporan.Registry;

import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRPropertiesUtil;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.JasperReportsContext;
import net.sf.jasperreports.engine.SimpleJasperReportsContext;
import net.sf.jasperreports.engine.data.JRMapCollectionDataSource;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterConfiguration;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleHtmlReportConfiguration;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import net.sf.jasperreports.export.SimplePdfReportConfiguration;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;
import net.sf.jasperreports.repo.FileRepositoryPersistenceServiceFactory;
import net.sf.jasperreports.repo.FileRepositoryService;
import net.sf.jasperreports.repo.PersistenceServiceFactory;
import net.sf.jasperreports.repo.RepositoryService;

public abstract class AbstractReportManager {

	private int max = 0;

    protected JasperPrint jasperPrint;
    protected boolean init = false;
    protected Integer index = 0;
    protected StringBuffer outBuffer;
    protected SimpleHtmlExporterOutput exporterOutput;
    protected HtmlExporter jrHtmlExporter;
    protected SimpleHtmlReportConfiguration htmlReportConfig;
    protected JasperReport jasperReport;

    protected SimpleExporterInput exporterInput;
    protected SimpleHtmlExporterConfiguration htmlConfiguration;
    
//    protected String classpathFolder;

    protected void setMaxPages(int max) {
        this.max = max;
    }

    public boolean isInit() {
        return init;
    }

    public void reset() {
        init = false;
    }

    public void firstPage() {
        index = 0;
    }

    public void lastPage() {
        index = max;
    }

    public void nextPage() {
        if (index < max) {
            index++;
        }
    }

    public void prevPage() {
        if (index > 0) {
            index--;
        }
    }

//    @SuppressWarnings("rawtypes")
//    protected abstract Map fillParam(Map param);
    
//    public abstract void setConnection(Connection con);
    
	public abstract Connection getConnection();
	
	public abstract void closeConnection();
      
//    public void setClasspathFolder(String classpathFolder) {
//    	this.classpathFolder = classpathFolder;
//    }
    
    private JasperReportsContext getContext() {
    	SimpleJasperReportsContext context = new SimpleJasperReportsContext(DefaultJasperReportsContext.getInstance());
    	String folder = new File(Registry.reportFile).getAbsolutePath() + File.separator; 
        FileRepositoryService fileRepository = new FileRepositoryService(context, folder, true);
        context.setExtensions(RepositoryService.class, Collections.singletonList(fileRepository));
        context.setExtensions(PersistenceServiceFactory.class, Collections.singletonList(FileRepositoryPersistenceServiceFactory.getInstance()));
        
        JRPropertiesUtil.getInstance(context).setProperty("net.sf.jasperreports.xpath.executer.factory", "net.sf.jasperreports.engine.util.xml.JaxenXPathExecuterFactory");
        
        return context;
    }

    public void compileReport(InputStream xmljasper) throws JRException {
        jasperReport = JasperCompileManager.getInstance(getContext()).compile(xmljasper);
    }
        
    private void createReport() {
        jrHtmlExporter = new HtmlExporter();
        exporterInput = new SimpleExporterInput(jasperPrint);
        htmlConfiguration = new SimpleHtmlExporterConfiguration();
        htmlReportConfig = new SimpleHtmlReportConfiguration();

        htmlConfiguration.setHtmlHeader("");
        htmlConfiguration.setHtmlFooter("");
        htmlConfiguration.setBetweenPagesHtml("");

        htmlConfiguration.setFlushOutput(Boolean.TRUE);
        jrHtmlExporter.setConfiguration(htmlConfiguration);
        jrHtmlExporter.setExporterInput(exporterInput);
        jrHtmlExporter.setConfiguration(htmlReportConfig);

        setMaxPages(jasperPrint.getPages().size() - 1);
    }

	@SuppressWarnings({ "unchecked", "rawtypes" })
    public void generateReport(Map param) throws JRException {
        //Map parameterMap = fillParam(param);
		Connection con = getConnection();
        jasperPrint = JasperFillManager.getInstance(getContext()).fill(jasperReport, param, con);        
        createReport();
        closeConnection();
    }
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
    public void generateReport(Map param, List<Map<String,?>> data) throws JRException {
		//Map parameterMap = fillParam(param);

        JRDataSource dataSource = new JRMapCollectionDataSource(data);
        jasperPrint = JasperFillManager.getInstance(getContext()).fill(jasperReport, param, dataSource);
        createReport();
    }
	
    
    public String showReport() throws JRException {
        outBuffer = new StringBuffer();
        exporterOutput = new SimpleHtmlExporterOutput(outBuffer);
        jrHtmlExporter.setExporterOutput(exporterOutput);
        htmlReportConfig.setPageIndex(index);
        jrHtmlExporter.exportReport();
        init = true;
        return outBuffer.toString();
    }

    
    public void showXLS(OutputStream out) throws JRException {
        showXLS(out, new boolean[]{true, true, true});
    }

    
    public void showXLS(OutputStream out, boolean[] options) throws JRException {
        JRXlsExporter exporterXLS = new JRXlsExporter();
        SimpleXlsReportConfiguration xlsReportConf = new SimpleXlsReportConfiguration();
        xlsReportConf.setOnePagePerSheet(options[0]);
        xlsReportConf.setShowGridLines(options[1]);
        if (options[2]) {
        	xlsReportConf.setPageIndex(index);
        }
//      exporterXLS.setConfiguration(new SimpleXlsReportConfiguration());
        exporterXLS.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporterXLS.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        exporterXLS.setConfiguration(xlsReportConf);
        exporterXLS.exportReport();
    }

    
    public void showPDF(OutputStream out) throws JRException {
        showPDF(out, new boolean[]{false, true, false});
    }

    
    public void showPDF(OutputStream out, boolean[] options) throws JRException {
        JRPdfExporter exporterPDF = new JRPdfExporter();
        SimplePdfReportConfiguration pdfReportConf = new SimplePdfReportConfiguration();
        pdfReportConf.setSizePageToContent(options[0]);
        pdfReportConf.setForceSvgShapes(options[1]);
        if (options[2]) {
            pdfReportConf.setPageIndex(index);
        }

        SimplePdfExporterConfiguration pdfExporterconf = new SimplePdfExporterConfiguration();
        pdfExporterconf.setCompressed(true);

        exporterPDF.setConfiguration(pdfReportConf);
        exporterPDF.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporterPDF.setConfiguration(pdfExporterconf);
        exporterPDF.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        exporterPDF.exportReport();
    }
   
    public void showXLSX(OutputStream out) throws JRException {
        showXLS(out, new boolean[]{true, true, false});
    }

    public void showXLSX(OutputStream out, boolean[] options) throws JRException {
        JRXlsxExporter exporterXLSX = new JRXlsxExporter();
        SimpleXlsxReportConfiguration xlsxReportConf = new SimpleXlsxReportConfiguration();
        xlsxReportConf.setOnePagePerSheet(options[0]);
        xlsxReportConf.setRemoveEmptySpaceBetweenRows(true);
        xlsxReportConf.setShowGridLines(options[1]);
        if (options[2]) {
            xlsxReportConf.setPageIndex(index);
        }
//      exporterXLSX.setConfiguration(new SimpleXlsxExporterConfiguration());
        exporterXLSX.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporterXLSX.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        exporterXLSX.setConfiguration(xlsxReportConf);
        exporterXLSX.exportReport();
    }
}
