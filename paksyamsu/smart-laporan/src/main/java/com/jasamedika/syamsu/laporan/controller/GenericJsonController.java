package com.jasamedika.syamsu.laporan.controller;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.jasamedika.syamsu.laporan.dto.GenericCustomReportDto;
import com.jasamedika.syamsu.laporan.service.GenericReportService;

import io.javalin.Javalin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenericJsonController extends AbstractGenericController {
		
	public GenericJsonController(String pathHeader, Javalin app) {
		super(pathHeader, app);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	protected byte[] generate(String namajrxml, GenericCustomReportDto dto, int type, boolean excelOneSheet) throws Exception {
		List<Map<String,?>> mapData = gson.fromJson(dto.getJsonStringfy(), List.class);
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		GenericReportService genericReportService = new GenericReportService();
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
	
	private static Gson gson = new GsonBuilder().registerTypeAdapter(Map.class, new MapDeserializer()).registerTypeAdapter(List.class, new ListDeserializer()).setDateFormat("yyyy-MM-dd HH:mm:ss").create();

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
	
}
