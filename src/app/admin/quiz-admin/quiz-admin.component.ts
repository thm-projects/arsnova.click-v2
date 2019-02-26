import { Component, OnInit } from '@angular/core';
import { QuizState } from '../../../lib/enums/QuizState';
import { AdminService } from '../../service/api/admin/admin.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-admin',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.scss'],
})
export class QuizAdminComponent implements OnInit {
  private _data: Array<object>;

  get data(): Array<object> {
    return this._data;
  }

  private _deletingElements: Array<number> = [];

  constructor(private footerBarService: FooterBarService, private adminService: AdminService) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.adminService.getAvailableQuizzes().subscribe(data => {
      this._data = data;
    });
  }

  public isActiveQuiz(quiz): boolean {
    return [QuizState.Active, QuizState.Finished, QuizState.Running].includes(quiz.state);
  }

  public isDeletingElem(index: number): boolean {
    return this._deletingElements.indexOf(index) > -1;
  }

  public deleteElem($event: Event, index: number): void {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this._deletingElements.push(index);
    this.adminService.deleteQuiz((this._data[index] as any).name || (this._data[index] as any).originalObject.name).subscribe(() => {
      this._deletingElements.splice(this._deletingElements.indexOf(index), 1);
      this._data.splice(index, 1);
    }, () => {
      this._deletingElements.splice(this._deletingElements.indexOf(index), 1);
    });
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }
}
