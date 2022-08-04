package com.jasamedika.medifirst2000;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariDataSource;
/**
*
* @author Syamsu Rizal Ali <syamsu.rizal@jasamedika.co.id>
*/
@EnableTransactionManagement
public class DbConfig {

	final Logger logger = LoggerFactory.getLogger(DbConfig.class);

	static DataSource ds;

	@Bean
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSource dataSource() {
		if (ds == null) {
			ds = DataSourceBuilder.create().build();
			Runtime.getRuntime().addShutdownHook(new Thread() {
				@Override
				public void run() {
					if (ds instanceof HikariDataSource) {
						((HikariDataSource) ds).close();
					}
				}
			});
		}

		return ds;
	}
}