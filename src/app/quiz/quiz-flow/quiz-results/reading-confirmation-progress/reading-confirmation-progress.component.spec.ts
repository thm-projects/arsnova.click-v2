import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../../shared/shared.module';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';

import { ReadingConfirmationProgressComponent } from './reading-confirmation-progress.component';

describe('Quiz-Results: ReadingConfirmationComponent', () => {
  let component: ReadingConfirmationProgressComponent;
  let fixture: ComponentFixture<ReadingConfirmationProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule,
      ],
      providers: [
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, I18nService,
      ],
      declarations: [ReadingConfirmationProgressComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ReadingConfirmationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', () => {
    expect(ReadingConfirmationProgressComponent.TYPE).toEqual('ReadingConfirmationProgressComponent');
  });

  it('#sanitizeStyle', () => {
    expect(component.sanitizeStyle('20%')).toBeTruthy();
  });
});
