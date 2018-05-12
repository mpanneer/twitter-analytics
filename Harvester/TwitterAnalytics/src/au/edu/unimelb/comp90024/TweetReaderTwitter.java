package au.edu.unimelb.comp90024;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import twitter4j.Query;
import twitter4j.Query.ResultType;
import twitter4j.QueryResult;
import twitter4j.RateLimitStatus;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.TwitterObjectFactory;
import twitter4j.conf.ConfigurationBuilder;

/**
 * The TweetReaderTwitter class implements the TweetReader interface It reads
 * batches of tweets from twitter. The batch size is already limited by Twitter
 * to a 100
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class TweetReaderTwitter implements TweetReader {

    private final static Logger LOGGER = Logger
            .getLogger(TweetReaderTwitter.class.getName());

    private static final int MAX_TWEETS_PER_SESSION = 100;

    TwitterAccount[] accountPool;
    private int currentTwitterAccountIndex;

    private String searchQuery;
    private String searchQueryState;
    private String direction;
    private boolean debug;
    private Long referenceTweetId, originalReferenceTweetId;
    private String referenceDate;

    /**
     * Sets up a Tweet Reader from Twitter with the following parameters
     * 
     * @param accountPool
     * @param query
     * @param direction
     * @param referenceId
     * @param noOfDayBeforeToday
     * @param debug
     * @param searchQueryState
     */
    public TweetReaderTwitter(TwitterAccount[] accounts, String query,
            String direction, Long referenceId, Integer noOfDayBeforeToday,
            boolean debug, String searchQueryState) {
        this.accountPool = accounts;
        this.searchQuery = query;
        this.direction = direction;
        this.referenceTweetId = referenceId;
        this.debug = debug;
        this.currentTwitterAccountIndex = 0;
        this.searchQueryState = searchQueryState;
        if (referenceId == null) {
            if (direction.equals("Reverse"))
                this.referenceTweetId = Long.MAX_VALUE;
            else
                this.referenceTweetId = Long.MIN_VALUE;
        }
        this.originalReferenceTweetId = referenceTweetId.longValue();

        if (noOfDayBeforeToday != null) {
            final Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, -(noOfDayBeforeToday));
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            referenceDate = dateFormat.format(cal.getTime());

        }

    }

    /**
     * This function determines the account to be used from the pool, which has
     * the least waiting Time associated with it because of rate limiting by
     * twitter
     * 
     * @return
     */
    public int findNextAccountMinWaitTime() {

        int minWaitTimeAccountIndex = -1;
        long minWaitTime = Long.MAX_VALUE;

        int currIndex = 0;
        for (TwitterAccount account : accountPool) {
            long waitTime = account.getNextRetryTime().getTime()
                    - System.currentTimeMillis();
            LOGGER.log(Level.FINEST,
                    "Twitter Account number [{0}] Next Retry at {1} Wait Time: {2}",
                    new Object[] { currIndex, account.getNextRetryTime(),
                            waitTime });

            if (waitTime <= 0)
                return currIndex;
            else if (waitTime < minWaitTime) {
                LOGGER.log(Level.FINEST,
                        "Old Min Wait Time {0} New min wait time {1}",
                        new Object[] { minWaitTime, waitTime });
                minWaitTime = waitTime;
                minWaitTimeAccountIndex = currIndex;
            }
            currIndex++;
        }
        return minWaitTimeAccountIndex;
    }

    /**
     * This function returns a Twitter4J Twitter account object to be used for
     * running the queries
     * 
     * @return
     */
    public Twitter getTwitterAccount() {

        ConfigurationBuilder cb = new ConfigurationBuilder();
        cb.setJSONStoreEnabled(true).setDebugEnabled(debug)
                .setOAuthConsumerKey(
                        accountPool[currentTwitterAccountIndex].getConsumerKey())
                .setOAuthConsumerSecret(accountPool[currentTwitterAccountIndex]
                        .getConsumerSecret())
                .setOAuthAccessToken(
                        accountPool[currentTwitterAccountIndex].getAccessToken())
                .setOAuthAccessTokenSecret(accountPool[currentTwitterAccountIndex]
                        .getAccessTokenSecret());
        Twitter twitter = new TwitterFactory(cb.build()).getInstance();
        return twitter;
    }

    /**
     * This method will flip to a new account - which can be used immediately or
     * has the shortest waiting time. In the latter case it will cause the
     * harvestor to sleep
     */
    public void manageTwitterAccount() {
        this.currentTwitterAccountIndex = findNextAccountMinWaitTime();
        long waitTime = accountPool[currentTwitterAccountIndex].getNextRetryTime()
                .getTime() - System.currentTimeMillis() + 30000;
        try {
            if (waitTime > 0) {
                LOGGER.log(Level.INFO, "Harvestor will queue up for {0} secs ",
                        (waitTime / 1000));
                Thread.sleep(waitTime);
                LOGGER.log(Level.INFO, "Harvestor has woken up.. ");
            }
        } catch (InterruptedException e) {
            LOGGER.log(Level.SEVERE,
                    "TweetReaderTwitter Thread Interrupted when waiting "
                            + e.getMessage(),
                    e);
            LOGGER.log(Level.SEVERE, "Reference ID was " + referenceTweetId);
            System.exit(-1);
        }
    }

    /**
     * sets the reference id on a query
     * 
     * @param query
     */
    public void setQueryReferenceId(Query query) {
        if (direction.equals("Reverse"))
            query.setMaxId(referenceTweetId);
        else
            query.setSinceId(referenceTweetId);

    }

    /**
     * sets the reference date on a query
     * 
     * @param query
     */
    public void setQueryReferenceDate(Query query) {
        if (direction.equals("Reverse"))
            query.setUntil(referenceDate);
        else
            query.setSince(referenceDate);
    }

    /*
     * this function helps in harvesting the tweets from Twitter
     * 
     * @see au.edu.unimelb.comp90024.TweetReader#harvestTweets()
     */
    public void harvestTweets() {

        LOGGER.log(Level.INFO, "Harvesting Tweets from Twitter");

        Query query = null;
        Twitter twitterAccount = null;

        // Each iterations represents one Search API Call to Twitter
        while (true) {
            // Grab an account to use if current account expired
            if (accountPool[currentTwitterAccountIndex]
                    .getRemainingSearchCalls() <= 0) {
                manageTwitterAccount();
                twitterAccount = getTwitterAccount();
            }

            try {
                QueryResult result;

                // Initialize a fresh query
                if (query == null) {
                    query = new Query(searchQuery);
                    // get the recent tweets only
                    query.setResultType(ResultType.recent);
                    query.setCount(MAX_TWEETS_PER_SESSION);

                    // Reset query with new reference
                    if (originalReferenceTweetId != Long.MAX_VALUE) {
                        setQueryReferenceId(query);
                    } else if (referenceDate != null
                            && referenceDate.trim().length() > 0) {
                        setQueryReferenceDate(query);
                    } else {
                        setQueryReferenceId(query);
                    }
                }

                // Handle to check if currentTwitter account is still valid
                // before query
                if (twitterAccount == null) {
                    twitterAccount = getTwitterAccount();
                }

                result = twitterAccount.search(query);
                if (result != null) {
                    List<Status> tweets = result.getTweets();
                    List<String> tweetJsons = new ArrayList<String>();
                    Long referenceIdBeforeSearch = referenceTweetId.longValue();
                    for (Status tweet : tweets) {
                        String json = TwitterObjectFactory.getRawJSON(tweet);
                        tweetJsons.add(json);

                        // Track Reference to keep a track across sessions
                        if (direction.equals("Reverse")
                                && tweet.getId() < referenceTweetId)
                            referenceTweetId = tweet.getId();
                        else if (direction.equals("Forward")
                                && tweet.getId() > referenceTweetId)
                            referenceTweetId = tweet.getId();

                    }

                    // Reset search if we have hit our limits
                    // this will now retrieve results which were not returned
                    // during the initial scan
                    if (referenceIdBeforeSearch.equals(referenceTweetId)
                            && result != null) {
                        this.referenceTweetId = originalReferenceTweetId;
                        query.setResultType(ResultType.recent);
                        query.setCount(MAX_TWEETS_PER_SESSION);
                        setQueryReferenceId(query);
                        LOGGER.log(Level.INFO,
                                "the Search Reached the 7 day limit it will now restart from inital reference point");
                        continue;
                    }

                    // Handle Tweets Collected
                    TweetProcessor.handleTweets(tweetJsons, searchQueryState);
                }

                if (result != null) {
                    query = result.nextQuery();
                    RateLimitStatus status = result.getRateLimitStatus();
                    if (status != null) {
                        Integer resetTimeEpoch = status.getResetTimeInSeconds();
                        Date nextRetryTime = new Date(
                                Long.valueOf(resetTimeEpoch.longValue())
                                        * 1000);
                        accountPool[currentTwitterAccountIndex]
                                .setNextRetryTime(nextRetryTime);
                        accountPool[currentTwitterAccountIndex]
                                .setRemainingSearchCalls(status.getRemaining());
                    }

                }
            } catch (TwitterException te) {

                if (te != null
                        && te.getErrorMessage().equals("Rate limit exceeded")) {
                    LOGGER.log(Level.FINER,
                            "Harvestor Thread Rate Limit Exceeded "
                                    + te.getMessage(),
                            te);
                    RateLimitStatus status = te.getRateLimitStatus();
                    Integer resetTimeEpoch = status.getResetTimeInSeconds();
                    Date nextRetryTime = new Date(
                            Long.valueOf(resetTimeEpoch.longValue()) * 1000);
                    accountPool[currentTwitterAccountIndex]
                            .setNextRetryTime(nextRetryTime);
                    accountPool[currentTwitterAccountIndex]
                            .setRemainingSearchCalls(status.getRemaining());
                    continue;
                }
                LOGGER.log(Level.SEVERE,
                        "Harvestor Thread experienced Twitter Exception "
                                + te.getMessage(),
                        te);
                LOGGER.log(Level.SEVERE,
                        "Reference ID was " + referenceTweetId);

                fallAsleepOnError(60);
            } catch (NullPointerException e) {
                LOGGER.log(Level.SEVERE,
                        "Harvestor Thread experienced NullPointer Exception "
                                + e.getMessage(),
                        e);
                LOGGER.log(Level.SEVERE,
                        "Reference ID was " + referenceTweetId);

                fallAsleepOnError(60);
                query = null; // reset query
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE,
                        "Harvestor Thread experienced Generic Exception "
                                + e.getMessage(),
                        e);
                LOGGER.log(Level.SEVERE,
                        "Reference ID was " + referenceTweetId);
                fallAsleepOnError(60);
                query = null; // reset query
            }
        }

    }

    /**
     * This function is used to wait and retry after a set time when exceptions
     * are encountered.
     * 
     * @param waitTimeSecs
     */
    public void fallAsleepOnError(int waitTimeSecs) {
        LOGGER.log(Level.INFO,
                "Harvestor hit an error, will queue up for {0} secs and retry..",
                waitTimeSecs);
        try {
            Thread.sleep(waitTimeSecs * 1000);
        } catch (InterruptedException e) {
            LOGGER.log(Level.SEVERE,
                    "TweetReaderTwitter Thread Interrupted when waiting "
                            + e.getMessage(),
                    e);
            LOGGER.log(Level.SEVERE, "Reference ID was " + referenceTweetId);
        }
    }

}
