import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconPathData, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { IFooterBarElement } from '../../lib/footerbar-element/interfaces';
import { INamedType } from '../../lib/interfaces/interfaces';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss'],
})
export class FooterBarComponent implements OnInit {
  public static TYPE = 'FooterBarComponent';

  public collapsedNavbar: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public footerBarService: FooterBarService,
    private quizService: QuizService,
    private trackingService: TrackingService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public getLinkTarget(elem: IFooterBarElement): Array<string> {
    return typeof elem.linkTarget === 'function' ? elem.linkTarget(elem) : //
           elem.linkTarget ? elem.linkTarget : //
           null;
  }

  public getQueryParams(elem: IFooterBarElement): object {
    return elem.queryParams;
  }

  public toggleSetting(elem: IFooterBarElement): void {
    this.footerBarService.toggleSetting(elem);
    elem.onClickCallback(elem);

    this.trackingService.trackClickEvent({
      action: this.footerBarService.TYPE_REFERENCE,
      label: `footer-${elem.id}`,
      customDimensions: {
        dimension1: elem.selectable,
        dimension2: elem.isActive,
      },
    });
  }

  public fileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    const formData: FormData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      const file: File = fileList[i];
      formData.append('uploadFiles[]', file, file.name);
    }
    this.fileUploadService.uploadFile(formData);
  }

  public ngOnInit(): void {

    this.detectCurrentRoute();

    this.router.events.subscribe((nav: any) => {
      this.detectCurrentRoute();
    });
  }

  public getIconClass(elem: IFooterBarElement): [IconPrefix, IconPathData] {
    if (elem.isLoading) {
      return ['fas', 'spinner'];
    }

    return elem.iconClass;
  }

  private detectCurrentRoute(): void {
    const currentComponent = this.fetchChildComponent(this.activatedRoute);
    this.collapsedNavbar = [
      'QuizLobbyComponent',
      'QuizResultsComponent',
      'VotingComponent',
      'LeaderboardComponent',
      'ReadingConfirmationComponent',
      'ConfidenceRateComponent',
      'QuestionDetailsComponent',
    ].includes(currentComponent ? currentComponent.TYPE : null);
  }

  private fetchChildComponent(route: ActivatedRoute): INamedType {
    return <INamedType>(
      route.firstChild ? this.fetchChildComponent(route.firstChild) : route.component
    );
  }
}
