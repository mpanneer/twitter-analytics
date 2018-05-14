package au.edu.unimelb.comp90024;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.collect.Lists;

/**
 * The TweetWriterCouchdb class implements the TweetWriter interface It writes
 * batches of tweets to a Couchdb
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class TweetWriterCouchdb implements TweetWriter {

    private final static Logger LOGGER = Logger
            .getLogger(TweetWriterCouchdb.class.getName());

    private String couchTweetsDB;
    private String couchUserName;
    private String couchPassword;
    private int writeBatchSize;

    private TweetWriterCouchdb() {
    }

    // Writer Singleton
    private static TweetWriterCouchdb instance = null;

    /**
     * This returns a singleton object
     * 
     * @return
     */
    public static TweetWriterCouchdb getInstance() {
        if (instance == null) {
            instance = new TweetWriterCouchdb();
        }
        return instance;
    }

    /**
     * Sets up a writer
     * 
     * @param couchTweetsDB
     * @param couchUserName
     * @param couchPassword
     * @param writeBatchSize
     */
    public void init(String couchTweetsDB, String couchUserName,
            String couchPassword, int writeBatchSize) {
        this.couchTweetsDB = couchTweetsDB;
        this.couchUserName = couchUserName;
        this.couchPassword = couchPassword;
        this.writeBatchSize = writeBatchSize;
    }

    /*
     * Implements the writeTweets function adds the twitter Id ot the object to
     * avoid duplicates
     * 
     * @see au.edu.unimelb.comp90024.TweetWriter#writeTweets(java.util.List)
     */
    @Override
    public void writeTweets(List<JSONObject> tweetJsons) {
        LOGGER.log(Level.FINE, "Received tweet batch to Write to Couch.....");

        List<JSONObject> tweetJsonsWithId = new ArrayList<JSONObject>();

        // add id attribute for the tweets (to avoid duplicates in couch)
        for (JSONObject tweetJsonObj : tweetJsons) {
            String tweetid = tweetJsonObj.getString("id_str");
            tweetJsonObj.put("_id", tweetid);
            tweetJsonsWithId.add(tweetJsonObj);
        }
        writeCouchDocuments(tweetJsonsWithId);
    }

    /**
     * split couch documents into batches that couch can handle
     * 
     * @param jsons
     */
    public void writeCouchDocuments(List<JSONObject> jsons) {
        List<List<JSONObject>> batches = Lists.partition(jsons, writeBatchSize);
        for (List<JSONObject> batch : batches) {
            JSONObject bulkRequest = new JSONObject();
            JSONArray tweets = new JSONArray();

            for (JSONObject tweetJsonObj : batch) {
                tweets.put(tweetJsonObj);
            }
            bulkRequest.put("docs", tweets);
            pushCouchDB(bulkRequest);
        }
    }

    /**
     * log a http request to couch
     * 
     * @param request
     */
    public void logRequest(HttpPost request) {
        LOGGER.log(Level.FINEST, "Request is : " + request);
        Header[] headers = request.getAllHeaders();
        String content = "";
        try {
            content = EntityUtils.toString(request.getEntity());
        } catch (ParseException e) {
            LOGGER.log(Level.FINEST, e.getMessage(), e);
        } catch (IOException e) {
            LOGGER.log(Level.FINEST, e.getMessage(), e);
        }

        for (Header header : headers) {
            LOGGER.log(Level.FINEST, "{0}: {1}",
                    new Object[] { header.getName(), header.getValue() });
        }
        LOGGER.log(Level.FINEST, content);

    }

    /**
     * Push a bulk request to couchdb
     * 
     * @param bulkRequest
     */
    public void pushCouchDB(JSONObject bulkRequest) {
        String responseString = null;
        LOGGER.log(Level.INFO, "Pushing data to couch");
        try {
            HttpClient httpClient = new DefaultHttpClient();
            HttpPost request = new HttpPost(couchTweetsDB + "/_bulk_docs");
            HttpConnectionParams.setConnectionTimeout(httpClient.getParams(),
                    10000);
            HttpResponse response;
            StringEntity requestBody;

            requestBody = new StringEntity(bulkRequest.toString(), "UTF-8");

            byte[] encodedBytes = Base64.encodeBase64(
                    (couchUserName + ":" + couchPassword).getBytes());

            if (couchUserName.trim().length() > 0
                    && couchPassword.trim().length() > 0)
                request.setHeader("Authorization",
                        "Basic " + new String(encodedBytes));
            request.addHeader("accept", "application/json");
            request.addHeader("content-type", "application/json");
            request.setEntity(requestBody);
            logRequest(request);

            LOGGER.log(Level.FINER, "Sending Couch a Request");
            response = httpClient.execute(request);
            HttpEntity entity = response.getEntity();
            responseString = EntityUtils.toString(entity, "UTF-8");
            LOGGER.log(Level.FINER, "Recieved Couch Response");
            LOGGER.log(Level.FINEST, "Response: {0}", responseString);

        } catch (UnsupportedEncodingException e) {
            LOGGER.log(Level.SEVERE,
                    "TweetWriter Couch experienced Encoding Exception "
                            + e.getMessage(),
                    e);

        } catch (ClientProtocolException e) {
            LOGGER.log(Level.SEVERE,
                    "TweetWriter Couch experienced ClientProtocol Exception "
                            + e.getMessage(),
                    e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE,
                    "TweetWriter Couch experienced IOException "
                            + e.getMessage(),
                    e);
        } catch (ParseException e) {
            LOGGER.log(Level.SEVERE,
                    "TweetWriter Couch experienced ParseException "
                            + e.getMessage(),
                    e);
        }
    }

}
