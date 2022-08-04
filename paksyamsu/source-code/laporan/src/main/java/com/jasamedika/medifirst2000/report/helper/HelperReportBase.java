package com.jasamedika.medifirst2000.report.helper;

import java.awt.Image;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Map;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;

import com.jasamedika.medifirst2000.report.base.ReportBase;
import com.jasamedika.medifirst2000.util.CommonUtil;

import lombok.Getter;
import lombok.Setter;

/**
*
* @author Syamsu Rizal Ali <syamsu.rizal@jasamedika.co.id>
*/

@Getter
@Setter
public abstract class HelperReportBase extends ReportBase {

	@Value("${info.resource:http://192.168.0.143:9191}")
	protected String urlAkses;
	
	@Value("${info.upload-foto}")
	protected String location = "D:/WORKSPACE/Framework/upload-dir";

	//@Value("${info.upload-foto-local}")
	protected String locationLocal = "D:/upload-dir";
	
		
	
	@Override
	public boolean isJpa() {
		return false;
	}
	
	protected Map<String, Object> m;
	
	public void setValue(String[] key, Object[] val, String[] tipe) {
		m = CommonUtil.createMap();		
		if (key != null && val != null) {
			if (key.length != val.length) {
				throw new RuntimeException("Panjang Parameter dan Value tidak sama");				
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
				throw new RuntimeException("Panjang Parameter Img dan Value Img tidak sama");				
			}
			for (int i=0; i<key.length; i++) {
				m.put(key[i], getImage(val[i]));
			}
		}
	}

	protected String gambarLogo;	
			
	public String getFolderClasspath() {
		return "classpath:/report/";
	}
	
	public Image getImage(String namafile) {
		
		if (namafile == null || "null".equals(namafile.trim()) || "".equals(namafile.trim())) {
			namafile = "noimage.jpg";
		}
		
		String curLoc = location;
		//agar bisa ditest langsung di local
		File loc = new File(curLoc);
		if (!loc.exists()) {
			curLoc = locationLocal;
		} 
		
		loc = new File(curLoc);
		if (!loc.exists()) {
			curLoc = "D:/upload-dir"; // Folder Syamsu
		}
		
		String pathFile = curLoc + "/" + namafile;
		
		File file = new File(pathFile);
		
		if (!file.exists()) {
			System.out.println("File gambar " + namafile + " di URL "+pathFile+" tidak ditemukan.");
			throw new RuntimeException("File " + pathFile+ " tidak ditemukan.");
		}
		
				
		try {
			return ImageIO.read(file);
		}catch(Exception e) {
			throw new RuntimeException("File gambar " + namafile + " tidak bisa dibaca, pastikan itu adalah file gambar.");
		}	
	}
	
	public Image getImageFromUrl(String urlfile) {
		
		File file = new File(urlfile);
		if (!file.exists()) {
			System.out.println("File gambar di URL "+urlfile+" tidak ditemukan.");
			throw new RuntimeException("File "+urlfile+" tidak ditemukan.");
		}
		
		try {
			return ImageIO.read(file);
		}catch(Exception e) {
			throw new RuntimeException("File gambar " + urlfile + " tidak bisa dibaca, pastikan itu adalah file gambar.");
		}	
	}
}
