import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActivatedRoute} from '@angular/router';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {IQuestion} from '../../../../../lib/questions/interfaces';
import {FooterBarComponent} from '../../../../footer/footer-bar/footer-bar.component';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../../../environments/environment';
import {CurrentQuizService} from '../../../../service/current-quiz.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {parseGithubFlavoredMarkdown} from '../../../../../lib/markdown/markdown';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit, OnDestroy {
  get questionText(): SafeHtml {
    return this._questionText;
  }
  get question(): IQuestion {
    return this._question;
  }

  get questionIndex(): number {
    return this._questionIndex;
  }

  private _routerSubscription: Subscription;
  private _question: IQuestion;
  private _questionIndex: number;
  private _questionText: SafeHtml;

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
    private currentQuizService: CurrentQuizService,
    private sanitizer: DomSanitizer,
    private footerBarService: FooterBarService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack
    ]);
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      if (this.activeQuestionGroupService.activeQuestionGroup) {
        this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      } else {
        this._question = this.currentQuizService.previousQuestions[this._questionIndex];
      }
      this._questionText = this.sanitizeHTML(parseGithubFlavoredMarkdown(this._question.questionText));
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
