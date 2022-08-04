package com.jasamedika.medifirst2000.report.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.jasamedika.medifirst2000.report.dto.GenericCustomReportDto;
import com.jasamedika.medifirst2000.report.service.GenericReportService;
import com.jasamedika.medifirst2000.util.CommonUtil;
import com.jasamedika.medifirst2000.util.StringUtil;

import io.swagger.annotations.ApiOperation;

@Controller @Lazy
@RequestMapping("/generic-custom")
public class GenericCustomReportController {

	public static final String XLSX_FORMAT_VALUE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	public static final String XLS_FORMAT_VALUE = "application/vnd.ms-excel";
	
	private static final String PDF = ".pdf";
	private static final String XLS = ".xls";
	private static final String XLSX = ".xlsx";
	
	@Autowired @Lazy 	GenericReportService genericReportService;
	
	private void setHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		//response.setHeader("Cache-Control", "post-check=0, pre-check=0");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", new Date().toString());
	}
	
	@ApiOperation(value = "Api Untuk Generic Custom Report", produces = MediaType.APPLICATION_PDF_VALUE, response = File.class)
	@PostMapping(value = "/report/{namajrxml}"+PDF, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_PDF_VALUE)
	@ResponseBody
	public byte[] generatePDF(@PathVariable("namajrxml") String namajrxml, 
			@RequestBody @Valid GenericCustomReportDto dto, 
			HttpServletResponse response) {
		try {

			response.setContentType(MediaType.APPLICATION_PDF_VALUE);
			if (dto.getDownload() != null && dto.getDownload()) {
				response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+ namaFile(namajrxml, PDF, dto)+"\"");
			}
			
			setHeader(response);
			
			return generate(namajrxml, dto, 1);
			
		} catch (Exception e) {
			e.printStackTrace();
			StringUtil.showFive(e);
			throw new RuntimeException("Report gagal dibuat karena " + e.getMessage());
		}
	}
	
	@ApiOperation(value = "Api Untuk Generic Custom Report", produces = XLS_FORMAT_VALUE, response = File.class)
	@PostMapping(value = "/report/{namajrxml}"+XLS, consumes = MediaType.APPLICATION_JSON_VALUE, produces = XLS_FORMAT_VALUE)
	@ResponseBody
	public byte[] generateXLS(@PathVariable("namajrxml") String namajrxml, 
			@RequestBody @Valid GenericCustomReportDto dto, 
			HttpServletResponse response) {
		try {
			
			response.setContentType(XLS_FORMAT_VALUE);
			if (dto.getDownload() != null && dto.getDownload()) {
				response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + namaFile(namajrxml, XLS, dto)+"\"");
			}
			
			setHeader(response);
			
			Boolean oneSheet = CommonUtil.isNotNullOrEmpty(dto.getExcelOneSheet())?dto.getExcelOneSheet():true;
			
			return generate(namajrxml, dto, 2, oneSheet);

		} catch (Exception e) {
			e.printStackTrace();
			StringUtil.showFive(e);
			throw new RuntimeException("Report gagal dibuat karena " + e.getMessage());
		}
	}
	
	
	
	@ApiOperation(value = "Api Untuk Generic Custom Report", produces = XLS_FORMAT_VALUE, response = File.class)
	@PostMapping(value = "/report/{namajrxml}"+XLSX, consumes = MediaType.APPLICATION_JSON_VALUE, produces = XLSX_FORMAT_VALUE)
	@ResponseBody
	public byte[] generateXLSX(@PathVariable("namajrxml") String namajrxml, 
			@RequestBody @Valid GenericCustomReportDto dto, 
			HttpServletResponse response) {
		try {
			
			response.setContentType(XLSX_FORMAT_VALUE);
			if (dto.getDownload() != null && dto.getDownload()) {
				response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + namaFile(namajrxml, XLSX, dto)+"\"");
			}
			
			setHeader(response);
			
			Boolean oneSheet = CommonUtil.isNotNullOrEmpty(dto.getExcelOneSheet())?dto.getExcelOneSheet():true;
			
			return generate(namajrxml, dto, 3, oneSheet);

		} catch (Exception e) {
			e.printStackTrace();
			StringUtil.showFive(e);
			throw new RuntimeException("Report gagal dibuat karena " + e.getMessage());
		}
	}
	
	private String namaFile(String namajrxml, String extFile, GenericCustomReportDto dto) {
		//Date dd = DateUtil.getSimpleShortDate(DateUtil.TZ);
		//LocalDate ld = LocalDate.now();
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
	
	private byte[] generate(String namajrxml, GenericCustomReportDto dto, int type) throws Exception {
		return generate(namajrxml, dto, type, true);
	}
	
	private byte[] generate(String namajrxml, GenericCustomReportDto dto, int type, boolean excelOneSheet) throws Exception {
//		@SuppressWarnings("unchecked")
//		List<Map<String,?>> mapData = new ObjectMapper().readValue(dto.getJsonStringfy(), List.class);
		
//		@SuppressWarnings("unchecked")
//		List<Map<String,?>> mapData = new Gson().fromJson(dto.getJsonStringfy(), List.class);
		
		//GsonBuilder gsonBuilder = new GsonBuilder();
		//Gson gson = gsonBuilder.setLongSerializationPolicy( LongSerializationPolicy.STRING ).create();
		
		@SuppressWarnings("unchecked")
		List<Map<String,?>> mapData = gson.fromJson(dto.getJsonStringfy(), List.class);
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		
//		genericReportService.setKdProfile(dto.getKdProfile());
//		genericReportService.setKdDepartemen(dto.getKdDepartemen());
//		genericReportService.setKdPegawai(dto.getKdPegawai());
		genericReportService.setGambarLogo(dto.getGambarLogo());
		
		genericReportService.setValue(dto.getParamKey(), dto.getParamValue(), dto.getParamType());
		genericReportService.setImageValue(dto.getParamImgKey(), dto.getParamImgValue());

		genericReportService.setJRXMLFileName(namajrxml+".jrxml");
		
		BufferedOutputStream bos = new BufferedOutputStream(baos);
		
		genericReportService.getFastReporter(mapData);
		switch(type) {
			case 1:
				genericReportService.getReportManager().showPDF(bos);
				break;
			case 2:
				genericReportService.getReportManager().showXLS(bos, new boolean[]{!excelOneSheet, false, false});
				break;
			case 3:
				genericReportService.getReportManager().showXLSX(bos, new boolean[]{!excelOneSheet, false, false});					
				break;
			default:
				genericReportService.getReportManager().showPDF(bos);
				break;
		}
		bos.flush();		
		return baos.toByteArray();
	}
	
	
	private static class MapDeserializer implements JsonDeserializer<Map<String, Object>> {

	    public Map<String, Object> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
	        Map<String, Object> m = new LinkedHashMap<String, Object>();
	        JsonObject jo = json.getAsJsonObject();
	        for (Entry<String, JsonElement> mx : jo.entrySet()) {
	            String key = mx.getKey();
	            JsonElement v = mx.getValue();
	            if (v.isJsonArray()) {
	                m.put(key, context.deserialize(v, List.class));
	            } else if (v.isJsonObject()) {
	                m.put(key, context.deserialize(v, Map.class));
	            } else if (v.isJsonPrimitive()) {
	                String vString=v.getAsString();
                    m.put(key, vString);
	            } else {
	            	m.put(key, null);
	            }
	        }
	        return m;
	    }
	}

	private static class ListDeserializer implements JsonDeserializer<List<Object>> {

	    public List<Object> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
	        List<Object> m = new ArrayList<Object>();
	        JsonArray arr = json.getAsJsonArray();
	        for (JsonElement jsonElement : arr) {
	        	if (jsonElement.isJsonArray()) {
	                m.add(context.deserialize(jsonElement, List.class));
	            } else if (jsonElement.isJsonObject()) {
	                m.add(context.deserialize(jsonElement, Map.class));
	            } else if (jsonElement.isJsonPrimitive()) {
                    m.add(jsonElement.getAsString());
	            } else {
	            	m.add(null);
	            }
	        }
	        return m;
	    }
	}

	private static Gson gson = new GsonBuilder().registerTypeAdapter(Map.class, new MapDeserializer()).registerTypeAdapter(List.class, new ListDeserializer()).setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	
}
