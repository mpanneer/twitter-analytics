package au.edu.unimelb.comp90024;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

import org.apache.commons.io.FilenameUtils;

/**
 * The TweetReaderFile class implements the TweetReader interface It is capable
 * of reading tweets in batches. It is also multi threaded where threads are
 * configurable This assists in scaling well for huge documents.
 * 
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class TweetReaderFile extends Thread implements TweetReader {

    private final static Logger LOGGER = Logger
            .getLogger(TweetReaderFile.class.getName());

    public static final int WORKER_THREAD_MAX_COUNT = 4;
    public static final int POST_PROCESS_BATCH_MAX_SIZE = 100;
    private static TweetReaderFile[] slaves;
    private static String currentReadFile;

    private int startPosition, finishPosition, slaveId;
    private List<String> tweetsBatch;

    private String readDirectory;// ="C:\\Users\\msatyam\\Documents\\CC\\WORKING";
    private String workingDirectory;
    private String readFileExtension;// =".txt";
    private String fileTweetState;

    private static volatile LinkedList<String> filesToBeProcessed;

    /**
     * This constructor setups the Master thread for the TweetReader from File.
     * The Master polls an inbound folder for files and initiates slaves when a
     * file is read
     * 
     * @param readDirectory
     * @param workingDirectory
     * @param readFileExtension
     * @param fileTweetState
     */
    public TweetReaderFile(String readDirectory, String workingDirectory,
            String readFileExtension, String fileTweetState) {
        super();
        this.readDirectory = readDirectory;
        this.workingDirectory = workingDirectory;
        this.readFileExtension = readFileExtension;
        this.fileTweetState = fileTweetState;

        filesToBeProcessed = new LinkedList<String>();

        LOGGER.log(Level.FINE, "TweetReader from a file object created");
        LOGGER.log(Level.INFO,
                "TweetWriter Working Dir:{0} Inbound Dir:{1} FileSuffix:{2} TweetState:{3} ",
                new Object[] { this.readDirectory, this.workingDirectory,
                        this.readFileExtension, this.fileTweetState });
    }

    /**
     * This constructor setups the Slave thread for the TweetReader from File.
     * Slave thread does the actual reading of the file
     * 
     * @param slaveId
     * @param startPosition
     * @param finishPosition
     */
    public TweetReaderFile(int slaveId, int startPosition, int finishPosition,
            String fileTweetState) {
        super();
        this.setName("Slave " + (slaveId));
        this.slaveId = slaveId;
        this.startPosition = startPosition;
        this.finishPosition = finishPosition;
        this.tweetsBatch = new ArrayList<String>();
        this.fileTweetState = fileTweetState;
    }

    /**
     * This function reads the inbound directory for files that exist already
     * and need to be processed when the app is started
     * 
     */
    public void addExistingFilesToProcess() {
        for (final File fileEntry : (new File(readDirectory)).listFiles()) {
            if (fileEntry.isFile() && fileEntry.getAbsolutePath()
                    .endsWith(readFileExtension)) {
                filesToBeProcessed.push(fileEntry.getAbsolutePath());
            }
        }
    }

    /**
     * This function starts watching an inbound folder for events like new files
     * being created
     * 
     */
    public void startWatchingFolder() {
        // define a folder root
        Path myDir = Paths.get(readDirectory);

        try {
            WatchService watcher = myDir.getFileSystem().newWatchService();
            myDir.register(watcher, StandardWatchEventKinds.ENTRY_CREATE,
                    StandardWatchEventKinds.ENTRY_DELETE,
                    StandardWatchEventKinds.ENTRY_MODIFY);

            for (;;) {
                WatchKey watckKey = watcher.take();
                Thread.sleep(300);

                Path dir = (Path) watckKey.watchable();
                for (WatchEvent<?> event : watckKey.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();

                    if (kind == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    }
                    @SuppressWarnings("unchecked")
                    WatchEvent<Path> ev = (WatchEvent<Path>) event;

                    if (ev.kind() == StandardWatchEventKinds.ENTRY_CREATE) {
                        Path fullPath = dir.resolve(ev.context());
                        String createdFile = fullPath.toAbsolutePath()
                                .toString();

                        if (createdFile.endsWith(readFileExtension))
                            filesToBeProcessed.push(createdFile);
                    }
                }
                boolean valid = watckKey.reset();
                if (!valid) {
                    break;
                }
            }

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE,
                    "Error occurred when watching Folder " + e.getMessage(), e);
        }
    }

    /**
     * This function is used by the Master thread to create slaves when a new
     * file is being processed. The slaves consume the file parallely.
     * 
     * @throws IOException
     */
    public void startSlaves() throws IOException {
        int lineCount = Util.getFileLineCount(currentReadFile);
        int workers;
        if (lineCount < WORKER_THREAD_MAX_COUNT)
            workers = lineCount;
        else
            workers = WORKER_THREAD_MAX_COUNT;

        slaves = new TweetReaderFile[workers];

        int workerBatchSize = ((lineCount + workers - 1) / workers); // Get
                                                                     // Ceiling
                                                                     // Count

        for (int i = 0; i < workers; i++) {
            int startPosition = i * workerBatchSize + 1;// Start position
            int finishPosition = (i + 1) * workerBatchSize;// Finish Position
            slaves[i] = new TweetReaderFile((i + 1), startPosition,
                    finishPosition, this.fileTweetState);
            slaves[i].start();
        }
    }

    /**
     * The master thread takes an approach of splitting each file into chunks
     * processing them and then going on to the next file. To scale up, the
     * number of slaves can be increased.
     */
    public void waitSlavesToFinish() {
        for (int i = 0; i < slaves.length; i++) {
            try {
                slaves[i].join();
            } catch (InterruptedException e) {
                LOGGER.log(Level.SEVERE,
                        "TweetReader Master Thread Interrupted when waiting "
                                + e.getMessage(),
                        e);
            }
        }

    }

    /**
     * This reader implements the code for a slave (thread) that processes part
     * of one file. This is a multi processor approach for processing huge
     * files. It makes sure huge files are not loaded into memory at one go and
     * are split into chunks
     * 
     * @throws IOException
     */
    public void processTweetFile() throws IOException {
        Stream<String> lines = Files.lines(Paths.get(currentReadFile),
                StandardCharsets.UTF_8);

        LOGGER.log(Level.FINEST,
                "Slave processing File:{0} Line start:{1} End:{2}",
                new Object[] { Paths.get(currentReadFile), startPosition,
                        finishPosition });
        try {
            lines = lines.skip(startPosition - 1)
                    .limit(finishPosition - startPosition + 1);
            lines.forEach(this::processTweetLine);
            sendPostProcessing();
        } finally {
            lines.close();
        }
    }

    /**
     * Sends the tweets to the processor
     */
    public void sendPostProcessing() {
        if (tweetsBatch.size() > 0) {
            TweetProcessor.handleTweets(tweetsBatch, fileTweetState);
            tweetsBatch = new ArrayList<String>();
            LOGGER.log(Level.FINE,
                    "Sending Tweets to TweetProcessor" + this.getName());

        }
    }

    /**
     * This function is used by the slave to stream lines one by one and send it
     * off for processing when a batch size is reached This will avoid the slave
     * loading its entire part of the file into memory
     * 
     * @param line
     */
    public void processTweetLine(String line) {
        tweetsBatch.add(line);

        if (tweetsBatch.size() >= POST_PROCESS_BATCH_MAX_SIZE)
            sendPostProcessing();
    }

    /*
     * This thread implements a TweetReader - Master or Slave
     * 
     */
    @Override
    public void run() {
        LOGGER.log(Level.FINE, "Starting Thread....." + this.getName());
        try {
            if (this.getName().startsWith("Master")) {
                while (true) {
                    if (filesToBeProcessed.size() > 0) {
                        String readFile = filesToBeProcessed.pop();
                        LOGGER.log(Level.INFO,
                                "Processing File.....{0}" + readFile);

                        File directory = new File(workingDirectory);

                        // Move to Working Directory
                        String fileNameOnly = FilenameUtils.getName(readFile);
                        Path fileAfterMove = Paths.get(
                                directory.toPath().toString(), fileNameOnly);
                        Files.move(Paths.get(readFile), fileAfterMove,
                                REPLACE_EXISTING);

                        currentReadFile = fileAfterMove.toAbsolutePath()
                                .toString();
                        startSlaves();
                        waitSlavesToFinish();
                    }
                }
            } else if (this.getName().startsWith("Slave")) {
                processTweetFile();
            }

        } catch (IOException e) {
            LOGGER.log(Level.SEVERE,
                    "Issue in TweetReaderFile " + e.getMessage(), e);
            System.exit(1);
        }
        LOGGER.log(Level.FINE, "Finishing Thread....." + this.getName());

    }

    /*
     * This function initializes the Master Object
     * 
     * @see au.edu.unimelb.comp90024.TweetReader#harvestTweets()
     */
    public void harvestTweets() {
        this.setName("Master");
        this.start();
        addExistingFilesToProcess();
        startWatchingFolder();

    }
}
