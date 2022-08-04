package com.jasamedika.syamsu.laporan;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Properties;

import com.jasamedika.syamsu.laporan.helper.CommonUtil;

public class Registry {
	
	public static void readProperties() {
		Properties props = System.getProperties();
		String file = props.getProperty("spring.config.location");
		System.out.println("==============================================");
		System.out.println("===== SMART LAPORAN ==========================");
		System.out.println("==============================================");
		System.out.println();

		System.out.println(">>> Baca konfigurasi dari  file " +  file);
		
		try {
			Properties prop = new Properties();
			prop.load(new BufferedReader(new FileReader(file)));
			
			boolean exit = false;
			
			if (CommonUtil.isNullOrEmpty(prop.getProperty("info.upload-foto"))) {
				System.out.println(">>> info.upload-foto null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("info.upload-report"))) {
				System.out.println(">>> iinfo.upload-report null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("server.port"))) {
				System.out.println(">>> server.port null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("server.address"))) {
				System.out.println(">>> server.address null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("spring.datasource.driverClassName"))) {
				System.out.println(">>> spring.datasource.driverClassName null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("spring.datasource.url"))) {
				System.out.println(">>> spring.datasource.url null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("spring.datasource.username"))) {
				System.out.println(">>> spring.datasource.username null");
				exit = true;
			}
			if (CommonUtil.isNullOrEmpty(prop.getProperty("spring.datasource.password"))) {
				System.out.println(">>> spring.datasource.password null");
				exit = true;
			}
			
			if (exit) {
				System.exit(-1);
			}
			
			locationPhoto = prop.getProperty("info.upload-foto");
			//locationPhotoPegawai = prop.getProperty("info.upload-foto-pegawai");
			reportFile = prop.getProperty("info.upload-report");
			port = Integer.parseInt(prop.getProperty("server.port"));
			address = prop.getProperty("server.address");
			
			driverClassName = prop.getProperty("spring.datasource.driverClassName");
			urlJdbc = prop.getProperty("spring.datasource.url");
			username = prop.getProperty("spring.datasource.username");
			password = prop.getProperty("spring.datasource.password");
			
			System.out.println(">>> info.upload-foto=" + locationPhoto);
			System.out.println(">>> info.upload-report=" + reportFile);
			System.out.println(">>> server.port=" + port);
			System.out.println(">>> server.address=" + address);
			System.out.println(">>> spring.datasource.driverClassName=" + driverClassName);
			System.out.println(">>> spring.datasource.url=" + urlJdbc);
			System.out.println(">>> spring.datasource.username=" + username);
			System.out.println(">>> spring.datasource.password=" + password);
			
		}catch(Exception e) {
			System.out.println(">>> File tidak ditemukan atau ada kesalahan pada isi file.");
			System.exit(-1);
		}	
	}

	public static Integer port = 3223;
	public static String address = "0.0.0.0";
	
	public static String locationPhoto = "./upload-dir";
	public static String locationPhotoPegawai = "./upload-dir/pegawai";
	public static String locationLocal = "D:/upload-dir";
	public static String reportFile = "./report";
	public static String urlJdbc;
	public static String password;
	public static String driverClassName;
	public static String username;
	
}
