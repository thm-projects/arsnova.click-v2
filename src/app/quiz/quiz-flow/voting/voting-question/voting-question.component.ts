import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-voting-question',
  templateUrl: './voting-question.component.html',
  styleUrls: ['./voting-question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingQuestionComponent {
  private _showQuestion: boolean;

  get showQuestion(): boolean {
    return this._showQuestion;
  }

  @Input() set showQuestion(value: boolean) {
    this._showQuestion = value;
    this.cd.markForCheck();
  }

  private _questionText: string;

  get questionText(): string {
    return this._questionText;
  }

  @Input() set questionText(value: string) {
    this._questionText = value;
    this.cd.markForCheck();
  }

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) { }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }
}
