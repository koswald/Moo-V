package utility;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Scanner;

/** 
 * @author Michael Beckley
 * @author Karl Oswald
 * Statically-accessed class for file input/output 
 */
public class Filx {

	private static String filePath;
	private static File dir;
	private static String fileName;
	private static String dataFolder;
	private static String dataSubFolder = "Ang-demos\\Data";
	private static String logFolder = "C:\\ProgramData\\AngularDemos\\SpringBoot\\3\\Logs";
	
	public Filx() {
		// constructor is not used, because
		// this class is accessed "in a static way"
	}
	
	/** @return String: data folder
	 *  @param None */
	
	public static String getDataFolder() {
		String folder = null;
		try {
			// try to get the AppData folder
			folder = System.getenv("AppData");
		} catch (Exception e) {
			log("Filx.getDataFolder", e.getMessage());
			// fallback folder
			folder = "C:\\ProgramData"; 
		}
		folder += "\\" + dataSubFolder;
		MakeFolders(folder);
		return folder;
	}

	/** Delete the data file, so that the put method can start fresh
	 *  @param String: file name (no path) */
	
	public static void clearDataFile(String pFilename) {
		String filespec = getDataFolder() + "\\" + pFilename;
		File file = new File(filespec);
		try {
			file.delete();
		} catch (Exception e) {
			log("Filx.clearDataFile - Exception:", e.getMessage());
			log("Filespec: " + filespec);
		}
	}

	/** Write a line to the data file
	 *  @param String: file name (no path)
	 *  @param String: string to write to the file */
	
	public static void put(String pFilename, String pData) {
		PrintWriter pw = null;
		filePath = getDataFolder() + "\\" + pFilename;
		try {
			pw = new PrintWriter(new FileWriter(filePath, true), true);
			
		} catch (IOException e) {
			log("Filx.put - IOException:", e.getMessage());
		} finally {
			pw.println(pData);
			pw.close();
		}
	}
	
	/** Open the file scanner 
	 *  @param String: file name (no path) 
	 *  @return Scanner: scanner object to read data from */
	
	public static Scanner openFileScanner(String pFilename) {
		Scanner fs = null;
		try {
			fs = new Scanner(new FileReader(getDataFolder() + "\\" + pFilename));
			
		} catch (FileNotFoundException e) {
			log("Filx.openFileScanner - FileNotFoundException:", e.getMessage());
			log("file=" + dataFolder + "\\" + pFilename);
		}
		return fs;
	}
	
	public static void closeFileScanner(Scanner pFS) {
		try {
			pFS.close();
			
		} catch (Exception e) {
			log("Filx.closeFileScanner - Exception:", e.getMessage());
		}
	}
	
	/** Get the next line of data
	 *  @param: Scanner
	 *  @return: String: a line of data */
	
	public static String get(Scanner pFS) {
		String data = null;
		try {	
			data = pFS.nextLine();
		} catch (Exception e) {
			log("Filx.get - Exception:", e.getMessage());
		}
		return data;
	}
	
	/** Make a folder path, if it doesn't already exist
	 *  @param String: folder path to be created */
	
	public static void MakeFolders(String pFolder) {
		dir = new File(pFolder);
		if(!dir.exists()) {
			dir.mkdirs();
		}
	}
	
	/** Write text to a log
	 *  @param String: [method name] (optional parameter)
	 *  @param String: text to write to the log */
	public static void log(String pInput) {
		logX(null, pInput);
	}
	public static void log(String pMethodName, String pInput) {
		logX(pMethodName, pInput);
	}
	private static void logX(String pMethodName, String pInput) {
		PrintWriter pw = null;
		try {
			LocalDateTime dt = LocalDateTime.now();
			//YYYY-MM-DD
			fileName = dt.getYear() + "-" 
					 + two(dt.getMonthValue() + "") + "-" 
					 + two(dt.getDayOfMonth() + "") + ".txt";
			
			MakeFolders(logFolder);
			
			filePath = logFolder + "\\" + fileName;
//			logFile = new File(filePath);
			
			pw = new PrintWriter(new FileWriter(filePath, true), true);	
			if (pMethodName != null) {
				// cast to String: int + "" 
				pw.println(two(dt.getHour() + "") + ":"
					 + two(dt.getMinute() + "") + ":" 
					 + two(dt.getSecond() + "") + " - " 
					 + pMethodName);
			}
			if (pInput != null) {
				pw.println("\t" + pInput);
			}
			pw.close();
			
		} catch(IOException e) {
			Filx.log("Filx.log: " + e.getMessage());
		} finally {
			if(pw != null) {
				pw.close();
			}
		}
	}
	/** @return String: two-character string of numerals
	 *  @param  String: one- or two-character string of numerals */
	
	private static String two(String pStr) {
		String str = pStr;
		if (str.length() == 1) {
			str = "0" + str;
		}
		return str;
	}
}