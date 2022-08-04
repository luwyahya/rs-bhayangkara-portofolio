package com.jasamedika.syamsu.laporan.helper;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

public class CommonUtil {
	
	public static Boolean isNotNullOrEmpty(Object object) {
		return !isNullOrEmpty(object);
	}
	
	@SuppressWarnings("rawtypes")
	public static Boolean isNullOrEmpty(Object object) {
		if (object == null) {
			return true;
		} else {
			if (object instanceof Collection) {
				return ((Collection) object).isEmpty();
			} else if (object instanceof Map) {
				return ((Map) object).isEmpty();
			} else if (object instanceof Iterator) {
				return !((Iterator) object).hasNext();
			} else {
				if ("".equals(object.toString().trim())) {
					return true;
				}
			}
			return false;
		}
	}

	public static <K,V> Map<K,V> createMap(){
		return new HashMap<K,V>();
	}
	
	public static Connection initConnection(String driverClassName, String urlJdbc, String username, String password) throws Exception {
		Class.forName(driverClassName);
		Properties props = new Properties();
		props.setProperty("user", username);
		props.setProperty("password", password);
		Connection conn = DriverManager.getConnection(urlJdbc, props);
		return conn;
	}

}
