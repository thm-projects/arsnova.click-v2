import { async, TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { TOAST_CONFIG, ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { SwUpdateMock } from '../../../_mocks/_services/SwUpdateMock';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { UpdateCheckService } from './update-check.service';

describe('UpdateCheckService', () => {
  let service: UpdateCheckService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      {
        provide: SwUpdate,
        useClass: SwUpdateMock,
      }, {
        provide: TranslateService,
        useClass: TranslateServiceMock,
      }, {
        provide: TOAST_CONFIG,
        useValue: {
          default: {},
          config: {},
        },
      }, {
        provide: ToastrService,
        useValue: {
          remove: () => {},
          info: () => {
            return {
              onTap: new Subject(),
            };
          },
        },
      },
    ],
  }));

  beforeEach(() => {
    service = TestBed.get(UpdateCheckService);
    spyOn(service, 'reloadPage').and.callFake(() => {});
    spyOn(service, 'clearCache').and.callFake(() => new Promise(resolve => resolve()));
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prompt a user when a new version is available', async(() => {
    const toastService: ToastrService = TestBed.get(ToastrService);
    spyOn(toastService, 'remove').and.callFake(() => service['swUpdateToast'] = null);
    spyOn(toastService, 'info').and.callFake(() => (
      { onTap: of({}) } as any
    ));
    // @ts-ignore
    service['INTERVAL_PERIOD'] = 1;
    service['swUpdateToast'] = { toastId: 1 } as any;

    service['promptUser']({
      available: {
        appData: '',
        hash: '',
      },
      current: {
        appData: '',
        hash: '',
      },
      type: 'UPDATE_AVAILABLE',
    });

    expect(toastService.remove).toHaveBeenCalledWith(1);
    expect(toastService.info).toHaveBeenCalled();
  }));

  it('should check for updates', () => {
    service.checkForUpdates();
    expect(service).toBeTruthy();
  });

  it('should query for new updates', done => {
    const swUpdate: SwUpdate = TestBed.get(SwUpdate);
    spyOn(swUpdate, 'checkForUpdate').and.callThrough();
    service.doCheck().then(() => {
      expect(swUpdate.checkForUpdate).toHaveBeenCalled();
      done();
    });
  });
});
