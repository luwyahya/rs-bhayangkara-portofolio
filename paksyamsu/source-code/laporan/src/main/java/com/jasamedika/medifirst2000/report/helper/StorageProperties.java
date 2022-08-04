package com.jasamedika.medifirst2000.report.helper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@Getter
@Setter
public class StorageProperties {
	 /**
     * Folder location for storing files
     */
	@Value("${info.upload-foto}")
    private String location = "D:\\WORKSPACE\\Framework\\upload-dir";
	
	@Value("${info.upload-report}")
    private String locationReport = "D:\\WORKSPACE\\Framework\\upload-dir";
	
	@Value("${info.upload-foto-pegawai:/opt/microservice/upload-dir/pegawai}")
    private String locationPhotos = "D:\\WORKSPACE\\Framework\\upload-dir\\pegawai";
	 

}
