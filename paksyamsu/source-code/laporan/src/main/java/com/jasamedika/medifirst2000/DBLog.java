package com.jasamedika.medifirst2000;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.zaxxer.hikari.HikariDataSource;

@Component
public class DBLog implements ApplicationListener<ApplicationReadyEvent> {
	
	@Autowired
	DataSource ds;
	
	final Logger logger = LoggerFactory.getLogger(DBLog.class);

	@Override
	public void onApplicationEvent(final ApplicationReadyEvent event) {
		logDS();
	}
	
	@Value("${server.port}")
	String serverPort;

	void logDS() {
		if (ds != null && ds instanceof HikariDataSource) {
			HikariDataSource hs = ((HikariDataSource) ds);
			logger.warn("spring.datasource.poolName = " + hs.getPoolName());
			logger.warn("spring.datasource.isAutoCommit = " + hs.isAutoCommit());
			logger.warn("spring.datasource.connectionTestQuery = " + hs.getConnectionTestQuery());
			logger.warn("spring.datasource.maximumPoolSize = " + hs.getMaximumPoolSize());
			logger.warn("spring.datasource.minimumIdle = " + hs.getMinimumIdle());
			logger.warn("spring.datasource.maxLifetime = " + hs.getMaxLifetime());
			logger.warn("spring.datasource.connectionTimeout = " + hs.getConnectionTimeout());
			logger.warn("spring.datasource.idleTimeout = " + hs.getIdleTimeout());
			logger.warn("spring.datasource.validationTimeout = " + hs.getValidationTimeout());
			logger.warn("spring.datasource.leakDetectionThreshold = " + hs.getLeakDetectionThreshold());

			try {
				String url =  ds.getConnection().getMetaData().getURL();			
				logger.warn("spring.database.host = " + url.substring(url.indexOf('/'),  url.lastIndexOf('/')).replace("/", ""));
				logger.warn("spring.database.name = " + url.substring(url.lastIndexOf("/") + 1));
			}catch(Exception e) {
				
			}
		} else {
			logger.warn("Gawatt bukan hikari euy..");
		}
		
		logger.warn("undertow.server.port = " + serverPort);
		logger.warn("Spring Boot Started");
	}
}