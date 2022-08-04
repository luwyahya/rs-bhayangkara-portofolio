package com.jasamedika.syamsu.laporan.controller;

import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import org.joda.time.LocalDate;

import com.jasamedika.syamsu.laporan.dto.GenericCustomReportDto;
import com.jasamedika.syamsu.laporan.helper.CommonUtil;

import io.javalin.Javalin;

public abstract class AbstractGenericController {
	
	protected static final String XLSX_FORMAT_VALUE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
	protected static final String XLS_FORMAT_VALUE = "application/vnd.ms-excel;charset=utf-8";
	protected static final String PDF_FORMAT_VALUE = "application/pdf;charset=utf-8";
	
	protected static final String PDF = ".pdf";
	protected static final String XLS = ".xls";
	protected static final String XLSX = ".xlsx";
	
	protected Javalin app;
	protected String pathHeader;
	
	public AbstractGenericController(String pathHeader, Javalin app) {
		this.app = app;
		this.pathHeader = pathHeader;
	}
	
	public void setPDFController() {
		app.post(pathHeader + "/report/{namajrxml}.pdf", ctx -> {	
			String namajrxml = ctx.pathParam("namajrxml");
			GenericCustomReportDto dto = ctx.bodyAsClass(GenericCustomReportDto.class);
			
			if (dto.getDownload() != null && dto.getDownload()) {
				ctx.res.setHeader("Content-Disposition", "attachment; filename=\""+ namaFile(namajrxml, PDF, dto)+"\"");
			}
			
			ctx.res.setContentType(PDF_FORMAT_VALUE);
			setHeader(ctx.res);
			
			byte[] data = generate(namajrxml, dto, 1);
			
			ctx.result(data);
			
		});
	}
	
	public void setXLSController() {
		app.post(pathHeader + "/report/{namajrxml}.xls", ctx -> {	
			String namajrxml = ctx.pathParam("namajrxml");
			GenericCustomReportDto dto = ctx.bodyAsClass(GenericCustomReportDto.class);
			
			if (dto.getDownload() != null && dto.getDownload()) {
				ctx.res.setHeader("Content-Disposition", "attachment; filename=\""+ namaFile(namajrxml, XLS, dto)+"\"");
			}
			
			ctx.res.setContentType(XLS_FORMAT_VALUE);
			setHeader(ctx.res);
			
			byte[] data = generate(namajrxml, dto, 2);
			
			ctx.result(data);
			
		});
	}
	
	public void setXLSXController() {
		app.post(pathHeader + "/report/{namajrxml}.xlsx", ctx -> {	
			String namajrxml = ctx.pathParam("namajrxml");
			GenericCustomReportDto dto = ctx.bodyAsClass(GenericCustomReportDto.class);
			
			if (dto.getDownload() != null && dto.getDownload()) {
				ctx.res.setHeader("Content-Disposition", "attachment; filename=\""+ namaFile(namajrxml, XLSX, dto)+"\"");
			}
			
			ctx.res.setContentType(XLSX_FORMAT_VALUE);
			setHeader(ctx.res);
			
			byte[] data = generate(namajrxml, dto, 3);
			
			ctx.result(data);
			
		});
	}
	
	////////////////////////////
	
	private byte[] generate(String namajrxml, GenericCustomReportDto dto, int type) throws Exception {
		return generate(namajrxml, dto, type, true);
	}
	
	
	private void setHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", new Date().toString());
	}
	
	private String namaFile(String namajrxml, String extFile, GenericCustomReportDto dto) {
		String dd =  LocalDate.now().toString("dd-MM-YYYY");
		
		String namafile = namajrxml + "-" + dd + XLS;
		
		if (CommonUtil.isNotNullOrEmpty(dto.getNamaFile())) {
			
			namafile = dto.getNamaFile() + "-" + dd;
				
			if (CommonUtil.isNotNullOrEmpty(dto.getExtFile())) {
				if (dto.getExtFile().contains(".")) {
					namafile += dto.getExtFile();					
				} else {
					namafile += "." + dto.getExtFile();					
				}
			} else {
				namafile += extFile;
			}
		}
		
		return namafile;
	}

	protected abstract byte[] generate(String namajrxml, GenericCustomReportDto dto, int type, boolean excelOneSheet) throws Exception;
}
