import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { PipesModule } from '../../pipes/pipes.module';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { ModalOrganizerService } from '../../service/modal-organizer/modal-organizer.service';
import { UserService } from '../../service/user/user.service';
import { SharedModule } from '../../shared/shared.module';
import { KeyOutputComponent } from '../key-output/key-output.component';

import { I18nManagerOverviewComponent } from './i18n-manager-overview.component';

describe('I18nManagerOverviewComponent', () => {
  let component: I18nManagerOverviewComponent;
  let fixture: ComponentFixture<I18nManagerOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule.forRoot(), SharedModule, PipesModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        UserService, CasLoginService, FooterBarService, HeaderLabelService, ModalOrganizerService,
      ],
      declarations: [KeyOutputComponent, I18nManagerOverviewComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(I18nManagerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain a TYPE reference', () => {
    expect(I18nManagerOverviewComponent.TYPE).toEqual('I18nManagerOverviewComponent');
  });
});
