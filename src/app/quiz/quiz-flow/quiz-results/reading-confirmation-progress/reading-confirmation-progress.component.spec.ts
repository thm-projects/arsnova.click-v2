import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { TranslateServiceMock } from '../../../../../_mocks/TranslateServiceMock';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../../shared/shared.module';

import { ReadingConfirmationProgressComponent } from './reading-confirmation-progress.component';

describe('Quiz-Results: ReadingConfirmationComponent', () => {
  let component: ReadingConfirmationProgressComponent;
  let fixture: ComponentFixture<ReadingConfirmationProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule,
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        },
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, I18nService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [ReadingConfirmationProgressComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReadingConfirmationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', () => {
    expect(ReadingConfirmationProgressComponent.TYPE).toEqual('ReadingConfirmationProgressComponent');
  });

  it('#sanitizeStyle', () => {
    expect(component.sanitizeStyle('20%')).toBeTruthy();
  });
});
