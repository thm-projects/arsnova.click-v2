import {async, inject, TestBed} from '@angular/core/testing';

import {TrackingService} from './tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('TrackingService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        Angulartics2Module.forRoot([ArsnovaClickAngulartics2Piwik]),
      ],
      providers: [
        TrackingService
      ]
    });
  }));

  it('should be created', async(inject([TrackingService], (service: TrackingService) => {
    expect(service).toBeTruthy();
  })));
});
