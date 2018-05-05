import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TwitteranalyticsService {

  constructor() { }

  tweetsPerPostcode() {
    let tweets = [];
    let tweetInfo = {}

    tweetInfo = {};
    tweetInfo['postcode'] = 'a';
    tweetInfo['tweetsCount'] = 1;
    tweets.push(tweetInfo);

    tweetInfo = {};
    tweetInfo['postcode'] = 'b';
    tweetInfo['tweetsCount'] = 2;
    tweets.push(tweetInfo);

    tweetInfo = {};
    tweetInfo['postcode'] = 'c';
    tweetInfo['tweetsCount'] = 3;
    tweets.push(tweetInfo);

    tweetInfo = {};
    tweetInfo['postcode'] = 'd';
    tweetInfo['tweetsCount'] = 4;
    tweets.push(tweetInfo);

    return tweets;
  }
}
