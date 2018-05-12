package au.edu.unimelb.comp90024;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The Configuration class holds all the configuration that is required by the
 * application It can load its configuration from a config file
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class Configuration {
    private final static Logger LOGGER = Logger
            .getLogger(Configuration.class.getName());

    // 1. TWEET READING
    // Limit Number of Tweets read with this.
    private static Integer rawTweetSearchCount = Integer.MAX_VALUE;

    // Read Tweets from twitter or directory
    // Twitter : to read from Twitter
    // File : to read from File
    private static String tweetSource = "File";

    // 1.1. Config to Read from File
    private static String readerReadDirectory = "C:\\CC\\READER\\INBOUND";
    private static String readerWorkingDirectory = "C:\\CC\\READER\\WORKING";
    private static String readFileExtension = ".txt";
    private static String fileTweetState = "vic";

    // 1.2. Config to read from Twitter
    // if you want to use different accounts to keep pulling data after a
    // session expires
    private static String key[];
    private static String secret[];
    private static String token[];
    private static String tokenSecret[];

    // Twitter Search Direction - Reverse,Forward (Chronological)
    // harvestingDirection=Reverse
    private static String direction = "Reverse";

    // Twitter search query
    // melbourne geocode:-37.8136,144.9631,50mi
    // sydney geocode:-33.8688,151.2093,50mi
    // Lat and long can be got by googling coordinates of a place
    // search=geocode:-37.8136,144.9631,50mi
    private static String cityQuery = "nsw";

    private static Map<String, String> cityQueryMap;
    static {
        cityQueryMap = new HashMap<String, String>();
        cityQueryMap.put("vic", "geocode:-37.8136,144.9631,50mi"); // 50 mile
                                                                   // radius
                                                                   // around
                                                                   // melbourne
        cityQueryMap.put("nsw", "geocode:-33.8688,151.2093,50mi"); // 50 mile
                                                                   // radius
                                                                   // around
                                                                   // sydney
        cityQueryMap.put("sa", "geocode:-34.9285,138.6007,50mi"); // 50 mile
                                                                  // radius
                                                                  // around
                                                                  // adelaide
        cityQueryMap.put("qld", "geocode:-27.4698,153.0251,50mi"); // 50 mile
                                                                   // radius
                                                                   // around
                                                                   // brisbane
        cityQueryMap.put("wa", "geocode:-31.9505,115.8605,50mi"); // 50 mile
                                                                  // radius
                                                                  // around
                                                                  // perth
    }

    // between 0(today) and 6 (6 days ago)
    private static Integer noOfDaysBeforeToday;

    // reference Tweet ID before/after which tweets need to be gathered (leave
    // blank if need to obtain from now)
    // this will trump noOfDayBeforetoday
    private static Long referenceId;

    private static boolean twitterLogging = false;

    // 2. POST PROCESSING
    private static boolean filterGeoTweets = false;
    // add geo tags ? ReverseGeo
    private static boolean enableGeoTagging = false;
    // ReverseGeoCode URL
    private static String ReverseGeocodeURL;

    // add state tag
    private static boolean enableStateTagging = false;

    // add documentType
    private static boolean enableDocTypeTagging = false;

    // 3. TWEET WRITING
    // Write Tweets to file/couchdb
    private static String writeMode = "file";

    // #CouchDB credentials if writing to couch
    private static String couchTweetsDB;
    private static String couchUserName;
    private static String couchPassword;

    // File Details if writing to file
    // private static String
    // workingDirectory="/home/moses/files/writer/working";
    // private static String
    // outboundDirectory="/home/moses/files/writer/outbound/";
    private static String workingDirectory;
    private static String outboundDirectory;
    private static String writeFileExtension = "-tweets.txt";

    // If Couch it will determine the number of records in one post request
    // (must be 1-100)
    // If file it will determine number of lines in single Tweet File,
    // files will roll once size is reached
    private static Integer writeBatchSize;

    /**
     * This method loads the properties from a config file It uses reflection
     * hence properties in the file need to match the data memebers.
     * 
     * @param filename
     */
    public static void loadConfig(String filename) {
        Properties prop = new Properties();
        InputStream input = null;
        try {

            input = new FileInputStream(filename);

            prop.load(input);

            Enumeration<?> e = prop.propertyNames();
            while (e.hasMoreElements()) {
                String key = (String) e.nextElement();
                String value = prop.getProperty(key);
                // System.out.println("Key : " + key + ", Value : " + value);
                LOGGER.log(Level.FINE,
                        "Loading.. Key : " + key + ", Value : " + value);

                Field field = Configuration.class.getDeclaredField(key);

                // handle arrays
                if (value.contains(",") && field.getType().isArray()) {
                    String[] arrayValues = value.split(",");
                    field.set(null, arrayValues);

                }
                // hand non String classes
                else if (!((field.getType()).equals(String.class))) {
                    if (value.trim().length() > 0) {
                        if (field.getType().equals(Long.class))
                            field.set(null, Long.parseLong(value));
                        if (field.getType().equals(Integer.class))
                            field.set(null, Integer.parseInt(value));
                        else if (field.getType().equals(Boolean.TYPE)) {
                            field.set(null, Boolean.parseBoolean(value));
                        }
                    }
                } else {
                    field.set(null, value);
                }
            }
        } catch (IOException | NoSuchFieldException | SecurityException
                | IllegalArgumentException | IllegalAccessException ex) {

            LOGGER.log(Level.SEVERE,
                    "Issue with Config File " + ex.getMessage(), ex);
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    LOGGER.log(Level.SEVERE,
                            "Issue with Config File " + e.getMessage(), e);
                }
            }
        }
    }

    public static String[] getKey() {
        return key;
    }

    public static String[] getSecret() {
        return secret;
    }

    public static String[] getToken() {
        return token;
    }

    public static String[] getTokenSecret() {
        return tokenSecret;
    }

    public static String getDirection() {
        return direction;
    }

    public static String getReverseGeocodeURL() {
        return ReverseGeocodeURL;
    }

    public static Integer getRawTweetSearchCount() {
        return rawTweetSearchCount;
    }

    public static String getCouchTweetsDB() {
        return couchTweetsDB;
    }

    public static Map<String, String> getCityqueryMap() {
        return cityQueryMap;
    }

    public static void setCityqueryMap(Map<String, String> cityqueryMap) {
        Configuration.cityQueryMap = cityqueryMap;
    }

    public static Long getReferenceId() {
        return referenceId;
    }

    public static String getCouchUserName() {
        return couchUserName;
    }

    public static String getCouchPassword() {
        return couchPassword;
    }

    public static Map<String, String> getCityQueryMap() {
        return cityQueryMap;
    }

    public static String getReadDirectory() {
        return readerReadDirectory;
    }

    public static String getReadFileExtension() {
        return readFileExtension;
    }

    public static String getWriteMode() {
        return writeMode;
    }

    public static String getWorkingDirectory() {
        return workingDirectory;
    }

    public static String getOutboundDirectory() {
        return outboundDirectory;
    }

    public static String getWriteFileExtension() {
        return writeFileExtension;
    }

    public static boolean isFilterGeoTweets() {
        return filterGeoTweets;
    }

    public static int getWriteBatchSize() {
        return writeBatchSize;
    }

    public static boolean isEnableGeoTagging() {
        return enableGeoTagging;
    }

    public static String getTweetSource() {
        return tweetSource;
    }

    public static boolean isEnableStateTagging() {
        return enableStateTagging;
    }

    public static boolean isEnableDocTypeTagging() {
        return enableDocTypeTagging;
    }

    public static String getReaderReadDirectory() {
        return readerReadDirectory;
    }

    public static String getReaderWorkingDirectory() {
        return readerWorkingDirectory;
    }

    public static String getFileTweetState() {
        return fileTweetState;
    }

    public static String getCityQuery() {
        return cityQuery;
    }

    public static Integer getNoOfDayBeforeToday() {
        return noOfDaysBeforeToday;
    }

    public static long getNoOfDaysBeforeToday() {
        return noOfDaysBeforeToday;
    }

    public static boolean isTwitterLogging() {
        return twitterLogging;
    }

}
