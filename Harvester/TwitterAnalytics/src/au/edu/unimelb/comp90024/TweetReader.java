package au.edu.unimelb.comp90024;

/**
 * The TweetReader interface provides the framework for a generic TweetReader.
 * It can be implemented to read tweets from various sources like Twitter
 * itself, or a couchdb, or a file
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public interface TweetReader {
    public void harvestTweets();

}
