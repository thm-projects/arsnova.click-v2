import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { TOAST_CONFIG } from 'ngx-toastr';
import { SwUpdateMock } from '../../../_mocks/SwUpdateMock';
import { TrackingMockService } from '../tracking/tracking.mock.service';
import { UpdateCheckService } from './update-check.service';

describe('UpdateCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      {
        provide: SwUpdate,
        useClass: SwUpdateMock,
      }, {
        provide: TranslateService,
        useClass: TrackingMockService,
      }, {
        provide: TOAST_CONFIG,
        useValue: {
          default: {},
          config: {},
        },
      },
    ],
  }));

  it('should be created', () => {
    const service: UpdateCheckService = TestBed.get(UpdateCheckService);
    expect(service).toBeTruthy();
  });
});
