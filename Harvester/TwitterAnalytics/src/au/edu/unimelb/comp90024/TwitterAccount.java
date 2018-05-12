package au.edu.unimelb.comp90024;

import java.util.Date;
import java.util.logging.Logger;

/**
 * The TwitterAccount implement the status of one twitter account It stores the
 * credentials of a twitter account and tracks the waiting time of each account
 * and when it can be used to make the next search calls.
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class TwitterAccount {

    private final static Logger LOGGER = Logger
            .getLogger(TwitterAccount.class.getName());

    private String consumerKey;
    private String consumerSecret;
    private String accessToken;
    private String accessTokenSecret;
    private Date nextRetryTime;
    private int remainingSearchCalls;

    /**
     * @param consumerKey
     * @param consumerSecret
     * @param accessToken
     * @param accessTokenSecret
     */
    public TwitterAccount(String consumerKey, String consumerSecret,
            String accessToken, String accessTokenSecret) {
        super();
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
        this.nextRetryTime = new Date(0);
        this.remainingSearchCalls = 180;

    }

    /**
     * @return
     */
    public String getConsumerKey() {
        return consumerKey;
    }

    /**
     * @return
     */
    public String getConsumerSecret() {
        return consumerSecret;
    }

    /**
     * @return
     */
    public String getAccessToken() {
        return accessToken;
    }

    /**
     * @return
     */
    public String getAccessTokenSecret() {
        return accessTokenSecret;
    }

    /**
     * @return
     */
    public Date getNextRetryTime() {
        return nextRetryTime;
    }

    /**
     * @param nextRetryTime
     */
    public void setNextRetryTime(Date nextRetryTime) {
        this.nextRetryTime = nextRetryTime;
    }

    /**
     * @return
     */
    public int getRemainingSearchCalls() {
        return remainingSearchCalls;
    }

    /**
     * @param remainingCalls
     */
    public void setRemainingSearchCalls(int remainingCalls) {
        this.remainingSearchCalls = remainingCalls;
    }
}
