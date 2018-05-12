package au.edu.unimelb.comp90024;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.io.FilenameUtils;
import org.json.JSONObject;

/**
 * The TweetWriterFile class implements the TweetWriter interface It writes
 * batches of tweets to a file
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
/**
 * @author msatyam
 *
 */
public class TweetWriterFile implements TweetWriter {

    private final static Logger LOGGER = Logger
            .getLogger(TweetWriterFile.class.getName());

    // File Details if writing to file
    private File workingDirectory;
    private File outboundDirectory;
    private String writeFileExtension = "-tweets.txt";
    private int writeBatchSize;
    private File currentFile;
    private Integer currentFileSize;
    private volatile BufferedWriter bw;
    private volatile OutputStreamWriter ow;
    private volatile FileOutputStream fo;

    // Writer Singleton
    private static volatile TweetWriterFile instance = null;

    private TweetWriterFile() {
    }

    /**
     * @return
     */
    public static TweetWriterFile getInstance() {
        if (instance == null) {
            instance = new TweetWriterFile();
        }
        return instance;
    }

    /**
     * @param writeDirectory
     * @param outboundDirectory
     * @param writeFileExtension
     * @param writeBatchSize
     * @throws IOException
     */
    /**
     * @param writeDirectory
     * @param outboundDirectory
     * @param writeFileExtension
     * @param writeBatchSize
     * @throws IOException
     */
    public void init(String writeDirectory, String outboundDirectory,
            String writeFileExtension, int writeBatchSize) throws IOException {
        this.workingDirectory = new File(writeDirectory);
        this.outboundDirectory = new File(outboundDirectory);
        this.writeFileExtension = writeFileExtension;
        this.writeBatchSize = writeBatchSize;
        this.currentFile = File.createTempFile("Tweet", writeFileExtension,
                this.workingDirectory);
        this.currentFileSize = 0;

        fo = new FileOutputStream(currentFile.getAbsolutePath());
        ow = new OutputStreamWriter(fo, StandardCharsets.UTF_8);
        bw = new BufferedWriter(ow);

        Runtime.getRuntime()
                .addShutdownHook(new Thread("writer-shutdown-hook") {
                    @Override
                    public void run() {
                        if (bw != null) {
                            try {
                                fo.close();
                                ow.close();
                                bw.close();
                            } catch (IOException e) {
                                LOGGER.log(Level.SEVERE,
                                        "TweetWriterFile thread experienced an IO exception "
                                                + e.getMessage(),
                                        e);
                            }
                        }
                    }
                });
        LOGGER.log(Level.FINE, "TweetWriter to a file object created");
        LOGGER.log(Level.INFO,
                "TweetWriter Working Dir:{0} Outbound Dir:{1} FileSuffix:{2} BatchSize:{3} CurrentFile:{4}",
                new Object[] { workingDirectory.getAbsolutePath(),
                        this.outboundDirectory.getAbsolutePath(),
                        this.writeFileExtension, this.writeBatchSize,
                        currentFile.getAbsolutePath() });

    }

    /**
     * This method rotates the file being written to It is called when the file
     * has reached its batch size
     * 
     * @throws IOException
     */
    /**
     * @throws IOException
     */
    public synchronized void rotateFile() throws IOException {
        File oldFileName = currentFile;

        this.currentFile = File.createTempFile("Tweet", writeFileExtension,
                this.workingDirectory);
        this.currentFileSize = 0;
        bw.close();
        ow.close();
        fo.close();

        String fileNameOnly = FilenameUtils.getName(oldFileName.getName());
        Files.move(oldFileName.toPath(),
                Paths.get(outboundDirectory.toPath().toString(), fileNameOnly),
                REPLACE_EXISTING);

        fo = new FileOutputStream(currentFile.getAbsolutePath());
        ow = new OutputStreamWriter(fo, StandardCharsets.UTF_8);
        bw = new BufferedWriter(ow);

        LOGGER.log(Level.FINE,
                "Current tweet file reached max size. Moved to Outbound. New File initiated ");
        LOGGER.log(Level.INFO, "Tweet File written to Outbound Directory ");

    }

    /*
     * This method is called for writing a bunch of Tweet JSON objects
     * 
     * @see au.edu.unimelb.comp90024.TweetWriter#writeTweets(java.util.List)
     */
    /*
     * (non-Javadoc)
     * 
     * @see au.edu.unimelb.comp90024.TweetWriter#writeTweets(java.util.List)
     */
    @Override
    public synchronized void writeTweets(List<JSONObject> tweetJsons)
            throws IOException {
        LOGGER.log(Level.FINE, "Received tweet batch to Write to File");

        for (JSONObject tweet : tweetJsons) {
            if (currentFileSize >= writeBatchSize)
                rotateFile();
            bw.write(tweet.toString());
            bw.newLine();
            this.currentFileSize++;
            LOGGER.log(Level.FINEST,
                    "File Line Count at {0}, Max Line Count {1}",
                    new Object[] { currentFileSize, writeBatchSize });
        }
        bw.flush();
        ow.flush();
        fo.flush();
        LOGGER.log(Level.FINE,
                "Completed tweet batch 'Write to File' successfully");

    }

}
