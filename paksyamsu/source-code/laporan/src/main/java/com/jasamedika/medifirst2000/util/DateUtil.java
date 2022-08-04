package com.jasamedika.medifirst2000.util;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.joda.time.DateTime;
import org.joda.time.Months;
import org.joda.time.Years;

/**
 * The Class DateUtil.
 * 
 * @author Adik
 */
public final class DateUtil implements Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = -3865736292493750177L;
	
	public static final TimeZone DEFAULT_TIMEZONE = TimeZone.getTimeZone("Asia/Jakarta");
	public static final TimeZone TZ = TimeZone.getTimeZone("Asia/Jakarta");
	public static final Locale LOCALE = new Locale("in", "ID");

	/** The Constant MILLISECONDS_IN_A_DAY. */
	public static final int MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

	/** The Constant number of months in a year. */
	public static final int MONTHS_IN_A_YEAR = 12;

	/** The Constant number of days in a month. */
	public static final int DAYS_IN_A_MONTH = 30;

	public static final String[] INDONESIAN_NAME_OF_DAY = new String[] { "Senin", "Selasa", "Rabu", "Kamis", "Jumat",
			"Sabtu", "Minggu" };
	
	/** The Constant DATE_PATTERN. */
	public static final String DATE_PATTERN = "dd-MM-yyyy";
	public static final String SHORT_DATE_FORMAT_STRING = "dd/MM/yyyy";
	public static final String LONG_DATE_FORMAT_STRING = "dd MMMMM yyyy";
	
	/** The Constant DATE_FORMAT. */
	public static final DateFormat SHORT_DATE_FORMAT = new SimpleDateFormat(SHORT_DATE_FORMAT_STRING);
	public static final DateFormat LONG_DATE_FORMAT = new SimpleDateFormat(LONG_DATE_FORMAT_STRING);
	public static final Format DATE_FORMAT = new SimpleDateFormat(DATE_PATTERN);
	
	private static Calendar calNow = DateUtil.getCalendar(TZ);


	private DateUtil() {
		// To prevent instantiation of this class.
	}
	
	public static SimpleDateFormat formatDate(String format){
		return new SimpleDateFormat(format);
	}
	
	public static int getYear() {
		return calNow.get(Calendar.YEAR);
	}
	
	public static int getMonth() {
		return calNow.get(Calendar.MONTH);
	}

	public static int getDay() {
		return calNow.get(Calendar.DATE);
	}
	
	public static String getYearString() {
		return String.valueOf(calNow.get(Calendar.YEAR));
	}
	
	public static String getMonthString() {
		return String.valueOf(calNow.get(Calendar.MONTH));
	}
	
	public static String getMonthString(Integer add) {
		return String.valueOf(calNow.get(Calendar.MONTH) + add);
	}

	public static String getDayString() {
		return String.valueOf(calNow.get(Calendar.DATE));
	}

	///////////////////////////////////////////////////
	
	
	public static TimeZone getTimeZone(String ID) {
		return TimeZone.getTimeZone(ID);
	}
	
	public static Locale getLocale(String id, String ID) {
		return new Locale(id, ID);
	}
	
	public static Calendar getCalendar() {
		return Calendar.getInstance(TZ);
	}
	
	public static Calendar getCalendarWithLocale() {
		return Calendar.getInstance(TZ, LOCALE);
	}
	
	public static Calendar getCalendar(TimeZone tz) {
		return Calendar.getInstance(tz);
	}
	
	public static Calendar getCalendarWithLocale(TimeZone tz, Locale locale) {
		return Calendar.getInstance(tz, locale);
	}
	
	public static Calendar getCalendar(long timeInMillis) {
		Calendar c = getCalendar();
		c.setTimeInMillis(timeInMillis);
		return c;
	}
	
	/////////////////////////////////////////////////////

	//////////////////////////////
	// Untuk Kebutuhan Query
	/////////////////////////////
	
	public static Long periodeAwalHariCurrent() {
		return periodeAwalHariCurrent(TZ);
	}
	
	public static Long periodeAkhirHariCurrent() {
		return periodeAkhirHariCurrent(TZ);
	}
	
	public static Long periodeAwalBulanCurrent() {
		return periodeAwalBulanCurrent(TZ);
	}
	
	public static Long periodeAkhirBulanCurrent() {
		return periodeAkhirBulanCurrent(TZ);
	}
	
	public static Long periodeAwalTahunCurrent() {
		return periodeAwalTahunCurrent(TZ);
	}
	
	public static Long periodeAkhirTahunCurrent() {
		return periodeAkhirTahunCurrent(TZ);
	}
	
	public static Long periodeAwalHariCurrent(TimeZone tz) {
		return periodeAwalHari(tz, new Date().getTime() / 1000);		
	}
	
	public static Long periodeAkhirHariCurrent(TimeZone tz) {
		return periodeAkhirHari(tz, new Date().getTime() / 1000);				
	}
	
	public static Long periodeAwalBulanCurrent(TimeZone tz) {
		return periodeAwalBulan(tz, new Date().getTime() / 1000);				
	}
	
	public static Long periodeAkhirBulanCurrent(TimeZone tz) {
		return periodeAkhirBulan(tz, new Date().getTime() / 1000);				
	}
	
	public static Long periodeAwalTahunCurrent(TimeZone tz) {
		return periodeAwalTahun(tz, new Date().getTime() / 1000);				
	}
	
	public static Long periodeAkhirTahunCurrent(TimeZone tz) {
		return periodeAkhirTahun(tz, new Date().getTime() / 1000);				
	}
	
	public static Long periodeAwalHari(Long epoch) {
		return periodeAwalHari(TZ, epoch);
	}
	
	public static Long periodeAkhirHari(Long epoch) {
		return periodeAkhirHari(TZ, epoch);
	}
	
	public static Long periodeAwalBulan(Long epoch) {
		return periodeAwalBulan(TZ, epoch);
	}
	
	public static Long periodeAkhirBulan(Long epoch) {
		return periodeAkhirBulan(TZ, epoch);
	}
	
	public static Long periodeAwalTahun(Long epoch) {
		return periodeAwalTahun(TZ, epoch);
	}
	
	public static Long periodeAkhirTahun(Long epoch) {
		return periodeAkhirTahun(TZ, epoch);
	}
	
	public static Long periodeAwalHari(TimeZone tz, Long epoch) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTimeInMillis(epoch * 1000L);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		
		return cal.getTimeInMillis() / 1000L;
	}
	
	public static Long periodeAkhirHari(TimeZone tz, Long epoch) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTimeInMillis(epoch * 1000L);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		
		return cal.getTimeInMillis() / 1000L;
	}
	
	public static Long periodeAwalBulan(TimeZone tz, Long epoch) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTimeInMillis(epoch * 1000L);
		cal.set(Calendar.DATE, 1);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		
		return cal.getTimeInMillis() / 1000L;
	}
	
	public static Long periodeAkhirBulan(TimeZone tz, Long epoch) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTimeInMillis(epoch * 1000L);
		cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		
		return cal.getTimeInMillis() / 1000L;
	}
	
	public static Long periodeAwalTahun(TimeZone tz, Long epoch) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTimeInMillis(epoch * 1000L);
		cal.set(Calendar.DATE, 1);
		cal.set(Calendar.MONTH, 0);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		
		return cal.getTimeInMillis() / 1000L;
	}
	
	public static Long periodeAkhirTahun(TimeZone tz, Long epoch) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTimeInMillis(epoch * 1000L);
		cal.set(Calendar.DATE, 31);
		cal.set(Calendar.MONTH, 11);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		
		return cal.getTimeInMillis() / 1000L;
	}
	

	/**
	 * Calculate the beginning date of the month.
	 * 
	 * @return
	 */
	
	
	public static Date getBeginningOfTheMonth(TimeZone tz, Date date) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(date);

		if (cal.get(Calendar.DAY_OF_MONTH) > 1) {
			cal.add(Calendar.MONTH, 1);
			cal.set(Calendar.DAY_OF_MONTH, 1);
		}

		return cal.getTime();
	}

	/**
	 * Calculate the age now.
	 * 
	 * @param birthDate
	 *            the birth date
	 * @return the age
	 */
	public static int getAge(TimeZone tz, Date birthDate) {
		Calendar cal = Calendar.getInstance(tz);
		Date date = cal.getTime();		
		return getAge(tz, birthDate, date);
	}

	/**
	 * Calculate the age on a date.
	 * 
	 * @param birthDate
	 *            the birth date
	 * @param aDate
	 *            a date
	 * @return the age
	 */
	public static int getAge(TimeZone tz, Date birthDate, Date aDate) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(aDate);
		Calendar dob = Calendar.getInstance(tz);
		dob.setTime(birthDate);
		if (dob.after(cal)) {
			throw new IllegalArgumentException("Date not valid");
		}
		int year1 = cal.get(Calendar.YEAR);
		int year2 = dob.get(Calendar.YEAR);
		int age = year1 - year2;
		int month1 = cal.get(Calendar.MONTH);
		int month2 = dob.get(Calendar.MONTH);
		if (month2 > month1) {
			age--;
		} else if (month1 == month2) {
			int day1 = cal.get(Calendar.DAY_OF_MONTH);
			int day2 = dob.get(Calendar.DAY_OF_MONTH);
			if (day2 > day1) {
				age--;
			}
		}
		return age;
	}
	
	public static double getAgeYearAndMonth(TimeZone tz, Date birthDate) {
		return getAgeYearAndMonth(tz, birthDate, DateUtil.getCalendar(DateUtil.getCurrentDate()).getTime());
	}
	public static double getAgeYearAndMonth(TimeZone tz, Date birthDate, Date aDate) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(aDate);
		Calendar dob = Calendar.getInstance(tz);
		dob.setTime(birthDate);
		if (dob.after(cal)) {
			throw new IllegalArgumentException("Date not valid");
		}
		int year1 = cal.get(Calendar.YEAR);
		int year2 = dob.get(Calendar.YEAR);
		int age = year1 - year2;
		int month1 = cal.get(Calendar.MONTH);
		int month2 = dob.get(Calendar.MONTH);
		int ymonth = 0;
		if (month2 > month1) {
			age--;
			ymonth = ((12 - month2) + month1) + 1;
		} else if (month1 == month2) {
			int day1 = cal.get(Calendar.DAY_OF_MONTH);
			int day2 = dob.get(Calendar.DAY_OF_MONTH);
			if (day2 > day1) {
				age--;
			}
		} else {
			ymonth = (month1 - month2);
		}
		
		int yAge = age;
		
		double realAge =  yAge + (ymonth/10);
		return realAge;
	}
	

	/**
	 * Get months of 2 Dates. The date1 must be after the date2.
	 * 
	 * @param date1
	 *            The later date
	 * @param date2
	 *            The former date
	 * @return the month of2 date
	 */
	public static int getMonthOf2Date(TimeZone tz, Date date1, Date date2) {
		Calendar cal1 = Calendar.getInstance(tz);
		Calendar cal2 = Calendar.getInstance(tz);
		cal1.setTime(date1);
		cal2.setTime(date2);
		if (cal2.after(cal1)) {
			throw new IllegalArgumentException("Date not valid");
		}
		long diff = cal1.getTimeInMillis() - cal2.getTimeInMillis();
		int days = (int) (diff / MILLISECONDS_IN_A_DAY);
		int years = (int) Math.floor(days / 365.24);
		int month = (int) Math.round((days - (years * 365.24)) / 30.4375);
		if (month == 12) {
			month = 0;
			years += 1;
		}
		return (years * 12) + month;
	}

	/**
	 * This method get the number of days between two dates.
	 * 
	 * @param date1
	 *            First date
	 * @param date2
	 *            Second date
	 * @return Number of days
	 */
	public static int getDaysBetweenDates(TimeZone tz, Date date1, Date date2) {
		if (date1 == null || date2 == null) {
			throw new IllegalArgumentException("One or both dates are null.");
		}
		Calendar cal1 = Calendar.getInstance(tz);
		cal1.setTime(date1);
		cal1.set(Calendar.HOUR_OF_DAY, 0);
		cal1.set(Calendar.MINUTE, 0);
		cal1.set(Calendar.SECOND, 0);
		cal1.set(Calendar.MILLISECOND, 0);
		Calendar cal2 = Calendar.getInstance(tz);
		cal2.setTime(date2);
		cal2.set(Calendar.HOUR_OF_DAY, 0);
		cal2.set(Calendar.MINUTE, 0);
		cal2.set(Calendar.SECOND, 0);
		cal2.set(Calendar.MILLISECOND, 0);
		long days = Math.abs(cal2.getTimeInMillis() - cal1.getTimeInMillis());
		days /= MILLISECONDS_IN_A_DAY;
		return (int) days;
	}
	
	/**
	 * Format a date in DD-MM-YYYY.
	 * 
	 * @param Long
	 *            the date
	 * @return The string representation of the date
	 */
	public static String changeLongToStringDDMMYYYY(Long date) {
		return DateUtil.formatDate(new Date(date * 1000));
	}
	
	
	/**
	 * Format a date in DD-MM-YYYY.
	 * 
	 * @param Long
	 *            the date
	 * @return The string representation of the date
	 */
	public static String formatDate(Long date) {
		if (date == null) {
			return "";
		}
		return DATE_FORMAT.format(new Date(date * 1000));
	}
	/**
	 * Format a date in DD-MM-YYYY.
	 * 
	 * @param date
	 *            the date
	 * @return The string representation of the date
	 */
	public static String formatDate(Date date) {
		if (date == null) {
			return "";
		}
		return DATE_FORMAT.format(date);
	}

	/**
	 * Format a date by parameter string as format.
	 * 
	 * @param date
	 *            the date
	 * @param datePattern
	 *            the date pattern
	 * @return The string representation of the date
	 */
	public static String formatDate(Date date, String datePattern) {
		Format dateFormat = new SimpleDateFormat(datePattern);
		return dateFormat.format(date);
	}

	/**
	 * Format a date by parameter string as format.
	 * 
	 * @param date
	 *            the date
	 * @param datePattern
	 *            the date pattern
	 * @param locale
	 *            the locale
	 * @return The string representation of the date
	 */
	public static String formatDate(Date date, String datePattern, Locale locale) {
		Format dateFormat = new SimpleDateFormat(datePattern, locale);
		return dateFormat.format(date);
	}

	/**
	 * Get the current month (1-based, 1 is January).
	 * 
	 * @return Current month
	 */
	public static int currentMonth(TimeZone tz) {
		Calendar now = Calendar.getInstance(tz);
		// the month in Java is 0-based, but we use 1-based in the application
		return now.get(Calendar.MONTH) + 1;
	}

	/**
	 * Get the current year.
	 * 
	 * @return Current year
	 */
	public static int currentYear(TimeZone tz) {
		Calendar now = Calendar.getInstance(tz);
		return now.get(Calendar.YEAR);
	}

	public static final synchronized Integer getYearFromDate(TimeZone tz, Date date) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(date);
		int year = cal.get(Calendar.YEAR);

		return year;
	}

	public static final synchronized Integer getMonthFromDate(TimeZone tz, Date date) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(date);
		int year = cal.get(Calendar.MONTH);

		return year + 1;
	}

	/**
	 * Get year information of a date.
	 * 
	 * @param date
	 * @return the year
	 */
	public static int getYear(TimeZone tz, Date date) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(date);
		return cal.get(Calendar.YEAR);
	}

	/**
	 * Create a string for a date with the format "dd/MM/yyyy"
	 * 
	 * @param date
	 * @return formatted date, or an empty string if the date is null.
	 */
	public static String formatShortDate(TimeZone tz, Date date) {
		if (date == null) {
			return "";
		} else {
			return SHORT_DATE_FORMAT.format(date);
		}
	}

	/**
	 * Create a string for a date with the format "dd MMMMM yyyy"
	 * 
	 * @param date
	 * @return formatted date, or an empty string if the date is null.
	 */
	public static String formatLongDate(TimeZone tz, Date date) {
		if (date == null) {
			return "";
		} else {
			return LONG_DATE_FORMAT.format(date);
		}
	}

	/**
	 * Parse a short date string ("dd/MM/yyyy") into a Date object.
	 * 
	 * @param dateString
	 *            Date string.
	 * @return Date object.
	 * @throws ParseException
	 */
	public static Date parseShortDateString(String dateString) throws ParseException {
		return SHORT_DATE_FORMAT.parse(dateString);
	}

	/**
	 * Parse a long date string ("dd MMMMM yyyy") into a Date object.
	 * 
	 * @param date
	 *            Date string.
	 * @return Date object.
	 * @throws ParseException
	 */
	public static Date parseLongDateString(String dateString) throws ParseException {
		return LONG_DATE_FORMAT.parse(dateString);
	}

	/** Map of Indonesian Month **/
	public static final String[] INDONESIAN_MONTH = new String[] { "Januari", "Februari", "Maret", "April", "Mei",
			"Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" };

	/**
	 * Get String information of a date in Indonesian style : dd-mmmmm-yyy.
	 * 
	 * @param date
	 * @return string
	 */
	public static String getIndonesianStringDate(TimeZone tz,Date date) {
		Calendar cal = Calendar.getInstance(tz);
		cal.setTime(date);
		return cal.get(Calendar.DAY_OF_MONTH) + " " + INDONESIAN_MONTH[cal.get(Calendar.MONTH)] + " "
				+ cal.get(Calendar.YEAR);
	}

	public static synchronized Date now(TimeZone tz) {
		Calendar cal = Calendar.getInstance(tz);
		return cal.getTime();
	}

	public static synchronized Date toDate(String dateString) {
		Date result = null;

		if (dateString != null && !dateString.equals("")) {
			try {
				if (dateString.indexOf(":") > 0)
					result = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateString);
				else {
					if (dateString.indexOf("-") > 0)
						result = new SimpleDateFormat("yyyy-MM-dd").parse(dateString);
					else
						result = new SimpleDateFormat("yyyyMMddHHmmss").parse(dateString);
				}

			} catch (Exception e) {
				StringUtil.printStackTrace(e);
			}
		}

		return result;
	}

	public static synchronized Date getSimpleShortDate(TimeZone tz) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance(tz);
		String datenow = simpleDateFormat.format(cal.getTime());
		Date tglReg = null;
		try {
			tglReg = simpleDateFormat.parse(datenow);
		} catch (ParseException e) {
			StringUtil.printStackTrace(e);
		}
		return tglReg;
	}
	
	public static synchronized Date getShortDate(TimeZone tz) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss");
		Calendar cal = Calendar.getInstance(tz);
		String datenow = simpleDateFormat.format(cal.getTime());
		Date tglReg = null;
		try {
			tglReg = simpleDateFormat.parse(datenow);
		} catch (ParseException e) {
			StringUtil.printStackTrace(e);
		}
		return tglReg;
	}

	/**
	 * Add (Minus, Plus) of the days
	 * 
	 * @param currentDate
	 * @param num
	 * @return Date
	 */
	public static Date addDays(TimeZone tz, Date currentDate, Integer num) {
		// convert date to calendar
		Calendar c = Calendar.getInstance(tz);
		c.setTime(currentDate);

		c.add(Calendar.DATE, num); // same with c.add(Calendar.DAY_OF_MONTH, 1);

		return c.getTime();
	}

	/**
	 * Add (Minus, Plus) of the Month
	 * 
	 * @param currentDate
	 * @param num
	 * @return Date
	 */
	public static Date addMonth(TimeZone tz, Date currentDate, Integer num) {
		// convert date to calendar
		Calendar c = Calendar.getInstance(tz);
		c.setTime(currentDate);

		c.add(Calendar.MONTH, num);

		return c.getTime();
	}

	/**
	 * Add (Minus, Plus) of the Years
	 * 
	 * @param currentDate
	 * @param num
	 * @return Date
	 */
	public static Date addYear(TimeZone tz, Date currentDate, Integer num) {
		// convert date to calendar
		Calendar c = Calendar.getInstance(tz);
		c.setTime(currentDate);

		// manipulate dateaddYears
		c.add(Calendar.YEAR, num);

		return c.getTime();
	}

	public static String getNameOfDays(int hariKeDlamMinggu) {
		return INDONESIAN_NAME_OF_DAY[hariKeDlamMinggu];
	}

	public static Long getCurrentDate(TimeZone tz) {
		return Instant.now().getEpochSecond();
	}
	
	public static Long convertDate(Date date) {
		return date.getTime() / 1000L;
	}

//	public static Long periodeAwal(TimeZone tz) {
//		Calendar cal = Calendar.getInstance(tz);
//		String string_date = formatDate(cal.getTime(), "dd-MM-yyyy");
//		long tanggalAwal = 0L;
//		long tanggalAhir = 0L;
//		SimpleDateFormat f = new SimpleDateFormat("dd-MM-yyyy");
//		try {
//			Date d = f.parse(string_date);
//			tanggalAwal = d.getTime() / 1000L;
//		} catch (ParseException e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAwal);
//	}

//	public static Long PeriodeAhir(TimeZone tz) {
//		Calendar cal = Calendar.getInstance(tz);
//		String string_date = formatDate(cal.getTime(), "dd-MM-yyyy");
//		long tanggalAwal = 0L;
//		long tanggalAhir = 0L;
//		SimpleDateFormat f = new SimpleDateFormat("dd-MM-yyyy");
//		try {
//			Date d = f.parse(string_date);
//			tanggalAwal = d.getTime() / 1000L;
//			tanggalAhir = tanggalAwal + 86399L;
//		} catch (ParseException e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAhir);
//	}
	
	public static long dateNow(TimeZone tz){
		Calendar cal = Calendar.getInstance(tz);
		long dateNow = cal.getTimeInMillis();
		dateNow=dateNow/1000;
		return dateNow;
	}
	
	public static long dateNow(){
		Calendar cal = Calendar.getInstance(TZ);
		long dateNow = cal.getTimeInMillis();
		dateNow=dateNow/1000;
		return dateNow;
	}
	
	
	///////////////////////////////////////////////////////
	//////// DEFAULT TIME ZONE
	//////////////////////////////////////////////////////
	
	
	/**
	 * Calculate the beginning date of the month.
	 * 
	 * @return
	 */
	public static Date getBeginningOfTheMonth(Date date) {
		return getBeginningOfTheMonth(DateUtil.DEFAULT_TIMEZONE, date);
	}

	/**
	 * Calculate the age now.
	 * 
	 * @param birthDate
	 *            the birth date
	 * @return the age
	 */
	public static int getAge(Date birthDate) {
		return getAge(DateUtil.DEFAULT_TIMEZONE, birthDate, now());
	}


	/**
	 * Get months of 2 Dates. The date1 must be after the date2.
	 * 
	 * @param date1
	 *            The later date
	 * @param date2
	 *            The former date
	 * @return the month of2 date
	 */
	public static int getMonthOf2Date(Date date1, Date date2) {
		return getMonthOf2Date(DateUtil.DEFAULT_TIMEZONE, date1, date2);
	}

	/**
	 * This method get the number of days between two dates.
	 * 
	 * @param date1
	 *            First date
	 * @param date2
	 *            Second date
	 * @return Number of days
	 */
	public static int getDaysBetweenDates(Date date1, Date date2) {
		return getDaysBetweenDates(DateUtil.DEFAULT_TIMEZONE, date1, date2);
	}


	/**
	 * Get the current month (1-based, 1 is January).
	 * 
	 * @return Current month
	 */
	public static int currentMonth() {
		return currentMonth(DateUtil.DEFAULT_TIMEZONE);
	}

	/**
	 * Get the current year.
	 * 
	 * @return Current year
	 */
	public static int currentYear() {
		return currentYear(DateUtil.DEFAULT_TIMEZONE);
	}

	public static final synchronized Integer getYearFromDate(Date date) {
		return getYearFromDate(DateUtil.DEFAULT_TIMEZONE, date);
	}

	public static final synchronized Integer getMonthFromDate(Date date) {
		return getMonthFromDate(DateUtil.DEFAULT_TIMEZONE, date);
	}

	/**
	 * Get year information of a date.
	 * 
	 * @param date
	 * @return the year
	 */
	public static int getYear(Date date) {
		return getYear(DateUtil.DEFAULT_TIMEZONE, date);
	}
	
	public static String formatLongDate(Long date) {
		return formatLongDate(DateUtil.DEFAULT_TIMEZONE, new Date(date * 1000));
	}

	public static String formatShortDate(Long date) {
		return formatShortDate(DateUtil.DEFAULT_TIMEZONE, new Date(date * 1000));
	}

	/**
	 * Create a string for a date with the format "dd/MM/yyyy"
	 * 
	 * @param date
	 * @return formatted date, or an empty string if the date is null.
	 */
	public static String formatShortDate(Date date) {
		return formatShortDate(DateUtil.DEFAULT_TIMEZONE, date);
	}

	/**
	 * Create a string for a date with the format "dd MMMMM yyyy"
	 * 
	 * @param date
	 * @return formatted date, or an empty string if the date is null.
	 */
	public static String formatLongDate(Date date) {
		return formatLongDate(DateUtil.DEFAULT_TIMEZONE, date);
	}


	/**
	 * Get String information of a date in Indonesian style : dd-mmmmm-yyy.
	 * 
	 * @param date
	 * @return string
	 */
	public static String getIndonesianStringDate(Date date) {
		return getIndonesianStringDate(DateUtil.DEFAULT_TIMEZONE, date);
	}

	public static synchronized Date now() {
		return now(DateUtil.DEFAULT_TIMEZONE);
	}

	/**
	 * Add (Minus, Plus) of the days
	 * 
	 * @param currentDate
	 * @param num
	 * @return Date
	 */
	public static Date addDays(Date currentDate, Integer num) {
		return addDays(DateUtil.DEFAULT_TIMEZONE, currentDate, num);
	}

	/**
	 * Add (Minus, Plus) of the Month
	 * 
	 * @param currentDate
	 * @param num
	 * @return Date
	 */
	public static Date addMonth(Date currentDate, Integer num) {
		return addMonth(DateUtil.DEFAULT_TIMEZONE, currentDate, num);
	}

	/**
	 * Add (Minus, Plus) of the Years
	 * 
	 * @param currentDate
	 * @param num
	 * @return Date
	 */
	public static Date addYear(Date currentDate, Integer num) {
		return addYear(DateUtil.DEFAULT_TIMEZONE, currentDate, num);
	}

	public static Long getCurrentDate() {
		return getCurrentDate(DateUtil.DEFAULT_TIMEZONE);
	}
	
//	public static Long periodeAwal() {	
//		return periodeAwal(DateUtil.DEFAULT_TIMEZONE);
//	}
//
//	public static Long PeriodeAhir() {
//		return PeriodeAhir(DateUtil.DEFAULT_TIMEZONE);
//	}
//	
//	public static long dateNow(){
//		return dateNow(DateUtil.DEFAULT_TIMEZONE);
//	}
//	
//	public static synchronized Date getShortDate() {
//		return getShortDate(DateUtil.DEFAULT_TIMEZONE);
//	}
	
	
	//////////////////////////////////////////////
	/////// Yang Pak Lukman Pindah Sini
	/////////////////////////////////////////////
	
	/*private  static Locale id = new Locale("in", "ID");
	private static Locale usersLocale = Locale.getDefault();
	private static ZoneId arrivingZone = ZoneId.of("Asia/Tokyo");
	*/public static Long getDateNowLongEpoch(){
		//ZoneId.of("Asia/Bangkok");
		return  Instant.now().getEpochSecond();
	}
	public static String getDayFromLong(Long timeEpoch){
		//ZoneId.of("GMT+7");
		/*for (String zona : ZoneId.getAvailableZoneIds()) {
			StringUtil.outPrintln(zona);
		}*/
		String pattern = "YYYY-MM-dd";
        SimpleDateFormat format = new SimpleDateFormat(pattern);

		 return format.format(Date.from( Instant.ofEpochSecond( timeEpoch )));
	}
	public static String getDDMMYYYYFromLong(Long timeEpoch){
		//ZoneId.of("GMT+7");
		/*for (String zona : ZoneId.getAvailableZoneIds()) {
			StringUtil.outPrintln(zona);
		}*/
		String pattern = "dd/MM/yyyy hh:mm";
		SimpleDateFormat format = new SimpleDateFormat(pattern);

		return format.format(Date.from( Instant.ofEpochSecond( timeEpoch )));
	}
	public static String getDDMMFromLong(Long timeEpoch){
		String pattern = "dd-MM";
		SimpleDateFormat format = new SimpleDateFormat(pattern);

		return format.format(Date.from( Instant.ofEpochSecond( timeEpoch )));
	}
	public static String getDDMMFromDateNow(){
		String pattern = "dd-MM";
		SimpleDateFormat format = new SimpleDateFormat(pattern);

		return format.format(new Date());
	}
	public static String getYYYYFromDateNow(){
		String pattern = "yyyy";
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		return format.format(new Date());
	}
//	public static Long periodeAwal() {
//		String string_date = formatDate(new Date(), "dd-MM-yyyy");
//		long tanggalAwal = 0L;
//		long tanggalAhir = 0L;
//		SimpleDateFormat f = new SimpleDateFormat("dd-MM-yyyy");
//		Calendar c = Calendar.getInstance();
//		try {
//			Date d = f.parse(string_date);
//			c.setTime(d);
//			tanggalAwal = c.getTimeInMillis() / 1000L;
//		} catch (ParseException e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAwal);
//	}


	public static Long StringToLongDate(String date){
		//String date = "01/01/" + tahun;
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		 try {
			c.setTime(sdf.parse(date));
		} catch (ParseException e) {
			StringUtil.printStackTrace(e);
		}
		return c.getTimeInMillis()/1000;
	}
	public static Long StringDDMMYYYYHHMMToLongDate(String date,int daysToAdd){
		//String date = "01/01/" + tahun;
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy hh:mm");
		Calendar c = Calendar.getInstance();
		try {
			c.setTime(sdf.parse(date));
			//Calendar calendar = Calendar.getInstance();
			//calendar.setTime(baseDate);
			c.add(Calendar.DAY_OF_YEAR, daysToAdd);
			//return calendar.getTime();
		} catch (ParseException e) {
			StringUtil.printStackTrace(e);
		}
		return c.getTimeInMillis()/1000;
	}

//	public static Long periodeAwal(Long timeEpoch) {
//		long tanggalAwal = 0L;
//
//		SimpleDateFormat f = new SimpleDateFormat("dd-MM-yyyy");
//		Calendar c = Calendar.getInstance();
//		try {
//			Date d  =Date.from( Instant.ofEpochSecond( timeEpoch ));
//			c.setTime(d);
//			tanggalAwal = c.getTimeInMillis() / 1000L;
//		} catch (Exception e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAwal);
//	}
//
//	public static Long PeriodeAkhir(Long timeEpoch) {
//		long tanggalAwal = 0L;
//		long tanggalAhir = 0L;
//		/*String string_date = formatDate(date, "dd-MM-yyyy");
//
//		*/
//		SimpleDateFormat f = new SimpleDateFormat("dd-MM-yyyy");
//		Calendar c = Calendar.getInstance();
//		try {
//			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
//			c.setTime(d);
//			tanggalAwal = c.getTimeInMillis() / 1000L;
//			tanggalAhir = tanggalAwal + 86399L;
//		} catch (Exception e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAhir);
//	}
	
//	public static Long periodeBulanAwal(Long timeEpoch) {
//		long tanggalAwal = 0L;
//		Calendar c = Calendar.getInstance();
//		try {
//			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
//			c.setTime(d);
//			tanggalAwal = c.getActualMinimum(Calendar.DAY_OF_MONTH);
//		} catch (Exception e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAwal);
//	}
	
	public static String getMonthString(Long timeEpoch) {
		Calendar c = Calendar.getInstance();
		try {
			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
			c.setTime(d);
			 StringUtil.outPrintln( );
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}

		return c.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.ENGLISH );
	}
	
	public static int getMonthInteger(Long timeEpoch) {
		Calendar c = Calendar.getInstance();
		int month=0;
		try {
			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
			c.setTime(d);
			month = c.get(Calendar.MONTH);
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}

		return month;
	}
	
	
//	public static Long periodeBulanAkhir(Long timeEpoch) {
//		long tanggalAwal = 0L;
//		Calendar c = Calendar.getInstance();
//		try {
//			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
//			c.setTime(d);
//			tanggalAwal = c.getActualMaximum(Calendar.DAY_OF_MONTH);
//		} catch (Exception e) {
//			StringUtil.printStackTrace(e);
//		}
//
//		return Long.valueOf(tanggalAwal);
//	}
	
	public static Integer getLongFromHHMM(String hhmm){
		return  (Integer.parseInt(hhmm.substring(0,2))*60) + Integer.parseInt(hhmm.substring(3));

	}
	public static Integer getHHMMFromLong(Long tanggal) {
		 	SimpleDateFormat f = new SimpleDateFormat("HH:mm");
		 	Date d = Date.from( Instant.ofEpochSecond( tanggal ));
			 String hhmm=f.format(d);
			return  (Integer.parseInt(hhmm.substring(0,2))*60) + Integer.parseInt(hhmm.substring(3));

	}
	public static String getStringHHMMFromLong(Long tanggal) {
		SimpleDateFormat f = new SimpleDateFormat("HH:mm");
		Date d = Date.from( Instant.ofEpochSecond( tanggal ));
		String hhmm=f.format(d);
		return  hhmm;

	}
	public static String getStringMMYYFromLong(Long tanggal,Integer month) {
		SimpleDateFormat f = new SimpleDateFormat("MM-yyyy");
		Date d = Date.from( Instant.ofEpochSecond( tanggal ));
		//DateUtils.addMonths(d, month);
		String hhmm=f.format(addMonths(d, month));
		return  hhmm;

	}
	
	public static Date addMonths(Date date, int month) {
		Calendar cal = getCalendar();
		cal.setTime(date);
		cal.add(Calendar.MONTH, month);
		return cal.getTime();
	}
	
	public static Long getDDLongFromLongEpoch(Long timeEpoch) {
		 Long day=0L;
		SimpleDateFormat f = new SimpleDateFormat("dd");

		try {
			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
			String hhmm=f.format(d);
			day =Long.parseLong(hhmm);
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}

		return day;
	}
	
	public static Long getMMLongFromLongEpoch(Long timeEpoch) {
		 Long day=0L;
		SimpleDateFormat f = new SimpleDateFormat("MM");

		try {
			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
			String hhmm=f.format(d);
			day =Long.parseLong(hhmm);
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}

		return day;
	}
	
	public static Long getYYYYLongFromLongEpoch(Long timeEpoch) {
		 Long day=0L;
		SimpleDateFormat f = new SimpleDateFormat("yyyy");

		try {
			Date d = Date.from( Instant.ofEpochSecond( timeEpoch ));
			String hhmm=f.format(d);
			day =Long.parseLong(hhmm);
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}

		return day;
	}
	public static Date addDays(Date baseDate, int daysToAdd) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(baseDate);
		calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);
		return calendar.getTime();
	}
	public static Integer tahunLamaKerja(Long tglMasukKerja){
		Integer tahunLamaKerja= Years.yearsBetween(new DateTime(Date.from( Instant.ofEpochSecond( tglMasukKerja ))), new DateTime()).getYears();
		StringUtil.outPrintln("lama Kerja dalam bulan "+Months.monthsBetween(new DateTime(Date.from( Instant.ofEpochSecond( tglMasukKerja ))), new DateTime()).getMonths());
		return tahunLamaKerja;
	}
	
	public static Integer bulanLamaKerja(Long tglMasukKerja){
		Integer bulanLamaKerja= Months.monthsBetween(new DateTime(Date.from( Instant.ofEpochSecond( tglMasukKerja ))), new DateTime()).getMonths();
		return bulanLamaKerja;
	}
	public static Long convertTOUTC(Long timeEpoch) {
		DateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		format.setTimeZone(TimeZone.getTimeZone("Asia/Jakarta"));
		Calendar calendar = Calendar.getInstance();
		try {
			Date day = Date.from(Instant.ofEpochSecond(timeEpoch));
			calendar.setTime(day);
			calendar.add(Calendar.HOUR_OF_DAY, 7);
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}
		return calendar.getTimeInMillis()/1000;

	}

	public static Integer compareDate(Long date1, Long date2){
		Calendar calendar = Calendar.getInstance();
		Calendar calendar2 = Calendar.getInstance();
		try {
			Date day1 = Date.from(Instant.ofEpochSecond(date1));
			Date day2 = Date.from(Instant.ofEpochSecond(date2));
			//d = Long.parseLong(hhmm);

			calendar.setTime(day1);
			calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
			calendar2.setTime(day2);
			calendar2.set(Calendar.HOUR_OF_DAY, 0);
			calendar2.set(Calendar.MINUTE, 0);
			calendar2.set(Calendar.SECOND, 0);
			calendar2.set(Calendar.MILLISECOND, 0);
			 
		} catch (Exception e) {
			StringUtil.printStackTrace(e);
		}
//		StringUtil.outPrintln("Tanggal 1"+calendar.getTime());
//		StringUtil.outPrintln("Tanggal 2"+calendar2.getTime());
//		StringUtil.outPrintln("Compare "+calendar.compareTo(calendar2));
		return  calendar.compareTo(calendar2);
	}
	public static Long addLongDays(Long baseDate, int daysToAdd) {
		Calendar calendar = Calendar.getInstance();
		try {
			Date day1 = Date.from(Instant.ofEpochSecond(baseDate));
			calendar.setTime(day1);
			calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		
		return calendar.getTimeInMillis()/1000;
	}


}
