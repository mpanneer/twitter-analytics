package au.edu.unimelb.comp90024;

import java.io.IOException;
import java.util.List;

import org.json.JSONObject;

/**
 * The TweetWriter interface provides the framework for a generic TweetReader.
 * It can be implemented to write tweets to various targets like a couchdb, or a
 * file
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public interface TweetWriter {
    void writeTweets(List<JSONObject> tweetJsons) throws IOException;
}
