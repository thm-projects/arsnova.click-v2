import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { AdminApiService } from '../../service/api/admin/admin-api.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-details-admin',
  templateUrl: './quiz-details-admin.component.html',
  styleUrls: ['./quiz-details-admin.component.scss'],
})
export class QuizDetailsAdminComponent implements OnInit {
  private _quiz: QuizEntity;

  get quiz(): QuizEntity {
    return this._quiz;
  }

  private _isSelected = 'general';

  constructor(private footerBarService: FooterBarService, private adminApiService: AdminApiService, private activatedRoute: ActivatedRoute) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.adminApiService.getQuiz(params.id).subscribe(data => {
        this._quiz = data;
      });
    });
  }

  public isSelected(type: string): boolean {
    return this._isSelected === type;
  }

  public select(type: string): void {
    this._isSelected = type;
  }

  public isSet(value: any): boolean {
    return !['undefined', 'null'].includes(typeof value);
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }

}
