import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
import { ArsnovaClickAngulartics2Piwik } from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';

import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, Angulartics2Module.forRoot(),
      ],
      providers: [
        ArsnovaClickAngulartics2Piwik, TrackingService,
      ],
    });
  }));

  it('should be created', async(inject([TrackingService], (service: TrackingService) => {
    expect(service).toBeTruthy();
  })));
});
