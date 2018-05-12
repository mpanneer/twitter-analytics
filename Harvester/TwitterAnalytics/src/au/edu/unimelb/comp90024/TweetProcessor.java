package au.edu.unimelb.comp90024;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * The TweetProcessor class is used for any post processing of tweets once read
 * from a source. It can filter out tweets with only geoObjects, call a
 * reverseGeo API and writes information like geoTagging, puts in other details
 * like type of document, state,etc
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class TweetProcessor extends Thread {
    private final static Logger LOGGER = Logger
            .getLogger(TweetProcessor.class.getName());

    public static final int MAX_THREAD_COUNT = 20;
    public static final int SLEEP_TIME_ON_MAX_THREADS_MSEC = 1000;

    // Static Thread management data
    private static long threadCounter;
    private static AtomicInteger activeThreads;

    // Static Post Processing Data
    private static TweetWriter writer;
    private static boolean filterGeoTweets;
    private static boolean enableGeoTagging;
    private static String ReverseGeocodeURL;
    private static boolean enableStateTagging;
    private static boolean enableDocTypeTagging;

    // Thread Data
    private List<String> tweetJsons;
    private String tweetState;

    /**
     * Construction to setup a Tweet Processor
     * 
     * @param tweetJsons
     * @param searchQueryState
     */
    public TweetProcessor(List<String> tweetJsons, String searchQueryState) {
        this.tweetJsons = tweetJsons;
        this.tweetState = searchQueryState;
    }

    /**
     * This function is an helper to load its configuration from the Config
     * class
     */
    public static void loadPostProcessorConfig() {
        filterGeoTweets = Configuration.isFilterGeoTweets();
        enableGeoTagging = Configuration.isEnableGeoTagging();
        ReverseGeocodeURL = Configuration.getReverseGeocodeURL();
        enableStateTagging = Configuration.isEnableStateTagging();
        enableDocTypeTagging = Configuration.isEnableDocTypeTagging();

        if (activeThreads == null)
            activeThreads = new AtomicInteger(0);
    }

    /**
     * This gives the flexibility to the Processor to push its content to
     * various writers (file/couch etc)
     * 
     * @param writer
     */
    public static void loadWriter(TweetWriter writer) {
        TweetProcessor.writer = writer;
    }

    /**
     * Its the function used for processing tweets by readers.
     * 
     * @param tweetJsons
     * @param searchQueryState
     */
    public static void handleTweets(List<String> tweetJsons,
            String searchQueryState) {
        // Handle to make sure we dont overflow threads
        LOGGER.log(Level.FINE, "PostProcessing batch of Tweets from Reader");

        while (activeThreads.get() > MAX_THREAD_COUNT) {
            try {
                Thread.sleep(SLEEP_TIME_ON_MAX_THREADS_MSEC);
            } catch (InterruptedException e) {
                LOGGER.log(Level.SEVERE,
                        "Postprocessor Thread Interrupted when waiting "
                                + e.getMessage(),
                        e);

            }
        }

        TweetProcessor tweetProcessor = new TweetProcessor(tweetJsons,
                searchQueryState);
        tweetProcessor.setName("Processor" + (++threadCounter));
        tweetProcessor.start();
        activeThreads.getAndIncrement();
    }

    /*
     * Implements a thread for Post Processing a batch of Tweet Objects sent by
     * a reader
     * 
     * @see java.lang.Thread#run()
     */
    @Override
    public void run() {
        LOGGER.log(Level.FINE, "Starting Thread....." + this.getName());
        JSONObject tweet = null;
        JSONObject geoTaggedTweet;
        List<JSONObject> postProcessedTweets = new ArrayList<JSONObject>();
        for (String json : tweetJsons) {

            try {
                tweet = new JSONObject(json);
            } catch (JSONException e) {
                LOGGER.log(Level.WARNING, "Invalid Json detected :" + json, e);
                continue;
            }
            if (filterGeoTweets && getTweetLatLong(tweet) == null)
                continue;

            // Document Type
            if (enableDocTypeTagging)
                tweet.put("type", "Tweet");

            // State Tag
            if (enableStateTagging)
                tweet.put("stateTag", tweetState);

            // Sentiment Tag Stub
            /*
             * String sentiments[]= {"Happy", "Sad", "Neutral"}; int rnd = new
             * Random().nextInt(sentiments.length); tweet.put("sentimentTag",
             * sentiments[rnd]);
             */

            // Geo Tag
            if (enableGeoTagging) {
                geoTaggedTweet = geoTagTweet(tweet);
                postProcessedTweets.add(geoTaggedTweet);
            } else {
                postProcessedTweets.add(tweet);
            }
        }

        if (postProcessedTweets.size() > 0) {
            try {
                writer.writeTweets(postProcessedTweets);
                LOGGER.log(Level.FINER, "Processor has sent Tweets to Writer");

            } catch (IOException e) {
                LOGGER.log(Level.SEVERE,
                        "IO Issue encountered with writer " + e.getMessage(),
                        e);
                System.exit(1);
            }
        }
        activeThreads.getAndDecrement();
        LOGGER.log(Level.FINE, "Finishing Thread....." + this.getName());
    }

    /**
     * This checks a Tweet object for hte presence of geo object with latitude
     * and longitude coordinates
     * 
     * @param tweet
     * @return
     */
    public Double[] getTweetLatLong(JSONObject tweet) {
        Double[] latLong = null;
        try {
            Double latitude = tweet.getJSONObject("geo")
                    .getJSONArray("coordinates").getDouble(0);
            Double longitude = tweet.getJSONObject("geo")
                    .getJSONArray("coordinates").getDouble(1);
            latLong = new Double[2];
            latLong[0] = latitude;
            latLong[1] = longitude;
            return latLong;
        } catch (JSONException e) {
            LOGGER.log(Level.FINEST,
                    "No Lat Long found in the Tweet -" + tweet);

        }
        return latLong;

    }

    /**
     * This function puts a tag with the suburb and street details obtained from
     * a reverse geodecoder
     * 
     * @param tweet
     * @return
     */
    public JSONObject geoTagTweet(JSONObject tweet) {
        JSONObject geoTaggedTweet = new JSONObject(tweet.toString());
        Double[] latLong = getTweetLatLong(tweet);
        if (latLong != null) {
            JSONObject geoTag = reverseGeoCode(latLong[0], latLong[1]);
            geoTaggedTweet.put("geoTag", geoTag);
        }
        return geoTaggedTweet;
    }

    /**
     * The function assists in reverse geocoding a pair of latitude and
     * longitude coordinates
     * 
     * @param latitude
     * @param longitude
     * @return
     */
    public JSONObject reverseGeoCode(Double latitude, Double longitude) {
        JSONObject geoTag = null;

        Object[] params = new Object[] { latitude, longitude };
        String url = MessageFormat.format(ReverseGeocodeURL, params);
        try {
            JSONObject reverseGeo = new JSONObject(Util.doGetHttp(url));
            LOGGER.log(Level.FINEST, "ReverseGeo with [{0},{1}] : {2}",
                    new Object[] { params[0], params[1], reverseGeo });
            String streetAddress = null;
            if (reverseGeo.get("staddress") instanceof String)
                streetAddress = reverseGeo.getString("staddress");
            GeoTag tag = new GeoTag(streetAddress, reverseGeo.getString("city"),
                    reverseGeo.getString("prov"),
                    reverseGeo.getString("country"));
            geoTag = new JSONObject(tag);

        } catch (JSONException e) {
            // All ReverseGeo missing data exceptions
            LOGGER.log(Level.FINEST,
                    "Issue with ReverseGeo response -" + e.getMessage(), e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE,
                    "Issue with Invoking Reverse Geo API " + e.getMessage(), e);
            System.exit(1);
        }

        return geoTag;
    }

}
