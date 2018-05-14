#/bin/sh
java -Xms512M -Xmx768M -Xss16M -Djava.util.logging.config.file=logging.properties -cp bin/:lib/* au.edu.unimelb.comp90024.TwitterAnalytics config/configTweetStreamFileMel1.properties >logs/TweetStreamFileMel1.log 2>logs/TweetStreamFileMel1.error &
java -Xms512M -Xmx768M -Xss16M -Djava.util.logging.config.file=logging.properties -cp bin/:lib/* au.edu.unimelb.comp90024.TwitterAnalytics config/configTweetStreamFileSyd1.properties >logs/TweetStreamFileSyd1.log 2>logs/TweetStreamFileSyd1.error &
java -Xms512M -Xmx768M -Xss16M -Djava.util.logging.config.file=logging.properties -cp bin/:lib/* au.edu.unimelb.comp90024.TwitterAnalytics config/configTweetFileCouch1.properties >logs/TweetFileCouch1.log 2>logs/TweetFileCouch1.error &
java -Xms512M -Xmx768M -Xss16M -Djava.util.logging.config.file=logging.properties -cp bin/:lib/* au.edu.unimelb.comp90024.TwitterAnalytics config/configTweetSearchFileMel1.properties >logs/TweetSearchFileMel1.log 2>logs/TweetSearchFileMel1.error &
java -Xms512M -Xmx768M -Xss16M -Djava.util.logging.config.file=logging.properties -cp bin/:lib/* au.edu.unimelb.comp90024.TwitterAnalytics config/configTweetSearchFileSyd1.properties >logs/TweetSearchFileSyd1.log 2>logs/TweetSearchFileSyd1.error &
#java -Xms512M -Xmx768M -Xss16M -Djava.util.logging.config.file=logging.properties -cp bin/:lib/* au.edu.unimelb.comp90024.TwitterAnalytics config/configTweetFileFile1.properties >logs/TweetFileFile1.log 2>logs/TweetFileFile1.error &
echo "java application stack started"
