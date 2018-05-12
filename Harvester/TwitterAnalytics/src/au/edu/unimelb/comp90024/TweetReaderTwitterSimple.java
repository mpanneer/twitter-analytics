package au.edu.unimelb.comp90024;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.RateLimitStatus;
import twitter4j.Status;
import twitter4j.TwitterException;
import twitter4j.TwitterObjectFactory;
import twitter4j.Query.ResultType;

public class TweetReaderTwitterSimple {
	private final static Logger LOGGER = Logger.getLogger(TweetReaderTwitterSimple.class.getName());

	private static TwitterAccount[] accounts;
	private static int currentTwitterAccountIndex=0;
	
	public static void main(String[] args) {
		Configuration.loadConfig(args[0]);

/*		do 
		{
			//Grab an account to use if current account expired
			if(accountPool[currentTwitterAccountIndex].getRemainingSearchCalls() <= 0) {
				manageTwitterAccount();
				twitterAccount=getTwitterAccount();
			}

			try {
				QueryResult result;
				
				//Initialize a fresh query
				if(query == null ) {
					query = new Query(searchQuery);
					//get the recent tweets only
					query.setResultType(ResultType.recent);
					query.setCount(MAX_TWEETS_PER_SESSION);

					//Reset query with new reference
					if( originalReferenceTweetId!=Long.MAX_VALUE) {
						setQueryReferenceId(query);
					} else if (referenceDate!=null && referenceDate.trim().length()>0) {
						setQueryReferenceDate(query);
					}
					else {
						setQueryReferenceId(query);
					}
				}

				//Handle to check if currentTwitter account is still valid before query
				if(twitterAccount==null) {
					twitterAccount=getTwitterAccount();
				}

				result = twitterAccount.search(query);
				if (result!=null) {
					List<Status> tweets = result.getTweets();
					List<String> tweetJsons = new ArrayList<String>();
					Long referenceIdBeforeSearch = referenceTweetId.longValue();
					for (Status tweet : tweets) {
						String json = TwitterObjectFactory.getRawJSON(tweet);
						tweetJsons.add(json);

						//Track Reference to keep a track across sessions
						if (direction.equals("Reverse")
								&& tweet.getId() < referenceTweetId)
							referenceTweetId = tweet.getId();
						else if (direction.equals("Forward")
								&& tweet.getId() > referenceTweetId)
							referenceTweetId = tweet.getId();

					}
					
					// Reset search if we have hit our limits
					if (referenceIdBeforeSearch.equals(referenceTweetId) && query!=null) {
						this.referenceTweetId = originalReferenceTweetId;
						query.setResultType(ResultType.recent);
						query.setCount(MAX_TWEETS_PER_SESSION);
						setQueryReferenceId(query);
						continue;
					}
					
					//Handle Tweets Collected
					TweetProcessor.handleTweets(tweetJsons,
							searchQueryState);
				}
				
				if(result!=null) {
					query = result.nextQuery();
					RateLimitStatus status=result.getRateLimitStatus();
					if(status!=null) {
						Integer resetTimeEpoch=status.getResetTimeInSeconds();
						Date nextRetryTime=new Date(Long.valueOf(resetTimeEpoch.longValue())*1000);
						accountPool[currentTwitterAccountIndex].setNextRetryTime(nextRetryTime);
						accountPool[currentTwitterAccountIndex].setRemainingSearchCalls(status.getRemaining());
					}

				}
			} catch (TwitterException te) {

				if(te!=null && te.getErrorMessage().equals("Rate limit exceeded")) {
					RateLimitStatus status=te.getRateLimitStatus();
					Integer resetTimeEpoch=status.getResetTimeInSeconds();
					Date nextRetryTime=new Date(Long.valueOf(resetTimeEpoch.longValue())*1000);        		
					accountPool[currentTwitterAccountIndex].setNextRetryTime(nextRetryTime);
					accountPool[currentTwitterAccountIndex].setRemainingSearchCalls(status.getRemaining());
					continue;
				}
				System.err.println(te.getRetryAfter()+":"+te.getErrorCode()+":"+te.getErrorMessage()+":"+te.getExceptionCode()+":"+te.getMessage()+":"+te.getStatusCode());

				te.printStackTrace();
				System.err.println("Failed to search tweets: " + te.getMessage());
				System.err.println("Reference ID was :"+referenceTweetId);
				fallAsleepOnError(60);
			} catch (NullPointerException e) {
				System.err.println("Null Pointer Exception in "+this.getClass());
				System.err.println("Reference ID was :"+referenceTweetId);
				e.printStackTrace();

				fallAsleepOnError(60);
				query=null; //reset query
			} catch(Exception e) {
				System.err.println("Generic Exception in "+this.getClass());
				System.err.println("Reference ID was :"+referenceTweetId);
				System.err.println(e.getMessage());
				System.err.println(e.getStackTrace());
				fallAsleepOnError(60);
				query=null; //reset query
			}
		} while (true);
*/					
	}


	
}
