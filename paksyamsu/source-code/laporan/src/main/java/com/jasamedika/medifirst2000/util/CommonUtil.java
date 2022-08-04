package com.jasamedika.medifirst2000.util;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

//import com.google.common.collect.MapMaker;

/**
 * Common utility class.
 * 
 * @author Adik
 * @Modif Syamsu
 */
public final class CommonUtil<E> {

//	/** The Logger. */
//	private static final Log LOG = LogFactory.getLog(CommonUtil.class);
	
	/**
	 * To prevent instantiation of a new common util.
	 */
	private CommonUtil() {
	}


	/**
	 * Remove string qualifier used in the scripting code / GUI (client side).
	 * 
	 * @param expression
	 *            An expression with string qualifier (ex: ${orang.nama})
	 * @return An expression without string qualifier (ex: orang.nama)
	 */
	public static String trimExpression(String expression) {
		if (expression.charAt(0) == '$') {
			return expression.substring(2, expression.length() - 1);
		} else {
			return expression;
		}
	}

	/**
	 * Get value of a map entry or a bean.
	 * 
	 * @param source
	 *            A map or a bean
	 * @param property
	 *            If the source is map, this is the key, if the source is bean, this
	 *            is the bean's property.
	 * @return The value of a map entry or a bean's property.
	 */

	/**
	 * Format a value based on its type.
	 * 
	 * @param value
	 *            the value
	 * @return The formatted string
	 */
	public static String formatValue(Object value) {
		String result = "";
		if (value == null) {
			return result;
		}
		if (value instanceof Date) {
			result = DateUtil.formatDate((Date) value);
		} else {
			result = value.toString();
		}
		return result;
	}

	/**
	 * Check whether a string is null. If it is null, an empty string is returned.
	 * Otherwise, the string itself is returned.
	 * 
	 * @param string
	 * @return An empty string or the string itself.
	 */
	public static String checkNullString(String string) {
		if (string == null) {
			return "";
		}
		return string;
	}

	/**
	 * Check whether an object is null. If it is null, an empty string is returned.
	 * Otherwise, the string representation of the object is returned.
	 * 
	 * @param object
	 *            Object to convert to String
	 * @return
	 */
	public static String checkNullString(Object object) {
		if (object == null) {
			return "";
		}
		return object.toString();
	}

	/**
	 * Check whether an Integer object is null. If it is, Integer 0 is returned.
	 * Otherwise, the Integer object itself is returned.
	 * 
	 * @param integer
	 * @return An Integer object.
	 */
	public static Integer checkNullInteger(Integer integer) {
		if (integer == null) {
			return Integer.valueOf(0);
		}
		return integer;
	}

	/**
	 * Checking whether an object is equal to at least one of the objects given.
	 * 
	 * @param object
	 * @param objectsToCompare
	 * @return
	 */
	public static boolean checkEquality(Object object, Object... objectsToCompare) {
		if (object == null) {
			return false;
		}
		if (objectsToCompare == null || objectsToCompare.length == 0) {
			throw new IllegalArgumentException("ObjectsToCompare cannot be null or empty.");
		}
		for (Object objectToCompare : objectsToCompare) {
			if (objectToCompare == null) {
				continue;
			}
			if (object.equals(objectToCompare)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checking whether the string is equal ignoring case with at least one of the
	 * string given.
	 * 
	 * @param string
	 * @param stringsToCompare
	 * @return
	 */
	public static boolean checkEqualityIgnoreCase(String string, String... stringsToCompare) {
		if (string == null) {
			throw new IllegalArgumentException("String cannot be null.");
		}
		if (stringsToCompare == null || stringsToCompare.length == 0) {
			throw new IllegalArgumentException("StringsToCompare cannot be null or empty.");
		}
		for (String stringToCompare : stringsToCompare) {
			if (string.equalsIgnoreCase(stringToCompare)) {
				return true;
			}
		}
		return false;
	}

	public static Boolean isNotNullOrEmpty(Object object) {
		return !isNullOrEmpty(object);
	}

	
	public static <E, ID extends Serializable,DAO extends CrudRepository<E, ID>> E findOne(DAO dao, ID id) {
		return dao.findById(id).orElse(null);
	}

	@SuppressWarnings("rawtypes")
	public static Boolean isNullOrEmpty(Object object) {
		if (object == null) {
			return true;
		} else {
			if (object instanceof Collection) {
				return ((Collection) object).isEmpty();
			} else if (object instanceof Map) {
				return ((Map) object).isEmpty();
			} else if (object instanceof Iterator) {
				return !((Iterator) object).hasNext();
			} else {
				if ("".equals(object.toString().trim())) {
					return true;
				}
			}
			return false;
		}
	}
	
	public static String generateUuid() {
		return UUID.randomUUID().toString();
//		SecureRandom numberGenerator = null;
//		final long MSB = 0x8000000000000000L;
//		SecureRandom ng = numberGenerator;
//		if (ng == null) {
//			numberGenerator = ng = new SecureRandom();
//		}
//
//		return Long.toHexString(MSB | ng.nextLong()) + Long.toHexString(MSB | ng.nextLong());
	}
	
	// Syamsu
		
	public static <E> List<E> createList(){
		return new ArrayList<E>();
	}
	
	public static <K,V> Map<K,V> createMap(){
		//return new WeakHashMap<K,V>(); // Jangan diubah lagi yaa
		return new HashMap<K,V>();
	}
	
	
	public static Map<String, Object> wrapper(Map<String, Object> data){ // shortcut (Syamsu)
		Map<String, Object> result = createMap();
		result.put("data", data);
		
		return result;
	}
	
	public static Map<String, Object> wrapper(List<Map<String, Object>> data){ // shortcut (Syamsu)
		Map<String, Object> result = createMap();
		result.put("data", data);
		
		return result;
	}
	
	// Shortcut Map Chain Reaction 
	
	private Map<String, E> chainMap;
	
	public static <E> CommonUtil<E> initMap() {
		CommonUtil<E> chain = new CommonUtil<E>();
		chain.chainMap = createMap();
		return chain; 
	}
	
	public Map<String, E> getMap() {
		return chainMap;
	}
	
	public CommonUtil<E> put(String key, E data){		
		chainMap.put(key, data);
		return this;
	}
	
	// Shortcut List Chain Reaction 
	
	private List<Object> chainList;
	
	public static <E> CommonUtil<E> initList() {
		CommonUtil<E> chain = new CommonUtil<E>();
		chain.chainList = createList();
		return chain; 
	}
	
	public List<Object> getList() {
		return chainList;
	}
	
	public CommonUtil<E> add(Object data){		
		chainList.add(data);
		return this;
	}

	// Syamsu
}
