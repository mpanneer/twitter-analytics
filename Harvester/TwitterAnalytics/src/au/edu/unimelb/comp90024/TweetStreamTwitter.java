package au.edu.unimelb.comp90024;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import twitter4j.FilterQuery;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterObjectFactory;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;

public final class TweetStreamTwitter {
    private final static Logger LOGGER = Logger
            .getLogger(Configuration.class.getName());

    public static final int MAX_STREAM_BATCH_SIZE_FOR_PROCESSING = 500;

    // Unlike search, stream can be established only with one account
    private TwitterAccount streamingAccount;
    double boundingBox[][] = { { 143.5, -39.3 }, { 146.5, -36.3 } };
    String stateTag;
    boolean twitterLogging;

    private List<String> tweetJsons;

    public TweetStreamTwitter(TwitterAccount streamingAccount,
            double[][] boundingBox, String stateTag, boolean twitterLogging) {
        super();
        this.streamingAccount = streamingAccount;
        this.boundingBox = boundingBox;
        this.stateTag = stateTag;
        this.tweetJsons = new ArrayList<String>();
        this.twitterLogging = twitterLogging;
    }

    public void streamTweets() {

        LOGGER.log(Level.INFO, "Started streaming on....." + stateTag);

        StatusListener listener = new StatusListener() {
            @Override
            public void onStatus(Status status) {

                String json = TwitterObjectFactory.getRawJSON(status);
                LOGGER.log(Level.FINEST, "Streaming tweet: {0}", json);
                tweetJsons.add(json);
                if (tweetJsons.size() == MAX_STREAM_BATCH_SIZE_FOR_PROCESSING) {
                    TweetProcessor.handleTweets(tweetJsons, stateTag);
                    tweetJsons = new ArrayList<String>();
                    LOGGER.log(Level.FINE,
                            "Sent one stream batch for Post processing");
                }
            }

            @Override
            public void onDeletionNotice(
                    StatusDeletionNotice statusDeletionNotice) {
                LOGGER.log(Level.FINEST, "Got a status deletion notice id:"
                        + statusDeletionNotice.getStatusId());
            }

            @Override
            public void onTrackLimitationNotice(int numberOfLimitedStatuses) {
                LOGGER.log(Level.WARNING, "Got track limitation notice:"
                        + numberOfLimitedStatuses);
            }

            @Override
            public void onScrubGeo(long userId, long upToStatusId) {
                // Temporarily this will be handled manually
                LOGGER.log(Level.WARNING, "Got scrub_geo event userId:" + userId
                        + " upToStatusId:" + upToStatusId);
            }

            @Override
            public void onStallWarning(StallWarning warning) {
                LOGGER.log(Level.WARNING, "Got stall warning:" + warning);
            }

            @Override
            public void onException(Exception ex) {
                LOGGER.log(
                        Level.SEVERE, "Stream on " + stateTag
                                + " received an exception:" + ex.getMessage(),
                        ex);
            }
        };

        // Set up Twitter Account
        ConfigurationBuilder cb = new ConfigurationBuilder();
        cb.setDebugEnabled(twitterLogging).setJSONStoreEnabled(true)
                .setOAuthConsumerKey(streamingAccount.getConsumerKey())
                .setOAuthConsumerSecret(streamingAccount.getConsumerSecret())
                .setOAuthAccessToken(streamingAccount.getAccessToken())
                .setOAuthAccessTokenSecret(
                        streamingAccount.getAccessTokenSecret());

        TwitterStream twitterStream = new TwitterStreamFactory(cb.build())
                .getInstance();
        twitterStream.addListener(listener);

        // Establish the stream with the bounding box filter
        twitterStream.filter(new FilterQuery().locations(boundingBox));

    }
}