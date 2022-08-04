package com.jasamedika.medifirst2000.report.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller; import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jasamedika.medifirst2000.report.dto.GenericReportDto;
import com.jasamedika.medifirst2000.report.service.GenericReportService;
import com.jasamedika.medifirst2000.util.CommonUtil;
import com.jasamedika.medifirst2000.util.DateUtil;

import io.swagger.annotations.ApiOperation;

import com.jasamedika.medifirst2000.util.StringUtil;

@Controller @Lazy
@RequestMapping("/generic")
public class GenericReportController {

	public static final String XLSX_FORMAT_VALUE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	public static final String XLS_FORMAT_VALUE = "application/vnd.ms-excel";
	
	private static final String PDF = ".pdf";
	private static final String XLS = ".xls";
	private static final String XLSX = ".xlsx";
	
	@Autowired @Lazy 	GenericReportService genericReportService;
	
	@ApiOperation(value = "Api Untuk Generic Report", produces = MediaType.APPLICATION_PDF_VALUE, response = File.class)
	@PostMapping(value = "/report/{namajrxml}"+PDF, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_PDF_VALUE)
	@ResponseBody
	public byte[] generatePDF(@PathVariable("namajrxml") String namajrxml, 
			@RequestBody @Valid GenericReportDto dto, 
			HttpServletResponse response) {
		try {

			response.setContentType(MediaType.APPLICATION_PDF_VALUE);
			if (dto.getDownload() != null && dto.getDownload()) {
				response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="+ namaFile(namajrxml, PDF, dto));
			}
			
			return generate(namajrxml, dto, 1);
			
		} catch (Exception e) {
			e.printStackTrace();
			StringUtil.showFive(e);
			throw new RuntimeException("Report gagal dibuat karena " + e.getMessage());
		}
	}
	
	@ApiOperation(value = "Api Untuk Generic Report", produces = XLS_FORMAT_VALUE, response = File.class)
	@PostMapping(value = "/report/{namajrxml}"+XLS, consumes = MediaType.APPLICATION_JSON_VALUE, produces = XLS_FORMAT_VALUE)
	@ResponseBody
	public byte[] generateXLS(@PathVariable("namajrxml") String namajrxml, 
			@RequestBody @Valid GenericReportDto dto, 
			HttpServletResponse response) {
		try {
			
			response.setContentType(XLS_FORMAT_VALUE);
			if (dto.getDownload() != null && dto.getDownload()) {
				response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + namaFile(namajrxml, XLS, dto));
			}
			
			Boolean oneSheet = CommonUtil.isNotNullOrEmpty(dto.getExcelOneSheet())?dto.getExcelOneSheet():true;
			
			return generate(namajrxml, dto, 2, oneSheet);

		} catch (Exception e) {
			e.printStackTrace();
			StringUtil.showFive(e);
			throw new RuntimeException("Report gagal dibuat karena " + e.getMessage());
		}
	}
	
	
	
	@ApiOperation(value = "Api Untuk Generic Report", produces = XLS_FORMAT_VALUE, response = File.class)
	@PostMapping(value = "/report/{namajrxml}"+XLSX, consumes = MediaType.APPLICATION_JSON_VALUE, produces = XLSX_FORMAT_VALUE)
	@ResponseBody
	public byte[] generateXLSX(@PathVariable("namajrxml") String namajrxml, 
			@RequestBody @Valid GenericReportDto dto, 
			HttpServletResponse response) {
		try {
			
			response.setContentType(XLSX_FORMAT_VALUE);
			if (dto.getDownload() != null && dto.getDownload()) {
				response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + namaFile(namajrxml, XLSX, dto));
			}
			
			Boolean oneSheet = CommonUtil.isNotNullOrEmpty(dto.getExcelOneSheet())?dto.getExcelOneSheet():true;
			
			return generate(namajrxml, dto, 3, oneSheet);

		} catch (Exception e) {
			e.printStackTrace();
			StringUtil.showFive(e);
			throw new RuntimeException("Report gagal dibuat karena " + e.getMessage());
		}
	}
	
	private String namaFile(String namajrxml, String extFile, GenericReportDto dto) {
		Date dd = DateUtil.getSimpleShortDate(DateUtil.TZ);
		
		String namafile = namajrxml + "-" + dd + XLS;
		
		if (CommonUtil.isNotNullOrEmpty(dto.getNamaFile())) {
			
			namafile = dto.getNamaFile() + "-" + dd;
				
			if (CommonUtil.isNotNullOrEmpty(dto.getExtFile())) {
				namafile += dto.getExtFile();
			} else {
				namafile += extFile;
			}
		}
		
		return namafile;
	}
	
	private byte[] generate(String namajrxml, GenericReportDto dto, int type) throws Exception {
		return generate(namajrxml, dto, type, true);
	}
	
	private byte[] generate(String namajrxml, GenericReportDto dto, int type, boolean excelOneSheet) throws Exception {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		
//		genericReportService.setKdProfile(dto.getKdProfile());
//		genericReportService.setKdDepartemen(dto.getKdDepartemen());
//		genericReportService.setKdPegawai(dto.getKdPegawai());
		genericReportService.setGambarLogo(dto.getGambarLogo());
		
		genericReportService.setValue(dto.getParamKey(), dto.getParamValue(), dto.getParamType());
		genericReportService.setImageValue(dto.getParamImgKey(), dto.getParamImgValue());

		genericReportService.setJRXMLFileName(namajrxml+".jrxml");
		
		BufferedOutputStream bos = new BufferedOutputStream(baos);
		genericReportService.getFastReporter();
		switch(type) {
			case 1:
				genericReportService.getReportManager().showPDF(bos);
				break;
			case 2:
				genericReportService.getReportManager().showXLS(bos, new boolean[]{excelOneSheet, false, false});
				break;
			case 3:
				genericReportService.getReportManager().showXLSX(bos, new boolean[]{excelOneSheet, false, false});					
				break;
			default:
				genericReportService.getReportManager().showPDF(bos);
				break;
		}
		bos.flush();		
		return baos.toByteArray();
	}
}
