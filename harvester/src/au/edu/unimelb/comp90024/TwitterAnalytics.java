package au.edu.unimelb.comp90024;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import twitter4j.TwitterException;

/**
 * The TwitterAnalytics class provides the main class for the application. It
 * assists in loading configuration and then setting up readers,processors and
 * writers of the tweets. It then kicks of a production line of tweet processing
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class TwitterAnalytics {

    private final static Logger LOGGER = Logger
            .getLogger(TwitterAnalytics.class.getName());

    /**
     * usage of the applications
     */
    public static void printUsageTwitterAnalytics() {
        System.out.println("Usage: program configfile");
        System.out.println(
                "       configfile location of config file to run the app");
        LOGGER.log(Level.SEVERE, "Invalid Startup Commands issues");
        System.exit(0);
    }

    /**
     * Function to setup TweetReaderTwitter
     */
    public static void processTwitterTweets() {

        String queryState = Configuration.getCityQuery();
        String query = Configuration.getCityQueryMap().get(queryState);

        if (query == null || (query.trim().length() == 0) || queryState == null
                || queryState.trim().length() == 0) {
            System.out.println(
                    "Invalid City Query in Configuration. Please check");
            System.exit(1);
        }

        Long referenceTwitterID = Configuration.getReferenceId();
        Integer noOfDayBeforeToday = Configuration.getNoOfDayBeforeToday();

        String key[] = Configuration.getKey();
        String secret[] = Configuration.getSecret();
        String token[] = Configuration.getToken();
        String tokenSecret[] = Configuration.getTokenSecret();
        String direction = Configuration.getDirection();
        boolean twitterLogging = Configuration.isTwitterLogging();

        TwitterAccount[] accounts = new TwitterAccount[key.length];

        for (int i = 0; i < accounts.length; i++) {
            accounts[i] = new TwitterAccount(key[i], secret[i], token[i],
                    tokenSecret[i]);
        }

        TweetReaderTwitter harvestorOne = new TweetReaderTwitter(accounts,
                query, direction, referenceTwitterID, noOfDayBeforeToday,
                twitterLogging, queryState);
        harvestorOne.harvestTweets();
    }

    /**
     * Function to setup TweetStreamTwitter
     */
    public static void processTwitterStream() {

        String queryState = Configuration.getCityQuery();
        double[][] queryStateBoundingBox = {};
        try {
            queryStateBoundingBox = Configuration.getCityStreamMap()
                    .get(queryState);
        } catch (NullPointerException e) {
            System.out.println(
                    "Invalid City Query in Configuration. Please check");
            System.exit(1);
        }

        // Stream can happen only with one account, hence first set of
        // credentials will be chosen
        String key = Configuration.getKey()[0];
        String secret = Configuration.getSecret()[0];
        String token = Configuration.getToken()[0];
        String tokenSecret = Configuration.getTokenSecret()[0];
        boolean twitterLogging = Configuration.isTwitterLogging();

        TwitterAccount account = new TwitterAccount(key, secret, token,
                tokenSecret);

        TweetStreamTwitter streamerOne = new TweetStreamTwitter(account,
                queryStateBoundingBox, queryState, twitterLogging);
        streamerOne.streamTweets();
    }

    /**
     * Function to setup TweetReaderFile
     */
    private static void processFileTweets() {
        String readDirectory = Configuration.getReaderReadDirectory();
        String workingDirectory = Configuration.getReaderWorkingDirectory();
        String fileTweetState = Configuration.getCityQuery();
        String readFileExtension = Configuration.getReadFileExtension();

        TweetReaderFile harvestorOne = new TweetReaderFile(readDirectory,
                workingDirectory, readFileExtension, fileTweetState);
        harvestorOne.harvestTweets();

    }

    /**
     * Function to setup TweetWriterFile
     * 
     * @throws IOException
     */
    private static void setUpWriter() {
        String writeMode = Configuration.getWriteMode();
        int writeBatchSize = Configuration.getWriteBatchSize();

        if (writeMode.equalsIgnoreCase("file")) {
            String workingDirectory = Configuration.getWorkingDirectory();
            String outboundDirectory = Configuration.getOutboundDirectory();
            String writeFileExtension = Configuration.getWriteFileExtension();
            TweetWriterFile writer = TweetWriterFile.getInstance();

            try {
                writer.init(workingDirectory, outboundDirectory,
                        writeFileExtension, writeBatchSize);
            } catch (IOException e) {
                System.out.println(
                        "Invalid Writer Configuration in Config File. Check Log for more details");
                LOGGER.log(Level.SEVERE,
                        "IO Exception thrown when setting up Writer"
                                + e.getMessage(),
                        e);
            }
            TweetProcessor.loadWriter(writer);
        } else if (writeMode.equalsIgnoreCase("couchdb")) {
            String couchTweetsDB = Configuration.getCouchTweetsDB();
            String couchUserName = Configuration.getCouchUserName();
            String couchPassword = Configuration.getCouchPassword();
            TweetWriterCouchdb writer = TweetWriterCouchdb.getInstance();
            writer.init(couchTweetsDB, couchUserName, couchPassword,
                    writeBatchSize);
            TweetProcessor.loadWriter(writer);
        } else {
            System.out.println("Invalid writeMode in Config File");
            LOGGER.log(Level.SEVERE,
                    "Program could not be initialized. Invalid Write Mode in config ");
            System.exit(1);
        }
    }

    /**
     * Main Function 1. loads configuration. 2. sets up reader 3. sets up a
     * processor 4. sets up a writer
     * 
     * @param args
     * @throws IOException
     * @throws TwitterException
     */
    public static void main(String[] args) {

        if (args.length == 1) {
            Configuration.loadConfig(args[0]);
        } else {
            printUsageTwitterAnalytics();
        }

        // Setup a Tweet TweetProcessor
        TweetProcessor.loadPostProcessorConfig();

        // Setup a TweetWriter
        TwitterAnalytics.setUpWriter();

        String tweetSource = Configuration.getTweetSource();

        if (tweetSource.equalsIgnoreCase("Twitter")) {
            processTwitterTweets();
        } else if (tweetSource.equalsIgnoreCase("File")) {
            processFileTweets();
        } else if (tweetSource.equalsIgnoreCase("Stream")) {
            processTwitterStream();
        } else {
            System.out.println("Invalid tweetSource in Config File");
            LOGGER.log(Level.SEVERE,
                    "Program could not be initialized. Invalid tweetSource in config ");
            System.exit(1);
        }

    }
}
