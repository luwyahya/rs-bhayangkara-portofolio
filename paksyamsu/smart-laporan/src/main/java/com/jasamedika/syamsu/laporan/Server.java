package com.jasamedika.syamsu.laporan;

import com.jasamedika.syamsu.laporan.controller.GenericJdbcController;
import com.jasamedika.syamsu.laporan.controller.GenericJsonController;

import io.javalin.Javalin;

public class Server {
	
	public static void main(String ... args) {
		Registry.readProperties();
		
//		Gson gson = new GsonBuilder().create();
		
//		JsonMapper gsonMapper = new JsonMapper() {
//		    @Override
//		    public String toJsonString(@NotNull Object obj) {
//		        return gson.toJson(obj);
//		    }
//		    @Override
//		    public <T> T fromJsonString(@NotNull String json, @NotNull Class<T> targetClass) {
//		        return gson.fromJson(json, targetClass);
//		    }
//		};
		
		Javalin app = Javalin.create(config -> {
//			config.jsonMapper(gsonMapper);
			config.enableCorsForAllOrigins();
			config.compressionStrategy(null, null);
			config.maxRequestSize = 3_000_000L;
		}).start("0.0.0.0", Registry.port);
		
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			app.stop();
		}));
		
		GenericJdbcController jdbc = new GenericJdbcController("/generic", app);
		jdbc.setPDFController();
		jdbc.setXLSController();
		jdbc.setXLSXController();
		
		GenericJsonController json = new GenericJsonController("/generic-custom", app);
		json.setPDFController();
		json.setXLSController();
		json.setXLSXController();
		
	}
}
