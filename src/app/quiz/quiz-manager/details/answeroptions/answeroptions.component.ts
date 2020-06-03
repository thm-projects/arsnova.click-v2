import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { QuizPoolApiService } from '../../../../service/api/quiz-pool/quiz-pool-api.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { AbstractQuizManagerDetailsComponent } from '../abstract-quiz-manager-details.component';

@Component({
  selector: 'app-answeroptions',
  templateUrl: './answeroptions.component.html',
  styleUrls: ['./answeroptions.component.scss'],
})
export class AnsweroptionsComponent extends AbstractQuizManagerDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  public static readonly TYPE = 'AnsweroptionsComponent';

  public readonly questionType = QuestionType;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    headerLabelService: HeaderLabelService,
    quizService: QuizService,
    route: ActivatedRoute,
    footerBarService: FooterBarService,
    quizPoolApiService: QuizPoolApiService,
    router: Router,
    hotkeysService: HotkeysService,
    translate: TranslateService
  ) {
    super(platformId, quizService, headerLabelService, footerBarService, quizPoolApiService, router, route, hotkeysService, translate);

    footerBarService.TYPE_REFERENCE = AnsweroptionsComponent.TYPE;
    footerBarService.replaceFooterElements([
      footerBarService.footerElemBack,
      footerBarService.footerElemHotkeys
    ]);
  }

  public ngAfterViewInit(): void {
    this.hotkeysService.add([
      new Hotkey('esc', (): boolean => {
        this.footerBarService.footerElemBack.onClickCallback();
        return false;
      }, undefined, this.translate.instant('region.footer.footer_bar.back')),
    ]);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }
}
