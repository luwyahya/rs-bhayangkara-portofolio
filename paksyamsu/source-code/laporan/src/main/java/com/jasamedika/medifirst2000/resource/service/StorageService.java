package com.jasamedika.medifirst2000.resource.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
	void init();
	File storeReportFile(MultipartFile file);
    File store(MultipartFile file, Boolean noProfile, Integer kdProfile, Boolean gentime, Boolean resizeImage);
    Stream<Path> loadAll(Boolean noProfile, Integer kdProfile);
    //Path load(String filename, Boolean noProfile, Integer kdProfile);
    void deleteAll();
	Resource loadAsResource2ndStorage(String filename);
	Path load2ndStorage(String filename);
	void initSubFolder(Integer kdProfile, String namaFile);
	File storeMultipleUpload(MultipartFile file, Integer kdProfile, Boolean gentime, Boolean resizeImage,
			String pathFolder);
	Resource loadAsResource(String filename, Boolean adaNomorProfile, Integer kdProfile, String path);

}
