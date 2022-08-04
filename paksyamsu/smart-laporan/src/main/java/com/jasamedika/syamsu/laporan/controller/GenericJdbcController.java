package com.jasamedika.syamsu.laporan.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;

import com.jasamedika.syamsu.laporan.dto.GenericCustomReportDto;
import com.jasamedika.syamsu.laporan.service.GenericReportService;

import io.javalin.Javalin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenericJdbcController extends AbstractGenericController {

	public GenericJdbcController(String pathHeader, Javalin app) {
		super(pathHeader, app);
	}

	@Override
	protected byte[] generate(String namajrxml, GenericCustomReportDto dto, int type, boolean excelOneSheet) throws Exception {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		GenericReportService genericReportService = new GenericReportService();
		
		if ((dto.getOutProfile() != null && dto.getOutProfile())) {
			genericReportService.setOutProfile(dto.getOutProfile());
			genericReportService.setKdProfile(dto.getKdProfile());
		}

		if ((dto.getOutDepartemen() != null && dto.getOutDepartemen())) {
			genericReportService.setOutDepartemen(dto.getOutDepartemen());
			genericReportService.setKdDepartemen(dto.getKdDepartemen());
		}
		
		genericReportService.setGambarLogo(dto.getGambarLogo());
		genericReportService.setValue(dto.getParamKey(), dto.getParamValue());
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
