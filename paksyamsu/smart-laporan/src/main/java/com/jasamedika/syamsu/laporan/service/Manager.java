package com.jasamedika.syamsu.laporan.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

import com.jasamedika.syamsu.laporan.Registry;

public class Manager extends AbstractReportManager {
	
	private Connection con;
	
//	@SuppressWarnings("rawtypes")
//	@Override
//    protected Map fillParam(Map param) {
//        return param;
//    }
	
	private void initConnection(String driverClassName, String urlJdbc, String username, String password) throws Exception {
		if (this.con == null || this.con.isClosed()) {
			Class.forName(driverClassName);
			Properties props = new Properties();
			props.setProperty("user", username);
			props.setProperty("password", password);
			this.con = DriverManager.getConnection(urlJdbc, props);
		}
	}
	
    @Override
    public Connection getConnection() {
        try {
        	initConnection(Registry.driverClassName, Registry.urlJdbc, Registry.username, Registry.password);
            return this.con;
        } catch (Exception e) {
        	System.out.println(">>> Kesalahan koneksi ke database, penyebab " + e.getMessage());
            return null;
        }

    }

	@Override
	public void closeConnection() {
		try {
			this.con.close();
		} catch (Exception e) {
		}
	}
}
