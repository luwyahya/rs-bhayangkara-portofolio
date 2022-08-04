package com.jasamedika.syamsu.laporan.service;

import java.awt.Image;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.imageio.ImageIO;

import com.jasamedika.syamsu.laporan.Registry;
import com.jasamedika.syamsu.laporan.helper.CommonUtil;

import lombok.Getter;
import lombok.Setter;
import net.sf.jasperreports.engine.JRParameter;

@Getter
@Setter
public class GenericReportService {
	
	private AbstractReportManager reportManager;
	
	public GenericReportService() {
		reportManager = new Manager();
	}
	
	private String gambarLogo;	
	private String jRXMLFileName;
	private Map<String, Object> m;
	
	private boolean outProfile = false;	
	private Integer kdProfile;

	private boolean outDepartemen = false;	
	private String kdDepartemen;
	
	@SuppressWarnings("rawtypes")
	public Map getParameterAndValue() {
		
		Locale locale = new Locale( "in", "ID" );
		m.put(JRParameter.REPORT_LOCALE, locale );
		m.put("gambarLogo","");
		try {
			m.put("gambarLogo", getImage(getGambarLogo()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return m;
	}
	
	public void setValue(String[] key, Object[] val) {
		m = CommonUtil.createMap();		
		if (key != null && val != null) {
			if (key.length != val.length) {
				throw new RuntimeException("Panjang Parameter dan Value tidak sama");				
			}
			for (int i=0; i<key.length; i++) {
				m.put(key[i], val[i]);
			}
		}
	}
	
	public void setValue(String[] key, Object[] val, String[] tipe) {
		m = CommonUtil.createMap();		
		if (key != null && val != null) {
			if (key.length != val.length) {
				throw new RuntimeException("Jumlah Parameter dan Value tidak sama");				
			}
			for (int i=0; i<key.length; i++) {
				if (CommonUtil.isNullOrEmpty(tipe[i])) {
					m.put(key[i], val[i]);
				} else {
					if ("date".equals(tipe[i])) {
						try {
							m.put(key[i], new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse((String) val[i]));
						}catch(Exception e) {
							throw new RuntimeException(e);
						}
					} 
				}				
			}
		}
	}
	
	public void setImageValue(String[] key, String[] val) {
		if (key != null && val != null && key.length == val.length) {
			if (key.length != val.length) {
				throw new RuntimeException("Jumlah Parameter Img dan Value Img tidak sama");				
			}
			for (int i=0; i<key.length; i++) {
				m.put(key[i], getImage(val[i]));
			}
		}
	}
	
	public Image getImage(String namafile) {
		
		if (namafile == null || "null".equals(namafile.trim()) || "".equals(namafile.trim())) {
			System.out.println(">>> namaFile null, ganti ke noimage.jpg");
			namafile = "noimage.jpg";
		}
		
		String curLoc = Registry.locationPhoto;
		File loc = new File(curLoc);
		if (!loc.exists()) {
			curLoc = Registry.locationLocal;
		} 
		
		loc = new File(curLoc);
		if (!loc.exists()) {
			curLoc = "D:/upload-dir"; // Folder Syamsu
		}
		
		String pathFile = curLoc + "/" + namafile;
		
		File file = new File(pathFile);
		
		if (!file.exists()) {
			System.out.println("File gambar " + namafile + " di URL " + pathFile + " tidak ditemukan.");
			return null;
		}
						
		try {
			return ImageIO.read(file);
		}catch(Exception e) {
			System.out.println("File gambar " + namafile + " tidak bisa dibaca, pastikan itu adalah file gambar.");
		}	
		
		return null;
	}
		
	@SuppressWarnings("rawtypes")
	public String getFastReporter(List<Map<String,?>> dataMap) throws Exception {
		
		Map param = getParameterAndValue();
		String folder = new File(Registry.reportFile).getAbsolutePath() + File.separator; 
		String fileJasper = folder + getJRXMLFileName();
		File file = new File(fileJasper);
		if (!file.exists()) {
			System.out.println(">>> File " + fileJasper + " tidak ditemukan");
			return "";
		}
		reportManager.compileReport(new BufferedInputStream(new FileInputStream(fileJasper)));						
		reportManager.generateReport(param, dataMap);
		
		return "Selesai";
	}
	
	@SuppressWarnings("rawtypes")
	public String getFastReporter() throws Exception {
		
		Map param = getParameterAndValue();
		String folder = new File(Registry.reportFile).getAbsolutePath() + File.separator; 
		String fileJasper = folder + getJRXMLFileName();
		File file = new File(fileJasper);
		if (!file.exists()) {
			System.out.println(">>> File " + fileJasper + " tidak ditemukan");
			return "";
		}
		reportManager.compileReport(new BufferedInputStream(new FileInputStream(fileJasper)));						
		reportManager.generateReport(param);
		
		return "Selesai";
	}
}
