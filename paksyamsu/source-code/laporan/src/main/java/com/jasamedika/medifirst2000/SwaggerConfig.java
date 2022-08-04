package com.jasamedika.medifirst2000;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import org.springframework.boot.web.embedded.undertow.UndertowBuilderCustomizer;
import org.springframework.boot.web.embedded.undertow.UndertowServletWebServerFactory;
import io.undertow.Undertow.Builder;
import io.undertow.UndertowOptions;


@Configuration
@EnableSwagger2
public class SwaggerConfig {
	
	@Value("${app.undertow.iothreads:4}")
	Integer iothreads;
	
	@Value("${app.undertow.workers:120}")
	Integer workers;

	@Value("${app.undertow.buffers:1024}")
	Integer buffers;
	
	@Value("${app.undertow.maxparameters:1000}")
	Integer maxparameters;
		
	@Bean
	public UndertowServletWebServerFactory embeddedServletContainerFactory() {
		UndertowServletWebServerFactory undertow = new UndertowServletWebServerFactory();
		
//		undertow.addBuilderCustomizers(new UndertowBuilderCustomizer() {
//			public void customize(Builder builder) {
//				builder.setServerOption(UndertowOptions.MAX_PARAMETERS, maxparameters);
//			}
//		});
		
		undertow.addBuilderCustomizers((UndertowBuilderCustomizer) (Builder builder) -> {
            builder.setServerOption(UndertowOptions.MAX_PARAMETERS, maxparameters);
        });
		
		undertow.setAccessLogEnabled(false);
		undertow.setUseDirectBuffers(true);
		undertow.setIoThreads(iothreads);
		undertow.setWorkerThreads(workers);
		undertow.setBufferSize(buffers);

		
		return undertow;
	}
	
	@Bean
	public Docket api() {
		List<Parameter> aParameters = new ArrayList<Parameter>();
		
		aParameters.add(new ParameterBuilder()
				.name("x-auth-token")
				.description("Authorized")
				.modelRef(new ModelRef("string"))
				.parameterType("header")
				.required(true)
				.build());
		
		aParameters.add(new ParameterBuilder()
				.name("AlamatUrlForm")
				.description("AlamatUrlForm frontEnd")
				.modelRef(new ModelRef("string"))
				.parameterType("header")
				.required(false)
				.build());
		
		aParameters.add(new ParameterBuilder()
				.name("KdRuanganT")
				.description("kdRuangan tujuan")
				.modelRef(new ModelRef("string"))
				.parameterType("header")
				.required(false)
				.build());
		
		aParameters.add(new ParameterBuilder()
				.name("CrJabatanT")
				.description("Kirim ke jabatan")
				.modelRef(new ModelRef("string"))
				.parameterType("header")
				.required(false)
				.build());
		
		aParameters.add(new ParameterBuilder()
				.name("tglKirim")
				.description("Tanggal kirim notification terjadwal")
				.modelRef(new ModelRef("string"))
				.parameterType("header")
				.required(false)
				.build());
		
		return new Docket(DocumentationType.SWAGGER_2)
				.select()
				.apis(RequestHandlerSelectors.any())
				.paths(PathSelectors.any())
				.build()
				.apiInfo(apiInfo())
				.pathMapping("")
				.globalOperationParameters(aParameters);

	}

	@Value("${info.app.name}")
	String title;
	
	@Value("${info.app.description}")
	String description;

	@Value("${info.app.version}")
	String version;

	@Value("${app.termsOfServiceUrl}")
	String termsOfServiceUrl;

	@Value("${app.license}")
	String license;

	@Value("${app.licenseUrl}")
	String licenseUrl;

	@Value("${app.contact.name}")
	String name;

	@Value("${app.contact.url}")
	String url;

	@Value("${app.contact.email}")
	String email;

	private ApiInfo apiInfo() {
		// versi 2.7.0 ke atas
		ApiInfo apiInfo = new ApiInfo(title, description, version, termsOfServiceUrl, new Contact(name, url, email),
				license, licenseUrl, Collections.emptyList());
		
		// versi 2.6.1 ke atas
//		ApiInfo apiInfo = new ApiInfo(title, description, version, termsOfServiceUrl, new Contact(name, url, email),
//				license, licenseUrl);
		
		return apiInfo;
	}
}