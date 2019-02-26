import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../service/api/admin/admin.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-quiz-details-admin',
  templateUrl: './quiz-details-admin.component.html',
  styleUrls: ['./quiz-details-admin.component.scss'],
})
export class QuizDetailsAdminComponent implements OnInit {
  private _data: object = {};

  get data(): object {
    return this._data;
  }

  constructor(private footerBarService: FooterBarService, private adminService: AdminService, private activatedRoute: ActivatedRoute) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.adminService.getQuiz(params.id).subscribe(data => {
        this._data = data;
      });
    });
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }

}
