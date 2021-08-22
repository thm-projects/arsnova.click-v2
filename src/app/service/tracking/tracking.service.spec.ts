import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
import { ArsnovaClickAngulartics2Piwik } from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';

import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule, Angulartics2Module.forRoot(),
      ],
      providers: [
        ArsnovaClickAngulartics2Piwik, TrackingService,
      ],
    });
  }));

  it('should be created', waitForAsync(inject([TrackingService], (service: TrackingService) => {
    expect(service).toBeTruthy();
  })));
});
