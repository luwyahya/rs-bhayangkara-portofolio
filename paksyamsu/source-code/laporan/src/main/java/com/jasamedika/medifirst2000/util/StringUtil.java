package com.jasamedika.medifirst2000.util;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.google.common.base.Joiner;
import com.google.common.collect.Iterables;

/**
 * String utility class. untuk kebutuhan khusus di luar fungsi-fungsi StringUtil
 * apache common lib
 * @Modified Syamsu
 * @author Adik
 */
public final class StringUtil {
	
	static ExecutorService executorService = Executors.newSingleThreadExecutor();

	static PrintStream out;
	
	static {
		try {
			out = new PrintStream(new BufferedOutputStream(new FileOutputStream(java.io.FileDescriptor.out), 512), false, "ASCII");
		}catch(Exception e) {
			out = new PrintStream(System.out, false);
		}
	}
	
	private StringUtil() {}

	public static String generateNoDokumen(Integer length) {
		char[] chars = "abcdefghijklmnopqrstuvwxyz".toCharArray();
		StringBuilder sb = new StringBuilder();
		Random random = new Random();
		for (int i = 1; i <= length; i++) {
		    char c = chars[random.nextInt(chars.length)];
		    sb.append(c);
		}
		String result = sb.toString();
		return result;
	}
	
	public static String generateUuid() {
		return UUID.randomUUID().toString();
    }
	
	public static void printStackTrace(Throwable t) {		
		show();
		executorService.submit(() -> t.printStackTrace(out));
	}
	
	public static void showFive(Throwable t) {
		executorService.submit(() -> out.print(Joiner.on('\n').join(Iterables.limit(Arrays.asList(t.getStackTrace()), 5))));
		show();
	}
	
	public static void outPrint(Object o) {
		executorService.submit(() -> out.print(o));
	}

	public static void outPrintln(Object o) {
		executorService.submit(() -> out.println(o));
	}
	
	public static void outPrintln() {
		executorService.submit(() -> out.println());
	}
	
	public static String uncapitalize(String source) {
		if (CommonUtil.isNullOrEmpty(source)) {
			return source;
		}
		
		return source.substring(0, 1).toLowerCase() + source.substring(1);
	}
	
	public static String capitalize(String source) {
		if (CommonUtil.isNullOrEmpty(source)) {
			return source;
		}
		
		return source.substring(0, 1).toUpperCase() + source.substring(1);
		
	}

	public static void outPrint(char o) {
		outPrint((Character)o);
	}
	
	public static void outPrint(int o) {
		outPrint((Integer)o);
	}
	
	public static void outPrint(float o) {
		outPrint((Float)o);
	}
	public static void outPrint(double o) {
		outPrint((Double)o);
	}
	public static void outPrint(short o) {
		outPrint((Short)o);
	}
	public static void outPrint(byte o) {
		outPrint((Byte)o);		
	}
	
	public static void outPrintln(char o) {
		outPrintln((Character)o);
	}
	
	public static void outPrintln(int o) {
		outPrintln((Integer)o);
	}
	
	public static void outPrintln(float o) {
		outPrintln((Float)o);
	}
	public static void outPrintln(double o) {
		outPrintln((Double)o);
	}
	public static void outPrintln(short o) {
		outPrintln((Short)o);
	}
	public static void outPrintln(byte o) {
		outPrintln((Byte)o);		
	}
	
	public static void show() {
		executorService.submit(()-> out.flush());
	}
	
	/**
	 * Format Nomor: Merubah format nomor sesuai dengan panjang yang diminta Contoh
	 * (1,6) -> 000006
	 * 
	 * @param angka
	 *            String
	 * @param length
	 *            panjang karakter
	 * @return
	 */
	public static String formatNumber(String angka, int length) {
		if (angka == null) {
			return "";
		}
		if (length < 1) {
			return angka;
		}
		String nol = "";
		int finalLength = length - angka.length();
		for (int i = 0; i < finalLength; i++) {
			nol += "0";
		}
		return nol + angka;
	}

	/**
	 * Get Month Name
	 * 
	 * @return
	 */
	public static String monthName(int month) {
		if (month < 1 || month > 12) {
			return "NOT VALID";
		}
		String[] monthNames = { "January", "February", "March", "April", "May", "June", "July", "August", "September",
				"October", "November", "December" };
		return monthNames[month - 1];
	}

	/**
	 * Get Day Name
	 * 
	 * @return
	 */
	public static String dayName(int day) {
		if (day < 1 || day > 7) {
			return "NOT VALID";
		}
		String[] monthNames = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
		return monthNames[day];
	}

	/**
	 * Get Nama Bulan
	 * 
	 * @return
	 */
	public static String namaBulan(int month) {
		if (month < 1 || month > 12) {
			return "NOT VALID";
		}
		String[] monthNames = { "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September",
				"Oktober", "November", "Desember" };
		return monthNames[month];
	}

	/**
	 * Get Nama Hari
	 * 
	 * @return
	 */
	public static String namaHari(int day) {
		if (day < 1 || day > 7) {
			return "NOT VALID";
		}
		String[] monthNames = { "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu" };
		return monthNames[day];
	}

	/**
	 * Validasi String no telpon Indonesia
	 * 
	 * @return
	 */
	public static boolean validateIndonesiaPhoneNumber(String phoneNo) {
		// xxxx 7 atau 8 digit
		String pattern1 = "\\d\\d\\d\\d([,\\s])?\\d{7,8}";
		// xxx 6 atau 7 digit
		String pattern2 = "\\d\\d\\d([,\\s])?\\d{6,7}";
		if (phoneNo.matches(pattern1))
			return true;
		else if (phoneNo.matches(pattern2))
			return true;
		else
			return false;
	}

	/**
	 * Validasi String no registrasi (misalnya)
	 * 
	 * @return
	 */
	public static boolean validateNoRegistrationExample(String phoneNo) {
		// REG000001
		String pattern = "REG\\d{6}";
		if (phoneNo.matches(pattern))
			return true;
		else
			return false;
	}
}
