package com.jasamedika.medifirst2000;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
//@EnableDiscoveryClient
//@EnableEurekaClient
//@EnableCaching
@EnableScheduling
public class Laporan {
	public static void main(String[] args) {
		SpringApplication.run(Laporan.class, args);
	}
}
