import { TestBed, inject } from '@angular/core/testing';

import { TwitteranalyticsService } from './twitteranalytics.service';

describe('TwitteranalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwitteranalyticsService]
    });
  });

  it('should be created', inject([TwitteranalyticsService], (service: TwitteranalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
