package com.jasamedika.medifirst2000.resource.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jasamedika.medifirst2000.resource.service.StorageService;
import com.jasamedika.medifirst2000.util.CommonUtil;

import io.swagger.annotations.ApiOperation;

@Controller
@RequestMapping("/image")
public class FileImageController {

	@Autowired
	private StorageService storageService;

	
	@ApiOperation(value = "Api Untuk Melihat File Gambar", 
			 produces = "image/png, image/jpg, image/gif, image/jpeg")
	@GetMapping(path = "/show/{filename:.+}", 
			produces = {
					MediaType.IMAGE_PNG_VALUE,
					MediaType.IMAGE_JPEG_VALUE,
					MediaType.IMAGE_GIF_VALUE
					}
	)
	@ResponseBody
	public byte[] showFile(@PathVariable String filename,  
			@RequestParam(value = "noProfile", required = false, defaultValue = "true") Boolean noProfile, // Nomor Profile ada
			@RequestParam(value = "kdProfile", required = false, defaultValue = "-1000") Integer kdProfile,
			HttpServletResponse response)  {
		if ("null".equals(filename) || CommonUtil.isNullOrEmpty(filename) || "undefined".equals(filename)) {
			filename = "noimage.jpg";
		}
		Resource file = storageService.loadAsResource(filename, noProfile, kdProfile,null);		
		String type = filename.endsWith("png")?MediaType.IMAGE_PNG_VALUE:filename.endsWith("gif")?MediaType.IMAGE_GIF_VALUE:MediaType.IMAGE_JPEG_VALUE;
//		response.setHeader("Content-Type", "image/*");
		response.setContentType(type);
		try {
			return FileCopyUtils.copyToByteArray(file.getInputStream());
		}catch(Exception e) {
			throw new RuntimeException("File " + filename + " tidak bisa dibaca.");
		}
	}
	
	@ApiOperation(value = "Api Untuk Melihat File Gambar", 
			 produces = "image/png, image/jpg, image/gif, image/jpeg")
	@GetMapping(path = "/showImageWithPath", 
			produces = {
					MediaType.IMAGE_PNG_VALUE,
					MediaType.IMAGE_JPEG_VALUE,
					MediaType.IMAGE_GIF_VALUE
					}
	)
	@ResponseBody
	public byte[] showImageWithPath(
			@RequestParam(value = "filename", required = true) String filename,
			@RequestParam(value = "path", required = false) String path,
			@RequestParam(value = "noProfile", required = false, defaultValue = "true") Boolean noProfile, // Nomor Profile ada
			@RequestParam(value = "kdProfile", required = false, defaultValue = "-1000") Integer kdProfile,
			HttpServletResponse response)  {
		if ("null".equals(filename) || CommonUtil.isNullOrEmpty(filename) || "undefined".equals(filename)) {
			filename = "noimage.jpg";
		}
		Resource file = storageService.loadAsResource(filename, noProfile, kdProfile,path);		
		String type = filename.endsWith("png")?MediaType.IMAGE_PNG_VALUE:filename.endsWith("gif")?MediaType.IMAGE_GIF_VALUE:MediaType.IMAGE_JPEG_VALUE;
//		response.setHeader("Content-Type", "image/*");
		response.setContentType(type);
		try {
			return FileCopyUtils.copyToByteArray(file.getInputStream());
		}catch(Exception e) {
			throw new RuntimeException("File " + filename + " tidak bisa dibaca.");
		}
	}
	


	@ApiOperation(value = "Api Untuk Melihat File Gambar", 
			 produces = "image/png, image/jpg, image/gif, image/jpeg")
	@GetMapping(path = "/showPhotos/{filename:.+}", 
			produces = {
					MediaType.IMAGE_PNG_VALUE,
					MediaType.IMAGE_JPEG_VALUE,
					MediaType.IMAGE_GIF_VALUE
					}
	)
	@ResponseBody
	public byte[] showFilePhotos(@PathVariable String filename, 
			HttpServletResponse response)  {
		Resource file = storageService.loadAsResource2ndStorage(filename);		
		String type = filename.endsWith("png")?MediaType.IMAGE_PNG_VALUE:filename.endsWith("gif")?MediaType.IMAGE_GIF_VALUE:MediaType.IMAGE_JPEG_VALUE;
		response.setContentType(type);
		try {
			return FileCopyUtils.copyToByteArray(file.getInputStream());
		}catch(Exception e) {
			throw new RuntimeException("File " + filename + " tidak bisa dibaca.");
		}
	}
}
