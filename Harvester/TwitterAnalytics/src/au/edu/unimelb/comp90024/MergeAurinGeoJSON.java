package au.edu.unimelb.comp90024;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * The MergeAurinGeoJSON class is used to upload Suburb related documents into
 * Couch. This will merge information from AURIN along with geographical
 * information (geoJson) documents about the suburb. This information will be
 * used to perform a correlative analysis with Twitter Sentiments
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class MergeAurinGeoJSON {

    private final static Logger LOGGER = Logger
            .getLogger(MergeAurinGeoJSON.class.getName());

    /**
     * Method uses two files the GeoJson file for all suburbs in a state along
     * with the demographic data from AURIN. It combines and uploads them It was
     * used for just one time loads, hence it is not very flexible It will
     * finally upload data into couchdb
     * 
     * @param args
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {
        String nswAurinJSON = Util.readFile(
                "C:\\Users\\msatyam\\Documents\\CC\\AURIN\\NSW_JSON\\data1607887611930028619.json");
        String nswGeoJSON = Util
                .readFile("C:\\Users\\msatyam\\Documents\\CC\\AURIN\\nsw.json");
        List<JSONObject> nswSuburbs = mergeAurinGeoJson(nswAurinJSON,
                nswGeoJSON, "nsw");

        String vicAurinJSON = Util.readFile(
                "C:\\Users\\msatyam\\Documents\\CC\\AURIN\\VIC_JSON\\data3750039501434406414.json");
        String vicGeoJSON = Util
                .readFile("C:\\Users\\msatyam\\Documents\\CC\\AURIN\\vic.json");

        List<JSONObject> vicSuburbs = mergeAurinGeoJson(vicAurinJSON,
                vicGeoJSON, "vic");

        // Util.printList("NSW Suburbs", nswSuburbs);
        // Util.printList("VIC Suburbs", vicSuburbs);
        String couchTweetsDB = Configuration.getCouchTweetsDB();
        String couchUserName = Configuration.getCouchUserName();
        String couchPassword = Configuration.getCouchPassword();
        int writeBatchSize = Configuration.getWriteBatchSize();

        TweetWriterCouchdb writer = TweetWriterCouchdb.getInstance();
        writer.init(couchTweetsDB, couchUserName, couchPassword,
                writeBatchSize);
        writer.writeCouchDocuments(nswSuburbs);
        writer.writeCouchDocuments(vicSuburbs);

    }

    /**
     * Theis function takes both file names along with the state where they are
     * from and prepares a list of JSON objects to be uploaded into Couch
     * 
     * @param aurinFile
     * @param geoJsonFile
     * @param statePrefix
     * @return
     */
    public static List<JSONObject> mergeAurinGeoJson(String aurinFile,
            String geoJsonFile, String statePrefix) {
        List<JSONObject> geoCodedSuburbList;
        JSONObject aurin = new JSONObject(aurinFile);
        JSONObject geo = new JSONObject(geoJsonFile);
        Set<String> suburbsList = new HashSet<String>();

        Map<Long, JSONObject> suburbs = new LinkedHashMap<Long, JSONObject>();
        JSONArray aurincities = aurin.getJSONArray("features");
        for (int i = 0; i < aurincities.length(); i++) {

            JSONObject city = aurincities.getJSONObject(i)
                    .getJSONObject("properties");
            long suburbCode = city.getLong("SSC2011"); // "SSC2011":20001
            long uniStudentPercent = Math.round(city.getDouble("uni") * 100); // 0.479857,
            long percentEmployed = Math
                    .round(city.getDouble("emp_to_pop") * 100); // "emp_to_pop":0.725321,
            long medianIncome = Math.round(city.getDouble("median11")); // "median11":55477.0404,
            String sSCName = city.getString("SSC_NAME"); // "SSC_NAME":"Abbotsford
                                                         // (Vic.)",
            long yearTwelvePassPercent = Math
                    .round((1 - city.getDouble("y12")) * 100); // "y12":0.343181,

            String suburb = sSCName
                    .substring(0,
                            sSCName.indexOf("(") < 0 ? sSCName.length()
                                    : sSCName.indexOf("("))
                    .toLowerCase().replace(" ", "");
            if (suburbsList.contains(suburb)) {
                suburb = sSCName.toLowerCase().replace(" ", "");
            }
            String type = "Suburb";
            JSONObject suburbJSON = new JSONObject(new Suburb(uniStudentPercent,
                    percentEmployed, medianIncome, sSCName,
                    yearTwelvePassPercent, suburbCode, type, suburb));
            suburbJSON.put("_id", statePrefix + "-" + suburb);
            suburbJSON.put("state", statePrefix);
            suburbs.put(suburbCode, suburbJSON);
            suburbsList.add(suburb);

        }

        JSONArray geocities = geo.getJSONArray("features");
        for (int i = 0; i < geocities.length(); i++) {
            long suburbCode = Long.parseLong(
                    geocities.getJSONObject(i).getJSONObject("properties")
                            .getString("SSC_CODE").substring(3));
            JSONObject geoCoordinates = geocities.getJSONObject(i)
                    .getJSONObject("geometry");
            try {
                suburbs.get(suburbCode).put("geometry", geoCoordinates);
            } catch (NullPointerException e) {
                LOGGER.log(Level.SEVERE,
                        "Suburb in Geo Data not found in AURIN data "
                                + e.getMessage(),
                        e);
            }
        }

        for (Map.Entry<Long, JSONObject> suburb : suburbs.entrySet()) {
            LOGGER.log(Level.FINEST, "added suburb : "
                    + (suburb.getValue().getString("suburbName")));
        }

        geoCodedSuburbList = new ArrayList<JSONObject>(suburbs.values());
        return geoCodedSuburbList;
    }

}
