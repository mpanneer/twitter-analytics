import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;

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

  getAllSuburbsFeatureByState(stateName: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/'+ stateName +'/suburbs');
  }

  getSuburbFeature(name: string): Observable<SuburbFeature> {
    return this.http.get<SuburbFeature>(API_URL+'/api/suburb/' + name);
  }

  getSuburbDetails(state: string, suburb: string): Observable<SuburbFeature> {
    return this.http.get<SuburbFeature>(API_URL+'/api/suburb/' + state+'/'+suburb);
  }

  getTopSalarySuburbsByState(stateName: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/'+stateName+'/salary/top');
  }

  getTopIlliterateSuburbsByState(stateName: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/'+stateName+'/illiterate/top');
  }

  getTopUniStudentsSuburbsByState(stateName: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/'+stateName+'/unistudents/top');
  }

  getTopemployedSuburbsByState(stateName: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/'+stateName+'/employment/top');
  }

  getTopEmotionsSuburbsByState(stateName: string, emotion: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/'+stateName+'/emotions/'+emotion+'/top');
  }

  getSuburbEmotionsByName(stateName: string, suburbName: string): Observable<any> {
    return this.http.get<any>(API_URL+'/api/emotion/'+stateName+'/'+suburbName);
  }
}
