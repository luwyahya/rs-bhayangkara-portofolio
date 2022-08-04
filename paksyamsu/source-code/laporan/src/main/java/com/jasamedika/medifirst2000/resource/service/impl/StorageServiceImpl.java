package com.jasamedika.medifirst2000.resource.service.impl;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Calendar;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.jasamedika.medifirst2000.report.helper.StorageProperties;
import com.jasamedika.medifirst2000.resource.service.StorageService;
import com.jasamedika.medifirst2000.util.DateUtil;
import com.jasamedika.medifirst2000.util.StringUtil;

@Service
public class StorageServiceImpl implements StorageService {

	// private final Path rootLocation;

	private String rootDir;
	private String rootDirReport;
	private String rootDirPhotos;



	@Autowired
	public StorageServiceImpl(StorageProperties properties) {
		// this.rootLocation = Paths.get(properties.getLocation());
		this.rootDir = properties.getLocation();
		this.rootDirReport = properties.getLocationReport();
		this.rootDirPhotos = properties.getLocationPhotos();
	}


	@Override
	public File storeReportFile(MultipartFile file) {
		Path rootLocation = Paths.get(rootDirReport);
		String filename = StringUtils.cleanPath(file.getOriginalFilename());
		Path path;

		try {
			if (file.isEmpty()) {
				throw new RuntimeException("Failed to store empty file " + filename);
			}
			if (filename.contains("..")) {
				throw new RuntimeException("Cannot store file with relative path outside current directory " + filename);
			}
			path = rootLocation.resolve(filename);
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file " + filename, e);
		}

		return path.toFile();
	}

	@Override
	public File store(MultipartFile file, Boolean adaNomorProfile, Integer kdProfile, Boolean gentime, Boolean resizeImage) {
		Path rootLocation = Paths.get(rootDir);

		try {
			Files.createDirectories(rootLocation);
		}catch(Exception e) {
			e.printStackTrace();
		}
		String filename = StringUtils.cleanPath(file.getOriginalFilename());

		if (gentime) {
			Calendar cal = DateUtil.getCalendar();
			int date = cal.get(Calendar.DATE);
			int month = cal.get(Calendar.MONTH) + 1;
			if (filename.indexOf('.') > -1) {
				filename = filename.substring(0, filename.indexOf('.')) + "." + date + "." + month + filename.substring(filename.indexOf('.'));
			} else {
				filename += "." + date +"."+ month;
			}
		}

		Path path;
		try {
			if (file.isEmpty()) {
				throw new RuntimeException("Failed to store empty file " + filename);
			}
			if (filename.contains("..")) {
				throw new RuntimeException("Cannot store file with relative path outside current directory " + filename);
			}
			path = rootLocation.resolve(filename);
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file " + filename, e);
		}

		File f = path.toFile();
		if (resizeImage) {
			try {
				resize(352, 240, f);
			}catch(Exception e) {				
			}
		}

		return f;
	}
	
	
	@Override
	public File storeMultipleUpload(MultipartFile file, Integer kdProfile, Boolean gentime, Boolean resizeImage,String pathFolder) {
		String tambahan = "/"+pathFolder;
		

		Path rootLocation = Paths.get(rootDir + tambahan);
		try {
			Files.createDirectories(rootLocation);
		}catch(Exception e) {
			e.printStackTrace();
		}
		String filename = StringUtils.cleanPath(file.getOriginalFilename());

		if (gentime) {
			Calendar cal = DateUtil.getCalendar();
			int date = cal.get(Calendar.DATE);
			int month = cal.get(Calendar.MONTH) + 1;
			if (filename.indexOf('.') > -1) {
				filename = filename.substring(0, filename.indexOf('.')) + "." + date + "." + month + filename.substring(filename.indexOf('.'));
			} else {
				filename += "." + date +"."+ month;
			}
		}

		Path path;
		try {
			if (file.isEmpty()) {
				throw new RuntimeException("Failed to store empty file " + filename);
			}
			if (filename.contains("..")) {
				throw new RuntimeException("Cannot store file with relative path outside current directory " + filename);
			}
			path = rootLocation.resolve(filename);
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file " + filename, e);
		}

		File f = path.toFile();
		if (resizeImage) {
			try {
				resize(352, 240, f);
			}catch(Exception e) {				
			}
		}

//		if (copyToAll) {
//			// cepat 
////			long total = 100;
//			// lambat 
//			
////			long total = profileDao.count();
// 
//			copyToReserve(rootDir, file, filename);
//
//		}
		return f;
	}
	
	private void resize(int width, int height, File pathImage) throws Exception {
		
		
		FileInputStream fis = new FileInputStream(pathImage);
		BufferedImage sourceImage = ImageIO.read(fis);
		if (sourceImage.getSampleModel().getWidth() < width || sourceImage.getSampleModel().getHeight() < height ) {
			return;
		}
		Image thumbnail = sourceImage.getScaledInstance(-1, height, Image.SCALE_SMOOTH);
		BufferedImage bufferedThumbnail = new BufferedImage(thumbnail.getWidth(null),
		                                                    thumbnail.getHeight(null),
		                                                    BufferedImage.TYPE_INT_RGB);
		bufferedThumbnail.getGraphics().drawImage(thumbnail, 0, 0, null);
		fis.close();
		FileOutputStream fos = new FileOutputStream(pathImage);
		ImageIO.write(bufferedThumbnail, "jpeg", fos);

		//System.out.println(pathImage);
	}

	@Async
	public void copyToReserve(String rootDir, MultipartFile file, String filename) {
		//for (int i = 0; i < total; i++) {
			try {

				Path rootLocation = Paths.get(rootDir);
				Files.createDirectories(rootLocation);
				Path path = rootLocation.resolve(filename);
				Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

			} catch (Exception e) {
				StringUtil.printStackTrace(e);
			}
		//}
	}

	@Override
	public Stream<Path> loadAll(Boolean adaNomorProfile, Integer kdProfile) {
		Path rootLocation = Paths.get(rootDir);
		try {
			return Files.walk(rootLocation, 3).filter(path -> !path.equals(rootLocation))
					.map(path -> rootLocation.relativize(path));
		} catch (IOException e) {
			throw new RuntimeException("Failed to read file from storage", e);
		}

	}

	//@Override
	private Path load(String filename, Boolean adaNomorProfile, Integer kdProfile,String path) {
		
		StringUtil.outPrintln("Mencari file:  " + filename + " di " + rootDir);
		//StringUtil.show();
		
		Path rootLocation = Paths.get(rootDir);
		return rootLocation.resolve(filename);
	}	
	

	@Override
	public Path load2ndStorage(String filename) { 		 
		Path rootLocation = Paths.get(rootDirPhotos);
		return rootLocation.resolve(filename);
	}

	@Override
	public Resource loadAsResource(String filename, Boolean adaNomorProfile, Integer kdProfile,String path) {
		try {
			Path file = load(filename, adaNomorProfile, kdProfile,path);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				
				file = load(filename, false, -1000,path);
				resource = new UrlResource(file.toUri());
				if (resource.exists() || resource.isReadable()) {
					return resource;
				} else {
					throw new RuntimeException("File tidak ditemukan: " + filename);					
				}				
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Cek nama direktori upload sudah benar: " + filename, e);
		}
	}
	
	@Override
	public Resource loadAsResource2ndStorage(String filename) {
		try {
			Path file = load2ndStorage(filename);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new RuntimeException("File tidak ditemukan: " + filename);
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Cek nama direktori upload sudah benar: " + filename, e);
		}
	}

	@Override
	public void deleteAll() {
		Path rootLocation = Paths.get(rootDir + "/");
		FileSystemUtils.deleteRecursively(rootLocation.toFile());
	}

	@Override
	public void init() {
		Path rootLocation = Paths.get(rootDir + "/");
		try {
			Files.createDirectories(rootLocation);
		} catch (IOException e) {
			throw new RuntimeException("Gagal membuat direktori", e);
		}
	}
	
	@Override
	public void initSubFolder(Integer kdProfile,String namaFile) {
		Path rootLocation = Paths.get(rootDir + "/profile-" + kdProfile+"/"+namaFile);
		try {
			Files.createDirectories(rootLocation);
		} catch (IOException e) {
			throw new RuntimeException("Gagal membuat direktori", e);
		}
	}
}
