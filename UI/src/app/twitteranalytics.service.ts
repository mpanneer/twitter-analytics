import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';


export interface CityInfo {
  id: string;
  position: any;
}

@Injectable({
  providedIn: 'root'
})

export class TwitteranalyticsService {

  constructor(private http: HttpClient) {}

  getCityInfo(name: string): Observable<CityInfo> {
    return this.http.get<CityInfo>('http://localhost:8000/api/city-info/' + name);
  }

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
