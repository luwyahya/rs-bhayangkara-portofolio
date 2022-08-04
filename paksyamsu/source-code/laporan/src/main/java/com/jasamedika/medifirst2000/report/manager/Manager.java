package com.jasamedika.medifirst2000.report.manager;

import java.sql.Connection;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jasamedika.medifirst2000.report.base.AbstractReportManager;

import net.sf.jasperreports.engine.JRException;

@SuppressWarnings("rawtypes")
@Component
public class Manager extends AbstractReportManager<JRException>{
	@Autowired
    private DataSource ds;
	
	@PersistenceContext
	EntityManager em;

	@Override
    protected Map fillParam(Map param) {
        return param;
    }

    @Override
    public Connection getConnection() {
        try {
            return ds.getConnection();
        } catch (Exception e) {
            return null;
        }

    }
    
    @Override
    public EntityManager getEntityManager() {
        return em;
    }

	@Override
	public DataSource getDataSource() {
		return ds;
	}
}
