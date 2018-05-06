import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';


export interface StateInfo {
  name: string;
  position: any;
}

export interface SuburbFeature {
  geometry: any;
  properties: any;
}

@Injectable({
  providedIn: 'root'
})

export class TwitteranalyticsService {

  constructor(private http: HttpClient) {}

  getStateInfo(name: string): Observable<StateInfo> {
    return this.http.get<StateInfo>('http://localhost:8000/api/states/' + name);
  }

  getAllSuburbsFeature(): Observable<SuburbFeature> {
    return this.http.get<SuburbFeature>('http://localhost:8000/api/suburbs');
  }

  getAllSuburbsFeatureByState(stateName: string): Observable<SuburbFeature> {
    return this.http.get<SuburbFeature>('http://localhost:8000/api/'+ stateName +'/suburbs');
  }

  getSuburbFeature(name: string): Observable<SuburbFeature> {
    return this.http.get<SuburbFeature>('http://localhost:8000/api/suburb/' + name);
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
